// witnessBridge — the Engine→UI adapter (DERIVE-ONLY · ADDITIVE).
//
// THE BRIDGE, NOT A SECOND ENGINE. This module makes the committed structural engine
// reach the screen. It does exactly three things, and re-derives NO engine math:
//   (1) appShapeToAssembledComplex(shape) — TRANSLATE an app `Shape` into the engine's
//       `AssembledComplex` (the §3 face-word: a vertex-list becomes an oriented edge-word).
//   (2) buildKnownSeam() — CONSTRUCT the known `w₁=1` intrinsic seam via the COMMITTED
//       self-glue cascade, run the COMMITTED engine, and read its seam (the `runFrameWitness`
//       witness). This is the falsifiable known truth: site-witness {bd, cd}, ∏U = −1.
//   (3) buildKnownSeamRenderState() — JOIN the engine's per-site output back to the app's
//       F0 positions BY ID → a `RenderState` the standalone view draws.
//
// EVERYTHING is read from the committed modules: `w₁`/`perCycleW1` from `analyzeGlobalW1`;
// the flat gauge `U_e` from the committed `runFrameWitness`/`buildFlatConnection`; the
// director axis `n_site` from the committed `buildSiteFrames`; the per-site orientation sign
// from the committed `transportDirector`. The bridge computes no `w₁`, no flat gauge, and no
// director itself — if it ever needed one the engine doesn't expose, the rule is STOP and
// surface, never recompute (that would drift from the committed truth).
//
// The construction of the known form + its seam MIRRORS the committed diagnostics'
// `assembledFromCascade` path (scripts/diagnose-s4-frame-witness.cjs and
// diagnose-spectral-flow.cjs) verbatim, so the bridge reads the SAME structure the
// ratified witness reported. Committed engine modules are imported, never edited.

import type { Edge, Face, Shape, Vec3 } from '../types/geometry';
import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from '../lib/ambo';
import { buildIncidenceTraceRegistry } from '../lib/incidenceTraceRegistry';
import { buildSelfGlueSeed, certifyCascadeOrientation, runCascade } from '../lib/cascadeDriver';
import { faceEdgePairs } from '../lib/surfaceOperations';
import { analyzeGlobalW1, type AssembledComplex } from '../lib/globalW1';
import {
  buildCellFrame,
  buildSiteFrames,
  runFrameWitness,
  transportDirector,
  type SiteFrame,
  type SiteWitness,
} from '../lib/s4FrameWitnessV0';
import { cycleGraph, type Sign } from '../lib/connectionWaveInstrumentV0';

// ---------------------------------------------------------------------------
// the forced ordering (mirrors the committed witness runner exactly)
// ---------------------------------------------------------------------------
// `cornerOf` extracts a primal corner's short label (the last ':'-segment); `siteKeyOf`
// reduces an X_K site's 2 parents to its sorted corner-pair key (e.g. 'bd'). `HAM` is the
// Hamiltonian octahedron cycle order (consecutive sites share a primal corner = a real X_K
// edge); `LOOP` is the 6-cycle the intrinsic seam winds around — both verbatim from
// scripts/diagnose-s4-frame-witness.cjs so the bridge reads the ratified frame.
const cornerOf = (vid: string): string => vid.split(':').pop() ?? vid;
export function siteKeyOf(parents: readonly string[]): string {
  return parents.map(cornerOf).slice().sort().join('');
}
const HAM = ['ab', 'ac', 'ad', 'bd', 'cd', 'bc'] as const; // +x,+y,+z,−y,−x,−z
const LOOP = [0, 1, 2, 3, 4, 5];

const edgeKeyOf = (u: string, v: string): string =>
  [u, v].sort((a, b) => a.localeCompare(b)).join('|');

// ---------------------------------------------------------------------------
// the known form — F0 = ambo-dissect(tetra) + its pure-X_K intrinsic face
// ---------------------------------------------------------------------------
export interface KnownForm {
  F0: Shape;
  intrinsicFace: Face; // a pure-X_K (all-midpoint) triangular face — the self-glue seed
}

// Build the known substrate. The `w₁=1` form is NOT a native app shape — it is produced by
// the committed self-glue of F0 (below); F0 itself is the orientable ambo-dissection.
export function buildKnownForm(): KnownForm {
  const tetra = createSeedShape('tetrahedron');
  const F0 = applyAmboDissection(tetra);
  const midpointSet = new Set(
    Object.values(F0.vertices)
      .filter(
        (v) =>
          v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2,
      )
      .map((v) => v.id),
  );
  const pureFaces = F0.faces.filter(
    (f) => f.vertexIds.length === 3 && f.vertexIds.every((v) => midpointSet.has(v)),
  );
  if (pureFaces.length === 0) {
    throw new Error('witnessBridge: F0 has no pure-X_K face (expected 12) — known form not buildable');
  }
  return { F0, intrinsicFace: pureFaces[0] };
}

// ---------------------------------------------------------------------------
// (1) the TRANSLATE — app Shape → engine AssembledComplex (the §3 face-word)
// ---------------------------------------------------------------------------
// vertices: Object.keys(shape.vertices). edges: app Edge{vertexIds:[a,b]} → { id, u:a, v:b }.
// faces: each Face.vertexIds=[v0…v_{n-1}] → an oriented boundary word — per consecutive pair
// (a,b), the edge-class with endpoints {a,b} and dir = (e.u===a && e.v===b) ? +1 : −1. For a
// native orientable shape (no self-glue) the ids are 1:1; the identification is trivial.
export function appShapeToAssembledComplex(shape: Shape): AssembledComplex {
  const vertices = Object.keys(shape.vertices);
  const edges = shape.edges.map((e: Edge) => ({ id: e.id, u: e.vertexIds[0], v: e.vertexIds[1] }));
  const edgeByEndpoints = new Map<string, { id: string; u: string; v: string }>();
  for (const e of edges) edgeByEndpoints.set(edgeKeyOf(e.u, e.v), e);

  const faces = shape.faces.map((face) => {
    const vs = face.vertexIds;
    const boundary = vs.map((a, i) => {
      const b = vs[(i + 1) % vs.length];
      const e = edgeByEndpoints.get(edgeKeyOf(a, b));
      if (!e) {
        throw new Error(
          `witnessBridge.appShapeToAssembledComplex: face ${face.id} boundary pair ${a}..${b} has no edge-class (the face-word is ambiguous) — STOP and surface`,
        );
      }
      const dir: 1 | -1 = e.u === a && e.v === b ? 1 : -1;
      return { edge: e.id, dir };
    });
    return { boundary };
  });

  return { vertices, edges, faces };
}

// ---------------------------------------------------------------------------
// the engine-side identification — the committed self-glue cascade (MIRRORED verbatim)
// ---------------------------------------------------------------------------
// Build the glued `AssembledComplex` of a self-glued pure-X_K seam: run the COMMITTED
// `buildSelfGlueSeed`+`runCascade`, take the partition's class representatives as the
// supports/edge-classes, and read the cascade's w₁. This is the diagnostics'
// `assembledFromCascade` path — the bridge applies the identification THROUGH the committed
// self-glue, never by reinterpreting the app shape.
function assembledFromCascade(
  F0: Shape,
  face: Face,
  mode: 'flip' | 'control',
): { complex: AssembledComplex; w1: 0 | 1 } {
  const edgeByKey = new Map<string, Edge>();
  for (const e of F0.edges) edgeByKey.set(edgeKeyOf(e.vertexIds[0], e.vertexIds[1]), e);

  const trace = runCascade(F0, [face], buildSelfGlueSeed(F0, face, mode));
  const w1 = certifyCascadeOrientation(F0, [face], trace).w1;

  const repOf = (classes: string[][], id: string): string => {
    for (const cls of classes) if (cls.includes(id)) return cls[0];
    return id;
  };
  const vClass = (v: string): string => repOf(trace.partition[0], v);
  const eClass = (e: string): string => repOf(trace.partition[1], e);

  const edges = trace.partition[1].map((cls) => {
    const real = F0.edges.find((e) => e.id === cls[0]);
    if (!real) throw new Error(`witnessBridge: edge-class rep ${cls[0]} not in F0.edges`);
    return { id: cls[0], u: vClass(real.vertexIds[0]), v: vClass(real.vertexIds[1]) };
  });
  const boundary = faceEdgePairs(face).map(([from, to]) => {
    const real = edgeByKey.get(edgeKeyOf(from, to));
    if (!real) throw new Error(`witnessBridge: no real edge for face pair ${from}..${to}`);
    const classId = eClass(real.id);
    const ae = edges.find((e) => e.id === classId);
    if (!ae) throw new Error(`witnessBridge: assembled edge-class ${classId} missing`);
    const dir: 1 | -1 = ae.u === vClass(from) && ae.v === vClass(to) ? 1 : -1;
    return { edge: classId, dir };
  });
  const vertices = [...new Set(face.vertexIds.map(vClass))];
  return { complex: { vertices, edges, faces: [{ boundary }] }, w1 };
}

// ---------------------------------------------------------------------------
// (2) the KNOWN `w₁=1` SEAM — read straight from the committed engine
// ---------------------------------------------------------------------------
export interface KnownSeam {
  perCycleW1: number[]; // committed analyzeGlobalW1(glued).debug.perCycleW1 — [1] for the seam
  cascadeW1: 0 | 1; // committed certifyCascadeOrientation w₁ (cross-check; 1 = non-orientable)
  orderedSiteIds: string[]; // loop index → X_K siteId (the HAM ordering)
  siteKeys: string[]; // loop index → corner-pair key ('ab','ac','ad','bd','cd','bc')
  siteFrames: SiteFrame[]; // committed S₄ frame per ordered site (nSite director + axisLabel)
  edgeSigns: Sign[]; // committed flat-gauge U_e over the X_K 6-cycle
  witness: SiteWitness; // committed runFrameWitness witness (flipEdges/witnessSites over loop indices)
  windingSign: Sign | null; // committed ∏U around the loop (−1 = the director flips: the seam)
}

// Construct the witness's intrinsic seam via the committed self-glue, run the committed
// engine, and return its seam. `form` is threaded so the caller can join to the SAME F0
// instance's positions (ambo stamps a fresh timestamp per build).
export function buildKnownSeam(form: KnownForm = buildKnownForm()): KnownSeam {
  const { F0, intrinsicFace } = form;

  // the 6 X_K sites + the forced S₄ frame (committed) — ordered along the octahedral cycle.
  const sites = buildIncidenceTraceRegistry(F0).sites;
  const cornerIds = [...new Set(sites.flatMap((s) => s.parents))].sort();
  const cellFrame = buildCellFrame(cornerIds);
  const siteByKey: Record<string, (typeof sites)[number]> = {};
  for (const s of sites) siteByKey[siteKeyOf(s.parents)] = s;
  const orderedSites = HAM.map((k) => {
    const s = siteByKey[k];
    if (!s) throw new Error(`witnessBridge: no X_K site for HAM key '${k}' — frame not buildable`);
    return s;
  });
  const siteInputs = orderedSites.map((s) => ({
    siteId: s.scopedVertexId,
    parents: s.parents,
  }));
  const siteFrames = buildSiteFrames(siteInputs, cellFrame);

  // the committed holonomy class of the glued seam, read straight from analyzeGlobalW1.
  const { complex, w1: cascadeW1 } = assembledFromCascade(F0, intrinsicFace, 'flip');
  const perCycleW1 = analyzeGlobalW1(complex).debug.perCycleW1;

  // the committed flat gauge + the two committed observables on the X_K cycle.
  const cycle = cycleGraph(6);
  const result = runFrameWitness(cycle, perCycleW1, LOOP);

  return {
    perCycleW1,
    cascadeW1,
    orderedSiteIds: orderedSites.map((s) => s.scopedVertexId),
    siteKeys: orderedSites.map((s) => siteKeyOf(s.parents)),
    siteFrames,
    edgeSigns: result.edgeSigns,
    witness: result.witness,
    windingSign: result.winding.windingSign,
  };
}

// ---------------------------------------------------------------------------
// (3) the RENDER-STATE — the engine output joined to the app's F0 positions BY ID
// ---------------------------------------------------------------------------
export interface RenderStateSite {
  siteId: string;
  position: Vec3; // app F0 position (joined by id) — the only thing from the app, never recomputed
  parents: [string, string]; // createdBy.sourceVertexIds (the 2 source-less primals)
  siteKey: string; // corner-pair key ('bd', 'cd', …) — a readout, never a law
  directorAxis: Vec3; // committed n_site (the S₄-frame octahedral axis), NOT recomputed
  axisLabel: string; // committed '+x'…'-z' readout
  orientationSign: 1 | -1; // committed flat-gauge sign, transported (transportDirector) — NOT recomputed
}

export interface RenderState {
  sites: RenderStateSite[]; // the 6 X_K sites in loop order
  w1: number[]; // committed perCycleW1 ([1])
  seamEdges: Array<{ a: string; b: string }>; // the committed U_e=−1 flip edges, joined to siteIds
  windingSign: Sign | null; // committed ∏U (−1)
}

// The falsifiable first render-state. Builds F0 ONCE and joins the committed per-site output
// to THIS F0 instance's positions by id (so the join never crosses two ambo builds). Every
// field is engine-derived + the app position; nothing here recomputes w₁/gauge/director.
export function buildKnownSeamRenderState(): RenderState {
  const form = buildKnownForm();
  const seam = buildKnownSeam(form);

  // the per-site orientation 2-colouring = the committed director transported round the loop.
  const cycle = cycleGraph(6);
  const orientations = transportDirector(cycle, seam.edgeSigns, LOOP).orientations;

  const sites: RenderStateSite[] = seam.orderedSiteIds.map((siteId, i) => {
    const vtx = form.F0.vertices[siteId];
    if (!vtx) throw new Error(`witnessBridge: X_K site ${siteId} has no F0 position — join failed`);
    const sf = seam.siteFrames[i];
    const o = orientations[i];
    return {
      siteId,
      position: vtx.position,
      parents: sf.parents,
      siteKey: seam.siteKeys[i],
      directorAxis: sf.nSite,
      axisLabel: sf.axisLabel,
      orientationSign: o < 0 ? -1 : 1,
    };
  });

  // the seam: the committed flip edges (loop indices) joined to the X_K siteIds they connect.
  const seamEdges = seam.witness.flipEdges.map(({ a, b }) => ({
    a: seam.orderedSiteIds[a],
    b: seam.orderedSiteIds[b],
  }));

  return { sites, w1: seam.perCycleW1, seamEdges, windingSign: seam.windingSign };
}
