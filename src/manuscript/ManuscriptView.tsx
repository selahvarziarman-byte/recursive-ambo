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
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  MathUtils,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3,
  type Camera,
  type Group,
  type Mesh,
  type MeshBasicMaterial,
} from 'three';
import { manuscriptDefaults } from '../design/designDefaults';
import { buildManuscriptWorld, WORLD_SURFACES, type DomainModel } from './worldModel';
import { InkedForm, type InkedFormCraft, type InkedFormLighting } from './InkedForm';
import { InkedSkeleton } from './InkedSkeleton';
import { InkedDomain } from './InkedDomain';
import {
  readDomainSpecimen,
  readSkeletonSpecimen,
  readSurfaceSpecimen,
  type SpecimenReading,
} from './specimenModel';
import type { Face, Shape } from '../types/geometry';
import { PRIMITIVE_CATALOGUE } from '../playground/primitiveCatalogue';
import {
  applyPlaygroundOperationTo,
  buildBodilessWrittenForm,
  invokePrimitive,
  operationAvailabilityFor,
  readPlainSpecimen,
  routeWrittenRender,
  type WrittenForm,
} from './writtenFormModel';
import { resolveLineage } from '../playground/playgroundOperations';
import { prepareFormForSew, refineToDisk } from '../lib/surfaceRefinement';
// CYCLE-IDENTIFY (L23) — the gesture consumes the committed op + THE ONE
// SOURCE for the mode (modesFromDirectedCycles; the view NEVER re-derives the
// wedge convention — the L9 scar); entry gates read the committed walls
import {
  acquireComplex,
  directComplexOf,
  identify,
  modesFromDirectedCycles,
  type AcquiredComplex,
} from '../lib/complexIdentification';
// CUT 1b — THE L: the general layout (the person's own cells on the canonical
// body); consumed here at the classBody seam — the frozen router is untouched
import { markRimRefinedForSew, tryLaidBodyModel, type LaidBodyModel } from './laidBodyModel';
// UNIFICATION: the laid body renders through the ONE crafted renderer
// (InkedForm) via the adapter — no second re-implementation of the craft
import { buildLaidInkedModel } from './laidInkedModel';
// C.1 — type-only: the FUNCTION computeFieldForShape is never imported by any
// component module; it runs solely inside the worker (the call-graph claim)
import type { ShapeField } from '../lib/fieldForShape';
import type { FieldWorkRequest, FieldWorkResponse } from './fieldWorker';
import { InkedPlainForm } from './InkedPlainForm';
import {
  ApertureGatePanel,
  BirthGatePanel,
  ChordGatePanel,
  FoldGatePanel,
  FormOpsMenu,
  InvokePalette,
  OperationsDock,
  PortFacePicker,
  RecordStrip,
  SourcesShelf,
  ThickenGatePanel,
  type AperturePairRowView,
} from './ManuscriptChrome';
// GAP2B THE 8TH WORD — thicken(shape, segment): the committed Q1 gate assigns
// the pair's roles (the ONE place "must be a segment" is judged); the store's
// own door fires the arity-2 product and shelves the band
import { segmentGateReason } from '../lib/thicken';
import { useGeometryStore } from '../store/geometryStore';
// H2 THE PERSON'S HANDS — the two gestures' react-free model: the fold (the
// 7th dock word over customGluing's committed seam) and the aimed chord (the
// committed subdivideFace as a person gesture + the combine fork). The view
// only places its results; every verdict is the model's.
import {
  applyChordToWritten,
  applyFoldTo,
  applyGateChords,
  chordSplitFor,
  combineForkFor,
  foldCommitEnabled,
  foldGateReason,
  foldPreviewFor,
  foldRimEdges,
  forkOfferLabel,
  tapFoldEdge,
  toggleFoldPairMode,
  type ChordAim,
  type ForkOffer,
  type FoldState,
} from './handGestureModel';
// CUT 1 THE FAITHFUL BODY — the cone family's cell model (apex · seam · rim);
// the view only PLACES its certified placements in the two ink registers
import type { FaithfulBodyModel } from './faithfulBodyModel';
// RECOGNITION (2026-07-23): the class restored through the committed
// classifier (not-frozen card layer), the NAME register's total lookup, and
// the seam's provenance mark — the fold's letter + the on-select ghosts
import { acquireFaithfulComplex as acquireForCard, classifyComplexComponent, classLabel } from './surfaceClassifier';
import { surfaceNameFor } from './surfaceName';
import { foldSeamProvenance, type SeamProvenance } from './handGestureModel';
// THE APERTURE (engineer-chartered 2026-07-13, designer-ruled ADR 0004): the
// person builds a 3-manifold (map-picked pairs — the mode is DERIVED, never
// chosen) and stands inside it — image-space transport on the engine's own
// gluing isometries; the registers invert (world = the aperture; specimen =
// the relocated fundamental domain + pairings + tower).
import { ApertureBody } from './ApertureView';
import {
  apertureCaption,
  aperturePairingRefusal,
  buildAperture,
  buildApertureScene,
  buildPersonDomainVerdict,
  describeCandidate,
  dihedralMapCandidates,
  subdivideAndReadPersonDomain,
  traceAperture,
  type AperturePairRow,
  type FoldedDomain,
} from './apertureModel';
import { createSeedShape } from '../data/seeds';
// THE PROBES (2026-07-14): the real scans — the mask, held in a hand. The
// mask does recurrence; THE HAND does chirality (a face is its own mirror).
import { buildProbeMeshes } from './apertureProbes';
import {
  birthChild,
  combineGateFor,
  footRecord,
  genesisStoryShapes,
  loadUniverseSnapshot,
  placeShelfEntry,
  readGenesis,
  type ShelfEntry,
} from './genesisModel';
import { useLiftStore } from '../store/liftStore';
import { deriveOptionBGenerators, type OptionBReading } from './optionBModel';
import { readClassBodySpecimen } from './classBodyModel';
import type { Vec3 } from '../types/geometry';

// hands the live R3F camera up to the DOM layer (shelf drag-drop unprojection)
function CameraGrab({ onReady }: { onReady: (camera: Camera) => void }) {
  const camera = useThree((state) => state.camera);
  useEffect(() => onReady(camera), [camera, onReady]);
  return null;
}

// craft round-2: the birth-cue — a brief expanding pulse where the child
// settled (UX only, adds no mark; deterministic frame-delta timing, no clocks)
function BirthCuePulse({
  center,
  duration,
  maxRadius,
  color,
  onDone,
}: {
  center: [number, number, number];
  duration: number;
  maxRadius: number;
  color: string;
  onDone: () => void;
}) {
  const ref = useRef<Mesh>(null);
  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    const p = Math.min(1, elapsed.current / Math.max(0.1, duration));
    const mesh = ref.current;
    if (mesh) {
      mesh.scale.setScalar(0.25 + p * maxRadius);
      (mesh.material as MeshBasicMaterial).opacity = 0.85 * (1 - p);
    }
    if (p >= 1) onDone();
  });
  return (
    <mesh ref={ref} position={center} renderOrder={5}>
      <ringGeometry args={[0.86, 1, 48]} />
      <meshBasicMaterial color={color} transparent depthWrite={false} />
    </mesh>
  );
}

const DIM2_TITLES: Record<string, string> = {
  torus: 'Torus (T²)',
  klein: 'Klein bottle (K²)',
  rp2: 'RP² (cross-cap)',
  sphere: 'Sphere (S²)',
  cylinder: 'Cylinder',
  mobius: 'Möbius band',
};

// CUT 0 — the reference summon's word per surface: the six committed preset
// ops (the dock's own words), measured to birth exactly WORLD_SURFACES
const REFERENCE_OPS: Record<string, string> = {
  torus: 'glue-torus',
  klein: 'flip-glue-klein',
  rp2: 'flip-glue',
  sphere: 'collapse-sphere',
  cylinder: 'glue-cylinder',
  mobius: 'flip-glue-mobius',
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

// CUT 1 — THE FAITHFUL BODY (stage 1, the cone family): the person's OWN
// cells, placed by the model, drawn in the designer's registers — every class
// exactly once (LAW A): a dot per vertex-class, ONE thin stroke per seam
// (cell register), ONE heavy stroke per rim edge-class closing the boundary
// circle (LAW B), the one face a flat translucent disk (LAW E: a drawing that
// implies no curvature, no symmetry, no orientation). No other ink.
function FaithfulBody({
  model,
  seamColor,
  rimColor,
  seamWidth,
  rimWidth,
  bodyColor,
  bodyOpacity,
  seamMark,
  selected,
  accent,
  ghostColor,
}: {
  model: FaithfulBodyModel;
  seamColor: string;
  rimColor: string;
  seamWidth: number;
  rimWidth: number;
  bodyColor: string;
  bodyOpacity: number;
  // RECOGNITION (designer-ruled): the seam is an IDENTIFICATION edge — at rest
  // it wears the fold's letter (same cell-ink weight — the LABEL carries the
  // meaning, not a heavier stroke); on select it highlights warm and the two
  // SOURCE edges ghost back in the memory register (dashed pencil). Provenance
  // only — no metric, no geometry; null ⇒ the unlabeled fallback (the seam
  // still warms on select as "your fold").
  seamMark: SeamProvenance | null;
  selected: boolean;
  accent: string;
  ghostColor: string;
}) {
  const marked = seamMark ? model.seams.find((s) => s.id === seamMark.seamEdgeId) ?? null : null;
  const seamAngle = marked ? Math.atan2(marked.to[1] - marked.from[1], marked.to[0] - marked.from[0]) : 0;
  const ghostAngles = [seamAngle + 0.24, seamAngle - 0.24];
  return (
    <group>
      <mesh renderOrder={-2}>
        <circleGeometry args={[model.faceDisk.radius, model.faceDisk.segments]} />
        <meshBasicMaterial color={bodyColor} transparent opacity={bodyOpacity} depthWrite={false} />
      </mesh>
      {selected && marked
        ? // ON SELECT — the two source edges ghost back, flanking the seam they
          // became (dashed, pencil tone: the memory register, unconfusable with
          // cell ink; drawn only while the reading is summoned)
          ghostAngles.map((angle, k) => (
            <Line
              key={`ghost:${k}`}
              points={[
                [0, 0, 0.008],
                [Math.cos(angle) * model.faceDisk.radius, Math.sin(angle) * model.faceDisk.radius, 0.008],
              ]}
              color={ghostColor}
              lineWidth={Math.max(1, seamWidth * 0.9)}
              dashed
              dashScale={12}
              dashSize={0.6}
              gapSize={0.5}
            />
          ))
        : null}
      {model.seams.map((seam) => (
        <Line
          key={seam.id}
          points={[
            [seam.from[0], seam.from[1], 0.01],
            [seam.to[0], seam.to[1], 0.01],
          ]}
          color={selected ? accent : seamColor}
          lineWidth={seamWidth}
        />
      ))}
      {model.rimArcs.map((arc) => (
        <Line
          key={arc.id}
          points={arc.points.map((p) => [p[0], p[1], 0.015] as [number, number, number])}
          color={rimColor}
          lineWidth={rimWidth}
        />
      ))}
      {[model.apex, ...model.rimVertices].map((vertex) => (
        <mesh key={vertex.id} position={[vertex.position[0], vertex.position[1], 0.02]} renderOrder={2}>
          <circleGeometry args={[0.05, 24]} />
          <meshBasicMaterial color={rimColor} />
        </mesh>
      ))}
      {marked ? (
        // AT REST (and on select) — the identification letter beside the seam's
        // midpoint: the class the person ASSIGNED in the gesture (pair a). On
        // select a one-line caption joins it (working text; designer refines).
        <Html
          position={[(marked.from[0] + marked.to[0]) / 2 + 0.14, (marked.from[1] + marked.to[1]) / 2, 0.03]}
          distanceFactor={13}
          zIndexRange={[40, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', color: accent, whiteSpace: 'nowrap' }}>
            <span style={{ fontStyle: 'italic', fontSize: 15, fontWeight: 700 }}>{seamMark?.letter}</span>
            {selected ? (
              <span style={{ fontSize: 10, opacity: 0.85, marginLeft: 6 }}>
                your fold — two edges sewn into one
              </span>
            ) : null}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

// ---------------------------------------------------------------------------
// CYCLE-IDENTIFY (L23) — THE TRACE OVERLAY: the person traces two walks on
// the form's OWN edge classes. Every complex edge gets an INVISIBLE FATTENED
// PROXY COLLIDER (the designer's reach cure — pixel-exact clicking is the
// shipped defect this gesture must not inherit); an accepted edge draws a
// NIB STROKE — thick at the tail, thin at the head, running the TRACED
// direction (a stroke, never an arrow) — in the walk's OWN RESERVED ink
// (⛔ the INK LAW: never generators.a/.b, never seam/Σ ink — a traced walk
// is a person's pick, not a certified generator). While walk B is being
// traced, the i-th A-stroke LIGHTS as the i-th B-stroke lands (pairing
// legible at the only moment it is decided — no leader lines, no numerals).
// ---------------------------------------------------------------------------

// the walks' own reserved inks (provisional values — the designer holds the
// look; distinct species from generators.a #c2811d / .b #3e6db4, the seam
// ink, and the Σ ink, per the ratified ink law)
const TRACE_INK_A = '#8a4f6d';
const TRACE_INK_B = '#3f7d5c';

function CycleTraceOverlay({
  shape,
  complex,
  walkA,
  walkB,
  phase,
  onPickEdge,
}: {
  shape: Shape;
  complex: AcquiredComplex['complex'];
  walkA: Array<{ id: string; dir: 1 | -1 }>;
  walkB: Array<{ id: string; dir: 1 | -1 }>;
  phase: 'A' | 'B';
  onPickEdge: (edgeId: string, dir: 1 | -1) => void;
}) {
  const posOf = (vid: string): [number, number, number] | null => {
    const v = shape.vertices[vid];
    return v ? [v.position[0], v.position[1], v.position[2]] : null;
  };
  const inA = new Map(walkA.map((t, i) => [t.id, i]));
  const inB = new Map(walkB.map((t, i) => [t.id, i]));
  // the i-th A-edge lights while the i-th B-edge exists (pairing, live)
  const litA = new Set(walkB.map((_, i) => walkA[i]?.id).filter(Boolean));
  const nib = (u: [number, number, number], v: [number, number, number], dir: 1 | -1, ink: string, lit: boolean) => {
    const [tail, head] = dir === 1 ? [u, v] : [v, u];
    const lerp = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
      a[0] + (b[0] - a[0]) * t,
      a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t,
    ];
    const w = lit ? 5.2 : 3.4; // the lit pair reads heavier, same ink
    return (
      <group>
        <Line points={[tail, lerp(tail, head, 0.55)]} color={ink} lineWidth={w} renderOrder={14} />
        <Line points={[lerp(tail, head, 0.55), lerp(tail, head, 0.85)]} color={ink} lineWidth={w * 0.62} renderOrder={14} />
        <Line points={[lerp(tail, head, 0.85), head]} color={ink} lineWidth={w * 0.32} renderOrder={14} />
      </group>
    );
  };
  return (
    <group>
      {complex.edges.map((edge) => {
        const u = posOf(edge.u);
        const v = posOf(edge.v);
        if (!u || !v) return null;
        const mid: [number, number, number] = [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2, (u[2] + v[2]) / 2];
        const len = Math.hypot(v[0] - u[0], v[1] - u[1], v[2] - u[2]) || 1;
        const aHit = inA.get(edge.id);
        const bHit = inB.get(edge.id);
        return (
          <group key={`trace:${edge.id}`}>
            {/* the fattened invisible proxy — the collider IS the reach fix */}
            <mesh
              position={mid}
              quaternion={quaternionFromUnitY([(v[0] - u[0]) / len, (v[1] - u[1]) / len, (v[2] - u[2]) / len])}
              onClick={(e) => {
                e.stopPropagation();
                // the traced direction: the endpoint NEARER the click is the
                // stroke's TAIL (the person starts the stroke where they touch)
                const p = e.point;
                const du = Math.hypot(p.x - u[0], p.y - u[1], p.z - u[2]);
                const dv = Math.hypot(p.x - v[0], p.y - v[1], p.z - v[2]);
                onPickEdge(edge.id, du <= dv ? 1 : -1);
              }}
            >
              <cylinderGeometry args={[0.16, 0.16, len, 6]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {/* a faint guide so every pickable class is visible while tracing */}
            {aHit === undefined && bHit === undefined ? (
              <Line points={[u, v]} color="#9a917e" lineWidth={1} transparent opacity={0.5} renderOrder={13} />
            ) : null}
            {aHit !== undefined ? nib(u, v, walkA[aHit].dir, TRACE_INK_A, phase === 'B' && litA.has(edge.id)) : null}
            {bHit !== undefined ? nib(u, v, walkB[bHit].dir, TRACE_INK_B, false) : null}
          </group>
        );
      })}
    </group>
  );
}

// the proxy cylinder's axis: rotate unit-Y onto the edge direction
function quaternionFromUnitY(dir: [number, number, number]): [number, number, number, number] {
  const from = new Vector3(0, 1, 0);
  const to = new Vector3(dir[0], dir[1], dir[2]);
  const q = new Quaternion().setFromUnitVectors(from, to);
  return [q.x, q.y, q.z, q.w];
}

// UNIFICATION — the LAID CELL OVERLAY: the thin register that rides ON TOP of
// the one crafted renderer (InkedForm draws the body, hull, hatching, the
// person's cell curves as construction ink, and the certified loops — via the
// laidInkedModel adapter). This overlay keeps ONLY what the crafted stack does
// not own: the vertex-class DOTS (LAW A's countable first look, ghosted where
// a class lands on the locus), CUT 2's pale-broken crossing ink (locus +
// bridge stubs), and the rim register (LAW B). No accent, no cell-ink theft —
// selection never wears a generator hue here.
function LaidCellOverlay({
  model,
  rimColor,
  ghostColor,
}: {
  model: LaidBodyModel;
  rimColor: string;
  ghostColor: string;
}) {
  // CUT 2 — the crossing register's ink plan: crossed edges break at the
  // locus and a pale stub bridges each break; the locus itself is the
  // pale-broken ghost (the drawing's crossing — never a cell, so it wears
  // no cell ink and no dot).
  // a person's vertex whose (u,v) lands ON the locus is DRAWN GHOSTED (both
  // sheets meet at its one 3D point) — never dropped, never re-minted
  const ghostVertexIds = useMemo(
    () => new Set((model.crossing?.vertexGhosts ?? []).map((g) => g.vertexId)),
    [model],
  );
  const ghostOpacity = Math.max(model.crossing?.ghostFloor ?? 0.3, 0.3);
  return (
    <group>
      {(model.crossing?.brokenEdges ?? []).map((broken) => (
        <group key={`stubs:${broken.edgeId}`}>
          {broken.stubs.map((points, k) => (
            <Line
              key={`stub:${k}`}
              points={points}
              color={ghostColor}
              lineWidth={1.1}
              dashed
              dashScale={14}
              dashSize={0.55}
              gapSize={0.5}
              transparent
              opacity={ghostOpacity}
              renderOrder={2}
            />
          ))}
        </group>
      ))}
      {(model.crossing?.locusCurves ?? []).map((points, k) => (
        <Line
          key={`locus:${k}`}
          points={points}
          color={ghostColor}
          lineWidth={1.4}
          dashed
          dashScale={10}
          dashSize={0.5}
          gapSize={0.45}
          transparent
          opacity={ghostOpacity}
          depthTest={false}
          depthWrite={false}
          renderOrder={3}
        />
      ))}
      {model.rimArcs.map((arc) => (
        <Line key={arc.id} points={arc.points} color={rimColor} lineWidth={4} />
      ))}
      {model.vertexDots.map((dot) => {
        const ghosted = ghostVertexIds.has(dot.id);
        return (
          <mesh key={dot.id} position={dot.position} renderOrder={2}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial
              color={ghosted ? ghostColor : rimColor}
              transparent={ghosted}
              opacity={ghosted ? ghostOpacity : 1}
            />
          </mesh>
        );
      })}
    </group>
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
              ? 'no generator loops drawn'
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

// R4(a): THE ONE FACE-LABELER — the person-facing face label, minted once.
// Byte-identical to the three inline copies it replaces (the face-pick card and
// the birth gate's two port menus). The aperture rows keep their own SHORT
// convention (:836) and engine strings never route here.
const faceLabel = (face: Face): string => `${face.id} · ${face.vertexIds.length} corners`;

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
    nearOpacity: { value: d.generators.nearOpacity, min: 0, max: 1, step: 0.05 }, // R4B
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
  // THE APERTURE'S CRAFT SURFACE (mandate §5.9 — exposed, the DESIGNER dials
  // it; no knob invents or moves a copy: the pixels are the engine's own
  // transported light, these shape only the ink laid over its values)
  const apertureCtl = useControls('world · aperture', {
    resolution: { value: d.world.aperture.resolution, min: 96, max: 224, step: 8 },
    level: { value: d.world.aperture.level, min: 2, max: 8, step: 1 },
    toneGamma: { value: d.world.aperture.toneGamma, min: 0.5, max: 2.5, step: 0.05 },
    contourWeight: { value: d.world.aperture.contourWeight, min: 0, max: 1, step: 0.05 },
    echoFade: { value: d.world.aperture.echoFade, min: 0.3, max: 1, step: 0.01 },
    maskTone: { value: d.world.aperture.maskTone, min: 0, max: 1.4, step: 0.02 },
    handTone: { value: d.world.aperture.handTone, min: 0, max: 1.4, step: 0.02 },
    scaffoldTone: { value: d.world.aperture.scaffoldTone, min: 0, max: 1, step: 0.02 },
    formTone: { value: d.world.aperture.formTone, min: 0, max: 1.4, step: 0.02 },
    rimSeed: { value: d.world.aperture.rimSeed, min: 0, max: 12, step: 1 },
  });
  // THE INK's dials (designer's spec 2026-07-14 — exposed, not dialed): the
  // void is paper, the line carries the form; none of these reaches the
  // tracer — the ink moves no copy.
  const inkCtl = useControls('world · aperture ink', {
    contourEchoFade: { value: d.world.aperture.contourEchoFade, min: 0.3, max: 1, step: 0.01 },
    contourGain: { value: d.world.aperture.contourGain, min: 0.5, max: 4, step: 0.05 },
    contourBlur: { value: d.world.aperture.contourBlur, min: 0.1, max: 2, step: 0.05 },
    hatchAngleA: { value: d.world.aperture.hatchAngleA, min: -90, max: 90, step: 1 },
    hatchAngleB: { value: d.world.aperture.hatchAngleB, min: -90, max: 90, step: 1 },
    hatchPeriod: { value: d.world.aperture.hatchPeriod, min: 2, max: 12, step: 0.5 },
    hatchWidth: { value: d.world.aperture.hatchWidth, min: 0.5, max: 6, step: 0.25 },
    hatchThresholdA: { value: d.world.aperture.hatchThresholdA, min: 0, max: 1, step: 0.02 },
    hatchThresholdB: { value: d.world.aperture.hatchThresholdB, min: 0, max: 1, step: 0.02 },
    darkSolid: { value: d.world.aperture.darkSolid, min: 0, max: 1, step: 0.02 },
    creaseThreshold: { value: d.world.aperture.creaseThreshold, min: 0.05, max: 1.5, step: 0.01 },
    depthBreakThreshold: { value: d.world.aperture.depthBreakThreshold, min: 0.005, max: 0.3, step: 0.005 },
  });
  const driftCtl = useControls('world · drift', {
    enabled: d.world.drift.enabled,
    amplitude: { value: d.world.drift.amplitude, min: 0, max: 0.8, step: 0.01 },
    speed: { value: d.world.drift.speed, min: 0, max: 0.25, step: 0.005 },
  });
  const genesisCtl = useControls('genesis · memory', {
    pencilTone: manuscriptDefaults.world.genesis.pencilTone,
    stemmaWidth: { value: manuscriptDefaults.world.genesis.stemmaWidth, min: 0.5, max: 3, step: 0.1 },
    stemmaOpacity: { value: manuscriptDefaults.world.genesis.stemmaOpacity, min: 0, max: 1, step: 0.05 },
    cueDuration: { value: manuscriptDefaults.world.genesis.birthCueDuration, min: 0.4, max: 3, step: 0.1 },
    cueRadius: { value: manuscriptDefaults.world.genesis.birthCueRadius, min: 1, max: 6, step: 0.2 },
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
    generatorNearOpacity: generatorsCtl.nearOpacity, // R4B — rides into every derived craft via the spreads
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
  // 3b: the second selection of the combine pair (shift-click)
  const [combineWith, setCombineWith] = useState<string | null>(null);
  // COMBINE IS THE CONNECTED SUM (2026-07-12): the person's picked PORT FACE
  // per page form (page key → committed face id). No default is ever taken —
  // the gate refuses until both sides are picked (faces[0] would be an
  // array-order artifact in the seam's location).
  const [portFaces, setPortFaces] = useState<Record<string, string>>({});
  // ----- 3a: written material (invoked + op-born — REAL committed Shapes) ----
  const [written, setWritten] = useState<Array<{ form: WrittenForm; home: [number, number, number] }>>([]);
  // CUT 1b — the laid bodies, keyed by shape id: computed ONCE at the moment a
  // classBody-routed form is born/placed (the same lineage the frozen router
  // used), consumed at the render/caption/card seams. A lay that walls simply
  // never enters the map — the committed class body stands untouched.
  const [laidBodies, setLaidBodies] = useState<Map<string, LaidBodyModel>>(new Map());
  // UNIFICATION — the adapter models, one per laid body: the InkedFormModel
  // the ONE crafted renderer draws (derived from the lay, never stored twice)
  const laidInkedById = useMemo(
    () => new Map([...laidBodies].map(([sid, m]) => [sid, buildLaidInkedModel(m)])),
    [laidBodies],
  );
  const seqRef = useRef(1);
  // GAP2C: hoisted above its first use (targetFor ~:1236, via the availability
  // memo) — a useRef declared after its reader is a TDZ ReferenceError that
  // crashed the manuscript on placing a form (P0, 2026-07-24).
  const shelfAncestorsRef = useRef<Map<string, Shape[]>>(new Map());
  const [invokeMenu, setInvokeMenu] = useState<{ x: number; y: number; world: [number, number] } | null>(null);
  const [formMenu, setFormMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  const [opNotice, setOpNotice] = useState<string | null>(null);
  // ----- 3b: the sources shelf (committed snapshot loads) --------------------
  const [shelf, setShelf] = useState<Array<{ entry: ShelfEntry; placed: boolean }>>([]);
  const dragIndexRef = useRef<number | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  // craft round-2: the birth-cue (the child settles AMBIENT; the cue announces it)
  const [birthCue, setBirthCue] = useState<{ key: number; home: [number, number, number] } | null>(null);
  // ----- H2 THE PERSON'S HANDS ----------------------------------------------
  // the fold panel's gesture state, keyed to the selected form (a selection
  // change hides the panel; reopening starts a fresh word)
  const [fold, setFold] = useState<{ targetKey: string } & FoldState | null>(null);
  // the chord panel: 'reshape' acts on the standing written form in place
  // (refine is not a birth); 'gate' composes the person's aim onto the combine
  // gate's shape (the same pattern as the gate's committed 1-face refine)
  const [chord, setChord] = useState<{
    targetKey: string;
    faceId: string;
    cornerA: string | null;
    cornerB: string | null;
    targetLen: number | null;
    mode: 'reshape' | 'gate';
  } | null>(null);
  // the person's aimed chords per page key, applied to the GATE shape only
  const [gateChords, setGateChords] = useState<Record<string, ChordAim[]>>({});
  // CYCLE-IDENTIFY (L23) — the trace state: two walks, each edge with its
  // traced direction; the MODE IS THE DIRECTION (no control anywhere). The
  // entry gate (D2) fires at open, before any tracing; a live notice carries
  // the D1/D3 doors' sentences.
  const [cycleTrace, setCycleTrace] = useState<{
    targetKey: string;
    phase: 'A' | 'B';
    walkA: Array<{ id: string; dir: 1 | -1 }>;
    walkB: Array<{ id: string; dir: 1 | -1 }>;
    entryRefusal: string | null;
    notice: string | null;
  } | null>(null);
  // the reach fix, half (b): a miss during a trace must NOT discard the held
  // walk — the pointer-missed clear is TRACE-GUARDED through this ref
  const cycleTraceRef = useRef(false);
  useEffect(() => {
    cycleTraceRef.current = cycleTrace !== null;
  }, [cycleTrace]);
  // the last combine attempt's rim-mismatch refusal + the fork it offers
  const [combineRefusal, setCombineRefusal] = useState<{ reason: string; fork: ForkOffer } | null>(null);
  // GAP2B — the thicken panel's open state (the 8th dock word's chip toggles it)
  const [thickenOpen, setThickenOpen] = useState(false);
  const closeMenus = useCallback(() => {
    setInvokeMenu(null);
    setFormMenu(null);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setSelected(null);
        setCombineWith(null);
        setFold(null);
        setChord(null);
        setGateChords({});
        setCombineRefusal(null);
        setThickenOpen(false);
        setCycleTrace(null);
        closeMenus();
      }
    };
    const onDown = (): void => closeMenus(); // menus stopPropagation on their own mousedown
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [closeMenus]);
  // click selects the specimen; SHIFT-click a second form arms the combine pair
  const pick = useCallback((id: string, shiftKey = false) => {
    if (shiftKey) {
      setSelected((cur) => {
        if (cur && cur !== id) {
          setCombineWith(id);
          return cur;
        }
        setCombineWith(null);
        return id;
      });
      return;
    }
    setCombineWith(null);
    setSelected((cur) => (cur === id ? null : id));
  }, []);
  const anySelected = selected !== null;

  // the committed engine does all the deriving; the view only places the results
  const world = useMemo(() => buildManuscriptWorld(layoutCtl.resolution), [layoutCtl.resolution]);
  // THE APERTURE: the person's OWN built 3-manifolds join the dim-3 register
  // beside the committed T³ (worldModel byte-unchanged; the door is the
  // committed buildFormDomain behind buildPersonDomain).
  const cubeSeed = useMemo(() => createSeedShape('cube'), []);
  const [builtDomains, setBuiltDomains] = useState<DomainModel[]>([]);
  // 0.2 THE ORBIFOLD'S BODY: the folded verdicts' tower-less bodies — a
  // SIBLING list, never mixed into dim3All (the specimen register and every
  // DomainModel consumer stay untouched; a folded body has no tower to read).
  const [foldedBodies, setFoldedBodies] = useState<FoldedDomain[]>([]);
  const builtCountRef = useRef(0);
  const [apertureOpen, setApertureOpen] = useState(false);
  const emptyApertureRows = (): AperturePairRow[] => [
    { faceA: null, faceB: null, candidateKey: null },
    { faceA: null, faceB: null, candidateKey: null },
    { faceA: null, faceB: null, candidateKey: null },
  ];
  const [apertureRows, setApertureRows] = useState<AperturePairRow[]>(emptyApertureRows);
  const [apertureNotice, setApertureNotice] = useState<string | null>(null);
  // THE SUBDIVISION (ARC 0.1): the rows whose glue came back FOLDED — held so
  // the wall's cure (subdivide) acts on exactly the identification that folded.
  const [apertureFoldedRows, setApertureFoldedRows] = useState<AperturePairRow[] | null>(null);
  const [placedForms, setPlacedForms] = useState<Record<string, string>>({});
  const [displacedRooms, setDisplacedRooms] = useState<Record<string, boolean>>({});
  const probeMeshes = useMemo(() => buildProbeMeshes(), []);
  const dim3All = useMemo(() => [...world.dim3, ...builtDomains], [world, builtDomains]);

  // ----- Option B (follow-on): certified generators for plain-rendered forms —
  // globalW1's own basis cycles, canonically barycentric-placed (optionBModel);
  // derived once per written shape; b₁=0 forms carry none (unchanged)
  const optionBByShape = useMemo(() => {
    const map = new Map<string, OptionBReading>();
    for (const entry of written) {
      if (entry.form.render.mode !== 'plain') continue;
      const shape = entry.form.render.shape;
      try {
        map.set(shape.id, deriveOptionBGenerators(shape));
      } catch {
        // a bridge-refused complex (e.g. the degenerate self-loop dual of a
        // born single-face surface) draws NO marks — its card already reads
        // the honest n-a; nothing is invented, nothing crashes
      }
    }
    return map;
  }, [written]);

  // P-IMMERSE §5 — the marked junction: the classifier's own junction edge ids
  // (carried on the plain render) become segments over the shape's REAL
  // positions; the ink is a knobbed craft constant, the SET is the model's
  const junctionSegmentsByShape = useMemo(() => {
    const map = new Map<string, Vec3[][]>();
    for (const entry of written) {
      const render = entry.form.render;
      if (render.mode !== 'plain' || !render.junctionEdgeIds?.length) continue;
      const wanted = new Set(render.junctionEdgeIds);
      const segments: Vec3[][] = [];
      for (const edge of render.shape.edges) {
        if (!wanted.has(edge.id)) continue;
        const u = render.shape.vertices[edge.vertexIds[0]]?.position;
        const v = render.shape.vertices[edge.vertexIds[1]]?.position;
        if (u && v) segments.push([[...u], [...v]]);
      }
      if (segments.length) map.set(render.shape.id, segments);
    }
    return map;
  }, [written]);

  // ----- C.1 THE FIELD IN THE SPECIMEN: the SELECTED specimen's own field, ---
  // ----- computed OFF-THREAD on the DRAWN body (the repo's FIRST worker) -----
  // THE ONE-COMPLEX LAW (BornFormView's committed clause): the mesh and its
  // field must share one complex — the worker receives the EXACT shape the
  // plate draws (`component.body` on the classBody route, `render.shape` on
  // the plain route), and the result is keyed by that shape's id so it can
  // never dress a different mesh. The pipeline is ~n³ on the drawn body's
  // sites and there is no resolution rescue (the drawn bodies are fixed per
  // class), hence the worker + the `fieldComputing` state.
  const [specimenField, setSpecimenField] = useState<{ shapeId: string; field: ShapeField } | null>(
    null,
  );
  const [fieldComputing, setFieldComputing] = useState<string | null>(null);
  const fieldCacheRef = useRef(new Map<string, ShapeField>());
  const selectedDrawnBody = useMemo((): Shape | null => {
    if (!selected) return null;
    const [band, key] = selected.split(':');
    if (band !== 'w') return null;
    const entry = written.find((w) => w.form.id === key);
    if (!entry) return null;
    const render = entry.form.render;
    // the two InkedPlainForm plates; immersion/skeleton routes carry no field layer
    if (render.mode === 'classBody') return render.model.components[0]?.body ?? null;
    if (render.mode === 'plain') return render.shape;
    return null;
  }, [selected, written]);
  useEffect(() => {
    if (!selectedDrawnBody) {
      setSpecimenField(null);
      setFieldComputing(null);
      return;
    }
    const cached = fieldCacheRef.current.get(selectedDrawnBody.id);
    if (cached) {
      setSpecimenField({ shapeId: selectedDrawnBody.id, field: cached });
      setFieldComputing(null);
      return;
    }
    setSpecimenField(null);
    setFieldComputing(selectedDrawnBody.id);
    const worker = new Worker(new URL('./fieldWorker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<FieldWorkResponse>) => {
      const message = event.data;
      if (message.shapeId !== selectedDrawnBody.id) return;
      setFieldComputing(null);
      if (message.ok) {
        fieldCacheRef.current.set(message.shapeId, message.field);
        setSpecimenField({ shapeId: message.shapeId, field: message.field });
      } else {
        // the engine's own wall (e.g. the bridge's PARALLEL-edge-classes
        // refusal): the plate stays bare — a missing mark is a missing value,
        // never routed around
        setSpecimenField(null);
      }
      worker.terminate();
    };
    const request: FieldWorkRequest = { shapeId: selectedDrawnBody.id, shape: selectedDrawnBody };
    worker.postMessage(request);
    return () => {
      worker.terminate();
      setFieldComputing(null);
    };
  }, [selectedDrawnBody]);

  // the analytic reading — built ON SELECT from the committed certifiers'
  // readouts (specimenModel/writtenFormModel), cleared on deselect: summoned,
  // never ambient
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
    if (band === 'w') {
      const entry = written.find((w) => w.form.id === key);
      if (!entry) return null;
      const render = entry.form.render;
      // REFINE'S WORD — the resolution rows, keyed on PRESENCE of
      // `genealogy.resolution`: the form's OWN shape first (FIX 2b — the
      // person's direct subdivide carries its record ALONGSIDE the birth
      // word, so the reshaped form speaks on ITS OWN card), then the carried
      // parents that entered this birth refined. A row, never a birth line
      // (the stemma rightly draws nothing for a resolution).
      const resolutionRows = (() => {
        const sources = [entry.form.shape, entry.form.parentShape, ...(entry.form.parentShapes ?? [])].filter(
          (p): p is Shape => p !== null && p !== undefined,
        );
        const seen = new Set<string>();
        const rows: { label: string; value: string }[] = [];
        for (const parent of sources) {
          const trace = parent.genealogy.resolution;
          if (!trace || seen.has(parent.id)) continue;
          seen.add(parent.id);
          rows.push({
            label: 'resolution',
            value: `refined · ${trace.passes} pass${trace.passes === 1 ? '' : 'es'} · ${
              trace.chordEdgeId ? `chord ${trace.chordEdgeId}` : 'no chord'
            } · carrier ${Object.keys(trace.carrier).length} cells new→old · of ${
              parent.id === entry.form.shape.id ? 'this form' : parent.name || parent.id
            }`,
          });
        }
        return rows;
      })();
      const speak = (r: SpecimenReading): SpecimenReading =>
        resolutionRows.length === 0 ? r : { ...r, rows: [...r.rows, ...resolutionRows] };
      if (render.mode === 'immersion') {
        const base = readSurfaceSpecimen(render.model);
        return speak({ ...base, title: entry.form.title, subtitle: `${entry.form.provenance} · ${base.subtitle}` });
      }
      if (render.mode === 'skeleton') {
        const base = readSkeletonSpecimen(render.model);
        return speak({ ...base, title: entry.form.title, subtitle: entry.form.provenance });
      }
      if (render.mode === 'classBody') {
        // CUT 1b — a LAID form's card: the form's own certified rows plus the
        // counted caption. The honest-representative frame does NOT ride a
        // laid body — the drawn cells ARE the person's, so that sentence
        // would now be false; the class row still speaks the classifier.
        const laid = laidBodies.get(entry.form.shape.id);
        if (laid) {
          const base = readPlainSpecimen(entry.form.title, entry.form.provenance, laid.invariants, laid.h1Label);
          // UNIFICATION — the basis is DRAWN now, and the card's legend names
          // it (retiring the tourniquet fallback for every laid form with
          // loops): one entry per drawn certified loop, in the ink it wears
          // (a core draws in ink a — the committed craft's own rule).
          const laidInked = laidInkedById.get(entry.form.shape.id);
          return speak({
            ...base,
            rows: [
              {
                label: 'cells V·E·F',
                value: `${laid.counts.v} · ${laid.counts.e} · ${laid.counts.f}`,
                emphasize: true,
              },
              {
                label: 'boundary',
                value: `${laid.boundaryCircles} circle${laid.boundaryCircles === 1 ? '' : 's'}`,
              },
              // CUT 2 — the crossing declares the DRAWING, in the designer's
              // words: never a real edge of the form, never a cell
              ...(laid.crossing
                ? [{ label: `crossings · ${laid.crossing.count}`, value: laid.crossing.caption }]
                : []),
              ...(laid.note ? [{ label: 'note', value: laid.note }] : []),
              ...base.rows.map((row) => (row.label === 'class' ? { ...row, value: laid.classLabel } : row)),
            ],
            legend: (laidInked?.loops ?? []).map((loop) => ({
              key: loop.label,
              text: `${loop.label} — certified H₁ generator (globalW1 basis), drawn on the body`,
              ink: 'a' as const,
            })),
          });
        }
        // P-IMMERSE: the form's OWN certified invariants + the honest frame +
        // the body's drawn certified generators, named (classBodyModel)
        return speak(readClassBodySpecimen(entry.form.title, entry.form.provenance, render.model));
      }
      if (render.mode === 'faithful') {
        // CUT 1 — the counted caption (EYE-CHECK 1): the card prints V/E/F OF
        // THE COMPLEX and the boundary-circle count (LAW B's trace companion);
        // the certified rows beneath are the tower's, verbatim.
        // RECOGNITION — the class row restored through the COMMITTED classifier
        // (computed here, the not-frozen card layer; frozen files untouched)
        // and the NAME row: the total lookup's OUTPUT, never hand-typed — an
        // unnamed triple prints its arithmetic + the flagged missing row.
        const base = readPlainSpecimen(
          entry.form.title,
          entry.form.provenance,
          render.model.invariants,
          render.model.h1Label,
        );
        // a readout must NEVER crash the app: acquireComplex can THROW (a
        // disconnected-region lift's restrict refuses BY NAME; GAP2C) and this
        // path was unguarded — degrade to the plain card on any throw, exactly
        // as the shelf-ingest guards its own drain (latent P0, L4).
        const cls = (() => {
          try {
            const a = acquireForCard(entry.form.shape, entry.form.parentShape);
            return a ? classifyComplexComponent(a.complex) : null;
          } catch {
            return null;
          }
        })();
        const classValue = cls && cls.ok ? classLabel(cls.class) : null;
        const nameReading = cls && cls.ok ? surfaceNameFor(cls.class) : null;
        return speak({
          ...base,
          rows: [
            ...(nameReading
              ? [
                  nameReading.named
                    ? { label: 'name', value: nameReading.name, emphasize: true }
                    : {
                        label: 'name',
                        value: `${nameReading.arithmetic} · ⚠ missing table row ${nameReading.missingRow}`,
                      },
                ]
              : []),
            {
              label: 'cells V·E·F',
              value: `${render.model.counts.v} · ${render.model.counts.e} · ${render.model.counts.f}`,
              emphasize: true,
            },
            {
              label: 'boundary',
              value: `${render.model.boundaryCircles} circle${render.model.boundaryCircles === 1 ? '' : 's'}`,
            },
            ...base.rows.map((row) =>
              row.label === 'class' && classValue !== null ? { ...row, value: classValue } : row,
            ),
          ],
        });
      }
      if (render.mode === 'bodiless') {
        // THE BODILESS CARD's reading: the genealogy + the refusal; the
        // committed invariant rows join ONLY when the readout computed —
        // a pinch that refuses certification shows none (never fabricated)
        const base = render.invariants
          ? readPlainSpecimen(entry.form.title, entry.form.provenance, render.invariants, null)
          : null;
        return speak({
          ...(base ?? {
            kind: 'surface' as const,
            title: entry.form.title,
            subtitle: entry.form.provenance,
            rows: [],
            legend: [],
            twist: null,
          }),
          rows: [
            { label: 'enacted', value: render.shape.genealogy.operation, emphasize: true },
            { label: 'no faithful body', value: render.reason },
            ...(base ? base.rows : []),
          ],
        });
      }
      const base = readPlainSpecimen(entry.form.title, entry.form.provenance, render.invariants, render.h1Label);
      // Option B: name the drawn certified generators in the summoned legend
      const optionB = optionBByShape.get(render.shape.id);
      return speak(
        optionB && optionB.b1 > 0
          ? {
              ...base,
              legend: optionB.generators.map((generator, k) => ({
                key: generator.label,
                text: `${generator.label} — certified H₁ generator (globalW1 basis)`,
                ink: (k % 2 === 0 ? 'a' : 'b') as 'a' | 'b',
              })),
            }
          : base,
      );
    }
    const model = dim3All.find((m) => m.key === key);
    return model ? readDomainSpecimen(model) : null;
  }, [selected, world, written, optionBByShape, dim3All, laidBodies, laidInkedById]);

  // ----- 3a: the op target + the committed availability + the apply path -----
  const rows = d.world.rows;
  const bands = d.world.bands;
  const centered = (k: number, n: number, gap: number): number => (k - (n - 1) / 2) * gap;

  // REGISTRY UNBOUNDING (2026-07-11): the page's shape lookup — the REAL
  // lineage walk resolves each target's full ancestry over the world's and
  // the written forms' shapes (parents included), never a fabricated list.
  const shapeById = useMemo(() => {
    const map = new Map<string, Shape>();
    world.dim1.forEach((m) => map.set(m.shape.id, m.shape));
    world.dim2.forEach((m) => map.set(m.immersion.shape.id, m.immersion.shape));
    dim3All.forEach((m) => map.set(m.shape.id, m.shape));
    written.forEach((w) => {
      map.set(w.form.shape.id, w.form.shape);
      if (w.form.parentShape) map.set(w.form.parentShape.id, w.form.parentShape);
    });
    return map;
  }, [world, written, dim3All]);

  // THE APERTURE per dim-3 domain: the GATE first (unsound · fit refusal ⇒
  // DRAW NOTHING, SAY SO — the refusal IS the caption; B.0: a sound cone form
  // draws — k≠4 is a cone edge, never a curved ambient), else the
  // image-space trace — the room populated by the mask, the coil, and whatever
  // form the person placed. Copies are what the light does, never drawn.
  const apertures = useMemo(
    () =>
      dim3All.map((model) => {
        const gate = buildAperture(model);
        if (!gate.ok) {
          return { key: model.key, gate, trace: null, caption: gate.reason };
        }
        const placedId = placedForms[model.key];
        const placedShape = placedId ? shapeById.get(placedId) ?? null : null;
        // BOUND 1 (mothership): the probes are DEFAULTS, not permanent
        // furniture — a placed form can DISPLACE them (the scene recomposes
        // from the same committed pieces: the form's mesh, the cell's rods).
        const probes = [...probeMeshes.maskShells, probeMeshes.hand];
        const base = buildApertureScene(model.shape, placedShape, probes);
        const scene =
          placedShape && displacedRooms[model.key]
            ? { meshes: base.meshes.slice(probes.length), capsules: [], rods: base.rods, rodRadius: base.rodRadius }
            : base;
        const trace = traceAperture({
          deck: gate.deck,
          scene,
          width: apertureCtl.resolution,
          height: apertureCtl.resolution,
          craft: {
            level: apertureCtl.level,
            toneGamma: apertureCtl.toneGamma,
            contourWeight: apertureCtl.contourWeight,
            // echoFade deliberately absent (THE INK re-cut): the fade is the
            // ink's alone — the tracer's value carries darkness, never distance
            maskTone: apertureCtl.maskTone,
            handTone: apertureCtl.handTone,
            scaffoldTone: apertureCtl.scaffoldTone,
            formTone: apertureCtl.formTone,
          },
        });
        return { key: model.key, gate, trace, caption: apertureCaption(gate.geometry, trace.counts) };
      }),
    [dim3All, placedForms, shapeById, apertureCtl],
  );
  // 0.2 — the folded bodies' apertures: the SAME committed gate → trace →
  // caption pipeline, keyed on the verdict's folded body (never on !sound —
  // the 336 broken patterns have no body and never reach this list).
  const foldedApertures = useMemo(
    () =>
      foldedBodies.map((body) => {
        const gate = buildAperture(body);
        if (!gate.ok) {
          return { key: body.key, gate, trace: null, caption: gate.reason };
        }
        const probes = [...probeMeshes.maskShells, probeMeshes.hand];
        const scene = buildApertureScene(body.shape, null, probes);
        const trace = traceAperture({
          deck: gate.deck,
          scene,
          width: apertureCtl.resolution,
          height: apertureCtl.resolution,
          craft: {
            level: apertureCtl.level,
            toneGamma: apertureCtl.toneGamma,
            contourWeight: apertureCtl.contourWeight,
            // echoFade deliberately absent (THE INK re-cut): the fade is the
            // ink's alone — the tracer's value carries darkness, never distance
            maskTone: apertureCtl.maskTone,
            handTone: apertureCtl.handTone,
            scaffoldTone: apertureCtl.scaffoldTone,
            formTone: apertureCtl.formTone,
          },
        });
        return { key: body.key, gate, trace, caption: apertureCaption(gate.geometry, trace.counts) };
      }),
    [foldedBodies, apertureCtl],
  );
  // the gate panel's rows with the MAP MENU — the face's own dihedral orbit;
  // each option prints its vertex correspondence + the DERIVED mode (recorded,
  // never chosen — the knob that lies does not exist here)
  const apertureRowViews = useMemo((): AperturePairRowView[] => {
    const allFaces = cubeSeed.faces.map((f) => ({ id: f.id, label: f.id.split(':').pop() as string }));
    const usedElsewhere = (rowIndex: number, except: 'A' | 'B'): Set<string> => {
      const used = new Set<string>();
      apertureRows.forEach((row, i) => {
        if (row.faceA && !(i === rowIndex && except === 'A')) used.add(row.faceA);
        if (row.faceB && !(i === rowIndex && except === 'B')) used.add(row.faceB);
      });
      return used;
    };
    return apertureRows.map((row, i) => {
      const takenA = usedElsewhere(i, 'A');
      const takenB = usedElsewhere(i, 'B');
      const mapChoices =
        row.faceA && row.faceB && row.faceA !== row.faceB
          ? dihedralMapCandidates(cubeSeed, row.faceA, row.faceB).map((c) => ({
              key: c.key,
              label: describeCandidate(c),
            }))
          : [];
      return {
        faceA: row.faceA ?? '',
        faceB: row.faceB ?? '',
        mapKey: row.candidateKey ?? '',
        faceChoicesA: allFaces.filter((f) => !takenA.has(f.id) || f.id === row.faceA),
        faceChoicesB: allFaces.filter((f) => !takenB.has(f.id) || f.id === row.faceB),
        mapChoices,
      };
    });
  }, [apertureRows, cubeSeed]);
  const apertureRefusal = useMemo(() => aperturePairingRefusal(cubeSeed, apertureRows), [cubeSeed, apertureRows]);
  const handleApertureGlue = useCallback(() => {
    try {
      builtCountRef.current += 1;
      const n = builtCountRef.current;
      // THE FOLDED EDGE (ADR 0022): the door returns a VERDICT — a folded
      // identification is not free (an orbifold), refused BY NAME with the
      // researcher's wall; nothing joins the world and the aperture draws
      // nothing. Zero throws escape this door.
      const verdict = buildPersonDomainVerdict(cubeSeed, apertureRows, `built-${n}`, `built 3-manifold ${n}`);
      if (verdict.folded) {
        // 0.2 THE ORBIFOLD'S BODY: the verdict carries a BODY now — it joins
        // the folded shelf and the aperture draws it. The wall + its cure
        // (0.1) stand untouched: the notice still speaks the researcher's
        // sentence and the subdivide door still opens on these exact rows.
        setFoldedBodies((cur) => [...cur, verdict.body]);
        setApertureNotice(verdict.wall);
        setApertureFoldedRows(apertureRows.map((row) => ({ ...row })));
        return;
      }
      const domain = verdict.domain;
      setBuiltDomains((cur) => [...cur, domain]);
      setApertureNotice(
        domain.tower.sound
          ? `glued — H₁ ${domain.tower.homology.H1.pretty} · the aperture opens in the dim-3 band`
          : 'glued — the S² gate refuses this pattern; the band says so and draws nothing',
      );
      setApertureRows(emptyApertureRows());
      setApertureFoldedRows(null);
    } catch (error) {
      builtCountRef.current -= 1;
      // a door-level refusal (an incomplete matching, an unknown candidate) — named
      setApertureNotice(`the engine refused: ${(error as Error).message}`);
      setApertureFoldedRows(null);
    }
  }, [cubeSeed, apertureRows]);
  // THE SUBDIVISION DOOR (ARC 0.1, LAW 14 — a cure must be a door, not a
  // theorem): on the folded verdict the person invokes subdivide — the seed is
  // bisected, the pairings lift, the form is re-glued, and the gate reads the
  // finer cells. ⛔ The notice CLAIMS NOTHING about the result: it speaks the
  // gate's own reading (the finer question is ARC 0.3, its own seal).
  const handleApertureSubdivide = useCallback(() => {
    if (!apertureFoldedRows) return;
    try {
      const { counts, reading } = subdivideAndReadPersonDomain(cubeSeed, apertureFoldedRows);
      const cellsLine = `${counts.v} v · ${counts.e} e · ${counts.f} f · ${counts.c} cell`;
      setApertureNotice(
        reading.folded
          ? `subdivided (${cellsLine}) — the gate STILL reads a fold at ${reading.foldedEdgeClasses.join(', ')}; report this`
          : reading.tower.sound
            ? `subdivided (${cellsLine}) — the fold is resolved; the gate reads: χ ${reading.tower.chi} · w₁ ${reading.tower.w1.w1} · H₁ ${reading.tower.homology.H1.pretty}`
            : `subdivided (${cellsLine}) — the fold is resolved; the S² gate now refuses the finer complex: ${reading.tower.gate.failures.map((f) => f.kind).join(', ')}`,
      );
      setApertureFoldedRows(null);
    } catch (error) {
      setApertureNotice(`the engine refused: ${(error as Error).message}`);
    }
  }, [cubeSeed, apertureFoldedRows]);
  const selectedDim3 = useMemo(
    () => (selected && selected.startsWith('dim3:') ? dim3All.find((m) => `dim3:${m.key}` === selected) ?? null : null),
    [selected, dim3All],
  );
  const placeableForms = useMemo(() => {
    const out: { id: string; label: string }[] = [];
    written.forEach((w) => out.push({ id: w.form.shape.id, label: w.form.title }));
    world.dim2.forEach((m) => out.push({ id: m.immersion.shape.id, label: m.surface }));
    return out;
  }, [written, world]);

  const targetFor = useCallback(
    (
      id: string | null,
    ): { shape: Shape; parent: Shape | null; ancestry: Shape[]; title: string; home: [number, number, number] } | null => {
      if (!id) return null;
      const [band, key] = id.split(':');
      if (band === 'dim1') {
        const k = world.dim1.findIndex((m) => m.key === key);
        if (k < 0) return null;
        const m = world.dim1[k];
        return {
          shape: m.shape,
          parent: null,
          ancestry: [],
          title: m.title,
          home: [centered(k, world.dim1.length, rows.dim1Spacing * scaleCtl.dim1Scale), rows.dim1Y, 0],
        };
      }
      if (band === 'dim2') {
        const k = world.dim2.findIndex((m) => m.surface === key);
        if (k < 0) return null;
        const m = world.dim2[k];
        return {
          shape: m.immersion.shape,
          parent: null,
          ancestry: [],
          title: DIM2_TITLES[m.surface] ?? m.surface,
          home: [centered(k, world.dim2.length, layoutCtl.spacing * scaleCtl.dim2Scale * 1.2), rows.dim2Y, 0],
        };
      }
      if (band === 'dim3') {
        const k = dim3All.findIndex((m) => m.key === key);
        if (k < 0) return null;
        const m = dim3All[k];
        return {
          shape: m.shape,
          parent: null,
          ancestry: [],
          title: m.title,
          home: [centered(k, dim3All.length, rows.dim3Spacing * scaleCtl.dim3Scale), rows.dim3Y, 0],
        };
      }
      const entry = written.find((w) => w.form.id === key);
      if (!entry) return null;
      // the REAL lineage walk (registry unbounding): the full ancestor chain
      // over the page's own shapes — the acquisition reaches every generation.
      // MULTI-PARENT DAG WALK (2026-07-12): the page's shapes ride along as
      // the candidate population, so a two-parent birth (assemble /
      // connectedSum — parentShapeId null by design) receives BOTH parents,
      // committed-birth order, where it received none.
      const ancestry = resolveLineage(
        entry.form.shape,
        (shapeId) => shapeById.get(shapeId),
        [...shapeById.values()],
      );
      // GAP2C: a shelf-loaded form's CARRIED chain rides as acquire-metadata
      // (the researcher's ruling) — appended to the lineage the ops and the
      // classifier consume, NEVER added to the page's visible population
      const carried = shelfAncestorsRef.current.get(entry.form.shape.id);
      return {
        shape: entry.form.shape,
        parent: entry.form.parentShape,
        ancestry: carried?.length ? [...ancestry, ...carried] : ancestry,
        title: entry.form.title,
        home: entry.home,
      };
    },
    [world, written, shapeById, rows, scaleCtl.dim1Scale, scaleCtl.dim2Scale, scaleCtl.dim3Scale, layoutCtl.spacing, dim3All],
  );

  // THE PERSON PICKS THE FACE (2026-07-12): the picked port/op face per page
  // form rides into every availability/apply context — never a faces[0]
  // default (a single-face form needs no pick; the model takes its only face)
  const availability = useMemo(() => {
    const target = targetFor(selected);
    return operationAvailabilityFor(
      target?.shape ?? null,
      target?.parent ?? null,
      target?.ancestry,
      selected ? portFaces[selected] ?? null : null,
    );
  }, [selected, targetFor, portFaces]);
  const menuAvailability = useMemo(() => {
    if (!formMenu) return [];
    const target = targetFor(formMenu.id);
    return operationAvailabilityFor(
      target?.shape ?? null,
      target?.parent ?? null,
      target?.ancestry,
      portFaces[formMenu.id] ?? null,
    );
  }, [formMenu, targetFor, portFaces]);

  const applyOp = useCallback(
    (operationId: string, targetId: string | null = selected): void => {
      const key = targetId ?? selected;
      const target = targetFor(key);
      if (!target) return;
      // P2 (DOORS batch) — the sew PREPARER rides the combine-prepare slot
      // (the withChords pattern): UNEQUAL rims are equalized (classes of the
      // shorter circle split, subdivision-invariant) before the committed op;
      // every other case passes through untouched and the committed doors
      // keep their own sentences.
      // CUT 1b: the preparer's verdict is KEPT — prepared:true is the one
      // measured moment the rims were refined for this sew, and the laid
      // body's designer note discloses it on the born form.
      const sewPrep = operationId.startsWith('sew-boundary')
        ? prepareFormForSew(target.shape, target.ancestry)
        : null;
      const opShape = sewPrep ? sewPrep.shape : target.shape;
      const result = applyPlaygroundOperationTo(
        operationId,
        opShape,
        target.parent,
        seqRef.current,
        layoutCtl.resolution,
        target.ancestry,
        key ? portFaces[key] ?? null : null,
      );
      closeMenus();
      if (!result.ok) {
        // THE BODILESS CARD: an ENACTED act persists even when its body
        // cannot draw — the ledger keeps the written word as a bodiless
        // card; only an INPUT-refused act stays a passing notice.
        if (result.enacted) {
          const enacted = result.enacted;
          seqRef.current += 1;
          setOpNotice(null);
          setWritten((cur) => [
            ...cur,
            { form: enacted, home: [target.home[0] + d.world.chrome.spawnOffset, target.home[1], 0] },
          ]);
          setSelected(`w:${enacted.id}`);
          return;
        }
        setOpNotice(`${operationId}: ${result.reason}`);
        return;
      }
      seqRef.current += 1;
      setOpNotice(null);
      // CUT 1b — THE L: a classBody-routed birth tries the general lay with
      // the SAME lineage the frozen router received ([opShape, …ancestry]);
      // success substitutes the drawn body only — the model, the card's
      // certified rows, and the frozen route stay exactly what they are.
      if (sewPrep?.prepared) markRimRefinedForSew(result.born.shape.id);
      if (result.born.render.mode === 'classBody') {
        const laid = tryLaidBodyModel(result.born.shape, [
          opShape,
          ...(target.ancestry ?? (target.parent ? [target.parent] : [])),
        ]);
        if (laid) {
          setLaidBodies((cur) => new Map(cur).set(result.born.shape.id, laid));
        }
      }
      setWritten((cur) => [
        ...cur,
        { form: result.born, home: [target.home[0] + d.world.chrome.spawnOffset, target.home[1], 0] },
      ]);
      setSelected(`w:${result.born.id}`);
    },
    [selected, targetFor, layoutCtl.resolution, closeMenus, d.world.chrome.spawnOffset, portFaces],
  );

  // the op-face picker for a selected MULTI-face form (the committed reused
  // picker; nothing preselected — the person picks, or the face-consuming op
  // stays honestly unavailable)
  const selectedFacePick = useMemo(() => {
    if (!selected || combineWith) return null;
    const target = targetFor(selected);
    if (!target || target.shape.faces.length <= 1) return null;
    return {
      title: target.title,
      faces: target.shape.faces.map((face) => ({
        id: face.id,
        label: faceLabel(face),
      })),
      picked: portFaces[selected] ?? '',
    };
  }, [selected, combineWith, targetFor, portFaces]);

  const handleInvoke = useCallback(
    (catalogueKey: string): void => {
      if (!invokeMenu) return;
      const form = invokePrimitive(catalogueKey, seqRef.current);
      seqRef.current += 1;
      setWritten((cur) => [...cur, { form, home: [invokeMenu.world[0], invokeMenu.world[1], 0] }]);
      setSelected(`w:${form.id}`);
      setOpNotice(null);
      closeMenus();
    },
    [invokeMenu, closeMenus],
  );

  // ----- CUT 0 — THE REFERENCE SUMMON (the gallery fix) ----------------------
  // The dim-2 band starts EMPTY (worldModel seeds nothing); the six references
  // enter ON DEMAND, and they enter the PERSON'S OWN WAY: each is an invoked
  // square + the committed preset word, through applyPlaygroundOperationTo →
  // routeWrittenRender — the exact seam the person's forms take (measured:
  // byte-identical models). NO direct inked-model bypass exists in this file
  // (a witness pins the count at zero), so a reference can never render nicer
  // than the person's own torus. The
  // consumed squares settle to pencil and the six births join the record —
  // the zoo shows its construction, which is the point.
  const [zooLoaded, setZooLoaded] = useState(false);
  const handleSummonZoo = useCallback((): void => {
    if (zooLoaded) return;
    const additions: Array<{ form: WrittenForm; home: [number, number, number] }> = [];
    for (let k = 0; k < WORLD_SURFACES.length; k += 1) {
      const surface = WORLD_SURFACES[k];
      const slotX = centered(k, WORLD_SURFACES.length, layoutCtl.spacing * scaleCtl.dim2Scale * 1.2);
      const host = invokePrimitive('square', seqRef.current);
      seqRef.current += 1;
      const born = applyPlaygroundOperationTo(
        REFERENCE_OPS[surface],
        host.shape,
        null,
        seqRef.current,
        layoutCtl.resolution,
        [],
        null,
      );
      if (!born.ok) {
        // fail-honest: no partial silent zoo — the committed reason speaks and
        // the button stays live (nothing from this sweep joins the page)
        setOpNotice(`${REFERENCE_OPS[surface]}: ${born.reason}`);
        return;
      }
      seqRef.current += 1;
      additions.push({ form: host, home: [slotX, rows.dim2Y - 3.1, 0] });
      additions.push({ form: born.born, home: [slotX, rows.dim2Y, 0] });
    }
    setWritten((cur) => [...cur, ...additions]);
    setZooLoaded(true);
    setOpNotice(null);
  }, [zooLoaded, layoutCtl.spacing, layoutCtl.resolution, scaleCtl.dim2Scale, rows.dim2Y]);

  // ----- 3b: the genesis reading — ONE committed DAG feeds pentimento + -----
  // ----- stemma + the foot-record (nothing hand-kept) ------------------------
  const genesis = useMemo(() => readGenesis(genesisStoryShapes(written)), [written]);
  const pentimentoShapeIds = genesis?.pentimentoIds ?? new Set<string>();
  const nameOfShapeId = useMemo(() => {
    const names = new Map<string, string>();
    world.dim1.forEach((m) => names.set(m.shape.id, m.title));
    world.dim2.forEach((m) => names.set(m.immersion.shape.id, DIM2_TITLES[m.surface] ?? m.surface));
    dim3All.forEach((m) => names.set(m.shape.id, m.title));
    written.forEach((w) => names.set(w.form.shape.id, w.form.title));
    return names;
  }, [world, written, dim3All]);
  const recordEntries = useMemo(
    () => (genesis ? footRecord(genesis, (id) => nameOfShapeId.get(id) ?? id) : []),
    [genesis, nameOfShapeId],
  );
  // shape.id → the page slot (for stemma endpoints), over world + written
  const homeOfShapeId = useMemo(() => {
    const homes = new Map<string, [number, number, number]>();
    world.dim1.forEach((m, k) =>
      homes.set(m.shape.id, [centered(k, world.dim1.length, rows.dim1Spacing * scaleCtl.dim1Scale), rows.dim1Y, 0]),
    );
    world.dim2.forEach((m, k) =>
      homes.set(m.immersion.shape.id, [
        centered(k, world.dim2.length, layoutCtl.spacing * scaleCtl.dim2Scale * 1.2),
        rows.dim2Y,
        0,
      ]),
    );
    dim3All.forEach((m, k) =>
      homes.set(m.shape.id, [centered(k, dim3All.length, rows.dim3Spacing * scaleCtl.dim3Scale), rows.dim3Y, 0]),
    );
    written.forEach((w) => homes.set(w.form.shape.id, w.home));
    return homes;
  }, [world, written, rows, scaleCtl.dim1Scale, scaleCtl.dim2Scale, scaleCtl.dim3Scale, layoutCtl.spacing, dim3All]);
  // the stemma: the committed reduced edges whose endpoints are on the page
  const stemmaLines = useMemo(() => {
    if (!genesis) return [];
    return genesis.reducedEdges
      .map((edge) => {
        const from = homeOfShapeId.get(edge.parent);
        const to = homeOfShapeId.get(edge.child);
        return from && to ? { key: `${edge.parent}->${edge.child}`, from, to } : null;
      })
      .filter((line): line is { key: string; from: [number, number, number]; to: [number, number, number] } =>
        Boolean(line),
      );
  }, [genesis, homeOfShapeId]);

  // ----- 3b: birth (the co-ratified CONNECTED SUM behind the visible gate; ---
  // ----- the person picks the port face on each form — never faces[0]) -------
  const combineGate = useMemo(() => {
    if (!selected || !combineWith) return null;
    const a0 = targetFor(selected);
    const b0 = targetFor(combineWith);
    if (!a0 || !b0) return null;
    // THE SUBDIVIDE PATH (C.1's item zero, 2026-07-16): connectedSum's single-
    // face wall refuses and names its own cure — "Subdivide first" — so the
    // gate performs it: a 1-face target enters the birth REFINED (refineToDisk,
    // the committed rim op; targetFor already carries the lineage). ONE refine
    // per target — the panel and handleCombine both read THIS shape, so the
    // person picks a port face on the SAME refined form the birth receives
    // (`…:disk` / `…:rest`, rendered unpicked — never a default, never
    // faces-dot-zero). refineToDisk is NOT total — it throws where the birth
    // word cannot be recovered (e.g. an invoked bare polygon): the target then
    // passes through UNREFINED and the committed refusal stands, as today.
    const subdivided = (t: NonNullable<ReturnType<typeof targetFor>>) => {
      if (t.shape.faces.length !== 1) return t;
      try {
        return { ...t, shape: refineToDisk(t.shape, t.parent).shape };
      } catch {
        return t;
      }
    };
    // H2 THE FORK — the person's aimed chords compose onto the gate's shape
    // (the page form untouched; the birth receives the shape the panel shows —
    // the exact pattern of the committed 1-face refine above). An empty aim
    // list leaves the shape byte-identical.
    const withChords = (t: NonNullable<ReturnType<typeof targetFor>>, key: string) => {
      const aims = gateChords[key];
      if (!aims || aims.length === 0) return t;
      return { ...t, shape: applyGateChords(t.shape, aims) };
    };
    const a = withChords(subdivided(a0), selected);
    const b = withChords(subdivided(b0), combineWith);
    const portFaceA = a.shape.faces.find((face) => face.id === portFaces[selected]) ?? null;
    const portFaceB = b.shape.faces.find((face) => face.id === portFaces[combineWith]) ?? null;
    return {
      a,
      b,
      aKey: selected,
      bKey: combineWith,
      portFaceA,
      portFaceB,
      gate: combineGateFor(a.shape, b.shape, portFaceA, portFaceB),
    };
  }, [selected, combineWith, targetFor, portFaces, gateChords]);
  const handleCombine = useCallback((): void => {
    if (!combineGate) return;
    const result = birthChild(
      combineGate.a.shape,
      combineGate.b.shape,
      seqRef.current,
      combineGate.portFaceA,
      combineGate.portFaceB,
      layoutCtl.resolution,
    );
    if (!result.ok) {
      // THE BODILESS CARD: an ENACTED sum persists — the child exists with
      // its genealogy written, only the render refused; the ledger keeps it.
      // Input-refused pairs keep the fork/notice path below, unchanged.
      if (result.enacted) {
        const enacted = result.enacted;
        seqRef.current += 1;
        const bodilessHome: [number, number, number] = [
          (combineGate.a.home[0] + combineGate.b.home[0]) / 2,
          Math.min(combineGate.a.home[1], combineGate.b.home[1]) - 4,
          0,
        ];
        setWritten((cur) => [...cur, { form: enacted, home: bodilessHome }]);
        setCombineWith(null);
        setSelected(`w:${enacted.id}`);
        setOpNotice(null);
        setCombineRefusal(null);
        return;
      }
      // H2 THE FORK — offered exactly when the frozen door's rim-mismatch wall
      // is the one that fired: the two PICKED faces' lengths differ AND both
      // gate shapes carry ≥ 2 faces (the frozen wall ORDER guarantees the
      // single-face walls fire first, so under these conditions the thrown
      // refusal IS the mismatch door — computed from the faces the view holds,
      // the refusal string never parsed). No honest fork → the toast, as today.
      const fork =
        combineGate.a.shape.faces.length >= 2 && combineGate.b.shape.faces.length >= 2
          ? combineForkFor(
              combineGate.portFaceA,
              combineGate.portFaceB,
              combineGate.aKey,
              combineGate.bKey,
              combineGate.a.title,
              combineGate.b.title,
            )
          : null;
      if (fork) {
        setCombineRefusal({ reason: result.reason, fork });
        setOpNotice(null);
      } else {
        setOpNotice(`connect-sum: ${result.reason}`);
      }
      return;
    }
    seqRef.current += 1;
    const home: [number, number, number] = [
      (combineGate.a.home[0] + combineGate.b.home[0]) / 2,
      Math.min(combineGate.a.home[1], combineGate.b.home[1]) - 4,
      0,
    ];
    setWritten((cur) => [...cur, { form: result.born, home }]);
    setCombineWith(null);
    // the designer's call (craft round-2): birth is a WORLD event — the child
    // settles ambient with a brief cue; the specimen stays summoned-by-click
    setSelected(null);
    setBirthCue({ key: seqRef.current, home });
    setOpNotice(null);
    setCombineRefusal(null);
    setGateChords({});
    setChord(null);
  }, [combineGate, layoutCtl.resolution]);

  // ----- GAP2B THE 8TH WORD: thicken(shape, segment) ------------------------
  // The combine's own two-form arming (click + shift-click), NO port-face
  // pick. The committed Q1 gate assigns the roles: the operand passing it is
  // the SEGMENT, the other the SHAPE; both passing, selection order is
  // argument order (first = shape). Neither passing → the refusal copy rides
  // the panel. The chip is enabled exactly when the pair is armed.
  const thickenReason = useMemo(
    () =>
      selected && combineWith
        ? null
        : 'select two forms — click the shape, shift-click the segment',
    [selected, combineWith],
  );
  const thickenGate = useMemo(() => {
    if (!thickenOpen || !selected || !combineWith) return null;
    const a = targetFor(selected);
    const b = targetFor(combineWith);
    if (!a || !b) return null;
    const aIsSegment = segmentGateReason(a.shape) === null;
    const bIsSegment = segmentGateReason(b.shape) === null;
    if (!aIsSegment && !bIsSegment) {
      return {
        shape: null,
        segment: null,
        refusal:
          'Thicken needs an interval — a form with two ends. Lift a single edge to make one, then select it with the shape you\'re thickening.',
      };
    }
    const [shapeOperand, segmentOperand] = bIsSegment ? [a, b] : [b, a];
    return { shape: shapeOperand, segment: segmentOperand, refusal: null };
  }, [thickenOpen, selected, combineWith, targetFor]);
  const handleThicken = useCallback((): void => {
    if (!thickenGate || !thickenGate.shape || !thickenGate.segment) return;
    try {
      const bandName = useGeometryStore
        .getState()
        .thickenManuscript(thickenGate.shape.shape, thickenGate.segment.shape);
      setThickenOpen(false);
      setOpNotice(`thicken: "${bandName}" rides the shelf`);
    } catch (error) {
      // the committed doors speak for themselves (the 4-manifold stop, the Q1
      // guard) — the sentence is the thrown reason, never re-worded here
      setOpNotice(`thicken: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [thickenGate]);

  // ----- H2 THE PERSON'S HANDS: the fold + the aimed chord ------------------
  // the fold's dock chip state — the committed form-level gate's own sentence
  const foldTarget = useMemo(() => targetFor(selected), [targetFor, selected]);
  const foldReason = useMemo(
    () => (foldTarget ? foldGateReason(foldTarget.shape) : 'Select a form first.'),
    [foldTarget],
  );
  const foldPanel = useMemo(() => {
    if (!fold || fold.targetKey !== selected || !foldTarget) return null;
    const preview =
      fold.pairs.length > 0 ? foldPreviewFor(foldTarget.shape, fold.pairs, foldTarget.parent) : null;
    return {
      title: foldTarget.title,
      edges: foldRimEdges(foldTarget.shape),
      state: { pairs: fold.pairs, pending: fold.pending },
      preview,
      commitEnabled: foldCommitEnabled({ pairs: fold.pairs, pending: fold.pending }, preview),
    };
  }, [fold, selected, foldTarget]);
  const handleFoldToggle = useCallback((): void => {
    if (!selected) return;
    // P1 THE LOOP-MAKER (DOORS batch): the fold word on a SEGMENT fires the
    // close directly — one action, NO rim panel; the loop rides the shelf.
    // The committed doors' thrown sentences surface verbatim in the notice.
    const target = targetFor(selected);
    if (target && segmentGateReason(target.shape) === null) {
      try {
        const loopName = useGeometryStore.getState().closeSegmentManuscript(target.shape);
        setOpNotice(`fold: "${loopName}" rides the shelf`);
      } catch (error) {
        setOpNotice(`fold: ${error instanceof Error ? error.message : String(error)}`);
      }
      return;
    }
    setFold((cur) => (cur && cur.targetKey === selected ? null : { targetKey: selected, pairs: [], pending: null }));
  }, [selected, targetFor]);
  // ----- CYCLE-IDENTIFY (L23): the trace gesture ---------------------------
  // the entry gate — D2 fires AT ENTRY, before the person traces anything
  // (never let them do the work and then discard it); the quotient wall is
  // pre-empted structurally for the same reason (its cure is the dock words)
  const handleIdentifyToggle = useCallback((): void => {
    if (!selected) return;
    setCycleTrace((cur) => {
      if (cur && cur.targetKey === selected) return null;
      const target = targetFor(selected);
      if (!target) return cur;
      let entryRefusal: string | null = null;
      if (target.shape.faces.length === 1) {
        try {
          directComplexOf(target.shape);
        } catch {
          entryRefusal =
            'this single-face quotient identifies through the committed word ops (glue / flip-glue on the face) — the dock words are its doors';
        }
      }
      if (entryRefusal === null) {
        try {
          const acquired = acquireComplex(target.shape, target.ancestry ?? null);
          if (!acquired) {
            entryRefusal =
              "the form's faithful complex is not acquirable — the direct bridge refuses it and no replay recovery reaches it";
          }
        } catch (error) {
          entryRefusal = error instanceof Error ? error.message : String(error);
        }
      }
      return { targetKey: selected, phase: 'A', walkA: [], walkB: [], entryRefusal, notice: null };
    });
  }, [selected, targetFor]);
  // the traced form's acquired complex (the trace's substrate)
  const traceComplex = useMemo(() => {
    if (!cycleTrace || cycleTrace.entryRefusal) return null;
    const target = targetFor(cycleTrace.targetKey);
    if (!target) return null;
    try {
      const acquired = acquireComplex(target.shape, target.ancestry ?? null);
      return acquired ? { target, complex: acquired.complex } : null;
    } catch {
      return null;
    }
  }, [cycleTrace, targetFor]);
  // an edge pick — D3's walls fire LIVE (the engine's own sentences, at the
  // moment of the pick, never sprung at the end)
  const handleCyclePick = useCallback((edgeId: string, dir: 1 | -1): void => {
    setCycleTrace((cur) => {
      if (!cur || cur.entryRefusal) return cur;
      const inA = cur.walkA.some((t) => t.id === edgeId);
      const inB = cur.walkB.some((t) => t.id === edgeId);
      if (cur.phase === 'A') {
        if (inA) return { ...cur, notice: 'a walk repeats an edge class — each class may appear once' };
        return { ...cur, walkA: [...cur.walkA, { id: edgeId, dir }], notice: null };
      }
      if (inB) return { ...cur, notice: 'a walk repeats an edge class — each class may appear once' };
      if (inA) return { ...cur, notice: 'this edge class is in walk A — a class cannot be identified with itself' };
      return { ...cur, walkB: [...cur.walkB, { id: edgeId, dir }], notice: null };
    });
  }, []);
  // Confirm — cycles in TRACED order + dirs in TRACED directions → the ONE
  // SOURCE (modesFromDirectedCycles) → the committed identify. The render
  // routes stratum-aware (UNION #1); a pinch's render refusal persists the
  // bodiless card (D4 — the meaning is kept, no body drawn).
  const handleCycleConfirm = useCallback((): void => {
    if (!cycleTrace || !traceComplex) return;
    const { target, complex } = traceComplex;
    const { walkA, walkB } = cycleTrace;
    try {
      const cycleA = walkA.map((t) => t.id);
      const cycleB = walkB.map((t) => t.id);
      const modes = modesFromDirectedCycles(
        target.shape,
        complex,
        cycleA,
        cycleB,
        walkA.map((t) => t.dir),
        walkB.map((t) => t.dir),
      );
      const identified = identify(target.shape, cycleA, cycleB, modes, target.ancestry ?? null);
      const bornAncestry = [target.shape, ...(target.ancestry ?? [])];
      const seq = seqRef.current;
      seqRef.current += 1;
      const provenance = `identify — the person's traced seam (${cycleA.length} pair${cycleA.length === 1 ? '' : 's'}, the mode is the direction)`;
      let form: WrittenForm;
      try {
        const render = routeWrittenRender(identified.shape, bornAncestry, layoutCtl.resolution);
        const title =
          render.mode === 'plain' && render.junctionEdgeIds?.length
            ? 'identified — edge-junction, girdered'
            : 'identified — born';
        form = {
          id: `w${seq}`,
          title,
          shape: identified.shape,
          parentShape: target.shape,
          opId: identified.shape.genealogy.operation,
          provenance,
          render,
        };
        setOpNotice(null);
      } catch (error) {
        // D4 — the pinch: ENACTED, no faithful body; the persistence bodiless
        // card keeps the identification's genealogy (FIX 1, reused not rebuilt)
        const reason = error instanceof Error ? error.message : String(error);
        form = buildBodilessWrittenForm(
          identified.shape,
          bornAncestry,
          reason,
          `w${seq}`,
          identified.shape.genealogy.operation,
          `identify — enacted; the render refused the body`,
          target.shape,
        );
        setOpNotice('identify: no body exists — the form pinches (the card keeps the act)');
      }
      setWritten((cur) => [
        ...cur,
        { form, home: [target.home[0] + d.world.chrome.spawnOffset, target.home[1], 0] },
      ]);
      setSelected(`w:${form.id}`);
      setCycleTrace(null);
    } catch (error) {
      // D1 (walks mismatched at the engine's own wall), the quotient wall,
      // the ambiguity wall — the committed sentences surface in the panel
      const reason = error instanceof Error ? error.message : String(error);
      setCycleTrace((cur) => (cur ? { ...cur, notice: reason } : cur));
    }
  }, [cycleTrace, traceComplex, layoutCtl.resolution]);
  const handleFoldCommit = useCallback((): void => {
    if (!fold) return;
    const target = targetFor(fold.targetKey);
    if (!target) return;
    const result = applyFoldTo(
      target.shape,
      target.parent,
      target.ancestry,
      fold.pairs,
      seqRef.current,
      layoutCtl.resolution,
    );
    if (!result.ok) {
      setOpNotice(`fold: ${result.reason}`);
      return;
    }
    seqRef.current += 1;
    setOpNotice(null);
    setWritten((cur) => [
      ...cur,
      { form: result.born, home: [target.home[0] + d.world.chrome.spawnOffset, target.home[1], 0] },
    ]);
    setSelected(`w:${result.born.id}`);
    setFold(null);
  }, [fold, targetFor, layoutCtl.resolution, d.world.chrome.spawnOffset]);

  // the chord panel's subject — the gate's shape in 'gate' mode (the fork),
  // the standing written form in 'reshape' mode (the general entry)
  const chordPanel = useMemo(() => {
    if (!chord) return null;
    if (chord.mode === 'gate') {
      if (!combineGate) return null;
      const side =
        chord.targetKey === combineGate.aKey
          ? combineGate.a
          : chord.targetKey === combineGate.bKey
            ? combineGate.b
            : null;
      if (!side) return null;
      const face = side.shape.faces.find((f) => f.id === chord.faceId);
      if (!face) return null;
      return { shape: side.shape, face, formTitle: side.title };
    }
    const target = targetFor(chord.targetKey);
    if (!target) return null;
    const face = target.shape.faces.find((f) => f.id === chord.faceId);
    if (!face) return null;
    return { shape: target.shape, face, formTitle: target.title };
  }, [chord, combineGate, targetFor]);
  const chordSplit = useMemo(() => {
    if (!chord || !chordPanel || !chord.cornerA || !chord.cornerB) return null;
    return chordSplitFor(chordPanel.shape, chord.faceId, chord.cornerA, chord.cornerB);
  }, [chord, chordPanel]);
  const handleChordTap = useCallback((cornerId: string): void => {
    setChord((cur) => {
      if (!cur) return cur;
      if (cur.cornerA === cornerId) return { ...cur, cornerA: null };
      if (cur.cornerB === cornerId) return { ...cur, cornerB: null };
      if (cur.cornerA === null) return { ...cur, cornerA: cornerId };
      return { ...cur, cornerB: cornerId };
    });
  }, []);
  const handleChordCommit = useCallback((): void => {
    if (!chord || !chord.cornerA || !chord.cornerB) return;
    const aim: ChordAim = { faceId: chord.faceId, cornerA: chord.cornerA, cornerB: chord.cornerB };
    if (chord.mode === 'gate') {
      // the aim joins the gate's chords; the gate recomputes, the replaced
      // face's stale pick resolves null, and the committed gate asks for the
      // port face again — the person picks the new rim (never a default)
      setGateChords((cur) => ({ ...cur, [chord.targetKey]: [...(cur[chord.targetKey] ?? []), aim] }));
      setChord(null);
      return;
    }
    const entry = written.find((w) => `w:${w.form.id}` === chord.targetKey);
    const target = targetFor(chord.targetKey);
    if (!entry || !target) return;
    const result = applyChordToWritten(entry.form, target.ancestry, aim, layoutCtl.resolution);
    if (!result.ok) {
      setOpNotice(`subdivide: ${result.reason}`);
      return;
    }
    // refine is not a birth: same id, same genealogy — the entry reshapes in
    // place; the field cache must not serve the coarser body under the same id
    fieldCacheRef.current.delete(entry.form.shape.id);
    // CUT 1b: nor may a stale laid body — the reshaped form re-lays on its
    // next birth-route or not at all (the class body stands meanwhile)
    setLaidBodies((cur) => {
      if (!cur.has(entry.form.shape.id)) return cur;
      const next = new Map(cur);
      next.delete(entry.form.shape.id);
      return next;
    });
    setWritten((cur) =>
      cur.map((w) => (w.form.id === entry.form.id ? { ...w, form: result.reshaped } : w)),
    );
    setOpNotice(null);
    setChord(null);
  }, [chord, written, targetFor, layoutCtl.resolution]);
  // the general entry's row state (right-click a written form): the chord
  // reshapes a PLAIN drawn form on a determinate face — single-face forms use
  // their only face; multi-face forms use the person's picked face
  const menuChord = useMemo(() => {
    if (!formMenu) return null;
    const [band, key] = formMenu.id.split(':');
    if (band !== 'w') return null;
    const entry = written.find((w) => w.form.id === key);
    if (!entry) return null;
    if (entry.form.render.mode !== 'plain') {
      return { enabled: false, reason: 'the chord acts on the form’s own drawn faces (a plain form)', faceId: null };
    }
    const shape = entry.form.shape;
    if (shape.faces.length === 1) {
      const [onlyFace] = shape.faces; // the ONLY face — not a choice
      return { enabled: true, reason: null, faceId: onlyFace.id };
    }
    const picked = portFaces[formMenu.id];
    const face = picked ? shape.faces.find((f) => f.id === picked) ?? null : null;
    if (!face) {
      return { enabled: false, reason: 'pick a face first — the person picks, no default is taken', faceId: null };
    }
    return { enabled: true, reason: null, faceId: face.id };
  }, [formMenu, written, portFaces]);
  const handleOpenChordFromMenu = useCallback((): void => {
    if (!formMenu || !menuChord || !menuChord.enabled || !menuChord.faceId) return;
    setChord({
      targetKey: formMenu.id,
      faceId: menuChord.faceId,
      cornerA: null,
      cornerB: null,
      targetLen: null,
      mode: 'reshape',
    });
    closeMenus();
  }, [formMenu, menuChord, closeMenus]);
  const handleTakeFork = useCallback((): void => {
    if (!combineRefusal) return;
    const { fork } = combineRefusal;
    setChord({
      targetKey: fork.pageKey,
      faceId: fork.faceId,
      cornerA: null,
      cornerB: null,
      targetLen: fork.targetLen,
      mode: 'gate',
    });
  }, [combineRefusal]);

  // ----- P1b: the ambo→manuscript lift channel ------------------------------
  // Ingest lifted snapshots onto the shelf through the COMMITTED load — the
  // exact same ingestion as the file picker below. R1.2 (the fresh-session
  // drain): the channel RETAINS its items and this effect ingests
  // IDEMPOTENTLY by each item's `key` — a destructive one-shot drain raced
  // StrictMode's first-mount replay (measured both ways on the same bytes:
  // lost in one run, seconds late in another), so consumption is keyed, per
  // live instance, and safe under ANY replay ordering: no lift lost, none
  // doubled. Failed loads notice once and are not retried (the old drain's
  // exact failure semantics).
  const liftQueue = useLiftStore((state) => state.queue);
  const ingestedLiftKeys = useRef<Set<number>>(new Set());
  // GAP2C — `shelfAncestorsRef` (the CARRIED ancestor chains of shelf-loaded
  // forms, acquire-metadata for the ops/classifier lineage) is declared near
  // the top of the component (hoisted above its reader targetFor to avoid a
  // TDZ crash); it is SET below in the shelf-drain effect.
  useEffect(() => {
    for (const item of liftQueue) {
      if (ingestedLiftKeys.current.has(item.key)) continue;
      ingestedLiftKeys.current.add(item.key);
      try {
        const entry = loadUniverseSnapshot(item.file);
        if (entry.loaded.ancestors?.length) {
          shelfAncestorsRef.current.set(entry.loaded.shape.id, entry.loaded.ancestors);
        }
        setShelf((cur) => [...cur, { entry, placed: false }]);
        setOpNotice(null);
      } catch (error) {
        setOpNotice(`lift: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, [liftQueue]);

  // ----- 3b: the sources shelf (committed snapshot loads + drag-to-place) ----
  const handleLoadFiles = useCallback((files: FileList): void => {
    for (const file of Array.from(files)) {
      file
        .text()
        .then((text) => {
          const entry = loadUniverseSnapshot(JSON.parse(text));
          if (entry.loaded.ancestors?.length) {
            shelfAncestorsRef.current.set(entry.loaded.shape.id, entry.loaded.ancestors);
          }
          setShelf((cur) => [...cur, { entry, placed: false }]);
          setOpNotice(null);
        })
        .catch((error: unknown) => {
          setOpNotice(`load: ${error instanceof Error ? error.message : String(error)}`);
        });
    }
  }, []);
  const worldPointFromClient = useCallback((clientX: number, clientY: number): [number, number] => {
    const camera = cameraRef.current;
    if (!camera) return [0, -4];
    const ndc = new Vector2((clientX / window.innerWidth) * 2 - 1, -(clientY / window.innerHeight) * 2 + 1);
    const raycaster = new Raycaster();
    raycaster.setFromCamera(ndc, camera);
    const { origin, direction } = raycaster.ray;
    if (Math.abs(direction.z) < 1e-9) return [0, -4];
    const t = -origin.z / direction.z; // the z=0 sheet
    return [origin.x + t * direction.x, origin.y + t * direction.y];
  }, []);
  const handleShelfDrop = useCallback(
    (clientX: number, clientY: number): void => {
      const index = dragIndexRef.current;
      dragIndexRef.current = null;
      if (index === null) return;
      const item = shelf[index];
      if (!item || item.placed || !item.entry.placeable) return;
      if (written.some((w) => w.form.shape.id === item.entry.loaded.shape.id)) {
        setOpNotice(`load: "${item.entry.title}" is already on the sheet (one placement per loaded form)`);
        return;
      }
      const [x, y] = worldPointFromClient(clientX, clientY);
      const form = placeShelfEntry(item.entry, seqRef.current);
      seqRef.current += 1;
      // CUT 1b: a shelf-placed classBody form lays too — the carried ancestors
      // are exactly the lineage its render was routed with at ingest
      if (form.render.mode === 'classBody') {
        const laid = tryLaidBodyModel(form.shape, item.entry.loaded.ancestors ?? null);
        if (laid) {
          setLaidBodies((cur) => new Map(cur).set(form.shape.id, laid));
        }
      }
      setWritten((cur) => [...cur, { form, home: [x, y, 0] }]);
      setShelf((cur) => cur.map((s, k) => (k === index ? { ...s, placed: true } : s)));
      setSelected(`w:${form.id}`);
      setOpNotice(null);
    },
    [shelf, written, worldPointFromClient],
  );
  const shelfUniverses = useMemo(() => {
    const bySource = new Map<string, Array<{ index: number; entry: ShelfEntry; placed: boolean }>>();
    shelf.forEach((item, index) => {
      const list = bySource.get(item.entry.source) ?? [];
      list.push({ index, entry: item.entry, placed: item.placed });
      bySource.set(item.entry.source, list);
    });
    return [...bySource.entries()].map(([source, entries]) => ({ source, entries }));
  }, [shelf]);

  // ----- craft staging with the pentimento (the DAG's consumed, in pencil) ---
  const pencilCraft: InkedFormCraft = useMemo(
    () => ({
      ...baseCraft,
      bodyOpacity: d.world.genesis.pencilBodyOpacity,
      constructionColor: genesisCtl.pencilTone,
      constructionOpacity: 0.5,
      constructionGhostOpacity: 0.14,
      silhouetteColor: genesisCtl.pencilTone,
      silhouetteOpacity: 0.75,
      generatorColorA: genesisCtl.pencilTone,
      generatorColorB: genesisCtl.pencilTone,
      generatorLineWidth: baseCraft.generatorLineWidth * 0.7,
      generatorGhostOpacity: 0.12,
      hatchOpacity: 0,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseCraft, genesisCtl.pencilTone, d.world.genesis.pencilBodyOpacity],
  );
  const craftFor = (id: string, shapeId: string): InkedFormCraft =>
    pentimentoShapeIds.has(shapeId)
      ? pencilCraft // the REALLY-consumed settle to graphite — legible, not a fade
      : selected === id
        ? specimenCraft
        : anySelected
          ? recededCraft
          : baseCraft;
  const inkFor = (id: string, shapeId: string, ink: string): string =>
    pentimentoShapeIds.has(shapeId)
      ? genesisCtl.pencilTone
      : selected === id || !anySelected
        ? ink
        : fadeToward(ink, paper.background, specimenCtl.recedeColorFade);

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
  // craftFor / inkFor are defined after the 3b genesis block (they read the
  // pentimento set — the DAG's really-consumed population)

  const riseTo: [number, number, number] = [0, d.world.specimen.riseY, specimenCtl.riseZ];

  const selectable = (
    id: string,
    shapeId: string,
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
            pick(id, event.nativeEvent.shiftKey);
          }}
          onContextMenu={(event) => {
            event.stopPropagation();
            event.nativeEvent.preventDefault();
            setFormMenu({ x: event.nativeEvent.clientX, y: event.nativeEvent.clientY, id });
            setInvokeMenu(null);
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
          ink={inkFor(id, shapeId, d.paper.titleInk)}
          hidden={selected === id}
        />
      </Drift>
    </SpecimenLift>
  );

  return (
    // P1a-craft: absolute (not fixed) — the module fills the SHELL's content
    // area below the shared header bar; all its absolute chrome stays relative.
    <div
      style={{ position: 'absolute', inset: 0, background: paper.background }}
      onContextMenu={(event) => event.preventDefault()}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        handleShelfDrop(event.clientX, event.clientY);
      }}
    >
      <Canvas
        camera={{ position: [...d.layout.cameraPosition], fov: 45 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        onPointerMissed={() => {
          // CYCLE-IDENTIFY reach fix (b): a miss mid-trace does NOT discard
          // the accumulated walk (the 6-edge-trace-cleared-by-one-miss scar)
          if (cycleTraceRef.current) return;
          setSelected(null);
        }}
      >
        <color attach="background" args={[paper.background]} />
        <ambientLight intensity={lightingCtl.ambient} />
        <directionalLight
          position={[...d.lighting.keyPosition]}
          intensity={lightingCtl.key}
          color="#fff6e5"
        />

        {/* the PAPER catcher — invisible, behind the forms, in front of the
            bands: left-click = sink the specimen; right-click = invoke real
            material HERE (the palette opens at the cursor, the primitive
            lands at the hit point) */}
        <mesh
          position={[0, 0, -5]}
          renderOrder={-15}
          onClick={(event) => {
            event.stopPropagation();
            setSelected(null);
            setCombineWith(null);
            closeMenus();
          }}
          onContextMenu={(event) => {
            event.stopPropagation();
            event.nativeEvent.preventDefault();
            setInvokeMenu({
              x: event.nativeEvent.clientX,
              y: event.nativeEvent.clientY,
              world: [event.point.x, event.point.y],
            });
            setFormMenu(null);
          }}
        >
          <planeGeometry args={[bands.width, 90]} />
          <meshBasicMaterial colorWrite={false} depthWrite={false} />
        </mesh>

        <CameraGrab
          onReady={(camera) => {
            cameraRef.current = camera;
          }}
        />

        {/* the INK STEMMA — the committed (Q3-reduced) GenealogyEdges, drawn
            parent→child on the sheet (ink, not gold; the real edge, no decor) */}
        {stemmaLines.map((line) => (
          <Line
            key={line.key}
            points={[
              [line.from[0], line.from[1], -1.5],
              [line.to[0], line.to[1], -1.5],
            ]}
            color={silhouetteCtl.color}
            lineWidth={genesisCtl.stemmaWidth}
            transparent
            opacity={genesisCtl.stemmaOpacity}
          />
        ))}

        {/* the birth-cue: a brief pulse where the child settled (UX, no mark) */}
        {birthCue ? (
          <BirthCuePulse
            key={birthCue.key}
            center={birthCue.home}
            duration={genesisCtl.cueDuration}
            maxRadius={genesisCtl.cueRadius}
            color={generatorsCtl.a}
            onDone={() => setBirthCue(null)}
          />
        ) : null}

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
            model.shape.id,
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
                color={inkFor(`dim1:${model.key}`, model.shape.id, silhouetteCtl.color)}
                lineWidth={d.world.skeleton.lineWidth}
              />
            </group>,
          ),
        )}

        {/* dim 2 — the six immersions through the unchanged InkedForm */}
        {world.dim2.map((model, k) =>
          selectable(
            `dim2:${model.surface}`,
            model.immersion.shape.id,
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
              <InkedForm
                model={model}
                craft={craftFor(`dim2:${model.surface}`, model.immersion.shape.id)}
                lighting={lighting}
              />
            </group>,
          ),
        )}

        {/* dim 3 — THE APERTURE (the registers invert): the world shows a
            hand-cut hole into the INTERIOR (no embedding in R³ ⇒ no
            silhouette; the rim is a CUT, not an outline). When the gate cannot
            hand a real deck group + ambient it DRAWS NOTHING and the caption
            says so. The fundamental-domain diagram is the SPECIMEN's now —
            the committed InkedDomain, byte-unchanged, summoned on select. */}
        {dim3All.map((model, k) => {
          const aperture = apertures[k];
          const summoned = selected === `dim3:${model.key}`;
          return selectable(
            `dim3:${model.key}`,
            model.shape.id,
            [centered(k, dim3All.length, rows.dim3Spacing * scaleCtl.dim3Scale), rows.dim3Y, 0],
            k + 19,
            {
              title: model.title,
              sub: aperture.caption,
              drop: -1.6 * scaleCtl.dim3Scale - 0.9,
            },
            <group scale={scaleCtl.dim3Scale}>
              <ApertureBody
                trace={aperture.trace}
                ink={{
                  paperColor: d.paper.background,
                  interiorInk: d.world.aperture.interiorInk,
                  rimSeed: apertureCtl.rimSeed,
                  size: d.world.aperture.size,
                  echoFade: apertureCtl.echoFade,
                  contourEchoFade: inkCtl.contourEchoFade,
                  contourGain: inkCtl.contourGain,
                  contourBlur: inkCtl.contourBlur,
                  hatchAngleA: inkCtl.hatchAngleA,
                  hatchAngleB: inkCtl.hatchAngleB,
                  hatchPeriod: inkCtl.hatchPeriod,
                  hatchWidth: inkCtl.hatchWidth,
                  hatchThresholdA: inkCtl.hatchThresholdA,
                  hatchThresholdB: inkCtl.hatchThresholdB,
                  darkSolid: inkCtl.darkSolid,
                  creaseThreshold: inkCtl.creaseThreshold,
                  depthBreakThreshold: inkCtl.depthBreakThreshold,
                }}
              />
              {summoned ? (
                <group position={[0, 3.05, 0]} scale={0.68}>
                  <InkedDomain
                    model={model}
                    inkColor={inkFor(`dim3:${model.key}`, model.shape.id, silhouetteCtl.color)}
                    lineWidth={d.world.domain.lineWidth}
                    markColors={d.world.domain.markColors}
                    markRadius={d.world.domain.markRadius}
                  />
                </group>
              ) : null}
            </group>,
          );
        })}

        {/* 0.2 THE ORBIFOLD'S BODY — the folded shelf: the tower-less bodies,
            drawn through the SAME aperture pipeline, placed AFTER the dim-3
            row (the sound rooms' homes do not move). No specimen rises for a
            folded body — it has no tower to summon; the caption asserts
            NON-FREENESS ONLY (orbifold · fold loci · true cone edges), and
            the hands' LEFT count remains w₁'s caption, never the fold's. */}
        {foldedBodies.map((body, k) => {
          const aperture = foldedApertures[k];
          const rowEnd = dim3All.length > 0
            ? centered(dim3All.length - 1, dim3All.length, rows.dim3Spacing * scaleCtl.dim3Scale)
            : 0;
          return selectable(
            `dim3f:${body.key}`,
            `folded:${body.key}`,
            [rowEnd + (k + 1) * rows.dim3Spacing * scaleCtl.dim3Scale, rows.dim3Y, 0],
            60 + k,
            {
              title: `${body.title} — folded`,
              sub: aperture.caption,
              drop: -1.6 * scaleCtl.dim3Scale - 0.9,
            },
            <group scale={scaleCtl.dim3Scale}>
              <ApertureBody
                trace={aperture.trace}
                ink={{
                  paperColor: d.paper.background,
                  interiorInk: d.world.aperture.interiorInk,
                  rimSeed: apertureCtl.rimSeed,
                  size: d.world.aperture.size,
                  echoFade: apertureCtl.echoFade,
                  contourEchoFade: inkCtl.contourEchoFade,
                  contourGain: inkCtl.contourGain,
                  contourBlur: inkCtl.contourBlur,
                  hatchAngleA: inkCtl.hatchAngleA,
                  hatchAngleB: inkCtl.hatchAngleB,
                  hatchPeriod: inkCtl.hatchPeriod,
                  hatchWidth: inkCtl.hatchWidth,
                  hatchThresholdA: inkCtl.hatchThresholdA,
                  hatchThresholdB: inkCtl.hatchThresholdB,
                  darkSolid: inkCtl.darkSolid,
                  creaseThreshold: inkCtl.creaseThreshold,
                  depthBreakThreshold: inkCtl.depthBreakThreshold,
                }}
              />
            </group>,
          );
        })}

        {/* WRITTEN material — invoked primitives + op-born forms (REAL committed
            Shapes; renders routed by the committed bornFormRouting) */}
        {written.map((entry, k) => {
          const id = `w:${entry.form.id}`;
          const render = entry.form.render;
          // CUT 1b — the laid body, if this classBody form earned one
          const laid = render.mode === 'classBody' ? laidBodies.get(entry.form.shape.id) : undefined;
          const laidInked = laid ? laidInkedById.get(entry.form.shape.id) : undefined;
          const sub =
            render.mode === 'immersion'
              ? `${render.model.immersion.correspondence.word === '' ? 'no gluing word' : render.model.immersion.correspondence.word} · H₁ = ${render.model.h1Label ?? 'n-a'}`
              : render.mode === 'skeleton'
                ? `H₁ = ${render.model.h1Label ?? 'n-a'} · b₁ ${render.model.invariants.level1?.b1 ?? '—'}`
                : render.mode === 'classBody'
                  ? laid
                    ? // CUT 1b — THE FOUR COUNTABLE LOOKS ride the caption:
                      // dots · curves · regions · rims, each countable in the
                      // ink. CUT 2 — the crossing count rides BESIDE them (the
                      // drawing's crossings, countable, never cells).
                      `V ${laid.counts.v} · E ${laid.counts.e} · F ${laid.counts.f} · rims ${laid.boundaryCircles}${laid.crossing ? ` · crossings ${laid.crossing.count}` : ''}${laid.note ? ` · ${laid.note}` : ''} · H₁ = ${laid.h1Label ?? 'n-a'}`
                    : `H₁ = ${render.model.h1Label ?? 'n-a'} · class body`
                  : render.mode === 'faithful'
                    ? // CUT 1 — the counted caption rides the label too (EYE-CHECK 1)
                      `V ${render.model.counts.v} · E ${render.model.counts.e} · F ${render.model.counts.f} · H₁ = ${render.model.h1Label ?? 'n-a'}`
                    : render.mode === 'bodiless'
                      ? // THE BODILESS CARD — the caption says what the ledger holds
                        `enacted · ${render.shape.genealogy.operation} · no faithful body`
                      : `H₁ = ${render.h1Label ?? 'n-a'}`;
          const drop =
            render.mode === 'immersion' || render.mode === 'classBody'
              ? -d.layout.captionDrop * scaleCtl.dim2Scale - 0.9
              : render.mode === 'skeleton'
                ? -1.35 * scaleCtl.dim1Scale - 0.7
                : -1.35 * scaleCtl.dim1Scale - 0.7;
          // CYCLE-IDENTIFY — the trace overlay rides the entry's own frame
          // (skeleton scale) so strokes land on the form's faithful positions
          const traceHere =
            cycleTrace !== null &&
            cycleTrace.targetKey === id &&
            cycleTrace.entryRefusal === null &&
            traceComplex !== null &&
            traceComplex.target.shape.id === entry.form.shape.id;
          return selectable(
            id,
            entry.form.shape.id,
            entry.home,
            30 + k,
            { title: entry.form.title, sub, drop },
            <>
            {render.mode === 'immersion' ? (
              <group scale={scaleCtl.dim2Scale}>
                <InkedForm
                  model={render.model}
                  craft={craftFor(id, entry.form.shape.id)}
                  lighting={lighting}
                />
              </group>
            ) : render.mode === 'skeleton' ? (
              <group scale={scaleCtl.dim1Scale}>
                <InkedSkeleton
                  model={render.model}
                  color={inkFor(id, entry.form.shape.id, silhouetteCtl.color)}
                  lineWidth={d.world.skeleton.lineWidth}
                />
              </group>
            ) : render.mode === 'classBody' ? (
              laid && laidInked ? (
                // UNIFICATION — ONE crafted renderer: the laid body rides
                // InkedForm through the adapter (CUT 1b — the person's OWN
                // cells on the canonical body; now with the zoo's full pass
                // stack: prepass · hull · body · hatching · the cells as
                // construction ink · the CERTIFIED basis loops). The cell
                // overlay (dots · CUT 2's crossing ghost · rims) rides on
                // top. The pen divides by the group scale through the CRAFT
                // prop, so P4's at-spec ruling holds with the frozen craft
                // byte-untouched.
                <group scale={scaleCtl.dim2Scale}>
                  <InkedForm
                    model={laidInked}
                    craft={{
                      ...craftFor(id, entry.form.shape.id),
                      silhouetteScreenspacePx:
                        silhouetteCtl.screenspacePx / Math.max(0.0001, scaleCtl.dim2Scale),
                    }}
                    lighting={lighting}
                  />
                  <LaidCellOverlay
                    model={laid}
                    rimColor={inkFor(id, entry.form.shape.id, silhouetteCtl.color)}
                    ghostColor={genesisCtl.pencilTone}
                  />
                </group>
              ) : (
              // P-IMMERSE: the honest representative — one self-certified body
              // per connected component, each carrying ITS committed Option-B
              // generators (the model derived them; no view invention)
              <group scale={scaleCtl.dim2Scale}>
                {render.model.components.map((component, ci) => (
                  <InkedPlainForm
                    key={`${id}:c${ci}`}
                    shape={component.body}
                    craft={craftFor(id, entry.form.shape.id)}
                    generators={component.optionB.generators}
                    worldScale={scaleCtl.dim2Scale}
                    selfCrossing={component.class.kind === 'non-orientable'}
                    field={
                      // C.1 — THE ONE-COMPLEX LAW at the seam: the field dresses
                      // ONLY the exact drawn body it was computed on
                      specimenField && specimenField.shapeId === component.body.id
                        ? specimenField.field
                        : undefined
                    }
                    position={component.offset}
                  />
                ))}
              </group>
              )
            ) : render.mode === 'faithful' ? (
              // CUT 1 — the person's own cells in the two registers: seam thin,
              // rim heavy, dots per vertex-class, the one face a flat disk.
              // RECOGNITION — the seam wears its fold-letter; on select it
              // warms and the two source edges ghost (provenance, no metric).
              <group scale={scaleCtl.dim1Scale * 1.5}>
                <FaithfulBody
                  model={render.model}
                  seamColor={inkFor(id, entry.form.shape.id, constructionCtl.color)}
                  rimColor={inkFor(id, entry.form.shape.id, silhouetteCtl.color)}
                  seamWidth={1.2}
                  rimWidth={4}
                  bodyColor={bodyCtl.color}
                  bodyOpacity={bodyCtl.opacity * 0.55}
                  seamMark={foldSeamProvenance(
                    render.model.seams.map((s) => s.id),
                    entry.form.shape,
                    entry.form.parentShape,
                  )}
                  selected={selected === id}
                  accent={generatorsCtl.a}
                  ghostColor={genesisCtl.pencilTone}
                />
              </group>
            ) : render.mode === 'bodiless' ? (
              // THE BODILESS CARD — the minimal honest ledger card (the
              // designer's look is a later follow-up): the genealogy word +
              // the render's own refusal. NO body is drawn, ever.
              <Html center distanceFactor={13} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
                <div
                  style={{
                    maxWidth: 250,
                    padding: '9px 12px',
                    borderRadius: 3,
                    background: d.paper.cardBackground,
                    border: `1px dashed ${d.paper.cardBorder}`,
                    color: d.paper.cardInk,
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontSize: 11.5,
                    lineHeight: 1.45,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>enacted — {render.shape.genealogy.operation}</div>
                  <div style={{ fontStyle: 'italic', opacity: 0.8, marginTop: 3 }}>
                    no faithful body — {render.reason}
                  </div>
                </div>
              </Html>
            ) : (
              <group scale={scaleCtl.dim1Scale}>
                <InkedPlainForm
                  shape={render.shape}
                  craft={craftFor(id, entry.form.shape.id)}
                  generators={optionBByShape.get(render.shape.id)?.generators}
                  worldScale={scaleCtl.dim1Scale}
                  junction={
                    junctionSegmentsByShape.has(render.shape.id)
                      ? {
                          segments: junctionSegmentsByShape.get(render.shape.id) as Vec3[][],
                          color: d.world.junction.color,
                          lineWidth: d.world.junction.lineWidth,
                        }
                      : undefined
                  }
                  field={
                    // C.1 — the same one-complex key on the plain route
                    specimenField && specimenField.shapeId === render.shape.id
                      ? specimenField.field
                      : undefined
                  }
                />
              </group>
            )}
            {traceHere && traceComplex ? (
              <group scale={scaleCtl.dim1Scale}>
                <CycleTraceOverlay
                  shape={traceComplex.target.shape}
                  complex={traceComplex.complex}
                  walkA={cycleTrace.walkA}
                  walkB={cycleTrace.walkB}
                  phase={cycleTrace.phase}
                  onPickEdge={handleCyclePick}
                />
              </group>
            ) : null}
            </>,
          );
        })}

        <OrbitControls makeDefault enableDamping dampingFactor={0.08} />
      </Canvas>
      {/* P1a-craft: the dev title overlay is gone — the shared shell bar names
          the app, the toggle names the section. (The shift-click combine hint
          died with it; its proper return is a real help affordance, later.) */}
      {opNotice ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 118,
            transform: 'translateX(-50%)',
            padding: '4px 10px',
            borderRadius: 3,
            background: d.paper.cardBackground,
            border: `1px solid ${d.paper.cardBorder}`,
            color: d.paper.cardInk,
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11.5,
            maxWidth: 560,
          }}
        >
          {opNotice}
        </div>
      ) : null}
      {fieldComputing ? (
        // C.1 — the `computing` state made visible: the field is being worked
        // out OFF the drawing thread; the plate stays bare until it arrives
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 148,
            transform: 'translateX(-50%)',
            padding: '4px 10px',
            borderRadius: 3,
            background: d.paper.cardBackground,
            border: `1px solid ${d.paper.cardBorder}`,
            color: d.paper.cardInk,
            fontFamily: 'ui-monospace, monospace',
            fontSize: 11.5,
            maxWidth: 560,
          }}
        >
          field: computing off-thread…
        </div>
      ) : null}
      {selectedFacePick && selected && !apertureOpen ? (
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 64,
            width: 250,
            padding: '11px 13px',
            borderRadius: 3,
            background: d.paper.cardBackground,
            border: `1px solid ${d.paper.cardBorder}`,
            boxShadow: '0 2px 9px rgba(58, 51, 38, 0.2)',
            color: d.paper.cardInk,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12.5,
            lineHeight: 1.45,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>
            the person picks the face
          </div>
          <div style={{ marginTop: 3, fontSize: 11, opacity: 0.75 }}>
            cut consumes the face YOU pick — no default is taken
          </div>
          <PortFacePicker
            formTitle={selectedFacePick.title}
            faces={selectedFacePick.faces}
            picked={selectedFacePick.picked}
            onPick={(faceId) => setPortFaces((cur) => ({ ...cur, [selected]: faceId }))}
            paper={d.paper}
          />
        </div>
      ) : null}
      {!zooLoaded ? (
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            handleSummonZoo();
          }}
          style={{
            position: 'absolute',
            right: 14,
            bottom: 62,
            padding: '6px 12px',
            borderRadius: 3,
            border: `1px solid ${d.paper.cardBorder}`,
            background: d.paper.cardBackground,
            color: d.paper.cardInk,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12,
            cursor: 'pointer',
            boxShadow: '0 2px 9px rgba(58, 51, 38, 0.15)',
          }}
        >
          load the reference zoo
        </button>
      ) : null}
      <button
        type="button"
        onMouseDown={(e) => {
          e.stopPropagation();
          setApertureOpen((cur) => !cur);
          setApertureNotice(null);
          setApertureFoldedRows(null);
        }}
        style={{
          position: 'absolute',
          right: 14,
          bottom: 24,
          padding: '6px 12px',
          borderRadius: 3,
          border: `1px solid ${d.paper.cardBorder}`,
          background: d.paper.cardBackground,
          color: d.paper.cardInk,
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontSize: 12,
          cursor: 'pointer',
          boxShadow: '0 2px 9px rgba(58, 51, 38, 0.15)',
        }}
      >
        {apertureOpen ? 'close the aperture gate' : 'aperture — build a 3-manifold'}
      </button>
      {apertureOpen ? (
        <ApertureGatePanel
          rows={apertureRowViews}
          refusal={apertureRefusal}
          notice={apertureNotice}
          onPickFaceA={(i, v) =>
            setApertureRows((cur) => cur.map((r, k) => (k === i ? { ...r, faceA: v || null, candidateKey: null } : r)))
          }
          onPickFaceB={(i, v) =>
            setApertureRows((cur) => cur.map((r, k) => (k === i ? { ...r, faceB: v || null, candidateKey: null } : r)))
          }
          onPickMap={(i, v) =>
            setApertureRows((cur) => cur.map((r, k) => (k === i ? { ...r, candidateKey: v || null } : r)))
          }
          onGlue={handleApertureGlue}
          onSubdivide={apertureFoldedRows ? handleApertureSubdivide : null}
          onClose={() => setApertureOpen(false)}
          paper={d.paper}
          accent={generatorsCtl.a}
        />
      ) : null}
      {selectedDim3 && !apertureOpen ? (
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 64,
            width: 250,
            padding: '11px 13px',
            borderRadius: 3,
            background: d.paper.cardBackground,
            border: `1px solid ${d.paper.cardBorder}`,
            boxShadow: '0 2px 9px rgba(58, 51, 38, 0.2)',
            color: d.paper.cardInk,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12.5,
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>
            the room — place a form
          </div>
          <div style={{ marginTop: 3, fontSize: 11, opacity: 0.75 }}>
            your own forms are what you add — the light carries them down every corridor
          </div>
          <select
            value={placedForms[selectedDim3.key] ?? ''}
            onChange={(e) => setPlacedForms((cur) => ({ ...cur, [selectedDim3.key]: e.target.value }))}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 7,
              padding: '3px 4px',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 10.5,
              background: d.paper.cardBackground,
              color: d.paper.cardInk,
              border: `1px solid ${d.paper.cardBorder}`,
              borderRadius: 3,
            }}
          >
            <option value="">— the room keeps its two inhabitants —</option>
            {placeableForms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
          <label
            style={{
              display: 'block',
              marginTop: 7,
              fontSize: 11,
              opacity: placedForms[selectedDim3.key] ? 0.9 : 0.45,
            }}
          >
            <input
              type="checkbox"
              disabled={!placedForms[selectedDim3.key]}
              checked={Boolean(displacedRooms[selectedDim3.key])}
              onChange={(e) =>
                setDisplacedRooms((cur) => ({ ...cur, [selectedDim3.key]: e.target.checked }))
              }
              onMouseDown={(e) => e.stopPropagation()}
              style={{ marginRight: 6 }}
            />
            displace the inhabitants — the mask and coil are defaults, not furniture
          </label>
        </div>
      ) : null}
      <OperationsDock
        availability={availability}
        hasTarget={targetFor(selected) !== null}
        paper={d.paper}
        accent={generatorsCtl.a}
        onApply={(operationId) => applyOp(operationId)}
        fold={{
          enabled: foldReason === null,
          reason: foldReason,
          open: fold !== null && fold.targetKey === selected,
        }}
        onFoldToggle={handleFoldToggle}
        thicken={{
          enabled: thickenReason === null,
          reason: thickenReason,
          open: thickenGate !== null,
        }}
        onThickenToggle={() => setThickenOpen((cur) => !cur)}
        identifySew={{
          enabled: selected !== null && targetFor(selected) !== null,
          reason: selected === null ? 'select a form first' : null,
          open: cycleTrace !== null && cycleTrace.targetKey === selected,
        }}
        onIdentifyToggle={handleIdentifyToggle}
      />
      {invokeMenu ? (
        <InvokePalette
          x={invokeMenu.x}
          y={invokeMenu.y}
          primitives={PRIMITIVE_CATALOGUE}
          paper={d.paper}
          onInvoke={handleInvoke}
        />
      ) : null}
      {formMenu ? (
        <FormOpsMenu
          x={formMenu.x}
          y={formMenu.y}
          title={targetFor(formMenu.id)?.title ?? 'form'}
          availability={menuAvailability}
          paper={d.paper}
          onApply={(operationId) => applyOp(operationId, formMenu.id)}
          chord={menuChord ? { enabled: menuChord.enabled, reason: menuChord.reason } : null}
          onOpenChord={handleOpenChordFromMenu}
        />
      ) : null}
      {thickenGate ? (
        <ThickenGatePanel
          shapeTitle={thickenGate.shape?.title ?? null}
          segmentTitle={thickenGate.segment?.title ?? null}
          refusal={thickenGate.refusal}
          paper={d.paper}
          accent={generatorsCtl.a}
          onThicken={handleThicken}
          onClose={() => setThickenOpen(false)}
        />
      ) : combineGate ? (
        <BirthGatePanel
          aTitle={combineGate.a.title}
          bTitle={combineGate.b.title}
          aFaces={combineGate.a.shape.faces.map((face) => ({
            id: face.id,
            label: faceLabel(face),
          }))}
          bFaces={combineGate.b.shape.faces.map((face) => ({
            id: face.id,
            label: faceLabel(face),
          }))}
          portA={combineGate.portFaceA?.id ?? ''}
          portB={combineGate.portFaceB?.id ?? ''}
          onPickA={(faceId) =>
            setPortFaces((cur) => ({ ...cur, [combineGate.aKey]: faceId }))
          }
          onPickB={(faceId) =>
            setPortFaces((cur) => ({ ...cur, [combineGate.bKey]: faceId }))
          }
          gate={combineGate.gate}
          paper={d.paper}
          accent={generatorsCtl.a}
          onCombine={handleCombine}
          refusalNotice={combineRefusal?.reason ?? null}
          fork={
            combineRefusal
              ? { label: forkOfferLabel(combineRefusal.fork), onTake: handleTakeFork }
              : null
          }
        />
      ) : foldPanel ? (
        <FoldGatePanel
          title={foldPanel.title}
          edges={foldPanel.edges}
          state={foldPanel.state}
          preview={foldPanel.preview}
          commitEnabled={foldPanel.commitEnabled}
          paper={d.paper}
          accent={generatorsCtl.a}
          onTapEdge={(edgeIndex) =>
            setFold((cur) => (cur ? { ...cur, ...tapFoldEdge({ pairs: cur.pairs, pending: cur.pending }, edgeIndex) } : cur))
          }
          onToggleMode={(pairIndex) =>
            setFold((cur) => (cur ? { ...cur, ...toggleFoldPairMode({ pairs: cur.pairs, pending: cur.pending }, pairIndex) } : cur))
          }
          onCommit={handleFoldCommit}
          onClose={() => setFold(null)}
        />
      ) : reading ? (
        <SpecimenCard
          reading={reading}
          paper={d.paper}
          generatorInks={{ a: generatorsCtl.a, b: generatorsCtl.b }}
        />
      ) : null}
      {chord && chordPanel ? (
        <ChordGatePanel
          formTitle={chordPanel.formTitle}
          faceText={faceLabel(chordPanel.face)}
          corners={chordPanel.face.vertexIds}
          cornerA={chord.cornerA}
          cornerB={chord.cornerB}
          split={chordSplit}
          targetLen={chord.targetLen}
          paper={d.paper}
          accent={generatorsCtl.a}
          onTapCorner={handleChordTap}
          onCommit={handleChordCommit}
          onClose={() => setChord(null)}
        />
      ) : null}
      {cycleTrace ? (
        // CYCLE-IDENTIFY — the trace panel: the doors render HERE, at panel
        // weight (the legibility law: doors in the panel, NOT tooltips).
        // Copy is working text — the designer words the doors on the live
        // build (his §7).
        <div
          style={{
            position: 'absolute',
            right: 18,
            bottom: 132,
            width: 292,
            padding: '10px 13px',
            borderRadius: 3,
            background: d.paper.cardBackground,
            border: `1px solid ${d.paper.cardBorder}`,
            color: d.paper.cardInk,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12.5,
            lineHeight: 1.5,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div style={{ fontWeight: 700, marginBottom: 4 }}>
            identify — trace two walks
            <button
              type="button"
              onClick={() => setCycleTrace(null)}
              style={{
                float: 'right',
                border: 'none',
                background: 'transparent',
                color: d.paper.cardInk,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              ×
            </button>
          </div>
          {cycleTrace.entryRefusal ? (
            // D2 (and the quotient pre-emption) — refused AT ENTRY, before any tracing
            <div style={{ fontStyle: 'italic', opacity: 0.85 }}>{cycleTrace.entryRefusal}</div>
          ) : (
            <>
              <div style={{ opacity: 0.85, fontSize: 11.5, marginBottom: 6 }}>
                click the form's edges in order — where you touch is the stroke's tail; the mode IS the
                direction you trace, there is nothing to switch
              </div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: TRACE_INK_A, fontWeight: 700 }}>A: {cycleTrace.walkA.length}</span>
                {' · '}
                <span style={{ color: TRACE_INK_B, fontWeight: 700 }}>B: {cycleTrace.walkB.length}</span>
                <span style={{ opacity: 0.7 }}> — tracing walk {cycleTrace.phase}</span>
              </div>
              {cycleTrace.phase === 'A' ? (
                <button
                  type="button"
                  disabled={cycleTrace.walkA.length === 0}
                  onClick={() => setCycleTrace((cur) => (cur ? { ...cur, phase: 'B', notice: null } : cur))}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 3,
                    border: `1px solid ${d.paper.cardBorder}`,
                    background: 'transparent',
                    color: d.paper.cardInk,
                    cursor: cycleTrace.walkA.length === 0 ? 'default' : 'pointer',
                    opacity: cycleTrace.walkA.length === 0 ? 0.4 : 1,
                    marginRight: 8,
                  }}
                >
                  → trace walk B
                </button>
              ) : (
                <button
                  type="button"
                  disabled={
                    cycleTrace.walkB.length === 0 || cycleTrace.walkA.length !== cycleTrace.walkB.length
                  }
                  onClick={handleCycleConfirm}
                  style={{
                    padding: '3px 10px',
                    borderRadius: 3,
                    border: `1px solid ${d.paper.cardBorder}`,
                    background: 'rgba(58,51,38,0.06)',
                    color: d.paper.cardInk,
                    cursor:
                      cycleTrace.walkB.length === 0 || cycleTrace.walkA.length !== cycleTrace.walkB.length
                        ? 'default'
                        : 'pointer',
                    opacity:
                      cycleTrace.walkB.length === 0 || cycleTrace.walkA.length !== cycleTrace.walkB.length
                        ? 0.4
                        : 1,
                    marginRight: 8,
                  }}
                >
                  confirm — sew the seam
                </button>
              )}
              {cycleTrace.phase === 'B' && cycleTrace.walkA.length !== cycleTrace.walkB.length ? (
                // D1 — live, with the counts AND the cure the person already has
                <div style={{ marginTop: 6, fontStyle: 'italic', opacity: 0.85 }}>
                  the walks must be matched — A has {cycleTrace.walkA.length}, B has {cycleTrace.walkB.length}
                  ; subdivide (the chord gesture) to equalize, never silently mis-match
                </div>
              ) : null}
              {cycleTrace.notice ? (
                // D3 live + the engine's own confirm-time walls, verbatim
                <div style={{ marginTop: 6, fontStyle: 'italic', opacity: 0.85 }}>{cycleTrace.notice}</div>
              ) : null}
            </>
          )}
        </div>
      ) : null}
      <RecordStrip entries={recordEntries} accepted={genesis?.accepted ?? true} paper={d.paper} />
      <SourcesShelf
        universes={shelfUniverses}
        paper={d.paper}
        onLoadFiles={handleLoadFiles}
        onDragEntry={(index) => {
          dragIndexRef.current = index;
        }}
      />
      <Leva collapsed />
    </div>
  );
}
