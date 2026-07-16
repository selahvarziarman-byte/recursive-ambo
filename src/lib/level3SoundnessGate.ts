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
      // THE REPRESENTATIVE (census mandate, 2026-07-16, sealed 9832a89c…f2d4):
      // this is the smallest MEMBER EDGE ID (members[0] after the lex sort) —
      // the value the person-facing wall prints. It is NOT the union-find
      // class root, and it was previously named `edgeClass`: a census that
      // cross-referenced it against the link readings' edgeClass (which IS
      // the root) BY ID was a silent no-op — it returned the same number as
      // no filter at all, and three offices published it. A NAME IS A CLAIM,
      // so `.edgeClass` no longer exists on this record; the canonical key
      // both views share is `classRoot`.
      repEdgeId: string;
      classRoot: string;
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

// THE BOUNDED FORM (2026-07-18, sealed eb9bfcb4…d598c): the boundary READING —
// the free face classes and the boundary strata they induce. A DOOR, not a
// theorem (LAW 14): "this form has a boundary," never "this form is broken."
// The reader always computed these valences; only the verdict was wrong.
export interface Level3BoundaryReading {
  faceClasses: string[]; // singleton face classes — the boundary 2-cells
  edgeClasses: string[]; // edge classes whose link valence reads 'boundary'
  vertexClasses: string[]; // vertex classes on free faces (disk links, χ = 1)
}

export interface Level3SoundnessReport {
  sound: boolean;
  boundary: Level3BoundaryReading | null; // null on a closed complex
  failures: Level3Failure[];
  edgeLinks: (EdgeLinkReading & { decomposition: LinkDecomposition })[];
  vertexLinks: VertexLinkReading[];
}

export function classifyLevel3Soundness(complex: Level3Complex): Level3SoundnessReport {
  const failures: Level3Failure[] = [];

  // THE BOUNDED FORM (2026-07-18): the free (singleton) face classes — the
  // boundary 2-cells. An unpaired face is a BOUNDARY, not a defect: the two
  // clauses below except exactly the strata a boundary induces (edge links of
  // valence 'boundary'; connected disk vertex links, χ = 1, on free faces)
  // and the report carries the reading as a verdict. On a closed complex the
  // sets are empty and every clause below is byte-equivalent to the old gate.
  const faceClassCount = new Map<string, number>();
  const faceClassRep = new Map<string, { id: string; cycle: string[] }>();
  for (const face of complex.originalFaces) {
    const root = complex.faceClassOf(face.id);
    faceClassCount.set(root, (faceClassCount.get(root) ?? 0) + 1);
    if (!faceClassRep.has(root)) faceClassRep.set(root, face);
  }
  const boundaryFaceClasses = [...faceClassCount.entries()]
    .filter(([, count]) => count === 1)
    .map(([root]) => root)
    .sort((a, b) => a.localeCompare(b));
  const boundaryVertexClasses = new Set<string>();
  for (const root of boundaryFaceClasses) {
    const rep = faceClassRep.get(root);
    if (rep) {
      for (const v of rep.cycle) boundaryVertexClasses.add(complex.vertexClassOf(v));
    }
  }
  const boundaryEdgeClasses: string[] = [];

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
  for (const [root, members] of edgeGroups.entries()) {
    members.sort((x, y) => x.id.localeCompare(y.id));
    const rep = members[0];
    if (complex.endClassOf(rep.id, rep.a) === complex.endClassOf(rep.id, rep.b)) {
      failures.push({
        kind: 'folded-edge',
        repEdgeId: rep.id,
        classRoot: root,
        memberEdgeIds: members.map((m) => m.id),
      });
    }
  }

  const edgeLinks = extractEdgeLinks(complex).map((reading) => {
    const decomposition = decomposeLink(reading.adjacency);
    if (decomposition.valence === 'boundary' && boundaryFaceClasses.length > 0) {
      // a boundary edge link (an arc, one stratum) on a complex that HAS free
      // faces — the boundary reading, never a failure
      boundaryEdgeClasses.push(reading.edgeClass);
    } else if (decomposition.valence !== 'interior') {
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
    // THE BOUNDED FORM: a vertex ON A FREE FACE with a connected χ = 1 link
    // is a boundary vertex (its link is a disk — a connected surface WITH
    // boundary at χ = 1 is a disk). A χ = 1 link on an INTERIOR vertex stays
    // a failure exactly as before (an RP² link also reads χ = 1, connected —
    // free-face incidence is what separates the disk from the cone point).
    if (boundaryVertexClasses.has(reading.vertexClass) && reading.components === 1 && reading.chi === 1) {
      continue;
    }
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

  const boundary: Level3BoundaryReading | null = boundaryFaceClasses.length > 0
    ? {
        faceClasses: boundaryFaceClasses,
        edgeClasses: [...boundaryEdgeClasses].sort((a, b) => a.localeCompare(b)),
        vertexClasses: [...boundaryVertexClasses].sort((a, b) => a.localeCompare(b)),
      }
    : null;

  return { sound: failures.length === 0, boundary, failures, edgeLinks, vertexLinks };
}
