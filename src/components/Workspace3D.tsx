import { OrbitControls } from '@react-three/drei';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import {
  buildDualUniverseRenderGeometry,
  createDualEdgeInspectionTarget,
  createDualFaceInspectionTarget,
  type DualUniverseRenderGeometry,
} from '../lib/dualView';
import { type InspectionHoverTarget, useGeometryStore } from '../store/geometryStore';
import type { Cell, Edge, Face, Shape, Vec3, Vertex, VertexId } from '../types/geometry';

export function Workspace3D() {
  const shape = useGeometryStore((state) => state.shapes[state.currentShapeId]);
  const cellVisibility = useGeometryStore((state) => state.cellVisibility);
  const explodeAmount = useGeometryStore((state) => state.viewLayout.explodeAmount);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const isolateSelectedCell = useGeometryStore((state) => state.viewLayout.isolateSelectedCell);
  const hoverTarget = useGeometryStore((state) => state.hoverTarget);
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectCell = useGeometryStore((state) => state.selectCell);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const clearDualInspectionTarget = useGeometryStore((state) => state.clearDualInspectionTarget);

  return (
    <div className="relative h-full min-h-[440px] w-full bg-neutral-950">
      <Canvas
        camera={{ position: [3.2, 2.4, 3.8], fov: 45 }}
        onPointerMissed={() => {
          selectCell(null);
          selectVertex(null);
          setHoverTarget(null);
          clearDualInspectionTarget();
        }}
      >
        <color attach="background" args={['#0c0a09']} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[4, 5, 3]} intensity={1.7} />
        <directionalLight position={[-3, -2, -4]} intensity={0.45} color="#67e8f9" />
        <gridHelper args={[6, 12, '#57534e', '#292524']} position={[0, -1.35, 0]} />
        <Polyhedron
          shape={shape}
          cellVisibility={cellVisibility}
          explodeAmount={explodeAmount}
          dualViewEnabled={dualViewEnabled}
          isolateSelectedCell={isolateSelectedCell}
          selectedCellId={selectedCellId}
          hoverTarget={hoverTarget}
          onHoverTarget={setHoverTarget}
        />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
      <div className="pointer-events-none absolute left-3 top-3 rounded border border-stone-800 bg-stone-950/85 px-3 py-2 text-xs text-stone-300 shadow-lg">
        {formatHoverStatus(shape, hoverTarget)}
      </div>
    </div>
  );
}

interface CellVisibility {
  showCoreCells: boolean;
  showResidueCells: boolean;
  showParentCells: boolean;
}

function Polyhedron({
  shape,
  cellVisibility,
  explodeAmount,
  dualViewEnabled,
  isolateSelectedCell,
  selectedCellId,
  hoverTarget,
  onHoverTarget,
}: {
  shape: Shape;
  cellVisibility: CellVisibility;
  explodeAmount: number;
  dualViewEnabled: boolean;
  isolateSelectedCell: boolean;
  selectedCellId: string | null;
  hoverTarget: InspectionHoverTarget | null;
  onHoverTarget: (target: InspectionHoverTarget | null) => void;
}) {
  const visibleCells = useMemo(
    () => shape.cells.filter((cell) => isCellVisible(cell, cellVisibility)),
    [cellVisibility, shape.cells],
  );
  const displayOffsets = useMemo(
    () => computeCellDisplayOffsets(shape, explodeAmount),
    [explodeAmount, shape],
  );
  const vertexGenerations = useMemo(() => getVertexGenerations(shape), [shape]);

  return (
    <group>
      {visibleCells.map((cell, index) => (
        <CellMesh
          key={cell.id}
          shape={shape}
          cell={cell}
          isSelected={cell.id === selectedCellId}
          isHovered={isCellHoverTarget(hoverTarget, cell.id)}
          isDimmed={isolateSelectedCell && Boolean(selectedCellId) && cell.id !== selectedCellId}
          hoverTarget={hoverTarget}
          onHoverTarget={onHoverTarget}
          vertexGenerations={vertexGenerations}
          displayOffset={displayOffsets.get(cell.id) ?? [0, 0, 0]}
          explodeAmount={explodeAmount}
          dualViewEnabled={dualViewEnabled}
          renderIndex={index}
        />
      ))}
    </group>
  );
}

function CellMesh({
  shape,
  cell,
  isSelected,
  isHovered,
  isDimmed,
  hoverTarget,
  onHoverTarget,
  vertexGenerations,
  displayOffset,
  explodeAmount,
  dualViewEnabled,
  renderIndex,
}: {
  shape: Shape;
  cell: Cell;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  hoverTarget: InspectionHoverTarget | null;
  onHoverTarget: (target: InspectionHoverTarget | null) => void;
  vertexGenerations: Map<VertexId, number>;
  displayOffset: Vec3;
  explodeAmount: number;
  dualViewEnabled: boolean;
  renderIndex: number;
}) {
  const selectCell = useGeometryStore((state) => state.selectCell);
  const clearDualInspectionTarget = useGeometryStore((state) => state.clearDualInspectionTarget);
  const setDualInspectionTarget = useGeometryStore((state) => state.setDualInspectionTarget);
  const renderGeometry = useMemo(
    () => createCellRenderGeometry(shape, cell, dualViewEnabled),
    [cell, dualViewEnabled, shape],
  );
  const faceGeometry = useMemo(
    () => createFaceGeometry(renderGeometry.vertices, renderGeometry.faces),
    [renderGeometry],
  );
  const edgeGeometry = useMemo(
    () =>
      createEdgeGeometry(
        renderGeometry.vertices,
        renderGeometry.edges,
        (edge) => edge.role !== 'construction-diagonal',
      ),
    [renderGeometry],
  );
  const constructionDiagonalGeometry = useMemo(
    () =>
      createEdgeGeometry(
        renderGeometry.vertices,
        renderGeometry.edges,
        (edge) => edge.role === 'construction-diagonal',
      ),
    [renderGeometry],
  );
  const hoverFaceGeometry = useMemo(
    () => createHoverFaceGeometry(renderGeometry, hoverTarget),
    [hoverTarget, renderGeometry],
  );
  const hoverEdgeGeometry = useMemo(
    () => createHoverEdgeGeometry(renderGeometry, hoverTarget),
    [hoverTarget, renderGeometry],
  );
  const usesSemanticDualInspectionTargets =
    renderGeometry.dualUniverse?.kind === 'semantic-model';
  const style = cellStyle(
    cell,
    isSelected,
    isHovered,
    isDimmed,
    explodeAmount,
    renderGeometry.mode,
  );

  return (
    <group position={displayOffset}>
      <mesh geometry={faceGeometry}>
        <meshStandardMaterial
          color={style.faceColor}
          opacity={style.faceOpacity}
          roughness={0.82}
          side={THREE.DoubleSide}
          transparent
          polygonOffset
          polygonOffsetFactor={1 + renderIndex * 0.25}
          polygonOffsetUnits={1}
        />
      </mesh>
      <mesh
        geometry={faceGeometry}
        onPointerDown={(event) => {
          if (!usesSemanticDualInspectionTargets) {
            return;
          }

          event.stopPropagation();
          const target = createSemanticDualFaceTargetFromEvent(renderGeometry, event.faceIndex);

          if (target) {
            setDualInspectionTarget(target);
          }
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (usesSemanticDualInspectionTargets) {
            return;
          }

          clearDualInspectionTarget();
          selectCell(cell.id);
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
          if (!usesSemanticDualInspectionTargets) {
            onHoverTarget({ kind: 'cell', cellId: cell.id });
          }
          document.body.style.cursor = 'pointer';
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          if (!usesSemanticDualInspectionTargets) {
            onHoverTarget({ kind: 'cell', cellId: cell.id });
          }
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHoverTarget(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshBasicMaterial
          color="#ffffff"
          depthWrite={false}
          opacity={0.01}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      {edgeGeometry ? (
        <lineSegments geometry={edgeGeometry} raycast={() => null}>
          <lineBasicMaterial color={style.edgeColor} transparent opacity={style.edgeOpacity} />
        </lineSegments>
      ) : null}
      {constructionDiagonalGeometry ? (
        <lineSegments geometry={constructionDiagonalGeometry} raycast={() => null}>
          <lineBasicMaterial color="#fb7185" transparent opacity={Math.max(style.edgeOpacity, 0.92)} />
        </lineSegments>
      ) : null}
      {hoverFaceGeometry ? (
        <mesh geometry={hoverFaceGeometry} raycast={() => null}>
          <meshBasicMaterial
            color="#facc15"
            depthWrite={false}
            opacity={0.34}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      ) : null}
      {hoverEdgeGeometry ? (
        <lineSegments geometry={hoverEdgeGeometry} raycast={() => null}>
          <lineBasicMaterial color="#fb923c" transparent opacity={1} />
        </lineSegments>
      ) : null}
      {renderGeometry.dualUniverse?.kind === 'semantic-model' ? (
        <SemanticDualInspectionTargets renderGeometry={renderGeometry} />
      ) : null}
      {renderGeometry.showVertexMarkers
        ? cell.vertexIds.map((vertexId) => {
            const vertex = shape.vertices[vertexId];

            return vertex ? (
              <VertexMarker
                key={`${cell.id}:${vertex.id}`}
                vertex={vertex}
                vertexGeneration={vertexGenerations.get(vertex.id) ?? 0}
                cellIsSelected={isSelected}
                cellIsHovered={isHovered}
                isDimmed={isDimmed}
              />
            ) : null;
          })
        : null}
    </group>
  );
}

function VertexMarker({
  vertex,
  vertexGeneration,
  cellIsSelected,
  cellIsHovered,
  isDimmed,
}: {
  vertex: Vertex;
  vertexGeneration: number;
  cellIsSelected: boolean;
  cellIsHovered: boolean;
  isDimmed: boolean;
}) {
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const hoverTarget = useGeometryStore((state) => state.hoverTarget);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const isSelected = selectedVertexId === vertex.id;
  const isHovered = isVertexHoverTarget(hoverTarget, vertex.id);
  const scale = getVertexMarkerScale(vertexGeneration, {
    isSelected,
    isHovered,
    cellIsSelected,
    cellIsHovered,
  });
  const opacity = isDimmed && !isSelected && !isHovered ? 0.28 : 1;
  const markerColor = isSelected
    ? '#f59e0b'
    : isHovered
      ? '#facc15'
      : cellIsSelected
        ? '#fef3c7'
        : vertex.data.color;
  const emissiveColor = isSelected || isHovered ? '#92400e' : cellIsSelected ? '#78350f' : '#000000';
  const emissiveIntensity = isSelected ? 0.85 : isHovered ? 0.7 : cellIsSelected ? 0.35 : 0;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectVertex(vertex.id);
  };

  return (
    <mesh
      position={vertex.position}
      scale={scale}
      onClick={handleClick}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHoverTarget({ kind: 'vertex', vertexId: vertex.id });
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHoverTarget(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[0.075, 24, 16]} />
      <meshStandardMaterial
        color={markerColor}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        opacity={opacity}
        roughness={0.45}
        transparent={opacity < 1}
      />
    </mesh>
  );
}

interface RenderVertex {
  id: string;
  position: Vec3;
}

interface RenderFace {
  id: string;
  vertexIds: string[];
}

interface RenderEdge {
  id?: string;
  vertexIds: [string, string];
  role?: Edge['role'];
  sourceEdgeId?: Edge['sourceEdgeId'];
  sourceCellId?: Edge['sourceCellId'];
}

interface CellRenderGeometry {
  vertices: RenderVertex[];
  faces: RenderFace[];
  edges: RenderEdge[];
  mode: 'original' | 'dual-proxy' | 'dual-unsupported';
  topology?: string;
  showVertexMarkers: boolean;
  dualUniverse?: DualUniverseRenderGeometry;
}

function SemanticDualInspectionTargets({
  renderGeometry,
}: {
  renderGeometry: CellRenderGeometry;
}) {
  const setDualInspectionTarget = useGeometryStore((state) => state.setDualInspectionTarget);
  const semanticRenderGeometry =
    renderGeometry.dualUniverse?.kind === 'semantic-model' ? renderGeometry.dualUniverse : null;
  const vertexById = useMemo(
    () => new Map(renderGeometry.vertices.map((vertex) => [vertex.id, vertex])),
    [renderGeometry.vertices],
  );

  if (!semanticRenderGeometry) {
    return null;
  }

  const semanticModel = semanticRenderGeometry.viewModel.semanticModel;

  return (
    <>
      {renderGeometry.faces.map((face) => {
        const target = createDualFaceInspectionTarget(semanticModel, face.id);

        return target ? (
          <SemanticDualFaceInspectionTarget
            key={`dual-face-hit:${face.id}`}
            face={face}
            renderGeometry={renderGeometry}
            onInspect={() => setDualInspectionTarget(target)}
          />
        ) : null;
      })}
      {renderGeometry.edges.map((edge) => {
        const target = edge.id
          ? createDualEdgeInspectionTarget(semanticModel, edge.id)
          : null;

        return target ? (
          <SemanticDualEdgeInspectionTarget
            key={`dual-edge-hit:${edge.id}`}
            edge={edge}
            vertexById={vertexById}
            onInspect={() => setDualInspectionTarget(target)}
          />
        ) : null;
      })}
    </>
  );
}

function SemanticDualFaceInspectionTarget({
  face,
  renderGeometry,
  onInspect,
}: {
  face: RenderFace;
  renderGeometry: CellRenderGeometry;
  onInspect: () => void;
}) {
  const geometry = useMemo(
    () => createFaceGeometry(renderGeometry.vertices, [face]),
    [face, renderGeometry.vertices],
  );

  return (
    <mesh
      geometry={geometry}
      onPointerDown={(event) => {
        event.stopPropagation();
        onInspect();
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <meshBasicMaterial
        color="#ffffff"
        depthWrite={false}
        opacity={0.001}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}

function SemanticDualEdgeInspectionTarget({
  edge,
  vertexById,
  onInspect,
}: {
  edge: RenderEdge;
  vertexById: Map<string, RenderVertex>;
  onInspect: () => void;
}) {
  const transform = useMemo(() => {
    const vertexA = vertexById.get(edge.vertexIds[0]);
    const vertexB = vertexById.get(edge.vertexIds[1]);

    if (!vertexA || !vertexB) {
      return null;
    }

    const start = new THREE.Vector3(...vertexA.position);
    const end = new THREE.Vector3(...vertexB.position);
    const direction = end.clone().sub(start);
    const length = direction.length();

    if (length < 0.0001) {
      return null;
    }

    return {
      length,
      position: start.add(end).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      ),
    };
  }, [edge.vertexIds, vertexById]);

  if (!transform) {
    return null;
  }

  return (
    <mesh
      position={transform.position}
      quaternion={transform.quaternion}
      onPointerDown={(event) => {
        event.stopPropagation();
        onInspect();
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <cylinderGeometry args={[0.035, 0.035, transform.length, 8, 1]} />
      <meshBasicMaterial color="#ffffff" depthWrite={false} opacity={0.001} transparent />
    </mesh>
  );
}

function createSemanticDualFaceTargetFromEvent(
  renderGeometry: CellRenderGeometry,
  faceIndex: number | null | undefined,
) {
  const semanticRenderGeometry =
    renderGeometry.dualUniverse?.kind === 'semantic-model' ? renderGeometry.dualUniverse : null;

  if (!semanticRenderGeometry || faceIndex == null) {
    return null;
  }

  const face = getRenderFaceForTriangleIndex(renderGeometry.faces, faceIndex);

  return face
    ? createDualFaceInspectionTarget(semanticRenderGeometry.viewModel.semanticModel, face.id)
    : null;
}

function getRenderFaceForTriangleIndex(
  faces: RenderFace[],
  triangleIndex: number,
): RenderFace | null {
  let firstTriangleIndex = 0;

  for (const face of faces) {
    const triangleCount = Math.max(0, face.vertexIds.length - 2);

    if (triangleIndex >= firstTriangleIndex && triangleIndex < firstTriangleIndex + triangleCount) {
      return face;
    }

    firstTriangleIndex += triangleCount;
  }

  return null;
}

function createCellRenderGeometry(
  shape: Shape,
  cell: Cell,
  dualViewEnabled: boolean,
): CellRenderGeometry {
  if (dualViewEnabled) {
    const dualRenderGeometry = buildDualUniverseRenderGeometry(shape, cell);

    if (
      dualRenderGeometry.kind === 'legacy-proxy' ||
      dualRenderGeometry.kind === 'semantic-model'
    ) {
      return {
        vertices: dualRenderGeometry.vertices,
        faces: dualRenderGeometry.faces,
        edges: dualRenderGeometry.edges,
        mode: 'dual-proxy',
        topology: dualRenderGeometry.topology,
        showVertexMarkers: false,
        dualUniverse: dualRenderGeometry,
      };
    }

    return {
      ...createOriginalRenderGeometry(shape, cell),
      mode: 'dual-unsupported',
      showVertexMarkers: false,
      dualUniverse: dualRenderGeometry,
    };
  }

  return createOriginalRenderGeometry(shape, cell);
}

function createOriginalRenderGeometry(shape: Shape, cell: Cell): CellRenderGeometry {
  const faces = facesForCell(shape, cell).map((face) => ({
    id: face.id,
    vertexIds: face.vertexIds,
  }));

  return {
    vertices: Object.values(shape.vertices).map((vertex) => ({
      id: vertex.id,
      position: vertex.position,
    })),
    faces,
    edges: edgesForCell(shape, faces),
    mode: 'original',
    showVertexMarkers: true,
  };
}

function createFaceGeometry(vertices: RenderVertex[], faces: RenderFace[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const indices: number[] = [];
  const vertexIndex = new Map<string, number>();

  vertices.forEach((vertex, index) => {
    vertexIndex.set(vertex.id, index);
    positions.push(...vertex.position);
  });

  for (const face of faces) {
    if (face.vertexIds.length < 3) {
      continue;
    }

    const base = vertexIndex.get(face.vertexIds[0]);

    if (base === undefined) {
      continue;
    }

    for (let index = 1; index < face.vertexIds.length - 1; index += 1) {
      const b = vertexIndex.get(face.vertexIds[index]);
      const c = vertexIndex.get(face.vertexIds[index + 1]);

      if (b !== undefined && c !== undefined) {
        indices.push(base, b, c);
      }
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function createEdgeGeometry(
  vertices: RenderVertex[],
  edges: RenderEdge[],
  includeEdge: (edge: RenderEdge) => boolean,
): THREE.BufferGeometry | null {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const vertexById = new Map(vertices.map((vertex) => [vertex.id, vertex]));

  for (const edge of edges) {
    if (!includeEdge(edge)) {
      continue;
    }

    const [a, b] = edge.vertexIds;
    const vertexA = vertexById.get(a);
    const vertexB = vertexById.get(b);

    if (vertexA && vertexB) {
      positions.push(...vertexA.position, ...vertexB.position);
    }
  }

  if (!positions.length) {
    return null;
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  return geometry;
}

function edgesForCell(shape: Shape, faces: RenderFace[]): RenderEdge[] {
  const shapeEdgesByKey = new Map(shape.edges.map((edge) => [renderEdgeKey(edge.vertexIds), edge]));

  return edgesForRenderFaces(faces).map((edge) => ({
    ...edge,
    role: shapeEdgesByKey.get(renderEdgeKey(edge.vertexIds))?.role,
  }));
}

function edgesForRenderFaces(faces: RenderFace[]): RenderEdge[] {
  const edges = new Map<string, RenderEdge>();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = renderEdgeKey([a, b]);

      if (!edges.has(key)) {
        edges.set(key, { vertexIds: [a, b] });
      }
    }
  }

  return Array.from(edges.values());
}

function renderEdgeKey([a, b]: [string, string]): string {
  return [a, b].sort().join('|');
}

function createHoverFaceGeometry(
  renderGeometry: CellRenderGeometry,
  hoverTarget: InspectionHoverTarget | null,
): THREE.BufferGeometry | null {
  if (hoverTarget?.kind !== 'face') {
    return null;
  }

  const face = renderGeometry.faces.find((candidate) => candidate.id === hoverTarget.faceId);

  return face ? createFaceGeometry(renderGeometry.vertices, [face]) : null;
}

function createHoverEdgeGeometry(
  renderGeometry: CellRenderGeometry,
  hoverTarget: InspectionHoverTarget | null,
): THREE.BufferGeometry | null {
  if (hoverTarget?.kind !== 'edge') {
    return null;
  }

  const [a, b] = hoverTarget.vertexIds;

  if (!facesContainEdge(renderGeometry.faces, a, b)) {
    return null;
  }

  const vertexById = new Map(renderGeometry.vertices.map((vertex) => [vertex.id, vertex]));
  const vertexA = vertexById.get(a);
  const vertexB = vertexById.get(b);

  if (!vertexA || !vertexB) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([...vertexA.position, ...vertexB.position], 3),
  );

  return geometry;
}

function facesContainEdge(faces: RenderFace[], a: string, b: string): boolean {
  return faces.some((face) =>
    face.vertexIds.some((vertexId, index) => {
      const nextVertexId = face.vertexIds[(index + 1) % face.vertexIds.length];

      return (vertexId === a && nextVertexId === b) || (vertexId === b && nextVertexId === a);
    }),
  );
}

function getVertexGenerations(shape: Shape): Map<VertexId, number> {
  const cache = new Map<VertexId, number>();
  const visiting = new Set<VertexId>();
  const fallbackGenerations = getContainingCellGenerationFallbacks(shape);

  const resolveGeneration = (vertexId: VertexId): number => {
    const cached = cache.get(vertexId);

    if (cached !== undefined) {
      return cached;
    }

    if (visiting.has(vertexId)) {
      return fallbackGenerations.get(vertexId) ?? 0;
    }

    const vertex = shape.vertices[vertexId];

    if (!vertex) {
      return fallbackGenerations.get(vertexId) ?? 0;
    }

    if (vertex.createdBy.operation === 'seed') {
      cache.set(vertexId, 0);
      return 0;
    }

    visiting.add(vertexId);

    const sourceVertexIds = getVertexSourceIds(vertex);
    const sourceGenerations = sourceVertexIds
      .filter((sourceVertexId) => sourceVertexId !== vertexId && shape.vertices[sourceVertexId])
      .map(resolveGeneration);
    const generation = sourceGenerations.length
      ? Math.max(...sourceGenerations) + 1
      : fallbackGenerations.get(vertexId) ?? 0;

    visiting.delete(vertexId);
    cache.set(vertexId, generation);

    return generation;
  };

  Object.keys(shape.vertices).forEach((vertexId) => resolveGeneration(vertexId));

  return cache;
}

function getVertexSourceIds(vertex: Vertex): VertexId[] {
  if (vertex.createdBy.sourceVertexIds.length) {
    return vertex.createdBy.sourceVertexIds;
  }

  return (
    vertex.data.lineage?.sources
      .filter((source) => source.kind === 'vertex')
      .map((source) => source.id) ?? []
  );
}

function getContainingCellGenerationFallbacks(shape: Shape): Map<VertexId, number> {
  const generations = new Map<VertexId, number>();

  for (const cell of shape.cells) {
    for (const vertexId of cell.vertexIds) {
      const existing = generations.get(vertexId);

      if (existing === undefined || cell.generationDepth < existing) {
        generations.set(vertexId, cell.generationDepth);
      }
    }
  }

  return generations;
}

function getVertexMarkerScale(
  generation: number,
  {
    isSelected,
    isHovered,
    cellIsSelected,
    cellIsHovered,
  }: {
    isSelected: boolean;
    isHovered: boolean;
    cellIsSelected: boolean;
    cellIsHovered: boolean;
  },
): number {
  const baseScale = getVertexGenerationScale(generation);
  const emphasisScale = isSelected
    ? 1.8
    : isHovered
      ? 1.45
      : cellIsSelected
        ? 1.18
        : cellIsHovered
          ? 1.1
          : 1;
  const minimumScale = isSelected ? 0.72 : isHovered ? 0.58 : 0;

  return Math.max(baseScale * emphasisScale, minimumScale);
}

function getVertexGenerationScale(generation: number): number {
  if (generation <= 0) {
    return 1;
  }

  if (generation === 1) {
    return 0.75;
  }

  if (generation === 2) {
    return 0.56;
  }

  if (generation === 3) {
    return 0.42;
  }

  return 0.34;
}

function facesForCell(shape: Shape, cell: Cell): Face[] {
  const faceIds = new Set(cell.faceIds);

  return shape.faces.filter((face) => faceIds.has(face.id));
}

function isCellVisible(cell: Cell, visibility: CellVisibility): boolean {
  if (cell.kind === 'core') {
    return visibility.showCoreCells;
  }

  if (cell.kind === 'residue') {
    return visibility.showResidueCells;
  }

  if (cell.kind === 'parent') {
    return visibility.showParentCells;
  }

  return true;
}

function computeCellDisplayOffsets(shape: Shape, explodeAmount: number): Map<string, Vec3> {
  const offsets = new Map<string, Vec3>();

  if (explodeAmount <= 0) {
    shape.cells.forEach((cell) => offsets.set(cell.id, [0, 0, 0]));
    return offsets;
  }

  const cellById = new Map(shape.cells.map((cell) => [cell.id, cell]));
  const metrics = computeCellLayoutMetrics(shape);
  const childrenByParent = buildChildrenByParent(shape);
  const visiting = new Set<string>();

  const offsetForCell = (cell: Cell): Vec3 => {
    const existing = offsets.get(cell.id);

    if (existing) {
      return existing;
    }

    if (visiting.has(cell.id)) {
      return [0, 0, 0];
    }

    visiting.add(cell.id);

    const parentCell = cell.parentCellId ? cellById.get(cell.parentCellId) : null;

    if (!parentCell) {
      offsets.set(cell.id, [0, 0, 0]);
      visiting.delete(cell.id);
      return [0, 0, 0];
    }

    const parentOffset = offsetForCell(parentCell);
    const siblings = childrenByParent.get(parentCell.id) ?? [cell];
    const siblingDirections = computeSiblingLayoutDirections(parentCell, siblings, metrics);
    const direction =
      siblingDirections.get(cell.id) ?? fallbackDirection(`${parentCell.id}:${cell.id}`);
    const distance = computeExplodeDistance(
      parentCell,
      cell,
      siblings.length,
      metrics,
      explodeAmount,
    );
    const offset = addVec3(parentOffset, scaleVec3(direction, distance));

    offsets.set(cell.id, offset);
    visiting.delete(cell.id);

    return offset;
  };

  shape.cells.forEach(offsetForCell);

  return offsets;
}

interface CellLayoutMetric {
  centroid: Vec3;
  radius: number;
}

interface SiblingDirection {
  cell: Cell;
  direction: Vec3;
  anchorDirection: Vec3;
  fallbackDirection: Vec3;
  hasCentroidDirection: boolean;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const MIN_LAYOUT_RADIUS = 0.04;

function computeCellLayoutMetrics(shape: Shape): Map<string, CellLayoutMetric> {
  return new Map(
    shape.cells.map((cell) => {
      const centroid = cellCentroid(shape, cell);

      return [
        cell.id,
        {
          centroid,
          radius: cellRadius(shape, cell, centroid),
        },
      ];
    }),
  );
}

function buildChildrenByParent(shape: Shape): Map<string, Cell[]> {
  const childrenByParent = new Map<string, Cell[]>();

  for (const cell of shape.cells) {
    if (!cell.parentCellId) {
      continue;
    }

    childrenByParent.set(cell.parentCellId, [
      ...(childrenByParent.get(cell.parentCellId) ?? []),
      cell,
    ]);
  }

  for (const children of childrenByParent.values()) {
    children.sort(compareCellsForLayout);
  }

  return childrenByParent;
}

function computeSiblingLayoutDirections(
  parentCell: Cell,
  siblings: Cell[],
  metrics: Map<string, CellLayoutMetric>,
): Map<string, Vec3> {
  const orderedSiblings = [...siblings].sort(compareCellsForLayout);
  const parentMetric = getCellLayoutMetric(metrics, parentCell);
  const initialDirections = orderedSiblings.map<SiblingDirection>((cell, index) => {
    const cellMetric = getCellLayoutMetric(metrics, cell);
    const centroidDelta = subtractVec3(cellMetric.centroid, parentMetric.centroid);
    const centroidDistance = lengthVec3(centroidDelta);
    const usefulDirectionDistance = Math.max(
      0.0001,
      Math.max(parentMetric.radius, cellMetric.radius, MIN_LAYOUT_RADIUS) * 0.025,
    );
    const fallback = siblingFallbackDirection(parentCell, cell, index, orderedSiblings.length);
    const hasCentroidDirection = centroidDistance > usefulDirectionDistance;
    const direction = hasCentroidDirection
      ? scaleVec3(centroidDelta, 1 / centroidDistance)
      : fallback;

    return {
      cell,
      direction,
      anchorDirection: direction,
      fallbackDirection: fallback,
      hasCentroidDirection,
    };
  });

  return new Map(
    spreadSiblingDirections(initialDirections).map(({ cell, direction }) => [cell.id, direction]),
  );
}

function spreadSiblingDirections(directions: SiblingDirection[]): SiblingDirection[] {
  if (directions.length <= 1) {
    return directions;
  }

  const minimumDot = Math.cos(minimumSiblingAngle(directions.length));
  const spreadDirections = directions.map((entry) => ({
    ...entry,
    direction: normalizeVec3(entry.direction, entry.fallbackDirection),
  }));

  for (let iteration = 0; iteration < 10; iteration += 1) {
    for (let aIndex = 0; aIndex < spreadDirections.length; aIndex += 1) {
      for (let bIndex = aIndex + 1; bIndex < spreadDirections.length; bIndex += 1) {
        const a = spreadDirections[aIndex];
        const b = spreadDirections[bIndex];
        const dot = dotVec3(a.direction, b.direction);

        if (dot <= minimumDot) {
          continue;
        }

        const pushStrength = Math.min(0.42, (dot - minimumDot) * 0.5);
        const pairSeed = `${a.cell.id}:${b.cell.id}:${iteration}`;
        const pushA = tangentAwayDirection(
          a.direction,
          b.direction,
          fallbackDirection(`spread:${pairSeed}:a`),
        );
        const pushB = tangentAwayDirection(
          b.direction,
          a.direction,
          scaleVec3(pushA, -1),
        );

        a.direction = normalizeVec3(
          addVec3(a.direction, scaleVec3(pushA, pushStrength)),
          a.fallbackDirection,
        );
        b.direction = normalizeVec3(
          addVec3(b.direction, scaleVec3(pushB, pushStrength)),
          b.fallbackDirection,
        );
      }
    }

    for (const entry of spreadDirections) {
      if (!entry.hasCentroidDirection) {
        continue;
      }

      entry.direction = normalizeVec3(
        addVec3(scaleVec3(entry.direction, 0.975), scaleVec3(entry.anchorDirection, 0.025)),
        entry.fallbackDirection,
      );
    }
  }

  return spreadDirections;
}

function computeExplodeDistance(
  parentCell: Cell,
  cell: Cell,
  siblingCount: number,
  metrics: Map<string, CellLayoutMetric>,
  explodeAmount: number,
): number {
  const parentRadius = Math.max(getCellLayoutMetric(metrics, parentCell).radius, MIN_LAYOUT_RADIUS);
  const cellRadiusValue = Math.max(getCellLayoutMetric(metrics, cell).radius, MIN_LAYOUT_RADIUS);
  const generationDepth = Math.max(0, cell.generationDepth);
  const siblingPressure = Math.sqrt(Math.max(0, siblingCount - 1));
  const radiusClearance = parentRadius * 0.32 + cellRadiusValue * 0.95;
  const siblingClearance = Math.max(parentRadius, cellRadiusValue) * 0.11 * siblingPressure;
  const generationClearance = (parentRadius + cellRadiusValue) * 0.08 * generationDepth;
  const generationScale = 1 + generationDepth * 0.18;
  const siblingScale = 1 + Math.log2(Math.max(1, siblingCount)) * 0.1;
  const kindScale = cell.kind === 'core' ? 1.06 : 1;

  return (
    explodeAmount *
    (radiusClearance + siblingClearance + generationClearance) *
    generationScale *
    siblingScale *
    kindScale
  );
}

function getCellLayoutMetric(
  metrics: Map<string, CellLayoutMetric>,
  cell: Cell,
): CellLayoutMetric {
  return metrics.get(cell.id) ?? { centroid: [0, 0, 0], radius: 0 };
}

function cellCentroid(shape: Shape, cell: Cell): Vec3 {
  const positions = cell.vertexIds
    .map((vertexId) => shape.vertices[vertexId]?.position)
    .filter((position): position is Vec3 => Boolean(position));

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

  return scaleVec3(sum, 1 / positions.length);
}

function cellRadius(shape: Shape, cell: Cell, centroid: Vec3): number {
  return cell.vertexIds.reduce((radius, vertexId) => {
    const position = shape.vertices[vertexId]?.position;

    if (!position) {
      return radius;
    }

    return Math.max(radius, lengthVec3(subtractVec3(position, centroid)));
  }, 0);
}

function compareCellsForLayout(a: Cell, b: Cell): number {
  return (
    a.generationDepth - b.generationDepth ||
    cellKindLayoutOrder(a) - cellKindLayoutOrder(b) ||
    (a.topology ?? '').localeCompare(b.topology ?? '') ||
    a.id.localeCompare(b.id)
  );
}

function cellKindLayoutOrder(cell: Cell): number {
  if (cell.kind === 'core') {
    return 0;
  }

  if (cell.kind === 'residue') {
    return 1;
  }

  if (cell.kind === 'parent') {
    return 2;
  }

  return 3;
}

function siblingFallbackDirection(
  parentCell: Cell,
  cell: Cell,
  index: number,
  siblingCount: number,
): Vec3 {
  if (siblingCount <= 1) {
    return fallbackDirection(`${parentCell.id}:${cell.id}`);
  }

  const seed = `${parentCell.id}:${cell.id}:${index}:${siblingCount}`;
  const z = 1 - (2 * (index + 0.5)) / siblingCount;
  const radius = Math.sqrt(Math.max(0, 1 - z * z));
  const angle = index * GOLDEN_ANGLE + stableAngle(seed);

  return normalizeVec3(
    [Math.cos(angle) * radius, z, Math.sin(angle) * radius],
    fallbackDirection(seed),
  );
}

function minimumSiblingAngle(siblingCount: number): number {
  if (siblingCount <= 2) {
    return Math.PI / 3;
  }

  return Math.max(Math.PI / 9, Math.min(Math.PI / 2.4, 2.1 / Math.sqrt(siblingCount)));
}

function tangentAwayDirection(direction: Vec3, awayFrom: Vec3, fallback: Vec3): Vec3 {
  const projected = subtractVec3(direction, scaleVec3(awayFrom, dotVec3(direction, awayFrom)));

  return normalizeVec3(projected, perpendicularDirection(direction, fallback));
}

function perpendicularDirection(axis: Vec3, fallback: Vec3): Vec3 {
  const axisUnit = normalizeVec3(axis, [1, 0, 0]);
  const projected = subtractVec3(fallback, scaleVec3(axisUnit, dotVec3(fallback, axisUnit)));

  return normalizeVec3(projected, Math.abs(axisUnit[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0]);
}

function subtractVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scaleVec3([x, y, z]: Vec3, scale: number): Vec3 {
  return [x * scale, y * scale, z * scale];
}

function lengthVec3(vector: Vec3): number {
  return Math.hypot(vector[0], vector[1], vector[2]);
}

function dotVec3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalizeVec3(vector: Vec3, fallback: Vec3): Vec3 {
  const length = lengthVec3(vector);

  if (length < 0.0001) {
    const fallbackLength = lengthVec3(fallback);

    return fallbackLength < 0.0001 ? [1, 0, 0] : scaleVec3(fallback, 1 / fallbackLength);
  }

  return scaleVec3(vector, 1 / length);
}

function stableAngle(seed: string): number {
  return (hashString(seed) / 4294967295) * Math.PI * 2;
}

function fallbackDirection(seed: string): Vec3 {
  const hash = hashString(seed);
  const angle = (hash / 4294967295) * Math.PI * 2;
  const z = (((hash >>> 8) % 2000) / 1000 - 1) * 0.35;

  return normalizeVec3([Math.cos(angle), Math.sin(angle), z], [1, 0, 0]);
}

function hashString(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 2654435761);
  }

  return hash >>> 0;
}

function isCellHoverTarget(target: InspectionHoverTarget | null, cellId: string): boolean {
  return target?.kind === 'cell' && target.cellId === cellId;
}

function isVertexHoverTarget(target: InspectionHoverTarget | null, vertexId: string): boolean {
  if (!target) {
    return false;
  }

  if (target.kind === 'vertex') {
    return target.vertexId === vertexId;
  }

  return target.kind === 'edge' && target.vertexIds.includes(vertexId);
}

function formatHoverStatus(shape: Shape, target: InspectionHoverTarget | null): string {
  if (!target) {
    return 'Hover a cell or inspector row to preview correspondence';
  }

  if (target.kind === 'cell') {
    const cell = shape.cells.find((candidate) => candidate.id === target.cellId);

    return cell
      ? `Hovering ${cell.kind} cell, generation ${cell.generationDepth}`
      : 'Hovering cell';
  }

  if (target.kind === 'vertex') {
    return `Hovering vertex ${shortenSceneId(target.vertexId)}`;
  }

  if (target.kind === 'edge') {
    return `Hovering edge ${shortenSceneId(target.vertexIds[0])} - ${shortenSceneId(
      target.vertexIds[1],
    )}`;
  }

  return `Hovering face ${shortenSceneId(target.faceId)}`;
}

function shortenSceneId(id: string): string {
  return id.length > 30 ? `${id.slice(0, 14)}...${id.slice(-8)}` : id;
}

function cellStyle(
  cell: Cell,
  isSelected: boolean,
  isHovered: boolean,
  isDimmed: boolean,
  explodeAmount: number,
  mode: CellRenderGeometry['mode'],
) {
  if (isSelected) {
    return {
      faceColor: mode === 'dual-proxy' ? '#c084fc' : '#f59e0b',
      faceOpacity: cell.kind === 'parent' ? 0.16 : 0.42,
      edgeColor: mode === 'dual-proxy' ? '#f5d0fe' : '#fef3c7',
      edgeOpacity: 1,
    };
  }

  if (isHovered) {
    return {
      faceColor: mode === 'dual-proxy' ? '#d8b4fe' : '#fcd34d',
      faceOpacity: cell.kind === 'parent' ? 0.14 : 0.4,
      edgeColor: mode === 'dual-proxy' ? '#f5d0fe' : '#fef3c7',
      edgeOpacity: 0.98,
    };
  }

  if (isDimmed) {
    return {
      faceColor: mode === 'dual-proxy' ? '#6d28d9' : '#57534e',
      faceOpacity: 0.045,
      edgeColor: mode === 'dual-proxy' ? '#c4b5fd' : '#a8a29e',
      edgeOpacity: 0.14,
    };
  }

  if (mode === 'dual-proxy') {
    return {
      faceColor: '#c084fc',
      faceOpacity: 0.34,
      edgeColor: '#f5d0fe',
      edgeOpacity: 0.9,
    };
  }

  if (mode === 'dual-unsupported') {
    return {
      faceColor: '#78716c',
      faceOpacity: cell.kind === 'parent' ? 0.04 : 0.12,
      edgeColor: '#d6d3d1',
      edgeOpacity: 0.32,
    };
  }

  if (cell.kind === 'core') {
    return {
      faceColor: '#67e8f9',
      faceOpacity: 0.36,
      edgeColor: '#cffafe',
      edgeOpacity: 0.9,
    };
  }

  if (cell.kind === 'residue') {
    return {
      faceColor: '#fbbf24',
      faceOpacity: 0.28,
      edgeColor: '#fde68a',
      edgeOpacity: 0.82,
    };
  }

  if (cell.kind === 'parent') {
    return {
      faceColor: '#a8a29e',
      faceOpacity: explodeAmount > 0 ? 0.035 : 0.08,
      edgeColor: '#fafaf9',
      edgeOpacity: explodeAmount > 0 ? 0.18 : 0.38,
    };
  }

  return {
    faceColor: '#d6d3d1',
    faceOpacity: 0.32,
    edgeColor: '#fafaf9',
    edgeOpacity: 0.72,
  };
}
