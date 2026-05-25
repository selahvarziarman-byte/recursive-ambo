import { OrbitControls } from '@react-three/drei';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { useGeometryStore } from '../store/geometryStore';
import type { Cell, Face, Shape, Vec3, Vertex, VertexId } from '../types/geometry';

export function Workspace3D() {
  const shape = useGeometryStore((state) => state.shapes[state.currentShapeId]);
  const cellVisibility = useGeometryStore((state) => state.cellVisibility);
  const explodeAmount = useGeometryStore((state) => state.viewLayout.explodeAmount);
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectCell = useGeometryStore((state) => state.selectCell);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null);
  const hoveredCell = hoveredCellId
    ? shape.cells.find((cell) => cell.id === hoveredCellId) ?? null
    : null;

  return (
    <div className="relative h-full min-h-[440px] w-full bg-neutral-950">
      <Canvas
        camera={{ position: [3.2, 2.4, 3.8], fov: 45 }}
        onPointerMissed={() => {
          selectCell(null);
          selectVertex(null);
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
          selectedCellId={selectedCellId}
          hoveredCellId={hoveredCellId}
          onHoverCell={setHoveredCellId}
        />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
      <div className="pointer-events-none absolute left-3 top-3 rounded border border-stone-800 bg-stone-950/85 px-3 py-2 text-xs text-stone-300 shadow-lg">
        {hoveredCell
          ? `Hovering ${hoveredCell.kind} cell, generation ${hoveredCell.generationDepth}`
          : 'Hover a cell to preview selection'}
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
  selectedCellId,
  hoveredCellId,
  onHoverCell,
}: {
  shape: Shape;
  cellVisibility: CellVisibility;
  explodeAmount: number;
  selectedCellId: string | null;
  hoveredCellId: string | null;
  onHoverCell: (cellId: string | null) => void;
}) {
  const visibleCells = useMemo(
    () => shape.cells.filter((cell) => isCellVisible(cell, cellVisibility)),
    [cellVisibility, shape.cells],
  );
  const displayOffsets = useMemo(
    () => computeCellDisplayOffsets(shape, explodeAmount),
    [explodeAmount, shape],
  );

  return (
    <group>
      {visibleCells.map((cell, index) => (
        <CellMesh
          key={cell.id}
          shape={shape}
          cell={cell}
          isSelected={cell.id === selectedCellId}
          isHovered={cell.id === hoveredCellId}
          onHoverCell={onHoverCell}
          displayOffset={displayOffsets.get(cell.id) ?? [0, 0, 0]}
          explodeAmount={explodeAmount}
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
  onHoverCell,
  displayOffset,
  explodeAmount,
  renderIndex,
}: {
  shape: Shape;
  cell: Cell;
  isSelected: boolean;
  isHovered: boolean;
  onHoverCell: (cellId: string | null) => void;
  displayOffset: Vec3;
  explodeAmount: number;
  renderIndex: number;
}) {
  const selectCell = useGeometryStore((state) => state.selectCell);
  const faces = useMemo(() => facesForCell(shape, cell), [cell, shape]);
  const faceGeometry = useMemo(() => createFaceGeometry(shape, faces), [faces, shape]);
  const edgeGeometry = useMemo(() => createEdgeGeometry(shape, faces), [faces, shape]);
  const style = cellStyle(cell, isSelected, isHovered, explodeAmount);

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
          polygonOffsetFactor={-renderIndex * 0.25}
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
          onHoverCell(cell.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHoverCell(cell.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHoverCell(null);
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
      {cell.vertexIds.map((vertexId) => {
        const vertex = shape.vertices[vertexId];

        return vertex ? <VertexMarker key={`${cell.id}:${vertex.id}`} vertex={vertex} /> : null;
      })}
    </group>
  );
}

function VertexMarker({ vertex }: { vertex: Vertex }) {
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedVertexId === vertex.id;
  const scale = isSelected ? 1.35 : isHovered ? 1.18 : 1;

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
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setIsHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[0.075, 24, 16]} />
      <meshStandardMaterial
        color={isSelected ? '#f59e0b' : vertex.data.color}
        emissive={isSelected ? '#92400e' : '#000000'}
        emissiveIntensity={isSelected ? 0.55 : 0}
        roughness={0.45}
      />
    </mesh>
  );
}

function createFaceGeometry(shape: Shape, faces: Face[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const indices: number[] = [];
  const vertexIndex = new Map<string, number>();

  Object.values(shape.vertices).forEach((vertex, index) => {
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

function createEdgeGeometry(shape: Shape, faces: Face[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const edgeKeys = new Set<string>();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = [a, b].sort().join('|');

      if (edgeKeys.has(key)) {
        continue;
      }

      edgeKeys.add(key);
      const vertexA = shape.vertices[a];
      const vertexB = shape.vertices[b];

      if (vertexA && vertexB) {
        positions.push(...vertexA.position, ...vertexB.position);
      }
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  return geometry;
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

function cellStyle(cell: Cell, isSelected: boolean, isHovered: boolean, explodeAmount: number) {
  if (isSelected) {
    return {
      faceColor: '#f59e0b',
      faceOpacity: cell.kind === 'parent' ? 0.16 : 0.42,
      edgeColor: '#fef3c7',
      edgeOpacity: 1,
    };
  }

  if (isHovered) {
    return {
      faceColor: '#fcd34d',
      faceOpacity: cell.kind === 'parent' ? 0.14 : 0.4,
      edgeColor: '#fef3c7',
      edgeOpacity: 0.98,
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
