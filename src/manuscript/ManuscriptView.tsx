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

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
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
import { manuscriptDefaults, recedeInk } from '../design/designDefaults';
import { buildManuscriptWorld, WORLD_SURFACES, type DomainModel, type DomainPendingPairMark } from './worldModel';
import { InkedForm, type InkedFormCraft, type InkedFormLighting } from './InkedForm';
import { InkedSkeleton } from './InkedSkeleton';
import { InkedDomain } from './InkedDomain';
import {
  STEMMA_ARROW,
  STEMMA_PICK_WIDTH_PX,
  stemmaArrowhead,
  stemmaMidpoint,
  visibleStemmaLabels,
} from './stemmaLabelModel';
import { spawnHomeForBirth } from './spawnFanModel';
import type { ImmersedSurfaceKey } from '../lib/surfaceImmersion';
import {
  readDomainSpecimen,
  readSkeletonSpecimen,
  readSurfaceSpecimen,
  type SpecimenReading,
} from './specimenModel';
import type { Face, OperationKind, Shape } from '../types/geometry';
import { PRIMITIVE_CATALOGUE } from '../playground/primitiveCatalogue';
import {
  applyPlaygroundOperationTo,
  buildBodilessWrittenForm,
  invokePrimitive,
  operationAvailabilityFor,
  readPlainSpecimen,
  routeWrittenRender,
  UNRESOLVED_SELECTION_REASON,
  type WrittenForm,
} from './writtenFormModel';
import { composeAffordanceLine, isClosedVolume, QUOTIENT_BOUND_SENTENCE } from './affordanceLine';
import { resolveDeckTiling, type TilingResolution } from './deckTilingModel';
import { DeckTilingWindow } from './DeckTilingWindow';
import { readFormInvariants } from '../playground/formInvariants';
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
  type IdentifyMode,
} from '../lib/complexIdentification';
// THE CONFORMAL ATOM — the non-frozen invoke wrapper stamps the owned angle
import { computeSeedCornerAngles } from '../lib/conformalAtom';
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
// R1 — the deficit register's SPECIMEN card rows ("cone point · deficit N°");
// R1-FIX — the rows build in the TESTABLE model (deficitCardRows): the
// refusal row vs genuine silence split lives there, witness-asserted
import {
  deficitCardRows,
  faithfulDeficitDatum,
  readDeficitForRender,
  type FaithfulDeficitDatum,
} from './deficitRegisterModel';
import { InkedDeficitLayer } from './InkedDeficitLayer';
import { buildArgumentReading, mergedRootsPhrase, type ArgumentReading, type ArgumentMapRow } from './argumentReadingModel';
import { buildFaithfulInkedModel } from './faithfulInkedModel';
import type { InkedFormModel } from './inkedFormModel';
import {
  ApertureGatePanel,
  BirthGatePanel,
  ChordGatePanel,
  FieldDoor,
  FoldGatePanel,
  CameraDock,
  FormOpsMenu,
  InvokePalette,
  OperationsDock,
  PortFacePicker,
  RecordStrip,
  SourcesShelf,
  CHROME_LAYER_Z,
  ThickenGatePanel,
  type AperturePairRowView,
} from './ManuscriptChrome';
// M1 (SEAL_THE_MARKED_SPECIMEN) — the registers seam reports the recessed
// styles (injectivity is witnessed on the REAL resolved values)
import { STIPPLE_INK } from './InkedFieldLayer';
// PHASE A (SEAL_PHASE_A_CAMERA): the ONE shared fit/reset camera mechanism —
// extracted from the Ambo Workspace3D, consumed here with the plate semantics
// (exact reset to the composed default, a standing 3/4 fit attitude, a
// legible-fraction margin — the designer gates the numbers on the bench)
import { SceneCameraControls, type SceneBounds } from '../components/SceneCameraRig';
// PHASE D1 (SEAL_PHASE_D1_CORRESPONDENCE_ENGINE): the body-agnostic pick +
// projection layer — positions, picks, and ONE id-space (=== on the live ids
// the card rows already carry); renders NO marks (D2's terrain)
import {
  CorrespondencePickLayer,
  type CorrespondenceEntityRef,
  type CorrespondenceSeam,
} from '../components/CorrespondencePickLayer';
// M2 (SEAL_THE_MARKED_SPECIMEN — THE CARD'S CLOSE): the CALLOUT RING — the
// key in the PAGE MARGIN (supersedes the D2 on-figure heap): bearing-ordered,
// non-crossing leaders on every mark, page-fixed type, recessed default with
// the ≤3 promoted riding the same emphasizedIds channel, halo on emphasis
// only. SPECIMEN_FIT_MARGIN is the L3 reservation the camera fit reads —
// the margin exists BEFORE the figure is sized.
import { CorrespondenceRing, SPECIMEN_FIT_MARGIN } from '../components/CorrespondenceRing';
// THE RING ANCHOR RESOLVER (SEAL_THE_RING_ANCHOR_RESOLVER): TOTAL over the
// WrittenRender union with a compile-time `: never` floor — every mode
// RENDERS its anchors or DECLARES a refusal the card speaks; a silent bare
// is unrepresentable (the mode-dispatch scar's root cure).
import { resolveRingAnchors } from '../components/ringAnchorResolver';
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
// B-105 W3 §1 — the fold tap's rim vocabulary type (the committed picker
// labels the overlay draws from; the panel no longer lists them)
import type { FaceEdgeLabel } from '../playground/customGluing';
import type { BoundaryPairing } from '../lib/surfaceOperations';
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
import { ManuscriptErrorBoundary } from './ManuscriptErrorBoundary';
import {
  apertureCaption,
  aperturePairingRefusal,
  boundaryFacesOf,
  buildAperture,
  buildApertureScene,
  buildPersonDomainVerdict,
  cornerDisplayName,
  describeCandidate,
  dihedralMapCandidates,
  faceDisplayName,
  NO_MAP_FITS_SENTENCE,
  resolveCarriedMetricBase,
  subdivideAndReadPersonDomain,
  traceAperture,
  type AbsentLabelResolver,
  type AperturePairRow,
  type CarriedMetricBaseResolution,
  type FoldedDomain,
} from './apertureModel';
// THE PROBES (2026-07-14): the real scans — the mask, held in a hand. The
// mask does recurrence; THE HAND does chirality (a face is its own mirror).
import { buildProbeMeshes } from './apertureProbes';
// THE GPU EXPLORE WINDOW (2026-08-08 reset, ADR 0004 Amdt 7): the inside
// view is the instrument's fragment shader; the shell stays the operable
// representative behind it. The door law: a fully-paired room OPENS —
// E³ AND cone AND folded alike (Amdt 10 rendered the cone; the transport is
// one loop) — while surfaces refuse BY NAME. THE DOOR-FEED partial
// (2026-08-13): a LEGAL PARTIAL PAIRING opens too — the researcher's
// bounded-body precedent; the unpaired faces render as WALLS (the room's
// edge), never as an escape.
import { ExploreWindow } from './ExploreWindow';
import { readCellSurface, faceTraceCycle, apertureParityCensus, apertureNoun, apertureNote } from './apertureModel';
import { buildFormDomain, pendingPairMarks } from './formDomainModel';
// §2 (B-2026-08-22-A) — the page's store half (A) and file half (B);
// §7 (B-2026-08-24-B): the unsaved-mark's derived signature
import { pageSignatureOf, useManuscriptPageStore } from './pageStore';
import { serializePage, parsePage } from './pageSnapshot';

// D13 WITNESS SEAM (dev-only): the panel-scope plant must be a COMPONENT —
// a thrown JSX *expression* fires in the PARENT's own render body (children
// are evaluated eagerly by the parent), so no child boundary could ever
// catch it; the leg proved exactly that on its first run.
function D13PanelThrow(): never {
  throw new Error('d13 planted render throw — panel scope (dev seam)');
}

const EXPLORE_NEEDS_ROOM = 'select a room with an inside — a built 3-manifold';
const EXPLORE_SURFACE_LATER =
  'the inside of a surface is not walkable yet — this door opens in a later chapter of the instrument.';
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

// B-127: keyed by the CLOSED union — a seventh surface is a compile error
// here, never a silent raw key at the eye (the three deleted `?? m.surface`
// fallbacks were mints waiting for a miss).
const DIM2_TITLES: Record<ImmersedSurfaceKey, string> = {
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
  name,
  children,
}: {
  home: [number, number, number];
  isSpecimen: boolean;
  riseTo: [number, number, number];
  riseScale: number;
  damping: number;
  // PHASE A (SEAL_PHASE_A_CAMERA C1): the wrapper is NAMED so the plate can
  // measure the REAL drawn bounds of the selected specimen (Box3 by name)
  name?: string;
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
    <group ref={ref} position={home} name={name}>
      {children}
    </group>
  );
}

// F.0e — THE TRACED PAIR MARK (mothership §2, designer-ruled: a wireframe has
// no face treatment to modulate — its own edge cycle is the one affordance a
// skeleton offers, and a traced cycle encloses exactly one face at any angle).
// The ring is pulled INWARD toward its cycle's centroid so it rings the inside
// of its face and never fights the outline's ink. A DECIDED trace is a solid
// COMET — ink swelling from the D14 start corner to the closing edge, so the
// order the corners light is readable in one still frame — with a small tick
// at the start corner (direction punctuation: the tick may not be the thing
// that says which face; the cycle is). A PENDING trace is dashed and uniform:
// it claims the FACES and no direction — a different type upstream, a
// different treatment here, unconfusable by construction.
function LiveTraceCycle({
  positions,
  color,
  lineWidth,
  tickRadius,
  pending,
}: {
  positions: Vec3[];
  color: string;
  lineWidth: number;
  tickRadius: number;
  pending: boolean;
}) {
  const ring = useMemo(() => {
    const sum = positions.reduce<Vec3>((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]);
    const centroid: Vec3 = [sum[0] / positions.length, sum[1] / positions.length, sum[2] / positions.length];
    const PULL = 0.82;
    return positions.map((p): [number, number, number] => [
      centroid[0] + (p[0] - centroid[0]) * PULL,
      centroid[1] + (p[1] - centroid[1]) * PULL,
      centroid[2] + (p[2] - centroid[2]) * PULL,
    ]);
  }, [positions]);
  if (ring.length < 2) return null;
  if (pending) {
    return (
      <Line
        points={[...ring, ring[0]]}
        color={color}
        lineWidth={lineWidth * 1.15}
        dashed
        dashSize={0.09}
        gapSize={0.07}
        transparent
        opacity={0.85}
      />
    );
  }
  return (
    <group>
      {ring.map((p, i) => {
        const q = ring[(i + 1) % ring.length];
        const t = (i + 1) / ring.length;
        return (
          <Line
            key={`seg:${i}`}
            points={[p, q]}
            color={color}
            lineWidth={lineWidth * (0.7 + 1.1 * t)}
            transparent
            opacity={0.35 + 0.65 * t}
          />
        );
      })}
      {tickRadius > 0 ? (
        <mesh position={ring[0]}>
          <sphereGeometry args={[tickRadius, 12, 10]} />
          <meshBasicMaterial color={color} />
        </mesh>
      ) : null}
    </group>
  );
}

// ═══ R2's CURE (B-115 §3) — THE LABEL STAYS. ═══════════════════════════════
// ⇒ ✅ RULED BY THE DESIGNER: **selection may not remove the name.** Her
// diagnosis unifies it with the camera at the right level — SELECTION'S JOB IS
// TO SAY WHICH THING IS SELECTED, and un-naming the thing is the exact
// opposite of that act. ⇒ A STATE CHANGE PERFORMING A DESTRUCTION: there the
// view, here the name. One diagnosis, two cures.
// ⛔ THE `hidden` PROP IS GONE, not passed `false`. It stood for exactly one
// condition — "this form is the selected one" — and that condition has been
// ruled away. A guard is correct to leave standing only while something it
// stands for still holds; this one has nothing left, and a dead prop is a
// door for the same defect to come back through.
// ★ And it closes P5's collision (measured B-113, R2): with the name removed
// on select, the last thing a person saw before removing a form was a form
// with no name, and the memorial would have named it for the FIRST time —
// the page naming a thing only once it is gone.
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
  // B-114 §0 — THE NOTE GETS ITS OWN LINE, because she said so and because a
  // disclaimer that runs on into the countable facts reads as one more of
  // them. The caption arrives as noun-then-note separated by a newline;
  // `whiteSpace: nowrap` would render that newline as a space, so the lines
  // are split here rather than by trusting the browser with a character it
  // has been told to collapse.
  const [nounLine, ...noteLines] = sub.split('\n');
  return (
    <Html center position={position} distanceFactor={13} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
      {/* B-115 §3 — the label carries its own MARK so a witness can measure
          that it is still on the page. The name staying is now a ruled
          behaviour, and a ruled behaviour with no way to measure it is one
          nobody will notice going away again. */}
      <div
        data-form-label={title}
        style={{ textAlign: 'center', color: ink, fontFamily: 'Georgia, "Times New Roman", serif', whiteSpace: 'nowrap' }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', opacity: 0.72 }}>{nounLine}</div>
        {noteLines.map((line) => (
          // the instrument's register: the same monospace, set back — a note
          // ABOUT the reading, never another term in it
          <div key={line} style={{ fontSize: 9.5, fontFamily: 'ui-monospace, monospace', opacity: 0.52, fontStyle: 'italic' }}>
            {line}
          </div>
        ))}
      </div>
    </Html>
  );
}

// B-120 E.3 — one flat triangle in the page plane, tip at the origin pointing
// +x (rotated per edge). Shared verbatim by every arrowhead; the mesh's own
// bufferGeometry copies nothing, so nine floats serve the whole stemma.
const STEMMA_ARROW_VERTICES = new Float32Array([
  0, 0, 0,
  -STEMMA_ARROW.length, STEMMA_ARROW.halfWidth, 0,
  -STEMMA_ARROW.length, -STEMMA_ARROW.halfWidth, 0,
]);

// B-120 E.1/E.2/E.4 — the edge's operation word at the midpoint. The SPECIES
// is FormLabel's own (drei Html, distanceFactor 13, the page's ink) at the
// quiet monospace register, RECESSED against a form's name — a verb between
// two named things, never a third name. E.2 IS BY CONSTRUCTION: an Html
// label is a DOM overlay, screen-horizontal at every camera angle — the
// mechanism cannot express a rotated label, so with dragging sending edges
// to every angle the word still arrives in the manuscript's own reading
// direction. E.3's other half: the word carries NO arrow glyph — direction
// lives on the line, once.
function StemmaOpLabel({
  position,
  word,
  ink,
}: {
  position: [number, number, number];
  word: string;
  ink: string;
}) {
  return (
    <Html center position={position} distanceFactor={13} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
      <div
        data-stemma-op={word}
        style={{
          color: ink,
          fontFamily: 'ui-monospace, monospace',
          fontSize: 9.5,
          opacity: 0.62,
          whiteSpace: 'nowrap',
        }}
      >
        {word}
      </div>
    </Html>
  );
}

/** D.1 — the committed handle on the orbit controls. `makeDefault` publishes
 * them to the R3F store; this lifts that instance to a ref the drag can stop
 * SYNCHRONOUSLY, which a prop cannot do inside the gesture that starts it. */
function OrbitHandoff({ into }: { into: React.MutableRefObject<{ enabled: boolean } | null> }) {
  const controls = useThree((s) => s.controls) as unknown as { enabled: boolean } | null;
  useEffect(() => {
    into.current = controls ?? null;
  }, [controls, into]);
  return null;
}

// ═══ P5 · M.1–M.5 — THE MEMORIAL AT THE SITE ════════════════════════════════
// ⛔⛔ THE LOAD-BEARING CLAUSE, and the designer proved it on herself: A FORM
// THAT SIMPLY VANISHES IS INDISTINGUISHABLE FROM A CAMERA MOVE. So removal
// leaves a POSITIVE MARK AT THE SITE — the place on the page where the form
// stood, which is where he is looking when he acts.
//   M.2 the mark carries the NAME and the word.
//   M.3 the word is `removed`, NOT `died` — same mechanism, two words, and the
//       difference is AGENCY: `died` is what happens to a concept inside an
//       op; `removed` is what happens when HE does it.
//   M.4 RECESSED — a ghost, not a form. Same ink, quiet register, NO NEW
//       SPECIES: this is the page's own serif in the page's own ink, set back.
//   M.5 many at one site COLLAPSE to `N removed here` — the elision grammar,
//       entry-grammar refused, no route implied. ⚠ RULED (researcher): that is
//       ELISION and legal *iff the record still holds every individual death*,
//       which it does — `acts` is append-only and holds each one by name.
//   M.6 NOT DISMISSIBLE BY A GESTURE — so there is no close control here, and
//       no click handler. Dismissing a trace is erasing one.
// ⛔ §5 / the researcher's strengthening: a RESTORED form's site shows the
// form plus the return's own `restored` mark — never a `removed` ghost
// BENEATH a present form, which would say gone-and-here at once.
function SiteMemorial({
  marks,
  ink,
}: {
  marks: { name: string; restored: boolean }[];
  ink: string;
}) {
  const gone = marks.filter((m) => !m.restored);
  const back = marks.filter((m) => m.restored);
  if (gone.length === 0 && back.length === 0) return null;
  return (
    <Html center distanceFactor={13} zIndexRange={[38, 0]} style={{ pointerEvents: 'none' }}>
      <div
        data-site-memorial
        style={{
          textAlign: 'center',
          color: ink,
          fontFamily: 'Georgia, "Times New Roman", serif',
          whiteSpace: 'nowrap',
          opacity: 0.42, // M.4 — recessed: same ink, quiet register
          fontStyle: 'italic',
        }}
      >
        {/* M.2 + Δ23 (B-129 §3) — the NAME and the word on SEPARATE lines:
            the name slot carries the ledger's copied TITLE, which already
            ends in its own birth word in the same dash grammar (`Square —
            invoked`), so a dash-joined mark read `Square — invoked —
            removed` — the act's word riding the title's dash, the exact
            contradiction Arman finished in nine words (Δ23). The words are
            unchanged; only the join is gone. M.5's count form (POSITIVE,
            `N removed here`, never a blank) is untouched. */}
        {gone.length === 1 ? (
          <div style={{ fontSize: 11.5 }}>
            <div>{gone[0].name}</div>
            <div>removed</div>
          </div>
        ) : gone.length > 1 ? (
          <div style={{ fontSize: 11.5 }}>{`${gone.length} removed here`}</div>
        ) : null}
        {/* U.3 — the revert's own mark at the site: he must be able to tell
            *I undid it* from *the view moved*, exactly as for the removal
            itself — same composition, the word on its own line */}
        {back.length === 1 ? (
          <div style={{ fontSize: 11.5 }}>
            <div>{back[0].name}</div>
            <div>restored</div>
          </div>
        ) : back.length > 1 ? (
          <div style={{ fontSize: 11.5 }}>{`${back.length} restored here`}</div>
        ) : null}
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
// exported for the manuscript bench (the apex-lift seal folds the designer's
// 1620 ask in): the bench shows the LIFTED cone through the one component
export function FaithfulBody({
  model,
  seamColor,
  rimColor,
  seamWidth,
  rimWidth,
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
      {/* THE UNIFICATION (SEAL_FAITHFUL_BODY_UNIFICATION): the body FILL left
          this component — the cone's lateral surface now renders through the
          ONE crafted renderer (InkedForm, via buildFaithfulInkedModel — the
          LaidBody pattern). FaithfulBody is the OVERLAY riding it: the seam /
          rim / dot registers + the RECOGNITION marks (the fold letter, the
          source-edge ghosts) — exactly LaidCellOverlay's role. The wash is
          gone; the apex-lift geometry rides the adapter untouched. */}
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
            // the seam RIDES the lifted positions (apex z = h) — the small
            // z-nudge keeps it above the surface as before
            [seam.from[0], seam.from[1], seam.from[2] + 0.01],
            [seam.to[0], seam.to[1], seam.to[2] + 0.01],
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
        // the dots RIDE the lifted positions (the apex dot sits at z = h)
        <mesh
          key={vertex.id}
          position={[vertex.position[0], vertex.position[1], vertex.position[2] + 0.02]}
          renderOrder={2}
        >
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
  // THE REFINED IDENTIFY GESTURE (SEAL_THE_IDENTIFY_GESTURE, G1): the tail is
  // a VERTEX the person PICKS — `tail` names the tapped endpoint ('u' | 'v');
  // null = a tap on the edge BODY (meaningful only as a G3 re-tap flip).
  // ⛔ The click-proximity inference (nearer-endpoint-becomes-the-tail) is
  // DELETED — two discrete vertex targets replace the midpoint knife-edge.
  onPickEdge: (edgeId: string, tail: 'u' | 'v' | null) => void;
}) {
  const posOf = (vid: string): [number, number, number] | null => {
    const v = shape.vertices[vid];
    return v ? [v.position[0], v.position[1], v.position[2]] : null;
  };
  const inA = new Map(walkA.map((t, i) => [t.id, i]));
  const inB = new Map(walkB.map((t, i) => [t.id, i]));
  // the i-th A-edge lights while the i-th B-edge exists (pairing, live)
  const litA = new Set(walkB.map((_, i) => walkA[i]?.id).filter(Boolean));
  const lerp3 = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
  // the trace targets' PER-FRAME screen positions onto the dev seam — the
  // CorrespondencePickLayer idiom verbatim (R3F's own camera/size, so the
  // witness clicks in exactly the space R3F maps events from; a one-shot
  // manual projection raced the C1 select-flight — measured)
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ camera, size }) => {
    const group = groupRef.current;
    if (!group) return;
    const world = new Vector3();
    const positions: Record<string, { x: number; y: number; on: boolean }> = {};
    group.traverse((object) => {
      if (!object.name.startsWith('trace-tail:')) return;
      object.getWorldPosition(world);
      world.project(camera);
      positions[object.name] = {
        x: ((world.x + 1) / 2) * size.width,
        y: ((1 - world.y) / 2) * size.height,
        on: Math.abs(world.x) <= 1 && Math.abs(world.y) <= 1 && world.z >= -1 && world.z <= 1,
      };
    });
    const host = window as unknown as { __manuscriptCorrespondence?: { traceTargets?: typeof positions } };
    const seam = host.__manuscriptCorrespondence ?? (host.__manuscriptCorrespondence = {});
    seam.traceTargets = positions;
  });
  const nib = (u: [number, number, number], v: [number, number, number], dir: 1 | -1, ink: string, lit: boolean) => {
    const [tail, head] = dir === 1 ? [u, v] : [v, u];
    const w = lit ? 5.2 : 3.4; // the lit pair reads heavier, same ink
    return (
      <group>
        <Line points={[tail, lerp3(tail, head, 0.55)]} color={ink} lineWidth={w} renderOrder={14} />
        <Line points={[lerp3(tail, head, 0.55), lerp3(tail, head, 0.85)]} color={ink} lineWidth={w * 0.62} renderOrder={14} />
        <Line points={[lerp3(tail, head, 0.85), head]} color={ink} lineWidth={w * 0.32} renderOrder={14} />
        {/* G2 — THE TAIL LIGHTS WHERE YOU TOUCHED: the picked vertex marks;
            the stroke draws FROM it (no inference) */}
        <mesh position={tail} raycast={() => null}>
          <sphereGeometry args={[0.085, 12, 12]} />
          <meshBasicMaterial color={ink} />
        </mesh>
      </group>
    );
  };
  return (
    <group ref={groupRef}>
      {complex.edges.map((edge) => {
        const u = posOf(edge.u);
        const v = posOf(edge.v);
        if (!u || !v) return null;
        const mid: [number, number, number] = [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2, (u[2] + v[2]) / 2];
        const len = Math.hypot(v[0] - u[0], v[1] - u[1], v[2] - u[2]) || 1;
        const aHit = inA.get(edge.id);
        const bHit = inB.get(edge.id);
        const traced = aHit !== undefined || bHit !== undefined;
        // G1 — TWO DISCRETE VERTEX TARGETS per edge (inset onto the edge so
        // neighbouring edges' targets at a shared corner stay distinct): the
        // person taps the vertex they START from; a two-outcome decision gets
        // two targets — the midpoint knife-edge is gone.
        const targetU = lerp3(u, v, 0.14);
        const targetV = lerp3(v, u, 0.14);
        return (
          <group key={`trace:${edge.id}`}>
            {/* the fattened invisible proxy stays as the G3 RE-TAP surface —
                a tap on a TRACED edge's body flips its tail to the other end
                (a trace change, the same gesture); on an untraced edge it
                asks for a vertex (the panel's notice). SHORTENED to the
                middle span: a full-length fat cylinder STOLE the raycast
                from the end targets (its r=0.16 surface sits nearer the ray
                than the r=0.12 spheres — measured; the D2 closest-hit theft,
                this time by our own collider) — the end zones belong to the
                vertex targets EXCLUSIVELY. */}
            <mesh
              position={mid}
              quaternion={quaternionFromUnitY([(v[0] - u[0]) / len, (v[1] - u[1]) / len, (v[2] - u[2]) / len])}
              onClick={(e) => {
                e.stopPropagation();
                onPickEdge(edge.id, null);
              }}
            >
              <cylinderGeometry args={[0.16, 0.16, len * 0.56, 6]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {/* the two vertex TARGETS (visible + pickable; drawn faint until
                traced — every choice the person has is on the page) */}
            {(['u', 'v'] as const).map((endKey) => {
              const at = endKey === 'u' ? targetU : targetV;
              return (
                <mesh
                  key={`tail:${edge.id}:${endKey}`}
                  // the name = the app-path witness's target handle (the
                  // test-seam pattern): the leg finds + clicks the DISCRETE
                  // vertex targets by name, never by proximity
                  name={`trace-tail:${edge.id}:${endKey}`}
                  position={at}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPickEdge(edge.id, endKey);
                  }}
                >
                  <sphereGeometry args={[0.12, 12, 12]} />
                  <meshBasicMaterial
                    color={traced ? '#6b6252' : '#9a917e'}
                    transparent
                    opacity={traced ? 0.35 : 0.75}
                    depthWrite={false}
                  />
                </mesh>
              );
            })}
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

// B-105 W3 §1 (designer-ruled, P.1–P.6) — THE FOLD TAP ON THE DRAWN POLYGON:
// the pick is a TAP ON THE EDGE, on the figure (the fold gate's own gesture,
// ported one panel over — nothing new invented). The pair is MARKED ON THE
// FIGURE (one hue to a pair, the aperture's ratified palette-continuation
// rule); pending and decided BOTH positively marked (dashed / solid — her
// ratified legend); the DIRECTION is visible — the tick is the run's first
// corner and the way it runs is how the EDGES meet (→→ both ticks with the
// rim cycle · →⇄ the partner's tick at its far corner — the panel's own
// arrow grammar, drawn where the edges are). `e0, e1` go to the RECORD (the
// committed pairing's slot indices ride the birth record); no address stands
// on the person's surface. The hit meshes are NAMED (`fold-edge:{slot}`) so
// the acceptance leg taps the discrete targets by name, never by proximity.
function FoldTapOverlay({
  shape,
  edges,
  state,
  markColors,
  legendInk,
  onTapEdge,
}: {
  shape: Shape;
  edges: FaceEdgeLabel[]; // the committed rim vocabulary (slot order + ends)
  state: FoldState;
  markColors: string[];
  legendInk: string;
  onTapEdge: (edgeIndex: number) => void;
}) {
  // the untapped guide wears the trace overlay's own pickable-gray (one
  // vocabulary for "this is a target you have not chosen yet")
  const guideInk = '#9a917e';
  // the fold targets' PER-FRAME screen positions onto the dev seam — the
  // CycleTraceOverlay idiom verbatim (R3F's own camera/size, so a witness
  // clicks in exactly the space R3F maps events from)
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ camera, size }) => {
    const group = groupRef.current;
    if (!group) return;
    const world = new Vector3();
    const positions: Record<string, { x: number; y: number; on: boolean }> = {};
    group.traverse((object) => {
      if (!object.name.startsWith('fold-edge:')) return;
      object.getWorldPosition(world);
      world.project(camera);
      positions[object.name] = {
        x: ((world.x + 1) / 2) * size.width,
        y: ((1 - world.y) / 2) * size.height,
        on: Math.abs(world.x) <= 1 && Math.abs(world.y) <= 1 && world.z >= -1 && world.z <= 1,
      };
    });
    const host = window as unknown as {
      __manuscriptFold?: { targets?: typeof positions; state?: { pairs: BoundaryPairing[]; pending: number | null } };
    };
    const seam = host.__manuscriptFold ?? (host.__manuscriptFold = {});
    seam.targets = positions;
    seam.state = { pairs: state.pairs.map((p) => ({ ...p })), pending: state.pending };
  });
  const posOf = (vid: string): [number, number, number] | null => {
    const v = shape.vertices[vid];
    return v ? [v.position[0], v.position[1], v.position[2]] : null;
  };
  const lerp3 = (a: [number, number, number], b: [number, number, number], t: number): [number, number, number] => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
  // the pair index an edge belongs to (its hue); pending continues the
  // palette past the decided run — the ratified no-shared-hue rule
  const pairIndexOf = (edgeIndex: number): number =>
    state.pairs.findIndex((p) => p.edgeA === edgeIndex || p.edgeB === edgeIndex);
  // the run mark: heavy→light from the tick corner (the aperture grammar —
  // "the tick is its first corner, and the way it runs is how the EDGES meet")
  const run = (tail: [number, number, number], head: [number, number, number], ink: string, dashed: boolean) => (
    <group>
      <Line
        points={[tail, lerp3(tail, head, 0.55)]}
        color={ink}
        lineWidth={4.6}
        dashed={dashed}
        dashSize={0.09}
        gapSize={0.07}
        renderOrder={14}
      />
      <Line
        points={[lerp3(tail, head, 0.55), lerp3(tail, head, 0.85)]}
        color={ink}
        lineWidth={2.9}
        dashed={dashed}
        dashSize={0.09}
        gapSize={0.07}
        renderOrder={14}
      />
      <Line
        points={[lerp3(tail, head, 0.85), head]}
        color={ink}
        lineWidth={1.5}
        dashed={dashed}
        dashSize={0.09}
        gapSize={0.07}
        renderOrder={14}
      />
      <mesh position={tail} raycast={() => null}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshBasicMaterial color={ink} />
      </mesh>
    </group>
  );
  return (
    <group name="fold-tap-overlay" ref={groupRef}>
      {edges.map((edge) => {
        const u = posOf(edge.from);
        const v = posOf(edge.to);
        if (!u || !v) return null;
        const mid: [number, number, number] = [(u[0] + v[0]) / 2, (u[1] + v[1]) / 2, (u[2] + v[2]) / 2];
        const len = Math.hypot(v[0] - u[0], v[1] - u[1], v[2] - u[2]) || 1;
        const k = pairIndexOf(edge.index);
        const isPending = state.pending === edge.index;
        const pair = k >= 0 ? state.pairs[k] : null;
        // →→ same sense: both runs follow the rim cycle (tick at the slot's
        // own first corner). →⇄ opposed: the PARTNER edge's run reverses
        // (tick at its far corner) — the twist drawn where it acts (P.5).
        const reversedHere = pair !== null && pair.mode === 'reversing' && pair.edgeB === edge.index;
        const ink =
          pair !== null
            ? markColors[k % markColors.length]
            : isPending
              ? markColors[state.pairs.length % markColors.length]
              : null;
        return (
          <group key={`fold-edge:${edge.index}`}>
            {/* the tap target — the whole edge body, named for the leg. The
                collider rides 0.12 ABOVE the figure plane with a fat radius:
                the crafted ink stack's own meshes sit at small offsets and
                the CLOSEST intersection wins the R3F event (the D2 theft
                class — measured at the eye this build: a flush collider lost
                the ray to the inked face and the tap died in the selectable's
                inert single-click) */}
            <mesh
              name={`fold-edge:${edge.index}`}
              position={[mid[0], mid[1], mid[2] + 0.12]}
              quaternion={quaternionFromUnitY([(v[0] - u[0]) / len, (v[1] - u[1]) / len, (v[2] - u[2]) / len])}
              // the tap fires on POINTERDOWN — the panels' own mousedown
              // idiom, and the mechanism that makes the tap reach: the
              // selectable's inert single-CLICK handler stops the click
              // chain from any closer ink hit (measured at the eye: three
              // of six edges dead to click, all six alive to pointer events)
              onPointerDown={(e) => {
                e.stopPropagation();
                onTapEdge(edge.index);
              }}
              onPointerOver={() => {
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <cylinderGeometry args={[0.24, 0.24, len * 0.92, 6]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            {ink !== null ? (
              reversedHere ? (
                run(v, u, ink, isPending)
              ) : (
                run(u, v, ink, isPending)
              )
            ) : (
              /* untapped — a faint guide so every pickable edge is visible */
              <Line points={[u, v]} color={guideInk} lineWidth={1.6} transparent opacity={0.55} renderOrder={13} />
            )}
          </group>
        );
      })}
      {/* P.4 — the legend rides the figure (the aperture's ratified string,
          ONE word changed by her spec: faces → EDGES); same idiom + seat as
          the live-build legend */}
      <Html center position={[0, -1.7, 0]} distanceFactor={13} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 10.5,
            opacity: 0.6,
            color: legendInk,
          }}
        >
          dashed — not yet decided · solid — decided; the tick is its first corner, and the way it runs is how the EDGES
          meet · one hue to a pair
        </div>
      </Html>
    </group>
  );
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

// THE TWO HANDS (the designer's craft ruling, the argument card): SIGNS are
// set in the sign hand (sans — the book hand carries no glyph for ⊾/𝕋², and
// a sign rendered as tofu □ is a BLANK CLAIM); WORDS stay in the book hand
// (the card's serif). The app-path leg verifies glyph coverage per hand.
const SIGN_HAND = '"DejaVu Sans", "Segoe UI Symbol", "Noto Sans Symbols 2", "Noto Sans Symbols", sans-serif';

// THE ARGUMENT MAP (Phase 1 — the spine): the birth op drawn as a map, the
// concept/relation rows from the substrate trace, the words-line. Rows carry
// presentation letters; the substrate ids live in the model (the witness's
// surface). Row lists compact honestly past 8 (grouped by typing, counted —
// never dropped silently).
function ArgumentMapSection({
  argument,
  paper,
  emphasizedIds,
  onRowTouch,
}: {
  argument: ArgumentReading;
  paper: { cardBorder: string };
  // D2b (SEAL_D2_CORRESPONDENCE_MARKS): the shared emphasis — a row touch
  // lights the mark + the entity; a mark/entity pick lights the row (bold)
  emphasizedIds?: readonly string[];
  onRowTouch?: (resultId: string | null) => void;
}) {
  const sign: React.CSSProperties = { fontFamily: SIGN_HAND };
  const rowEmphasis = (resultId: string): React.CSSProperties =>
    emphasizedIds?.includes(resultId) ? { fontWeight: 700 } : {};
  const rowTouchProps = (resultId: string) => ({
    'data-row-id': resultId,
    onMouseEnter: () => onRowTouch?.(resultId),
    onMouseLeave: () => onRowTouch?.(null),
  });
  const compact = (rows: ArgumentMapRow[], mark: string) => {
    // relations always show their recorded source (the endpoint-named
    // parent edge — the measured substrate read); concepts split by typing.
    // THE LIFT (SEAL_THE_LIFT_IDENTITY_AND_GRAIN): a lifted row renders its
    // life-line read THROUGH to the birth record — "C — seed corner of the
    // tetrahedron, lifted" — never a mistyped born/invoked line
    // SLICE2: a 'derived' row (a mint-from-many whose sources PERSIST — the
    // researcher's split) draws its sources like an identified row but wears
    // its own honest word — never "identified" for a persisting mint
    const identified = rows.filter(
      (r) => r.kind === 'relation' || r.typing === 'identified' || r.typing === 'derived',
    );
    const bornOf = rows.filter((r) => r.kind === 'concept' && r.bornOf !== null && r.typing !== 'lifted');
    const plain = rows.filter(
      (r) =>
        r.kind === 'concept' &&
        r.typing !== 'identified' &&
        r.typing !== 'derived' &&
        (r.bornOf === null || r.typing === 'lifted'),
    );
    const lines: React.ReactNode[] = [];
    for (const r of identified) {
      lines.push(
        <div key={r.resultId} {...rowTouchProps(r.resultId)} style={{ fontSize: 13, ...rowEmphasis(r.resultId) }}>
          <span style={sign}>{mark}</span>
          <span style={sign}>{r.label}</span>
          <span style={sign}> ← </span>
          {/* B-110 §3a (the designer's ruling, her principle deciding it):
              WHERE POSITION CARRIES MEANING, REPETITION IS HARMLESS; WHERE
              POSITION CARRIES NOTHING, REPETITION IS A LIE. A CONCEPT's
              source side is a SET — and (her stronger second reason,
              measured) its order is `rootIds.sort()`, an INTERNAL ID order:
              a machine ADDRESS leaking onto his surface, so even keeping the
              positions would preserve an artifact of our storage. ⇒ it
              COUNTS (`two unnamed roots`) through the ruled composer, the
              same one the specimen card already reads. A RELATION's source
              side is an ORDERED, role-bearing tuple (X·Y = the run X → Y —
              B-105 W3 §4(a)) and keeps its repetition. One producer for the
              count, two readers that cannot disagree. */}
          <span style={sign}>
            {r.kind === 'concept' ? mergedRootsPhrase(r.rootOwnNames) : r.rootLabels.join(' ')}
          </span>
          {r.typing === 'lifted' ? <span style={{ opacity: 0.75 }}> — lifted</span> : null}
          {r.typing === 'derived' ? <span style={{ opacity: 0.75 }}> — derived</span> : null}
        </div>,
      );
    }
    for (const r of bornOf) {
      lines.push(
        <div key={r.resultId} {...rowTouchProps(r.resultId)} style={{ fontSize: 13, ...rowEmphasis(r.resultId) }}>
          <span style={sign}>{mark}</span>
          <span style={sign}>{r.label}</span>
          <span style={sign}> ⟷ </span>
          <span>{r.bornOf}</span>
        </div>,
      );
    }
    if (plain.length > 0 && plain.length + lines.length <= 8) {
      for (const r of plain) {
        lines.push(
          <div key={r.resultId} {...rowTouchProps(r.resultId)} style={{ fontSize: 13, ...rowEmphasis(r.resultId) }}>
            <span style={sign}>{mark}</span>
            <span style={sign}>{r.label}</span>
            <span style={{ opacity: 0.75 }}>
              {' — '}
              {r.typing === 'lifted'
                ? `${r.origin ? `${r.origin.display}, ` : ''}lifted`
                : r.typing === 'survived'
                  ? 'survives'
                  : 'born'}
            </span>
          </div>,
        );
      }
    } else if (plain.length > 0) {
      const survived = plain.filter((r) => r.typing === 'survived').length;
      const lifted = plain.filter((r) => r.typing === 'lifted').length;
      const born = plain.length - survived - lifted;
      lines.push(
        <div key={`${mark}:grouped`} style={{ fontSize: 12.5, opacity: 0.8 }}>
          <span style={sign}>{mark}</span>
          {[
            survived > 0 ? `${survived} survive` : null,
            lifted > 0 ? `${lifted} lifted` : null,
            born > 0 ? `${born} born` : null,
          ]
            .filter(Boolean)
            .join(' · ')}
        </div>,
      );
    }
    return lines;
  };
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ fontSize: 15.5 }}>
        <span style={{ ...sign, fontWeight: 700 }}>{argument.header.source}</span>
        <span style={sign}> ⟶ </span>
        <span style={{ ...sign, fontWeight: 700 }}>{argument.header.result}</span>
      </div>
      <div style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.75, marginBottom: 5 }}>
        {argument.op} — {argument.header.gloss}
      </div>
      <div style={{ fontSize: 10.5, letterSpacing: 1, opacity: 0.6, fontVariant: 'small-caps' }}>map — the spine</div>
      {compact(argument.conceptRows, '•')}
      {/* M3 (SEAL_M3_PERSISTENCE) — THE MEMORIAL: a cut-removed concept never
          vanishes silently; the TYPED died row names it + the op. (Measured:
          every committed door at HEAD absorbs or survives — the row is
          reachable-empty today and SPEAKS the first true death.) */}
      {argument.diedConceptRows.map((r) => (
        <div key={`died:${r.id}`} data-died-row={r.id} style={{ fontSize: 13, opacity: 0.8 }}>
          <span style={sign}>† </span>
          <span style={sign}>{r.label}</span>
          <span style={{ opacity: 0.75 }}> — died in {argument.op}</span>
        </div>
      ))}
      {argument.wordRows ? (
        // PHASE 2 — the ATTRIBUTED pairing from the committed replay-verified
        // birth word: —a ← AB CD (reversing draws the inverse letter)
        /* B-110 §3b (the designer's ruling): `·` binds CORNERS, `→` binds
           RUNS — the heavier mark for the looser bond. The arrow is
           semantically true rather than decorative: the line already says
           SURVIVES FROM with `←`, and slot → partner IS the identification
           the pair records.
           ═══ R3 (B-113) — OWN THE WRAP. ══════════════════════════════════
           She WITHDREW her own bracket fallback and ruled instead: the runs
           get a line each, with the ARROW LEADING THE CONTINUATION —
               —a⁻¹ ← unnamed·unnamed
                      → unnamed·unnamed
           ★ Her reason: THE CONTENT DID NOT FIT THE SLOT, SO THE SLOT
           CHANGED; she did not repunctuate to squeeze it in. The leading
           arrow is the one position a wrap cannot swallow — a trailing one
           can end a line and be read as the end of the row, a leading one
           cannot be read as anything but a continuation.
           The three columns (marker · arrow · run) are what make the arrows
           line up under each other whatever the letter's width — `a` and
           `a⁻¹` are different widths, so a spacer would only align by
           accident. */
        argument.wordRows.map((pair) => (
          <div
            key={pair.letter}
            style={{ fontSize: 13, display: 'grid', gridTemplateColumns: 'auto auto 1fr', columnGap: 5 }}
          >
            {pair.slotNames.map((run, i) => (
              <Fragment key={`${pair.letter}:${i}`}>
                <span style={sign}>{i === 0 ? `—${pair.displayLetter}` : ''}</span>
                <span style={sign}>{i === 0 ? '←' : '→'}</span>
                <span style={sign}>{run}</span>
              </Fragment>
            ))}
          </div>
        ))
      ) : (
        // the honest fallback (no recoverable word): the Phase-1 survivors +
        // the absorbed partners — NEVER a fabricated pairing
        <>
          {compact(argument.relationRows, '—')}
          {argument.absorbedRelations.length > 0 ? (
            <div style={{ fontSize: 12, opacity: 0.72 }}>
              <span style={{ fontVariant: 'small-caps', fontSize: 10.5, letterSpacing: 0.8 }}>absorbed </span>
              <span style={sign}>{argument.absorbedRelations.join(' ')}</span>
            </div>
          ) : null}
        </>
      )}
      {/* PHASE C (SEAL_PHASE_C_CARD_REGISTRY): the surfaced coarse relations —
          each row's PLACE is its drawn path through the live halves (the
          two-sided bar: never a name without a place, never a dropped
          relation) */}
      {argument.composedRelationRows.map((row) => (
        <div key={row.id} {...rowTouchProps(row.id)} style={{ fontSize: 13, ...rowEmphasis(row.id) }}>
          <span style={sign}>—</span>
          <span style={sign}>{row.label}</span>
          <span style={sign}> ← </span>
          <span style={sign}>{row.pathLabels.join(' ∘ ')}</span>
          <span style={{ opacity: 0.75 }}>
            {' — '}
            {row.kind === 'shared-by' ? 'shared wall' : 'composed seed relation'}
          </span>
        </div>
      ))}
      {/* TASK D (B-2026-08-23-C §5): the FACE register — the map's 2-cells,
          each named by the door's own composer (D14 corner reading through
          the threaded resolver; compose-over-absent reads 'unnamed'), in the
          menu's `· n corners` grammar — one vocabulary, two doors. Beyond 8
          the register groups like the spine does. ⚠ the ◻ glyph + the row
          form are the DESIGNER's to settle — shipped minimal, flagged. */}
      {argument.faceRows.length > 8 ? (
        /* §9 (B-2026-08-24-B amended — her string, the SEVEN clauses): an
           ELISION, never an entry. ◻ retained (the kind marker, clause 1) ·
           the number is the TOTAL faceRows.length, never a remainder (2) ·
           `in all` marks it a total (3) · `none named here` marks the
           withheld naming POSITIVELY (4) · NO route offered — past 8 the
           named rows do not render at all, there is nowhere to go (5) · the
           overflow act's own muted register, not entry grammar (6) · no
           `· N corners` on a total (7). */
        <div style={{ fontSize: 11, opacity: 0.65 }}>
          <span style={sign}>◻ </span>
          {argument.faceRows.length} faces in all — none named here
        </div>
      ) : (
        argument.faceRows.map((row) => (
          <div key={`face:${row.resultId}`} style={{ fontSize: 13 }}>
            <span style={sign}>◻ </span>
            <span style={sign}>{row.label}</span>
            <span style={{ opacity: 0.75 }}> · {row.corners} corners</span>
          </div>
        ))
      )}
      {argument.grainMarks.length > 0 ? (
        // THE GRAIN LAW: the lift's own honest refusal, rendered — never a
        // silently bare coarse entity presented as complete
        <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.8, marginTop: 3 }}>
          {argument.grainMarks.map((m) => (
            <div key={m}>⚠ {m}</div>
          ))}
        </div>
      ) : null}
      <div style={{ fontSize: 12, opacity: 0.78, marginTop: 3, borderBottom: `1px solid ${paper.cardBorder}55`, paddingBottom: 5 }}>
        {argument.words}
      </div>
      {argument.refusal ? (
        <div style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.75, marginTop: 4 }}>
          incidence · stance · verdict — not measured · {argument.refusal.slice(0, 140)}
        </div>
      ) : null}
      {argument.incidence ? (
        <div style={{ marginTop: 5 }}>
          <div style={{ fontSize: 10.5, letterSpacing: 1, opacity: 0.6, fontVariant: 'small-caps' }}>incidence — carried</div>
          {argument.incidence.slice(0, 8).map((row) => (
            <div key={row.conceptId} style={{ fontSize: 13 }}>
              {row.selfOnly ? (
                <>
                  <span style={sign}>{`${row.relationLetters[0]} ⌐ ${row.relationLetters[0]} @ ${row.conceptLabel}`}</span>
                  <span style={{ opacity: 0.75 }}> — no partner</span>
                </>
              ) : (
                <span style={sign}>{`${[...new Set(row.relationLetters)].join(' ⊾ ')} @ ${row.conceptLabel}`}</span>
              )}
            </div>
          ))}
          {argument.incidence.length > 8 ? (
            <div style={{ fontSize: 12, opacity: 0.7 }}>… {argument.incidence.length - 8} more meetings</div>
          ) : null}
        </div>
      ) : null}
      {argument.stance ? (
        <div style={{ marginTop: 5 }}>
          <div style={{ fontSize: 10.5, letterSpacing: 1, opacity: 0.6, fontVariant: 'small-caps' }}>stance — through the map</div>
          {argument.stance.slice(0, 8).map((row) => (
            <div key={row.conceptId} style={{ fontSize: 13 }}>
              <span style={sign}>
                {`${row.conceptLabel} : ${row.cornersDeg.length > 1 ? row.cornersDeg.join(' ⊕ ') : row.cornersDeg.join('')} = ${row.angleSumDeg}`}
              </span>
            </div>
          ))}
          {argument.stance.length > 8 ? (
            <div style={{ fontSize: 12, opacity: 0.7 }}>… {argument.stance.length - 8} more stances</div>
          ) : null}
        </div>
      ) : null}
      {argument.verdict ? (
        // the verdict wears the house verdigris (the designer's plate reads
        // teal; her bench pass refines the exact ink)
        <div style={{ marginTop: 5, color: '#2f6b6b' }}>
          <div style={{ fontSize: 10.5, letterSpacing: 1, opacity: 0.7, fontVariant: 'small-caps' }}>verdict — consequence</div>
          {argument.verdict.locals.slice(0, 4).map((l) => (
            // B-103 §2e rider: keyed by the concept ID — two locals can now
            // honestly share the label 'unnamed', and a label key would drop
            // one silently (the React silent-drop class)
            <div key={l.conceptId} style={{ fontSize: 13 }}>
              <span style={sign}>{`${l.conceptLabel} ${l.curvatureDeg > 0 ? '+' : ''}${l.curvatureDeg}°`}</span>
              {/* the rim-turn split: the boundary BENDS — a truthful default
                  phrase; the designer refines the wording on the bench */}
              <span> — {l.kind === 'rim-turn' ? 'a rim turn' : `a ${l.kind}`}</span>
            </div>
          ))}
          <div style={{ fontSize: 13 }}>
            <span style={sign}>{argument.verdict.closed ? '' : '○ '}</span>
            <span style={sign}>{argument.verdict.global}</span>
          </div>
          {argument.verdict.atForm ? (
            <div style={{ fontSize: 13 }}>
              <span style={sign}>uniform → </span>
              <span>at its Form</span>
            </div>
          ) : null}
        </div>
      ) : null}
      {argument.gloss ? (
        <div style={{ fontStyle: 'italic', fontSize: 12.5, opacity: 0.85, marginTop: 5 }}>
          “{argument.gloss}”
        </div>
      ) : null}
      {argument.declare ? (
        <div style={{ fontStyle: 'italic', fontSize: 12, opacity: 0.72, marginTop: 3 }}>{argument.declare}</div>
      ) : null}
    </div>
  );
}

// ═══ T1 §1 — THE CARD'S FRAME CONSTANTS, one source ══════════════════════════
// The card's top offset and its breathing room at the foot, used BOTH by the
// declared `top:` and by the height bound — so the bound is DERIVED from the
// card's own top, never from a second constant that can drift. ⛔ And the
// bound is `calc(100% − …)`, never `100vh`: her measured regression was
// exactly this frame mismatch — `100vh − 78` obeyed the cap while the card's
// containing block itself sat 52 px down the window, so the open card ran
// 38 px past the screen at EVERY height (116 − 78). A percentage resolves
// against the same containing block the `top:` is declared in — one frame,
// by construction.
const SPECIMEN_CARD_TOP = 64;
const SPECIMEN_CARD_BREATH = 14;

// the specimen card — manuscript-styled, rendered IFF a reading is summoned.
// THE ARGUMENT INVERSION (Phase 1): when the argument reading rides, the MAP
// is the card's spine and the INVARIANT rows demote into the `certificate`
// receipt (hairline rule, one graphite line, EXPAND-IN-PLACE — subordinate,
// never a second panel). Non-invariant registers (the deficit rows — R1's
// ratified proof register — resolution, cells, notes) stay SURFACED under
// the map: only invariants demote.
function SpecimenCard({
  reading,
  argument,
  paper,
  generatorInks,
  emphasizedIds,
  onRowTouch,
  fieldDoor,
  exploreDoor,
  ringRefusal,
  ringUnplaced,
  affordance,
  bound,
  deckRecord,
  formActs,
}: {
  reading: SpecimenReading;
  argument?: ArgumentReading | null;
  // B-103 §2a — the computed affordance line (the form's own answer). B-105
  // W3 §4(b): a zero total SPEAKS (her sentence); null means only that no
  // form is resolved here — never an empty total carried by absence
  affordance?: string | null;
  // B-103 §2c — the designer's quotient bound, sited adjacent (closed volumes)
  bound?: string | null;
  // B-105 ADR §7 — the deck-tiling's demoted record rows ({p,q} · the vertex
  // count · the descent check); present exactly when the tiling resolves
  deckRecord?: { label: string; value: string }[] | null;
  paper: { cardBackground: string; cardBorder: string; cardInk: string };
  generatorInks: { a: string; b: string };
  // D2b — threaded through to the map section (the shared emphasis)
  emphasizedIds?: readonly string[];
  onRowTouch?: (resultId: string | null) => void;
  // M1 — THE FIELD DOOR (closed by default; opening promotes the field
  // register + recedes the rest). Present on the specimen panel only where
  // the view mounts a promotable field route.
  fieldDoor?: { open: boolean; onToggle: () => void };
  // RUNG 1 — THE DOORWAY on the card (the charter's card-frame site, beside
  // the class-body note and the dim-3 reading): opening walks the habitat in
  // the EXPLORE WINDOW; the shell stays the operable representative behind.
  // The threshold verdict is the view's — this row only knocks.
  exploreDoor?: { onOpen: () => void };
  // THE RING ANCHOR RESOLVER — the card SPEAKS what the ring cannot draw:
  // a refused mode's whole-ring sentence (classBody/bodiless — an OPEN
  // declaration, the horizon doctrine) and any per-cell unplaced count.
  // ⛔ never a silent bare.
  ringRefusal?: string;
  ringUnplaced?: { id: string; reason: string }[];
  // ═══ P5 — THE TWO FORM-ACTS, in their OWN ROW ═════════════════════════════
  // ⛔ NOT on the affordance line and NOT in the OPERATIONS menu. Her cure,
  // and it is BY CONSTRUCTION rather than by wording: *the affordance line
  // answers what OPERATIONS consume this form and make something. Removal
  // consumes nothing and makes nothing — it acts on the PAGE.* ⇒ the one word
  // that SOUNDS like removal (`collapse`) and the act that IS removal are
  // never in the same list, so the `collapse` misfire has no site.
  // ⛔ And `remove` and `set aside` are separated BY PLACE, never by a confirm:
  // *a confirm is a refusal placed after the act, and I will not cure a
  // misfire with a speed bump.*
  formActs?: {
    onRemove: () => void;
    // present-and-reasoned, never present-and-inert (her U.4 principle, which
    // is about a control promising something it cannot do)
    setAside: { onSetAside: () => void } | { refusal: string };
  };
}) {
  // §7 — a REGISTER row touches its register through the ONE emphasizedIds
  // channel (`register:<name>` — the same mechanism as the key's entities)
  const registerTouch = (register: string) => ({
    'data-row-id': `register:${register}`,
    onMouseEnter: () => onRowTouch?.(`register:${register}`),
    onMouseLeave: () => onRowTouch?.(null),
  });
  const registerLit = (register: string): React.CSSProperties =>
    emphasizedIds?.includes(`register:${register}`) ? { fontWeight: 700 } : {};
  const [certificateOpen, setCertificateOpen] = useState(false);
  // ═══ B-130 A.2 + A.4 — THE ARGUMENT COMPARTMENT'S STATE ════════════════════
  // The one compartment that EARNED default-closed (her measurement: the
  // reading alone is 646 px — 56% of the worst card; closed, the whole card
  // fits a maximised 1080p window). Two agents, two mechanisms, her rule
  // verbatim — "attention promotes, data-presence never does":
  //   · the PERSON calls for it — the heading toggles `argumentOpen`;
  //   · the SYSTEM needs it — emphasis reaching a row INSIDE the closed
  //     compartment presents it for the duration (D2's one emphasizedIds
  //     channel; a hovered ring mark must never bold a row the person
  //     cannot see). Presentation only — the person's own state is never
  //     written by the machine.
  const [argumentOpen, setArgumentOpen] = useState(false);
  const argumentRowIds = argument
    ? new Set<string>([
        ...argument.conceptRows.map((r) => r.resultId),
        ...argument.relationRows.map((r) => r.resultId),
        ...argument.composedRelationRows.map((r) => r.id),
      ])
    : null;
  const argumentPresented =
    argumentOpen || (argumentRowIds !== null && (emphasizedIds ?? []).some((id) => argumentRowIds.has(id)));
  const row: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 14,
    borderTop: `1px solid ${paper.cardBorder}55`,
    padding: '4px 0 3px',
  };
  const isCertificateRow = (label: string): boolean =>
    Boolean(argument) && argument!.certificateLabels.some((prefix) => label.startsWith(prefix));
  const certificateRows = reading.rows.filter((r) => isCertificateRow(r.label));
  const surfacedRows = argument ? reading.rows.filter((r) => !isCertificateRow(r.label)) : reading.rows;
  return (
    <div
      style={{
        position: 'absolute',
        // B-131 §5 — the chrome floor, at the cure's own third site: a figure
        // label rendered between two certificate rows here and READ AS the
        // table's value. The card now sits above the whole label range.
        zIndex: CHROME_LAYER_Z,
        right: 14,
        top: SPECIMEN_CARD_TOP,
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
        // ═══ B-130 A.1 — BOUNDED (Arman's ruling: "we need the card to
        // scroll… without the card being always fully extended"), recut by
        // T1 §1 ═══════════════════════════════════════════════════════════════
        // The bound lives in the SAME frame as the top (the constants above —
        // her 38 px regression was the two frames diverging) and derives from
        // the card's own declared top, one source. A reading shorter than the
        // cap behaves exactly as before (auto height, no scrollbar). Her
        // clause 2's invariant rides the flex construction: the footer is the
        // column's last non-shrinking child and the region (minHeight: 0,
        // overflow auto) is the ONLY elastic member — the footer's bottom IS
        // the card's bottom, and every content variation is absorbed by the
        // region, in every compartment state.
        maxHeight: `calc(100% - ${SPECIMEN_CARD_TOP + SPECIMEN_CARD_BREATH}px)`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ═══ B-130 A.3 — THE READING SCROLLS; THE ACTS DO NOT ══════════════════
          Everything the card has to SAY lives in this scroll region; the acts
          row sits OUTSIDE it, after it, as the bounded frame's own fixed
          footer. Her reason, the strong one: once compartments open and close
          (A.2/A.4), the column's height changes UNDER THE PERSON'S HAND — a
          control at any offset in the column MOVES WHILE THEY USE IT.
          minHeight: 0 lets the region shrink inside the flex column (the
          min-content floor would defeat A.1's cap). */}
      <div data-specimen-scroll style={{ overflowY: 'auto', minHeight: 0 }}>
      <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>on select</div>
      <div style={{ fontSize: 17, fontWeight: 700 }}>{reading.title}</div>
      <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.72, marginBottom: 7 }}>
        {reading.subtitle}
      </div>
      {affordance ? (
        // B-103 §2a — the form answers from its own chair; checkable against
        // the dock chip-for-chip (LAW 23)
        <div data-affordance-line style={{ fontSize: 12.5, marginBottom: bound ? 2 : 7 }}>
          {affordance}
        </div>
      ) : null}
      {affordance && bound ? (
        // B-103 §2c — the designer's bound, verbatim, adjacent (the
        // later-chapter idiom: a limit spoken at its own site)
        <div data-quotient-bound style={{ fontSize: 11.5, fontStyle: 'italic', opacity: 0.75, marginBottom: 7 }}>
          {bound}
        </div>
      ) : null}
      {argument && argument.conceptRows.length > 0 && argument.conceptRows.every((r) => r.ownName === null) ? (
        // ═══ B-131 §3.2 — THE ABSENCE, SAID ONCE AT THE FORM'S GRAIN ═════════
        // The figure no longer spends a callout per unnamed corner (§3.1 —
        // the prong is the christening's mark now); the fact that NO corner
        // is named is a fact about the FORM, said once, in the form's own
        // voice, beside its other one-line answers. Renders only in the
        // all-unnamed state — a partly named form's remaining absences are
        // the ordinary, unmarked; its named corners carry their own prongs.
        // ⚠ THE STRING IS HERS — this is her example line from the mandate,
        // standing until her final wording lands.
        <div data-corner-absence style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.75, marginBottom: 7 }}>
          no corner is named yet
        </div>
      ) : null}
      {argument ? (
        // ═══ B-130 A.2/A.4/A.5/A.6 — THE ARGUMENT READING, COMPARTMENTED ═════
        // ONE compartment for the whole reading — which is A.6's invariant
        // ENFORCED BY CONSTRUCTION: the verdict renders only inside
        // ArgumentMapSection, and ArgumentMapSection mounts whole-or-not-at-
        // all, so `verdict open while the map is closed` is a state this
        // mechanism cannot express (a per-section split must re-prove that —
        // the reveal-order prefix is the shape that keeps it structural).
        // A.5 — closed-with-content and genuinely-empty differ by
        // construction too: an ABSENT reading renders no compartment at all
        // (a true absence, the ordinary unmarked), a CLOSED one shows its
        // heading + the map's own O-line + the COUNTED words line — how much
        // is inside, never what it concludes (ADR 0024: map first, even
        // closed).
        <div data-compartment-argument data-compartment-state={argumentPresented ? 'open' : 'closed'} style={{ marginTop: 6 }}>
          <div
            data-argument-door
            onMouseDown={(e) => {
              e.stopPropagation();
              setArgumentOpen((open) => !open);
            }}
            style={{
              cursor: 'pointer',
              fontSize: 10.5,
              letterSpacing: 1,
              opacity: 0.68,
              fontVariant: 'small-caps',
              // T1 §1 — the one new gesture the arrangement turns on meets
              // her R8 hit-target standard (≥ 24 px; it measured 16)
              minHeight: 24,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            the argument reading
          </div>
          {argumentPresented ? (
            <ArgumentMapSection
              argument={argument}
              paper={paper}
              emphasizedIds={emphasizedIds}
              onRowTouch={onRowTouch}
            />
          ) : (
            <div data-argument-closed>
              <div style={{ fontSize: 13.5 }}>
                <span style={{ fontFamily: SIGN_HAND, fontWeight: 700 }}>{argument.header.source}</span>
                <span style={{ fontFamily: SIGN_HAND }}> ⟶ </span>
                <span style={{ fontFamily: SIGN_HAND, fontWeight: 700 }}>{argument.header.result}</span>
              </div>
              <div style={{ fontSize: 12, opacity: 0.78 }}>{argument.words}</div>
            </div>
          )}
        </div>
      ) : null}
      {ringRefusal ? (
        // THE RING ANCHOR RESOLVER — the OPEN refusal (classBody/bodiless):
        // the key exists in the card; the body cannot carry it, and the card
        // SAYS so (never a silent bare figure)
        <div data-ring-refusal style={{ marginTop: 6, fontSize: 12, fontStyle: 'italic', opacity: 0.8 }}>
          {ringRefusal}
        </div>
      ) : null}
      {ringUnplaced && ringUnplaced.length > 0 ? (
        // the per-cell declarations — a cell the resolver could not place
        <div data-ring-unplaced style={{ marginTop: 4, fontSize: 11.5, fontStyle: 'italic', opacity: 0.75 }}>
          {ringUnplaced.length} cell{ringUnplaced.length > 1 ? 's' : ''} could not anchor — {ringUnplaced[0].reason}
        </div>
      ) : null}
      {surfacedRows.map((r) => (
        // the key carries label AND value: R1-REBUILD gave the card its first
        // multi-row register (two `deficit` rows — cone + rim), and a
        // label-only key collides (React may duplicate OR OMIT a row — the
        // silent-drop class). Caught by the app-path witness leg's console
        // clause on its first run.
        // §7 — the DEFICIT rows are the deficit register's card presence:
        // touching one promotes the register (which is FULL anyway — the
        // researcher's held exception — so the promotion recedes the others).
        <div
          key={`${r.label}·${r.value}`}
          style={{ ...row, ...(r.label === 'deficit' ? registerLit('deficit') : {}) }}
          {...(r.label === 'deficit' ? registerTouch('deficit') : {})}
        >
          <span style={{ opacity: 0.85 }}>{r.label}</span>
          <b style={{ textAlign: 'right', fontWeight: r.emphasize ? 800 : 600 }}>{r.value}</b>
        </div>
      ))}
      {/* B-105 ADR 0025 §7 — THE DECK-TILING RECORD: `{p,q}`, the vertex
          count and the descent check DEMOTED here from the window (the
          card's business, where an id and a count may live). Rows, not
          sentences; present exactly when the tiling resolves. */}
      {deckRecord?.map((r) => (
        <div key={`deck·${r.label}`} data-deck-record style={{ ...row, fontSize: 12.5, opacity: 0.85 }}>
          <span style={{ opacity: 0.85 }}>{r.label}</span>
          <b style={{ textAlign: 'right', fontWeight: 600, fontFamily: 'ui-monospace, monospace', fontSize: 11.5 }}>
            {r.value}
          </b>
        </div>
      ))}
      {fieldDoor ? (
        // M1 — THE FIELD DOOR (ManuscriptChrome's chip idiom; closed by
        // default). Hover touches the field register (§7's one channel);
        // the copy inside is the designer's placeholder.
        <FieldDoor
          open={fieldDoor.open}
          onToggle={fieldDoor.onToggle}
          onHover={(touching) => onRowTouch?.(touching ? 'register:field' : null)}
          paper={paper}
          accent={generatorInks.a}
        />
      ) : null}
      {exploreDoor ? (
        // RUNG 1 — the card's doorway into the habitat (the window is where
        // the inside-truth lives; close returns to this shell, unharmed)
        <div data-explore-door style={{ marginTop: 7 }}>
          <button
            type="button"
            onMouseDown={(e) => {
              e.stopPropagation();
              exploreDoor.onOpen();
            }}
            style={{
              width: '100%',
              padding: '5px 0',
              borderRadius: 3,
              border: `1px solid ${generatorInks.a}`,
              background: 'transparent',
              color: generatorInks.a,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            explore inside — walk the habitat
          </button>
        </div>
      ) : null}
      {argument ? (
        // THE CERTIFICATE — the demoted receipt (the seal's expand-in-place
        // ruling): a hairline rule, the word, one graphite line; click
        // expands the full invariant rows IN PLACE, subordinate always.
        <div style={{ marginTop: 7, borderTop: `1px solid ${paper.cardBorder}`, paddingTop: 4 }}>
          <div
            onMouseDown={(e) => {
              e.stopPropagation();
              setCertificateOpen((open) => !open);
            }}
            style={{ cursor: 'pointer', fontSize: 11, opacity: 0.68, display: 'flex', gap: 8, alignItems: 'baseline' }}
          >
            <span style={{ letterSpacing: 1, fontVariant: 'small-caps' }}>certificate</span>
            {!certificateOpen ? (
              <span style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10.5 }}>
                {certificateRows.map((r) => `${r.label} ${r.value}`).join(' · ') || '—'}
              </span>
            ) : null}
          </div>
          {certificateOpen
            ? certificateRows.map((r) => (
                <div key={`${r.label}·${r.value}`} style={{ ...row, fontSize: 12.5, opacity: 0.85 }}>
                  <span>{r.label}</span>
                  <b style={{ textAlign: 'right', fontWeight: 600 }}>{r.value}</b>
                </div>
              ))
            : null}
        </div>
      ) : null}
      {/* §5(a) (B-2026-08-24-B, RULED): THE NOTE REGISTER — the twist note
          and the χ clauses share ONE register, each note naming its own
          subject (never told apart by position). The two-notes room proved
          both sit at once without clobbering. */}
      {[...(reading.twist ? [reading.twist] : []), ...(reading.notes ?? [])].map((note) => (
        <div
          key={note}
          style={{
            marginTop: 8,
            padding: '5px 8px',
            border: `1px solid ${generatorInks.a}66`,
            borderRadius: 3,
            fontStyle: 'italic',
            fontSize: 12.5,
          }}
        >
          {note}
        </div>
      ))}
      <div style={{ marginTop: 9 }}>
        {reading.legend.length ? (
          // §7 — the legend rows are the GENERATORS register's card presence:
          // touching one promotes the generators (full) + recedes the rest
          reading.legend.map((entry) => (
            <div
              key={entry.key}
              {...registerTouch('generators')}
              style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3, ...registerLit('generators') }}
            >
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
        esc · double-click paper — the specimen sinks, the reading clears
      </div>
      </div>
      {/* ═══ P5 — THE TWO FORM-ACTS, THEIR OWN ROW — THE FIXED FOOTER (B-130
          A.3) ═══════════════════════════════════════════════════════════════
          Below every record row, behind a rule of their own, under a heading
          in a register that is not the operations' — PLACE SEPARATES KINDS.
          These two act on the PAGE; the affordance line above acts on the
          FORM. ⛔ OUTSIDE THE SCROLL REGION, at the bounded frame's own foot:
          P5 sited this row directly under the record rows INSIDE the growing
          column, and the R1 census measured the cost — on the invoked
          square's 1162 px card, `remove` sat at 987–1069 in a 950 px
          viewport with no scroll route: on a maximised 1080p browser the act
          did not exist (Arman: "i do not see no remove no undo"). The scroll
          region above carries the growth; this footer does not move with it
          — and once compartments open and close, NOT moving under the
          person's hand is the point. */}
      {formActs ? (
        <div
          data-form-acts
          style={{ flexShrink: 0, marginTop: 9, borderTop: `1px solid ${paper.cardBorder}`, paddingTop: 6 }}
        >
          <div style={{ fontSize: 10.5, letterSpacing: 1.1, opacity: 0.5, fontVariant: 'small-caps', marginBottom: 4 }}>
            this page — what you may do with the form itself
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              data-act-remove
              onMouseDown={(e) => {
                e.stopPropagation();
                // ⛔ NO CONFIRM. Separated from `set aside` by PLACE.
                formActs.onRemove();
              }}
              style={{
                flex: 1,
                padding: '4px 0',
                borderRadius: 3,
                border: `1px solid ${paper.cardBorder}`,
                background: 'transparent',
                color: paper.cardInk,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              remove
            </button>
            {'onSetAside' in formActs.setAside ? (
              <button
                type="button"
                data-act-set-aside
                onMouseDown={(e) => {
                  e.stopPropagation();
                  (formActs.setAside as { onSetAside: () => void }).onSetAside();
                }}
                style={{
                  flex: 1,
                  padding: '4px 0',
                  borderRadius: 3,
                  border: `1px solid ${paper.cardBorder}`,
                  background: 'transparent',
                  color: paper.cardInk,
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                set aside
              </button>
            ) : (
              // ⛔ REASONED, never present-and-inert: the act promises *it
              // leaves the page whole and WAITS*, and a form with no shelf
              // entry has nowhere to wait. Said at pick-time, where the limit
              // costs one look instead of a whole act.
              <span
                data-act-set-aside-refused
                style={{ flex: 1, fontSize: 11, opacity: 0.55, fontStyle: 'italic', alignSelf: 'center' }}
              >
                {formActs.setAside.refusal}
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// R4(a): THE ONE FACE-LABELER — the person-facing face label, minted once
// (the face-pick card and the birth gate's two port menus + the chord panel).
// F.0 (engineer 2300): the composer is now the D14 rule that already writes
// the aperture menu — `faceDisplayName`: corner names in cycle order,
// rotated to the earliest, direction NEVER normalised (a reversed cycle is
// a flipped face), `unnamed` on true absence. The id no longer fronts the
// person (`X · 4 corners` named every cube face alike); the countable
// `· N corners` stays (LAW 23). One rule, both registers — by REUSE.
// R2 (B-2026-08-24-B §3): the REACH rides here too — this labeler was the
// fourth reader on the same fact that never got the resolver (a ×I band's
// port menu read `unnamed · 4 corners` ×12 beside a card naming every
// face). The callers hand in the view's own resolveAbsentLabel; no fifth
// composing path exists.
const faceLabel = (shape: Shape, face: Face, resolveAbsent?: AbsentLabelResolver): string =>
  `${faceDisplayName(shape, face, resolveAbsent)} · ${face.vertexIds.length} corners`;

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
    // S4 surface-lock: object-unit ranges (the hatch rides the surface)
    spacingPx: { value: d.hatching.spacingPx, min: 0.02, max: 0.3, step: 0.005 },
    // §2: the legible-band target (apparent screen period, px) — her lever
    bandPx: { value: d.hatching.bandPx, min: 4, max: 24, step: 0.5 },
    opacity: { value: d.hatching.opacity, min: 0, max: 0.5, step: 0.01 }, // hard craft cap — anti-photoreal
    weightPx: { value: d.hatching.weightPx, min: 0.004, max: 0.06, step: 0.002 },
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
  // THE GPU EXPLORE WINDOW — pacing + the PART-A legibility dials (2026-08-11
  // seal: recede smooth-rod WEIGHT keep class color · focal hierarchy ·
  // LOD ladder). DIAL-AXIS (2026-08-12): the LOD dials read ECHO (transport
  // count — the fade's own axis; extinction ≈ echo 6); the designer re-gates
  // at her named station.
  const exploreCtl = useControls('world · explore', {
    pace: { value: d.world.explore.pace, min: 0.1, max: 1.2, step: 0.02 },
    lookSensitivity: { value: d.world.explore.lookSensitivity, min: 0.001, max: 0.012, step: 0.001 },
    smoothRodRecede: { value: d.world.explore.smoothRodRecede, min: 0, max: 1, step: 0.05 },
    depthWeightRatio: { value: d.world.explore.depthWeightRatio, min: 1, max: 12, step: 0.25 },
    lodMidEcho: { value: d.world.explore.lodMidEcho, min: 0, max: 8, step: 1 },
    lodSmallEcho: { value: d.world.explore.lodSmallEcho, min: 0, max: 10, step: 1 },
    lodTinyEcho: { value: d.world.explore.lodTinyEcho, min: 0, max: 12, step: 1 },
  });
  const inkCtl = useControls('world · aperture ink', {
    contourEchoFade: { value: d.world.aperture.contourEchoFade, min: 0.3, max: 1, step: 0.01 },
    contourGain: { value: d.world.aperture.contourGain, min: 0.5, max: 4, step: 0.05 },
    contourBlur: { value: d.world.aperture.contourBlur, min: 0.1, max: 2, step: 0.05 },
    // THE INSIDE-VIEW HATCH — the surface-locked stroke dials (the
    // screen-angle families are retired)
    strokePitch: { value: d.world.aperture.strokePitch, min: 0.05, max: 0.5, step: 0.005 },
    strokeDuty: { value: d.world.aperture.strokeDuty, min: 0.1, max: 0.35, step: 0.01 },
    strokeFloor: { value: d.world.aperture.strokeFloor, min: 0, max: 0.6, step: 0.01 },
    crossOnset: { value: d.world.aperture.crossOnset, min: 0.2, max: 1, step: 0.01 },
    grazingGain: { value: d.world.aperture.grazingGain, min: 0, max: 4, step: 0.05 },
    grazingFalloff: { value: d.world.aperture.grazingFalloff, min: 0.5, max: 5, step: 0.1 },
    chiralityAngleDeg: { value: d.world.aperture.chiralityAngleDeg, min: 0, max: 40, step: 1 },
    nibDepthScale: { value: d.world.aperture.nibDepthScale, min: 0, max: 2, step: 0.02 },
    nibNear: { value: d.world.aperture.nibNear, min: 0.5, max: 2, step: 0.05 },
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
    hatchBandPx: hatchingCtl.bandPx,
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
  // §2A (B-2026-08-22-A, Arman's ruling "manuscript is exactly like ambo"):
  // THE PAGE LIVES IN THE STORE — written · laid · shelf · built · folded ·
  // the D1 metric maps relocated to useManuscriptPageStore (module scope: the
  // page survives an unmount, the Ambo⇄Manuscript switch included). The
  // setters keep the exact useState updater signature, so every existing call
  // site reads unchanged.
  const written = useManuscriptPageStore((s) => s.written);
  const setWritten = useManuscriptPageStore((s) => s.setWritten);
  // CUT 1b — the laid bodies, keyed by shape id: computed ONCE at the moment a
  // classBody-routed form is born/placed (the same lineage the frozen router
  // used), consumed at the render/caption/card seams. A lay that walls simply
  // never enters the map — the committed class body stands untouched.
  const laidBodies = useManuscriptPageStore((s) => s.laidBodies);
  const setLaidBodies = useManuscriptPageStore((s) => s.setLaidBodies);
  // UNIFICATION — the adapter models, one per laid body: the InkedFormModel
  // the ONE crafted renderer draws (derived from the lay, never stored twice)
  const laidInkedById = useMemo(
    () => new Map([...laidBodies].map(([sid, m]) => [sid, buildLaidInkedModel(m)])),
    [laidBodies],
  );
  const seqRef = useRef(1);
  // §2A — written survives the unmount in the store, so the id mint must
  // never reuse a restored form's seq (w<seq> handles): on every written
  // change the mint jumps past the highest seq present.
  useEffect(() => {
    const maxSeq = written.reduce((max, { form }) => {
      const parsed = /^w(\d+)$/.exec(form.id);
      return parsed ? Math.max(max, Number(parsed[1])) : max;
    }, 0);
    if (seqRef.current <= maxSeq) seqRef.current = maxSeq + 1;
  }, [written]);
  // GAP2C: hoisted above its first use (targetFor ~:1236, via the availability
  // memo). §2A: the carried ancestor chains moved into the page store (they
  // are part of the page — a restored shelf re-populates them through the
  // same load door), read here and recorded at the two load sites.
  const shelfAncestors = useManuscriptPageStore((s) => s.shelfAncestors);
  const recordShelfAncestors = useManuscriptPageStore((s) => s.recordShelfAncestors);
  const recordShelfFile = useManuscriptPageStore((s) => s.recordShelfFile);
  const [invokeMenu, setInvokeMenu] = useState<{ x: number; y: number; world: [number, number] } | null>(null);
  const [formMenu, setFormMenu] = useState<{ x: number; y: number; id: string } | null>(null);
  const [opNotice, setOpNotice] = useState<string | null>(null);
  // ----- 3b: the sources shelf (committed snapshot loads) --------------------
  const shelf = useManuscriptPageStore((s) => s.shelf);
  const setShelf = useManuscriptPageStore((s) => s.setShelf);
  // §7 (B-2026-08-24-B, RULED): the STANDING UNSAVED MARK's fact — the
  // record layer differs from the last save/load. Derived per store change
  // (ids + counts only), never a flag that can drift; the zoo re-summon on
  // restore stays quiet by the signature's own zoo exclusion.
  const pageDirty = useManuscriptPageStore((s) => pageSignatureOf(s) !== s.savedSignature);
  // ═══ P5 — the acts ledger and the site marks (both RATCHET; see pageStore) ══
  const acts = useManuscriptPageStore((s) => s.acts);
  const removals = useManuscriptPageStore((s) => s.removals);
  const removeForm = useManuscriptPageStore((s) => s.removeForm);
  const setAsideForm = useManuscriptPageStore((s) => s.setAsideForm);
  const undoLastAct = useManuscriptPageStore((s) => s.undoLastAct);
  // §7's BACKSTOP (ruled acceptable as a backstop, NEVER the cure — the
  // cure is the standing mark where the act lives): a full reload with
  // unsaved work asks once before discarding it.
  useEffect(() => {
    if (!pageDirty) return undefined;
    const guard = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', guard);
    return () => window.removeEventListener('beforeunload', guard);
  }, [pageDirty]);
  const dragIndexRef = useRef<number | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  // ----- PHASE A (SEAL_PHASE_A_CAMERA) — the plate ------------------------
  // C1 (the designer's ruling): SELECT FRAMES THE SPECIMEN. On select, wait
  // one settle beat (SpecimenLift damps the body toward the stage), measure
  // the REAL drawn bounds (Box3 over the named wrapper), and fly the shared
  // fit; deselect returns the default overview. C2's chrome buttons are the
  // recovery path over the same request counters. Attitude/margins are sane
  // defaults — the designer gates them on the running plate.
  const sceneRef = useRef<THREE.Scene | null>(null);
  const prevSelectedRef = useRef<string | null>(null);
  // the D2-ground drag/click discriminator (the orbit residual): where the
  // pointer went DOWN — onPointerMissed compares to tell a drag-release
  // from a true click. A window-level CAPTURE listener arms it (a Canvas
  // onPointerDown prop does not reach the canvas element — measured on the
  // leg: the guard never armed and every release still deselected).
  const pointerDownScreenRef = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const arm = (event: PointerEvent): void => {
      pointerDownScreenRef.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('pointerdown', arm, true);
    return () => window.removeEventListener('pointerdown', arm, true);
  }, []);
  const [fitSelectedRequest, setFitSelectedRequest] = useState(0);
  const [resetCameraRequest, setResetCameraRequest] = useState(0);
  const [selectedCameraBounds, setSelectedCameraBounds] = useState<SceneBounds | null>(null);
  const overviewBounds = useMemo<SceneBounds>(() => ({ center: [0, 0, 0], radius: 8 }), []);
  const measureSelectedBounds = useCallback((): SceneBounds | null => {
    const scene = sceneRef.current;
    if (!scene || !selected) return null;
    const group = scene.getObjectByName(`written:${selected}`);
    if (!group) return null;
    const box = new THREE.Box3().setFromObject(group);
    if (box.isEmpty()) return null;
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    return {
      center: [sphere.center.x, sphere.center.y, sphere.center.z],
      radius: Math.max(0.5, sphere.radius),
    };
  }, [selected]);
  // ═══ R1 (B-113) — SELECTION HOLDS. THE CAMERA DOES NOT MOVE ON SELECT. ═════
  // ⇒ RULED BY THE DESIGNER, and her argument is better than "jarring":
  // ★ HE HAD TO SEE IT TO SELECT IT. He pointed at a thing, so it was in view
  // BY CONSTRUCTION — and moving the view afterwards takes away the very
  // context he used to act. ⛔ `eases` was REFUSED (an eased teleport is still
  // a teleport; you just watch it happen) and so was `frames-without-flying`
  // (it still moves the world, only politely).
  // ★ THE DISEASE, named: A STATE CHANGE PERFORMING A NAVIGATION — one
  // gesture doing two jobs. ⇒ AND THE DESELECT RESET GOES WITH IT, not by a
  // second ruling but because ITS SUBJECT IS GONE: once selection holds,
  // there is nothing to reset. (Her test for any future camera proposal: if
  // it still needs a rule for deselection, it has RELOCATED the conflation
  // rather than removed it.)
  //
  // What was here and what it cost, kept because it is the measurement that
  // bought the ruling (B-110 §2, at the eye on the reference zoo): selecting
  // a written form bumped `fitSelectedRequest` after one settle beat, and the
  // rig's fit is an INSTANT JUMP (position copy + lookAt + controls.target
  // copy — no easing anywhere) that framed ONE form tightly ⇒ 9 of the page's
  // 12 form labels left the viewport (one landed at x = 154406), and the
  // selected form's OWN label hides while selected, so the one thing left in
  // frame carried no name. That was her *"the page is BLANK"*.
  // ⚠ THE COST OF HOLDING, also measured and NOT hidden: the selected
  // specimen then reads ~0.11 of the frame, under the ≥0.22 her own C1 seal
  // pins (diagnose-deficit-app §E-PLATE). She ruled with that number in hand.
  // ⚠ THE BOUNDS MEASUREMENT STAYS — the dock's *Fit Selected* is the
  // person's own gesture for framing, and it needs them. The cut removes the
  // camera moving BY ITSELF, never the person's ability to move it.
  useEffect(() => {
    prevSelectedRef.current = selected;
    if (selected && selected.startsWith('w:')) {
      const timer = window.setTimeout(() => {
        const bounds = measureSelectedBounds();
        if (bounds) setSelectedCameraBounds(bounds);
      }, 420); // one settle beat — the lift's damp has largely landed
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [measureSelectedBounds, selected]);
  // ----- PHASE D1 — the correspondence state (data only; D2 renders) -------
  const [correspondenceHover, setCorrespondenceHover] = useState<CorrespondenceEntityRef | null>(null);
  const [correspondencePicked, setCorrespondencePicked] = useState<CorrespondenceEntityRef | null>(null);
  // ----- D2b — the shared emphasis (SEAL_D2_CORRESPONDENCE_MARKS) ----------
  // ~3 lit at once: the touched row's immediate argument-neighborhood (a
  // relation + its two endpoints · a concept + two incident relations · a
  // composed row + its live path) — never one bare entity, never all
  const [emphasizedIds, setEmphasizedIds] = useState<string[]>([]);
  // M1 (SEAL_THE_MARKED_SPECIMEN) — THE FIELD DOOR (closed by default) + the
  // §7 register promotion. ONE mechanism: a register promotion rides the SAME
  // emphasizedIds channel as the key's entities (`register:<name>` ids — no
  // new machinery); the door is standing state beneath the transient touch.
  // At most ONE annotation register is full; the DEFICIT is a STATED
  // EXCEPTION (held for the researcher, 1618) and never recedes.
  const [fieldDoorOpen, setFieldDoorOpen] = useState(false);
  const promotedRegister = useMemo(() => {
    const touched = emphasizedIds.find((i) => i.startsWith('register:'))?.slice('register:'.length);
    return touched ?? (fieldDoorOpen ? 'field' : null);
  }, [emphasizedIds, fieldDoorOpen]);
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
        // RUNG 1 — the explore window closes FIRST and ALONE: the shell keeps
        // its selection and every panel; return to it unharmed
        if (exploreOpenRef.current) {
          setExploreOpen(null);
          return;
        }
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
  // D2 — THE ONE DOOR (2026-08-15): the apertureSeed machine (the cube-era
  // "producer" state and its D1 side-car) is DISSOLVED — the aperture is a
  // view onto the volume the person points at (see the door block below).
  // D1's metric-base map stays: it keys built domains by their key, written
  // at BOTH exits from the pointed-at volume's own ancestry.
  const metricBaseIds = useManuscriptPageStore((s) => s.metricBaseIds);
  const setMetricBaseIds = useManuscriptPageStore((s) => s.setMetricBaseIds);
  // amendment 1759: a room whose carried-base resolve REFUSED (ambiguous
  // suffix match) records the refusal SENTENCE under its key — the reader
  // hands it to the D1 `baseMissing` floor so the caption reads
  // `unresolved-base` with the named reason, never a guessed base.
  const metricBaseRefusals = useManuscriptPageStore((s) => s.metricBaseRefusals);
  const setMetricBaseRefusals = useManuscriptPageStore((s) => s.setMetricBaseRefusals);
  // D8 (engineer 1629): the arity-2 base rides the PRODUCT RECORD
  // (`product.parents`, thicken:305) and the record does NOT survive the
  // shelf snapshot — so the base id returned by thickenManuscript is CARRIED
  // here at the mint, keyed by the PRODUCT'S OWN SHAPE ID. ⚠ VERIFIED per
  // the mandate (the shelf-route witness caught it): the RAW id does NOT
  // survive the shelf → paper route — deserializeSnapshot re-namespaces the
  // loaded shape to `snapshot:<source>:<originalId>` — but the ORIGINAL id
  // survives as that id's strict `:`-suffix, and the door resolves by it.
  // Session-local, like metricBaseIds: a product loaded from a saved file in
  // a later session has no carried record and honestly refuses by name at
  // the D1 floor.
  const productMetricBasesRef = useRef<Map<string, string>>(new Map());
  const builtDomains = useManuscriptPageStore((s) => s.builtDomains);
  const setBuiltDomains = useManuscriptPageStore((s) => s.setBuiltDomains);
  // 0.2 THE ORBIFOLD'S BODY: the folded verdicts' tower-less bodies — a
  // SIBLING list, never mixed into dim3All (the specimen register and every
  // DomainModel consumer stay untouched; a folded body has no tower to read).
  const foldedBodies = useManuscriptPageStore((s) => s.foldedBodies);
  const setFoldedBodies = useManuscriptPageStore((s) => s.setFoldedBodies);
  // §2A/§2B: the domain doors' input LEDGER — each act recorded with the
  // door it took, so the page file re-runs the SAME door on restore.
  const bumpBuiltCount = useManuscriptPageStore((s) => s.bumpBuiltCount);
  const unbumpBuiltCount = useManuscriptPageStore((s) => s.unbumpBuiltCount);
  const recordBuilt = useManuscriptPageStore((s) => s.recordBuilt);
  const [apertureOpen, setApertureOpen] = useState(false);
  // RUNG 1 — THE EXPLORE WINDOW: which room the person is inside of (null =
  // no window), and the door's last refusal (fires AT the threshold, by name)
  const [exploreOpen, setExploreOpen] = useState<string | null>(null);
  const [exploreRefusal, setExploreRefusal] = useState<{ key: string; reason: string } | null>(null);
  // B-104 RUNG 2 — the deck-tiling window (the surface arm's own door)
  const [tilingOpen, setTilingOpen] = useState<string | null>(null);
  const exploreOpenRef = useRef(false);
  useEffect(() => {
    exploreOpenRef.current = exploreOpen !== null;
  }, [exploreOpen]);
  // a new selection is a new door — the old refusal does not linger
  useEffect(() => {
    setExploreRefusal(null);
  }, [selected]);
  // (the CPU trace worker is RETIRED — the window renders as the
  // instrument's fragment shader on the GPU; ADR 0004 Amdt 7)
  // D2: the row count DERIVES from the pointed-at volume's boundary menu —
  // ⌊faces/2⌋ (the cube's ⌊6/2⌋ = 3 REPRODUCES the committed fixed three by
  // construction; the fan's ⌊15/2⌋ = 7). The default 3 seats the initial
  // state before any volume is pointed at.
  const emptyApertureRows = (count = 3): AperturePairRow[] =>
    Array.from({ length: Math.max(1, count) }, () => ({ faceA: null, faceB: null, candidateKey: null }));
  const [apertureRows, setApertureRows] = useState<AperturePairRow[]>(emptyApertureRows);
  const [apertureNotice, setApertureNotice] = useState<string | null>(null);
  // THE SUBDIVISION (ARC 0.1) recut as ONE ATOM (B-106 B1 — the doorless-wall
  // lifetime): the folded WALL is the verdict's sentence PLUS the rows whose
  // glue came back folded (the subdivide door's exact identification), held in
  // a single value. B-105 §2 measured them drifting apart — the volume-change
  // effect cleared the rows and left the notice standing (a promise outliving
  // the thing it promised). One state, one clear: the notice and its door live
  // and die together BY CONSTRUCTION. `apertureNotice` stays the general
  // channel for sentences that promise nothing (glued · refused · subdivided).
  const [apertureWall, setApertureWall] = useState<{ sentence: string; rows: AperturePairRow[] } | null>(null);
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

  // ----- R1-REBUILD — THE FAITHFUL WORLD MARK's datum (the corrected seal): --
  // the fold-born cone renders `faithful`, whose FaithfulBody composed no
  // deficit layer — the world-side drop. Per faithful entry: acquire the
  // complex on the ORIGINAL quotient shape (the recovery byte-compares its
  // replay), reposition to the fan's real placements, and the layer reads
  // THAT pair. A refused datum draws NOTHING in the world (the refusal
  // speaks on the card — never a false mark).
  const faithfulDeficitById = useMemo(() => {
    const map = new Map<string, FaithfulDeficitDatum>();
    for (const entry of written) {
      const render = entry.form.render;
      if (render.mode !== 'faithful') continue;
      const lineage = [entry.form.shape, entry.form.parentShape, ...(entry.form.parentShapes ?? [])].filter(
        (p): p is Shape => p !== null && p !== undefined,
      );
      map.set(entry.form.id, faithfulDeficitDatum(render.model, lineage));
    }
    return map;
  }, [written]);
  // THE UNIFICATION — the faithful cone through the ONE crafted renderer:
  // the adapter models, one per faithful body (the laidInkedById pattern)
  const faithfulInkedById = useMemo(() => {
    const map = new Map<string, InkedFormModel>();
    for (const entry of written) {
      const render = entry.form.render;
      if (render.mode !== 'faithful') continue;
      map.set(entry.form.id, buildFaithfulInkedModel(render.model));
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
      // R1 — THE DEFICIT REGISTER's specimen card: the PROOF register (the
      // WORLD shows the wedge and no numerals; the number lives here). Rows
      // read the SAME drawn body the world marks dress. R1-FIX — THE SILENCE
      // SPLITS in deficitCardRows: a REFUSED read speaks a refusal row (never
      // a number, never implying flatness); a MEASURED all-flat read stays
      // genuinely silent. R1-REBUILD — the dispatch moved into the TESTABLE
      // model (readDeficitForRender): EVERY mode resolves to a reasoned
      // reading — faithful reads the fan WITH its acquired complex, bodiless
      // speaks its refusal, immersion/skeleton are N-A by reason — no branch
      // falls through to a silent null (the dropped fold-born cone was
      // exactly that fall-through).
      const deficitRows = (() => {
        const lineage = [entry.form.shape, entry.form.parentShape, ...(entry.form.parentShapes ?? [])].filter(
          (p): p is Shape => p !== null && p !== undefined,
        );
        const deficitReading = readDeficitForRender(render, lineage);
        return deficitReading.kind === 'measured' ? deficitCardRows(deficitReading.model) : [];
      })();
      const speak = (r: SpecimenReading): SpecimenReading =>
        resolutionRows.length === 0 && deficitRows.length === 0
          ? r
          : { ...r, rows: [...r.rows, ...resolutionRows, ...deficitRows] };
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

  // (D16 — moved ABOVE the argument memo: the card now reads through the
  // door's resolver, so the page population and the reach must exist first;
  // both memos are byte-identical to their pre-move selves.)
  const shapeById = useMemo(() => {
    const map = new Map<string, Shape>();
    world.dim1.forEach((m) => map.set(m.shape.id, m.shape));
    world.dim2.forEach((m) => map.set(m.immersion.shape.id, m.immersion.shape));
    dim3All.forEach((m) => map.set(m.shape.id, m.shape));
    written.forEach((w) => {
      map.set(w.form.shape.id, w.form.shape);
      if (w.form.parentShape) map.set(w.form.parentShape.id, w.form.parentShape);
    });
    shelf.forEach((item) => {
      (item.entry.loaded.ancestors ?? []).forEach((ancestor) => {
        if (!map.has(ancestor.id)) map.set(ancestor.id, ancestor);
      });
    });
    return map;
  }, [world, written, dim3All, shelf]);
  // D12-b part 4 (engineer 1740) → 2(b) recut (ruling (i)): the door's
  // absent-label resolver — the ×I copy's source lives OUTSIDE the product
  // (in the base form), and the base now RIDES the product's own file as
  // its carried ancestor, entering `shapeById` in the SAME id space the
  // loader gave the product's `sourceVertexIds` — so the resolve is an
  // EXACT vertex-id match over the page population, and the retired
  // one-namespace-layer suffix walk is dead with its class. ALL
  // positively-present candidate labels must AGREE — disagreement or none
  // refuses (null → `unnamed`, never a silent pick). An id-copy or empty
  // source label is no name and never resolves. A pre-2(b) band file that
  // carries no ancestor resolves nothing and reads the honest `unnamed` —
  // its record was never whole, and the label no longer pretends it was.
  const resolveAbsentLabel = useMemo(() => {
    const shapes = [...shapeById.values()];
    return (sourceVertexIds: string[], _vertexId: string): string | null => {
      const ref = sourceVertexIds[0];
      if (!ref) return null;
      const labels = new Set<string>();
      for (const shape of shapes) {
        for (const vertex of Object.values(shape.vertices)) {
          if (vertex.id !== ref) continue;
          const raw = typeof vertex.data?.label === 'string' ? vertex.data.label.trim() : '';
          if (raw.length === 0 || raw === vertex.id) continue; // absence or manufacture — no name to carry
          labels.add(raw);
        }
      }
      return labels.size === 1 ? [...labels][0] : null;
    };
  }, [shapeById]);
  // THE ARGUMENT-READING CARD (Phase 1 — the MAP): the birth op's argument,
  // read from the substrate (primalMultiset roots, one-generation sources,
  // typing). Rides its OWN prop — SpecimenReading is FROZEN and untouched.
  // D16 (B-2026-08-23-C §4): the card takes the door's resolver ENTIRE —
  // the SAME reach the aperture menu reads through, level marks riding.
  const selectedArgument = useMemo<ArgumentReading | null>(() => {
    if (!selected) return null;
    const [band, key] = selected.split(':');
    if (band !== 'w') return null;
    const entry = written.find((w) => w.form.id === key);
    return entry ? buildArgumentReading(entry.form, resolveAbsentLabel) : null;
  }, [selected, written, resolveAbsentLabel]);
  // THE RING ANCHOR RESOLVER — the TOTAL verdict for the selected specimen:
  // anchors (any rendering mode) or a DECLARED refusal the card speaks.
  const ringResolution = useMemo(() => {
    if (!selected || !selectedArgument) return null;
    const [band, key] = selected.split(':');
    if (band !== 'w') return null;
    const entry = written.find((w) => w.form.id === key);
    return entry ? resolveRingAnchors(entry.form, selectedArgument) : null;
  }, [selected, selectedArgument, written]);
  // PHASE D1 — the correspondence seam (the dev test-seam pattern beside
  // __manuscriptScene/__manuscriptCamera): hovered · picked · the row
  // id-space (the LIVE resultIds the card rows already carry — `===` is the
  // whole contract, Phase C resolved); the pick layer writes `positions`
  // per frame from its own world matrices
  useEffect(() => {
    const host = window as unknown as {
      __manuscriptCorrespondence?: CorrespondenceSeam & {
        emphasizedIds?: string[];
        composedRowIds?: string[];
        ringResolution?: {
          kind: 'anchored' | 'refused';
          mode: string | null;
          refusal: string | null;
          unplaced: number | null;
          anchored: number | null;
        } | null;
        registers?: {
          door: boolean;
          full: string | null;
          deficit: 'full-exception';
          recessedStyles: Record<string, { form: string; widthFactor: number; ink: string }>;
        };
      };
    };
    const seam = host.__manuscriptCorrespondence ?? (host.__manuscriptCorrespondence = {});
    seam.hovered = correspondenceHover;
    seam.picked = correspondencePicked;
    seam.rowResultIds = selectedArgument
      ? [...selectedArgument.conceptRows, ...selectedArgument.relationRows].map((r) => r.resultId)
      : [];
    seam.composedRowIds = selectedArgument ? selectedArgument.composedRelationRows.map((r) => r.id) : [];
    seam.emphasizedIds = emphasizedIds;
    // THE RING ANCHOR RESOLVER — the every-mode witness's read: the verdict
    // kind, the mode it judged, the refusal sentence, the per-cell count
    seam.ringResolution = ringResolution
      ? {
          kind: ringResolution.kind,
          mode: (() => {
            const [band, key] = (selected ?? '').split(':');
            const entry = band === 'w' ? written.find((w) => w.form.id === key) : undefined;
            return entry?.form.render.mode ?? null;
          })(),
          refusal: ringResolution.kind === 'refused' ? ringResolution.refusal : null,
          unplaced: ringResolution.kind === 'anchored' ? ringResolution.unplaced.length : null,
          anchored: ringResolution.kind === 'anchored' ? ringResolution.anchors.size : null,
        }
      : null;
    // M1 — the registers seam: the door, the ONE full annotation register
    // (null = all recessed), the deficit's stated exception, and the two
    // RESOLVED recessed styles (the injectivity witness reads real values:
    // distinct FORMS + distinct factors + distinct receded inks)
    seam.registers = {
      door: fieldDoorOpen,
      full: promotedRegister,
      deficit: 'full-exception',
      recessedStyles: {
        generators: {
          form: 'line',
          widthFactor: manuscriptDefaults.registers.recessedLineFactor,
          ink: recedeInk(generatorsCtl.a),
        },
        field: {
          form: 'stipple',
          widthFactor: manuscriptDefaults.registers.recessedStippleFactor,
          ink: recedeInk(STIPPLE_INK),
        },
      },
    };
  }, [correspondenceHover, correspondencePicked, selectedArgument, emphasizedIds, fieldDoorOpen, promotedRegister, generatorsCtl.a, ringResolution, selected, written]);
  // D2b — the argument-neighborhood of a touched id (~3 lit; the exact
  // neighborhood is the designer's look-gate)
  const emphasisNeighborhood = useCallback(
    (id: string): string[] => {
      const entry = selected ? written.find((w) => `w:${w.form.id}` === selected) : undefined;
      const shape = entry?.form.shape;
      if (!shape) return [id];
      const edge = shape.edges.find((e) => e.id === id);
      if (edge) return [edge.id, edge.vertexIds[0], edge.vertexIds[1]]; // a relation + its two endpoints
      if (shape.vertices[id]) {
        const incident = shape.edges.filter((e) => e.vertexIds.includes(id)).map((e) => e.id);
        return [id, ...incident.slice(0, 2)]; // the concept + two incident relations
      }
      const rec = selectedArgument?.composedRelationRows.find((r) => r.id === id);
      if (rec) return [id, ...rec.pathIds].slice(0, 4); // the composed row + its live path
      return [id];
    },
    [selected, written, selectedArgument],
  );
  // the entity side lights the set (a pick is sticky; a hover is transient)
  useEffect(() => {
    const source = correspondencePicked ?? correspondenceHover;
    setEmphasizedIds(source ? emphasisNeighborhood(source.id) : []);
  }, [correspondenceHover, correspondencePicked, emphasisNeighborhood]);
  // the card-row side (threaded into the map section). §7: a REGISTER row
  // (`register:<name>`) promotes its register through the same channel —
  // no neighborhood (a register is one thing, not a graph locus).
  const handleRowTouch = useCallback(
    (resultId: string | null): void => {
      if (resultId?.startsWith('register:')) {
        setEmphasizedIds([resultId]);
        return;
      }
      if (resultId) setEmphasizedIds(emphasisNeighborhood(resultId));
      else setEmphasizedIds(correspondencePicked ? emphasisNeighborhood(correspondencePicked.id) : []);
    },
    [correspondencePicked, emphasisNeighborhood],
  );

  // ----- 3a: the op target + the committed availability + the apply path -----
  const rows = d.world.rows;
  const bands = d.world.bands;
  const centered = (k: number, n: number, gap: number): number => (k - (n - 1) / 2) * gap;

  // REGISTRY UNBOUNDING (2026-07-11): the page's shape lookup — the REAL
  // lineage walk resolves each target's full ancestry over the world's and
  // the written forms' shapes (parents included), never a fabricated list.
  // 2(b) (B-2026-08-22-C): the shelf's CARRIED ancestors join the lookup —
  // a hopped product's genealogy pointer names its reconstructed operand
  // (the committed loader's parentPointer), and that operand OBJECT lives
  // on the ShelfEntry (`loaded.ancestors`, the record being whole); without
  // this the pointer would name a shape the page could not hand the pillar
  // reader, and the sealed metric would refuse as unresolved-base.
  // THE APERTURE per dim-3 domain: the GATE first (unsound · fit refusal ⇒
  // DRAW NOTHING, SAY SO — the refusal IS the caption; B.0: a sound cone form
  // draws — k≠4 is a cone edge, never a curved ambient), else the
  // image-space trace — the room populated by the mask, the coil, and whatever
  // form the person placed. Copies are what the light does, never drawn.
  const apertures = useMemo(
    () =>
      dim3All.map((model) => {
        // step 8 (THE INSIDE-VIEW HATCH) + D1 (2026-08-14): the cone-angle
        // seam takes the SEALED metric when the room's seed is a thicken
        // product whose base resolves — through the UNARY parent pointer OR
        // the arity-2 metric-base thread (`product.parents` carried onto the
        // model's key; `parentShapeId` is null there by the connectedSum
        // design and is never crowned). An OWNED product whose recorded base
        // cannot be found on the page REFUSES BY NAME (the floor at
        // resolveConeAngleSource) — never a silent k×90° in measured
        // clothing. A cube-seeded room stays heuristic legitimately.
        const isProduct = model.shape.genealogy?.operation === 'product';
        const metricBaseId = isProduct
          ? model.shape.genealogy?.parentShapeId ?? metricBaseIds[model.key] ?? null
          : null;
        // amendment 1759: a room whose carried-base resolve REFUSED at the
        // door (ambiguous suffix match) carries that sentence instead of a
        // base — it rides the same baseMissing floor, refused by name
        const metricAmbiguity = isProduct && !metricBaseId ? metricBaseRefusals[model.key] ?? null : null;
        const lineageBase = metricBaseId ? shapeById.get(metricBaseId) : undefined;
        const gate = buildAperture(
          model,
          lineageBase
            ? { base: lineageBase }
            : isProduct && metricBaseId
              ? { baseMissing: `the recorded metric base "${metricBaseId}" is no longer on the page` }
              : metricAmbiguity
                ? { baseMissing: metricAmbiguity }
                : undefined,
        );
        if (!gate.ok) {
          return { key: model.key, gate, trace: null, caption: gate.reason };
        }
        const placedId = placedForms[model.key];
        const placedShape = placedId ? shapeById.get(placedId) ?? null : null;
        // BOUND 1 (mothership): the probes are DEFAULTS, not permanent
        // furniture — a placed form can DISPLACE them (the scene recomposes
        // from the same committed pieces: the form's mesh, the cell's rods).
        const probes = [...probeMeshes.maskShells, probeMeshes.hand];
        // B-113: the scene is built in the room the person is IN — the sealed
        // model's own cell when the domain earned one, the seed's euclidean
        // cell (byte-identically) when it did not
        const base = buildApertureScene(model.shape, placedShape, probes, gate.model);
        const scene =
          placedShape && displacedRooms[model.key]
            ? { meshes: base.meshes.slice(probes.length), capsules: [], rods: base.rods, rodRadius: base.rodRadius }
            : base;
        const trace = traceAperture({
          deck: gate.deck,
          model: gate.model,
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
        // B-114: the plate carries the sealed class and says whether IT is the
        // shadow — the model reaching the tracer (B-113) means it is not.
        return { key: model.key, gate, trace, caption: apertureCaption(gate.geometry, trace.counts, gate.seal, gate.model === null) };
      }),
    [dim3All, placedForms, shapeById, apertureCtl, metricBaseIds, metricBaseRefusals],
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
        const scene = buildApertureScene(body.shape, null, probes, gate.model);
        const trace = traceAperture({
          deck: gate.deck,
          model: gate.model,
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
        return { key: body.key, gate, trace, caption: apertureCaption(gate.geometry, trace.counts, gate.seal, gate.model === null) };
      }),
    [foldedBodies, apertureCtl],
  );
  // THE APP-PATH LEG's aperture seam — an UNGATED `window` seam, exactly
  // like the committed __manuscriptScene/__manuscriptCamera it sits beside
  // (amendment 1759: no import.meta.env gate exists on any of the three;
  // whether they should be DEV-gated is the engineer's separate question —
  // this label claims the idiom, not a gate). It carries the gates'
  // RESOLVED metric facts per room, so the D8 shelf-route witness asserts
  // the carry ON THE RUNNING APP. The person-facing `(measured)` mark rides
  // the explore window's canvas caption (out of DOM reach); the plate
  // caption carries the VALUE — this seam carries the FACT.
  useEffect(() => {
    (window as unknown as {
      __manuscriptApertures?: Record<string, { metricSource: string | null; label: string | null }>;
    }).__manuscriptApertures = Object.fromEntries(
      apertures.map((a) => [
        a.key,
        a.gate.ok
          ? {
              metricSource: 'metricSource' in a.gate.geometry ? (a.gate.geometry.metricSource as string) : null,
              label: 'label' in a.gate.geometry ? a.gate.geometry.label : null,
            }
          : { metricSource: null, label: null },
      ]),
    );
  }, [apertures]);
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
          title: DIM2_TITLES[m.surface],
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
      const carried = shelfAncestors.get(entry.form.shape.id);
      return {
        shape: entry.form.shape,
        parent: entry.form.parentShape,
        ancestry: carried?.length ? [...ancestry, ...carried] : ancestry,
        title: entry.form.title,
        home: entry.home,
      };
    },
    [world, written, shapeById, rows, scaleCtl.dim1Scale, scaleCtl.dim2Scale, scaleCtl.dim3Scale, layoutCtl.spacing, dim3All, shelfAncestors],
  );

  // ----- D2 — THE ONE DOOR (sovereign-ruled: "building manifold-3 becomes
  // real on the user's choice over the shapes, not a given set of shapes"):
  // the aperture is a VIEW ONTO A VOLUME THE PERSON POINTS AT — the
  // apertureSeed machine is dissolved. A volume is the selected form whose
  // shape carries >= 1 cell; the cube panel is the degenerate case of the
  // one rule (a single cell owns every face). Anything else is refused BY
  // NAME — never a silent disable.
  const apertureTarget = useMemo(() => targetFor(selected), [targetFor, selected]);
  const apertureVolume = useMemo(
    () => (apertureTarget && apertureTarget.shape.cells.length >= 1 ? apertureTarget.shape : null),
    [apertureTarget],
  );
  // ⛔ COPY PENDING THE DESIGNER (flagged in the handback — both refusals and
  // the door's own label are hers; these placeholders only hold the slots):
  const apertureVolumeRefusal = !apertureTarget
    ? 'point at a solid first — select a form to build on (nothing is selected)'
    : apertureTarget.shape.cells.length === 0
      ? 'this form is a surface, not a solid — there is no room to build on it'
      : null;
  // 2(b) (B-2026-08-22-C, mothership-ruled) — THE POINTER IS THE RECORD,
  // read FIRST: thicken names the base at BOTH arities now, and the
  // committed loader re-roots the pointer onto the CARRIED ancestor riding
  // the product's own file — so on a hopped band the pointer names an
  // object shapeById can actually hand the pillar reader (the operand, in
  // the product's own id space; the mint-space look-alike on the page is
  // the WRONG operand — measured, that mismatch was the heuristic-caption
  // bug). The D8 carried map (`productMetricBasesRef`, mint-time keys) is
  // the exact-id fallback for a product that never hopped; its suffix walk
  // and the amendment-1759 ambiguity that guarded it are DEAD (ruling (i)).
  // A pointer that resolves nowhere still rides out last — the aperture
  // memo turns it into the honest `unresolved-base` refusal, never a guess.
  const apertureVolumeBase = useMemo((): CarriedMetricBaseResolution => {
    if (!apertureVolume || apertureVolume.genealogy?.operation !== 'product') {
      return { baseId: null, ambiguity: null };
    }
    const pointer = apertureVolume.genealogy.parentShapeId ?? null;
    if (pointer && shapeById.has(pointer)) return { baseId: pointer, ambiguity: null };
    const resolved = resolveCarriedMetricBase(apertureVolume.id, productMetricBasesRef.current);
    if (resolved.baseId !== null || resolved.ambiguity !== null) return resolved;
    return { baseId: pointer, ambiguity: null };
  }, [apertureVolume, shapeById]);
  // (D16: `resolveAbsentLabel` — the D12-b/2(b) door resolver — moved above
  // the argument memo with `shapeById`; the aperture reads it from there.)
  const apertureFaceMenu = useMemo(() => {
    if (!apertureVolume) return [];
    try {
      return boundaryFacesOf(apertureVolume, resolveAbsentLabel);
    } catch {
      // the pinch guard's refusal surfaces through the panel's refusal line,
      // not a crash; the menu offers nothing rather than something false
      return [];
    }
  }, [apertureVolume, resolveAbsentLabel]);
  // §3.3 — the parity census, read BEFORE the person acts: null while no
  // volume is pointed at (or the menu refuses); the panel prints its lines
  // only when the parity actually forces a wall.
  const apertureParity = useMemo(
    () => (apertureVolume ? apertureParityCensus(apertureVolume, resolveAbsentLabel) : null),
    [apertureVolume, resolveAbsentLabel],
  );

  // the gate panel's rows with the MAP MENU — the face's own dihedral orbit;
  // each option prints its vertex correspondence + the DERIVED mode (recorded,
  // never chosen — the knob that lies does not exist here)
  const apertureRowViews = useMemo((): AperturePairRowView[] => {
    const allFaces = apertureFaceMenu;
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
      // D13 §2 (engineer 2021): the candidate build sits ON THE RENDER PATH —
      // no exception may escape it (the un-guarded call was the black
      // screen: a throw here unmounts the entire tree). A throw becomes an
      // empty menu; the row's own refusal line speaks the reason by name.
      let mapChoices: { key: string; label: string }[] = [];
      let mapRefusal: string | null = null;
      if (apertureVolume && row.faceA && row.faceB && row.faceA !== row.faceB) {
        try {
          // B-101 §2b rider: the per-candidate refusals are COLLECTED — an
          // empty menu is never silently unexplained (the dev register warns;
          // the person-facing sentence for an all-refused pair awaits the
          // designer's wording, reported not invented)
          const refusals: { key: string; reason: string }[] = [];
          mapChoices = dihedralMapCandidates(apertureVolume, row.faceA, row.faceB, (r) => refusals.push(r)).map(
            (c) => ({
              key: c.key,
              // B-102 §2b: the map labels read through the SAME corner-name
              // producer the face picker one row up composes with — one
              // fact, one producer; the menu and the picker cannot disagree
              label: describeCandidate(c, (vertexId) => cornerDisplayName(apertureVolume, vertexId, resolveAbsentLabel)),
            }),
          );
          if (mapChoices.length === 0 && refusals.length > 0) {
            // B-104 R2: the person hears HER sentence at the empty menu; the
            // per-candidate reasons stay in the dev register
            mapRefusal = NO_MAP_FITS_SENTENCE;
            console.warn(
              `aperture: every identification candidate for ${row.faceA} ~ ${row.faceB} was refused by the fit`,
              refusals,
            );
          }
        } catch (error) {
          console.warn(`aperture: the candidate build threw for ${row.faceA} ~ ${row.faceB}`, error);
          mapChoices = [];
        }
      }
      return {
        faceA: row.faceA ?? '',
        faceB: row.faceB ?? '',
        mapKey: row.candidateKey ?? '',
        faceChoicesA: allFaces.filter((f) => !takenA.has(f.id) || f.id === row.faceA),
        faceChoicesB: allFaces.filter((f) => !takenB.has(f.id) || f.id === row.faceB),
        mapChoices,
        mapRefusal,
      };
    });
  }, [apertureRows, apertureVolume, apertureFaceMenu, resolveAbsentLabel]);
  const apertureRefusal = useMemo(
    () => (apertureVolume ? aperturePairingRefusal(apertureVolume, apertureRows) : apertureVolumeRefusal),
    [apertureVolume, apertureRows, apertureVolumeRefusal],
  );
  // F.0 — the EMPTY STATE (engineer 2300 / mothership 1745 §5): before the
  // person has acted, the refusal may not occupy the primary action's slot.
  // Same words may stand; the REGISTER must not.
  const aperturePristine = useMemo(
    () => apertureRows.every((row) => !row.faceA && !row.faceB && !row.candidateKey),
    [apertureRows],
  );
  // F.0 — BLIND IDENTIFICATION CURED (engineer 2300): the skeleton runs
  // LIVE while the room is built. The COMPLETE rows (both faces + a map)
  // feed the COMMITTED path — buildPersonDomainVerdict → buildFormDomain;
  // a partial pairing set is simply a less-glued complex (measured at every
  // arity by the mandate itself), so the preview is a REAL DomainModel, not
  // a mock. One finished row draws its pair while the rest sit empty (the
  // preview is never gated on a complete set — the blindness is worst
  // exactly while it is incomplete). A folded or refused live pick falls
  // back to the zero-pair skeleton — the outline stands while the refusal
  // line speaks.
  // F.0b — THE PENDING MARK (the sanctioned worldModel union): a row with
  // BOTH faces and NO map reaches the skeleton as a PENDING pair — faces
  // chosen, meeting unknown, stated positively by its own type
  // (`DomainPendingPairMark`, no mode field; still no fabricated mode
  // anywhere). One-face rows are not pairs and are not drawn. The person's
  // chosen candidate's correspondence rides each DECIDED mark (the carry)
  // so the twist is expressible downstream; fixture-built marks carry none
  // — absence stays absent.
  const liveApertureDomain = useMemo(() => {
    if (!apertureOpen || !apertureVolume) return null;
    const complete = apertureRows.filter((row) => row.faceA && row.faceB && row.candidateKey);
    const pendingRows = apertureRows.filter((row) => row.faceA && row.faceB && !row.candidateKey);
    let domain: DomainModel | null = null;
    try {
      if (complete.length === 0) {
        domain = buildFormDomain(apertureVolume, [], 'live-build', 'the build in progress');
      } else {
        const verdict = buildPersonDomainVerdict(apertureVolume, complete, 'live-build', 'the build in progress');
        if (!verdict.folded) domain = verdict.domain;
      }
    } catch {
      // fall through to the bare outline below
    }
    if (!domain) {
      try {
        domain = buildFormDomain(apertureVolume, [], 'live-build', 'the build in progress');
      } catch {
        return null;
      }
    }
    let pendingPairs: DomainPendingPairMark[] = [];
    try {
      pendingPairs = pendingPairMarks(
        apertureVolume,
        pendingRows.map((row) => [row.faceA as string, row.faceB as string]),
      );
    } catch {
      pendingPairs = [];
    }
    const corrOf = new Map<string, [string, string][]>();
    for (const row of complete) {
      // per-row guarded — the candidate build sits on the render path (D13);
      // an unbuildable menu carries nothing, the other rows still carry
      try {
        const chosen = dihedralMapCandidates(apertureVolume, row.faceA as string, row.faceB as string).find(
          (c) => c.key === row.candidateKey,
        );
        if (chosen) corrOf.set(`${row.faceA}→${row.faceB}`, chosen.correspondence);
      } catch {
        // absence stays absent
      }
    }
    const pairs = domain.pairs.map((pair) => {
      const correspondence = corrOf.get(`${pair.faceIds[0]}→${pair.faceIds[1]}`);
      return correspondence ? { ...pair, correspondence } : pair;
    });
    return { ...domain, pairs, pendingPairs };
  }, [apertureOpen, apertureVolume, apertureRows]);
  // F.0e — THE TRACE IS THE NAME (mothership §2): each live pair mark is the
  // face's own edge cycle in D14 order (faceTraceCycle — the printed name's
  // own rotation, shared code). A DECIDED pair traces its partner by walking
  // A's D14 cycle THROUGH the person's chosen correspondence, so the
  // direction the trace runs on B IS the way the faces meet — preserving
  // runs with B's own cycle, reversing against it — read off the figure.
  // Without a carried correspondence B keeps its own cycle: the pair still
  // says WHICH faces and claims no direction (absence stays absent). A
  // PENDING pair traces both faces' own cycles.
  const liveApertureTraces = useMemo(() => {
    if (!liveApertureDomain || !apertureVolume) return null;
    const positionOf = (id: string): Vec3 | null => {
      const vertex = apertureVolume.vertices[id.replace(/^c\d+:/, '')];
      return vertex ? [vertex.position[0], vertex.position[1], vertex.position[2]] : null;
    };
    const decided = liveApertureDomain.pairs.map((pair) => {
      const a = faceTraceCycle(apertureVolume, pair.faceIds[0]);
      let b = faceTraceCycle(apertureVolume, pair.faceIds[1]);
      if (a && b && pair.correspondence) {
        const image = new Map(pair.correspondence);
        const corners = a.corners.map((c) => image.get(c));
        if (corners.every((c): c is string => typeof c === 'string')) {
          const mapped = corners.map((c) => positionOf(c));
          if (mapped.every((p): p is Vec3 => p !== null)) {
            b = { faceId: b.faceId, corners: corners as string[], positions: mapped as Vec3[] };
          }
        }
      }
      return { a, b };
    });
    const pending = (liveApertureDomain.pendingPairs ?? []).map((pair) => ({
      a: faceTraceCycle(apertureVolume, pair.faceIds[0]),
      b: faceTraceCycle(apertureVolume, pair.faceIds[1]),
    }));
    return { decided, pending };
  }, [liveApertureDomain, apertureVolume]);
  // D10 MEASUREMENT SEAM (dev-only, the leg's synthetic larger row count):
  // `?d10rows=N` pads the row STATE beyond the derived count so the panel's
  // bound is measured where no real volume reaches — the menu itself is
  // untouched and the seam is unreachable in a production build.
  // D13 WITNESS SEAM (dev-only, like d10rows): `?d13throw=panel` throws
  // inside the tight boundary's subtree when the door opens; `?d13throw=page`
  // throws in the view's own render body — the class only the last-resort
  // boundary can catch. Unreachable in a production build; exists so the leg
  // can watch each boundary SPEAK instead of a black screen.
  const d13Throw = useMemo(() => {
    if (!import.meta.env.DEV) return null;
    return new URLSearchParams(window.location.search).get('d13throw');
  }, []);
  const d10SyntheticRows = useMemo(() => {
    if (!import.meta.env.DEV) return 0;
    const raw = new URLSearchParams(window.location.search).get('d10rows');
    const n = raw ? Number(raw) : 0;
    return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
  }, []);
  const derivedApertureRowCount = useCallback(
    () => Math.max(Math.floor(apertureFaceMenu.length / 2), d10SyntheticRows),
    [apertureFaceMenu.length, d10SyntheticRows],
  );
  // pointing at a different volume clears the rows (their count derived from
  // ITS boundary menu) — face ids from another solid must never linger in
  // the pickers; a held folded wall dies WHOLE with them (sentence + door in
  // one clear — the B-105 doorless wall cannot recur: B-106 B1)
  useEffect(() => {
    setApertureRows(emptyApertureRows(derivedApertureRowCount()));
    setApertureWall(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apertureVolume?.id, apertureFaceMenu.length]);
  const handleApertureGlue = useCallback(() => {
    if (!apertureVolume) return; // the door's chip is gated on the refusal line
    try {
      const n = bumpBuiltCount();
      // THE FOLDED EDGE (ADR 0022): the door returns a VERDICT — a folded
      // identification is not free (an orbifold), refused BY NAME with the
      // researcher's wall; nothing joins the world and the aperture draws
      // nothing. Zero throws escape this door. D2: dispatched on the pointed-
      // at volume's cell count inside the verdict itself.
      const verdict = buildPersonDomainVerdict(apertureVolume, apertureRows, `built-${n}`, `built 3-manifold ${n}`);
      // §2B — the act enters the LEDGER (door + inputs, verbatim): the page
      // file re-runs this exact door on restore. A folded verdict is still
      // the person's act — recorded; the restore reproduces the same body.
      recordBuilt({
        door: 'glue',
        key: `built-${n}`,
        title: `built 3-manifold ${n}`,
        seed: apertureVolume,
        rows: apertureRows.map((row) => ({ ...row })),
        baseId: apertureVolumeBase.baseId ?? null,
        baseRefusal: apertureVolumeBase.ambiguity ?? null,
      });
      if (verdict.folded) {
        // 0.2 THE ORBIFOLD'S BODY: the verdict carries a BODY now — it joins
        // the folded shelf and the aperture draws it. The wall + its cure
        // (0.1) stand as ONE atom (B-106 B1): the researcher's sentence and
        // the subdivide door's exact rows are set in a single value, and the
        // superseded general notice clears — the wall speaks alone.
        setFoldedBodies((cur) => [...cur, verdict.body]);
        setApertureWall({ sentence: verdict.wall, rows: apertureRows.map((row) => ({ ...row })) });
        setApertureNotice(null);
        return;
      }
      const domain = verdict.domain;
      setBuiltDomains((cur) => [...cur, domain]);
      // D1 (re-threaded through the door): the room inherits the pointed-at
      // volume's own metric base — EXIT A's half of the both-exits law;
      // an AMBIGUOUS resolve records its refusal instead (amendment 1759)
      if (apertureVolumeBase.baseId) setMetricBaseIds((cur) => ({ ...cur, [`built-${n}`]: apertureVolumeBase.baseId as string }));
      else if (apertureVolumeBase.ambiguity) setMetricBaseRefusals((cur) => ({ ...cur, [`built-${n}`]: apertureVolumeBase.ambiguity as string }));
      setApertureNotice(
        domain.tower.sound
          ? `glued — H₁ ${domain.tower.homology.H1.pretty} · the aperture opens in the dim-3 band`
          : 'glued — the S² gate refuses this pattern; the band says so and draws nothing',
      );
      // D2 residual (found while wiring D10, disclosed): the post-exit reset
      // took the pre-derivation default (3) — the ratified ⌊menu/2⌋ law now
      // holds after an exit on the same volume too
      setApertureRows(emptyApertureRows(derivedApertureRowCount()));
      setApertureWall(null);
    } catch (error) {
      unbumpBuiltCount();
      // a door-level refusal (an incomplete matching, an unknown candidate) — named
      setApertureNotice(`the engine refused: ${(error as Error).message}`);
      setApertureWall(null);
    }
  }, [apertureVolume, apertureRows, apertureVolumeBase, derivedApertureRowCount, bumpBuiltCount, unbumpBuiltCount, recordBuilt]);
  // D2 — EXIT B: LEAVE BOUNDED (the mothership's spine clause: the fault was
  // never that the room was bounded — it was that nobody was asked).
  // R1 (B-2026-08-24-B §2, RULED): `leave bounded` CONSUMES the picked pairs
  // and walls the remainder — the panel's own sentence ("pair the ones you
  // choose — the rest stand as walls") was already the ruling. The old
  // hardcoded `[]` assumed a domain is either FULLY GLUED or FULLY OPEN —
  // true when this exit was written, stale since the 07-18 seal made partial
  // pairing legitimate; it silently discarded the person's committed pick.
  // A TOUCHED row now goes through the SAME verdict door the glue exit uses
  // (its named refusals — incomplete pair, unknown candidate — and the
  // folded orbifold wall included); untouched rows keep the zero-pair
  // chamber byte-identical to before (the verdict door itself refuses zero
  // pairs — that refusal guards the GLUE exit's meaning and stands).
  // ⛔ the button's wording is the designer's (flagged).
  const handleApertureLeaveBounded = useCallback(() => {
    if (!apertureVolume) return;
    try {
      const n = bumpBuiltCount();
      const touched = apertureRows.some((row) => row.faceA !== null || row.faceB !== null);
      const verdict = touched
        ? buildPersonDomainVerdict(apertureVolume, apertureRows, `built-${n}`, `built 3-manifold ${n}`)
        : ({
            folded: false as const,
            domain: buildFormDomain(apertureVolume, [], `built-${n}`, `built 3-manifold ${n}`),
          });
      // §2B — EXIT B enters the LEDGER too (door 'bounded', the REAL rows —
      // R1: the restore replays the same consumed pairs; a pre-R1 record
      // carries rows [] and restores its all-walls chamber as recorded).
      recordBuilt({
        door: 'bounded',
        key: `built-${n}`,
        title: `built 3-manifold ${n}`,
        seed: apertureVolume,
        rows: apertureRows.map((row) => ({ ...row })),
        baseId: apertureVolumeBase.baseId ?? null,
        baseRefusal: apertureVolumeBase.ambiguity ?? null,
      });
      if (verdict.folded) {
        // the folded identification is a verdict here too — consuming the
        // pairs means consuming their wall (and its subdivide cure), exactly
        // as the glue exit does; nothing is silently un-consumed. Same B1
        // atom: sentence + rows in one value, the general notice cleared.
        setFoldedBodies((cur) => [...cur, verdict.body]);
        setApertureWall({ sentence: verdict.wall, rows: apertureRows.map((row) => ({ ...row })) });
        setApertureNotice(null);
        return;
      }
      const domain = verdict.domain;
      setBuiltDomains((cur) => [...cur, domain]);
      // D1: the both-exits law — EXIT B carries the base too (or the
      // ambiguity refusal, amendment 1759)
      if (apertureVolumeBase.baseId) setMetricBaseIds((cur) => ({ ...cur, [`built-${n}`]: apertureVolumeBase.baseId as string }));
      else if (apertureVolumeBase.ambiguity) setMetricBaseRefusals((cur) => ({ ...cur, [`built-${n}`]: apertureVolumeBase.ambiguity as string }));
      setApertureNotice(
        domain.tower.sound
          ? `left bounded — the free rim stands as walls · the chamber joins the dim-3 band`
          : 'left bounded — the S² gate refuses this pattern; the band says so and draws nothing',
      );
      // D2 residual (disclosed): the derived ⌊menu/2⌋ count, post-exit too
      setApertureRows(emptyApertureRows(derivedApertureRowCount()));
      setApertureWall(null);
    } catch (error) {
      unbumpBuiltCount();
      setApertureNotice(`the engine refused: ${(error as Error).message}`);
      setApertureWall(null);
    }
  }, [apertureVolume, apertureRows, apertureVolumeBase, derivedApertureRowCount, bumpBuiltCount, unbumpBuiltCount, recordBuilt]);
  // THE SUBDIVISION DOOR (ARC 0.1, LAW 14 — a cure must be a door, not a
  // theorem): on the folded verdict the person invokes subdivide — the seed is
  // bisected, the pairings lift, the form is re-glued, and the gate reads the
  // finer cells. ⛔ The notice CLAIMS NOTHING about the result: it speaks the
  // gate's own reading (the finer question is ARC 0.3, its own seal).
  const handleApertureSubdivide = useCallback(() => {
    if (!apertureWall || !apertureVolume) return;
    try {
      // D2 §5 (the :2411 finding, cured): the cure reads THE VOLUME THE
      // PERSON IS LOOKING AT — never a hardwired cube. A multi-cell volume
      // is refused by name inside the committed reader.
      const { counts, reading } = subdivideAndReadPersonDomain(apertureVolume, apertureWall.rows);
      const cellsLine = `${counts.v} v · ${counts.e} e · ${counts.f} f · ${counts.c} cell`;
      setApertureNotice(
        reading.folded
          ? `subdivided (${cellsLine}) — the gate STILL reads a fold at ${reading.foldedEdgeClasses.join(', ')}; report this`
          : reading.tower.sound
            ? `subdivided (${cellsLine}) — the fold is resolved; the gate reads: χ ${reading.tower.chi} · w₁ ${reading.tower.w1.w1} · H₁ ${reading.tower.homology.H1.pretty}`
            : `subdivided (${cellsLine}) — the fold is resolved; the S² gate now refuses the finer complex: ${reading.tower.gate.failures.map((f) => f.kind).join(', ')}`,
      );
      setApertureWall(null);
    } catch (error) {
      // B1: the fold is NOT resolved, so the WALL STANDS WHOLE — sentence and
      // door together (the atom cannot half-die); the refusal speaks beside
      // it in the general channel. (The old two-state shape replaced the wall
      // sentence here while the door survived — the inverse drift.)
      setApertureNotice(`the engine refused: ${(error as Error).message}`);
    }
  }, [apertureVolume, apertureWall]);
  const selectedDim3 = useMemo(
    () => (selected && selected.startsWith('dim3:') ? dim3All.find((m) => `dim3:${m.key}` === selected) ?? null : null),
    [selected, dim3All],
  );
  // B-104 RUNG 2 — the deck-tiling resolution for the selected written form:
  // the ACQUIRED complex (the same one the identify trace reads) → {p,q} →
  // the conformal tiling. null = not a candidate (no complex reaches it);
  // {ok:false} = a candidate whose tiling REFUSES with counted facts (the
  // greyed chip speaks it); {ok:true} = the door opens on THIS.
  const deckTilingFor = useMemo((): TilingResolution | null => {
    if (!selected || !selected.startsWith('w:')) return null;
    const target = targetFor(selected);
    if (!target) return null;
    try {
      const acquired = acquireComplex(target.shape, target.ancestry ?? null);
      if (!acquired) return null;
      const nonOrientable = (() => {
        try {
          return readFormInvariants(target.shape, target.ancestry ?? null).cert?.nonOrientable === true;
        } catch {
          return false;
        }
      })();
      return resolveDeckTiling(acquired.complex as never, nonOrientable);
    } catch {
      return null;
    }
  }, [selected, targetFor]);
  // RUNG 1 → RUNG 2 — which doorways exist for the current selection: a
  // dim-3 room, the folded shelf, or a SURFACE whose deck-tiling RESOLVES
  // (the door is TRUE-PREDICTIVE: eligible ⟺ it opens — the affordance
  // line lists it, and a listed door that then refused would be the false
  // promise §2b killed; a candidate whose tiling refuses stays ineligible
  // and the greyed chip speaks the counted facts).
  const exploreEligible = useMemo((): 'room' | 'folded' | 'surface' | null => {
    if (!selected) return null;
    if (selected.startsWith('dim3:')) return 'room';
    if (selected.startsWith('dim3f:')) return 'folded';
    if (selected.startsWith('w:')) return deckTilingFor?.ok === true ? 'surface' : null;
    return null;
  }, [selected, deckTilingFor]);
  // the tiling window follows the selection — a stale window never lingers
  useEffect(() => {
    setTilingOpen((cur) => (cur !== null && cur !== selected ? null : cur));
  }, [selected]);
  // THE DOOR (GPU reset + the DOOR-FEED partial): a room with a LEGAL
  // pairing OPENS — fully paired (E³/cone/folded, Amdt 10) AND the
  // researcher's bounded body alike (a partial pairing is legitimate; its
  // unpaired faces render as WALLS — the room's edge, never an escape).
  // Unsound patterns and surfaces refuse BY NAME at the door.
  const handleExploreDoor = useCallback(() => {
    if (!selected) return;
    if (exploreOpen && exploreOpen === selected) {
      setExploreOpen(null);
      return;
    }
    const judgeGate = (gate: (typeof apertures)[number]['gate']): void => {
      if (!gate.ok) {
        // the S² gate's own refusal rides the same door, verbatim
        setExploreRefusal({ key: selected, reason: gate.reason });
        return;
      }
      // THE MULTI-CELL CUT: a DECKLESS room is legal exactly when it is a
      // BOUNDED CHAMBER (the fan×I: every pairing interior, all boundary
      // walls — nothing recurs, and the room still has an inside to stand
      // in). A deckless CLOSED form remains the impossible case the door
      // speaks about rather than opening on nothing.
      const bounded = 'boundary' in gate.geometry && gate.geometry.boundary !== null;
      if (gate.deck.length === 0 && !bounded) {
        setExploreRefusal({ key: selected, reason: 'this room has no glued pair at all — nothing recurs; there is no walk.' });
        return;
      }
      setExploreRefusal(null);
      setExploreOpen(selected);
    };
    if (selected.startsWith('dim3:')) {
      const k = dim3All.findIndex((m) => `dim3:${m.key}` === selected);
      const aperture = k >= 0 ? apertures[k] : undefined;
      if (aperture) judgeGate(aperture.gate);
      return;
    }
    if (selected.startsWith('dim3f:')) {
      const k = foldedBodies.findIndex((b) => `dim3f:${b.key}` === selected);
      const aperture = k >= 0 ? foldedApertures[k] : undefined;
      if (aperture) judgeGate(aperture.gate);
      return;
    }
    // B-104 RUNG 2 — the surface arm's door OPENS: the later-chapter refusal
    // retires here; eligibility is true-predictive (the tiling resolved), so
    // the press toggles the deck-tiling window on THIS selection
    if (exploreEligible === 'surface') {
      setExploreRefusal(null);
      setTilingOpen((cur) => (cur === selected ? null : selected));
      return;
    }
    setExploreRefusal({ key: selected, reason: EXPLORE_SURFACE_LATER });
  }, [selected, exploreOpen, exploreEligible, dim3All, apertures, foldedBodies, foldedApertures]);
  // the opened room, resolved from the live gate — E³/cone (dim3:) and
  // folded (dim3f:) alike; the shader takes the room's OWN cell surface
  // (faces as portals/walls + the seed's rods)
  const exploreRoom = useMemo(() => {
    if (!exploreOpen) return null;
    const resolve = (
      title: string,
      gate: (typeof apertures)[number]['gate'],
      domain: Parameters<typeof readCellSurface>[0],
    ) => {
      if (!gate.ok) return null;
      const g = gate.geometry;
      const boundedRoom = 'boundary' in g && g.boundary !== null;
      if (gate.deck.length === 0 && !boundedRoom) return null;
      // C5 (Part A): a flat room says so — `flat · no cone edges` is an
      // explicit reading, never silence (the E³ case IS the no-cone-edges case)
      // D1 RIDER (engineer 1537, mothership-sharpened): BOTH metric states are
      // POSITIVELY MARKED in the window's own caption — the slots below render
      // whichever state the geometry declares (`g.metricSource`, the fact).
      // ⛔ THE WORDINGS ARE THE DESIGNER'S (caption v2, same surface): the
      // three strings in this table are placeholders wired for her to
      // replace — the mechanism accepts whatever she supplies.
      const METRIC_MARK: Record<'measured' | 'heuristic' | 'unresolved-base', string> = {
        measured: '(measured)',
        heuristic: '(k×90° heuristic)',
        'unresolved-base': 'sealed metric UNRESOLVED',
      };
      const metricSource = 'metricSource' in g ? g.metricSource : null;
      // ⛔ B-114 — ONE PRODUCER FOR THE NOUN. This line used to compose its own
      // `Euclidean cone-manifold …` beside the plate's, and that is exactly how
      // the two came to say different words about the same room. The noun is
      // now `apertureNoun`'s, shared; only the window's own additions (the
      // metric mark, the explicit flat reading) are composed here.
      const seal = gate.seal ?? null;
      const noun = apertureNoun(g, seal);
      const flatTail = g.kind === 'E3' ? ' · flat · no cone edges' : !g.coneEdges ? ' · flat · no cone edges' : '';
      const mark = metricSource ? ` · ${METRIC_MARK[metricSource]}` : '';
      const deckLine =
        g.kind === 'folded'
          ? `orbifold · n=[${g.n.join(',')}] · fold loci: ${g.foldLoci}`
          : metricSource === 'unresolved-base'
            ? `${noun} · ${METRIC_MARK['unresolved-base']}${g.metricRefusal ? ` — ${g.metricRefusal}` : ''}`
            : `${noun}${flatTail}${mark}`;
      // THE NOTE keeps its own line, in the instrument's register (§0). ⛔ The
      // shadow clause fires on a FACT: whether the picture beside it IS the
      // euclidean shadow — which, after this build, a sealed room's is not.
      const noteLines = apertureNote(g, seal, gate.model === null);
      // the heavy flag is the census's own declaration — no cone edges
      // declared ⇒ no heavy rods (never fabricated on a bounded body)
      const coneEdgesDeclared = g.kind !== 'folded' && g.kind !== 'E3' && Boolean(g.coneEdges);
      try {
        // ⛔ the note travels SEPARATELY, not glued to the geometry line: the
        // window appends its own terms (the boundary sentence, the depth) to
        // the geometry line, and a note carried inside it would land those
        // terms on the note's line — the disclaimer swallowing the counts.
        return {
          title,
          cellSurface: readCellSurface(domain, coneEdgesDeclared, gate.model),
          deckLine,
          deckNote: noteLines.length > 0 ? noteLines.join(' · ') : null,
        };
      } catch {
        return null;
      }
    };
    if (exploreOpen.startsWith('dim3:')) {
      const k = dim3All.findIndex((m) => `dim3:${m.key}` === exploreOpen);
      if (k < 0 || !apertures[k]) return null;
      return resolve(dim3All[k].title, apertures[k].gate, dim3All[k]);
    }
    if (exploreOpen.startsWith('dim3f:')) {
      const k = foldedBodies.findIndex((b) => `dim3f:${b.key}` === exploreOpen);
      if (k < 0 || !foldedApertures[k]) return null;
      return resolve(`${foldedBodies[k].title} — folded`, foldedApertures[k].gate, foldedBodies[k]);
    }
    return null;
  }, [exploreOpen, dim3All, apertures, foldedBodies, foldedApertures]);
  const placeableForms = useMemo(() => {
    const out: { id: string; label: string }[] = [];
    written.forEach((w) => out.push({ id: w.form.shape.id, label: w.form.title }));
    world.dim2.forEach((m) => out.push({ id: m.immersion.shape.id, label: m.surface }));
    return out;
  }, [written, world]);

  // (targetFor moved above the aperture panel — D2: the one door reads the
  // pointed-at volume through it, so it must precede the panel block)

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
      // §2b: a STANDING selection no band resolves speaks the ruled sentence
      // — never the pick prompt (a prompt he satisfies to no effect)
      selected !== null && target === null ? UNRESOLVED_SELECTION_REASON : undefined,
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
      // §2b: the menu opens ON a form — a null target here is NEVER "nothing
      // selected"; it is the unresolvable selection, and it says so
      target === null ? UNRESOLVED_SELECTION_REASON : undefined,
    );
  }, [formMenu, targetFor, portFaces]);
  // §3 (B-2026-08-25-A): the identify chip's reason, derived FIRST so the
  // enabled below is reason === null — totality by construction, one branch
  // per conjunct of the old predicate (selected !== null && targetFor(...)
  // !== null). The uncovered conjunct was reachable: `folded:` selections.
  const identifySewReason =
    selected === null
      ? 'select a form first'
      : targetFor(selected) === null
        ? UNRESOLVED_SELECTION_REASON
        : null;

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
            { form: enacted, home: spawnHomeForBirth(target, cur, d.world.chrome.spawnOffset) },
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
        { form: result.born, home: spawnHomeForBirth(target, cur, d.world.chrome.spawnOffset) },
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
        label: faceLabel(target.shape, face, resolveAbsentLabel),
      })),
      picked: portFaces[selected] ?? '',
    };
  }, [selected, combineWith, targetFor, portFaces, resolveAbsentLabel]);

  const handleInvoke = useCallback(
    (catalogueKey: string): void => {
      if (!invokeMenu) return;
      const invoked = invokePrimitive(catalogueKey, seqRef.current);
      // THE CONFORMAL ATOM (2026-07-30) — the manuscript's NON-frozen invoke
      // wrapper: the person's invoked seed OWNS its per-corner angle from
      // combinatorics ((n−2)π/n). R1-FIX2 — THE RENDER LEAK: the ledger stamp
      // alone was INERT for the register — the world layer and the card read
      // form.render.shape, which the frozen router built from the UN-stamped
      // shape before this call site ran. Carry the owned atom into the DRAWN
      // body too (an invoked primitive is always render.mode==='plain');
      // the invariant: render.shape ownership == form.shape ownership.
      const ownedShape = computeSeedCornerAngles(invoked.shape);
      const form = {
        ...invoked,
        shape: ownedShape,
        render:
          invoked.render.mode === 'plain' ? { ...invoked.render, shape: ownedShape } : invoked.render,
      };
      seqRef.current += 1;
      // D.3 — HIS placement: the invoke lands where HE right-clicked
      setWritten((cur) => [...cur, { form, home: [invokeMenu.world[0], invokeMenu.world[1], 0], placedByPerson: true }]);
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
  // §4 (B-2026-08-22-B, the zoo RULED record-not-reading): the ACT lives on
  // the page store (it survives the unmount WITH the forms it explains — the
  // component-held flag dying while the store-held forms lived was a latent
  // duplicate-zoo door); the page FILE records the act and never the
  // contents, and hydration re-runs THIS door (the effect below).
  const zooLoaded = useManuscriptPageStore((s) => s.zooLoaded);
  const recordZooLoaded = useManuscriptPageStore((s) => s.recordZooLoaded);
  const summonZooForms = useCallback((): boolean => {
    // the authoritative guard reads the STORE fresh (not a render closure):
    // zustand's set is synchronous, so a re-entrant call sees the forms
    if (useManuscriptPageStore.getState().written.some((w) => w.zooMember)) return true;
    const additions: Array<{ form: WrittenForm; home: [number, number, number]; zooMember: true }> = [];
    for (let k = 0; k < WORLD_SURFACES.length; k += 1) {
      const surface = WORLD_SURFACES[k];
      const slotX = centered(k, WORLD_SURFACES.length, layoutCtl.spacing * scaleCtl.dim2Scale * 1.2);
      const invokedHost = invokePrimitive('square', seqRef.current);
      // R1-FIX — WIRE THE INVOKE ATOM; R1-FIX2 — carry it into the DRAWN body
      // (render.shape), the object the register actually reads. The zoo host
      // square wears its rim turns on the page and feeds the births owned.
      const ownedHostShape = computeSeedCornerAngles(invokedHost.shape);
      const host = {
        ...invokedHost,
        shape: ownedHostShape,
        render:
          invokedHost.render.mode === 'plain'
            ? { ...invokedHost.render, shape: ownedHostShape }
            : invokedHost.render,
      };
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
        return false;
      }
      seqRef.current += 1;
      additions.push({ form: host, home: [slotX, rows.dim2Y - 3.1, 0], zooMember: true });
      additions.push({ form: born.born, home: [slotX, rows.dim2Y, 0], zooMember: true });
    }
    setWritten((cur) => [...cur, ...additions]);
    setOpNotice(null);
    return true;
  }, [layoutCtl.spacing, layoutCtl.resolution, scaleCtl.dim2Scale, rows.dim2Y]);
  const handleSummonZoo = useCallback((): void => {
    if (zooLoaded) return;
    if (summonZooForms()) recordZooLoaded();
  }, [zooLoaded, summonZooForms, recordZooLoaded]);
  // §4 hydration: the act restored with no zoo on the page ⇒ the SAME
  // committed door re-runs (the file carried the record, never the reading)
  useEffect(() => {
    if (zooLoaded && !written.some((w) => w.zooMember)) summonZooForms();
  }, [zooLoaded, written, summonZooForms]);

  // ----- 3b: the genesis reading — ONE committed DAG feeds pentimento + -----
  // ----- stemma + the foot-record (nothing hand-kept) ------------------------
  // ═══ P5 · clause 20 — THE RECORD RATCHETS; THE LIVE PAGE DOES NOT ═════════
  // ⛔ FOUND BY DRIVING, and it was ERASURE: the record is built from the
  // page's population, so removing a LEAF form (one nothing else was begotten
  // from) dropped its own birth line — `Square —glue→ Torus` simply left the
  // record. A PARENT survived by luck, because the child carries its parent's
  // Shape; a leaf had nobody to carry it.
  // ⇒ THE POPULATION IS EVERY FORM THE PAGE HAS EVER HELD: the live entries
  // PLUS every act's own carried entry. That is the ratchet said in the one
  // place it has to be true — the live page loses the form, the record does
  // not lose the sentence.
  const genesisPopulation = useMemo(() => {
    const population = [...written];
    const seen = new Set(written.map((w) => w.form.shape.id));
    for (const act of acts) {
      if (!act.entry || seen.has(act.entry.form.shape.id)) continue;
      seen.add(act.entry.form.shape.id);
      population.push(act.entry);
    }
    return population;
  }, [written, acts]);
  const genesis = useMemo(() => readGenesis(genesisStoryShapes(genesisPopulation)), [genesisPopulation]);
  const pentimentoShapeIds = genesis?.pentimentoIds ?? new Set<string>();
  const nameOfShapeId = useMemo(() => {
    const names = new Map<string, string>();
    world.dim1.forEach((m) => names.set(m.shape.id, m.title));
    world.dim2.forEach((m) => names.set(m.immersion.shape.id, DIM2_TITLES[m.surface]));
    dim3All.forEach((m) => names.set(m.shape.id, m.title));
    // ═══ P5 · clause 19 — NO FORCED CASCADE, AND THE RECORD KEEPS ITS SUBJECT.
    // ⛔ Measured, not assumed: `genesisStoryShapes` collects each child's own
    // carried `parentShape`, so a removed parent STAYS in the DAG and its
    // record line keeps standing — but the NAME map read only `written`, so
    // the line would have degraded to a raw shape id. That is the *dangling
    // name* the M3 seal forbids, arriving through the back door.
    // ⇒ A removed form goes on naming itself — PLAINLY.
    //
    // ═══ MARKER A1 — ARMAN, VERBATIM: *"no remove and undo does not need be
    // recorded as geneology"*. ⇒ REMOVAL AND UNDO ARE NOT GENEALOGY, and the
    // `(removed)` marker this line used to append is GONE.
    // ★ His ruling is the designer's own §2 argument carried one layer past
    // where she carried it: *removal consumes nothing and makes nothing — it
    // acts on the PAGE*, which is why it is off the affordance line and out of
    // the OPERATIONS menu. THE GENEALOGY IS THE RECORD OF WHAT OPERATIONS
    // MADE, and removal made nothing.
    // ⛔⛔ AND THE BOUNDARY, WHICH POINTS THE OTHER WAY AND IS EASY TO
    // CONFLATE: the birth line itself must NOT disappear. `Square —glue→
    // Torus` HAPPENED and the record ratchets. He ruled against removal being
    // ADDED to the genealogy — not against a genealogy line PERSISTING. So
    // the name stays (plain), and the leaf cure below stays entire; if this
    // cut ever makes a birth line vanish again, that is the boundary crossed.
    removals.forEach((m) => names.set(m.shapeId, m.name));
    written.forEach((w) => names.set(w.form.shape.id, w.form.title));
    // ═══ B-127 — THE MAP CLOSES OVER THE DAG'S OWN POPULATION, BY
    // CONSTRUCTION. The record's resolver used to end in `?? id` — a shape
    // ID in the record sentence's name position, the name-slot law's
    // forbidden class (address ≠ name). The cure is structural, not a better
    // fallback: the map is now built over THE SAME ratchet population the
    // DAG itself is built from, so every id the DAG can hold has a rung —
    // the acts' carried entries keep their COPIED titles (ADR 0027 §6, the
    // record's copied designation, never a live lookup), and a carried
    // parent that never had a page entry falls to its shape's own DERIVED
    // name (register 2). Every rung DERIVED; no token; no miss left.
    genesisPopulation.forEach((entry) => {
      if (!names.has(entry.form.shape.id)) names.set(entry.form.shape.id, entry.form.title);
    });
    genesisStoryShapes(genesisPopulation).forEach((shape) => {
      if (!names.has(shape.id)) names.set(shape.id, shape.name);
    });
    return names;
  }, [world, written, dim3All, removals, genesisPopulation]);
  const recordEntries = useMemo(
    // `?? ''` is the ADMITTED-ABSENCE terminal (a fallback may end in an
    // absence, never in a token) — structurally unreachable: the map above
    // is total over the DAG's population because both read the same input.
    () => (genesis ? footRecord(genesis, (id) => nameOfShapeId.get(id) ?? '') : []),
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
  // the stemma: the committed reduced edges whose endpoints are on the page.
  // B-120: the edge carries its OPERATION through the map — the one field the
  // foot record already prints (`footRecord` reads `edges[0].operation`), so
  // the strip's word and the page's word have one producer. The endpoints
  // ride too, for the attention rule below.
  const stemmaLines = useMemo(() => {
    if (!genesis) return [];
    return genesis.reducedEdges
      .map((edge) => {
        const from = homeOfShapeId.get(edge.parent);
        const to = homeOfShapeId.get(edge.child);
        return from && to
          ? { key: `${edge.parent}->${edge.child}`, parent: edge.parent, child: edge.child, operation: edge.operation, from, to }
          : null;
      })
      .filter(
        (
          line,
        ): line is {
          key: string;
          parent: string;
          child: string;
          operation: OperationKind;
          from: [number, number, number];
          to: [number, number, number];
        } => Boolean(line),
      );
  }, [genesis, homeOfShapeId]);
  // B-120 E.6 — THE LABEL ARRIVES ON ATTENTION, and both attentions already
  // exist: the edge's own hover (the 24px pick stroke at the render — R8's
  // mechanism) or the page's existing selection of either endpoint form. No
  // new gesture. The hovered edge goes FIRST into the E.5 yield so direct
  // pointer attention never loses its verb to a selection's crowd.
  const [stemmaHover, setStemmaHover] = useState<string | null>(null);
  const stemmaLabelKeys = useMemo(() => {
    const selectedShapeId = apertureTarget?.shape.id ?? null;
    const attended = stemmaLines.filter(
      (line) =>
        line.key === stemmaHover ||
        (selectedShapeId !== null && (line.parent === selectedShapeId || line.child === selectedShapeId)),
    );
    const ordered = [
      ...attended.filter((line) => line.key === stemmaHover),
      ...attended.filter((line) => line.key !== stemmaHover),
    ];
    return visibleStemmaLabels(
      ordered.map((line) => ({ key: line.key, word: line.operation, mid: stemmaMidpoint(line.from, line.to) })),
    );
  }, [stemmaLines, stemmaHover, apertureTarget]);

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
      } catch (error) {
        // B-106 B2 — the catch NAMES what it caught (the eaten-alarm cure;
        // R-5's kill: "the alarm speaks or the catch names what it caught").
        // The pass-through itself is CORRECT — refineToDisk is not total and
        // the committed single-face refusal downstream still speaks to the
        // person — but this catch also received surfaceRefinement's internal-
        // consistency alarms (the recovered-boundary mismatch class) and ate
        // them wordless: the silent-chip class, third register. The message
        // is carried verbatim; refineToDisk's own sentences say which class
        // fired.
        console.warn(
          `combine gate: refineToDisk refused "${t.shape.name}" — the target enters the birth UNREFINED and the committed single-face wall stands`,
          error,
        );
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
      const { name: bandName, shapeId, metricBaseId } = useGeometryStore
        .getState()
        .thickenManuscript(thickenGate.shape.shape, thickenGate.segment.shape);
      setThickenOpen(false);
      // D9 (Sovereign Δ12, via mothership 1615/1630: "no un-asked-for room at
      // all"): the multi-cell auto-build is DELETED — the cells.length split
      // is gone with it (there was never a second concept). EVERY thicken
      // product rides the shelf and the person POINTS AT it to open the one
      // door; no room exists until they answer. D8: the product-record base
      // is carried at the mint, keyed by the product's shape id, so the door
      // can resolve it on the placed form.
      if (metricBaseId) productMetricBasesRef.current.set(shapeId, metricBaseId);
      // ⛔ COPY PENDING THE DESIGNER (flagged): the notice that points the
      // person at the shelf form is hers to word.
      setOpNotice(`thicken: "${bandName}" rides the shelf — point at it to build a room on its faces`);
    } catch (error) {
      // the committed doors speak for themselves (the 4-manifold stop, the Q1
      // guard) — the sentence is the thrown reason, never re-worded here
      // R7 (B-2026-08-24-B §4): the door's own message already carries the
      // `thicken:` prefix — prepending unconditionally doubled the word
      const msg = error instanceof Error ? error.message : String(error);
      setOpNotice(msg.startsWith('thicken:') ? msg : `thicken: ${msg}`);
    }
  }, [thickenGate]);

  // ----- H2 THE PERSON'S HANDS: the fold + the aimed chord ------------------
  // the fold's dock chip state — the committed form-level gate's own sentence
  const foldTarget = useMemo(() => targetFor(selected), [targetFor, selected]);
  const foldReason = useMemo(
    // §2b: a null target is nothing-selected OR a selection no band resolves
    // — the second speaks the ruled sentence (the chip's no-target line is
    // the chrome's, but this value must be TRUE wherever it is read)
    () =>
      foldTarget
        ? foldGateReason(foldTarget.shape)
        : selected !== null
          ? UNRESOLVED_SELECTION_REASON
          : 'Select a form first.',
    [foldTarget, selected],
  );
  // B-103 §2a — THE AFFORDANCE LINE, computed from the LIVE enabled set the
  // dock itself renders from (the availability rows + the gesture chips' own
  // predicates — one fact, one producer; never a literal). B-105 W3 §4(b):
  // the empty open set now composes HER ruled zero-total sentence (`this
  // form takes — nothing · each door says why`) — null here means only
  // no-selection / no-resolved-target, never an empty total.
  const affordanceLine = useMemo(
    () =>
      selected !== null && targetFor(selected) !== null
        ? composeAffordanceLine(availability, {
            fold: foldReason === null,
            thicken: thickenReason === null,
            identify: identifySewReason === null,
            explore: exploreEligible !== null,
          })
        : null,
    [selected, targetFor, availability, foldReason, thickenReason, identifySewReason, exploreEligible],
  );
  // B-103 §2c — the designer's bound, ADJACENT to the affordance line on
  // CLOSED VOLUMES (the predicate measured from the substrate: a 3-cell +
  // a closed 2-boundary — the octahedron class whose holder reaches for a
  // one-gesture quotient).
  const quotientBound = useMemo(() => {
    if (affordanceLine === null || selected === null) return null;
    const target = targetFor(selected);
    return target !== null && isClosedVolume(target.shape) ? QUOTIENT_BOUND_SENTENCE : null;
  }, [affordanceLine, selected, targetFor]);
  // B-105 ADR §7 — THE DEMOTED RECORD (the card's business): {p,q}, the
  // vertex count, and the descent check move here from the window. Rows in
  // the record grammar; present exactly when the tiling resolves; the
  // descent row exactly when the check passed on this tiling's own cells.
  const deckRecord = useMemo(() => {
    if (!deckTilingFor || deckTilingFor.ok !== true) return null;
    const t = deckTilingFor.tiling;
    const rows: { label: string; value: string }[] = [
      { label: 'deck-tiling', value: `{${t.p},${t.q}}` },
      { label: 'cells at a vertex', value: `${t.q}` },
    ];
    if (t.descent) {
      rows.push({
        label: 'descent',
        value: `−I ∈ Sym ∧ free — ${t.descent.pairs.length} cell pair${t.descent.pairs.length === 1 ? '' : 's'}`,
      });
    }
    return rows;
  }, [deckTilingFor]);
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
  // B-105 W3 §1 — the ONE tap reducer, fired from the FIGURE's edge targets
  // (the panel lists no edges any more; the pick surface is the drawing)
  const handleFoldTap = useCallback((edgeIndex: number): void => {
    setFold((cur) => (cur ? { ...cur, ...tapFoldEdge({ pairs: cur.pairs, pending: cur.pending }, edgeIndex) } : cur));
  }, []);
  // ----- CYCLE-IDENTIFY (L23): the trace gesture ---------------------------
  // the entry gate — D2 fires AT ENTRY, before the person traces anything
  // (never let them do the work and then discard it); the quotient wall is
  // pre-empted structurally for the same reason. B-105 W3 §4(c) (designer-
  // ruled): the pointer clause ("the dock words are its doors") is CUT — a
  // reroute must be COMPUTED FROM THE FORM IN HAND, never a constant list,
  // and the computed affordance line now answers that question; a card that
  // answers it twice teaches him neither answer is authoritative. The
  // sentence keeps only what it says about the ACT itself.
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
            'this single-face quotient identifies through the committed word ops (glue / flip-glue on the face)';
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
  // G4 — THE COMPUTED PREVIEW (SEAL_THE_IDENTIFY_GESTURE): the surface each
  // traced-so-far pair will make, read by CALLING the frozen
  // `modesFromDirectedCycles` (⛔ reused, never reimplemented — the researcher
  // confirmed screen-way ≠ canonical dir, so NO raw-visible causal story is
  // sound; the only honest preview is the computation's own answer).
  // Person-language on the page: preserving → BAND · reversing → TWIST.
  // G5 rides per pair: flipping EITHER edge's tail toggles that pair's mode
  // (mode = same-or-different of the two canonical-relative senses), so the
  // counterfactual is always exactly the other word.
  const cyclePreview = useMemo(() => {
    if (!cycleTrace || !traceComplex || cycleTrace.entryRefusal) return null;
    const n = Math.min(cycleTrace.walkA.length, cycleTrace.walkB.length);
    if (n === 0) return null;
    const A = cycleTrace.walkA.slice(0, n);
    const B = cycleTrace.walkB.slice(0, n);
    let modes: IdentifyMode[];
    try {
      modes = modesFromDirectedCycles(
        traceComplex.target.shape,
        traceComplex.complex,
        A.map((t) => t.id),
        B.map((t) => t.id),
        A.map((t) => t.dir),
        B.map((t) => t.dir),
      );
    } catch {
      // an engine wall mid-trace (the panel's own notices carry those) —
      // no preview is honest until the walls clear
      return null;
    }
    const word = (m: IdentifyMode): 'band' | 'twist' => (m === 'preserving' ? 'band' : 'twist');
    const bands = modes.filter((m) => m === 'preserving').length;
    const twists = modes.length - bands;
    const summary =
      twists === 0
        ? modes.length === 1
          ? 'a band'
          : `a band word (${bands} band)`
        : bands === 0
          ? modes.length === 1
            ? 'a twist'
            : `a twist word (${twists} twist)`
          : `a mixed word (${bands} band · ${twists} twist)`;
    // G6 — the commit STATES its result
    const commitLabel =
      twists === 0
        ? 'confirm — sew into a band'
        : bands === 0
          ? 'confirm — sew into a twist'
          : `confirm — sew into a mixed word (${bands} band · ${twists} twist)`;
    return {
      pairs: modes.map((m, k) => ({ aId: A[k].id, bId: B[k].id, word: word(m), other: word(m) === 'band' ? 'twist' : 'band' })),
      summary,
      commitLabel,
    };
  }, [cycleTrace, traceComplex]);
  // a pick — D3's walls fire LIVE (the engine's own sentences, at the
  // moment of the pick, never sprung at the end).
  // THE REFINED GESTURE (SEAL_THE_IDENTIFY_GESTURE):
  //   G1 — the tail is the VERTEX the person picked ('u' | 'v'); the dir
  //        derives from THAT (⛔ never from click proximity);
  //   G3 — a tap on an ALREADY-TRACED edge (any target, or its body) moves
  //        the tail to the other end — a TRACE change by the same gesture,
  //        in whichever walk holds the edge;
  //   a body-tap (tail null) on an UNTRACED edge asks for a vertex.
  const handleCyclePick = useCallback((edgeId: string, tail: 'u' | 'v' | null): void => {
    setCycleTrace((cur) => {
      if (!cur || cur.entryRefusal) return cur;
      const flip = (walk: Array<{ id: string; dir: 1 | -1 }>) =>
        walk.map((t) => (t.id === edgeId ? { ...t, dir: (t.dir * -1) as 1 | -1 } : t));
      if (cur.walkA.some((t) => t.id === edgeId)) return { ...cur, walkA: flip(cur.walkA), notice: null };
      if (cur.walkB.some((t) => t.id === edgeId)) return { ...cur, walkB: flip(cur.walkB), notice: null };
      if (tail === null) {
        return { ...cur, notice: 'tap the corner you start this edge from — the tail is the vertex you pick' };
      }
      const dir: 1 | -1 = tail === 'u' ? 1 : -1;
      if (cur.phase === 'A') {
        return { ...cur, walkA: [...cur.walkA, { id: edgeId, dir }], notice: null };
      }
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
        { form, home: spawnHomeForBirth(target, cur, d.world.chrome.spawnOffset) },
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
      { form: result.born, home: spawnHomeForBirth(target, cur, d.world.chrome.spawnOffset) },
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
  // GAP2C — the carried ancestor chains of shelf-loaded forms (acquire-
  // metadata for the ops/classifier lineage) live in the page store (§2A);
  // this drain RECORDS them, with the parcel FILE itself — the load door's
  // input, which is what the page file serializes (§2B).
  useEffect(() => {
    for (const item of liftQueue) {
      if (ingestedLiftKeys.current.has(item.key)) continue;
      ingestedLiftKeys.current.add(item.key);
      try {
        const entry = loadUniverseSnapshot(item.file);
        recordShelfFile(item.file);
        if (entry.loaded.ancestors?.length) {
          recordShelfAncestors(entry.loaded.shape.id, entry.loaded.ancestors);
        }
        setShelf((cur) => [...cur, { entry, placed: false }]);
        // D9 finding (2026-08-15, disclosed): this drain used to clear the op
        // notice on every successful ingest — which ERASED the thicken
        // door-open notice in the same breath that pushed the band parcel
        // (the person was "asked" for one frame). The drain now leaves the
        // standing notice alone; its own failures below still speak.
      } catch (error) {
        setOpNotice(`lift: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }, [liftQueue, recordShelfFile, recordShelfAncestors, setShelf]);

  // ----- 3b: the sources shelf (committed snapshot loads + drag-to-place) ----
  const handleLoadFiles = useCallback((files: FileList): void => {
    for (const file of Array.from(files)) {
      file
        .text()
        .then((text) => {
          const parsed = JSON.parse(text);
          const entry = loadUniverseSnapshot(parsed);
          recordShelfFile(parsed);
          if (entry.loaded.ancestors?.length) {
            recordShelfAncestors(entry.loaded.shape.id, entry.loaded.ancestors);
          }
          setShelf((cur) => [...cur, { entry, placed: false }]);
          setOpNotice(null);
        })
        .catch((error: unknown) => {
          setOpNotice(`load: ${error instanceof Error ? error.message : String(error)}`);
        });
    }
  }, [recordShelfFile, recordShelfAncestors, setShelf]);
  // §2B — THE PAGE DOORS. Save: the RECORD layer, serialized to an explicit
  // versioned file the person keeps. Load: parse → refuse-by-name on any
  // version mismatch → hydrate the store through the SAME committed doors —
  // and the restored page comes back QUIET (no selection, no open panels, no
  // notices restored; per-record refusals are NAMED, never silent).
  const handleSavePage = useCallback(() => {
    const file = serializePage(useManuscriptPageStore.getState().pageRecords());
    const blob = new Blob([JSON.stringify(file)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `manuscript-${new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')}.page.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    // §7: the page is written down as of this act — the standing mark quiets.
    // (The download lands without a further dialog in the default browser
    // setup; a browser configured to ask-and-cancel can out-date the mark —
    // disclosed, the mark re-arms on the next record change.)
    useManuscriptPageStore.getState().markPageSaved();
  }, []);
  const handleLoadPage = useCallback(
    (files: FileList): void => {
      const file = files[0];
      if (!file) return;
      file
        .text()
        .then((text) => {
          const records = parsePage(JSON.parse(text));
          const refusals = useManuscriptPageStore.getState().loadPage(records);
          // the QUIET restore — session gestures are not part of the page
          setSelected(null);
          setApertureOpen(false);
          setApertureNotice(null);
          setInvokeMenu(null);
          setFormMenu(null);
          setExploreOpen(null);
          // §5 (B-2026-08-22-B): the restored page must be SEEN — a load
          // landing during the mount's camera intro left the first frame
          // bare paper, which reads as "it did not work" (a positive fact
          // carried by nothing being there). The same committed act as the
          // person's own Reset Camera frames the page the moment it lands.
          setResetCameraRequest((n) => n + 1);
          setOpNotice(
            refusals.length > 0
              ? `page restored — ${refusals.length} record(s) refused by name: ${refusals[0]}`
              : null,
          );
        })
        .catch((error: unknown) => {
          setOpNotice(`page: ${error instanceof Error ? error.message : String(error)}`);
        });
    },
    [setSelected],
  );
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
      // D.3 — HIS placement: the shelf form lands where HE dropped it
      setWritten((cur) => [...cur, { form, home: [x, y, 0], placedByPerson: true }]);
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
    // S2 — the KEY stays the ADDRESS (grouping unchanged); the DESIGNATION a
    // person reads rides beside it, the first one any entry carries (null on
    // old files — the heading then falls back to the address)
    return [...bySource.entries()].map(([source, entries]) => ({
      source,
      sourceName: entries.find((e) => e.entry.sourceName !== null)?.entry.sourceName ?? null,
      entries,
    }));
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

  // ═══ D1 · THE DRAG — the person's hand on `home` ═══════════════════════════
  // ★ Her grounding, and it is why this is not a new capability: the page
  // already COMPUTES a per-form position, DRAWS the stemma from it, and SAVES
  // it. *The hand exists; it just cannot reach a form that has landed.*
  // ⛔ D.2 — MOVING IS NOT GENEALOGY (Arman's own rule: the genealogy records
  // what operations MADE, and moving makes nothing) and ⛔ D.7 — A MOVE IS NOT
  // AN ACT for the undo chain (the researcher: *arrangement ≠ content; undo
  // skips it*). So NOTHING here touches `acts` or the DAG. Her risk, foreclosed
  // by his ruling: *an undo chain crowded with arrangement cannot reach the
  // acts that matter.*
  // ⛔ AND THE IDIOM IS THE IMMUTABLE REPLACE, which is a MEANING decision and
  // not a style one: *A MEMORIAL'S CONTENT IS ITS POSITION. It says a form was
  // HERE. A memorial that can be moved is a lie about where the form was.* ⇒
  // the memorial must NOT follow the form, so `home` is REPLACED, never
  // mutated in place — and B-119 §3's snapshot is what makes that safe.
  const dragRef = useRef<{ id: string; grab: [number, number]; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  // ⛔ FOUND BY DRIVING: the form moved AND THE CAMERA ORBITED WITH IT. Flipping
  // the controls' `enabled` PROP is a React render behind the gesture — the
  // orbit's own pointerdown listener and the mesh's fire from the SAME native
  // event, so by the time the prop lands the rotate has already begun.
  // ⇒ THE CONTROLS ARE STOPPED SYNCHRONOUSLY, in the pointerdown itself. The
  // prop still carries `!dragging` for the steady state; this ref is what
  // covers the one frame the prop cannot. (`makeDefault` publishes the
  // controls to the R3F store, so this is the committed handle, not a reach
  // into drei's internals.)
  const orbitRef = useRef<{ enabled: boolean } | null>(null);
  /** the page's own plane, z = 0 — where every `home` lives. The ray, not the
   * hit: intersecting the FORM would feed its own motion back into the grab. */
  const planeHit = (ray: THREE.Ray): [number, number] | null => {
    if (Math.abs(ray.direction.z) < 1e-6) return null;
    const t = -ray.origin.z / ray.direction.z;
    if (!(t > 0)) return null;
    return [ray.origin.x + ray.direction.x * t, ray.origin.y + ray.direction.y * t];
  };
  /** ⛔ D.5 — HE MUST NOT BE ABLE TO PUT A FORM WHERE HE CANNOT FIND IT.
   * ★ The card's-foot law, now in his hands: *a placement satisfied by order
   * alone can place a thing off-screen.* The bound is not a made-up rectangle
   * — it is WHAT THE CAMERA CAN SEE at z = 0, computed from the camera itself,
   * so the clause's own words ("where he cannot find it") are the mechanism.
   * ⚠ A degenerate view (the camera looking along the page's own plane) yields
   * no rect; then the drop stands as-is — the pointer is on screen by
   * construction, so the form is somewhere he is already looking. */
  const visibleAtPage = (camera: THREE.Camera): { minX: number; maxX: number; minY: number; maxY: number } | null => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (const [nx, ny] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as [number, number][]) {
      const far = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
      const dir = far.sub(camera.position).normalize();
      if (Math.abs(dir.z) < 1e-6) return null;
      const t = -camera.position.z / dir.z;
      if (!(t > 0)) return null;
      const x = camera.position.x + dir.x * t;
      const y = camera.position.y + dir.y * t;
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
    if (!Number.isFinite(minX) || !Number.isFinite(minY)) return null;
    const insetX = (maxX - minX) * 0.04;
    const insetY = (maxY - minY) * 0.04;
    return { minX: minX + insetX, maxX: maxX - insetX, minY: minY + insetY, maxY: maxY - insetY };
  };

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
      name={`written:${id}`}
    >
      <Drift
        index={driftIndex}
        enabled={driftCtl.enabled && selected !== id}
        amplitude={driftCtl.amplitude}
        speed={driftCtl.speed}
      >
        <group
          // ═══ D.1 — THE GESTURE IS A DRAG ON THE FORM ════════════════════════
          // ⛔ NO NEW VOCABULARY: dragging already places forms from SOURCES
          // onto the paper; this is the same hand reaching a form that landed.
          // ⚠ Only a WRITTEN form drags — the world's dim-1/dim-2 rows and the
          // built rooms have no `home` of his to move, so they never grab.
          onPointerDown={(event) => {
            if (event.nativeEvent.button !== 0) return;
            const entry = written.find((w) => `w:${w.form.id}` === id);
            if (!entry) return;
            const at = planeHit(event.ray);
            if (!at) return;
            event.stopPropagation();
            (event.target as Element | null)?.setPointerCapture?.(event.nativeEvent.pointerId);
            if (orbitRef.current) orbitRef.current.enabled = false; // SYNCHRONOUS — see orbitRef
            dragRef.current = { id, grab: [at[0] - entry.home[0], at[1] - entry.home[1]], moved: false };
            setDragging(true);
          }}
          onPointerMove={(event) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== id) return;
            const at = planeHit(event.ray);
            if (!at) return;
            event.stopPropagation();
            drag.moved = true;
            const bounds = visibleAtPage(event.camera);
            const raw: [number, number] = [at[0] - drag.grab[0], at[1] - drag.grab[1]];
            const home: [number, number, number] = bounds
              ? [Math.min(bounds.maxX, Math.max(bounds.minX, raw[0])), Math.min(bounds.maxY, Math.max(bounds.minY, raw[1])), 0]
              : [raw[0], raw[1], 0];
            // ⛔ REPLACE, never mutate: `{ ...w, home: [...] }` is the idiom the
            // memorial's ruling requires — the mark keeps its own site.
            // ⛔ AND `placedByPerson` is set HERE, on the act that makes it true.
            setWritten((cur) =>
              cur.map((w) => (`w:${w.form.id}` === id ? { ...w, home, placedByPerson: true as const } : w)),
            );
          }}
          onPointerUp={(event) => {
            const drag = dragRef.current;
            if (!drag || drag.id !== id) return;
            event.stopPropagation();
            (event.target as Element | null)?.releasePointerCapture?.(event.nativeEvent.pointerId);
            dragRef.current = null;
            if (orbitRef.current) orbitRef.current.enabled = true;
            setDragging(false);
          }}
          onClick={(event) => {
            event.stopPropagation();
            // ARMAN'S LAW (2026-08-07, direct word): summon is a DOUBLE-CLICK.
            // A single click on a shape is INERT for selection — no flight,
            // no sink, no reset animation on a stray tap. Shift-click keeps
            // the combine arming (a deliberate chord, unchanged).
            if (event.nativeEvent.shiftKey) {
              pick(id, true);
              return;
            }
            if (event.nativeEvent.detail >= 2) pick(id, false);
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
        />
      </Drift>
    </SpecimenLift>
  );

  // D13 WITNESS SEAM (dev-only, see d13Throw above): the page-scope planted
  // throw — it fires in THIS component's own render body, after every hook,
  // which is exactly the class no tight child boundary can catch; only
  // AppShell's last-resort boundary speaks for it.
  if (d13Throw === 'page') {
    throw new Error('d13 planted render throw — page scope (dev seam)');
  }

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
        onCreated={(state) => {
          // THE APP-PATH WITNESS LEG's scene handle (a TEST SEAM, dev-view
          // only — `?manuscript` is dev-gated): the leg asserts PRESENCE by
          // traversing the real scene graph; no render behavior changes.
          // PHASE A adds the camera handle (the leg PROJECTS the selected
          // specimen's bounds to judge the plate) + the view's own scene ref
          // (C1 measures the drawn bounds by name).
          (window as unknown as { __manuscriptScene?: unknown }).__manuscriptScene = state.scene;
          (window as unknown as { __manuscriptCamera?: unknown }).__manuscriptCamera = state.camera;
          sceneRef.current = state.scene;
        }}
        onPointerMissed={(event) => {
          // CYCLE-IDENTIFY reach fix (b): a miss mid-trace does NOT discard
          // the accumulated walk (the 6-edge-trace-cleared-by-one-miss scar)
          if (cycleTraceRef.current) return;
          // D2-GROUND RESIDUAL (SEAL_D2_GROUND_HATCH_PARITY): an orbit-DRAG
          // turns the subject, NEVER deselects — only a true empty-paper
          // CLICK (the pointer barely moved since down) does. R3F can fire
          // this for the pointerdown too (measured on the leg: the down's
          // own Δ=0 deselected before the drag moved) — only the click-type
          // event is judged, and its coords are the RELEASE point.
          if (event.type !== 'click') return;
          const down = pointerDownScreenRef.current;
          if (down && Math.abs(event.clientX - down.x) + Math.abs(event.clientY - down.y) > 6) return;
          // ARMAN'S LAW: dismiss is a DOUBLE-CLICK on empty paper — a single
          // stray click around the shape never sinks it
          if (event.detail < 2) return;
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
            // D2-GROUND RESIDUAL (SEAL_D2_GROUND_HATCH_PARITY): an orbit-DRAG
            // released over the paper raycasts THIS backdrop (an object click,
            // not a canvas miss — measured); the same drag/click discriminator
            // applies — only a true click acts here
            const down = pointerDownScreenRef.current;
            if (down && Math.abs(event.clientX - down.x) + Math.abs(event.clientY - down.y) > 6) return;
            closeMenus();
            // ARMAN'S LAW: dismiss is a DOUBLE-CLICK — a single paper click
            // only closes menus, never sinks the specimen
            if (event.nativeEvent.detail < 2) return;
            setSelected(null);
            setCombineWith(null);
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
            parent→child on the sheet (ink, not gold; the real edge, no decor).
            B-120 E.1–E.7: the LINE IS THE ARROW (head at the child end, the
            line's own ink) and the edge's operation word arrives at the
            midpoint on attention. E.5 BY CONSTRUCTION: nothing below the
            label gate reads the label plan — the ink line, the head, and the
            pick stroke render unconditionally, so a yielding label has no
            channel through which to take an edge with it. */}
        {stemmaLines.map((line) => {
          const arrow = stemmaArrowhead(line.from, line.to);
          const mid = stemmaMidpoint(line.from, line.to);
          return (
            <group key={line.key}>
              <Line
                points={[
                  [line.from[0], line.from[1], -1.5],
                  [line.to[0], line.to[1], -1.5],
                ]}
                color={silhouetteCtl.color}
                lineWidth={genesisCtl.stemmaWidth}
                transparent
                opacity={genesisCtl.stemmaOpacity}
              />
              {/* E.3 — the arrowhead is part of the LINE's ink: direction
                  lives here, once; the label never repeats it */}
              {arrow ? (
                <mesh position={[arrow.tip[0], arrow.tip[1], -1.5]} rotation={[0, 0, arrow.angleRad]}>
                  <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[STEMMA_ARROW_VERTICES, 3]} />
                  </bufferGeometry>
                  <meshBasicMaterial
                    color={silhouetteCtl.color}
                    transparent
                    opacity={genesisCtl.stemmaOpacity}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              ) : null}
              {/* E.7 — R8 ported (InkedSkeleton §8): an INVISIBLE ≥24px
                  stroke over the same segment widens the raycast target
                  while the ink stays hairline — a hairline target and a
                  broken door produce the same observation. */}
              <Line
                points={[
                  [line.from[0], line.from[1], -1.5],
                  [line.to[0], line.to[1], -1.5],
                ]}
                color={silhouetteCtl.color}
                lineWidth={STEMMA_PICK_WIDTH_PX}
                transparent
                opacity={0}
                depthWrite={false}
                onPointerOver={() => {
                  // NO first-claim guard — and that is a MEASURED decision,
                  // not an omission (B-120 drive): a nearest-hit guard here
                  // can essentially never pass, because every form's native
                  // LineSegments raycasts with three's default
                  // `params.Line.threshold` (1 WORLD UNIT), an invisible
                  // ~±21px halo that owns intersections[0] across the first
                  // world-unit-plus of every edge near every form. A guard
                  // honouring that halo honours a raycast default, not the
                  // person's sense of "on the form" — it made the verb
                  // unreachable exactly where edges meet their endpoints.
                  setStemmaHover(line.key);
                }}
                onPointerOut={() => {
                  setStemmaHover((cur) => (cur === line.key ? null : cur));
                }}
              />
              {stemmaLabelKeys.has(line.key) ? (
                <StemmaOpLabel position={[mid[0], mid[1], -1.5]} word={line.operation} ink={silhouetteCtl.color} />
              ) : null}
            </group>
          );
        })}

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
                // §8 (RULED): ≥24px hit region on the stroke, ink unchanged;
                // withheld while selected so the correspondence pick layer
                // keeps first claim on the corners
                pickWidth={selected === `dim1:${model.key}` ? undefined : 24}
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
              title: DIM2_TITLES[model.surface],
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
                  strokePitch: inkCtl.strokePitch,
                  strokeDuty: inkCtl.strokeDuty,
                  strokeFloor: inkCtl.strokeFloor,
                  crossOnset: inkCtl.crossOnset,
                  grazingGain: inkCtl.grazingGain,
                  grazingFalloff: inkCtl.grazingFalloff,
                  chiralityAngleDeg: inkCtl.chiralityAngleDeg,
                  nibDepthScale: inkCtl.nibDepthScale,
                  nibNear: inkCtl.nibNear,
                  darkSolid: inkCtl.darkSolid,
                  creaseThreshold: inkCtl.creaseThreshold,
                  depthBreakThreshold: inkCtl.depthBreakThreshold,
                }}
              />
              {summoned && !apertureOpen ? (
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
                  strokePitch: inkCtl.strokePitch,
                  strokeDuty: inkCtl.strokeDuty,
                  strokeFloor: inkCtl.strokeFloor,
                  crossOnset: inkCtl.crossOnset,
                  grazingGain: inkCtl.grazingGain,
                  grazingFalloff: inkCtl.grazingFalloff,
                  chiralityAngleDeg: inkCtl.chiralityAngleDeg,
                  nibDepthScale: inkCtl.nibDepthScale,
                  nibNear: inkCtl.nibNear,
                  darkSolid: inkCtl.darkSolid,
                  creaseThreshold: inkCtl.creaseThreshold,
                  depthBreakThreshold: inkCtl.depthBreakThreshold,
                }}
              />
            </group>,
          );
        })}

        {/* F.0 — THE LIVE SKELETON (engineer 2300) · F.0d — AT THE STAGE: the
            build in progress, drawn by the COMMITTED InkedDomain over the real
            DomainModel the panel's own rows make. F.0c measured it at the row:
            a 17×27-px speck behind the risen body — reachable, unusable. It now
            occupies the seat the finished diagram vacated (F.0c disarms mount 1
            while the door is open): the door's target IS the selection, the
            selection is always damped to riseTo, so the live build sits above
            the risen body exactly where mount 1's marks were read — the same
            seat constants (3.05 · 0.68) through the same chain (dim3Scale ·
            riseScale), composed here because this single site serves every
            band the door can target. Dies with the panel. The group is NAMED
            so the acceptance leg can census its marks. */}
        {apertureOpen && liveApertureDomain && apertureTarget ? (
          <group
            name="live-aperture-skeleton"
            position={[riseTo[0], riseTo[1] + 3.05 * scaleCtl.dim3Scale * specimenCtl.riseScale, riseTo[2]]}
            scale={0.68 * scaleCtl.dim3Scale * specimenCtl.riseScale}
          >
            <InkedDomain
              model={liveApertureDomain}
              inkColor={inkFor('live-build', apertureVolume ? apertureVolume.id : 'live-build', silhouetteCtl.color)}
              lineWidth={d.world.domain.lineWidth}
              markColors={d.world.domain.markColors}
              /* §3.1 (designer-ruled, 2026-08-21): the CENTROID DOTS are
                 DROPPED on the live build — not shrunk — because they
                 CONTRADICT the traces (two dots stack inside one apparent
                 face and read as two marks on one face). A dot on a trace
                 must mean "the cycle starts here", which it can only mean
                 when the start TICK is the only dot on the trace. The
                 finished specimen mount keeps its dots — no traces there,
                 nothing to contradict. */
              markRadius={0}
            />
            {/* F.0e — the traced pair marks (mothership §2): the mark IS the
                face's D14 cycle, drawn. Decided pairs share the decided mark
                palette by index (the frozen InkedDomain's dots stay — craft:
                they mark centers; the CYCLES are what say which face);
                pending pairs continue the palette past the decided run so no
                pending pair shares a hue with a decided one on screen. Groups
                NAMED so the acceptance leg can census decided and pending
                traces separately. */}
            {liveApertureTraces ? (
              <group name="live-aperture-traces">
                {liveApertureTraces.decided.map((trace, k) => {
                  const color = d.world.domain.markColors[k % d.world.domain.markColors.length];
                  return (
                    <group key={`decided:${k}`} name="live-aperture-trace-decided">
                      {trace.a ? (
                        <LiveTraceCycle positions={trace.a.positions} color={color} lineWidth={d.world.domain.lineWidth} tickRadius={d.world.domain.markRadius * 0.45} pending={false} />
                      ) : null}
                      {trace.b ? (
                        <LiveTraceCycle positions={trace.b.positions} color={color} lineWidth={d.world.domain.lineWidth} tickRadius={d.world.domain.markRadius * 0.45} pending={false} />
                      ) : null}
                    </group>
                  );
                })}
                {liveApertureTraces.pending.map((trace, j) => {
                  const color =
                    d.world.domain.markColors[
                      (liveApertureTraces.decided.length + j) % d.world.domain.markColors.length
                    ];
                  return (
                    <group key={`pending:${j}`} name="live-aperture-trace-pending">
                      {trace.a ? (
                        <LiveTraceCycle positions={trace.a.positions} color={color} lineWidth={d.world.domain.lineWidth} tickRadius={0} pending />
                      ) : null}
                      {trace.b ? (
                        <LiveTraceCycle positions={trace.b.positions} color={color} lineWidth={d.world.domain.lineWidth} tickRadius={0} pending />
                      ) : null}
                    </group>
                  );
                })}
              </group>
            ) : null}
            {/* §3.2 — THE LEGEND (ratified strings, verbatim): under the
                figure, in the walk's own idiom — the marks teach their
                reading where they are read (the walk already teaches its
                gestures; the pairing figure taught none of its marks). */}
            <Html center position={[0, -1.7, 0]} distanceFactor={13} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 10.5,
                  opacity: 0.6,
                  color: d.paper.titleInk,
                }}
              >
                dashed — not yet decided · solid — decided; the tick is its first corner, and the way it runs is how the faces meet · one hue to a pair
              </div>
            </Html>
          </group>
        ) : null}

        {/* ═══ P5 · M.1 — THE MEMORIALS, AT THEIR OWN SITES ═══════════════════
            Grouped BY SITE, which is what makes M.5's collapse a fact about a
            PLACE (`N removed here`) rather than a list with a count on it. The
            site is the removed entry's own `home` — the same coordinate the
            form stood at, so the mark is where he was looking when he acted. */}
        {[...removals.reduce((byHome, m) => {
          const key = m.home.map((v) => v.toFixed(3)).join(',');
          const at = byHome.get(key) ?? { home: m.home, marks: [] as { name: string; restored: boolean }[] };
          at.marks.push({ name: m.name, restored: m.restored });
          byHome.set(key, at);
          return byHome;
        }, new Map<string, { home: [number, number, number]; marks: { name: string; restored: boolean }[] }>()).entries()].map(
          ([key, at]) => (
            <group key={`memorial:${key}`} position={at.home}>
              <SiteMemorial marks={at.marks} ink={d.paper.titleInk} />
            </group>
          ),
        )}

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
                  pickWidth={selected === id ? undefined : 24}
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
                    lighting={lighting}
                    generators={component.optionB.generators}
                    worldScale={scaleCtl.dim2Scale}
                    selfCrossing={component.class.kind === 'non-orientable'}
                    // M1 — the same binary recessed band on the immersion route
                    recede={{
                      generators: !(selected === id && promotedRegister === 'generators'),
                      field: !(selected === id && promotedRegister === 'field'),
                    }}
                    field={
                      // C.1 — THE ONE-COMPLEX LAW at the seam: the field dresses
                      // ONLY the exact drawn body it was computed on.
                      // THE 3-STATE LAW: door-gated — ABSENT unless promoted.
                      selected === id &&
                      promotedRegister === 'field' &&
                      specimenField &&
                      specimenField.shapeId === component.body.id
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
              <group
                // name = the app-path witness leg's PRESENCE handle (test seam)
                name="faithful-body"
                scale={scaleCtl.dim1Scale * 1.5}
              >
                {(() => {
                  // THE UNIFICATION — the cone's body through the ONE crafted
                  // renderer (prepass · hull silhouette · lit body · hatching
                  // · two-pass), the laid mount's pen compensation mirrored
                  // for this group's scale
                  const faithfulInked = faithfulInkedById.get(entry.form.id);
                  return faithfulInked ? (
                    <InkedForm
                      model={faithfulInked}
                      craft={{
                        ...craftFor(id, entry.form.shape.id),
                        silhouetteScreenspacePx:
                          silhouetteCtl.screenspacePx / Math.max(0.0001, scaleCtl.dim1Scale * 1.5),
                      }}
                      lighting={lighting}
                    />
                  ) : null;
                })()}
                <FaithfulBody
                  model={render.model}
                  seamColor={inkFor(id, entry.form.shape.id, constructionCtl.color)}
                  rimColor={inkFor(id, entry.form.shape.id, silhouetteCtl.color)}
                  seamWidth={1.2}
                  rimWidth={4}
                  seamMark={foldSeamProvenance(
                    render.model.seams.map((s) => s.id),
                    entry.form.shape,
                    entry.form.parentShape,
                  )}
                  selected={selected === id}
                  accent={generatorsCtl.a}
                  ghostColor={genesisCtl.pencilTone}
                />
                {(() => {
                  // R1-REBUILD — the deficit register on the fan (the world-side
                  // cure): the layer reads the REPOSITIONED shape WITH its
                  // acquired complex; a refused datum draws nothing (the card
                  // speaks the refusal — never a false mark in the world)
                  const datum = faithfulDeficitById.get(entry.form.id);
                  return datum && datum.kind === 'read' ? (
                    <InkedDeficitLayer shape={datum.shape} complex={datum.complex} />
                  ) : null;
                })()}
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
                  lighting={lighting}
                  generators={optionBByShape.get(render.shape.id)?.generators}
                  worldScale={scaleCtl.dim1Scale}
                  // M1 — the binary recessed band: annotation registers recede
                  // by default; the SELECTED specimen's promoted one (door or
                  // §7 row touch) draws full. The figure never recedes.
                  recede={{
                    generators: !(selected === id && promotedRegister === 'generators'),
                    field: !(selected === id && promotedRegister === 'field'),
                  }}
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
                    // C.1 — the same one-complex key on the plain route.
                    // THE 3-STATE LAW (SEAL_THE_FIELD_DOOR): the field is
                    // DOOR-GATED — ABSENT unless promoted (presence ≠
                    // consent; the heavy |ψ|²+Σ register never draws
                    // unasked). Absent or promoted, never recessed.
                    selected === id &&
                    promotedRegister === 'field' &&
                    specimenField &&
                    specimenField.shapeId === render.shape.id
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
            {/* PHASE D1 — the correspondence pick + projection layer on the
                SELECTED specimen, for the modes whose DRAWN geometry is the
                form's own shape (plain + skeleton — the lift family; the
                derived-body modes ride after the sanctioned crafted union).
                Invisible; renders no marks (D2's terrain); same transform as
                the drawn body (the CycleTraceOverlay mount idiom). */}
            {/* B-105 W3 §1: while the FOLD panel is open on this entry the
                figure's tap surface belongs to the fold gesture — the
                correspondence layer's colliders would steal the raycast
                (the D2 closest-hit theft, measured at the eye this build) */}
            {selected === id &&
            (render.mode === 'plain' || render.mode === 'skeleton') &&
            !(foldPanel && fold && fold.targetKey === id) ? (
              <group scale={scaleCtl.dim1Scale}>
                <CorrespondencePickLayer
                  shape={entry.form.shape}
                  onHover={setCorrespondenceHover}
                  onPick={setCorrespondencePicked}
                />
              </group>
            ) : null}
            {/* B-105 W3 §1 — THE FOLD TAP rides the DRAWN polygon while the
                fold panel is open on this entry (the CycleTraceOverlay mount
                idiom: same frame as the drawn body). A faithful-mode target
                taps on its REPOSITIONED cells (the deficit datum's shape —
                the fan the person actually sees); plain targets tap their
                own faithful positions. */}
            {foldPanel && fold && fold.targetKey === id ? (
              <group scale={render.mode === 'faithful' ? scaleCtl.dim1Scale * 1.5 : scaleCtl.dim1Scale}>
                <FoldTapOverlay
                  shape={
                    render.mode === 'faithful'
                      ? (() => {
                          const datum = faithfulDeficitById.get(entry.form.id);
                          return datum && datum.kind === 'read' ? datum.shape : entry.form.shape;
                        })()
                      : entry.form.shape
                  }
                  edges={foldPanel.edges}
                  state={{ pairs: fold.pairs, pending: fold.pending }}
                  markColors={d.world.domain.markColors}
                  legendInk={d.paper.titleInk}
                  onTapEdge={handleFoldTap}
                />
              </group>
            ) : null}
            {/* THE RING ANCHOR RESOLVER (SEAL_THE_RING_ANCHOR_RESOLVER) —
                TOTAL over the render union: the resolver returned ANCHORS
                (this mount) or a DECLARED refusal (the card speaks it below;
                classBody/bodiless refuse in the open — never a silent bare).
                M3's faithful fan map rides inside the resolver unchanged.
                Two-register unchanged: the SELECTED specimen only. */}
            {selected === id && selectedArgument && ringResolution?.kind === 'anchored' ? (() => {
              const anchored = ringResolution;
              const scale =
                anchored.mount === 'dim1'
                  ? scaleCtl.dim1Scale
                  : anchored.mount === 'faithful'
                    ? scaleCtl.dim1Scale * 1.5
                    : scaleCtl.dim2Scale;
              return (
                <group scale={scale}>
                  <CorrespondenceRing
                    anchors={anchored.anchors}
                    segments={anchored.segments}
                    figurePoints={anchored.figurePoints}
                    concepts={selectedArgument.conceptRows
                      // ═══ B-131 §3 — THE CALLOUT IS THE CHRISTENING'S OWN
                      // MARK, pointed the right way round (her ruling): a
                      // concept's prong renders IFF the concept carries a
                      // POSITIVE name. The old figure spent the diagram's
                      // strongest device, once per corner, to say NOTHING IS
                      // THERE — and a designation true of every member of its
                      // scope designates nothing. The absence is said ONCE,
                      // at the form's grain, on the card (the corner-absence
                      // line); the RELATION marks (the letters) are untouched.
                      // Structural filter — ownName: string | null — never a
                      // match on the absence word.
                      .filter((r) => r.ownName !== null)
                      .map((r) => ({
                      id: r.resultId,
                      // M3.2 — THE MERGED PRESENTATION (researcher-ruled) →
                      // §2 (B-2026-08-25-A, the designer's COUNT ruling): an
                      // identified class reads its OWN name (or 'unnamed' —
                      // never an invented letter) ← the ruled root phrase.
                      // Roots that cannot be told apart by name are COUNTED,
                      // never indexed — `p ← two unnamed roots`, never the
                      // false sentence `p ← {unnamed, unnamed}` and never a
                      // manufactured handle. Named-distinct roots keep the
                      // set form (`p ← {AB, CD}`); a mix keeps braces with
                      // the counted phrase as a term. One composer:
                      // mergedRootsPhrase, from the rule's own table.
                      label:
                        r.typing === 'identified'
                          ? `${r.ownName ?? 'unnamed'} ← ${mergedRootsPhrase(r.rootOwnNames)}`
                          : r.label,
                      kind: 'concept' as const,
                    }))}
                    relations={selectedArgument.relationRows.map((r) => ({
                      id: r.resultId,
                      label: r.label,
                      kind: 'relation' as const,
                    }))}
                    composed={selectedArgument.composedRelationRows.map((r) => ({
                      id: r.id,
                      label: r.label,
                      pathIds: r.pathIds,
                    }))}
                    h={hatchingCtl.bandPx}
                    ink={d.paper.cardInk}
                    faintInk={genesisCtl.pencilTone}
                    paperColor={d.paper.background}
                    emphasizedIds={emphasizedIds}
                  />
                </group>
              );
            })() : null}
            </>,
          );
        })}

        {/* PHASE A (SEAL_PHASE_A_CAMERA): the shared fit/reset rig replaces
            the bare controls — zoom lands AT the cursor with a usable delta
            (C3), middle-drag pans (C4 — left stays orbit, right stays the
            invoke menu), reset returns the composed default exactly. */}
        <OrbitHandoff into={orbitRef} />
        <SceneCameraControls
          sceneBounds={overviewBounds}
          selectedSceneBounds={selectedCameraBounds}
          fitViewRequest={0}
          fitSelectedRequest={fitSelectedRequest}
          resetCameraRequest={resetCameraRequest}
          defaults={{ position: [...d.layout.cameraPosition] as [number, number, number], target: [0, 0, 0] }}
          resetMode="exact"
          fitAttitude={[0.55, -0.45, 1]}
          // L3 (SEAL_THE_MARKED_SPECIMEN) — the margin is RESERVED BEFORE the
          // figure is sized: the fit reads the ONE constant the callout ring
          // lays its band from (the figure sizes into the remainder)
          fitMargin={SPECIMEN_FIT_MARGIN}
          orbit={{
            zoomToCursor: true,
            zoomSpeed: 1.6,
            panSpeed: 1.1,
            mouseButtons: { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.PAN },
            // D.1 — while a form is in hand the world must hold still: a
            // left-drag on a form moves the FORM, and the same left-drag on
            // empty paper still orbits (unchanged — the discriminator is what
            // is under the pointer, not a mode).
            enabled: !dragging,
          }}
        />
      </Canvas>
      {/* P1a-craft: the dev title overlay is gone — the shared shell bar names
          the app, the toggle names the section. (The shift-click combine hint
          died with it; its proper return is a real help affordance, later.) */}
      {opNotice ? (
        <div
          style={{
            position: 'absolute',
            zIndex: CHROME_LAYER_Z, // B-131 §5 — the chrome layer's one floor
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
            zIndex: CHROME_LAYER_Z, // B-131 §5 — the chrome layer's one floor
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
            zIndex: CHROME_LAYER_Z, // B-131 §5 — the chrome layer's one floor
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
            zIndex: CHROME_LAYER_Z, // B-131 §5 — the chrome layer's one floor
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
          setApertureWall(null);
        }}
        style={{
          position: 'absolute',
          zIndex: CHROME_LAYER_Z, // B-131 §5 — the chrome layer's one floor
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
        {/* D2 — ⛔ COPY PENDING THE DESIGNER (flagged): the door's label; it
            names the pointed-at volume when one is selected. The cube-summon
            zero-state affordance is HER call (routed) — no reset button
            survives the dissolution. */}
        {apertureOpen
          ? 'close the aperture gate'
          : apertureVolume
            ? `aperture — build a 3-manifold (on ${apertureTarget?.title ?? apertureVolume.name})`
            : 'aperture — build a 3-manifold'}
      </button>
      {apertureOpen ? (
        /* D13 §3 — the TIGHT boundary: a throw inside the panel subtree
           speaks and leaves the whole page (its useState work) standing.
           ⚠ precision (engineer 2021): a throw in ManuscriptView's OWN
           render body cannot be caught here — that class is prevented by
           the §2 guard above; AppShell's last-resort boundary is the
           backstop for the unknown one. */
        <ManuscriptErrorBoundary scope="the aperture panel (tight — the page is standing)">
          {/* D13 WITNESS SEAM (dev-only): the panel-scope planted throw — a
              COMPONENT inside the tight boundary's subtree (see D13PanelThrow:
              an inline thrown expression would fire in THIS component's own
              render and only the last-resort could catch it) */}
          {d13Throw === 'panel' ? <D13PanelThrow /> : null}
          <ApertureGatePanel
            rows={apertureRowViews}
            faceCount={apertureFaceMenu.length > 0 ? apertureFaceMenu.length : null}
            // B-104 R3(a): {N} for her leave-bounded string — the boundary
            // faces not consumed by a complete pair, computed live
            unpairedFaceCount={
              apertureFaceMenu.length -
              2 * apertureRows.filter((r) => r.faceA !== null && r.faceB !== null && r.faceA !== r.faceB).length
            }
            parity={apertureParity}
            refusal={apertureRefusal}
            pristine={aperturePristine}
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
            onLeaveBounded={apertureVolume ? handleApertureLeaveBounded : null}
            // B-106 B1: the folded wall crosses the seam as ONE value —
            // sentence + door; the panel cannot render one without the other
            wall={apertureWall ? { sentence: apertureWall.sentence, onSubdivide: handleApertureSubdivide } : null}
            onClose={() => setApertureOpen(false)}
            paper={d.paper}
            accent={generatorsCtl.a}
          />
        </ManuscriptErrorBoundary>
      ) : null}
      {selectedDim3 && !apertureOpen ? (
        <div
          style={{
            position: 'absolute',
            zIndex: CHROME_LAYER_Z, // B-131 §5 — the chrome layer's one floor
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
        // §2b (RULED): the no-target line names WHICH void — nothing picked
        // (the pick prompt) vs a standing selection no band resolves (the
        // ruled sentence, wired). The chrome invents no operability AND no
        // sentence: the view supplies the word.
        noTargetReason={selected === null ? 'select a form first' : UNRESOLVED_SELECTION_REASON}
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
          // §3 (B-2026-08-25-A, RULED): the reason is TOTAL over the enabled
          // predicate BY CONSTRUCTION — enabled IS reason === null (the
          // fold/thicken idiom), one branch per conjunct, so the chip can
          // never grey silent (the ratified idiom: a greyed chip still
          // SPEAKS). The second branch is REACHABLE today: a folded verdict
          // body selects as `folded:` — a band targetFor resolves no
          // traceable form for. ⚠ its wording names the fact only; final
          // copy flagged to the designer.
          enabled: identifySewReason === null,
          reason: identifySewReason,
          open: cycleTrace !== null && cycleTrace.targetKey === selected,
        }}
        onIdentifyToggle={handleIdentifyToggle}
        explore={{
          enabled: exploreEligible !== null,
          // B-104: the greyed chip speaks — a surface candidate whose tiling
          // REFUSED gives its counted facts; anything else, the room prompt
          reason:
            exploreEligible === null
              ? deckTilingFor !== null && !deckTilingFor.ok
                ? deckTilingFor.reason
                : EXPLORE_NEEDS_ROOM
              : null,
          open: exploreOpen !== null || tilingOpen !== null,
        }}
        onExploreToggle={handleExploreDoor}
      />
      {exploreRefusal ? (
        // RUNG 1 — THE THRESHOLD REFUSAL: fires AT the door, with the reason
        // (the geometry's own census / the declared later rung) — the window
        // NEVER opens on a habitat the transport cannot honestly walk
        <div
          data-explore-refusal
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            zIndex: CHROME_LAYER_Z, // B-131 §5 — the chrome layer's one floor
            left: '50%',
            bottom: 92,
            transform: 'translateX(-50%)',
            maxWidth: 470,
            padding: '7px 11px',
            borderRadius: 3,
            background: d.paper.cardBackground,
            border: `1px solid ${d.paper.cardBorder}`,
            boxShadow: '0 2px 9px rgba(58, 51, 38, 0.2)',
            color: d.paper.cardInk,
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12.5,
            fontStyle: 'italic',
            lineHeight: 1.45,
          }}
        >
          {exploreRefusal.reason}
        </div>
      ) : null}
      {exploreOpen && exploreRoom ? (
        // THE GPU EXPLORE WINDOW: the instrument's shader over the paper;
        // the shell stays operable behind it (no backdrop — the world around
        // the window still takes every gesture), and close returns unharmed
        <ExploreWindow
          openKey={exploreOpen}
          title={exploreRoom.title}
          cellSurface={exploreRoom.cellSurface}
          deckLine={exploreRoom.deckLine}
          deckNote={exploreRoom.deckNote}
          level={apertureCtl.level}
          pace={exploreCtl.pace}
          lookSensitivity={exploreCtl.lookSensitivity}
          smoothRodRecede={exploreCtl.smoothRodRecede}
          depthWeightRatio={exploreCtl.depthWeightRatio}
          lodMidEcho={exploreCtl.lodMidEcho}
          lodSmallEcho={exploreCtl.lodSmallEcho}
          lodTinyEcho={exploreCtl.lodTinyEcho}
          paper={{ ...d.paper, background: d.paper.background }}
          accent={generatorsCtl.a}
          onClose={() => setExploreOpen(null)}
        />
      ) : null}
      {tilingOpen && tilingOpen === selected && deckTilingFor?.ok ? (
        // B-104 RUNG 2 — THE DECK-TILING WINDOW: the surface's universal
        // cover in the conformal model of its curvature, the vertex countable
        <DeckTilingWindow
          tiling={deckTilingFor.tiling}
          title={targetFor(selected)?.title ?? 'surface'}
          paper={d.paper}
          accent={generatorsCtl.a}
          onClose={() => setTilingOpen(null)}
        />
      ) : null}
      {/* PHASE A (C2): the recovery controls over the same request counters —
          the plate itself fires on SELECT */}
      <CameraDock
        paper={d.paper}
        hasSelection={selected !== null && selected.startsWith('w:')}
        onFitSelected={() => {
          const bounds = measureSelectedBounds();
          if (bounds) {
            setSelectedCameraBounds(bounds);
            setFitSelectedRequest((request) => request + 1);
          }
        }}
        onResetCamera={() => setResetCameraRequest((request) => request + 1)}
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
            label: faceLabel(combineGate.a.shape, face, resolveAbsentLabel),
          }))}
          bFaces={combineGate.b.shape.faces.map((face) => ({
            id: face.id,
            label: faceLabel(combineGate.b.shape, face, resolveAbsentLabel),
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
          state={foldPanel.state}
          preview={foldPanel.preview}
          commitEnabled={foldPanel.commitEnabled}
          paper={d.paper}
          accent={generatorsCtl.a}
          markColors={d.world.domain.markColors}
          onToggleMode={(pairIndex) =>
            setFold((cur) => (cur ? { ...cur, ...toggleFoldPairMode({ pairs: cur.pairs, pending: cur.pending }, pairIndex) } : cur))
          }
          onCommit={handleFoldCommit}
          onClose={() => setFold(null)}
        />
      ) : reading ? (
        <SpecimenCard
          reading={reading}
          argument={selectedArgument}
          affordance={affordanceLine}
          bound={quotientBound}
          deckRecord={deckRecord}
          paper={d.paper}
          emphasizedIds={emphasizedIds}
          onRowTouch={handleRowTouch}
          generatorInks={{ a: generatorsCtl.a, b: generatorsCtl.b }}
          fieldDoor={{ open: fieldDoorOpen, onToggle: () => setFieldDoorOpen((open) => !open) }}
          exploreDoor={
            // RUNG 1 — the card's doorway rides the dim-3 reading AND the
            // class-body frame (the charter's 'cells not laid on it' site);
            // the folded shelf has no card — its door is the dock chip
            exploreEligible === 'room' || exploreEligible === 'surface'
              ? { onOpen: handleExploreDoor }
              : undefined
          }
          // ═══ P5 — the two form-acts, offered exactly where they can be
          // HONOURED. Removal acts on the person's OWN written forms: the
          // dim-1/dim-2 world rows and the built rooms are not `written`
          // entries and this row is simply absent there — a control that
          // cannot act must not appear as one.
          formActs={
            selected && selected.startsWith('w:') && written.some((w) => `w:${w.form.id}` === selected)
              ? (() => {
                  const entry = written.find((w) => `w:${w.form.id}` === selected)!;
                  const shelfBorn = shelf.some((i) => i.entry.loaded.shape.id === entry.form.shape.id);
                  return {
                    onRemove: () => {
                      removeForm(entry.form.id);
                      setSelected(null);
                    },
                    setAside: shelfBorn
                      ? {
                          onSetAside: () => {
                            setAsideForm(entry.form.id);
                            setSelected(null);
                          },
                        }
                      : {
                          refusal: 'set aside needs a place to wait — this form came from no source, so only the shelf’s own forms can be set aside',
                        },
                  };
                })()
              : undefined
          }
          ringRefusal={ringResolution?.kind === 'refused' ? ringResolution.refusal : undefined}
          ringUnplaced={ringResolution?.kind === 'anchored' && ringResolution.unplaced.length > 0 ? ringResolution.unplaced : undefined}
        />
      ) : null}
      {chord && chordPanel ? (
        <ChordGatePanel
          formTitle={chordPanel.formTitle}
          faceText={faceLabel(chordPanel.shape, chordPanel.face, resolveAbsentLabel)}
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
            zIndex: CHROME_LAYER_Z, // B-131 §5 — the chrome layer's one floor
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
                {/* G1/G3 — the ruled instruction (person's language; the old
                    nothing-to-switch copy WAS the illegibility) */}
                tap the corner you start each edge from — the tail lights there; tap a traced edge again
                to move its tail to the other end
              </div>
              <div style={{ marginBottom: 6 }}>
                <span style={{ color: TRACE_INK_A, fontWeight: 700 }}>A: {cycleTrace.walkA.length}</span>
                {' · '}
                <span style={{ color: TRACE_INK_B, fontWeight: 700 }}>B: {cycleTrace.walkB.length}</span>
                <span style={{ opacity: 0.7 }}> — tracing walk {cycleTrace.phase}</span>
              </div>
              {cyclePreview ? (
                // G4/G5 — THE COMPUTED PREVIEW (the frozen op's own answer,
                // per pair) + the per-pair counterfactual (always exactly the
                // other word — flipping either tail toggles the pair)
                <div data-identify-preview style={{ marginBottom: 6, fontSize: 12 }}>
                  <div style={{ fontSize: 10.5, letterSpacing: 1, opacity: 0.6, fontVariant: 'small-caps' }}>
                    this seam will make
                  </div>
                  <div style={{ fontWeight: 700 }}>{cyclePreview.summary}</div>
                  {cyclePreview.pairs.map((pair, k) => (
                    <div key={`pv:${pair.aId}:${pair.bId}`} style={{ fontSize: 11.5, opacity: 0.85 }}>
                      pair {k + 1}: <b>{pair.word}</b>
                      <span style={{ opacity: 0.75 }}>
                        {' '}
                        — start either edge from its other end → a {pair.other}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
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
                  {/* G6 — the commit STATES its computed result; the bare
                      label stands only while no preview exists (unmatched) */}
                  {cyclePreview ? cyclePreview.commitLabel : 'confirm — sew the seam'}
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
      <RecordStrip
        entries={recordEntries}
        accepted={genesis?.accepted ?? true}
        paper={d.paper}
        // ═══ P5 · U.2 + §5 — THE ACTS LINE, composed from the LEDGER ═════════
        // ⛔ THE DEATH IS NOT ERASED BY THE UNDO: a reverted act still carries
        // its death (`… · removed, then restored`) — the record holds BOTH
        // traces, because the death happened and cannot un-happen. Composed
        // from the ledger rather than stored as a sentence (RECORD, NOT
        // READING: a stored sentence is a stamp that drifts from the acts).
        // ═══ B-131 §4 (Δ23's one-line arm, her grammar) ═══════════════════════
        // ⛔ THE ACT WORD IS NEVER A PEER OF THE TITLE'S OWN WORDS. The
        // ledger's name is the machine TITLE (`Square — invoked`), whose dash
        // chain is the title's own composition — so the act rides as its own
        // STRUCTURE (name + phrase), rendered by the strip with the title
        // roman and whole and the act in its own face after the register's
        // `·`. The dash-joined `${name} — ${word}` composition is gone.
        acts={(() => {
          const revertedIds = new Set(acts.filter((a) => a.kind === 'undo').map((a) => a.ofActId));
          return acts
            .filter((a) => a.kind !== 'undo')
            .map((a) => {
              const word = a.kind === 'remove' ? 'removed' : 'set aside';
              return { name: a.name, phrase: revertedIds.has(a.id) ? `${word}, then restored` : word };
            });
        })()}
        // ⛔ U.4 — the WORD is computed from the act, and the control is
        // ABSENT when there is nothing to undo (never present and inert).
        // ═══ B-131 §4.2 (her ruling) — THE CONTROL DOES NOT NAME THE FORM:
        // it sits ON the acts line, and that line already names which form —
        // *where position carries meaning, repetition is harmless; where
        // position carries nothing, repetition is a lie* — and here position
        // carries it. `undo — remove`, never `undo — remove <title>`.
        undo={(() => {
          const revertedIds = new Set(acts.filter((a) => a.kind === 'undo').map((a) => a.ofActId));
          const target = [...acts].reverse().find((a) => a.kind !== 'undo' && !revertedIds.has(a.id));
          if (!target) return undefined;
          const word = target.kind === 'remove' ? 'remove' : 'set aside';
          return { label: `undo — ${word}`, onUndo: () => undoLastAct() };
        })()}
      />
      <SourcesShelf
        universes={shelfUniverses}
        paper={d.paper}
        dirty={pageDirty}
        onLoadFiles={handleLoadFiles}
        onSavePage={handleSavePage}
        onLoadPage={handleLoadPage}
        onDragEntry={(index) => {
          dragIndexRef.current = index;
        }}
      />
      <Leva collapsed />
    </div>
  );
}
