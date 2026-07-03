// BornFormView — G5.2 Part B: a born form rendered as the real surface it is.
//
// Routed by the gluing WORD at the render boundary (`bornFormRouting`; the guard
// held — the engine's quotient bookkeeping stays position-blind):
//   'immersion' — the word's surface class → the R0/Part-A immersion, carrying
//                 its L2 IDENTIFICATION overlay + its FIELD (`computeFieldForShape`
//                 per the measured gate — texture where simple, Σ where a defect
//                 exists). Pure reuse: ShapeFieldView + SurfaceIdentificationOverlay.
//   'patch'     — the pre-quotient-patch display (the field-integration
//                 precedent): the parent's face(s) at source positions, corners
//                 badged to their quotient classes. Honest, never a crash,
//                 never a dot. Field-free (an unclassified quotient's complex is
//                 not recoverable here — nothing is faked).
//   'raw'       — no parent in the store: the caller keeps its primitive
//                 viewport (nothing better exists; surfaced in the label).

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import { immerseSurface } from '../lib/surfaceImmersion';
import { computeFieldForShape } from '../lib/fieldForShape';
import { ShapeFieldView } from './FieldForShapeOverlay';
import { SurfaceIdentificationOverlay } from './SurfaceIdentificationOverlay';
import { routeBornForm, type BornFormRoute } from '../playground/bornFormRouting';

// R=6: the field pipeline (committed dense GF(2) H₁ + Jacobi over the SUBDIVIDED
// complex — ~n³) runs synchronously on the UI thread; R=6 measures ~0.3s (the
// field-integration timings), R=16 would freeze the tab for minutes. The mesh
// and its field must share one complex (intensities are keyed to its sites), so
// both render at R=6. A worker/async pass for higher-R is future work (noted).
const IMMERSION_RESOLUTION = 6;

function BornImmersionView({
  title,
  surface,
}: {
  title: string;
  surface: 'torus' | 'klein' | 'rp2' | 'cylinder' | 'mobius';
}) {
  const immersion = useMemo(
    () => immerseSurface({ surface, resolution: IMMERSION_RESOLUTION }),
    [surface],
  );
  const field = useMemo(() => computeFieldForShape(immersion.shape), [immersion]);

  return (
    <ShapeFieldView
      title={`${title} → ${surface} (word-routed immersion)`}
      shape={immersion.shape}
      field={field}
    >
      <SurfaceIdentificationOverlay
        shape={immersion.shape}
        correspondence={immersion.correspondence}
      />
    </ShapeFieldView>
  );
}

function centroidOf(points: Vec3[]): Vec3 {
  const n = points.length || 1;
  const sum = points.reduce<Vec3>(
    (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
    [0, 0, 0],
  );
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

function BornPatchView({
  title,
  route,
}: {
  title: string;
  route: Extract<BornFormRoute, { kind: 'patch' }>;
}) {
  const model = useMemo(() => {
    const positions: number[] = [];
    const outline: number[] = [];
    const all: Vec3[] = [];
    for (const face of route.displayFaces) {
      const cycle = face.vertexIds.map((v) => route.parent.vertices[v].position);
      all.push(...cycle);
      for (let k = 1; k < cycle.length - 1; k += 1) {
        positions.push(...cycle[0], ...cycle[k], ...cycle[k + 1]);
      }
      for (let k = 0; k < cycle.length; k += 1) {
        outline.push(...cycle[k], ...cycle[(k + 1) % cycle.length]);
      }
    }
    const center = centroidOf(all);
    const radius = Math.max(
      0.5,
      ...all.map((p) => Math.hypot(p[0] - center[0], p[1] - center[1], p[2] - center[2])),
    );
    return {
      positions: new Float32Array(positions),
      outline: new Float32Array(outline),
      center,
      radius,
    };
  }, [route]);
  const distance = Math.max(3.2, model.radius * 3.2);
  const mergeCount = new Set(Object.values(route.vertexClassOf)).size;

  return (
    <div style={{ position: 'relative', height: '100%', minHeight: 0, background: '#0c0a09' }}>
      <Canvas
        camera={{
          position: [
            model.center[0] + distance,
            model.center[1] + distance * 0.7,
            model.center[2] + distance,
          ],
          fov: 45,
        }}
      >
        <color attach="background" args={['#0c0a09']} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[4, 5, 3]} intensity={1.4} />
        <mesh>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setAttribute('position', new THREE.BufferAttribute(model.positions, 3));
              geometry.computeVertexNormals();
            }}
          />
          <meshStandardMaterial color="#67e8f9" opacity={0.32} roughness={0.85} side={THREE.DoubleSide} transparent />
        </mesh>
        <lineSegments>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setAttribute('position', new THREE.BufferAttribute(model.outline, 3));
            }}
          />
          <lineBasicMaterial color="#cffafe" transparent opacity={0.7} />
        </lineSegments>
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} target={model.center} />
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
        <div style={{ fontWeight: 700 }}>{title} — pre-quotient patch (fallback)</div>
        <div>gluing word not in the v0 immersion map — showing the source patch</div>
        <div style={{ color: '#78716c' }}>{mergeCount} quotient classes over the patch corners</div>
      </div>
    </div>
  );
}

export interface BornFormViewProps {
  born: Shape;
  parent: Shape | null;
  fallback?: React.ReactNode; // rendered on the 'raw' route (no parent in the store)
}

export function BornFormView({ born, parent, fallback = null }: BornFormViewProps) {
  const route = useMemo(() => routeBornForm(born, parent), [born, parent]);
  if (route.kind === 'immersion') {
    return <BornImmersionView title={born.name} surface={route.surface} />;
  }
  if (route.kind === 'patch') {
    return <BornPatchView title={born.name} route={route} />;
  }
  return <>{fallback}</>;
}
