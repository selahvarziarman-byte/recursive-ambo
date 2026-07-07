// Stories — the key forms in isolation (dev-only fixtures over COMMITTED builders).
//
// torus / Klein / RP² render as their committed R0 immersions inside a bare R3F
// canvas (the decorator); genus-2 renders through the COMMITTED born-form route
// (the octagon quotient has no immersion — the honest patch view IS its render);
// the 3-torus is a LEVEL-3 complex with NO 2-complex render at all — its story
// shows the fundamental cube plus the LIVE invariant tower readout (committed
// level3InvariantTower), honestly labelled. No engine/render edit anywhere.

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Meta, StoryObj } from '@storybook/react';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../../types/geometry';
import { immerseSurface, type ImmersedSurfaceKey } from '../../lib/surfaceImmersion';
import { loadForm } from '../../lib/multiform';
import { nGon } from '../../playground/primitiveCatalogue';
import { glueFace } from '../../lib/surfaceOperations';
import { materializeSurfaceResult } from '../../lib/materializeOperation';
import { BornFormView } from '../../components/BornFormView';
import { createSeedShape } from '../../data/seeds';
import { readSeedCell, glueFaces, type FacePairing } from '../../lib/faceIdentification';
import { level3InvariantTower } from '../../lib/level3Invariants';
import { lightingDefaults, materialDefaults } from '../designDefaults';

// --- presentation plumbing over committed models (same as the workbench) ---
function ShapeScene({ shape }: { shape: Shape }) {
  const positions: number[] = [];
  for (const face of shape.faces) {
    const cycle = face.vertexIds
      .map((id) => shape.vertices[id]?.position)
      .filter((p): p is Vec3 => Boolean(p));
    for (let k = 1; k < cycle.length - 1; k += 1) positions.push(...cycle[0], ...cycle[k], ...cycle[k + 1]);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={materialDefaults.face.color}
        opacity={materialDefaults.face.opacity}
        roughness={materialDefaults.face.roughness}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}

function FormCanvas({ shape, distance = 8 }: { shape: Shape; distance?: number }) {
  return (
    <div style={{ height: '100vh', background: lightingDefaults.background }}>
      <Canvas camera={{ position: [distance, distance * 0.72, distance], fov: 45 }}>
        <color attach="background" args={[lightingDefaults.background]} />
        <ambientLight intensity={lightingDefaults.ambientIntensity} />
        <directionalLight position={[...lightingDefaults.key.position]} intensity={lightingDefaults.key.intensityPlayground} />
        <directionalLight position={[...lightingDefaults.fill.position]} intensity={lightingDefaults.fill.intensity} color={lightingDefaults.fill.color} />
        <ShapeScene shape={shape} />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

const meta: Meta = { title: 'forms' };
export default meta;

export const Torus: StoryObj = {
  render: () => <FormCanvas shape={immerseSurface({ surface: 'torus', resolution: 8 }).shape} />,
};
export const KleinBottle: StoryObj = {
  render: () => <FormCanvas shape={immerseSurface({ surface: 'klein', resolution: 8 }).shape} />,
};
export const RP2CrossCap: StoryObj = {
  render: () => <FormCanvas shape={immerseSurface({ surface: 'rp2' as ImmersedSurfaceKey, resolution: 8 }).shape} />,
};

// genus-2: the octagon quotient (committed ops) through the COMMITTED born-form
// route — no immersion exists for the abABcdCD word; the patch view is honest.
function Genus2Story() {
  const parent = loadForm(nGon(8), 'sb');
  const face = parent.faces[0];
  const trace = glueFace(parent, face, [
    { edgeA: 0, edgeB: 2, mode: 'preserving' },
    { edgeA: 1, edgeB: 3, mode: 'preserving' },
    { edgeA: 4, edgeB: 6, mode: 'preserving' },
    { edgeA: 5, edgeB: 7, mode: 'preserving' },
  ]);
  const born = materializeSurfaceResult(parent, face, trace).shape;
  return (
    <div style={{ height: '100vh', background: lightingDefaults.background }}>
      <BornFormView born={born} parent={parent} fallback={null} />
    </div>
  );
}
export const Genus2Octagon: StoryObj = { render: () => <Genus2Story /> };

// the 3-torus: a LEVEL-3 complex — no 2-complex render exists; show the
// fundamental cube + the LIVE committed invariant-tower readout.
function ThreeTorusStory() {
  const cubeShape = createSeedShape('cube');
  const cube = readSeedCell(cubeShape);
  const positionOf = new Map(Object.values(cubeShape.vertices).map((v) => [v.id, v.position]));
  const translationMap = (faceA: { cycle: string[] }, faceB: { cycle: string[] }, axis: number) => {
    const map: Record<string, string> = {};
    const targets = faceB.cycle.map((id) => ({ id, p: positionOf.get(id) as Vec3 }));
    for (const u of faceA.cycle) {
      const p = positionOf.get(u) as Vec3;
      const want = [0, 1, 2].map((i) => (i === axis ? p[i] + 2 : p[i]));
      map[u] = (targets.find((t) => t.p.every((x, i) => x === want[i])) as { id: string }).id;
    }
    return map;
  };
  const face = (key: string) => cube.faces.find((f) => f.id === `face:cube:${key}`) as { id: string; cycle: string[] };
  const pattern: FacePairing[] = [
    { faceA: face('left').id, faceB: face('right').id, mode: 'preserving', map: translationMap(face('left'), face('right'), 0) },
    { faceA: face('front').id, faceB: face('back').id, mode: 'preserving', map: translationMap(face('front'), face('back'), 1) },
    { faceA: face('bottom').id, faceB: face('top').id, mode: 'preserving', map: translationMap(face('bottom'), face('top'), 2) },
  ];
  const tower = level3InvariantTower(glueFaces(cube, pattern));
  return (
    <div style={{ height: '100vh', background: lightingDefaults.background, position: 'relative' }}>
      <FormCanvas shape={cubeShape} distance={5} />
      <div
        style={{
          position: 'absolute',
          left: 12,
          top: 12,
          padding: '10px 12px',
          borderRadius: 6,
          background: 'rgba(12,10,9,0.9)',
          border: '1px solid #292524',
          color: '#d6d3d1',
          fontFamily: 'monospace',
          fontSize: 12,
          lineHeight: 1.7,
        }}
      >
        <div style={{ fontWeight: 700 }}>the 3-TORUS (level-3 — no surface render exists; the fundamental cube shown)</div>
        <div>χ = {tower.chi} (consistent: {String(tower.chiConsistent)}) · S²-gate {tower.sound ? 'PASS' : 'FAIL'}</div>
        <div>w₁ = {tower.w1.w1} ({tower.orientable ? 'orientable' : 'non-orientable'})</div>
        <div>
          H₀={tower.homology.H0.pretty} · H₁={tower.homology.H1.pretty} · H₂={tower.homology.H2.pretty} · H₃={tower.homology.H3.pretty}
        </div>
        <div style={{ color: '#78716c' }}>{tower.piAbelianization.label}</div>
      </div>
    </div>
  );
}
export const ThreeTorusLevel3: StoryObj = { render: () => <ThreeTorusStory /> };
