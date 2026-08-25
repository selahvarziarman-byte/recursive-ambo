// FieldForShapeOverlay — Field integration: any form shows ITS OWN field.
//
// Pure presentation over `computeFieldForShape` (ADR 0018; the guard of ADR 0017
// Amd-2 held): per the researcher's split —
//   gate 'simple'     → the |ψ|² TEXTURE (unlit vertex brightness IS the field),
//                       plus Σ where a real defect exists (the L3b precedent);
//   gate 'degenerate' → NO texture (the decoration bar: a degenerate band has no
//                       canonical eigenvector) — the Σ disclination alone when a
//                       defect exists, the plain surface when orientable.
// Nothing decorates: texture and Σ are drawn because they ARE the field.
// Verification stays headless (scripts/diagnose-field-for-shape.cjs).
//
// Geometry (display only): each face is barycentrically split exactly as the
// committed `subdivide` — corner (V:vertex), edge-midpoint (M:the slot's edge
// class, read off the field's OWN complex boundary word), barycenter (B:face) —
// so identified sites show one intensity wherever they appear. Works for any
// n-gon faces (zoo quads, lift triangles). `mountShapeFieldPreview` is the dev
// harness (permanent UI wiring is G5).

import { useMemo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';
import { Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { Shape, Vec3 } from '../types/geometry';
import { computeFieldForShape, type ComputeFieldOptions, type ShapeField } from '../lib/fieldForShape';

const mid = (a: Vec3, b: Vec3): Vec3 => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];

function centroidOf(points: Vec3[]): Vec3 {
  const n = points.length || 1;
  const sum = points.reduce<Vec3>(
    (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
    [0, 0, 0],
  );
  return [sum[0] / n, sum[1] / n, sum[2] / n];
}

function intensityColor(t: number): THREE.Color {
  return new THREE.Color().setHSL(0.52, 0.8, 0.04 + 0.82 * Math.max(0, Math.min(1, t)));
}

const PLAIN_COLOR = new THREE.Color('#1c2a2e'); // the no-texture surface (degenerate / decoration bar)

interface FieldModel {
  positions: Float32Array;
  colors: Float32Array;
  sigmaSegments: [number, number, number][];
  outline: Float32Array;
  center: Vec3;
  radius: number;
}

// `vertexClassOf` maps a DISPLAY vertex id to its quotient class (identity for
// plain shapes). A quotient form whose minted positions are degenerate for
// display (a route-B lift) is drawn on its PRE-QUOTIENT patch — the L3b
// precedent: original faces at source positions, every corner carrying its
// QUOTIENT site's field value (identified sites show one intensity wherever
// they appear — co-location ≠ identity made visible through the field).
function buildFieldModel(
  shape: Shape,
  field: ShapeField,
  vertexClassOf?: Record<string, string>,
): FieldModel {
  const classOf = (id: string): string => vertexClassOf?.[id] ?? id;
  const siteIndex = new Map(field.siteIds.map((id, i) => [id, i]));
  const textured = field.gate === 'simple' && field.intensity !== null;
  const maxIntensity = textured
    ? field.intensity!.reduce((acc, x) => Math.max(acc, x), 0) || 1
    : 1;
  const siteT = (siteId: string): number => {
    if (!textured) return 0;
    const index = siteIndex.get(siteId);
    if (index === undefined) throw new Error(`FieldForShapeOverlay: unknown site ${siteId}`);
    return field.intensity![index] / maxIntensity;
  };

  const positions: number[] = [];
  const colors: number[] = [];
  const outline: number[] = [];
  const pushCorner = (p: Vec3, t: number): void => {
    positions.push(p[0], p[1], p[2]);
    const c = textured ? intensityColor(t) : PLAIN_COLOR;
    colors.push(c.r, c.g, c.b);
  };

  const all: Vec3[] = [];
  const sigmaBySpoke = new Map<string, [Vec3, Vec3]>();

  shape.faces.forEach((face, fi) => {
    const cyclePositions = face.vertexIds.map((v) => shape.vertices[v].position);
    const bar = centroidOf(cyclePositions);
    const barT = siteT(`B:${fi}`);
    all.push(bar, ...cyclePositions);
    const boundary = field.complex.faces[fi]?.boundary;
    face.vertexIds.forEach((from, p) => {
      const to = face.vertexIds[(p + 1) % face.vertexIds.length];
      const pFrom = shape.vertices[from].position;
      const pTo = shape.vertices[to].position;
      const pMid = mid(pFrom, pTo);
      const edgeClassId = boundary?.[p]?.edge;
      const tMid = edgeClassId ? siteT(`M:${edgeClassId}`) : 0;
      pushCorner(pFrom, siteT(`V:${classOf(from)}`));
      pushCorner(pMid, tMid);
      pushCorner(bar, barT);
      pushCorner(pMid, tMid);
      pushCorner(pTo, siteT(`V:${classOf(to)}`));
      pushCorner(bar, barT);
      outline.push(...pFrom, ...pTo);
      sigmaBySpoke.set(`RM:${fi}:${p}`, [pMid, bar]);
    });
  });

  const sigmaSegments: [number, number, number][] = [];
  if (field.hasDefect) {
    for (const spoke of field.sigma.sigmaChainEdges) {
      const seg = sigmaBySpoke.get(spoke);
      if (seg) sigmaSegments.push([...seg[0]], [...seg[1]]);
    }
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

export interface ShapeFieldViewProps {
  title: string;
  shape: Shape; // the DISPLAY shape (the form itself, or its pre-quotient patch)
  field: ShapeField;
  vertexClassOf?: Record<string, string>; // display vertex id → quotient class (identity if absent)
  children?: ReactNode; // extra in-canvas layers (e.g. the L2 identification overlay — G5.2)
}

export function ShapeFieldView({ title, shape, field, vertexClassOf, children }: ShapeFieldViewProps) {
  const model = useMemo(
    () => buildFieldModel(shape, field, vertexClassOf),
    [shape, field, vertexClassOf],
  );
  const distance = Math.max(3.2, model.radius * 3.2);

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
          <meshBasicMaterial vertexColors side={THREE.DoubleSide} />
        </mesh>
        <lineSegments>
          <bufferGeometry
            onUpdate={(geometry) => {
              geometry.setAttribute('position', new THREE.BufferAttribute(model.outline, 3));
            }}
          />
          <lineBasicMaterial color="#44403c" transparent opacity={0.55} />
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
        {children}
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
          maxWidth: 420,
        }}
      >
        <div style={{ fontWeight: 700 }}>{title} — field (per-form property)</div>
        <div>
          {/* B-105 B1 (researcher-ruled, rename never renumber): this figure
              is the CERTIFIED cert.b1 — a dim over 𝔽₂ — and a viewer cannot
              count a coefficient ring, so the ring is named */}
          gate: {field.gate} (texture band λ={field.textureBand.value.toFixed(6)} ×
          {field.textureBand.multiplicity}) · ker={field.kernelDim} · b₁(ℤ/2)={field.cert.b1}
        </div>
        {field.gate === 'simple' ? (
          <div>surface brightness = |ψ|² — bright antinode / dark node</div>
        ) : (
          <div>degenerate band — no canonical texture (decoration bar)</div>
        )}
        {field.hasDefect ? (
          <div style={{ color: '#fda4af' }}>— Σ disclination (the forced defect)</div>
        ) : (
          <div style={{ color: '#78716c' }}>no defect (orientable — Σ empty)</div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// dev harness — the visual check on real forms (permanent UI wiring is G5)
// ---------------------------------------------------------------------------
export interface ShapeFieldPreviewInput {
  title: string;
  shape: Shape;
  options?: ComputeFieldOptions;
  // display override for quotient forms whose minted positions are degenerate:
  // draw THIS shape (e.g. the pre-quotient patch at source positions) with each
  // corner mapped to its quotient class.
  displayShape?: Shape;
  vertexClassOf?: Record<string, string>;
}

export function mountShapeFieldPreview(container: HTMLElement, input: ShapeFieldPreviewInput): () => void {
  const field = computeFieldForShape(input.shape, input.options);
  const root = createRoot(container);
  root.render(
    <ShapeFieldView
      title={input.title}
      shape={input.displayShape ?? input.shape}
      field={field}
      vertexClassOf={input.vertexClassOf}
    />,
  );
  return () => root.unmount();
}
