// exploreTraceWorker — RUNG 1 of the explore window: the walked frames are
// traced OFF the drawing thread (the fieldWorker precedent — the repo's
// worker idiom). SMOOTHNESS IS FAITHFULNESS here (charter invariant 1): a
// main-thread trace blocks the very gesture that asked for it, and a hitch
// at the crossing would read as a seam. The worker runs the SAME committed
// `traceAperture` verbatim — same deck, same scene builders, same probes —
// so the walked frame is the shell's own pipeline, only elsewhere-threaded.
//
// THE CALL-GRAPH CLAIM: this worker enters the app exclusively through
// `new Worker(new URL('./exploreTraceWorker.ts', import.meta.url),
// { type: 'module' })` in ManuscriptView. Off-thread is proven by that
// graph, never by a timing assertion.
//
// THE SCENE IS BUILT ONCE per opened room (init); the probes' ~522k-triangle
// BVHs build once per worker life (module caches inside the committed
// modules) — the 'warm' message forces that build at boot so the first
// opened door does not pay it.

import type { Shape } from '../types/geometry';
import {
  buildApertureScene,
  traceAperture,
  type ApertureCraft,
  type ApertureScene,
  type ApertureTrace,
  type DeckEntry,
} from './apertureModel';
import { buildProbeMeshes } from './apertureProbes';

export type ExploreWorkRequest =
  | { kind: 'warm'; seedShape: Shape }
  | { kind: 'init'; session: number; seedShape: Shape; placedShape: Shape | null; deck: DeckEntry[] }
  | {
      kind: 'move';
      session: number;
      seq: number;
      eye: [number, number, number];
      forward: [number, number, number];
      width: number;
      height: number;
      craft: Partial<ApertureCraft>;
    };

export type ExploreWorkResponse =
  | { kind: 'warmed' }
  | { kind: 'ready'; session: number }
  | { kind: 'trace'; session: number; seq: number; trace: ApertureTrace }
  | { kind: 'refused'; session: number; seq: number; reason: string };

const scope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<ExploreWorkRequest>) => void) | null;
  postMessage(message: ExploreWorkResponse, transfer?: Transferable[]): void;
};

let current: { session: number; deck: DeckEntry[]; scene: ApertureScene } | null = null;

const probes = () => {
  const pm = buildProbeMeshes();
  return [...pm.maskShells, pm.hand];
};

scope.onmessage = (event) => {
  const req = event.data;
  if (req.kind === 'warm') {
    // force the probe BVH builds now (traceAperture builds them lazily on
    // first hit-test); an empty deck loses every ray that misses the probes —
    // the frame is thrown away, only the caches matter
    traceAperture({ deck: [], scene: buildApertureScene(req.seedShape, null, probes()), width: 8, height: 8 });
    scope.postMessage({ kind: 'warmed' });
    return;
  }
  if (req.kind === 'init') {
    current = {
      session: req.session,
      deck: req.deck,
      scene: buildApertureScene(req.seedShape, req.placedShape, probes()),
    };
    scope.postMessage({ kind: 'ready', session: req.session });
    return;
  }
  if (!current || current.session !== req.session) {
    scope.postMessage({ kind: 'refused', session: req.session, seq: req.seq, reason: 'no live session' });
    return;
  }
  try {
    const trace = traceAperture({
      deck: current.deck,
      scene: current.scene,
      width: req.width,
      height: req.height,
      craft: req.craft,
      eye: req.eye,
      forward: req.forward,
    });
    scope.postMessage({ kind: 'trace', session: req.session, seq: req.seq, trace }, [
      trace.hit.buffer,
      trace.value.buffer,
      trace.echo.buffer,
      trace.mirrored.buffer,
      trace.material.buffer,
      trace.depth.buffer,
      trace.normal.buffer,
    ]);
  } catch (error) {
    scope.postMessage({
      kind: 'refused',
      session: req.session,
      seq: req.seq,
      reason: error instanceof Error ? error.message : String(error),
    });
  }
};
