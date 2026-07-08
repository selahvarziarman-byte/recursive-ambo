// ManuscriptView — the `?manuscript` dev view (Manuscript Phase 1): the
// faithfulness trio (torus · sphere · RP²) as inked drawings on warm paper
// (design ADR 0001; visual target outputs/playground_reference.png).
//
// The Leva craft panel mounts HERE (engineer ruling on calibration flag 1,
// 2026-07-08: tune the manuscript in-place; `designDefaults.manuscriptDefaults`
// stays the shared source of truth; DesignWorkbench untouched in Phase 1).
//
// NON-KNOBS (the one law): WHICH generator loops exist and WHAT the
// construction lines are is decided by inkedFormModel from the committed
// correspondence — no control below can add or remove a mark. The caption's
// numbers are the committed certifiers' readout, never typed in.

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { manuscriptDefaults } from '../design/designDefaults';
import { buildInkedFormModel, type GeneratorLoop, type InkedFormModel } from './inkedFormModel';
import { InkedForm, type InkedFormCraft } from './InkedForm';

const TRIO = ['torus', 'sphere', 'rp2'] as const;
type TrioKey = (typeof TRIO)[number];

const TITLES: Record<TrioKey, string> = {
  torus: 'Torus (T²)',
  sphere: 'Sphere (S²)',
  rp2: 'RP² (cross-cap)',
};

// what each drawn loop IS on this immersion (reference-card language; the loop
// itself comes from the model — these strings only name it)
const LOOP_READINGS: Record<TrioKey, Record<string, string>> = {
  torus: { a: 'a — longitude', b: 'b — meridian' },
  sphere: {},
  rp2: { 'a·b': 'a·b — the ℤ/2 generator' },
};

function CaptionCard({
  model,
  craft,
  paper,
}: {
  model: InkedFormModel;
  craft: InkedFormCraft;
  paper: { cardBackground: string; cardBorder: string; cardInk: string };
}) {
  const inv = model.invariants;
  const word = model.immersion.correspondence.word;
  const swatch = (loop: GeneratorLoop) =>
    loop.letters.length === 1 && loop.letters[0] === 'b' ? craft.generatorColorB : craft.generatorColorA;
  const row: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    borderTop: `1px solid ${paper.cardBorder}55`,
    paddingTop: 3,
    marginTop: 3,
  };
  return (
    <div
      style={{
        width: 228,
        padding: '10px 12px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 1px 4px rgba(58, 51, 38, 0.14)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 13,
        lineHeight: 1.45,
      }}
    >
      <div style={{ fontSize: 15, fontWeight: 700 }}>{TITLES[model.surface as TrioKey]}</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.75, marginBottom: 4 }}>
        {word === '' ? 'collapse target · no gluing word' : `gluing word · ${word}`}
      </div>
      <div style={row}>
        <span>Euler χ</span>
        <b>{inv.chi}</b>
      </div>
      <div style={row}>
        <span>orientable</span>
        <b>{inv.cert ? (inv.cert.nonOrientable ? 'no' : 'yes') : 'n-a'}</b>
      </div>
      <div style={row}>
        <span>class</span>
        <b style={{ textAlign: 'right' }}>{inv.classification}</b>
      </div>
      <div style={row}>
        <span>H₁</span>
        <b>{model.h1Label ?? 'n-a'}</b>
      </div>
      <div style={{ marginTop: 7 }}>
        {model.loops.length ? (
          model.loops.map((loop) => (
            <div key={loop.label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}>
              <span style={{ width: 14, height: 4, background: swatch(loop), borderRadius: 2 }} />
              <span style={{ fontSize: 12 }}>
                {LOOP_READINGS[model.surface as TrioKey][loop.label] ?? loop.label}
              </span>
            </div>
          ))
        ) : (
          <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.72 }}>
            no generator loops — H₁ = 0
          </div>
        )}
      </div>
    </div>
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
  });
  const constructionCtl = useControls('construction · graphite', {
    color: d.construction.color,
    opacity: { value: d.construction.opacity, min: 0, max: 1, step: 0.01 },
    ghostOpacity: { value: d.construction.ghostOpacity, min: 0, max: 0.5, step: 0.01 },
  });
  const silhouetteCtl = useControls('silhouette · ink', {
    color: d.silhouette.color,
    weight: { value: d.silhouette.weight, min: 0, max: 0.15, step: 0.005 },
    opacity: { value: d.silhouette.opacity, min: 0, max: 1, step: 0.01 },
  });
  const generatorsCtl = useControls('generators', {
    a: d.generators.a,
    b: d.generators.b,
    lineWidth: { value: d.generators.lineWidth, min: 1, max: 8, step: 0.5 },
    depthTest: d.generators.depthTest,
  });
  const layoutCtl = useControls('layout', {
    resolution: { value: d.layout.resolution, min: 4, max: 24, step: 1 },
    spacing: { value: d.layout.spacing, min: 6, max: 14, step: 0.5 },
  });
  const lightingCtl = useControls('lighting', {
    ambient: { value: d.lighting.ambientIntensity, min: 0, max: 2, step: 0.02 },
    key: { value: d.lighting.keyIntensity, min: 0, max: 2, step: 0.02 },
  });

  const craft: InkedFormCraft = {
    bodyColor: bodyCtl.color,
    bodyOpacity: bodyCtl.opacity,
    bodyRoughness: bodyCtl.roughness,
    constructionColor: constructionCtl.color,
    constructionOpacity: constructionCtl.opacity,
    constructionGhostOpacity: constructionCtl.ghostOpacity,
    silhouetteColor: silhouetteCtl.color,
    silhouetteWeight: silhouetteCtl.weight,
    silhouetteOpacity: silhouetteCtl.opacity,
    generatorColorA: generatorsCtl.a,
    generatorColorB: generatorsCtl.b,
    generatorLineWidth: generatorsCtl.lineWidth,
    generatorDepthTest: generatorsCtl.depthTest,
  };

  // the committed engine does all the deriving; the view only places the results
  const models = useMemo(
    () => TRIO.map((surface) => buildInkedFormModel({ surface, resolution: layoutCtl.resolution })),
    [layoutCtl.resolution],
  );

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
        {models.map((model, k) => (
          <group key={model.surface} position={[(k - 1) * layoutCtl.spacing, 0, 0]}>
            <InkedForm model={model} craft={craft} />
            <Html
              center
              position={[0, -d.layout.captionDrop, 0]}
              distanceFactor={11}
              zIndexRange={[40, 0]}
              style={{ pointerEvents: 'none' }}
            >
              <CaptionCard model={model} craft={craft} paper={d.paper} />
            </Html>
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
          the inked manuscript — phase 1
        </div>
        <div style={{ fontSize: 12.5, fontStyle: 'italic', opacity: 0.78 }}>
          the faithfulness trio · every visible mark is a value the engine computed
        </div>
        <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', opacity: 0.55, marginTop: 3 }}>
          ?manuscript · dev view · Leva dials craft only — loops/grid are not knobs
        </div>
      </div>
      <Leva collapsed={false} />
    </div>
  );
}
