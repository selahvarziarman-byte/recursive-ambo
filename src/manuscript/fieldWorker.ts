// fieldWorker — ★ THE REPO'S FIRST WEB WORKER (C.1, mothership-ruled; measured:
// ZERO workers existed in src/ before this file). The field pipeline over a
// drawn body is ~n³ and MEASURED SYNCHRONOUS-HOSTILE (the born Klein body's
// 504 sites: 19.2s on the charter's machine; minutes on slower ones), and
// there is no resolution rescue — `buildClassBodyModel` takes no resolution,
// the drawn bodies are fixed per class. So the pure committed
// `computeFieldForShape` runs HERE, off the drawing thread, and the manuscript
// stays a live instrument while a specimen's field is worked out.
//
// THE CALL-GRAPH CLAIM (witnessed): no component module imports
// `computeFieldForShape` — this worker is the ONLY manuscript-side module that
// does, and it enters the app exclusively through
// `new Worker(new URL('./fieldWorker.ts', import.meta.url), { type: 'module' })`
// in ManuscriptView. Off-thread is proven by that graph, never by a timing
// assertion (an instrument must not carry the property it measures).
//
// THE ONE-COMPLEX LAW rides through untouched: the request carries the DRAWN
// shape itself; the field comes back keyed to that shape's own sites. Any
// committed refusal (e.g. the bridge's PARALLEL-edge-classes wall) crosses
// back verbatim as `ok:false` — reported, never routed around.

import type { Shape } from '../types/geometry';
import { computeFieldForShape, type ShapeField } from '../lib/fieldForShape';

export interface FieldWorkRequest {
  shapeId: string;
  shape: Shape; // the drawn body, verbatim (plain data — structured-clone safe)
}

export type FieldWorkResponse =
  | { shapeId: string; ok: true; field: ShapeField }
  | { shapeId: string; ok: false; reason: string };

// the worker global, typed locally (the project compiles under the DOM lib;
// window's postMessage signature differs, so the scope is cast once here)
const scope = globalThis as unknown as {
  onmessage: ((event: MessageEvent<FieldWorkRequest>) => void) | null;
  postMessage(message: FieldWorkResponse): void;
};

scope.onmessage = (event) => {
  const { shapeId, shape } = event.data;
  try {
    scope.postMessage({ shapeId, ok: true, field: computeFieldForShape(shape) });
  } catch (error) {
    scope.postMessage({
      shapeId,
      ok: false,
      reason: error instanceof Error ? error.message : String(error),
    });
  }
};
