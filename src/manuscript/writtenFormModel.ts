// writtenFormModel — Manuscript Phase 3a: the react-free model of WRITTEN
// material (forms the reader adds to the page: invoked primitives + op-born
// forms). The acceptance diagnostic requires THIS module through the anti-mock
// hook; ManuscriptView consumes it verbatim.
//
// THE REAL-TRANSFORMS GUARD (the law, this phase's face): nothing here mocks a
// move. INVOKE loads the committed primitive (`PRIMITIVE_CATALOGUE`/`nGon` via
// the committed `loadForm`, uniquely namespaced per invocation). An OPERATION
// is the committed `PlaygroundOperation` contract VERBATIM — `canApply` gates,
// `getDisabledReason` speaks, `execute` births — the SAME registry entries the
// playground runs (`getPlaygroundOperation`); this module neither imports nor
// reimplements any surface op. The canonical op target is the form's FIRST
// face (single-face invoked primitives have exactly one; on multi-face forms
// the committed eligibility gates speak for themselves — e.g. chaining onto a
// born quotient face runs the COMPOSED word per the Q-M2 unfreeze, and its
// exception paths refuse with the committed reasons).
//
// A born form's RENDER is routed by the committed `routeBornForm` (replay-
// verified against the parent — a stale id never routes):
//   'immersion' → the full Phase-1.5 inked-form model (buildInkedFormModel):
//                 real subdivision, certified generators, certified cores;
//   'direct'    → the cut-born skeleton (real pass-through positions,
//                 level-1 certified H₁) — the 2a dim-1 path;
//   plain       → forms with REAL constructed positions and no immersion route
//                 (invoked primitives; dual-born shapes — surfaceDual mints
//                 real barycentric positions): body + edges in ink, NO loop
//                 marks (drawing a certified representative set on arbitrary
//                 operated complexes is the researcher's standing Option-B
//                 item — the specimen card still reads the certified values).
//                 A NON-MANIFOLD plain form (the certifier's own 'non-manifold'
//                 boundary reading) additionally carries the classifier's
//                 junction edge ids so the render MARKS the flaw (P-IMMERSE §5
//                 — the construction shows its junction, never a fake body).
//   'patch'/'raw' routes (minted quotient positions — never render geometry):
//                 P-IMMERSE — the ABSTAIN falls. These forms' invariants ARE
//                 certified (the direct bridge or the replay-verified
//                 recovery), so they route to the CLASS BODY: classify from
//                 the committed certificates, build a self-certifying
//                 standard body, draw the committed Option-B generators ON
//                 the body (count === certified b₁). Refusals (non-manifold /
//                 unclassifiable / un-certified) throw the classifier's
//                 honest reason verbatim — surfaced by the chrome, never a
//                 fabricated class, never bookkeeping positions drawn.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import; playgroundOperations /
// bornFormRouting / InkedForm / certifiers stay byte-unchanged.

import type { Shape } from '../types/geometry';
import { loadForm } from '../lib/multiform';
import { PRIMITIVE_CATALOGUE } from '../playground/primitiveCatalogue';
import {
  getPlaygroundOperation,
  PLAYGROUND_OPERATIONS,
  type PlaygroundOperationContext,
} from '../playground/playgroundOperations';
import { routeBornForm } from '../playground/bornFormRouting';
import { readFormInvariants, type FormInvariantsReadout } from '../playground/formInvariants';
import {
  buildInkedFormModel,
  h1LabelFromCertified,
  type InkedFormModel,
} from './inkedFormModel';
import { h1LabelFromLevel1 } from './worldModel';
import type { SpecimenReading } from './specimenModel';
import { buildClassBodyModel, type ClassBodyModel } from './classBodyModel';
import { acquireFaithfulComplex, readBoundary } from './surfaceClassifier';

export interface WrittenSkeletonModel {
  key: string;
  title: string;
  shape: Shape;
  invariants: FormInvariantsReadout;
  h1Label: string | null;
}

export type WrittenRender =
  | { mode: 'immersion'; model: InkedFormModel }
  | { mode: 'skeleton'; model: WrittenSkeletonModel }
  | {
      mode: 'plain';
      shape: Shape;
      invariants: FormInvariantsReadout;
      h1Label: string | null;
      junctionEdgeIds?: string[]; // present iff the certifier reads non-manifold — the render marks these
    }
  | { mode: 'classBody'; model: ClassBodyModel }; // P-IMMERSE — the honest representative body

export interface WrittenForm {
  id: string; // the manuscript-side handle (w<seq>)
  title: string;
  shape: Shape; // the REAL committed Shape (invoked or born) — never a mock
  parentShape: Shape | null; // the op source (null for invoked primitives)
  opId: string | null; // the committed operation id that birthed it (null = invoked)
  provenance: string; // human line for the card ("invoked primitive" / the op label)
  render: WrittenRender;
}

export const DOCK_OPERATION_GROUPS: ReadonlyArray<{
  key: string;
  label: string;
  operationIds: string[];
}> = [
  { key: 'glue', label: 'glue', operationIds: ['glue-torus', 'glue-cylinder'] },
  { key: 'flip-glue', label: 'flip-glue', operationIds: ['flip-glue-klein', 'flip-glue', 'flip-glue-mobius'] },
  { key: 'collapse', label: 'collapse', operationIds: ['collapse-sphere'] },
  { key: 'cut', label: 'cut', operationIds: ['cut'] },
  { key: 'dualize', label: 'dualize', operationIds: ['dual'] },
  // the general complex identification's boundary sub-family (sanctioned,
  // 2026-07-11) — sew two rims of a COMPLEX (the word ops fold polygons)
  { key: 'sew', label: 'sew', operationIds: ['sew-boundary-preserving', 'sew-boundary-reversing'] },
];

const IMMERSION_TITLES: Record<string, string> = {
  torus: 'Torus (T²)',
  klein: 'Klein bottle (K²)',
  rp2: 'RP² (cross-cap)',
  sphere: 'Sphere (S²)',
  cylinder: 'Cylinder',
  mobius: 'Möbius band',
};

// ---------------------------------------------------------------------------
// invoke — the committed primitive joins the page (real material)
// ---------------------------------------------------------------------------

export function invokePrimitive(catalogueKey: string, seq: number): WrittenForm {
  const entry = PRIMITIVE_CATALOGUE.find((e) => e.key === catalogueKey);
  if (!entry) {
    throw new Error(`writtenFormModel: unknown primitive "${catalogueKey}"`);
  }
  // unique source namespace per invocation — two invoked squares stay DISTINCT
  // universes (the committed co-location ≠ identity discipline)
  const shape = loadForm(entry.build, `w${seq}`);
  const invariants = readFormInvariants(shape);
  return {
    id: `w${seq}`,
    title: `${entry.label} — invoked`,
    shape,
    parentShape: null,
    opId: null,
    provenance: 'invoked primitive (right-click on paper)',
    render: { mode: 'plain', shape, invariants, h1Label: h1LabelFromCertified(invariants) },
  };
}

// ---------------------------------------------------------------------------
// the committed operation application (the SAME contract the playground runs)
// ---------------------------------------------------------------------------

// the canonical manuscript op target: the form's first face (see header).
// REGISTRY UNBOUNDING (mothership-required, 2026-07-11): the context carries
// the form's FULL REAL lineage where the caller resolved one (the view walks
// it over the page's own shapes) — the acquisition chain then reaches every
// generation; `parentShape` stays the immediate parent (gen-1 byte-identical).
export function operationContextFor(
  shape: Shape,
  parentShape: Shape | null,
  ancestry?: Shape[],
): PlaygroundOperationContext {
  const face = shape.faces[0] ?? null;
  return {
    form: shape,
    selectedFaceId: face ? face.id : null,
    selectedFace: face,
    parentShape,
    ...(ancestry ? { ancestry } : {}),
  };
}

export interface OperationAvailability {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  reason: string | null; // the committed getDisabledReason, verbatim
}

export function operationAvailabilityFor(
  shape: Shape | null,
  parentShape: Shape | null,
  ancestry?: Shape[],
): OperationAvailability[] {
  return PLAYGROUND_OPERATIONS.map((op) => {
    if (!shape) {
      return { id: op.id, label: op.label, description: op.description, enabled: false, reason: 'Select a form first.' };
    }
    const context = operationContextFor(shape, parentShape, ancestry);
    const enabled = op.canApply(context);
    return {
      id: op.id,
      label: op.label,
      description: op.description,
      enabled,
      reason: enabled ? null : op.getDisabledReason(context),
    };
  });
}

export type ApplyResult =
  | { ok: true; born: WrittenForm }
  | { ok: false; reason: string };

export function applyPlaygroundOperationTo(
  operationId: string,
  targetShape: Shape,
  targetParent: Shape | null,
  seq: number,
  resolution: number,
  targetAncestry?: Shape[],
): ApplyResult {
  const operation = getPlaygroundOperation(operationId); // the committed registry — throws on unknown ids
  const context = operationContextFor(targetShape, targetParent, targetAncestry);
  if (!operation.canApply(context)) {
    return { ok: false, reason: operation.getDisabledReason(context) ?? 'Not applicable to this form.' };
  }
  let bornShape: Shape;
  let render: WrittenRender;
  // the born child's ancestry = its target plus the target's own lineage —
  // the render/certification acquisition then reaches every generation
  const bornAncestry = [targetShape, ...(targetAncestry ?? (targetParent ? [targetParent] : []))];
  try {
    bornShape = operation.execute(context); // ← THE COMMITTED CALL, verbatim
    render = routeWrittenRender(bornShape, bornAncestry, resolution);
  } catch (error) {
    // a contract surprise (canApply true but the engine refused) surfaces
    // verbatim — fail-honest in the chrome, never a crash, never a mock
    return { ok: false, reason: error instanceof Error ? error.message : String(error) };
  }
  const title =
    render.mode === 'immersion'
      ? `${IMMERSION_TITLES[render.model.surface] ?? render.model.surface} — born`
      : render.mode === 'skeleton'
        ? 'Skeleton — cut-born'
        : render.mode === 'classBody'
          ? `${render.model.components.map((c) => c.label).join(' + ')} — born`
          : `${operation.label.split(' ')[0]} — born`;
  return {
    ok: true,
    born: {
      id: `w${seq}`,
      title,
      shape: bornShape,
      parentShape: targetShape,
      opId: operationId,
      provenance: operation.label,
      render,
    },
  };
}

// ---------------------------------------------------------------------------
// render routing — the committed routeBornForm decides; we refuse bookkeeping
// ---------------------------------------------------------------------------

export function routeWrittenRender(
  born: Shape,
  parent: Shape | Shape[] | null,
  resolution: number,
): WrittenRender {
  // REGISTRY UNBOUNDING (2026-07-11): `parent` widens additively to the born
  // form's REAL lineage (immediate parent first). The committed one-hop
  // consumers (routeBornForm's replay) take the direct parent exactly as
  // before; the acquisition consumers take the whole chain.
  const lineage = parent === null ? [] : Array.isArray(parent) ? parent : [parent];
  const directParent = lineage.find((s) => s.id === born.genealogy.parentShapeId) ?? null;
  const route = routeBornForm(born, directParent);
  if (route.kind === 'immersion') {
    // the committed replay-verified word → the full certified inked model
    return { mode: 'immersion', model: buildInkedFormModel({ surface: route.surface, resolution }) };
  }
  if (route.kind === 'direct' && born.faces.length === 0) {
    // the cut-born skeleton: real pass-through positions, level-1 H₁
    const invariants = readFormInvariants(born, lineage);
    return {
      mode: 'skeleton',
      model: {
        key: born.id,
        title: 'Skeleton — cut-born',
        shape: born,
        invariants,
        h1Label: h1LabelFromLevel1(invariants),
      },
    };
  }
  // real constructed positions (dual-born; direct with faces) → plain ink
  // (surfaceDual writes operation 'dualization' with REAL barycentric positions)
  if (route.kind === 'direct' || born.genealogy.operation === 'dualization' || born.genealogy.operation === 'seed') {
    // the lineage rides into the readout (a bridge-refused CUT child certifies
    // through the chain; direct-readable forms read identically to before)
    const invariants = readFormInvariants(born, lineage);
    // P-IMMERSE §5: a non-manifold construction renders ITSELF (real positions)
    // with its junction edge classes MARKED — the classifier's own slot reading
    // names them; a form whose complex cannot even bridge simply carries none.
    let junctionEdgeIds: string[] | undefined;
    if (invariants.boundary === 'non-manifold') {
      const acquired = acquireFaithfulComplex(born, lineage);
      if (acquired) {
        const ids = readBoundary(acquired.complex).junctionEdgeIds;
        if (ids.length > 0) junctionEdgeIds = ids;
      }
    }
    return {
      mode: 'plain',
      shape: born,
      invariants,
      h1Label: h1LabelFromCertified(invariants),
      ...(junctionEdgeIds ? { junctionEdgeIds } : {}),
    };
  }
  // 'patch' / 'raw': minted quotient positions — bookkeeping, never geometry.
  // P-IMMERSE: the ABSTAIN falls — the form's invariants are still CERTIFIED
  // (recovered/direct complex), so it gets the honest CLASS BODY: classify
  // from the committed certificates, build the self-certifying representative,
  // draw the committed Option-B generators on it. Where the classifier refuses
  // (non-manifold / unclassifiable χ / un-certified) the refusal throws
  // verbatim and the chrome surfaces it — never a fabricated class, never
  // bookkeeping positions drawn.
  return { mode: 'classBody', model: buildClassBodyModel(born, lineage) };
}

// ---------------------------------------------------------------------------
// the specimen reading for plain written forms (invoked / dual-born)
// ---------------------------------------------------------------------------

export function readPlainSpecimen(
  title: string,
  provenance: string,
  invariants: FormInvariantsReadout,
  h1Label: string | null,
): SpecimenReading {
  // the χ row never over-claims: "(certified)" only when the certifier AGREES
  // with the explicit-cell count; where they differ (e.g. an assemble child,
  // whose explicit cells carry the minted merge supports alongside the carried
  // originals) BOTH numbers show, each named
  const chiValue =
    invariants.chiCertified === null
      ? `${invariants.chi}`
      : invariants.chiCertified === invariants.chi
        ? `${invariants.chi} (certified)`
        : `${invariants.chi} explicit · ${invariants.chiCertified} certified`;
  return {
    kind: 'surface',
    title,
    subtitle: provenance,
    rows: [
      { label: 'Euler χ', value: chiValue },
      { label: 'orientable', value: invariants.cert ? (invariants.cert.nonOrientable ? 'no' : 'yes') : 'n-a' },
      { label: 'class', value: invariants.classification },
      { label: 'w₁ class', value: invariants.cert ? `[${invariants.cert.w1Class.join(', ')}]` : 'n-a' },
      { label: 'H₁', value: h1Label ?? 'n-a', emphasize: true },
    ],
    legend: [], // no loop marks on plain renders (Option-B representative drawing — flagged, not faked)
    twist:
      invariants.cert && invariants.cert.nonOrientable
        ? 'w₁ = 1 — non-orientable (the twist)'
        : null,
  };
}
