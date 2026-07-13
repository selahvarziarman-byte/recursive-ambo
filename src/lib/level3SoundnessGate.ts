// level3SoundnessGate — level-3 Build 1: the S² soundness gate (the manifold bar).
//
// The same link-classifier that caught the self-glue pinch at level-2, one
// dimension up. Well-formed ≠ sound: any pattern enacts; THIS decides.
//
//   (a)  every EDGE-LINK must read `valence === 'interior'` under the COMMITTED
//        `decomposeLink` (incidenceTraceRegistry.ts:478) — reused VERBATIM (the
//        S¹ recognizer is not re-implemented, not approximated);
//   (b2) every VERTEX-LINK must be CONNECTED (components === 1) AND have
//        χ = V − E + F = 2 (the S² test at Build-1 tier: a connected closed
//        surface with χ=2 — full homeomorphy is the tower's later business).
//
// No new topology math: `decomposeLink` + a χ/component counter over the
// extractor's readings (which themselves read `faceIdentification`'s ONE
// flag-algebra incidence).

import { decomposeLink, type LinkDecomposition } from './incidenceTraceRegistry';
import type { Level3Complex } from './faceIdentification';
import {
  extractEdgeLinks,
  extractVertexLinks,
  type EdgeLinkReading,
  type VertexLinkReading,
} from './level3LinkExtractor';

export type Level3Failure =
  | {
      // THE FOLDED EDGE (ADR 0022, 2026-07-14): the identification maps this
      // edge class onto its own reverse, fixing its midpoint — the action is
      // NOT FREE, so the quotient is an ORBIFOLD. A VERDICT, not a crash.
      // This asserts EXACTLY the non-freeness and NOTHING MORE: whether the
      // underlying space is also a manifold is the SUBDIVIDED gate's question
      // (a π-rotation fold can carry a manifold; a reflection fold a mirror
      // boundary). Detected HERE, before the orientation reader ever sees the
      // complex — the order is the fix.
      kind: 'folded-edge';
      edgeClass: string;
      memberEdgeIds: string[];
    }
  | {
      kind: 'edge-link';
      clause: 'a';
      edgeClass: string;
      valence: LinkDecomposition['valence'];
      strata: number;
      pinch: boolean;
    }
  | {
      kind: 'vertex-link';
      clause: 'b2-connectivity' | 'b2-chi';
      vertexClass: string;
      components: number;
      chi: number;
    };

export interface Level3SoundnessReport {
  sound: boolean;
  failures: Level3Failure[];
  edgeLinks: (EdgeLinkReading & { decomposition: LinkDecomposition })[];
  vertexLinks: VertexLinkReading[];
}

export function classifyLevel3Soundness(complex: Level3Complex): Level3SoundnessReport {
  const failures: Level3Failure[] = [];

  // THE FOLDED EDGE (ADR 0022) — read FIRST (the refusal-order law: the
  // non-freeness verdict precedes the link readings; it is what makes the
  // oriented tower unreadable on this cell structure). The same cheap test
  // level3Orientation's programmer-guard uses — tails-together AND
  // tail-to-head, i.e. the class rep's two directed ends land in ONE end
  // class — as a READING, never an exception.
  const edgeGroups = new Map<string, { id: string; a: string; b: string }[]>();
  for (const edge of complex.originalEdges) {
    const root = complex.edgeClassOf(edge.id);
    const list = edgeGroups.get(root);
    if (list) list.push(edge);
    else edgeGroups.set(root, [edge]);
  }
  for (const members of edgeGroups.values()) {
    members.sort((x, y) => x.id.localeCompare(y.id));
    const rep = members[0];
    if (complex.endClassOf(rep.id, rep.a) === complex.endClassOf(rep.id, rep.b)) {
      failures.push({
        kind: 'folded-edge',
        edgeClass: rep.id,
        memberEdgeIds: members.map((m) => m.id),
      });
    }
  }

  const edgeLinks = extractEdgeLinks(complex).map((reading) => {
    const decomposition = decomposeLink(reading.adjacency);
    if (decomposition.valence !== 'interior') {
      failures.push({
        kind: 'edge-link',
        clause: 'a',
        edgeClass: reading.edgeClass,
        valence: decomposition.valence,
        strata: decomposition.strata.length,
        pinch: decomposition.pinch,
      });
    }
    return { ...reading, decomposition };
  });

  const vertexLinks = extractVertexLinks(complex);
  for (const reading of vertexLinks) {
    if (reading.components !== 1) {
      failures.push({
        kind: 'vertex-link',
        clause: 'b2-connectivity',
        vertexClass: reading.vertexClass,
        components: reading.components,
        chi: reading.chi,
      });
    } else if (reading.chi !== 2) {
      failures.push({
        kind: 'vertex-link',
        clause: 'b2-chi',
        vertexClass: reading.vertexClass,
        components: reading.components,
        chi: reading.chi,
      });
    }
  }

  return { sound: failures.length === 0, failures, edgeLinks, vertexLinks };
}
