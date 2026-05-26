import { OrbitControls } from '@react-three/drei';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { buildDualViewProxy } from '../lib/dualView';
import { type InspectionHoverTarget, useGeometryStore } from '../store/geometryStore';
import type { Cell, Face, Shape, Vec3, Vertex, VertexId } from '../types/geometry';

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

  return (
    <div className="relative h-full min-h-[440px] w-full bg-neutral-950">
      <Canvas
        camera={{ position: [3.2, 2.4, 3.8], fov: 45 }}
        onPointerMissed={() => {
          selectCell(null);
          selectVertex(null);
          setHoverTarget(null);
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
  const renderGeometry = useMemo(
    () => createCellRenderGeometry(shape, cell, dualViewEnabled),
    [cell, dualViewEnabled, shape],
  );
  const faceGeometry = useMemo(
    () => createFaceGeometry(renderGeometry.vertices, renderGeometry.faces),
    [renderGeometry],
  );
  const edgeGeometry = useMemo(
    () => createEdgeGeometry(renderGeometry.vertices, renderGeometry.faces),
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
        onClick={(event) => {
          event.stopPropagation();
          selectCell(cell.id);
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
          onHoverTarget({ kind: 'cell', cellId: cell.id });
          document.body.style.cursor = 'pointer';
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverTarget({ kind: 'cell', cellId: cell.id });
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
      <lineSegments geometry={edgeGeometry} raycast={() => null}>
        <lineBasicMaterial color={style.edgeColor} transparent opacity={style.edgeOpacity} />
      </lineSegments>
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

interface CellRenderGeometry {
  vertices: RenderVertex[];
  faces: RenderFace[];
  mode: 'original' | 'dual-proxy' | 'dual-unsupported';
  showVertexMarkers: boolean;
}

function createCellRenderGeometry(
  shape: Shape,
  cell: Cell,
  dualViewEnabled: boolean,
): CellRenderGeometry {
  if (dualViewEnabled) {
    const dualProxy = buildDualViewProxy(shape, cell);

    if (dualProxy) {
      return {
        vertices: dualProxy.vertices,
        faces: dualProxy.faces,
        mode: 'dual-proxy',
        showVertexMarkers: false,
      };
    }

    return {
      ...createOriginalRenderGeometry(shape, cell),
      mode: 'dual-unsupported',
      showVertexMarkers: false,
    };
  }

  return createOriginalRenderGeometry(shape, cell);
}

function createOriginalRenderGeometry(shape: Shape, cell: Cell): CellRenderGeometry {
  return {
    vertices: Object.values(shape.vertices).map((vertex) => ({
      id: vertex.id,
      position: vertex.position,
    })),
    faces: facesForCell(shape, cell).map((face) => ({
      id: face.id,
      vertexIds: face.vertexIds,
    })),
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

function createEdgeGeometry(vertices: RenderVertex[], faces: RenderFace[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const edgeKeys = new Set<string>();
  const vertexById = new Map(vertices.map((vertex) => [vertex.id, vertex]));

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = [a, b].sort().join('|');

      if (edgeKeys.has(key)) {
        continue;
      }

      edgeKeys.add(key);
      const vertexA = vertexById.get(a);
      const vertexB = vertexById.get(b);

      if (vertexA && vertexB) {
        positions.push(...vertexA.position, ...vertexB.position);
      }
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  return geometry;
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
  const centroids = new Map(shape.cells.map((cell) => [cell.id, cellCentroid(shape, cell)]));
  const visiting = new Set<string>();
  const explodeDistance = explodeAmount * 0.9;

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
    const parentOffset = parentCell ? offsetForCell(parentCell) : ([0, 0, 0] as Vec3);
    const parentCentroid = parentCell ? centroids.get(parentCell.id) : null;
    const cellCentroidValue = centroids.get(cell.id) ?? ([0, 0, 0] as Vec3);
    const direction = parentCentroid
      ? normalizeVec3(subtractVec3(cellCentroidValue, parentCentroid), fallbackDirection(cell.id))
      : ([0, 0, 0] as Vec3);
    const offset = addVec3(parentOffset, scaleVec3(direction, explodeDistance));

    offsets.set(cell.id, offset);
    visiting.delete(cell.id);

    return offset;
  };

  shape.cells.forEach(offsetForCell);

  return offsets;
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

function subtractVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scaleVec3([x, y, z]: Vec3, scale: number): Vec3 {
  return [x * scale, y * scale, z * scale];
}

function normalizeVec3(vector: Vec3, fallback: Vec3): Vec3 {
  const length = Math.hypot(vector[0], vector[1], vector[2]);

  if (length < 0.0001) {
    return fallback;
  }

  return scaleVec3(vector, 1 / length);
}

function fallbackDirection(cellId: string): Vec3 {
  let hash = 0;

  for (let index = 0; index < cellId.length; index += 1) {
    hash = Math.imul(hash ^ cellId.charCodeAt(index), 2654435761);
  }

  const angle = ((hash >>> 0) / 4294967295) * Math.PI * 2;
  const z = (((hash >>> 8) % 2000) / 1000 - 1) * 0.35;

  return normalizeVec3([Math.cos(angle), Math.sin(angle), z], [1, 0, 0]);
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
