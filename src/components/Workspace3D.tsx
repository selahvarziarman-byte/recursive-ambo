import { OrbitControls } from '@react-three/drei';
import { Canvas, type ThreeEvent } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { useGeometryStore } from '../store/geometryStore';
import type { Cell, Face, Shape, Vertex, VertexId } from '../types/geometry';

export function Workspace3D() {
  const shape = useGeometryStore((state) => state.shapes[state.currentShapeId]);
  const cellVisibility = useGeometryStore((state) => state.cellVisibility);
  const selectVertex = useGeometryStore((state) => state.selectVertex);

  return (
    <div className="h-full min-h-[440px] w-full bg-neutral-950">
      <Canvas
        camera={{ position: [3.2, 2.4, 3.8], fov: 45 }}
        onPointerMissed={() => selectVertex(null)}
      >
        <color attach="background" args={['#0c0a09']} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[4, 5, 3]} intensity={1.7} />
        <directionalLight position={[-3, -2, -4]} intensity={0.45} color="#67e8f9" />
        <gridHelper args={[6, 12, '#57534e', '#292524']} position={[0, -1.35, 0]} />
        <Polyhedron shape={shape} cellVisibility={cellVisibility} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
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
}: {
  shape: Shape;
  cellVisibility: CellVisibility;
}) {
  const visibleCells = useMemo(
    () => shape.cells.filter((cell) => isCellVisible(cell, cellVisibility)),
    [cellVisibility, shape.cells],
  );
  const visibleVertexIds = useMemo(() => {
    const ids = new Set<VertexId>();

    visibleCells.forEach((cell) => {
      cell.vertexIds.forEach((vertexId) => ids.add(vertexId));
    });

    return ids;
  }, [visibleCells]);

  return (
    <group>
      {visibleCells.map((cell, index) => (
        <CellMesh key={cell.id} shape={shape} cell={cell} renderIndex={index} />
      ))}
      {Object.values(shape.vertices)
        .filter((vertex) => visibleVertexIds.has(vertex.id))
        .map((vertex) => (
          <VertexMarker key={vertex.id} vertex={vertex} />
        ))}
    </group>
  );
}

function CellMesh({
  shape,
  cell,
  renderIndex,
}: {
  shape: Shape;
  cell: Cell;
  renderIndex: number;
}) {
  const faces = useMemo(() => facesForCell(shape, cell), [cell, shape]);
  const faceGeometry = useMemo(() => createFaceGeometry(shape, faces), [faces, shape]);
  const edgeGeometry = useMemo(() => createEdgeGeometry(shape, faces), [faces, shape]);
  const style = cellStyle(cell);

  return (
    <group>
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
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color={style.edgeColor} transparent opacity={style.edgeOpacity} />
      </lineSegments>
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

function cellStyle(cell: Cell) {
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
      faceOpacity: 0.08,
      edgeColor: '#fafaf9',
      edgeOpacity: 0.38,
    };
  }

  return {
    faceColor: '#d6d3d1',
    faceOpacity: 0.32,
    edgeColor: '#fafaf9',
    edgeOpacity: 0.72,
  };
}
