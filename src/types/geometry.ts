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
  // OPEN-LIFT (DOOR 3, 2026-08-13, sovereign-ruled Option B; SEAL_OPEN_STAR_
  // EXTRACTOR + researcher 1837): the open-star extractor's word — patch-lift's
  // lineage-carriage MINUS its closure, a lift that does NOT glue (the rim
  // stays a free boundary; no identification is performed). NON-consuming
  // (genealogyDag NON_CONSUMING, deliberately NOT GLUE_KINDS); manifest
  // re-sealed in the same change
  | 'open-lift'
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

// ═══ THE CONCEPT LAYER'S FIRST BYTES — `STAMP C-6TYPE`, sanctioned by Arman
// verbatim ("sanctioned (a)", Δ75), on the coder's own price (C-6PRICE) ═════
//
// A CORNER of the ambo HOLDS a CAST concept-space (ADR 0031 §1.1, §5; the
// mothership's ruling of the meaning question, claims §79.1: ADDITIVE — the
// corner holds a cast, and a corner without one is a TRUE ABSENCE). The cast
// is CAST OUTSIDE THE ENGINE by the mold; the engine TAKES it and never
// writes it. Nothing in this commit reads or writes either field: this is the
// type alone — no surface, no loader, no producer, no consumer.
//
// ⛔ THREE-VALUED BY CONSTRUCTION. A relation-instance is known-true,
// known-false, or UNRECORDED — and the third is the ABSENCE of a tuple from
// `relations`, never a stored token. A stored "unknown" would be a
// placeholder wearing a value (positive presence); an unlisted tuple is
// unknown, not false (MOLD v4 §2.6, §8 G2).
// ⛔ ARITY IS ANY FINITE n, carried on the signature (MOLD §8 G1 — "arity is
// two" was WITHDRAWN); `terms` is the tuple, and the signature says how long
// it must be. ⛔ AXIOMS are sentences over the signature that the engine
// CARRIES and never evaluates here. ⛔ MARKS and WARRANT are carried, NEVER
// READ — warrant is a fact about the record, and reading it as a type would
// individuate roles by how much someone read (MOLD §8 G3).
export interface ConceptRole {
  id: string;
  label?: string; // the CASTER's word for this role — never the corner's name-slot
  types?: Record<string, string | 'UNKNOWN'>; // arity-1 relations, declared per role or UNKNOWN
  marks?: PacketData; // amounts, windows, substrate-indexed facts — carried, never read
}

export interface ConceptRelationType {
  type: string;
  arity: number; // any finite n — the tuple length `terms` must have
}

export interface ConceptRelation {
  type: string;
  terms: string[]; // role ids, `arity` of them
  polarity: 'holds' | 'does-not-hold'; // the two KNOWN values; an unlisted tuple is UNRECORDED
}

export interface ConceptSpace {
  roles: ConceptRole[];
  signature: ConceptRelationType[];
  relations: ConceptRelation[];
  axioms: string[]; // quantified sentences over the signature — carried, not evaluated
  warrant?: PacketData; // substrates seen · sources · second reader — about the RECORD
}

export interface VertexDataPacket {
  label: string;
  notes: string;
  color: string;
  tags: string[];
  custom: PacketData;
  lineage?: PacketLineage;
  // C-6TYPE: the corner HOLDS a cast. OPTIONAL because the person has not
  // chosen one — a corner without a cast is a TRUE ABSENCE, never a default
  // and never a placeholder, so `createDefaultVertexData` stays untouched.
  // ⛔ Two registers side by side, never merged by the machine: `label` is the
  // person's christening (the name-slot, ADR 0029) and the cast's own roles
  // carry the CASTER's vocabulary. A loader that filled `label` from a file
  // would be the machine filling the name slot — MOLD v4 §7's first refusal.
  cast?: ConceptSpace;
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

// THE MANIFOLD RECORD (#37 GAP 1, B-2026-08-22-B, sanctioned frozen edit):
// a dropped coarse entity IS a relation, and the relation is a NAMED field —
// promoted from the opaque `data` blob (SEAL_PHASE_B_MANIFOLD's serializing
// carrier) so the committed loader can re-root what it names. `parts` and
// `sourceVertexIds` are DOORWAYS to ids the carrying shape owns — they
// prefix with the shape's own ids on a load; `id` (and each `sharedBy`
// entry on the kept twin) NAMES the dropped source-universe entity — a
// name, not a doorway, carried VERBATIM (hop-stable: nothing nests on a
// re-load). ABSENT on an entity that composes nothing (non-breaking; the
// mint is the NON-frozen subComplexLift seam, the card resolves the refs
// by exact `===`). Manifest re-sealed in the same change.
export interface ComposedRelationStamp {
  kind: 'edge' | 'face';
  id: string; // the dropped coarse entity — the record's NAME (source-universe id)
  parts: string[]; // the LIVE finer parts — this shape's own edge/face ids
  sourceVertexIds: VertexId[]; // the coarse entity's corners — this shape's own
}

// C-6TYPE — `J`, the person's identification across an edge (ADR 0031 §1.3):
// a PARTIAL ISOMORPHISM, given by the person from the candidates the device
// offers, NEVER machine-posited (the name-slot law at the fiber grain).
// ⛔ SYMMETRIC BY CONSTRUCTION: ONE record per edge, read forward as `J_e` and
// backward as `J_e⁻¹` — there is no stored reverse that could drift from its
// own inverse (0031 §6.1). ⛔ The op-set does not bend: `J` identifies ROLES
// inside the spaces the cells carry; the op-set identifies CELLS of the base.
// The tetra keeps four vertices and six edges; nothing in the geometry glues.
export interface EdgeIdentification {
  roles: Array<[string, string]>; // role of the edge's first corner ↦ role of its second
  types: Array<[string, string]>; // the relation-type identification τ, arity-preserving
  support?: Record<string, number>; // per pair: the known agreements that back it
  fiat?: string[]; // pairs the person gave with no support — marked, never hidden
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
  // THE MANIFOLD RECORD (#37 GAP 1): the composed-of stamp on every live
  // part · the shared-by record names on the kept twin
  composes?: ComposedRelationStamp;
  sharedBy?: string[];
  // C-6TYPE: the person's `J` for this edge. OPTIONAL — an edge with none has
  // NO identification, which is a STATE (the corners stand beside each other),
  // not a blank; the EMPTY `J` is a given act and a later concern of the
  // surface, not of this type.
  identification?: EdgeIdentification;
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
  // THE CONFORMAL ATOM (§2 first build, 2026-07-30, sanctioned frozen edit):
  // the per-corner angle, OWNED — index-aligned to `vertexIds` (slot k's
  // corner measures cornerAngles[k]). ABSENT until owned (non-breaking;
  // existing constructors untouched): the stamp lands on a NON-frozen seam
  // at the invocation source (regular seeds → the combinatorial (n−2)π/n,
  // never render positions), and Gauss–Bonnet seals the whole
  // (conformalAtom.ts). Manifest re-sealed in the same change.
  cornerAngles?: number[];
  role: FaceRole;
  data?: PacketData;
  lineage?: PacketLineage;
  sourceCellId?: CellId;
  sourceFaceId?: FaceId;
  sourceVertexId?: VertexId;
  // THE MANIFOLD RECORD (#37 GAP 1): the composed-of stamp on every live
  // part · the shared-by record names on the kept twin
  composes?: ComposedRelationStamp;
  sharedBy?: string[];
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
  // P4 — THE CONFORMAL DIHEDRAL (2026-07-31, sanctioned frozen edit): the
  // per-(cell,edge) dihedral angle, OWNED — KEYED by edge id (a Cell carries
  // no ordered edge list, so the carrier is a Record, not an aligned array;
  // keys must name the cell's own edges — the keyed alignment law). ABSENT
  // until owned: the stamp lands on the NON-frozen thicken seam (vertical
  // pillar v×I → the base corner θ_v lifted; horizontal e×{0,1} → the ⊥
  // product's π/2), and the LOCAL 3-D seal reads it (conformalAtom —
  // smooth 2π · honest cone ≠2π · only a non-manifold 3-edge refused).
  // Manifest re-sealed in the same change.
  dihedralAngles?: Record<EdgeId, number>;
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
