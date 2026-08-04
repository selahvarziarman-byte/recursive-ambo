// argumentReadingModel — THE ARGUMENT-READING CARD, Phase 1: THE MAP (the
// spine). (Seal SEAL_THE_ARGUMENT_CARD, cut f1c5d67; researcher data-source
// spec 2142; designer look 0020; ADR 0024. Phase 2 — incidence · stance ·
// verdict · gloss — rides on this spine.)
//
// THE MEANING: the card a person gets ON SELECT is the ARGUMENT of the form's
// BIRTH op (`O : parent ⟶ this form`, ONE move — the lineage is browsed by
// selecting the parent), with the invariants DEMOTED to a one-line
// `certificate` receipt. This model is the TESTABLE half: it READS the
// substrate and returns typed rows; the view draws hands and rules.
//
// THE READS (all READ-ONLY on the frozen substrate — researcher spec §1):
//   · the op: `shape.genealogy.operation`;
//   · the immediate correspondence: `vertex.createdBy.sourceVertexIds` (ONE
//     generation; the merged-name convention `mat:…~…`/`idn:…~…` mints the
//     members into the id) — relations via the same convention on edge ids
//     plus `sourceEdgeId` for carried edges;
//   · the ULTIMATE roots: `primalMultiset(vertexId, shape, memo)`
//     (`lineage.ts:29`) — the atomic sources, one call, never a DAG-walk,
//     NEVER invented;
//   · typing: identified (≥2 sources) · survived (present in the parent —
//     includes the retained-verbatim corner whose `createdBy` still tells
//     the seed story; the spec's "id changed" letter is widened to
//     present-in-parent, flagged in the handback) · born (fresh/source-less,
//     or born OF a face/edge — the dual's `p ⟷ f`) · died (a parent site
//     absent from the child, read one generation up).
//
// THE LABELS ARE PRESENTATION, THE IDS ARE THE VALUE: root letters (A, B, …)
// and relation letters (a, b, …) are deterministic presentation labels over
// the REAL substrate ids (kept on every row for the witness); a label names,
// it never invents a source.

import type { Edge, Shape } from '../types/geometry';
import { primalMultiset } from '../lib/lineage';
import type { WrittenForm } from './writtenFormModel';
// PHASE 2 (seal SEAL_ARGUMENT_CARD_PHASE2): the RELATION half of the spine +
// the reading on it. The pair-attribution is recovered through the COMMITTED
// replay-verified birth-word recovery (`recoverBornSurface` — parsed from the
// born id, byte-verified by re-running the committed op; works for word-ops
// AND folds, honestly empty on collapse). ⚠ GROUNDING CORRECTION (flagged):
// the seal's registry read (`op.pairings`) is CLOSURE-PRIVATE on the frozen
// playgroundOperations return — the recovery is the real committed read, and
// it needs no union.
import { recoverBornSurface } from '../playground/bornFormRouting';
import { acquireComplex } from '../lib/complexIdentification';
import { acquireFaithfulComplex } from './surfaceClassifier';
import { readVertexCurvatures, gaussBonnetTotal } from '../lib/conformalAtom';
import type { AssembledComplex } from '../lib/globalW1';

export type ArgumentTyping = 'identified' | 'survived' | 'born';

export interface ArgumentMapRow {
  kind: 'concept' | 'relation'; // • vertex-concept · — relation
  resultId: string; // the substrate id (the value — the witness reads this)
  label: string; // the presentation letter/name the card draws
  sourceIds: string[]; // the ONE-generation sources (ids, may be empty)
  rootIds: string[]; // the ultimate roots via primalMultiset (concepts only)
  rootLabels: string[]; // presentation letters for the roots (A, B, …)
  typing: ArgumentTyping;
  bornOf: 'face' | 'edge' | null; // the dual's trade: born OF a face/edge (p ⟷ f)
}

export interface ArgumentReading {
  op: string; // the birth op, verbatim from the genealogy
  header: { source: string; result: string; gloss: string }; // the map line (□ ⟶ 𝕋²)
  conceptRows: ArgumentMapRow[];
  relationRows: ArgumentMapRow[];
  // MEASURED SUBSTRATE FACT (probe, 2026-08-02 — flags the spec's relation
  // naming): quotient edges get FRESH ids carrying `sourceVertexIds` (the
  // surviving representative's parent endpoints); the identified PARTNER
  // edges simply leave the shape. They are ABSORBED into the identification
  // (recorded by the birth word), never "dead" — listed here by their
  // endpoint root letters. `diedConcepts` counts true vertex deaths only.
  absorbedRelations: string[]; // e.g. ['CD', 'DA'] — the partner edges, endpoint-lettered
  diedConcepts: number;
  words: string; // the map's words-line (counts: "4 concepts become 1 · …")
  certificateLabels: string[]; // which of the existing card rows demote into the receipt
  // ---- PHASE 2 — the relation half + the reading on it -------------------
  // the ATTRIBUTED pairing from the committed replay-verified word; null
  // where the birth carries no recoverable word (dual, seed, …) — the
  // Phase-1 "absorbed" fallback stands there, NEVER a fabricated pairing
  wordRows: RelationPairRow[] | null;
  incidence: IncidenceRow[] | null; // null ⟺ refused (the sentence below)
  stance: StanceRow[] | null;
  verdict: VerdictReading | null;
  gloss: string; // the layman line (dev-register placeholder; designer refines)
  refusal: string | null; // the acquire's own sentence when incidence/stance/verdict refuse
  declare: string | null; // immersion/collapse honesty (the drawn body hides the cell stance)
}

export interface RelationPairRow {
  letter: string; // a, b, … (presentation; the pairing's order)
  mode: 'preserving' | 'reversing'; // the committed word's mode (the value)
  displayLetter: string; // the drawn letter — the inverse (a⁻¹) on reversing.
  // Computed HERE so the view carries no mode literal (the cycle-identify
  // law: no mode word is ever person-facing state in the view).
  slotNames: [string, string]; // the two parent slots, endpoint-lettered ('AB','CD')
  slotIndices: [number, number]; // the committed word's slot indices (the value)
}

export interface IncidenceRow {
  conceptLabel: string;
  conceptId: string;
  relationLetters: string[]; // the incident relations at this concept, with multiplicity
  selfOnly: boolean; // ONE relation meeting only itself (seam ⌐ seam — no partner)
}

export interface StanceRow {
  conceptLabel: string;
  conceptId: string;
  valence: 'interior' | 'boundary';
  cornersDeg: number[]; // the per-corner breakdown (face.cornerAngles at this concept)
  angleSumDeg: number; // the composed stance (the reader's own angleSum)
}

export interface VerdictReading {
  locals: Array<{ conceptLabel: string; curvatureDeg: number; kind: 'seamless' | 'cone' | 'saddle' }>;
  closed: boolean; // no boundary valence anywhere — the global gate
  totalDeg: number; // gaussBonnetTotal, in degrees
  global: string; // closed: tiles/curls up/splays · bounded: open · local-cone (NEVER a global curl)
  uniform: boolean;
  atForm: boolean; // closed + uniform ⇒ at its Form
}

// the sign hand's polygon signs (presentation; a size without a sign stays a word)
const POLYGON_SIGNS: Record<number, string> = { 3: '△', 4: '□', 5: '⬠', 6: '⬡' };

// the result signs where the drawn class carries one (presentation)
const SURFACE_SIGNS: Record<string, string> = {
  torus: '𝕋²',
  klein: 'K²',
  rp2: 'ℝP²',
  sphere: 'S²',
  cylinder: 'cylinder',
  mobius: 'Möbius',
};

// dev-register op words (the designer refines wording; the op token is the value)
const OP_WORDS: Record<string, string> = {
  glue: 'identify the paired edges',
  'flip-glue': 'identify the paired edges, reversed',
  collapse: 'collapse the boundary',
  cut: 'cut along the curve',
  dualization: 'concepts and faces trade places',
  subdivide: 'draw the chord',
  refine: 'refine the cells',
  seed: 'the seed, invoked',
  identify: 'identify the chosen cells',
};

const ROOT_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const RELATION_LETTERS = 'abcdefghjklmnpqrstuvwxyz';

const letterFor = (index: number, alphabet: string): string =>
  index < alphabet.length
    ? alphabet[index]
    : `${alphabet[index % alphabet.length]}${Math.floor(index / alphabet.length) + 1}`;

// the merged-name convention: `mat:a~b~c` / `idn:a~b` carry their members in
// the id (materializeOperation:293 / complexIdentification:620)
export function mergedMembersOf(id: string): string[] | null {
  const match = /^(?:mat|idn):(.+)$/.exec(id);
  if (!match) return null;
  const members = match[1].split('~');
  return members.length >= 2 ? members : null;
}

function sourceNameFor(form: WrittenForm): string {
  const parent = form.parentShape;
  if (!parent) return 'invoked';
  if (parent.faces.length === 1) {
    return POLYGON_SIGNS[parent.faces[0].vertexIds.length] ?? `${parent.faces[0].vertexIds.length}-gon`;
  }
  return parent.name || parent.seedKey || 'parent';
}

function resultNameFor(form: WrittenForm): string {
  const render = form.render;
  if (render.mode === 'immersion') return SURFACE_SIGNS[render.model.surface] ?? render.model.surface;
  // PHASE-2 POLISH: the fold-born faithful family IS the disk family (its own
  // verdict gate: χ=1, open, orientable) — the header speaks the class word,
  // not the raw op ('cone' joins once the metric mark rides — the seal's note)
  if (render.mode === 'faithful') return 'disk';
  // the drawn class name where a card already computes one is Phase-2 polish;
  // the form's own title word is the honest Phase-1 fallback
  return form.title.split('—')[0].trim() || form.shape.name || 'this form';
}

export function buildArgumentReading(form: WrittenForm): ArgumentReading {
  const shape = form.shape;
  const parent = form.parentShape ?? null;
  const op = shape.genealogy.operation;
  const memo = new Map<string, Map<string, number>>();

  // the root letters: every distinct primal root across the form, in sorted
  // order, gets a stable presentation letter
  const allRoots = new Set<string>();
  for (const vertexId of Object.keys(shape.vertices)) {
    for (const root of primalMultiset(vertexId, shape, memo).keys()) allRoots.add(root);
  }
  const rootLabelOf = new Map([...allRoots].sort().map((id, i) => [id, letterFor(i, ROOT_LETTERS)]));

  const parentVertexIds = parent ? new Set(Object.keys(parent.vertices)) : null;
  const conceptRows: ArgumentMapRow[] = Object.keys(shape.vertices)
    .sort()
    .map((vertexId) => {
      const vertex = shape.vertices[vertexId];
      const creation = vertex.createdBy;
      const merged = mergedMembersOf(vertexId);
      const sourceIds = creation.sourceVertexIds.length > 0 ? [...creation.sourceVertexIds] : (merged ?? []);
      const roots = primalMultiset(vertexId, shape, memo);
      const rootIds = [...roots.keys()].sort();
      // the TRADE reads first (measured: a dual-born vertex carries BOTH its
      // sourceFaceId AND the face's corners as sourceVertexIds — the face is
      // what it is born OF; the corners are that face's witnesses)
      const bornOf: ArgumentMapRow['bornOf'] =
        creation.sourceFaceId ? 'face' : creation.sourceEdgeId && sourceIds.length === 0 ? 'edge' : null;
      const typing: ArgumentTyping =
        bornOf !== null
          ? 'born'
          : sourceIds.length >= 2
            ? 'identified'
            : parentVertexIds && parentVertexIds.has(vertexId)
              ? 'survived' // includes the retained-verbatim corner (createdBy still tells the seed story)
              : sourceIds.length === 1 && sourceIds[0] !== vertexId
                ? 'survived'
                : 'born';
      return {
        kind: 'concept' as const,
        resultId: vertexId,
        label: rootIds.length === 1 ? (rootLabelOf.get(rootIds[0]) ?? vertexId) : vertexId.split(':').pop() ?? vertexId,
        sourceIds,
        rootIds,
        rootLabels: rootIds.map((id) => rootLabelOf.get(id) ?? id),
        typing,
        bornOf,
      };
    });

  // the relation source is the recorded `sourceVertexIds` (the surviving
  // representative's parent endpoints — measured substrate fact); the source
  // is NAMED by those endpoints' root letters (AB — a reading, not a mint)
  const endpointLetters = (endpointIds: readonly string[]): string =>
    endpointIds.map((id) => rootLabelOf.get(id) ?? primalRootLetter(id)).join('');
  const primalRootLetter = (id: string): string => {
    // a parent endpoint may itself be a merged class — resolve to its roots
    const roots = shape.vertices[id]
      ? [...primalMultiset(id, shape, memo).keys()].sort()
      : (mergedMembersOf(id) ?? [id]);
    return roots.map((r) => rootLabelOf.get(r) ?? r.split(':').pop() ?? r).join('');
  };
  const parentEdgeIds = parent ? new Set(parent.edges.map((e) => e.id)) : null;
  const relationLabelOf = new Map(
    [...shape.edges].map((e) => e.id).sort().map((id, i) => [id, letterFor(i, RELATION_LETTERS)]),
  );
  const relationRows: ArgumentMapRow[] = [...shape.edges]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((edge: Edge) => {
      const sourceEndpoints = edge.sourceVertexIds ?? edge.vertexIds;
      const sourceIds = edge.sourceEdgeId ? [edge.sourceEdgeId] : [...sourceEndpoints];
      const typing: ArgumentTyping =
        parentEdgeIds && parentEdgeIds.has(edge.id) ? 'survived' : parent ? 'survived' : 'born';
      return {
        kind: 'relation' as const,
        resultId: edge.id,
        label: relationLabelOf.get(edge.id) ?? edge.id,
        sourceIds,
        rootIds: [],
        rootLabels: [endpointLetters(sourceEndpoints)], // the source edge, endpoint-lettered
        typing,
        bornOf: null,
      };
    });

  // the ABSORBED partners: parent edges absent from the child — identified
  // into a surviving class by the birth word (never "dead"); listed by their
  // own endpoint letters. True vertex deaths counted separately.
  const childEdgeIds = new Set(shape.edges.map((e) => e.id));
  const absorbedRelations = parent
    ? parent.edges.filter((e) => !childEdgeIds.has(e.id)).map((e) => endpointLetters(e.vertexIds))
    : [];
  const absorbedVertexIds = new Set(conceptRows.flatMap((r) => r.sourceIds));
  const diedConcepts = parent
    ? Object.keys(parent.vertices).filter((id) => !shape.vertices[id] && !absorbedVertexIds.has(id)).length
    : 0;

  // the words-line — counts, mechanical (the designer's wording rides later)
  const words = parent
    ? `${Object.keys(parent.vertices).length} concepts become ${conceptRows.length} · ${parent.edges.length} relations become ${relationRows.length}${
        absorbedRelations.length > 0 ? ` · ${absorbedRelations.length} absorbed` : ''
      }${diedConcepts > 0 ? ` · ${diedConcepts} die` : ''}`
    : `${conceptRows.length} concepts, ${relationRows.length} relations — the seed's own`;

  // ---- PHASE 2 — the relation half + the reading on it -------------------
  // (1) THE ATTRIBUTED PAIRING — the committed replay-verified birth word
  // (recoverBornSurface parses the word from the born id and byte-verifies it
  // by re-running the committed op; empty on collapse, null where no word)
  let wordRows: RelationPairRow[] | null = null;
  const recovery = parent ? recoverBornSurface(shape, parent) : null;
  if (recovery && recovery.pairings.length > 0) {
    const face = recovery.parentFace;
    const n = face.vertexIds.length;
    const slotName = (slot: number): string =>
      endpointLetters([face.vertexIds[slot % n], face.vertexIds[(slot + 1) % n]]);
    wordRows = recovery.pairings.map((pair, k) => {
      const letter = letterFor(k, RELATION_LETTERS);
      return {
        letter,
        mode: pair.mode,
        displayLetter: pair.mode === 'reversing' ? `${letter}⁻¹` : letter,
        slotNames: [slotName(pair.edgeA), slotName(pair.edgeB)] as [string, string],
        slotIndices: [pair.edgeA, pair.edgeB] as [number, number],
      };
    });
  }

  // (2)+(3)+(4) — acquire ONCE; incidence ∘ the map, stance WITH the complex
  // (a raw-shape stance mis-reads the fold-born rim — the R1 lesson), the
  // verdict GATED ON CLOSURE. A null/thrown acquire REFUSES all three with
  // the reader's own sentence — never a fake reading.
  let incidence: IncidenceRow[] | null = null;
  let stance: StanceRow[] | null = null;
  let verdict: VerdictReading | null = null;
  let refusal: string | null = null;
  const toDeg = (x: number): number => Math.round(((x * 180) / Math.PI) * 10) / 10;
  const acquisitionLineage = [shape, ...(parent ? [parent] : []), ...(form.parentShapes ?? [])];
  try {
    const acquired =
      form.render.mode === 'faithful'
        ? acquireFaithfulComplex(shape, acquisitionLineage)
        : acquireComplex(shape, acquisitionLineage);
    if (!acquired) {
      refusal =
        'the complex did not acquire — incidence, stance and verdict refuse (no reading is honest; a false one is not)';
    } else {
      const complex: AssembledComplex = acquired.complex;
      const conceptLabelOf = new Map(conceptRows.map((r) => [r.resultId, r.label]));
      const relationLetterOf = new Map(relationRows.map((r) => [r.resultId, r.label]));
      // the MEETING is read at the CORNER FLANKS (the oriented face-boundary
      // walk — the only read that disambiguates parallel self-loops: the
      // torus corner is flanked a·b, the cone's apex seam·seam), never at
      // bare edge endpoints
      const edgeById = new Map(complex.edges.map((e) => [e.id, e]));
      const relationLetterAt = (id: string): string =>
        relationLetterOf.get(id) ?? id.split(':').pop() ?? id;
      const flankLettersByVertex = new Map<string, string[]>();
      for (const f of complex.faces) {
        const boundary = f.boundary;
        for (let k = 0; k < boundary.length; k += 1) {
          const slot = boundary[k];
          const next = boundary[(k + 1) % boundary.length];
          const slotEdge = edgeById.get(slot.edge);
          if (!slotEdge) continue;
          const cornerVertex = slot.dir === 1 ? slotEdge.v : slotEdge.u;
          const list = flankLettersByVertex.get(cornerVertex) ?? [];
          list.push(relationLetterAt(slot.edge), relationLetterAt(next.edge));
          flankLettersByVertex.set(cornerVertex, list);
        }
      }
      incidence = complex.vertices.map((vertexId) => {
        const letters = [...(flankLettersByVertex.get(vertexId) ?? [])].sort();
        const distinct = new Set(letters);
        return {
          conceptLabel: conceptLabelOf.get(vertexId) ?? vertexId.split(':').pop() ?? vertexId,
          conceptId: vertexId,
          relationLetters: letters,
          selfOnly: distinct.size === 1 && letters.length >= 2,
        };
      });
      const readings = readVertexCurvatures(shape, complex);
      const cornersAt = (vertexId: string): number[] => {
        const corners: number[] = [];
        for (const f of shape.faces) {
          const angles = f.cornerAngles;
          if (!angles) continue;
          f.vertexIds.forEach((vid, k) => {
            if (vid === vertexId && angles[k] !== undefined) corners.push(toDeg(angles[k]));
          });
        }
        return corners;
      };
      stance = readings.map((r) => ({
        conceptLabel: conceptLabelOf.get(r.vertexId) ?? r.vertexId.split(':').pop() ?? r.vertexId,
        conceptId: r.vertexId,
        valence: r.valence,
        cornersDeg: cornersAt(r.vertexId),
        angleSumDeg: toDeg(r.angleSum),
      }));
      const closed = readings.every((r) => r.valence !== 'boundary');
      const total = gaussBonnetTotal(readings);
      const curvatures = readings.map((r) => r.curvature);
      const uniform = curvatures.length > 0 && curvatures.every((c) => Math.abs(c - curvatures[0]) < 1e-9);
      const EPS = 1e-9;
      const global = closed
        ? Math.abs(total) < EPS
          ? 'Σδ = 0 ⇄ tiles'
          : total > 0
            ? `Σδ = ${toDeg(total)}° ⇄ curls up`
            : `Σδ = ${toDeg(total)}° ⇄ splays`
        : 'open · local-cone';
      verdict = {
        locals: readings
          .filter((r) => Math.abs(r.curvature) >= EPS)
          .map((r) => ({
            conceptLabel: conceptLabelOf.get(r.vertexId) ?? r.vertexId,
            curvatureDeg: toDeg(r.curvature),
            kind: r.curvature > 0 ? ('cone' as const) : ('saddle' as const),
          })),
        closed,
        totalDeg: toDeg(total),
        global,
        uniform,
        atForm: closed && uniform,
      };
    }
  } catch (error) {
    refusal = error instanceof Error ? error.message : String(error);
  }

  // (5) the layman gloss — dev-register placeholder (the designer refines)
  const gloss =
    refusal !== null || verdict === null
      ? ''
      : !verdict.closed
        ? 'a rim stays open — an over-committed corner rolls itself to a point'
        : verdict.atForm && verdict.totalDeg > 0
          ? 'every concept falls short by the same amount — the sheet closes up, arrived at its Form'
          : Math.abs(verdict.totalDeg) < 1e-6
            ? 'nothing is over-committed, nothing slack — the sheet tiles flat'
            : 'the total curvature spends itself unevenly — closed, but not at a Form';
  const declare =
    form.render.mode === 'immersion'
      ? 'the stance lives on the cell body — the smooth immersion does not draw its cones'
      : op === 'collapse'
        ? 'a topological sphere — no metric rides the collapse'
        : null;

  return {
    op,
    header: {
      source: sourceNameFor(form),
      result: resultNameFor(form),
      gloss: OP_WORDS[op] ?? `the ${op} move`,
    },
    conceptRows,
    relationRows,
    absorbedRelations,
    diedConcepts,
    words,
    wordRows,
    incidence,
    stance,
    verdict,
    gloss,
    refusal,
    declare,
    // the receipt: which existing card rows demote under the hairline (the
    // view filters its OWN rows by these labels — nothing re-derived here)
    certificateLabels: ['χ', 'χ (certified)', 'class', 'name', 'H₁', 'w₁', 'genus', 'b₁'],
  };
}
