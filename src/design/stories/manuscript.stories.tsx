// THE MANUSCRIPT BENCH — the designer's paper-ground, fixed-camera Storybook
// of the manuscript registers (engineer seal SEAL_MANUSCRIPT_BENCH, cut on
// HEAD 90e8b80; designer 0105 · mothership 0130 · Arman 1421).
//
// THE LAWS (the designer's, binding — the seal's §):
//   1. PAPER — the ground is manuscriptDefaults.paper.background (#e9e2cf) on
//      BOTH the Storybook `backgrounds` parameter and the R3F background;
//      never the dark engine background.
//   2. NO SECOND RENDERER — every drawn mark routes through a COMMITTED
//      component (InkedForm / InkedPlainForm / InkedDeficitLayer) fed by the
//      COMMITTED models; this file draws nothing of its own (the
//      forms.stories ShapeScene is the named anti-pattern). Captions are
//      chrome (HTML), never world marks.
//   3. FIXED CAMERAS — each story sets an explicit deterministic framing; no
//      drift, no auto-orbit (OrbitControls stays for MANUAL rotation only).
//   4. NOT A WITNESS — this bench is for the EYE. It discharges nothing:
//      diagnose-* stays the falsifiable ground and Arman's eye on the
//      running app stays the final ruling ground.
//
// SUBJECTS are built via the COMMITTED ops (invoke → stamp → fold / glue /
// subdivide / identify — the same executors the app drives), never mocks;
// the mounts mirror the app's own call sites (group scale · worldScale ·
// craft), so the bench shows the app's look, drifts included.

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import type { Shape, Vec3 } from '../../types/geometry';
import { InkedForm, type InkedFormCraft, type InkedFormLighting } from '../../manuscript/InkedForm';
import { InkedPlainForm } from '../../manuscript/InkedPlainForm';
import { InkedDeficitLayer } from '../../manuscript/InkedDeficitLayer';
import { buildInkedFormModel } from '../../manuscript/inkedFormModel';
import {
  buildDeficitRegisterModel,
  deficitCardRows,
  faithfulDeficitDatum,
} from '../../manuscript/deficitRegisterModel';
import { acquireFaithfulComplex } from '../../manuscript/surfaceClassifier';
import { tryLaidBodyModel } from '../../manuscript/laidBodyModel';
import { buildLaidInkedModel } from '../../manuscript/laidInkedModel';
import {
  invokePrimitive,
  applyPlaygroundOperationTo,
  routeWrittenRender,
  type WrittenForm,
} from '../../manuscript/writtenFormModel';
import { applyFoldTo } from '../../manuscript/handGestureModel';
import { computeSeedCornerAngles } from '../../lib/conformalAtom';
import { createSeedShape } from '../../data/seeds';
import { loadForm } from '../../lib/multiform';
import { nGon } from '../../playground/primitiveCatalogue';
import { subdivideFace } from '../../lib/surfaceRefinement';
import { identify } from '../../lib/complexIdentification';
import { manuscriptDefaults } from '../designDefaults';

const paper = manuscriptDefaults.paper;

// the dialled committed craft, verbatim from the ratify target (the same
// numbers ManuscriptView's Leva panel initializes from)
const benchCraft: InkedFormCraft = {
  bodyColor: manuscriptDefaults.body.color,
  bodyOpacity: manuscriptDefaults.body.opacity,
  bodyRoughness: manuscriptDefaults.body.roughness,
  prepassOffsetUnits: manuscriptDefaults.body.prepassOffsetUnits,
  constructionColor: manuscriptDefaults.construction.color,
  constructionOpacity: manuscriptDefaults.construction.opacity,
  constructionGhostOpacity: manuscriptDefaults.construction.ghostOpacity,
  silhouetteColor: manuscriptDefaults.silhouette.color,
  silhouetteScreenspacePx: manuscriptDefaults.silhouette.screenspacePx,
  silhouetteOpacity: manuscriptDefaults.silhouette.opacity,
  generatorColorA: manuscriptDefaults.generators.a,
  generatorColorB: manuscriptDefaults.generators.b,
  generatorLineWidth: manuscriptDefaults.generators.lineWidth,
  generatorGhostOpacity: manuscriptDefaults.generators.ghostOpacity,
  generatorNearOpacity: manuscriptDefaults.generators.nearOpacity,
  hatchSpacingPx: manuscriptDefaults.hatching.spacingPx,
  hatchBandPx: manuscriptDefaults.hatching.bandPx,
  hatchOpacity: manuscriptDefaults.hatching.opacity,
  hatchWeightPx: manuscriptDefaults.hatching.weightPx,
  hatchColor: manuscriptDefaults.hatching.color,
  hatchAngleDeg: manuscriptDefaults.hatching.angleDeg,
  hatchShadowStart: manuscriptDefaults.hatching.shadowStart,
  hatchCrossStart: manuscriptDefaults.hatching.crossStart,
};
const benchLighting: InkedFormLighting = {
  ambientIntensity: manuscriptDefaults.lighting.ambientIntensity,
  keyIntensity: manuscriptDefaults.lighting.keyIntensity,
  keyPosition: manuscriptDefaults.lighting.keyPosition,
};
// the app's band scales, mirrored (the bench shows the app's own framing)
const DIM1 = manuscriptDefaults.world.rows.dim1Scale; // 2.1 — the cut n-gons
const DIM2 = manuscriptDefaults.world.rows.dim2Scale; // 0.62 — the immersions

function must<T>(value: T | null | undefined, what: string): T {
  if (value === null || value === undefined) {
    throw new Error(`manuscript bench: ${what} did not construct`);
  }
  return value;
}

// the handleInvoke stamp, verbatim (the R1-FIX2 carry — subjects enter owned)
function wireInvoked(key: string, seq: number): WrittenForm {
  const form = invokePrimitive(key, seq);
  const owned = computeSeedCornerAngles(form.shape);
  return {
    ...form,
    shape: owned,
    render: form.render.mode === 'plain' ? { ...form.render, shape: owned } : form.render,
  };
}

// ---------------------------------------------------------------------------
// the subjects — every one via the committed ops (measured in the probe;
// a subject that fails to construct throws loudly and the story shows it)
// ---------------------------------------------------------------------------

// deficit: cube 90°×8 · tetra 180°×4 · flat silence · un-owned refusal · cone
const cubeOwned = computeSeedCornerAngles(createSeedShape('cube'));
const tetraOwned = computeSeedCornerAngles(createSeedShape('tetrahedron'));
const cubeRaw = createSeedShape('cube'); // deliberately UN-owned — the refusal subject
const unownedRows = deficitCardRows(buildDeficitRegisterModel(cubeRaw));

const torusHost = wireInvoked('square', 1);
const torusApplied = applyPlaygroundOperationTo('glue-torus', torusHost.shape, null, 2, 8, [], null);
const torusQuotient = must(torusApplied.ok ? torusApplied.born.shape : null, 'the glue-torus quotient');
// the committed acquisition — load-bearing for the SILENCE: without the
// complex the merged shape's link degenerates and the read refuses; with it
// the read is MEASURED flat (marked, zero marks — δ=0 draws nothing)
const torusAcquired = must(acquireFaithfulComplex(torusQuotient, [torusHost.shape]), 'the torus complex');

const coneInvoked = wireInvoked('triangle', 3);
const coneFold = applyFoldTo(coneInvoked.shape, null, [], [{ edgeA: 0, edgeB: 1, mode: 'preserving' }], 4, 8);
const coneForm = must(coneFold.ok ? coneFold.born : null, 'the fold-born cone');
const coneModel = must(coneForm.render.mode === 'faithful' ? coneForm.render.model : null, 'the faithful render');
const coneDatumAny = faithfulDeficitDatum(
  coneModel,
  [coneForm.shape, coneForm.parentShape].filter((p): p is Shape => p !== null && p !== undefined),
);
const coneDatum = must(coneDatumAny.kind === 'read' ? coneDatumAny : null, 'the cone datum');

// boundary: the invoked square (rim 90°×4) and triangle (rim 120°×3)
const boundarySquare = wireInvoked('square', 5);
const boundaryTriangle = wireInvoked('triangle', 6);

// crossing: the reversing fold's non-orientable class body (the crossing
// ghost). NOTE (probed, for the record): the literal Klein WORD routes
// `immersion` in-app (both two-pair fold orders too) — the app-real
// classBody wearing the crossing ghost is the reversing fold's
// Möbius-family; the register is the same. Reported as a finding.
const revInvoked = wireInvoked('triangle', 7);
const revFold = applyFoldTo(revInvoked.shape, null, [], [{ edgeA: 0, edgeB: 1, mode: 'reversing' }], 8, 8);
const revForm = must(revFold.ok ? revFold.born : null, 'the reversing fold');
const revComponent = must(
  revForm.render.mode === 'classBody' ? revForm.render.model.components[0] : null,
  'the class-body component',
);

// junction: the rim⊕chord pinch through the app's own router — the plain
// junction girder (the classifier's own edge reading; ink from the knob).
// The host enters OWNED (every invocation seam stamps — without the stamp
// the register would refuse at the un-owned gate and never reach the
// junction fact this subject exists to show).
const pinchHost = computeSeedCornerAngles(loadForm(nGon(4), 'bench'));
const pinchFace = pinchHost.faces[0];
const pinchSub = subdivideFace(pinchHost, pinchFace, pinchFace.vertexIds[0], pinchFace.vertexIds[2]).shape;
const pinchRim = must(pinchSub.edges.find((e) => !e.id.includes(':chord')), 'the pinch rim edge');
const pinchChord = must(pinchSub.edges.find((e) => e.id.includes(':chord')), 'the pinch chord edge');
const pinched = identify(pinchSub, [pinchRim.id], [pinchChord.id], 'preserving', null);
const pinchRender = routeWrittenRender(pinched.shape, [pinchSub], 8);
const pinchPlain = must(pinchRender.mode === 'plain' ? pinchRender : null, 'the pinch plain render');
const pinchSegments: Vec3[][] = (() => {
  // the app's own junction-segment construction, mirrored
  const segments: Vec3[][] = [];
  const wanted = new Set(pinchPlain.junctionEdgeIds ?? []);
  for (const edge of pinchPlain.shape.edges) {
    if (!wanted.has(edge.id)) continue;
    const u = pinchPlain.shape.vertices[edge.vertexIds[0]]?.position;
    const v = pinchPlain.shape.vertices[edge.vertexIds[1]]?.position;
    if (u && v) segments.push([[...u], [...v]]);
  }
  return segments;
})();
const pinchRows = deficitCardRows(buildDeficitRegisterModel(pinchPlain.shape));

// laid: the acquired torus through the UNIFIED renderer (the adapter)
const laidTorus = must(tryLaidBodyModel(torusQuotient, [torusHost.shape]), 'the laid torus');
const laidInked = buildLaidInkedModel(laidTorus);
const laidCraft: InkedFormCraft = {
  // the app's own laid mount compensates the pen for the band scale
  ...benchCraft,
  silhouetteScreenspacePx: benchCraft.silhouetteScreenspacePx / Math.max(0.0001, DIM2),
};

// ---------------------------------------------------------------------------
// the bench canvas — warm paper, the manuscript lights, a FIXED camera;
// OrbitControls for manual rotation only (law 3)
// ---------------------------------------------------------------------------
function PaperCanvas({
  camera,
  children,
}: {
  camera: readonly [number, number, number];
  children: ReactNode;
}) {
  return (
    <div style={{ height: '100vh', background: paper.background, position: 'relative' }}>
      <Canvas camera={{ position: [...camera], fov: 45 }}>
        <color attach="background" args={[paper.background]} />
        <ambientLight intensity={manuscriptDefaults.lighting.ambientIntensity} />
        <directionalLight
          position={[...manuscriptDefaults.lighting.keyPosition]}
          intensity={manuscriptDefaults.lighting.keyIntensity}
        />
        {children}
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}

// chrome — a paper-toned caption card (HTML, never a world mark)
function CaptionBar({ lines }: { lines: string[] }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 12,
        bottom: 12,
        maxWidth: 'calc(100% - 24px)',
        padding: '8px 12px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 12,
        lineHeight: 1.55,
      }}
    >
      {lines.map((line, k) => (
        <div key={k}>{line}</div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: 'manuscript',
  parameters: {
    backgrounds: { default: 'paper', values: [{ name: 'paper', value: paper.background }] },
  },
};
export default meta;

// ---------------------------------------------------------------------------
// BODY — the zoo six through the ONE crafted renderer, on paper: the full
// committed pass stack (prepass · silhouette · body · hatching · two-pass
// construction · two-pass generators), at the app's own immersion resolution
// and band scale.
// ---------------------------------------------------------------------------
const ZOO = ['torus', 'klein', 'rp2', 'sphere', 'cylinder', 'mobius'] as const;
const zooModels = ZOO.map((surface) =>
  buildInkedFormModel({ surface, resolution: manuscriptDefaults.layout.resolution }),
);

export const Body: StoryObj = {
  render: () => (
    <PaperCanvas camera={[0, 0, 30]}>
      {zooModels.map((model, i) => (
        <group key={model.surface} scale={DIM2}>
          <InkedForm
            model={model}
            craft={benchCraft}
            lighting={benchLighting}
            position={[(i - 2.5) * 10.2, 0, 0]}
          />
        </group>
      ))}
    </PaperCanvas>
  ),
};

// ---------------------------------------------------------------------------
// DEFICIT — the register's whole range on ONE screen (the seal's table):
// cube 90°×8 (the angle) · tetrahedron 180°×4 (the lobe) · the flat torus
// quotient WITH its acquired complex (genuine silence — δ=0 draws nothing) ·
// an un-owned cube (the reader REFUSES; the world stays bare, the card
// speaks) · the fold-born faithful cone (apex 300° + rim 60° at the fan's
// real placements — R1-REBUILD's cure).
// ---------------------------------------------------------------------------
export const Deficit: StoryObj = {
  render: () => (
    <div style={{ position: 'relative' }}>
      <PaperCanvas camera={[0, 3, 20]}>
        <InkedPlainForm shape={cubeOwned} craft={benchCraft} lighting={benchLighting} position={[-10, 0, 0]} />
        <InkedPlainForm shape={tetraOwned} craft={benchCraft} lighting={benchLighting} position={[-5, 0, 0]} />
        <group scale={DIM1}>
          <InkedPlainForm shape={torusQuotient} craft={benchCraft} lighting={benchLighting} worldScale={DIM1} />
          {/* the TRUE complex-borne read — MEASURED flat, draws nothing (the
              silence is the value; the plain mount's own complex-less read
              refuses and also rightly draws nothing) */}
          <InkedDeficitLayer shape={torusQuotient} complex={torusAcquired.complex} />
        </group>
        <InkedPlainForm shape={cubeRaw} craft={benchCraft} lighting={benchLighting} position={[5, 0, 0]} />
        <group scale={DIM1 * 1.5} position={[10, 0, 0]}>
          {/* the fold-born cone's marks at the fan's real placements (the
              app's faithful-route mount, mirrored) */}
          <InkedDeficitLayer shape={coneDatum.shape} complex={coneDatum.complex} />
        </group>
      </PaperCanvas>
      <CaptionBar
        lines={[
          'deficit — the range, left to right:',
          'cube (owned) · cone point 90° ×8 — the angle',
          'tetrahedron (owned) · cone point 180° ×4 — the lobe',
          'flat torus quotient, read WITH its acquired complex · δ=0 everywhere — genuine silence, nothing drawn',
          `un-owned cube · the reader refuses and the card speaks: "${unownedRows[0]?.value ?? ''}"`,
          'fold-born faithful cone · apex 300° (the 2π ring + wedge) + rim turn 60°, at the fan placements',
          'finding: the fan BODY (disk · seam · rim) is a view-local component — the marks show without it here',
        ]}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// BOUNDARY — the rim's own turn (π−Σθ, the open circuit) against its π
// reference: the invoked square (90° ×4) and triangle (120° ×3), the app's
// own plain mounts.
// ---------------------------------------------------------------------------
export const Boundary: StoryObj = {
  render: () => (
    <div style={{ position: 'relative' }}>
      <PaperCanvas camera={[0, 0, 10]}>
        <group scale={DIM1} position={[-2.4, 0, 0]}>
          <InkedPlainForm shape={boundarySquare.shape} craft={benchCraft} lighting={benchLighting} worldScale={DIM1} />
        </group>
        <group scale={DIM1} position={[2.4, 0, 0]}>
          <InkedPlainForm shape={boundaryTriangle.shape} craft={benchCraft} lighting={benchLighting} worldScale={DIM1} />
        </group>
      </PaperCanvas>
      <CaptionBar
        lines={[
          'boundary — the rim turn (π−Σθ), an OPEN arc (no closed transported frame on a rim):',
          'square · rim turn 90° ×4        triangle · rim turn 120° ×3',
        ]}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// CROSSING / JUNCTION — the pale crossing ghost on a non-orientable class
// body, and the honest junction girder on a pinch.
// ---------------------------------------------------------------------------
export const CrossingJunction: StoryObj = {
  render: () => (
    <div style={{ position: 'relative' }}>
      <PaperCanvas camera={[0, 1, 12]}>
        <group position={[-4.5, 0, 0]}>
          <group scale={DIM2}>
            <InkedPlainForm
              lighting={benchLighting}
              shape={revComponent.body}
              craft={benchCraft}
              generators={revComponent.optionB.generators}
              worldScale={DIM2}
              selfCrossing={revComponent.class.kind === 'non-orientable'}
              position={revComponent.offset}
            />
          </group>
        </group>
        <group position={[3.5, 0, 0]}>
          <group scale={DIM1}>
            <InkedPlainForm
              lighting={benchLighting}
              shape={pinchPlain.shape}
              craft={benchCraft}
              worldScale={DIM1}
              junction={{
                segments: pinchSegments,
                color: manuscriptDefaults.world.junction.color,
                lineWidth: manuscriptDefaults.world.junction.lineWidth,
              }}
            />
          </group>
        </group>
      </PaperCanvas>
      <CaptionBar
        lines={[
          'crossing / junction:',
          'left — the reversing fold’s non-orientable class body: the pale crossing ghost + its certified core',
          '(finding: the Klein WORD routes immersion in-app — the app-real crossing-ghost class body is this Möbius-family fold)',
          `right — the rim⊕chord pinch: the junction girder marks the classifier’s own edge; the deficit register refuses whole and the card speaks: "${pinchRows[0]?.value.slice(0, 80) ?? ''}…"`,
        ]}
      />
    </div>
  ),
};

// ---------------------------------------------------------------------------
// LAID BODY — the acquired torus: the person's own cells through the ONE
// unified renderer (the committed adapter), the app's laid mount mirrored
// (pen compensated for the band scale).
// ---------------------------------------------------------------------------
export const LaidBody: StoryObj = {
  render: () => (
    <div style={{ position: 'relative' }}>
      <PaperCanvas camera={[0, 0, 14]}>
        <group scale={DIM2}>
          <InkedForm model={laidInked} craft={laidCraft} lighting={benchLighting} />
        </group>
      </PaperCanvas>
      <CaptionBar
        lines={[
          `laid body — the acquired torus: V ${laidTorus.counts.v} · E ${laidTorus.counts.e} · F ${laidTorus.counts.f} · ${laidTorus.classLabel} · the cells ride as construction ink through the committed adapter`,
          'finding: the cell overlay (dots · rims · CUT-2 crossing ghost) is a view-local component — it does not mount here',
        ]}
      />
    </div>
  ),
};
