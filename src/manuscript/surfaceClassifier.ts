// surfaceClassifier — P-IMMERSE Build (a): the structured surface CLASS derived
// from the committed certifiers, plus the ONE measurement the repo lacked — the
// BOUNDARY-COMPONENT COUNT (mandate §2: "the missing discriminator").
//
// WHAT IS DERIVED vs WHAT IS MEASURED (the honest split):
//   · χ, orientability (w₁), b₁ — READ from the committed `analyzeGlobalW1`
//     certificate per connected component; never recomputed here.
//   · the boundary-circle count `b` — MEASURED here (NEW): the free 1-skeleton
//     (edges in exactly one face slot) must decompose into disjoint circles
//     (every incident vertex free-degree 2), counted by union-find. A free
//     skeleton that is NOT disjoint circles is refused, never rounded.
//   · genus g / cross-cap k — ARITHMETIC on the certified (χ, w₁, b), the
//     mandate's table: closed g=(2−χ)/2, k=2−χ; bounded g=(2−b−χ)/2, k=2−b−χ.
//     A χ that does not fit (negative / non-integral g·k) refuses — never a
//     fabricated class. The certified b₁ is CROSS-CHECKED against the class
//     (closed: 2g / k over 𝔽₂; bounded: 1−χ) — any disagreement refuses.
//
// THE GATES (instruments, not guards — committed instruments run, we read):
//   · edge slots: an edge in >2 face slots is a JUNCTION — refused with the
//     offending edge classes NAMED (the render marks them; no manifold body).
//   · vertex links: the committed `decomposeLink` at every vertex — 'interior'
//     or 'boundary' pass; 'junction' (branch or pinch) refuses with the vertex
//     named. This is what keeps an even-χ wedge (two tori sharing a point,
//     χ=−2) from masquerading as genus 2: (χ, w₁, b) alone cannot see a pinch;
//     the committed link gate can.
//
// THE FAITHFUL COMPLEX is acquired exactly as the committed readout acquires
// it (formInvariants' two routes, via exported committed machinery): the
// direct bridge `toAssembledComplex` (its equivalence to formInvariants'
// private `tryDirectComplex` is already diagnostic-asserted), else the
// replay-verified `recoverBornSurface` — a stale or foreign form never
// classifies. DISCONNECTED forms split into components FIRST and classify
// per component (the whole-form classification string assumes connectivity —
// mandate §5 honest flag).
//
// DERIVE-ONLY · ADDITIVE: committed modules by import; the certifiers, the
// link gate, the bridge, and the recovery stay byte-unchanged.

import type { Shape } from '../types/geometry';
import { analyzeGlobalW1, type AssembledComplex, type GlobalW1Cert } from '../lib/globalW1';
import { decomposeLink } from '../lib/incidenceTraceRegistry';
import { recoverBornSurface } from '../playground/bornFormRouting';
import { toAssembledComplex } from './inkedFormModel';

// ---------------------------------------------------------------------------
// the faithful complex — the committed acquisition, re-expressed
// ---------------------------------------------------------------------------

export type ComplexSource = 'direct' | 'recovered';

export function acquireFaithfulComplex(
  shape: Shape,
  parent: Shape | null,
): { complex: AssembledComplex; source: ComplexSource } | null {
  try {
    return { complex: toAssembledComplex(shape), source: 'direct' };
  } catch {
    // quotient forms fail the direct bridge by design — try the committed
    // replay-verified recovery (parsed birth word, byte-compared replay)
  }
  const recovery = recoverBornSurface(shape, parent);
  if (recovery) return { complex: recovery.materialized.complex, source: 'recovered' };
  return null;
}

// ---------------------------------------------------------------------------
// component split (faces follow their boundary edges; edges their endpoints)
// ---------------------------------------------------------------------------

function makeUnionFind() {
  const parent = new Map<string, string>();
  const find = (x: string): string => {
    if (!parent.has(x)) parent.set(x, x);
    let root = x;
    while (parent.get(root) !== root) root = parent.get(root) as string;
    let cursor = x;
    while (parent.get(cursor) !== root) {
      const next = parent.get(cursor) as string;
      parent.set(cursor, root);
      cursor = next;
    }
    return root;
  };
  const union = (a: string, b: string): void => {
    parent.set(find(a), find(b));
  };
  return { find, union };
}

export function splitComplexComponents(complex: AssembledComplex): AssembledComplex[] {
  const { find, union } = makeUnionFind();
  for (const v of complex.vertices) find(v);
  for (const e of complex.edges) union(e.u, e.v);
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  const componentOfRoot = new Map<string, { vertices: string[]; edges: typeof complex.edges; faces: AssembledComplex['faces'] }>();
  const componentFor = (root: string) => {
    let c = componentOfRoot.get(root);
    if (!c) {
      c = { vertices: [], edges: [], faces: [] };
      componentOfRoot.set(root, c);
    }
    return c;
  };
  for (const v of complex.vertices) componentFor(find(v)).vertices.push(v);
  for (const e of complex.edges) componentFor(find(e.u)).edges.push(e);
  for (const f of complex.faces) {
    const firstSlot = f.boundary[0];
    if (!firstSlot) continue; // a slot-less face cannot be attached — the per-component face check refuses downstream
    const edge = edgeById.get(firstSlot.edge);
    if (!edge) continue;
    componentFor(find(edge.u)).faces.push(f);
  }
  return [...componentOfRoot.values()];
}

// ---------------------------------------------------------------------------
// the NEW measurement — boundary reading (slot counts + circle count)
// ---------------------------------------------------------------------------

export interface BoundaryReading {
  freeEdgeIds: string[]; // edges in exactly one face slot (the free 1-skeleton)
  junctionEdgeIds: string[]; // edges in >2 face slots — non-manifold incidence
  circles: number; // boundary components (disjoint free circles)
  circlesAreDisjoint: boolean; // every free-skeleton vertex has free-degree exactly 2
}

export function readBoundary(complex: AssembledComplex): BoundaryReading {
  const slotCount = new Map<string, number>();
  for (const edge of complex.edges) slotCount.set(edge.id, 0);
  for (const face of complex.faces) {
    for (const slot of face.boundary) {
      slotCount.set(slot.edge, (slotCount.get(slot.edge) ?? 0) + 1);
    }
  }
  const freeEdges = complex.edges.filter((e) => (slotCount.get(e.id) ?? 0) < 2);
  const junctionEdgeIds = complex.edges.filter((e) => (slotCount.get(e.id) ?? 0) > 2).map((e) => e.id);
  const { find, union } = makeUnionFind();
  const freeDegree = new Map<string, number>();
  for (const e of freeEdges) {
    union(e.u, e.v);
    freeDegree.set(e.u, (freeDegree.get(e.u) ?? 0) + 1);
    freeDegree.set(e.v, (freeDegree.get(e.v) ?? 0) + 1);
  }
  return {
    freeEdgeIds: freeEdges.map((e) => e.id),
    junctionEdgeIds,
    circles: new Set(freeEdges.map((e) => find(e.u))).size,
    circlesAreDisjoint: [...freeDegree.values()].every((d) => d === 2),
  };
}

// ---------------------------------------------------------------------------
// the committed vertex-link gate over the complex (the P2 diagnostic idiom)
// ---------------------------------------------------------------------------

// every vertex link through the committed decomposeLink: 'interior' or
// 'boundary' pass; 'junction' (branch/pinch) and 'no-context' (an isolated
// vertex in a face-carrying complex) are named and fail the manifold claim.
// The link nodes are EDGE-ENDS, never bare edge ids — the committed level-2/
// level-3 lesson (END classes): a quotient LOOP edge (u === v, the recovered
// single-vertex complexes) has TWO distinct ends at its vertex, and keying by
// edge id would fuse them, misreading a legal circle link as a junction.
export function vertexLinkVerdicts(complex: AssembledComplex): Map<string, string> {
  const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
  const adjacencyOf = new Map<string, Map<string, string[]>>();
  const ensure = (v: string): Map<string, string[]> => {
    let m = adjacencyOf.get(v);
    if (!m) {
      m = new Map();
      adjacencyOf.set(v, m);
    }
    return m;
  };
  for (const v of complex.vertices) ensure(v);
  const push = (v: string, a: string, b: string): void => {
    const m = ensure(v);
    m.set(a, [...(m.get(a) ?? []), b]);
    m.set(b, [...(m.get(b) ?? []), a]);
  };
  for (const face of complex.faces) {
    const n = face.boundary.length;
    for (let k = 0; k < n; k += 1) {
      const here = face.boundary[k];
      const next = face.boundary[(k + 1) % n];
      const hereEdge = edgeById.get(here.edge);
      const nextEdge = edgeById.get(next.edge);
      if (!hereEdge || !nextEdge) continue;
      // the corner between slot k and slot k+1 = head(slot k) = tail(slot k+1);
      // the wedge joins slot k's HEAD end to slot k+1's TAIL end
      const corner = here.dir === 1 ? hereEdge.v : hereEdge.u;
      const hereEnd = `${here.edge}#${here.dir === 1 ? 'v' : 'u'}`;
      const nextEnd = `${next.edge}#${next.dir === 1 ? 'u' : 'v'}`;
      push(corner, hereEnd, nextEnd);
    }
  }
  const verdicts = new Map<string, string>();
  for (const [v, adjacency] of adjacencyOf) {
    verdicts.set(v, decomposeLink(adjacency).valence);
  }
  return verdicts;
}

// ---------------------------------------------------------------------------
// the structured class (mandate §2)
// ---------------------------------------------------------------------------

export interface SurfaceClass {
  kind: 'orientable' | 'non-orientable';
  g?: number; // orientable: genus
  k?: number; // non-orientable: cross-caps
  b: number; // boundary circles (the NEW counter's value)
  chi: number; // the certified χ the class was derived from
  b1: number; // the certified b₁ (𝔽₂)
}

export function classLabel(cls: SurfaceClass): string {
  const closed = cls.b === 0;
  const body = cls.kind === 'orientable' ? `genus ${cls.g}` : `${cls.k} cross-cap${cls.k === 1 ? '' : 's'}`;
  return closed ? body : `${body} · ${cls.b} boundary circle${cls.b === 1 ? '' : 's'}`;
}

export type ComponentClassification =
  | { ok: true; class: SurfaceClass; cert: GlobalW1Cert; complex: AssembledComplex }
  | { ok: false; reason: string; junctionEdgeIds?: string[]; junctionVertexIds?: string[] };

export function classifyComplexComponent(complex: AssembledComplex): ComponentClassification {
  if (complex.faces.length === 0) {
    return { ok: false, reason: 'no 2-cells — not a surface complex (a 1-complex reads level-1, not a class body)' };
  }
  const boundary = readBoundary(complex);
  if (boundary.junctionEdgeIds.length > 0) {
    return {
      ok: false,
      reason: `non-manifold edge incidence — junction edge class${boundary.junctionEdgeIds.length === 1 ? '' : 'es'} [${boundary.junctionEdgeIds.join(', ')}] carry >2 face wedges; no manifold body exists (the construction renders with the junction marked, never a fake body)`,
      junctionEdgeIds: boundary.junctionEdgeIds,
    };
  }
  const linkVerdicts = vertexLinkVerdicts(complex);
  const junctionVertexIds = [...linkVerdicts.entries()]
    .filter(([, valence]) => valence !== 'interior' && valence !== 'boundary')
    .map(([v]) => v);
  if (junctionVertexIds.length > 0) {
    return {
      ok: false,
      reason: `non-manifold vertex link — the committed gate reads [${junctionVertexIds.join(', ')}] as junction/pinch (χ·w₁·b cannot see a wedge point; the link gate can); no manifold body exists`,
      junctionVertexIds,
    };
  }
  if (!boundary.circlesAreDisjoint) {
    return {
      ok: false,
      reason: 'the free 1-skeleton is not a disjoint union of circles — the boundary count is undefined, refusing to classify',
    };
  }
  const b = boundary.circles;
  const { cert, debug } = analyzeGlobalW1(complex); // ← the committed certifier, verbatim
  const chi = debug.euler;
  const kind: SurfaceClass['kind'] = cert.nonOrientable ? 'non-orientable' : 'orientable';

  let cls: SurfaceClass;
  if (kind === 'orientable') {
    const twoG = 2 - b - chi;
    if (twoG < 0 || twoG % 2 !== 0) {
      return { ok: false, reason: `χ=${chi} with b=${b} is inconsistent with an orientable surface (2−b−χ = ${twoG} is not a non-negative even genus doubling) — n-a, no fabricated class` };
    }
    cls = { kind, g: twoG / 2, b, chi, b1: cert.b1 };
  } else {
    const k = 2 - b - chi;
    if (k < 1) {
      return { ok: false, reason: `χ=${chi} with b=${b} is inconsistent with a non-orientable surface (2−b−χ = ${k} < 1 cross-caps) — n-a, no fabricated class` };
    }
    cls = { kind, k, b, chi, b1: cert.b1 };
  }
  // the certified-b₁ cross-check: closed orientable 2g · closed non-orientable k
  // (𝔽₂) · bounded 1−χ (a bounded surface retracts to a wedge of b₁ circles)
  const expectedB1 = b === 0 ? (kind === 'orientable' ? 2 * (cls.g as number) : (cls.k as number)) : 1 - chi;
  if (cert.b1 !== expectedB1) {
    return {
      ok: false,
      reason: `certified b₁=${cert.b1} disagrees with the class arithmetic (${expectedB1} for ${classLabel(cls)}) — internal inconsistency, refusing to classify`,
    };
  }
  return { ok: true, class: cls, cert, complex };
}

// ---------------------------------------------------------------------------
// the form-level entry: acquire → split → classify per component
// ---------------------------------------------------------------------------

export interface ClassifiedComponent {
  class: SurfaceClass;
  cert: GlobalW1Cert;
  complex: AssembledComplex;
}

export type FormClassification =
  | { ok: true; complexSource: ComplexSource; components: ClassifiedComponent[] }
  | { ok: false; reason: string; junctionEdgeIds?: string[]; junctionVertexIds?: string[] };

export function classifyForm(shape: Shape, parent: Shape | null = null): FormClassification {
  const acquired = acquireFaithfulComplex(shape, parent);
  if (!acquired) {
    return {
      ok: false,
      reason: 'no faithful complex — the direct bridge refuses and no replay-verified recovery exists; w₁/b₁ are un-certified, so no class (and no body) can be claimed',
    };
  }
  const components = splitComplexComponents(acquired.complex);
  const classified: ClassifiedComponent[] = [];
  for (const component of components) {
    const verdict = classifyComplexComponent(component);
    if (!verdict.ok) {
      const scope = components.length > 1 ? ` (component ${classified.length + 1} of ${components.length})` : '';
      return { ...verdict, reason: `${verdict.reason}${scope}` };
    }
    classified.push({ class: verdict.class, cert: verdict.cert, complex: verdict.complex });
  }
  if (classified.length === 0) {
    return { ok: false, reason: 'the complex has no components — nothing to classify' };
  }
  return { ok: true, complexSource: acquired.source, components: classified };
}
