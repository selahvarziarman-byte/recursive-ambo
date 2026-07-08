// ManuscriptView — the `?manuscript` dev view (Manuscript Phase 2b): the TWO
// REGISTERS (CONTEXT "the through-line") —
//   · the AMBIENT WORLD (2a): warm-paper dimension registers, the available
//     catalogue as inked drawings, gently drifting — the register you inhabit;
//   · the SPECIMEN (2b): click a form → it RISES out of its band toward the
//     reader, the world recedes, and the ANALYTIC READING is summoned — the
//     committed certifiers' invariants on a manuscript card, the form's
//     already-drawn certified generators lit up and named, the twist (w₁) read
//     where the certifier says non-orientable. Click paper / Esc / another
//     form → it SINKS and the reading clears.
//
// THE ONE RULE (CONTEXT · ADR 0017): the fiction never impersonates the proof
// — the reading exists ONLY while a form is selected (summoned, never ambient
// furniture; specimenModel builds it on select from the committed certifiers,
// verbatim). Rise/recede/emphasis are CRAFT on the same unchanged drawings:
// InkedForm/InkedSkeleton/InkedDomain render byte-unchanged; emphasis goes
// through their existing craft/colour props and redraws NOTHING.
//
// NON-KNOBS (the one law): WHAT populates the bands, WHICH marks a form
// carries, and WHAT the card says come from worldModel/inkedFormModel/
// specimenModel — the knobs place, tone, pace, and stage only.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import { MathUtils, type Group } from 'three';
import { manuscriptDefaults } from '../design/designDefaults';
import { buildManuscriptWorld } from './worldModel';
import { InkedForm, type InkedFormCraft, type InkedFormLighting } from './InkedForm';
import { InkedSkeleton } from './InkedSkeleton';
import { InkedDomain } from './InkedDomain';
import {
  readDomainSpecimen,
  readSkeletonSpecimen,
  readSurfaceSpecimen,
  type SpecimenReading,
} from './specimenModel';

const DIM2_TITLES: Record<string, string> = {
  torus: 'Torus (T²)',
  klein: 'Klein bottle (K²)',
  rp2: 'RP² (cross-cap)',
  sphere: 'Sphere (S²)',
  cylinder: 'Cylinder',
  mobius: 'Möbius band',
};

// craft-level colour recede: mix an ink toward the paper tone (pure, deterministic)
function fadeToward(hex: string, paperHex: string, t: number): string {
  const parse = (h: string): [number, number, number] => {
    const s = h.replace('#', '');
    return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(paperHex);
  const mix = (a: number, b: number): number => Math.round(a + (b - a) * t);
  const to2 = (n: number): string => n.toString(16).padStart(2, '0');
  return `#${to2(mix(r1, r2))}${to2(mix(g1, g2))}${to2(mix(b1, b2))}`;
}

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

// the rise-and-sink: damp the wrapper from its band slot toward the specimen
// stage (and back) — calm, deterministic (MathUtils.damp), designer-dialled
function SpecimenLift({
  home,
  isSpecimen,
  riseTo,
  riseScale,
  damping,
  children,
}: {
  home: [number, number, number];
  isSpecimen: boolean;
  riseTo: [number, number, number];
  riseScale: number;
  damping: number;
  children: React.ReactNode;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    const group = ref.current;
    if (!group) return;
    const target = isSpecimen ? riseTo : home;
    const targetScale = isSpecimen ? riseScale : 1;
    group.position.x = MathUtils.damp(group.position.x, target[0], damping, delta);
    group.position.y = MathUtils.damp(group.position.y, target[1], damping, delta);
    group.position.z = MathUtils.damp(group.position.z, target[2], damping, delta);
    const s = MathUtils.damp(group.scale.x, targetScale, damping, delta);
    group.scale.setScalar(s);
  });
  return (
    <group ref={ref} position={home}>
      {children}
    </group>
  );
}

function FormLabel({
  position,
  title,
  sub,
  ink,
  hidden,
}: {
  position: [number, number, number];
  title: string;
  sub: string;
  ink: string;
  hidden: boolean;
}) {
  if (hidden) return null;
  return (
    <Html center position={position} distanceFactor={13} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
      <div style={{ textAlign: 'center', color: ink, fontFamily: 'Georgia, "Times New Roman", serif', whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 12.5, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.72 }}>{sub}</div>
      </div>
    </Html>
  );
}

// the specimen card — manuscript-styled, rendered IFF a reading is summoned
function SpecimenCard({
  reading,
  paper,
  generatorInks,
}: {
  reading: SpecimenReading;
  paper: { cardBackground: string; cardBorder: string; cardInk: string };
  generatorInks: { a: string; b: string };
}) {
  const row: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    borderTop: `1px solid ${paper.cardBorder}55`,
    padding: '4px 0 3px',
  };
  return (
    <div
      style={{
        position: 'absolute',
        right: 14,
        top: 64,
        width: 264,
        padding: '13px 15px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 2px 9px rgba(58, 51, 38, 0.2)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 13.5,
        lineHeight: 1.5,
      }}
    >
      <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>on select</div>
      <div style={{ fontSize: 17, fontWeight: 700 }}>{reading.title}</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.72, marginBottom: 7 }}>
        {reading.subtitle}
      </div>
      {reading.rows.map((r) => (
        <div key={r.label} style={row}>
          <span style={{ opacity: 0.85 }}>{r.label}</span>
          <b style={{ textAlign: 'right', fontWeight: r.emphasize ? 800 : 600 }}>{r.value}</b>
        </div>
      ))}
      {reading.twist ? (
        <div
          style={{
            marginTop: 8,
            padding: '5px 8px',
            border: `1px solid ${generatorInks.a}66`,
            borderRadius: 3,
            fontStyle: 'italic',
            fontSize: 12.5,
          }}
        >
          {reading.twist}
        </div>
      ) : null}
      <div style={{ marginTop: 9 }}>
        {reading.legend.length ? (
          reading.legend.map((entry) => (
            <div key={entry.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
              <span
                style={{
                  width: 15,
                  height: 4,
                  background: entry.ink === 'b' ? generatorInks.b : generatorInks.a,
                  borderRadius: 2,
                }}
              />
              <span style={{ fontSize: 12.5 }}>{entry.text}</span>
            </div>
          ))
        ) : (
          <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.72 }}>
            {reading.kind === 'surface'
              ? 'no generator loops — H₁ = 0'
              : reading.kind === 'skeleton'
                ? 'the drawn ink IS the cycle set'
                : 'pairing marks shown; H₁ read from the tower'}
          </div>
        )}
      </div>
      <div style={{ marginTop: 10, fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.5 }}>
        esc · click paper — the specimen sinks, the reading clears
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
  const specimenCtl = useControls('specimen · rise', {
    riseZ: { value: d.world.specimen.riseZ, min: 8, max: 28, step: 0.5 },
    riseScale: { value: d.world.specimen.riseScale, min: 1, max: 2.6, step: 0.05 },
    damping: { value: d.world.specimen.damping, min: 1, max: 7, step: 0.1 },
    recedeOpacity: { value: d.world.specimen.recedeOpacity, min: 0.05, max: 1, step: 0.01 },
    recedeColorFade: { value: d.world.specimen.recedeColorFade, min: 0, max: 1, step: 0.01 },
    loopWidthFactor: { value: d.world.specimen.loopWidthFactor, min: 1, max: 3, step: 0.05 },
    loopGhostOpacity: { value: d.world.specimen.loopGhostOpacity, min: 0, max: 1, step: 0.05 },
  });

  const baseCraft: InkedFormCraft = {
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

  // ----- selection: the specimen is SUMMONED state, nothing more -------------
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const pick = useCallback((id: string) => setSelected((cur) => (cur === id ? null : id)), []);
  const anySelected = selected !== null;

  // the committed engine does all the deriving; the view only places the results
  const world = useMemo(() => buildManuscriptWorld(layoutCtl.resolution), [layoutCtl.resolution]);

  // the analytic reading — built ON SELECT from the committed certifiers'
  // readouts (specimenModel), cleared on deselect: summoned, never ambient
  const reading = useMemo<SpecimenReading | null>(() => {
    if (!selected) return null;
    const [band, key] = selected.split(':');
    if (band === 'dim1') {
      const model = world.dim1.find((m) => m.key === key);
      return model ? readSkeletonSpecimen(model) : null;
    }
    if (band === 'dim2') {
      const model = world.dim2.find((m) => m.surface === key);
      return model ? readSurfaceSpecimen(model) : null;
    }
    const model = world.dim3.find((m) => m.key === key);
    return model ? readDomainSpecimen(model) : null;
  }, [selected, world]);

  // craft staging: the world recedes behind a specimen; the specimen's already-
  // drawn certified loops light up (width/ghost only — nothing redrawn)
  const recededCraft: InkedFormCraft = useMemo(() => {
    const f = specimenCtl.recedeColorFade;
    const o = specimenCtl.recedeOpacity;
    return {
      ...baseCraft,
      bodyOpacity: baseCraft.bodyOpacity * o,
      constructionOpacity: baseCraft.constructionOpacity * o,
      constructionGhostOpacity: baseCraft.constructionGhostOpacity * o,
      silhouetteOpacity: baseCraft.silhouetteOpacity * o,
      silhouetteColor: fadeToward(baseCraft.silhouetteColor, paper.background, f),
      constructionColor: fadeToward(baseCraft.constructionColor, paper.background, f),
      generatorColorA: fadeToward(baseCraft.generatorColorA, paper.background, f),
      generatorColorB: fadeToward(baseCraft.generatorColorB, paper.background, f),
      hatchOpacity: baseCraft.hatchOpacity * o,
      hatchColor: fadeToward(baseCraft.hatchColor, paper.background, f),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseCraft, specimenCtl.recedeColorFade, specimenCtl.recedeOpacity, paper.background]);
  const specimenCraft: InkedFormCraft = useMemo(
    () => ({
      ...baseCraft,
      generatorLineWidth: baseCraft.generatorLineWidth * specimenCtl.loopWidthFactor,
      generatorGhostOpacity: specimenCtl.loopGhostOpacity,
    }),
    [baseCraft, specimenCtl.loopWidthFactor, specimenCtl.loopGhostOpacity],
  );
  const craftFor = (id: string): InkedFormCraft =>
    selected === id ? specimenCraft : anySelected ? recededCraft : baseCraft;
  const inkFor = (id: string, ink: string): string =>
    selected === id || !anySelected ? ink : fadeToward(ink, paper.background, specimenCtl.recedeColorFade);

  const rows = d.world.rows;
  const bands = d.world.bands;
  const centered = (k: number, n: number, gap: number): number => (k - (n - 1) / 2) * gap;
  const riseTo: [number, number, number] = [0, d.world.specimen.riseY, specimenCtl.riseZ];

  const selectable = (
    id: string,
    home: [number, number, number],
    driftIndex: number,
    label: { title: string; sub: string; drop: number },
    children: React.ReactNode,
  ): React.ReactNode => (
    <SpecimenLift
      key={id}
      home={home}
      isSpecimen={selected === id}
      riseTo={riseTo}
      riseScale={specimenCtl.riseScale}
      damping={specimenCtl.damping}
    >
      <Drift
        index={driftIndex}
        enabled={driftCtl.enabled && selected !== id}
        amplitude={driftCtl.amplitude}
        speed={driftCtl.speed}
      >
        <group
          onClick={(event) => {
            event.stopPropagation();
            pick(id);
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          {children}
        </group>
        <FormLabel
          position={[0, label.drop, 0]}
          title={label.title}
          sub={label.sub}
          ink={inkFor(id, d.paper.titleInk)}
          hidden={selected === id}
        />
      </Drift>
    </SpecimenLift>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: paper.background }}>
      <Canvas
        camera={{ position: [...d.layout.cameraPosition], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        onPointerMissed={() => setSelected(null)}
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
        {world.dim1.map((model, k) =>
          selectable(
            `dim1:${model.key}`,
            [centered(k, world.dim1.length, rows.dim1Spacing * scaleCtl.dim1Scale), rows.dim1Y, 0],
            k,
            {
              title: model.title,
              sub: `H₁ = ${model.h1Label ?? 'n-a'} · b₁ ${model.invariants.level1?.b1 ?? '—'}`,
              drop: -1.35 * scaleCtl.dim1Scale - 0.7,
            },
            <group scale={scaleCtl.dim1Scale}>
              <InkedSkeleton
                model={model}
                color={inkFor(`dim1:${model.key}`, silhouetteCtl.color)}
                lineWidth={d.world.skeleton.lineWidth}
              />
            </group>,
          ),
        )}

        {/* dim 2 — the six immersions through the unchanged InkedForm */}
        {world.dim2.map((model, k) =>
          selectable(
            `dim2:${model.surface}`,
            [
              centered(k, world.dim2.length, layoutCtl.spacing * scaleCtl.dim2Scale * 1.2),
              rows.dim2Y,
              0,
            ],
            k + 7,
            {
              title: DIM2_TITLES[model.surface] ?? model.surface,
              sub: `${model.immersion.correspondence.word === '' ? 'no gluing word' : model.immersion.correspondence.word} · H₁ = ${model.h1Label ?? 'n-a'}`,
              drop: -d.layout.captionDrop * scaleCtl.dim2Scale - 0.9,
            },
            <group scale={scaleCtl.dim2Scale}>
              <InkedForm model={model} craft={craftFor(`dim2:${model.surface}`)} lighting={lighting} />
            </group>,
          ),
        )}

        {/* dim 3 — fundamental domains, never solid bodies */}
        {world.dim3.map((model, k) =>
          selectable(
            `dim3:${model.key}`,
            [centered(k, world.dim3.length, rows.dim3Spacing * scaleCtl.dim3Scale), rows.dim3Y, 0],
            k + 19,
            {
              title: model.title,
              sub: `H₁ = ${model.tower.homology.H1.pretty} · χ ${model.tower.chi} · ${model.pairs.length} face-pairs`,
              drop: -1.6 * scaleCtl.dim3Scale - 0.9,
            },
            <group scale={scaleCtl.dim3Scale}>
              <InkedDomain
                model={model}
                inkColor={inkFor(`dim3:${model.key}`, silhouetteCtl.color)}
                lineWidth={d.world.domain.lineWidth}
                markColors={d.world.domain.markColors}
                markRadius={d.world.domain.markRadius}
              />
            </group>,
          ),
        )}

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
          the inked manuscript — phase 2b
        </div>
        <div style={{ fontSize: 12.5, fontStyle: 'italic', opacity: 0.78 }}>
          the two registers · the world you inhabit; the proof you summon
        </div>
        <div style={{ fontSize: 11, fontFamily: 'ui-monospace, monospace', opacity: 0.55, marginTop: 3 }}>
          ?manuscript · dev view · click a form → the specimen rises · esc sinks it
        </div>
      </div>
      {reading ? (
        <SpecimenCard
          reading={reading}
          paper={d.paper}
          generatorInks={{ a: generatorsCtl.a, b: generatorsCtl.b }}
        />
      ) : null}
      <Leva collapsed />
    </div>
  );
}
