// RichFieldOverlay — L3b: the rich field shown AS CONTENT (ADR 0018 / ADR 0017 Amd-2).
//
// The canonical eigenmode's |ψ|² lights the form's surface — BRIGHT at antinodes,
// DARK at nodes — and the defect Σ is drawn where the committed Poincaré-dual
// chain runs. THE GUARD: texture and Σ are shown because they ARE the field (the
// eigenmode intensity; the topologically-forced defect) — no orbiting markers, no
// furniture, no proof-apparatus. Verification is headless
// (scripts/diagnose-rich-field-l3b.cjs); this component only draws the committed
// output of `buildRichField()`.
//
// Geometry note (display only): the quotient form is abstract; the two seed faces
// are drawn at their F0 positions, each barycentrically subdivided exactly as the
// committed `subdivide` does (corner / edge-midpoint / barycenter), and every
// sub-triangle corner takes the |ψ|² of its QUOTIENT site — so identified sites
// show one intensity wherever they appear. Σ's RM spokes (midpoint → barycenter)
// are drawn per face. `mountRichFieldPreview` is the dev harness (wiring = G5).

import { useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Vec3 } from '../types/geometry';
import { buildRichField, type RichField } from '../lib/richFieldV0';
import { faceEdgePairs } from '../lib/surfaceOperations';

const edgeKeyOf = (u: string, v: string): string =>
  [u, v].sort((a, b) => a.localeCompare(b)).join('|');

const mid = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

function centroidOf(points: Vec3[]): Vec3 {
  const n = points.length || 1;
  const sum = points.reduce<Vec3>((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

// intensity → colour: dark (node) → bright cyan-white (antinode). Unlit material —
// the brightness IS the field value, never shading.
function intensityColor(t: number): THREE.Color {
  return new THREE.Color().setHSL(0.52, 0.8, 0.04 + 0.82 * Math.max(0, Math.min(1, t)));
}

interface FieldModel {
  positions: Float32Array;
  colors: Float32Array;
  sigmaSegments: [number, number, number][];
  outline: Float32Array;
  center: Vec3;
  radius: number;
}

function buildFieldModel(field: RichField): FieldModel {
  const { F0, faces } = field.form;
  const siteIndex = new Map(field.siteIds.map((id, i) => [id, i]));
  const maxIntensity = field.intensity.reduce((acc, x) => Math.max(acc, x), 0) || 1;
  const intensityOfSite = (siteId: string): number => {
    const index = siteIndex.get(siteId);
    if (index === undefined) throw new Error(`RichFieldOverlay: unknown site ${siteId}`);
    return field.intensity[index] / maxIntensity;
  };

  const positions: number[] = [];
  const colors: number[] = [];
  const outline: number[] = [];
  const pushCorner = (p: Vec3, t: number): void => {
    positions.push(p[0], p[1], p[2]);
    const c = intensityColor(t);
    colors.push(c.r, c.g, c.b);
  };

  const all: Vec3[] = [];
  const sigmaBySpoke = new Map<string, [Vec3, Vec3]>();

  faces.forEach((face, fi) => {
    const cyclePositions = face.vertexIds.map((v) => F0.vertices[v].position);
    const bar = centroidOf(cyclePositions);
    const barT = intensityOfSite(`B:${fi}`);
    all.push(bar, ...cyclePositions);
    faceEdgePairs(face).forEach(([from, to], p) => {
      const pFrom = F0.vertices[from].position;
      const pTo = F0.vertices[to].position;
      const pMid = mid(pFrom, pTo);
      const tFrom = intensityOfSite(`V:${field.glued.vertexClassOf[from]}`);
      const tTo = intensityOfSite(`V:${field.glued.vertexClassOf[to]}`);
      const edgeClassId = field.glued.edgeClassIdOf[edgeKeyOf(from, to)];
      const tMid = intensityOfSite(`M:${edgeClassId}`);
      // tail sub-triangle (vFrom, mid, bar) + head sub-triangle (mid, vTo, bar) —
      // the committed subdivision's two triangles for this slot.
      pushCorner(pFrom, tFrom);
      pushCorner(pMid, tMid);
      pushCorner(bar, barT);
      pushCorner(pMid, tMid);
      pushCorner(pTo, tTo);
      pushCorner(bar, barT);
      outline.push(...pFrom, ...pTo);
      sigmaBySpoke.set(`RM:${fi}:${p}`, [pMid, bar]);
    });
  });

  const sigmaSegments: [number, number, number][] = [];
  for (const spoke of field.sigma.sigmaChainEdges) {
    const seg = sigmaBySpoke.get(spoke);
    if (seg) sigmaSegments.push([...seg[0]], [...seg[1]]);
  }

  const center = centroidOf(all);
  const radius = Math.max(
    0.5,
    ...all.map((p) => Math.hypot(p[0] - center[0], p[1] - center[1], p[2] - center[2])),
  );
  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors),
    sigmaSegments,
    outline: new Float32Array(outline),
    center,
    radius,
  };
}

export function RichFieldPreview() {
  const field = useMemo(() => buildRichField(), []);
  const model = useMemo(() => buildFieldModel(field), [field]);
  const distance = Math.max(3.2, model.radius * 3.4);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#0c0a09' }}>
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
        <mesh>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setAttribute('position', new THREE.BufferAttribute(model.positions, 3));
              geometry.setAttribute('color', new THREE.BufferAttribute(model.colors, 3));
            }}
          />
          {/* unlit: the brightness IS |ψ|² — no lighting modulation of the field */}
          <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
        </mesh>
        <lineSegments>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setAttribute('position', new THREE.BufferAttribute(model.outline, 3));
            }}
          />
          <lineBasicMaterial color="#44403c" transparent opacity={0.8} />
        </lineSegments>
        {model.sigmaSegments.length ? (
          <Line
            segments
            points={model.sigmaSegments}
            color="#f43f5e"
            lineWidth={5}
            depthTest={false}
            renderOrder={10}
          />
        ) : null}
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
        <div style={{ fontWeight: 700 }}>rich field — canonical L_U eigenmode (L3b)</div>
        <div>λ_min = {field.lambdaMin.toFixed(6)} (simple)</div>
        <div>surface brightness = |ψ|² — bright antinode / dark node</div>
        <div style={{ color: '#fda4af' }}>— Σ disclination (the forced defect)</div>
      </div>
    </div>
  );
}

// Dev-console mount (Vite module graph):
//   const m = await import('/src/components/RichFieldOverlay.tsx');
//   const off = m.mountRichFieldPreview(el);
export function mountRichFieldPreview(container: HTMLElement): () => void {
  const root = createRoot(container);
  root.render(<RichFieldPreview />);
  return () => root.unmount();
}
