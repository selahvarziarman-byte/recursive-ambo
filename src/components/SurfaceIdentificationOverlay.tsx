// SurfaceIdentificationOverlay — L2: the identification made visible (ADR 0018).
//
// Pure presentation over an R0 surface: given `{shape, correspondence}` it draws
//   · the IDENTIFIED LOOPS — the quotient edge-classes the fundamental polygon's
//     boundary became (letter a amber, letter b fuchsia), and
//   · the HISTORIED-MERGE POINTS — the vertices where the identification landed,
//     as distinct rose spheres badged ×N (co-location ≠ identity: the point
//     visibly carries N pre-merge grid corners).
// Everything shown comes from the L2 pure selectors
// (`src/playground/identificationAnnotation.ts`) over the committed R0
// correspondence — nothing is invented here, no geometry recomputed, no field
// content (L3). `SurfaceIdentificationPreview` + `mountIdentificationPreview`
// are the dev harness for the visual check (permanent UI wiring is G5).

import { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import {
  immerseSurface,
  type ImmersedSurfaceKey,
  type QuotientCorrespondence,
} from '../lib/surfaceImmersion';
import {
  selectHistoriedMerges,
  selectIdentifiedLoops,
} from '../playground/identificationAnnotation';

const LOOP_COLORS: Record<'a' | 'b', string> = { a: '#f59e0b', b: '#e879f9' };
const MERGE_COLOR = '#f43f5e';

interface OverlayProps {
  shape: Shape;
  correspondence: QuotientCorrespondence;
}

export function SurfaceIdentificationOverlay({ shape, correspondence }: OverlayProps) {
  const merges = useMemo(() => selectHistoriedMerges(correspondence), [correspondence]);
  const loops = useMemo(() => selectIdentifiedLoops(correspondence), [correspondence]);

  const loopSegments = useMemo(() => {
    const segments: Record<'a' | 'b', [number, number, number][]> = { a: [], b: [] };
    for (const letter of ['a', 'b'] as const) {
      for (const edge of loops[letter].edges) {
        const u = shape.vertices[edge.endpoints[0]]?.position;
        const v = shape.vertices[edge.endpoints[1]]?.position;
        if (u && v) segments[letter].push([...u], [...v]);
      }
    }
    return segments;
  }, [loops, shape]);

  return (
    <group>
      {(['a', 'b'] as const).map((letter) =>
        loopSegments[letter].length ? (
          <Line
            key={letter}
            segments
            points={loopSegments[letter]}
            color={LOOP_COLORS[letter]}
            lineWidth={4}
            // always visible — on the cross-cap the identified boundary lands ON the
            // self-intersection segment and would otherwise hide under the surface
            depthTest={false}
            renderOrder={10}
          />
        ) : null,
      )}
      {merges.map((merge) => {
        const position = shape.vertices[merge.vertexId]?.position;
        if (!position) return null;
        return (
          <group key={merge.vertexId} position={position}>
            <mesh>
              <sphereGeometry args={[0.09, 18, 12]} />
              <meshStandardMaterial color={MERGE_COLOR} emissive="#881337" emissiveIntensity={0.6} roughness={0.35} />
            </mesh>
            <Html center distanceFactor={9} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  transform: 'translateY(-1.1em)',
                  padding: '1px 5px',
                  borderRadius: 6,
                  background: 'rgba(12,10,9,0.85)',
                  border: '1px solid #f43f5e',
                  color: '#fecdd3',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                }}
              >
                ×{merge.multiplicity}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// dev harness — the L2 visual check (as R0 dev-verified; permanent wiring = G5)
// ---------------------------------------------------------------------------

function computeBounds(shape: Shape): { center: Vec3; radius: number } {
  const vertices = Object.values(shape.vertices);
  const center = vertices
    .reduce<Vec3>((sum, v) => [sum[0] + v.position[0], sum[1] + v.position[1], sum[2] + v.position[2]], [0, 0, 0])
    .map((c) => c / Math.max(1, vertices.length)) as Vec3;
  const radius = Math.max(
    0.5,
    ...vertices.map((v) => Math.hypot(v.position[0] - center[0], v.position[1] - center[1], v.position[2] - center[2])),
  );
  return { center, radius };
}

interface PreviewProps {
  surface: ImmersedSurfaceKey;
  resolution?: number;
}

export function SurfaceIdentificationPreview({ surface, resolution = 16 }: PreviewProps) {
  const { shape, correspondence } = useMemo(
    () => immerseSurface({ surface, resolution }),
    [surface, resolution],
  );
  const bounds = useMemo(() => computeBounds(shape), [shape]);
  const facePositions = useMemo(() => {
    const positions: number[] = [];
    for (const face of shape.faces) {
      const cycle = face.vertexIds
        .map((id) => shape.vertices[id]?.position)
        .filter((p): p is Vec3 => Boolean(p));
      for (let k = 1; k < cycle.length - 1; k += 1) {
        positions.push(...cycle[0], ...cycle[k], ...cycle[k + 1]);
      }
    }
    return new Float32Array(positions);
  }, [shape]);
  const edgePositions = useMemo(() => {
    const positions: number[] = [];
    for (const edge of shape.edges) {
      const u = shape.vertices[edge.vertexIds[0]]?.position;
      const v = shape.vertices[edge.vertexIds[1]]?.position;
      if (u && v) positions.push(...u, ...v);
    }
    return new Float32Array(positions);
  }, [shape]);

  const distance = Math.max(3.8, bounds.radius * 2.7);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0c0a09' }}>
      <Canvas
        camera={{
          position: [bounds.center[0] + distance, bounds.center[1] + distance * 0.72, bounds.center[2] + distance],
          fov: 45,
        }}
      >
        <color attach="background" args={['#0c0a09']} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[4, 5, 3]} intensity={1.7} />
        <directionalLight position={[-3, -2, -4]} intensity={0.45} color="#67e8f9" />
        <mesh>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setAttribute('position', new THREE.BufferAttribute(facePositions, 3));
              geometry.computeVertexNormals();
            }}
          />
          <meshStandardMaterial color="#67e8f9" opacity={0.3} roughness={0.85} side={THREE.DoubleSide} transparent />
        </mesh>
        <lineSegments>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
            }}
          />
          <lineBasicMaterial color="#cffafe" transparent opacity={0.35} />
        </lineSegments>
        <SurfaceIdentificationOverlay shape={shape} correspondence={correspondence} />
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} target={bounds.center} />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          left: 12,
          top: 12,
          padding: '8px 10px',
          borderRadius: 6,
          background: 'rgba(12,10,9,0.88)',
          border: '1px solid #292524',
          color: '#d6d3d1',
          fontFamily: 'monospace',
          fontSize: 12,
          lineHeight: 1.6,
        }}
      >
        <div style={{ fontWeight: 700 }}>{surface} — identification (L2)</div>
        <div style={{ color: LOOP_COLORS.a }}>— loop a (identified boundary rows)</div>
        <div style={{ color: LOOP_COLORS.b }}>— loop b (identified boundary columns)</div>
        <div style={{ color: '#fda4af' }}>● historied merge ×N (N identified grid points)</div>
      </div>
    </div>
  );
}

// Mount the preview into a container from the dev console (Vite module graph):
//   const m = await import('/src/components/SurfaceIdentificationOverlay.tsx');
//   const off = m.mountIdentificationPreview(el, 'klein');
export function mountIdentificationPreview(
  container: HTMLElement,
  surface: ImmersedSurfaceKey,
  resolution = 16,
): () => void {
  const root = createRoot(container);
  root.render(<SurfaceIdentificationPreview surface={surface} resolution={resolution} />);
  return () => root.unmount();
}
