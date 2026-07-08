// ManuscriptView — the `?manuscript` dev view (Manuscript Phase 2a): the
// AMBIENT WORLD — a warm-paper manuscript stratified into dimension registers
// (reference: outputs/playground_reference.png bands), populated from
// worldModel with the full available catalogue as inked drawings, gently
// drifting (the living manuscript; CONTEXT "the through-line" — this is the
// register you INHABIT; the specimen-on-select analytic register is 2b).
//
//   dim 1 · loops      — cut-born 1-complexes (real positions; level1Betti H₁)
//   dim 2 · surfaces   — the six committed immersions through the UNCHANGED
//                        Phase-1/1.5 InkedForm (Klein now among them: a + b,
//                        one free + one ℤ/2 torsion class)
//   dim 3 · manifolds  — the 3-torus as its FUNDAMENTAL DOMAIN (identified
//                        cube wireframe + pairing marks; never a solid body)
//
// The Leva craft panel mounts HERE (the standing flag-1 ruling). NON-KNOBS
// (the one law): WHAT populates the bands and WHICH marks a form carries come
// from worldModel/inkedFormModel; the knobs place, tone, and pace the page —
// they cannot add or remove a form or a mark. Labels show model/certifier
// values verbatim; the full analytic reading is 2b's specimen.

import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import type { Group } from 'three';
import { manuscriptDefaults } from '../design/designDefaults';
import { buildManuscriptWorld } from './worldModel';
import { InkedForm, type InkedFormCraft, type InkedFormLighting } from './InkedForm';
import { InkedSkeleton } from './InkedSkeleton';
import { InkedDomain } from './InkedDomain';

const DIM2_TITLES: Record<string, string> = {
  torus: 'Torus (T²)',
  klein: 'Klein bottle (K²)',
  rp2: 'RP² (cross-cap)',
  sphere: 'Sphere (S²)',
  cylinder: 'Cylinder',
  mobius: 'Möbius band',
};

// deterministic gentle wander — phase from the population index (golden angle),
// clock-driven; never random, dial-able, never a screensaver
function Drift({
  index,
  enabled,
  amplitude,
  speed,
  children,
}: {
  index: number;
  enabled: boolean;
  amplitude: number;
  speed: number;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    const group = ref.current;
    if (!group) return;
    if (!enabled || amplitude <= 0) {
      group.position.set(0, 0, 0);
      return;
    }
    const t = clock.elapsedTime * speed * Math.PI * 2 + index * 2.3999632297;
    group.position.set(Math.sin(t) * amplitude, Math.sin(t * 0.83 + 1.3) * amplitude * 0.6, 0);
  });
  return <group ref={ref}>{children}</group>;
}

function FormLabel({
  position,
  title,
  sub,
  ink,
}: {
  position: [number, number, number];
  title: string;
  sub: string;
  ink: string;
}) {
  return (
    <Html center position={position} distanceFactor={13} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
      <div style={{ textAlign: 'center', color: ink, fontFamily: 'Georgia, "Times New Roman", serif', whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 12.5, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.72 }}>{sub}</div>
      </div>
    </Html>
  );
}

export default function ManuscriptView() {
  const d = manuscriptDefaults;

  const paper = useControls('paper', {
    background: d.paper.background,
  });
  const bodyCtl = useControls('body', {
    color: d.body.color,
    opacity: { value: d.body.opacity, min: 0.1, max: 1, step: 0.01 },
    roughness: { value: d.body.roughness, min: 0, max: 1, step: 0.01 },
    prepassOffsetUnits: { value: d.body.prepassOffsetUnits, min: 0, max: 6, step: 1 },
  });
  const constructionCtl = useControls('construction · graphite', {
    color: d.construction.color,
    opacity: { value: d.construction.opacity, min: 0, max: 1, step: 0.01 },
    ghostOpacity: { value: d.construction.ghostOpacity, min: 0, max: 0.5, step: 0.01 },
  });
  const silhouetteCtl = useControls('silhouette · ink', {
    color: d.silhouette.color,
    screenspacePx: { value: d.silhouette.screenspacePx, min: 0, max: 4, step: 0.25 },
    opacity: { value: d.silhouette.opacity, min: 0, max: 1, step: 0.01 },
  });
  const generatorsCtl = useControls('generators', {
    a: d.generators.a,
    b: d.generators.b,
    lineWidth: { value: d.generators.lineWidth, min: 1, max: 8, step: 0.5 },
    ghostOpacity: { value: d.generators.ghostOpacity, min: 0, max: 1, step: 0.05 },
  });
  const hatchingCtl = useControls('hatching · tone (capped)', {
    spacingPx: { value: d.hatching.spacingPx, min: 3, max: 16, step: 0.5 },
    opacity: { value: d.hatching.opacity, min: 0, max: 0.5, step: 0.01 }, // hard craft cap — anti-photoreal
    weightPx: { value: d.hatching.weightPx, min: 0.5, max: 3, step: 0.25 },
    color: d.hatching.color,
    angleDeg: { value: d.hatching.angleDeg, min: 0, max: 180, step: 5 },
    shadowStart: { value: d.hatching.shadowStart, min: 0.5, max: 1, step: 0.01 },
    crossStart: { value: d.hatching.crossStart, min: 0.5, max: 1, step: 0.01 },
  });
  const layoutCtl = useControls('layout', {
    resolution: { value: d.layout.resolution, min: 4, max: 24, step: 1 },
    spacing: { value: d.layout.spacing, min: 6, max: 14, step: 0.5 },
  });
  const lightingCtl = useControls('lighting', {
    ambient: { value: d.lighting.ambientIntensity, min: 0, max: 2, step: 0.02 },
    key: { value: d.lighting.keyIntensity, min: 0, max: 2, step: 0.02 },
  });
  const bandsCtl = useControls('world · bands', {
    dim1Tone: d.world.bands.dim1Tone,
    dim2Tone: d.world.bands.dim2Tone,
    dim3Tone: d.world.bands.dim3Tone,
  });
  const scaleCtl = useControls('world · scale', {
    dim1Scale: { value: d.world.rows.dim1Scale, min: 0.5, max: 4, step: 0.1 },
    dim2Scale: { value: d.world.rows.dim2Scale, min: 0.3, max: 1.2, step: 0.02 },
    dim3Scale: { value: d.world.rows.dim3Scale, min: 0.5, max: 3, step: 0.1 },
  });
  const driftCtl = useControls('world · drift', {
    enabled: d.world.drift.enabled,
    amplitude: { value: d.world.drift.amplitude, min: 0, max: 0.8, step: 0.01 },
    speed: { value: d.world.drift.speed, min: 0, max: 0.25, step: 0.005 },
  });

  const craft: InkedFormCraft = {
    bodyColor: bodyCtl.color,
    bodyOpacity: bodyCtl.opacity,
    bodyRoughness: bodyCtl.roughness,
    prepassOffsetUnits: bodyCtl.prepassOffsetUnits,
    constructionColor: constructionCtl.color,
    constructionOpacity: constructionCtl.opacity,
    constructionGhostOpacity: constructionCtl.ghostOpacity,
    silhouetteColor: silhouetteCtl.color,
    silhouetteScreenspacePx: silhouetteCtl.screenspacePx,
    silhouetteOpacity: silhouetteCtl.opacity,
    generatorColorA: generatorsCtl.a,
    generatorColorB: generatorsCtl.b,
    generatorLineWidth: generatorsCtl.lineWidth,
    generatorGhostOpacity: generatorsCtl.ghostOpacity,
    hatchSpacingPx: hatchingCtl.spacingPx,
    hatchOpacity: hatchingCtl.opacity,
    hatchWeightPx: hatchingCtl.weightPx,
    hatchColor: hatchingCtl.color,
    hatchAngleDeg: hatchingCtl.angleDeg,
    hatchShadowStart: hatchingCtl.shadowStart,
    hatchCrossStart: hatchingCtl.crossStart,
  };
  const lighting: InkedFormLighting = {
    ambientIntensity: lightingCtl.ambient,
    keyIntensity: lightingCtl.key,
    keyPosition: d.lighting.keyPosition,
  };

  // the committed engine does all the deriving; the view only places the results
  const world = useMemo(() => buildManuscriptWorld(layoutCtl.resolution), [layoutCtl.resolution]);

  const rows = d.world.rows;
  const bands = d.world.bands;
  const centered = (k: number, n: number, gap: number): number => (k - (n - 1) / 2) * gap;

  return (
    <div style={{ position: 'fixed', inset: 0, background: paper.background }}>
      <Canvas
        camera={{ position: [...d.layout.cameraPosition], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={[paper.background]} />
        <ambientLight intensity={lightingCtl.ambient} />
        <directionalLight
          position={[...d.lighting.keyPosition]}
          intensity={lightingCtl.key}
          color="#fff6e5"
        />

        {/* the registers — warm-paper tones deepening down the page */}
        {(
          [
            { tone: bandsCtl.dim1Tone, y: rows.dim1Y, h: rows.dim1Height, label: 'dim 1 · loops' },
            { tone: bandsCtl.dim2Tone, y: rows.dim2Y, h: rows.dim2Height, label: 'dim 2 · surfaces' },
            { tone: bandsCtl.dim3Tone, y: rows.dim3Y, h: rows.dim3Height, label: 'dim 3 · manifolds' },
          ] as const
        ).map((band) => (
          <group key={band.label}>
            <mesh position={[0, band.y, bands.depth]} renderOrder={-20}>
              <planeGeometry args={[bands.width, band.h]} />
              <meshBasicMaterial color={band.tone} depthWrite={false} />
            </mesh>
            <Html
              position={[-27, band.y + band.h / 2 - 0.9, bands.depth + 0.1]}
              distanceFactor={13}
              zIndexRange={[40, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  color: bands.labelInk,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontStyle: 'italic',
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  opacity: 0.85,
                }}
              >
                {band.label}
              </div>
            </Html>
          </group>
        ))}

        {/* dim 1 — bare skeletons (their ink IS the real edge set) */}
        {world.dim1.map((model, k) => (
          <group
            key={model.key}
            position={[centered(k, world.dim1.length, rows.dim1Spacing * scaleCtl.dim1Scale), rows.dim1Y, 0]}
          >
            <Drift index={k} enabled={driftCtl.enabled} amplitude={driftCtl.amplitude} speed={driftCtl.speed}>
              <group scale={scaleCtl.dim1Scale}>
                <InkedSkeleton model={model} color={craft.silhouetteColor} lineWidth={d.world.skeleton.lineWidth} />
              </group>
              <FormLabel
                position={[0, -1.35 * scaleCtl.dim1Scale - 0.7, 0]}
                title={model.title}
                sub={`H₁ = ${model.h1Label ?? 'n-a'} · b₁ ${model.invariants.level1?.b1 ?? '—'}`}
                ink={d.paper.titleInk}
              />
            </Drift>
          </group>
        ))}

        {/* dim 2 — the six immersions through the unchanged InkedForm */}
        {world.dim2.map((model, k) => (
          <group
            key={model.surface}
            position={[
              centered(k, world.dim2.length, layoutCtl.spacing * scaleCtl.dim2Scale * 1.2),
              rows.dim2Y,
              0,
            ]}
          >
            <Drift
              index={k + 7}
              enabled={driftCtl.enabled}
              amplitude={driftCtl.amplitude}
              speed={driftCtl.speed}
            >
              <group scale={scaleCtl.dim2Scale}>
                <InkedForm model={model} craft={craft} lighting={lighting} />
              </group>
              <FormLabel
                position={[0, -d.layout.captionDrop * scaleCtl.dim2Scale - 0.9, 0]}
                title={DIM2_TITLES[model.surface] ?? model.surface}
                sub={`${model.immersion.correspondence.word === '' ? 'no gluing word' : model.immersion.correspondence.word} · H₁ = ${model.h1Label ?? 'n-a'}`}
                ink={d.paper.titleInk}
              />
            </Drift>
          </group>
        ))}

        {/* dim 3 — fundamental domains, never solid bodies */}
        {world.dim3.map((model, k) => (
          <group
            key={model.key}
            position={[centered(k, world.dim3.length, rows.dim3Spacing * scaleCtl.dim3Scale), rows.dim3Y, 0]}
          >
            <Drift
              index={k + 19}
              enabled={driftCtl.enabled}
              amplitude={driftCtl.amplitude}
              speed={driftCtl.speed}
            >
              <group scale={scaleCtl.dim3Scale}>
                <InkedDomain
                  model={model}
                  inkColor={craft.silhouetteColor}
                  lineWidth={d.world.domain.lineWidth}
                  markColors={d.world.domain.markColors}
                  markRadius={d.world.domain.markRadius}
                />
              </group>
              <FormLabel
                position={[0, -1.6 * scaleCtl.dim3Scale - 0.9, 0]}
                title={model.title}
                sub={`H₁ = ${model.tower.homology.H1.pretty} · χ ${model.tower.chi} · ${model.pairs.length} face-pairs`}
                ink={d.paper.titleInk}
              />
            </Drift>
          </group>
        ))}

        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 14,
          color: d.paper.titleInk,
          fontFamily: 'Georgia, "Times New Roman", serif',
          pointerEvents: 'none',
        }}
      >
        <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: 0.2 }}>
          the inked manuscript — phase 2a
        </div>
        <div style={{ fontSize: 12.5, fontStyle: 'italic', opacity: 0.78 }}>
          the ambient world · dimension registers · every visible mark is a value the engine computed
        </div>
        <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', opacity: 0.55, marginTop: 3 }}>
          ?manuscript · dev view · Leva dials craft only — population/marks are not knobs
        </div>
      </div>
      <Leva collapsed={false} />
    </div>
  );
}
