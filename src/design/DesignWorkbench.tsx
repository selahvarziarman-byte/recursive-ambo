// DesignWorkbench — the `?design` live control room (dev-tooling; DEAD in prod).
//
// CONSUMPTION PATH (B) per the mandate: the committed viewports stay LITERALLY
// untouched — this is a `?design`-only instrumented scene that reuses the
// COMMITTED model builders (`immerseSurface`, `createSeedShape` — the same
// geometry, no drift) and wraps ONLY the styling in Leva controls initialized
// from `designDefaults` (the extracted committed literals — so the workbench
// opens looking exactly like the committed scenes). The fan triangulation here
// is presentation plumbing over committed models (the alternative — exporting
// PlaygroundViewport's private helpers — would diff a committed file; flagged).
//
// Instruments: Leva (pmndrs) panel — camera / lighting / material / edges /
// vertices / geometry-overlay groups; r3f-perf (pmndrs) budget overlay behind a
// toggle; the committed L2 SurfaceIdentificationOverlay mountable live (its own
// styling constants are enumerated in designDefaults; dialling them would need
// a committed edit — deferred to the ratify path, flagged).

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Leva, useControls } from 'leva';
import { Perf } from 'r3f-perf';
import type { Shape, Vec3 } from '../types/geometry';
import { immerseSurface, type ImmersedSurfaceKey } from '../lib/surfaceImmersion';
import { createSeedShape } from '../data/seeds';
import { SurfaceIdentificationOverlay } from '../components/SurfaceIdentificationOverlay';
import {
  cameraDefaults,
  geometryOverlayDefaults,
  lightingDefaults,
  materialDefaults,
} from './designDefaults';

const FORM_CHOICES = ['torus', 'klein', 'rp2', 'sphere', 'cylinder', 'mobius', 'cube-seed'] as const;
type FormChoice = (typeof FORM_CHOICES)[number];

function buildModel(form: FormChoice, resolution: number): { shape: Shape; correspondence: ReturnType<typeof immerseSurface>['correspondence'] | null } {
  if (form === 'cube-seed') {
    return { shape: createSeedShape('cube'), correspondence: null };
  }
  const immersion = immerseSurface({ surface: form as ImmersedSurfaceKey, resolution });
  return { shape: immersion.shape, correspondence: immersion.correspondence };
}

// presentation plumbing (fan triangulation + edge segments) over the committed model
function toGeometry(shape: Shape): { faces: THREE.BufferGeometry | null; edges: THREE.BufferGeometry | null; radius: number } {
  const positions: number[] = [];
  for (const face of shape.faces) {
    const cycle = face.vertexIds
      .map((id) => shape.vertices[id]?.position)
      .filter((p): p is Vec3 => Boolean(p));
    for (let k = 1; k < cycle.length - 1; k += 1) {
      positions.push(...cycle[0], ...cycle[k], ...cycle[k + 1]);
    }
  }
  const edgePositions: number[] = [];
  for (const edge of shape.edges) {
    const a = shape.vertices[edge.vertexIds[0]]?.position;
    const b = shape.vertices[edge.vertexIds[1]]?.position;
    if (a && b) edgePositions.push(...a, ...b);
  }
  const make = (data: number[]): THREE.BufferGeometry | null => {
    if (!data.length) return null;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(data, 3));
    geometry.computeVertexNormals();
    return geometry;
  };
  const radius = Math.max(
    1,
    ...Object.values(shape.vertices).map((v) => Math.hypot(v.position[0], v.position[1], v.position[2])),
  );
  return { faces: make(positions), edges: make(edgePositions), radius };
}

export default function DesignWorkbench() {
  const { form, resolution, showIdentification } = useControls('geometry / overlay', {
    form: { value: 'torus' as FormChoice, options: [...FORM_CHOICES] },
    resolution: {
      value: geometryOverlayDefaults.immersionResolution,
      min: 4,
      max: 16,
      step: 1,
      label: 'immersion R (committed default 6)',
    },
    showIdentification: { value: false, label: 'L2 identification overlay' },
  });

  const camera = useControls('camera', {
    fov: { value: cameraDefaults.fov, min: 20, max: 90, step: 1 },
    distanceFactor: { value: cameraDefaults.playground.distanceFactor, min: 1, max: 8, step: 0.1 },
  });

  const lighting = useControls('lighting', {
    background: lightingDefaults.background,
    ambient: { value: lightingDefaults.ambientIntensity, min: 0, max: 3, step: 0.01 },
    keyIntensity: { value: lightingDefaults.key.intensityPlayground, min: 0, max: 5, step: 0.01 },
    keyPosition: { value: [...lightingDefaults.key.position] as [number, number, number] },
    fillIntensity: { value: lightingDefaults.fill.intensity, min: 0, max: 3, step: 0.01 },
    fillColor: lightingDefaults.fill.color,
    grid: { value: true },
  });

  const material = useControls('material', {
    color: materialDefaults.face.color,
    opacity: { value: materialDefaults.face.opacity, min: 0, max: 1, step: 0.01 },
    roughness: { value: materialDefaults.face.roughness, min: 0, max: 1, step: 0.01 },
    metalness: { value: materialDefaults.face.metalness, min: 0, max: 1, step: 0.01 },
    wireframe: materialDefaults.face.wireframe,
    doubleSide: materialDefaults.face.doubleSide,
  });

  const edgesAndVertices = useControls('edges / vertices', {
    edgeColor: materialDefaults.edges.color,
    edgeOpacity: { value: materialDefaults.edges.opacity, min: 0, max: 1, step: 0.01 },
    showVertices: { value: true },
    vertexRadius: { value: materialDefaults.vertices.radius, min: 0.01, max: 0.3, step: 0.005 },
  });

  const perf = useControls('perf', { overlay: { value: false, label: 'r3f-perf overlay' } });

  const model = useMemo(() => buildModel(form, resolution), [form, resolution]);
  const geometry = useMemo(() => toGeometry(model.shape), [model]);
  const distance = Math.max(3.8, geometry.radius * camera.distanceFactor);

  return (
    <div style={{ position: 'absolute', inset: 0, background: lighting.background }}>
      <Leva collapsed={false} titleBar={{ title: 'design instruments' }} />
      <Canvas
        key={`${camera.fov}`} // camera fov is constructor-time — remount on change
        camera={{
          position: [distance, distance * cameraDefaults.playground.offset[1], distance],
          fov: camera.fov,
        }}
      >
        <color attach="background" args={[lighting.background]} />
        <ambientLight intensity={lighting.ambient} />
        <directionalLight position={lighting.keyPosition} intensity={lighting.keyIntensity} />
        <directionalLight
          position={[...lightingDefaults.fill.position]}
          intensity={lighting.fillIntensity}
          color={lighting.fillColor}
        />
        {lighting.grid ? (
          <gridHelper
            args={[
              lightingDefaults.grid.size,
              lightingDefaults.grid.divisions,
              lightingDefaults.grid.colorCenter,
              lightingDefaults.grid.colorGrid,
            ]}
            position={[...lightingDefaults.grid.position]}
          />
        ) : null}

        {geometry.faces ? (
          <mesh geometry={geometry.faces}>
            <meshStandardMaterial
              color={material.color}
              opacity={material.opacity}
              roughness={material.roughness}
              metalness={material.metalness}
              wireframe={material.wireframe}
              side={material.doubleSide ? THREE.DoubleSide : THREE.FrontSide}
              transparent
            />
          </mesh>
        ) : null}
        {geometry.edges ? (
          <lineSegments geometry={geometry.edges}>
            <lineBasicMaterial
              color={edgesAndVertices.edgeColor}
              transparent
              opacity={edgesAndVertices.edgeOpacity}
            />
          </lineSegments>
        ) : null}
        {edgesAndVertices.showVertices
          ? Object.values(model.shape.vertices).map((vertex) => (
              <mesh key={vertex.id} position={vertex.position}>
                <sphereGeometry args={[edgesAndVertices.vertexRadius, 20, 14]} />
                <meshStandardMaterial color={vertex.data.color} roughness={0.4} />
              </mesh>
            ))
          : null}

        {showIdentification && model.correspondence ? (
          <SurfaceIdentificationOverlay shape={model.shape} correspondence={model.correspondence} />
        ) : null}

        {perf.overlay ? <Perf position="bottom-left" /> : null}
        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          left: 12,
          bottom: 12,
          padding: '6px 10px',
          borderRadius: 6,
          background: 'rgba(12,10,9,0.88)',
          border: '1px solid #292524',
          color: '#78716c',
          fontFamily: 'monospace',
          fontSize: 11,
        }}
      >
        ?design workbench — committed models ({form}), Leva-dialled styling; defaults = the committed
        literals (designDefaults.ts). Engine untouched.
      </div>
    </div>
  );
}
