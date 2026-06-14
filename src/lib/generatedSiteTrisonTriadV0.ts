// generatedSiteTrisonTriadV0 — geometry → Trison triad bridge.
//
// Derives, from the ACTUAL one-Ambo tetrahedron generated sites, the local
// Trison triad (combined-J; A, B) for each generated edge-child, with
// provenance, and converts it into the Pkt-3 frame input so the excavation
// frame receives LIVE inputs instead of abstract strings.
//
// CAL-1 (binding derivation rule) for a child born on edge XY:
//   parents A = X, B = Y (the edge endpoints);
//   combined J = the opposite edge — the two vertices NOT on XY, combined into
//   ONE projection source (the complement edge / its midpoint).
//
// Scope: one-Ambo tetrahedron only (the 6 children M_AB..M_CD), matching
// generatedSiteReadingV0's scope. Deeper generations / other seeds are a later
// mandate.
//
// Honesty: the triad is DERIVED from the real geometry — no hardcoded 6-row
// triad table. The opposite edge is computed as the two original vertices not
// in the child's edge over the actual ambo output, so it would still be correct
// if the geometry changed. The derived site set is cross-checked against
// generatedSiteReadingV0's real readings; mismatches are recorded as issues.
// This module consumes existing modules read-only; it edits none of them.

import type { Shape, VertexId } from '../types/geometry';
import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from './ambo';
import { buildGeneratedSiteReadingV0Report } from './generatedSiteReadingV0';
import type { TrisonizedMidwifeTriadInputV0 } from './trisonizedMidwifeReadingV0';

export const GENERATED_SITE_TRISON_TRIAD_METHOD_ID =
  'generated-site-trison-triad-v0' as const;
export type GeneratedSiteTrisonTriadScope = 'one-ambo-tetrahedron-only';
export type TrisonTriadLabelStatus =
  | 'all-primal-labeled'
  | 'partial'
  | 'unlabeled';

export interface TrisonTriadVertexRef {
  id: string; // vertex id from the real geometry
  label: string; // placed/seed label
}

// J = combined opposite edge (CAL-1): the two opposite vertices folded into one
// projection source.
export interface TrisonCombinedSublatedRef {
  components: TrisonTriadVertexRef[]; // the two opposite vertices [C, D]
  oppositeEdgeId: string; // canonical opposite-edge id, e.g. 'CD'
  oppositeMidpointId: string; // the opposite edge's midpoint child, e.g. 'M_CD'
  label: string; // combined v0 label, e.g. 'C∧D'
}

export interface GeneratedSiteTrisonTriadV0 {
  siteId: string; // the generated child, e.g. 'M_AB'
  parentA: TrisonTriadVertexRef;
  parentB: TrisonTriadVertexRef;
  sublatedJ: TrisonCombinedSublatedRef;
  provenance: {
    seed: 'tetrahedron';
    operation: 'ambo';
    generation: number; // 1 for one-Ambo
    edge: [string, string];
    oppositeEdge: [string, string];
  };
  labelStatus: TrisonTriadLabelStatus;
}

export interface GeneratedSiteTrisonTriadV0Report {
  methodId: typeof GENERATED_SITE_TRISON_TRIAD_METHOD_ID;
  scope: GeneratedSiteTrisonTriadScope;
  triads: GeneratedSiteTrisonTriadV0[]; // the 6 children, derived (not hardcoded)
  issues: string[];
}

const SCOPE: GeneratedSiteTrisonTriadScope = 'one-ambo-tetrahedron-only';
const COMBINED_J_GLUE = '∧';

function labelOf(shape: Shape, id: VertexId): string {
  const vertex = shape.vertices[id];

  return vertex ? vertex.data.label : '';
}

function toVertexRef(shape: Shape, id: VertexId): TrisonTriadVertexRef {
  return { id, label: labelOf(shape, id) };
}

function byLabel(a: TrisonTriadVertexRef, b: TrisonTriadVertexRef): number {
  return a.label.localeCompare(b.label);
}

function deriveLabelStatus(labels: string[]): TrisonTriadLabelStatus {
  if (labels.every((label) => label.length > 0)) {
    return 'all-primal-labeled';
  }

  if (labels.some((label) => label.length > 0)) {
    return 'partial';
  }

  return 'unlabeled';
}

// Derive the 6 one-Ambo tetrahedron triads from the real geometry.
export function buildGeneratedSiteTrisonTriadV0Report(): GeneratedSiteTrisonTriadV0Report {
  const issues: string[] = [];
  const amboShape = applyAmboDissection(createSeedShape('tetrahedron'));
  const generation = amboShape.genealogy.generationDepth;
  const originalVertexIds = amboShape.genealogy.sourceVertexIds;
  const childVertexIds = amboShape.genealogy.createdVertexIds;
  const triads: GeneratedSiteTrisonTriadV0[] = [];

  for (const childId of childVertexIds) {
    const child = amboShape.vertices[childId];

    if (!child) {
      issues.push(`missing created vertex ${childId}`);
      continue;
    }

    const edgeVertexIds = child.createdBy.sourceVertexIds;

    if (edgeVertexIds.length !== 2) {
      issues.push(
        `child ${childId} does not have a 2-vertex source edge (got ${edgeVertexIds.length})`,
      );
      continue;
    }

    const [endpointA, endpointB] = edgeVertexIds;
    const parents = [
      toVertexRef(amboShape, endpointA),
      toVertexRef(amboShape, endpointB),
    ].sort(byLabel);
    const [parentA, parentB] = parents;

    // Opposite edge (CAL-1): the original vertices NOT on this child's edge,
    // computed over the actual geometry — never a hardcoded lookup.
    const oppositeIds = originalVertexIds.filter(
      (id) => id !== endpointA && id !== endpointB,
    );

    if (oppositeIds.length !== 2) {
      issues.push(
        `child ${childId} (${parentA.label}${parentB.label}) opposite-edge derivation found ${oppositeIds.length} vertices, expected 2`,
      );
      continue;
    }

    const components = oppositeIds
      .map((id) => toVertexRef(amboShape, id))
      .sort(byLabel);
    const [oppositeC, oppositeD] = components;

    const siteId = `M_${parentA.label}${parentB.label}`;
    const oppositeEdgeId = `${oppositeC.label}${oppositeD.label}`;
    const oppositeMidpointId = `M_${oppositeC.label}${oppositeD.label}`;
    const combinedJLabel = `${oppositeC.label}${COMBINED_J_GLUE}${oppositeD.label}`;

    // J must never equal a parent (J is sublated, not a third parent).
    if (
      components.some(
        (component) =>
          component.id === parentA.id ||
          component.id === parentB.id ||
          component.label === parentA.label ||
          component.label === parentB.label,
      )
    ) {
      issues.push(
        `triad ${siteId}: combined J overlaps a parent (J must be sublated, not a parent)`,
      );
    }

    triads.push({
      siteId,
      parentA,
      parentB,
      sublatedJ: {
        components,
        oppositeEdgeId,
        oppositeMidpointId,
        label: combinedJLabel,
      },
      provenance: {
        seed: 'tetrahedron',
        operation: 'ambo',
        generation,
        edge: [parentA.id, parentB.id],
        oppositeEdge: [oppositeC.id, oppositeD.id],
      },
      labelStatus: deriveLabelStatus([
        parentA.label,
        parentB.label,
        oppositeC.label,
        oppositeD.label,
      ]),
    });
  }

  triads.sort((a, b) => a.siteId.localeCompare(b.siteId));

  // Cross-check the derived site set against the real generated-site source of
  // truth (generatedSiteReadingV0). Mismatches are honest issues, not silent.
  const realSiteIds = new Set<string>(
    buildGeneratedSiteReadingV0Report().readings.map((reading) => reading.siteId),
  );
  const derivedSiteIds = new Set<string>(triads.map((triad) => triad.siteId));

  for (const triad of triads) {
    if (!realSiteIds.has(triad.siteId)) {
      issues.push(
        `derived triad ${triad.siteId} is not in the generatedSiteReadingV0 site set`,
      );
    }

    if (!derivedSiteIds.has(triad.sublatedJ.oppositeMidpointId)) {
      issues.push(
        `triad ${triad.siteId}: opposite midpoint ${triad.sublatedJ.oppositeMidpointId} is not among the derived children`,
      );
    }
  }

  for (const realSiteId of realSiteIds) {
    if (!derivedSiteIds.has(realSiteId)) {
      issues.push(
        `generatedSiteReadingV0 site ${realSiteId} was not derived from geometry`,
      );
    }
  }

  return {
    methodId: GENERATED_SITE_TRISON_TRIAD_METHOD_ID,
    scope: SCOPE,
    triads,
    issues,
  };
}

// Bridge to Pkt-3: triad -> frame input. sublatedVertex = J.label, parentA/B =
// the parent labels, triadId = siteId, context = a short provenance string.
export function toTrisonFrameInput(
  triad: GeneratedSiteTrisonTriadV0,
): TrisonizedMidwifeTriadInputV0 {
  return {
    triadId: triad.siteId,
    sublatedVertex: triad.sublatedJ.label,
    parentA: triad.parentA.label,
    parentB: triad.parentB.label,
    context: `one-ambo tetrahedron · child ${triad.siteId} on edge ${triad.parentA.label}–${triad.parentB.label} · combined J = opposite edge ${triad.sublatedJ.label} (${triad.sublatedJ.oppositeMidpointId}) · generation ${triad.provenance.generation}`,
  };
}
