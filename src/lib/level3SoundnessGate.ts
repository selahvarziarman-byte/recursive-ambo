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
