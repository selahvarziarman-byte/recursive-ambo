// classBodyModel — P-IMMERSE Build (c): the classify → body → generators map.
// This is the module that KILLS THE ABSTAIN: a form whose positions are
// quotient bookkeeping (the old routeWrittenRender THROW) but whose invariants
// ARE certified now gets an honest body —
//
//   form → committed certificates (per component) → `SurfaceClass`
//        → the standard body (self-certified, standardBodies)
//        → the COMMITTED `deriveOptionBGenerators(body)` — the drawn loops are
//          the certifier's own basis on the body, count === certified b₁
//        → one render model, per connected component.
//
// THE HONEST FRAME (mandate §4, stated on the card): the body is a CHOSEN
// REPRESENTATIVE of the form's certified class — the committed doctrine ("the
// immersion is a chosen representative, never THE object"). The form's OWN
// cells are NOT laid on it (that is the deferred §7 enhancement). The specimen
// card reads the FORM's OWN certified invariants (`readFormInvariants` on the
// form, not the body); the body's certificates live in the guard.
//
// HONEST FLAGS (mandate §5) carried verbatim from the classifier as THROWN
// refusals — non-manifold (junction edges/vertices named — no fake body),
// no-faithful-complex (un-certified — no class), inconsistent χ (no
// fabricated class). DISCONNECTED forms classify and render PER COMPONENT,
// each on its own body, offset side by side.
//
// DERIVE-ONLY · ADDITIVE: committed modules by import; Option B, the
// certifiers, and the renderers stay byte-unchanged.

import type { Shape, Vec3 } from '../types/geometry';
import { readFormInvariants, type FormInvariantsReadout } from '../playground/formInvariants';
import { deriveOptionBGenerators, type OptionBReading } from './optionBModel';
import {
  classifyForm,
  classLabel,
  type ComplexSource,
  type SurfaceClass,
} from './surfaceClassifier';
import { buildClassBody } from './standardBodies';
import type { SpecimenReading } from './specimenModel';

export const CLASS_BODY_FRAME =
  'the body is a chosen representative of the certified class — the form’s own cells are not laid on it';

// component bodies sit side by side after normalization (radius 3.2 each)
const COMPONENT_SPREAD = 7.4;

export interface ClassBodyComponentModel {
  class: SurfaceClass;
  label: string; // classLabel(class) — e.g. "genus 2" / "3 cross-caps · 1 boundary circle"
  body: Shape; // the positioned self-certified representative
  optionB: OptionBReading; // the committed certified basis ON THE BODY (count === b₁)
  offset: Vec3; // placement within the form's group (multi-component spread)
}

export interface ClassBodyModel {
  formInvariants: FormInvariantsReadout; // the FORM's own certified readout (the card)
  complexSource: ComplexSource;
  components: ClassBodyComponentModel[]; // ≥1 — one body per connected component
  h1Label: string | null; // classification arithmetic per component, ⊕-joined
  frame: string; // the honest-representative sentence (stated in the UI)
}

// H₁ as classification arithmetic on the STRUCTURED class (the same arithmetic
// h1LabelFromCertified applies, expressed per component so disconnected forms
// read the direct sum honestly instead of the connectivity-blind whole-form row)
export function classH1Label(cls: SurfaceClass): string {
  if (cls.b > 0) {
    if (cls.b1 === 0) return '0';
    return Array.from({ length: cls.b1 }, () => 'ℤ').join(' ⊕ ');
  }
  if (cls.kind === 'orientable') {
    const rank = 2 * (cls.g as number);
    if (rank === 0) return '0';
    return Array.from({ length: rank }, () => 'ℤ').join(' ⊕ ');
  }
  const k = cls.k as number;
  return [...Array.from({ length: k - 1 }, () => 'ℤ'), 'ℤ/2'].join(' ⊕ ');
}

// deterministic short namespace from the form id (body ids must not collide
// across forms; snapshot/loadForm key-safety wants a tame alphabet)
function bodyNamespace(formId: string): string {
  let h = 5381;
  for (let i = 0; i < formId.length; i += 1) h = ((h << 5) + h + formId.charCodeAt(i)) >>> 0;
  return `clsbody-${h.toString(36)}`;
}

export function buildClassBodyModel(shape: Shape, parent: Shape | null): ClassBodyModel {
  const classification = classifyForm(shape, parent);
  if (!classification.ok) {
    // the honest flags, verbatim — the chrome surfaces this reason (§5:
    // never a fake body, never a fabricated class)
    throw new Error(`classBodyModel: ${classification.reason}`);
  }
  const ns = bodyNamespace(shape.id);
  const n = classification.components.length;
  const components = classification.components.map((component, index) => {
    const body = buildClassBody(component.class, `${ns}-c${index}`); // ← self-certifying (guarded)
    const optionB = deriveOptionBGenerators(body); // ← the committed generators, verbatim
    if (optionB.b1 !== component.class.b1) {
      throw new Error(
        `classBodyModel: the body's certified b₁=${optionB.b1} differs from the component's certified b₁=${component.class.b1} — refusing to draw`,
      );
    }
    return {
      class: component.class,
      label: classLabel(component.class),
      body,
      optionB,
      offset: [(index - (n - 1) / 2) * COMPONENT_SPREAD, 0, 0] as Vec3,
    };
  });
  return {
    formInvariants: readFormInvariants(shape, parent), // the FORM's own card values
    complexSource: classification.complexSource,
    components,
    h1Label: components.map((c) => classH1Label(c.class)).join(' ⊕ '),
    frame: CLASS_BODY_FRAME,
  };
}

// ---------------------------------------------------------------------------
// the specimen reading (the card) — the FORM's own certified invariants + the
// honest frame + the body's drawn generators named
// ---------------------------------------------------------------------------

export function readClassBodySpecimen(
  title: string,
  provenance: string,
  model: ClassBodyModel,
): SpecimenReading {
  const inv = model.formInvariants;
  const chiValue =
    inv.chiCertified === null
      ? `${inv.chi}`
      : inv.chiCertified === inv.chi
        ? `${inv.chi} (certified)`
        : `${inv.chi} explicit · ${inv.chiCertified} certified`;
  const single = model.components.length === 1;
  return {
    kind: 'surface',
    title,
    subtitle: `${provenance} · class body (${model.complexSource})`,
    rows: [
      { label: 'Euler χ', value: chiValue },
      { label: 'orientable', value: inv.cert ? (inv.cert.nonOrientable ? 'no' : 'yes') : 'n-a' },
      {
        label: single ? 'class' : `class (${model.components.length} components)`,
        value: model.components.map((c) => c.label).join(' + '),
      },
      {
        label: 'boundary circles',
        value: model.components.map((c) => `${c.class.b}`).join(' + '), // ← the NEW counter's row
      },
      { label: 'w₁ class', value: inv.cert ? `[${inv.cert.w1Class.join(', ')}]` : 'n-a' },
      { label: 'H₁', value: model.h1Label ?? 'n-a', emphasize: true },
      { label: 'body', value: 'chosen representative — not the form’s own cells' },
    ],
    legend: model.components.flatMap((component, ci) =>
      component.optionB.generators.map((generator, k) => ({
        key: single ? generator.label : `c${ci + 1}·${generator.label}`,
        text: `${single ? generator.label : `c${ci + 1}·${generator.label}`} — certified H₁ generator, drawn on the class body`,
        ink: (k % 2 === 0 ? 'a' : 'b') as 'a' | 'b',
      })),
    ),
    twist:
      inv.cert && inv.cert.nonOrientable ? 'w₁ = 1 — non-orientable (the twist)' : null,
  };
}
