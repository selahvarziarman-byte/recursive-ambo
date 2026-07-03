import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { Face, FaceId, Shape, Vec3, VertexId } from '../types/geometry';

interface PlaygroundViewportProps {
  shape: Shape | null;
  selectedVertexId: VertexId | null;
  onSelectVertex: (vertexId: VertexId | null) => void;
  // C5 — click-to-select-face: optional so face-less callers keep today's shape.
  selectedFaceId?: FaceId | null;
  onSelectFace?: (faceId: FaceId | null) => void;
}

interface SceneBounds {
  center: Vec3;
  radius: number;
}

export function PlaygroundViewport({
  shape,
  selectedVertexId,
  onSelectVertex,
  selectedFaceId = null,
  onSelectFace,
}: PlaygroundViewportProps) {
  // C5 — one mesh PER FACE (each its own raycast target), replacing the single
  // merged face geometry: click a face → it becomes the op target.
  const faceMeshes = useMemo(() => (shape ? createPerFaceGeometries(shape) : []), [shape]);
  const edgeGeometry = useMemo(() => (shape ? createEdgeGeometry(shape) : null), [shape]);
  const bounds = useMemo(() => (shape ? computeSceneBounds(shape) : null), [shape]);

  if (!shape || !bounds) {
    return (
      <div className="grid h-full min-h-0 place-items-center bg-neutral-950 text-sm text-stone-500">
        No playground form selected.
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-0 w-full bg-neutral-950">
      <Canvas
        className="h-full w-full"
        camera={{
          position: getCameraPosition(bounds),
          fov: 45,
        }}
        onPointerMissed={() => {
          onSelectVertex(null);
          onSelectFace?.(null); // C5 — empty space deselects the face too
        }}
      >
        <color attach="background" args={['#0c0a09']} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[4, 5, 3]} intensity={1.7} />
        <directionalLight position={[-3, -2, -4]} intensity={0.45} color="#67e8f9" />
        <gridHelper args={[6, 12, '#57534e', '#292524']} position={[0, -1.35, 0]} />

        {faceMeshes.map(({ face, geometry }) => {
          const isSelected = face.id === selectedFaceId;
          return (
            <mesh
              key={face.id}
              geometry={geometry}
              onClick={(event) => {
                event.stopPropagation();
                onSelectFace?.(face.id);
              }}
              onPointerEnter={(event) => {
                if (!onSelectFace) return;
                event.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerLeave={() => {
                if (!onSelectFace) return;
                document.body.style.cursor = 'auto';
              }}
            >
              <meshStandardMaterial
                color={isSelected ? '#5eead4' : '#67e8f9'}
                opacity={isSelected ? 0.55 : 0.34}
                emissive={isSelected ? '#134e4a' : '#000000'}
                emissiveIntensity={isSelected ? 0.9 : 0}
                roughness={0.82}
                side={THREE.DoubleSide}
                transparent
              />
            </mesh>
          );
        })}
        {edgeGeometry ? (
          <lineSegments geometry={edgeGeometry} raycast={() => null}>
            <lineBasicMaterial color="#cffafe" transparent opacity={0.92} />
          </lineSegments>
        ) : null}

        {Object.values(shape.vertices).map((vertex) => {
          const isSelected = vertex.id === selectedVertexId;
          const color = isSelected ? '#f59e0b' : vertex.data.color;

          return (
            <mesh
              key={vertex.id}
              position={vertex.position}
              scale={isSelected ? 1.35 : 1}
              onClick={(event) => {
                event.stopPropagation();
                onSelectVertex(vertex.id);
              }}
              onPointerEnter={(event) => {
                event.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerLeave={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <sphereGeometry args={[0.07, 20, 14]} />
              <meshStandardMaterial
                color={color}
                emissive={isSelected ? '#92400e' : '#000000'}
                emissiveIntensity={isSelected ? 0.85 : 0}
                roughness={0.4}
              />
            </mesh>
          );
        })}

        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan
          enableRotate
          enableZoom
          maxDistance={240}
          minDistance={0.2}
          target={bounds.center}
        />
      </Canvas>
      <div className="pointer-events-none absolute left-3 top-3 rounded border border-stone-800 bg-stone-950/85 px-3 py-2 text-xs text-stone-300 shadow-lg">
        <div>
          {selectedVertexId
            ? `Selected vertex ${selectedVertexId}`
            : 'Select a vertex in the playground form'}
        </div>
        {onSelectFace ? (
          <div className={selectedFaceId ? 'text-teal-300' : 'text-stone-500'}>
            {selectedFaceId
              ? `Selected face ${selectedFaceId}`
              : 'Click a face to target it (empty space deselects)'}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// C5 — one geometry per face, so each face is its own raycast/select target.
function createPerFaceGeometries(shape: Shape): { face: Face; geometry: THREE.BufferGeometry }[] {
  const meshes: { face: Face; geometry: THREE.BufferGeometry }[] = [];
  for (const face of shape.faces) {
    const positions: number[] = [];
    appendFaceTriangles(shape, face, positions);
    if (!positions.length) continue;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    meshes.push({ face, geometry });
  }
  return meshes;
}

function appendFaceTriangles(shape: Shape, face: Face, positions: number[]): void {
  if (face.vertexIds.length < 3) {
    return;
  }

  const vertices = face.vertexIds
    .map((vertexId) => shape.vertices[vertexId]?.position)
    .filter((position): position is Vec3 => Boolean(position));

  if (vertices.length < 3) {
    return;
  }

  const [anchor] = vertices;

  for (let index = 1; index < vertices.length - 1; index += 1) {
    pushVec3(positions, anchor);
    pushVec3(positions, vertices[index]);
    pushVec3(positions, vertices[index + 1]);
  }
}

function createEdgeGeometry(shape: Shape): THREE.BufferGeometry | null {
  const positions: number[] = [];

  for (const edge of shape.edges) {
    const a = shape.vertices[edge.vertexIds[0]]?.position;
    const b = shape.vertices[edge.vertexIds[1]]?.position;

    if (!a || !b) {
      continue;
    }

    pushVec3(positions, a);
    pushVec3(positions, b);
  }

  if (!positions.length) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function computeSceneBounds(shape: Shape): SceneBounds {
  const vertices = Object.values(shape.vertices);

  if (!vertices.length) {
    return { center: [0, 0, 0], radius: 1 };
  }

  const center = scaleVec3(
    vertices.reduce<Vec3>(
      (sum, vertex) => addVec3(sum, vertex.position),
      [0, 0, 0],
    ),
    1 / vertices.length,
  );
  const radius = Math.max(
    0.5,
    ...vertices.map((vertex) => lengthVec3(subtractVec3(vertex.position, center))),
  );

  return { center, radius };
}

function getCameraPosition(bounds: SceneBounds): Vec3 {
  const distance = Math.max(3.8, bounds.radius * 3.2);

  return [
    bounds.center[0] + distance,
    bounds.center[1] + distance * 0.72,
    bounds.center[2] + distance,
  ];
}

function pushVec3(target: number[], vector: Vec3): void {
  target.push(vector[0], vector[1], vector[2]);
}

function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtractVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scaleVec3([x, y, z]: Vec3, scale: number): Vec3 {
  return [x * scale, y * scale, z * scale];
}

function lengthVec3(vector: Vec3): number {
  return Math.hypot(vector[0], vector[1], vector[2]);
}
