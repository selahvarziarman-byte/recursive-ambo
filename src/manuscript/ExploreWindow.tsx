// ExploreWindow — RUNG 1 (FAT CHARTER 2026-08-07): the EXPLORE WINDOW. The
// inside-view is a FEATURE, not a render phase — the person opens this window
// from a shape's doorway and WALKS the habitat; the shell stays the operable
// representative behind it, unharmed on return.
//
// WHAT THIS COMPONENT IS: a thin hand around the committed pipeline —
//   frames   : traceAperture, run OFF-THREAD (exploreTraceWorker; smoothness
//              is faithfulness — a hitch at the crossing reads as a seam)
//   ink      : renderApertureInk VERBATIM (the void is paper; the line
//              carries the form; the rim stays the hand-cut hole, grown)
//   the walk : exploreWindowModel (look + advance; the eye is carried back
//              through a paired face by the engine's own gluing isometry —
//              the crossing is drawn NOWHERE)
//   caption  : apertureCaption VERBATIM (countable copies — the ORBIT word
//              only) + the horizon line `copies shown to depth N` (the depth
//              limit is the LIMIT OF SIGHT: marks fade out by echo through
//              the ink's own law; un-hit rays stay exactly paper, never a
//              black wall).
// NO second instrument rides here — no arrow overlay, no floor-plan inset,
// no position badge, no group-law picture: the mask and the hand carry the
// proof themselves (the inhabitants ARE the instrument).
//
// TWO GESTURES ONLY (walking a cloister, deliberate pace):
//   look    — drag rotates forward about the eye
//   advance — press and hold still; the eye moves along forward
// A press locks into ONE of the two for its lifetime (no blended flight-sim
// steering; no strafe, no roll, no speed).

import { useEffect, useMemo, useRef } from 'react';
import type { Shape, Vec3 } from '../types/geometry';
import {
  apertureCaption,
  type ApertureCraft,
  type ApertureGeometry,
  type ApertureTrace,
  type DeckEntry,
  type FoldedApertureGeometry,
} from './apertureModel';
import { renderApertureInk, type ApertureInkStyle } from './apertureInk';
import { advanceEye, exploreStartState, lookTurn, type ExploreWalkState } from './exploreWindowModel';
import type { ExploreWorkRequest, ExploreWorkResponse } from './exploreTraceWorker';

// the dev test-seam (the __manuscriptScene idiom): the leg reads the walk's
// own live state — never a parallel computation
interface ExploreSeam {
  open: string | null;
  title: string | null;
  eye: Vec3 | null;
  forward: Vec3 | null;
  crossings: number;
  traces: number;
  looks: number;
  advances: number;
  restCounts: { masks: number; hands: number; mirrored: number } | null;
  caption: string | null;
  // consecutive-frame mean |Δvalue| during the walk — the NO-SEAM metric: a
  // crossing frame must look like any other walking frame (equivariance);
  // a wrong transport would explode exactly here
  deltas: { delta: number; crossed: boolean; gesture: 'look' | 'advance' | null }[];
  // THE INSIDE-VIEW HATCH — grey from LINES, measured on the rendered bytes
  // the person sees: paper fraction, the interior mid band, and
  // strokeContrast — the fraction of mid-band pixels whose 8-neighbour tone
  // range is HIGH (a stroke lives beside paper; a wash sits in a flat
  // region). D1's fill-ladder bar is RETIRED; a wash reads strokeContrast≈0
  // exactly here.
  inkTone: { paper: number; mid: number; strokeContrast: number } | null;
}

const seamOf = (): ExploreSeam => {
  const host = window as unknown as { __exploreWindow?: ExploreSeam };
  if (!host.__exploreWindow) {
    host.__exploreWindow = {
      open: null,
      title: null,
      eye: null,
      forward: null,
      crossings: 0,
      traces: 0,
      looks: 0,
      advances: 0,
      restCounts: null,
      caption: null,
      deltas: [],
      inkTone: null,
    };
  }
  return host.__exploreWindow;
};

// D1 — project each rendered pixel onto the paper→ink line and band it; the
// histogram is measured on the EXACT bytes put to the canvas (never a
// parallel render)
const hexChannel = (hexColor: string, at: number): number => parseInt(hexColor.slice(at, at + 2), 16);
function measureInkTone(
  bytes: Uint8ClampedArray,
  width: number,
  paperColor: string,
  interiorInk: string,
): { paper: number; mid: number; strokeContrast: number } {
  const p = [hexChannel(paperColor, 1), hexChannel(paperColor, 3), hexChannel(paperColor, 5)];
  const k = [hexChannel(interiorInk, 1), hexChannel(interiorInk, 3), hexChannel(interiorInk, 5)];
  const d = [p[0] - k[0], p[1] - k[1], p[2] - k[2]];
  const dd = d[0] * d[0] + d[1] * d[1] + d[2] * d[2] || 1;
  const total = bytes.length / 4;
  const height = total / width;
  const tOf = (i: number): number | null => {
    if (bytes[i * 4 + 3] === 0) return null;
    return Math.max(
      0,
      Math.min(1, ((p[0] - bytes[i * 4]) * d[0] + (p[1] - bytes[i * 4 + 1]) * d[1] + (p[2] - bytes[i * 4 + 2]) * d[2]) / dd),
    );
  };
  let covered = 0;
  let paperN = 0;
  let mid = 0;
  let midStroke = 0;
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const i = y * width + x;
      const t = tOf(i);
      if (t === null) continue;
      covered += 1;
      if (t < 0.15) paperN += 1;
      if (t < 0.2 || t >= 0.9) continue;
      mid += 1;
      let lo = 1;
      let hi = 0;
      for (const j of [i - 1, i + 1, i - width, i + width, i - width - 1, i - width + 1, i + width - 1, i + width + 1]) {
        const tj = tOf(j);
        if (tj === null) continue;
        if (tj < lo) lo = tj;
        if (tj > hi) hi = tj;
      }
      if (hi - lo > 0.35) midStroke += 1;
    }
  }
  const n = covered || 1;
  return { paper: paperN / n, mid: mid / n, strokeContrast: mid ? midStroke / mid : 0 };
}

let nextSession = 1;

const LOOK_SLOP_PX = 7;
const ADVANCE_HOLD_MS = 260;

export interface ExploreWindowProps {
  openKey: string; // the shell's own selection key — the room this window is inside of
  title: string;
  seedShape: Shape;
  placedShape: Shape | null;
  deck: DeckEntry[];
  geometry: ApertureGeometry | FoldedApertureGeometry;
  resolution: number; // the window's own trace raster (px)
  craft: Partial<ApertureCraft>; // the shell's live craft dials, shared
  ink: Partial<ApertureInkStyle>;
  firstTrace: ApertureTrace | null; // the shell's standing frame — instant first paint
  worker: Worker;
  pace: number; // advance, world units / s
  lookSensitivity: number; // rad / px
  paper: { cardBackground: string; cardBorder: string; cardInk: string; background: string };
  accent: string;
  onClose: () => void;
}

export function ExploreWindow({
  openKey,
  title,
  seedShape,
  placedShape,
  deck,
  geometry,
  resolution,
  craft,
  ink,
  firstTrace,
  worker,
  pace,
  lookSensitivity,
  paper,
  accent,
  onClose,
}: ExploreWindowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const captionRef = useRef<HTMLDivElement | null>(null);
  const walkRef = useRef<ExploreWalkState>(exploreStartState());
  const sessionRef = useRef(0);
  const seqRef = useRef(0);
  const inflightRef = useRef(false);
  const dirtyRef = useRef(false);
  const prevTraceRef = useRef<ApertureTrace | null>(null);
  const prevCrossingsRef = useRef(0);
  const pendingRef = useRef<{ crossings: number; gesture: 'look' | 'advance' | null }>({ crossings: 0, gesture: null });
  const gestureRef = useRef<'look' | 'advance' | null>(null);
  const liveRef = useRef({ craft, ink, resolution, pace, lookSensitivity, geometry });
  liveRef.current = { craft, ink, resolution, pace, lookSensitivity, geometry };

  // the seed cell's own box — the walls the walk may not pass except by carry
  const bbox = useMemo(() => {
    const lo: Vec3 = [Infinity, Infinity, Infinity];
    const hi: Vec3 = [-Infinity, -Infinity, -Infinity];
    for (const v of Object.values(seedShape.vertices)) {
      const p = v.position;
      if (!p) continue;
      for (let k = 0; k < 3; k += 1) {
        lo[k] = Math.min(lo[k], p[k]);
        hi[k] = Math.max(hi[k], p[k]);
      }
    }
    return { lo, hi };
  }, [seedShape]);

  const paintTrace = (trace: ApertureTrace): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (canvas.width !== trace.width || canvas.height !== trace.height) {
      canvas.width = trace.width;
      canvas.height = trace.height;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // re-wrap: the ink's bytes ride whatever buffer it allocated; ImageData
    // demands a plain ArrayBuffer-backed view
    const bytes = new Uint8ClampedArray(renderApertureInk(trace, liveRef.current.ink));
    // the grey-from-lines measure, on these exact bytes
    seamOf().inkTone = measureInkTone(
      bytes,
      trace.width,
      liveRef.current.ink.paperColor ?? '#e9e2cf',
      liveRef.current.ink.interiorInk ?? '#2a251c',
    );
    ctx.putImageData(new ImageData(bytes, trace.width, trace.height), 0, 0);
  };

  const updateCaption = (trace: ApertureTrace): void => {
    // COUNTABLE + the horizon: the committed caption (orbit · LEFT hands —
    // count them) with the limit of sight named in copies-depth, never a wall.
    // FEED (researcher): whether "come back mirrored" is the right
    // orientation floor for THIS caption is the researcher's open question
    // (charter §4b) — the committed hands-LEFT floor rides until it lands.
    const level = Math.max(0, Math.round(liveRef.current.craft.level ?? 6));
    const text = `${apertureCaption(liveRef.current.geometry, trace.counts)} · copies shown to depth ${level}`;
    if (captionRef.current) captionRef.current.textContent = text;
    seamOf().caption = text;
  };

  const requestTrace = (): void => {
    if (inflightRef.current) {
      dirtyRef.current = true;
      return;
    }
    inflightRef.current = true;
    seqRef.current += 1;
    pendingRef.current = { crossings: walkRef.current.crossings, gesture: gestureRef.current };
    const req: ExploreWorkRequest = {
      kind: 'move',
      session: sessionRef.current,
      seq: seqRef.current,
      eye: [...walkRef.current.eye] as [number, number, number],
      forward: [...walkRef.current.forward] as [number, number, number],
      width: liveRef.current.resolution,
      height: liveRef.current.resolution,
      craft: liveRef.current.craft,
    };
    worker.postMessage(req);
    const seam = seamOf();
    seam.eye = [...walkRef.current.eye] as Vec3;
    seam.forward = [...walkRef.current.forward] as Vec3;
    seam.crossings = walkRef.current.crossings;
  };

  // mount: open the session, first-paint the shell's standing frame, listen
  useEffect(() => {
    sessionRef.current = nextSession;
    nextSession += 1;
    walkRef.current = exploreStartState();
    seqRef.current = 0;
    inflightRef.current = false;
    dirtyRef.current = false;
    prevTraceRef.current = null;
    const seam = seamOf();
    seam.open = openKey;
    seam.title = title;
    seam.eye = [...walkRef.current.eye] as Vec3;
    seam.forward = [...walkRef.current.forward] as Vec3;
    seam.crossings = 0;
    seam.traces = 0;
    seam.looks = 0;
    seam.advances = 0;
    seam.restCounts = null;
    seam.caption = null;
    seam.deltas = [];
    seam.inkTone = null;

    // RECURRENCE AT REST — the first paint is the shell's own standing frame
    // (same committed pipeline, same default eye/forward): the corridor
    // already shows the returning copies before the person moves or a single
    // walked frame lands
    if (firstTrace) {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = firstTrace.width;
        canvas.height = firstTrace.height;
      }
      paintTrace(firstTrace);
      updateCaption(firstTrace);
    }

    const onMessage = (event: MessageEvent<ExploreWorkResponse>): void => {
      const resp = event.data;
      if (resp.kind === 'warmed') return;
      if (resp.session !== sessionRef.current) return;
      if (resp.kind === 'ready') {
        requestTrace();
        return;
      }
      inflightRef.current = false;
      if (resp.kind === 'refused') return;
      const trace = resp.trace;
      const s = seamOf();
      s.traces += 1;
      if (s.restCounts === null) {
        s.restCounts = {
          masks: trace.counts.maskCopiesVisible,
          hands: trace.counts.handCopiesVisible,
          mirrored: trace.counts.handCopiesMirrored,
        };
      }
      const prev = prevTraceRef.current;
      if (prev && prev.width === trace.width && prev.height === trace.height) {
        let sum = 0;
        for (let i = 0; i < trace.value.length; i += 1) sum += Math.abs(trace.value[i] - prev.value[i]);
        s.deltas.push({
          delta: sum / trace.value.length,
          crossed: pendingRef.current.crossings > prevCrossingsRef.current,
          gesture: pendingRef.current.gesture,
        });
        if (s.deltas.length > 48) s.deltas.shift();
      }
      prevTraceRef.current = trace;
      prevCrossingsRef.current = pendingRef.current.crossings;
      paintTrace(trace);
      updateCaption(trace);
      if (dirtyRef.current) {
        dirtyRef.current = false;
        requestTrace();
      }
    };
    worker.addEventListener('message', onMessage);
    const init: ExploreWorkRequest = { kind: 'init', session: sessionRef.current, seedShape, placedShape, deck };
    worker.postMessage(init);

    return () => {
      worker.removeEventListener('message', onMessage);
      const closingSeam = seamOf();
      closingSeam.open = null;
      closingSeam.title = null;
    };
    // the session opens once per mounted window (openKey identifies it)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey]);

  // the two gestures — one press locks into one of them
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let pressed = false;
    let mode: 'undecided' | 'look' | 'advance' = 'undecided';
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let holdTimer: number | null = null;
    let raf: number | null = null;
    let lastTick = 0;

    const stopAdvance = (): void => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };
    const advanceTick = (now: number): void => {
      if (!pressed || mode !== 'advance') return;
      const dt = Math.min(0.08, Math.max(0, (now - lastTick) / 1000));
      lastTick = now;
      walkRef.current = advanceEye(deck, bbox.lo, bbox.hi, walkRef.current, liveRef.current.pace * dt);
      requestTrace();
      raf = requestAnimationFrame(advanceTick);
    };

    const onDown = (event: PointerEvent): void => {
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);
      pressed = true;
      mode = 'undecided';
      gestureRef.current = null;
      startX = event.clientX;
      startY = event.clientY;
      lastX = event.clientX;
      lastY = event.clientY;
      holdTimer = window.setTimeout(() => {
        if (!pressed || mode !== 'undecided') return;
        mode = 'advance';
        gestureRef.current = 'advance';
        seamOf().advances += 1;
        lastTick = performance.now();
        raf = requestAnimationFrame(advanceTick);
      }, ADVANCE_HOLD_MS);
    };
    const onMove = (event: PointerEvent): void => {
      if (!pressed) return;
      if (mode === 'undecided') {
        const moved = Math.hypot(event.clientX - startX, event.clientY - startY);
        if (moved > LOOK_SLOP_PX) {
          mode = 'look';
          gestureRef.current = 'look';
          seamOf().looks += 1;
          if (holdTimer !== null) window.clearTimeout(holdTimer);
          holdTimer = null;
        }
      }
      if (mode === 'look') {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        const s = liveRef.current.lookSensitivity;
        walkRef.current = lookTurn(walkRef.current, -dx * s, -dy * s);
        requestTrace();
      }
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onUp = (event: PointerEvent): void => {
      if (!pressed) return;
      pressed = false;
      mode = 'undecided';
      gestureRef.current = null;
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      holdTimer = null;
      stopAdvance();
      // the settle frame: one final trace of wherever the walk stopped — so
      // a crossing taken in the last stride still gets its frame (under load
      // the in-flight cadence can outlive the press)
      requestTrace();
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        /* released with the press */
      }
    };
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    return () => {
      stopAdvance();
      if (holdTimer !== null) window.clearTimeout(holdTimer);
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
    // gesture wiring binds once per session; live dials ride liveRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey, deck, bbox]);

  return (
    <div
      data-explore-window
      onMouseDown={(e) => e.stopPropagation()}
      style={{
        position: 'absolute',
        left: '50%',
        top: 54,
        transform: 'translateX(-50%)',
        width: 'min(58vh, 620px)',
        padding: '10px 12px 8px',
        borderRadius: 3,
        background: paper.cardBackground,
        border: `1px solid ${paper.cardBorder}`,
        boxShadow: '0 3px 14px rgba(58, 51, 38, 0.28)',
        color: paper.cardInk,
        fontFamily: 'Georgia, "Times New Roman", serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.6, fontVariant: 'small-caps' }}>inside — </span>
          <span style={{ fontSize: 14.5, fontWeight: 700 }}>{title}</span>
        </div>
        <button
          type="button"
          aria-label="close — return to the shell"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onClose}
          style={{
            border: `1px solid ${paper.cardBorder}`,
            borderRadius: 3,
            background: 'transparent',
            color: accent,
            cursor: 'pointer',
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 12,
            padding: '2px 8px',
          }}
        >
          close — return to the shell
        </button>
      </div>
      <canvas
        ref={canvasRef}
        data-explore-canvas
        style={{
          display: 'block',
          width: '100%',
          aspectRatio: '1 / 1',
          background: paper.background,
          cursor: 'crosshair',
          touchAction: 'none',
        }}
      />
      <div
        ref={captionRef}
        data-explore-caption
        style={{ marginTop: 6, fontFamily: 'ui-monospace, monospace', fontSize: 11, opacity: 0.78, minHeight: 15 }}
      />
      <div style={{ marginTop: 3, fontSize: 10.5, opacity: 0.55 }}>
        drag — look around · press and hold — walk forward · esc returns to the shell
      </div>
    </div>
  );
}
