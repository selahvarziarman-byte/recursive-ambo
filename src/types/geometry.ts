export type Vec3 = [number, number, number];
export type ShapeId = string;
export type CellId = string;
export type GenerationId = string;
export type VertexId = string;
export type FaceId = string;
export type EdgeId = string;
export type SeedKey = string;

export type OperationKind =
  | 'seed'
  | 'ambo'
  | 'ambo-dissection'
  | 'pyritohedral-diagonalization';
export type CellKind = 'seed' | 'parent' | 'core' | 'residue';
export type SeedTopology = 'tetrahedron' | 'octahedron' | 'cube';
export type CellTopology =
  | SeedTopology
  | 'cuboctahedron'
  | 'rhombicuboctahedron'
  | 'pyritohedral-icosahedron'
  | 'rectified-square-pyramid'
  | 'rectified-square-pyramid-ambo-core'
  | 'rectified-square-pyramid-ambo-core-ambo-core'
  | 'square-pyramid'
  | 'unknown';

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export type PacketData = Record<string, JsonValue>;
export type PacketHostKind = 'vertex' | 'edge' | 'face' | 'cell';
export type EdgeRole = 'boundary' | 'construction-diagonal';

export type PacketInheritanceMode =
  | 'preserved'
  | 'derived-from-vertex'
  | 'derived-from-edge'
  | 'derived-from-face'
  | 'derived-from-cell'
  | 'composite'
  | 'default';

export interface PacketSourceRef {
  kind: PacketHostKind;
  id: string;
  role?: string;
}

export interface PacketLineage {
  inheritanceMode: PacketInheritanceMode;
  sources: PacketSourceRef[];
  operationId?: string;
}

export interface VertexDataPacket {
  label: string;
  notes: string;
  color: string;
  tags: string[];
  custom: PacketData;
  lineage?: PacketLineage;
}

export interface VertexCreation {
  shapeId: ShapeId;
  operation: OperationKind;
  sourceVertexIds: VertexId[];
  sourceEdgeId?: EdgeId;
}

export interface Vertex {
  id: VertexId;
  position: Vec3;
  data: VertexDataPacket;
  createdBy: VertexCreation;
}

export interface Edge {
  id: EdgeId;
  vertexIds: [VertexId, VertexId];
  sourceVertexIds: [VertexId, VertexId];
  role?: EdgeRole;
  sourceFaceId?: FaceId;
  sourceCellId?: CellId;
  lineage?: PacketLineage;
  data?: PacketData;
}

export type FaceRole =
  | 'seed-face'
  | 'ambo-face-from-face'
  | 'ambo-face-from-vertex'
  | 'dissection-core-face'
  | 'dissection-residue-face'
  | 'parent-cell-face'
  | 'pyritohedral-preserved-face'
  | 'pyritohedral-split-face';

export interface Face {
  id: FaceId;
  vertexIds: VertexId[];
  role: FaceRole;
  data?: PacketData;
  lineage?: PacketLineage;
  sourceCellId?: CellId;
  sourceFaceId?: FaceId;
  sourceVertexId?: VertexId;
}

export interface ShapeGenealogy {
  parentShapeId: ShapeId | null;
  operation: OperationKind;
  generationDepth: number;
  sourceVertexIds: VertexId[];
  createdVertexIds: VertexId[];
  createdAt: string;
}

export interface Cell {
  id: CellId;
  kind: CellKind;
  topology?: CellTopology;
  generationDepth: number;
  parentCellId: CellId | null;
  sourceOperation: OperationKind;
  vertexIds: VertexId[];
  faceIds: FaceId[];
  sourceVertexIds: VertexId[];
  sourceEdgeIds: EdgeId[];
  preservedVertexId?: VertexId;
  data?: PacketData;
  lineage?: PacketLineage;
}

export interface Generation {
  id: GenerationId;
  depth: number;
  sourceOperation: OperationKind;
  parentShapeId: ShapeId | null;
  parentCellIds: CellId[];
  createdCellIds: CellId[];
  createdVertexIds: VertexId[];
  createdAt: string;
}

export interface Shape {
  id: ShapeId;
  name: string;
  seedKey?: SeedKey;
  vertices: Record<VertexId, Vertex>;
  edges: Edge[];
  faces: Face[];
  cells: Cell[];
  generations: Generation[];
  genealogy: ShapeGenealogy;
}

export interface SeedVertexDefinition {
  key: string;
  position: Vec3;
  label: string;
  color?: string;
}

export interface SeedFaceDefinition {
  key: string;
  vertexKeys: string[];
}

export interface SeedDefinition {
  key: SeedKey;
  label: string;
  description: string;
  topology: SeedTopology;
  vertices: SeedVertexDefinition[];
  faces: SeedFaceDefinition[];
}
