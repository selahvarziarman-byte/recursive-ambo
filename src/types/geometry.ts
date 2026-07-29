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
  | 'pyritohedral-diagonalization'
  | 'dualization'
  | 'invoke'
  | 'glue'
  | 'flip-glue'
  | 'collapse'
  | 'cut'
  | 'assemble'
  | 'patch-lift'
  // THICKEN (A.1 rung 1, 2026-07-18, sealed 039feb1b…82cae): the ×I product —
  // an arity-1 NON-CONSUMING birth (genealogyDag's own doctrine held the seat:
  // "once it exists, `product`"); manifest re-sealed in the same change
  | 'product'
  // REFINE'S WORD (2026-07-29): the ONE gesture that changes a form without
  // begetting a new one — a RESOLUTION, not a birth (same form, cells minted,
  // χ cannot move, nothing consumed; carrier new→old). Its trace rides
  // `ShapeGenealogy.resolution`; the genealogy DAG mints NO birth node/edge
  // for it (genealogyDag's RESOLUTION_KINDS); manifest re-sealed in the same
  // change
  | 'refine';
export type CellKind = 'seed' | 'parent' | 'core' | 'residue';
export type SeedTopology = 'tetrahedron' | 'octahedron' | 'cube';
export type CellTopology =
  | SeedTopology
  | 'cuboctahedron'
  | 'rhombicuboctahedron'
  | 'pyritohedral-icosahedron'
  | 'dodecahedron'
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
  sourceFaceId?: FaceId;
  sourceCellId?: CellId;
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
  sourceEdgeId?: EdgeId;
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
  | 'pyritohedral-split-face'
  | 'dual-face-from-vertex';

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

// REFINE'S WORD (2026-07-29): the resolution's own record, carried ON the
// form (`ShapeGenealogy.resolution`) — a type-claim 'resolution', never a
// birth trace. Defined HERE so `surfaceRefinement` (whose `RefinementRecord`
// aligns to it) imports FROM the types root and no cycle forms.
export interface ResolutionTrace {
  typeClaim: 'resolution'; // never 'lineage' — refine is not a birth
  passes: number;
  chordEdgeId: string | null; // null for a bisection-only resolution
  // the carrier surjection new→old: every new cell id → the old cell whose
  // closure contains it (old cells map to themselves)
  carrier: Record<string, string>;
}

export interface ShapeGenealogy {
  parentShapeId: ShapeId | null;
  operation: OperationKind;
  generationDepth: number;
  sourceVertexIds: VertexId[];
  createdVertexIds: VertexId[];
  createdAt: string;
  // REFINE'S WORD: present EXACTLY when this expression is a resolution
  // (operation 'refine') — the trace of the re-expression riding the form,
  // so no call site can drop the record (it is ON the shape, not beside it)
  resolution?: ResolutionTrace;
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
