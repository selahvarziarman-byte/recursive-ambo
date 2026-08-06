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

// THE LIFT — IDENTITY & GRAIN (SEAL_THE_LIFT_IDENTITY_AND_GRAIN): 'lifted' —
// imported whole from another universe (`genealogy.operation === 'patch-lift'`)
// — is its OWN typing, never a mistyped 'born'. SLICE2 (researcher 1900):
// 'derived' — a mint-from-many whose sources PERSIST in the result (the ambo
// midpoint AC ← {A, C}, an inference/lemma) — split from 'identified' (≥2
// sources ABSORBED — a unification: glue/fold/collapse).
export type ArgumentTyping = 'identified' | 'survived' | 'born' | 'lifted' | 'derived';

export interface ArgumentMapRow {
  kind: 'concept' | 'relation'; // • vertex-concept · — relation
  resultId: string; // the substrate id (the value — the witness reads this)
  // THE IDENTITY LAW (the researcher's, binding): the label CARRIES the
  // packet's real name (`vertex.data.label` — a seed "C", a user "fact", a
  // minted "AB"/"v0"), 'unnamed' for a reachable-but-empty packet, the id
  // tail for an unreachable one; a positional letter survives ONLY as an
  // appended disambiguating index (`name·A`), NEVER as the name
  label: string;
  // M3 (SEAL_M3_PERSISTENCE): the packet's OWN name alone — null when the
  // person never named it. The ring's merged presentation reads this slot
  // (`p ← {…}` with p = 'unnamed' when null — no invented result-letter);
  // `label` above stays the card's composed display, untouched.
  ownName: string | null;
  sourceIds: string[]; // the ONE-generation sources (ids, may be empty)
  rootIds: string[]; // the ultimate roots via primalMultiset (concepts only)
  rootLabels: string[]; // the roots' real names (packet-carried, see label)
  typing: ArgumentTyping;
  bornOf: 'face' | 'edge' | null; // the dual's trade: born OF a face/edge (p ⟷ f)
  // the lifted concept's life-line read THROUGH to its birth record
  // (`createdBy` — retained verbatim by the lift): "seed corner of the
  // tetrahedron" — subject + source universe + lineage; null off patch-lift
  origin: { op: string; shapeId: string; display: string } | null;
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
  // M3 (SEAL_M3_PERSISTENCE) — the died concepts' IDENTITIES (the :541 filter
  // mapped to packet names, never just counted): the card's memorial row
  // ("Truth — died in <op>") reads these; a died concept must never vanish
  // silently. MEASURED (probe, 2026-08-06): every committed door at HEAD
  // absorbs or survives its vertices — this list is reachable-empty today;
  // the read is total so the first true death SPEAKS the moment an op can
  // produce one.
  diedConceptRows: { id: string; label: string }[];
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
  // THE GRAIN LAW: the lift's own honest refusal marks (`data.grainMark` on
  // lifted edges/faces — "coarse face; finer structure not carried"), read
  // off the substrate and rendered by the view; empty when the grain rode
  grainMarks: string[];
  // PHASE C: the surfaced coarse relations (read from the Phase-B registry —
  // the `data.composes`/`data.sharedBy` stamps on the live entities, the
  // carrier that survives the committed load); empty off the lift family
  composedRelationRows: ComposedRelationRow[];
}

// PHASE C (SEAL_PHASE_C_CARD_REGISTRY — the researcher's SURFACE ruling): a
// coarse relation Phase B recorded (composed-of: the union of its live
// halves · shared-by: a twin wall's duplicate record) SURFACES as its own
// row. THE TWO-SIDED BAR: its PLACE is the drawn path through live parts
// (`pathEdgeIds` — never a floating name), and no recorded relation is
// silently dropped (the words count them).
export interface ComposedRelationRow {
  id: string; // the recorded coarse entity's id (the value)
  kind: 'composed-of' | 'shared-by';
  entity: 'edge' | 'face';
  label: string; // endpoint/corner names, ·-joined ('Fact·Meaning')
  pathLabels: string[]; // the live parts, endpoint-named, in path order
  pathIds: string[]; // the live part ids — the drawn PLACE (witness-checked)
  typing: ArgumentTyping; // the source-role through the lift ('born' — a premise)
  sourceVertexIds: string[];
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
  // THE RIM-TURN SPLIT (mothership 1230): a BOUNDARY +δ is the rim BENDING —
  // a rim-turn — never an interior cone's over-commitment; the split reads
  // the ACQUIRED valence already on the reading
  locals: Array<{ conceptLabel: string; curvatureDeg: number; kind: 'seamless' | 'cone' | 'saddle' | 'rim-turn' }>;
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
  // THE LIFT (SEAL_THE_LIFT_IDENTITY_AND_GRAIN) — the header names the move;
  // buildArgumentReading swaps in the SPECIFIC source name where it reads one
  'patch-lift': 'lifted from the source universe',
  invoke: 'the primitive, invoked',
  'ambo-dissection': 'corners cut to midpoints — the ambo dissection',
  product: 'the ×I product — thickened',
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
  if (!parent) {
    // THE LIFT: a placed patch-lift has no parent on the sheet (the loader
    // re-roots), but its NAME carries the source verbatim — the lift's own
    // mint is `<entity> of <source universe>` (subComplexLift, this build's
    // contract) — read it, never "invoked" for an import
    if (form.shape.genealogy.operation === 'patch-lift') {
      const name = form.shape.name ?? '';
      const cut = name.indexOf(' of ');
      return cut > -1 ? name.slice(cut + 4) : 'another universe';
    }
    return 'invoked';
  }
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
  // THE LIFT: the result is the lifted entity itself — the tag before the
  // mint's own " of " (the full name would repeat the source already named
  // on the left of the arrow)
  if (form.shape.genealogy.operation === 'patch-lift') {
    const name = form.shape.name ?? '';
    const cut = name.indexOf(' of ');
    if (cut > -1) return name.slice(0, cut);
  }
  // the drawn class name where a card already computes one is Phase-2 polish;
  // the form's own title word is the honest Phase-1 fallback
  return form.title.split('—')[0].trim() || form.shape.name || 'this form';
}

export function buildArgumentReading(form: WrittenForm): ArgumentReading {
  const shape = form.shape;
  const parent = form.parentShape ?? null;
  const op = shape.genealogy.operation;
  const memo = new Map<string, Map<string, number>>();

  // THE IDENTITY LAW (SEAL_THE_LIFT_IDENTITY_AND_GRAIN — the researcher's,
  // binding): CARRY what the substrate holds · MARK what it doesn't ·
  // FABRICATE neither a name nor a structure · ERASE neither. The entity's
  // name IS its packet (`vertex.data.label` — the seed's "C", the user's
  // "fact", the mint's "AB"/"v0"); `letterFor` is DETHRONED as an identity
  // source — a positional letter survives ONLY as an appended disambiguating
  // index over duplicate real names, never as the name.
  const liftedForm = op === 'patch-lift'; // imported whole from another universe
  const packetOf = (id: string) =>
    shape.vertices[id]?.data ??
    parent?.vertices[id]?.data ??
    (form.parentShapes ?? []).map((s) => s.vertices[id]?.data).find(Boolean) ??
    null;
  // the entity's OWN name: a real, non-degenerate packet label (the quotient
  // mint copies the id INTO the label — measured — which is no independent
  // name; an id-as-label or empty label falls through)
  const ownNameOf = (id: string): string | null => {
    const data = packetOf(id);
    if (!data || typeof data.label !== 'string') return null;
    const trimmed = data.label.trim();
    return trimmed.length > 0 && trimmed !== id ? trimmed : null;
  };
  const idTail = (id: string): string => id.split(':').pop() ?? id;
  // a root's display: its packet name; 'unnamed' when the packet is reachable
  // but empty/degenerate; the honest id tail when the packet is out of reach
  // (a source-tagged primal of an absent universe — the id is a real value)
  const rootDisplayBase = (id: string): string =>
    ownNameOf(id) ?? (packetOf(id) ? 'unnamed' : idTail(id));

  const allRoots = new Set<string>();
  for (const vertexId of Object.keys(shape.vertices)) {
    for (const root of primalMultiset(vertexId, shape, memo).keys()) allRoots.add(root);
  }
  const sortedRoots = [...allRoots].sort();
  const rootBaseNames = sortedRoots.map(rootDisplayBase);
  const rootNameCount = new Map<string, number>();
  for (const name of rootBaseNames) rootNameCount.set(name, (rootNameCount.get(name) ?? 0) + 1);
  const rootNameSeen = new Map<string, number>();
  const rootLabelOf = new Map<string, string>();
  sortedRoots.forEach((id, i) => {
    const name = rootBaseNames[i];
    if ((rootNameCount.get(name) ?? 0) > 1) {
      const k = rootNameSeen.get(name) ?? 0;
      rootNameSeen.set(name, k + 1);
      rootLabelOf.set(id, `${name}·${letterFor(k, ROOT_LETTERS)}`); // index, never the name
    } else {
      rootLabelOf.set(id, name);
    }
  });
  const rootDisplayOf = (id: string): string => rootLabelOf.get(id) ?? rootDisplayBase(id);

  // the lifted concept's life-line read-through: `createdBy` is retained
  // VERBATIM by the lift — the birth op + the birth universe name the story
  // ("seed corner of the tetrahedron"); the id is carried raw on the row
  const shapeDisplay = (shapeId: string): string =>
    shapeId.startsWith('shape:seed:')
      ? `the ${shapeId.slice('shape:seed:'.length)}`
      : shapeId.startsWith('shape:')
        ? shapeId.slice('shape:'.length)
        : shapeId;
  const originDisplay = (creation: { operation: string; shapeId: string }): string =>
    `${creation.operation === 'seed' ? 'seed corner' : `${creation.operation} corner`} of ${shapeDisplay(creation.shapeId)}`;

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
      const typing: ArgumentTyping = liftedForm
        ? 'lifted' // the lift is a pure restriction — every member is an import
        : bornOf !== null
          ? 'born'
          : sourceIds.length >= 2
            ? sourceIds.every((s) => Boolean(shape.vertices[s]))
              ? 'derived' // researcher 1900: the sources PERSIST — a mint-from-many (the ambo midpoint), not a unification
              : 'identified' // ≥2 sources ABSORBED — glue/fold/collapse
            : parentVertexIds && parentVertexIds.has(vertexId)
              ? 'survived' // includes the retained-verbatim corner (createdBy still tells the seed story)
              : sourceIds.length === 1 && sourceIds[0] !== vertexId
                ? 'survived'
                : 'born';
      // the concept's name: its OWN packet first; a class without an
      // independent name (id-as-label) reads through its members' real names
      const own = ownNameOf(vertexId);
      const label =
        own ??
        (rootIds.length > 0 && !(rootIds.length === 1 && rootIds[0] === vertexId)
          ? rootIds.map(rootDisplayOf).join('·')
          : packetOf(vertexId)
            ? 'unnamed'
            : idTail(vertexId));
      return {
        kind: 'concept' as const,
        resultId: vertexId,
        label,
        ownName: own,
        sourceIds,
        rootIds,
        rootLabels: rootIds.map(rootDisplayOf),
        typing,
        bornOf,
        origin: liftedForm
          ? { op: creation.operation, shapeId: creation.shapeId, display: originDisplay(creation) }
          : null,
      };
    });
  // duplicate real names across DISTINCT concepts stay distinguishable — the
  // positional letter rides as an appended index only
  const conceptNameCount = new Map<string, number>();
  for (const row of conceptRows) conceptNameCount.set(row.label, (conceptNameCount.get(row.label) ?? 0) + 1);
  const conceptNameSeen = new Map<string, number>();
  for (const row of conceptRows) {
    if ((conceptNameCount.get(row.label) ?? 0) > 1) {
      const k = conceptNameSeen.get(row.label) ?? 0;
      conceptNameSeen.set(row.label, k + 1);
      row.label = `${row.label}·${letterFor(k, ROOT_LETTERS)}`;
    }
  }

  // the relation source is the recorded `sourceVertexIds` (the surviving
  // representative's parent endpoints — measured substrate fact); the source
  // is NAMED by those endpoints' REAL names (AB / v0·v1 — a reading, not a
  // mint; single-char names join bare, longer ones join with ·)
  const endpointNameOf = (id: string): string => {
    if (rootLabelOf.has(id)) return rootLabelOf.get(id) as string;
    const own = ownNameOf(id);
    if (own) return own;
    // a parent endpoint may itself be a merged class — resolve to its roots
    const roots = shape.vertices[id]
      ? [...primalMultiset(id, shape, memo).keys()].sort()
      : (mergedMembersOf(id) ?? [id]);
    if (roots.length === 1 && roots[0] === id) return packetOf(id) ? 'unnamed' : idTail(id);
    return roots.map(rootDisplayOf).join('·');
  };
  const joinNames = (parts: string[]): string =>
    parts.every((p) => p.length === 1) ? parts.join('') : parts.join('·');
  const endpointLetters = (endpointIds: readonly string[]): string =>
    joinNames(endpointIds.map(endpointNameOf));
  const parentEdgeIds = parent ? new Set(parent.edges.map((e) => e.id)) : null;
  const relationLabelOf = new Map(
    [...shape.edges].map((e) => e.id).sort().map((id, i) => [id, letterFor(i, RELATION_LETTERS)]),
  );
  // a relation's own packet name when the substrate carries one (measured:
  // none minted today — the honest read stands ready); the pairing letter
  // stays PRESENTATION over the real edge id (P1's ratified stance)
  const relationOwnName = (edge: Edge): string | null => {
    const raw = edge.data?.['label'];
    if (typeof raw !== 'string') return null;
    const trimmed = raw.trim();
    return trimmed.length > 0 && trimmed !== edge.id ? trimmed : null;
  };
  const relationRows: ArgumentMapRow[] = [...shape.edges]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((edge: Edge) => {
      const sourceEndpoints = edge.sourceVertexIds ?? edge.vertexIds;
      const sourceIds = edge.sourceEdgeId ? [edge.sourceEdgeId] : [...sourceEndpoints];
      // PHASE C (researcher 2240): a LIFTED relation reads its SOURCE-ROLE
      // through the lift's map-move — a seed-story relation (every endpoint
      // created by `seed`) is a PREMISE ('born'); one touching a minted
      // endpoint is 'derived' (the ambo's half). A relation is a meaning
      // that persists; the blanket 'lifted' stays on CONCEPTS (their
      // life-line carries the lift story).
      const seedStory = (id: string): boolean => shape.vertices[id]?.createdBy.operation === 'seed';
      const typing: ArgumentTyping = liftedForm
        ? edge.vertexIds.every(seedStory)
          ? 'born'
          : 'derived'
        : parentEdgeIds && parentEdgeIds.has(edge.id)
          ? 'survived'
          : parent
            ? sourceIds.length >= 2 && sourceIds.every((s) => Boolean(shape.vertices[s]))
              ? 'derived' // SLICE2: an op-born relation whose recorded endpoint sources PERSIST (the researcher's discriminator, scoped INSIDE the op-born branch — a seed's self-record stays born)
              : 'survived'
            : 'born';
      return {
        kind: 'relation' as const,
        resultId: edge.id,
        label: relationOwnName(edge) ?? relationLabelOf.get(edge.id) ?? edge.id,
        ownName: relationOwnName(edge),
        sourceIds,
        rootIds: [],
        rootLabels: [endpointLetters(sourceEndpoints)], // the source edge, endpoint-named
        typing,
        bornOf: null,
        origin: null,
      };
    });

  // PHASE C — THE CARD READS THE REGISTRY (SEAL_PHASE_C_CARD_REGISTRY): the
  // coarse relations Phase B recorded surface as COMPOSED-PATH rows. The
  // registry is read off the LIVE entities' own stamps (`data.composes` on
  // every part, `data.sharedBy` on the kept twin — the serializing carrier;
  // deduped by the recorded id). Labels ·-join ALWAYS (the composed row
  // names a RELATION between concepts — 'A·B' never collides with the
  // midpoint concept 'AB'); the typing is the source-role through the lift
  // (seed-story endpoints ⇒ 'born' — a premise; a minted endpoint ⇒
  // 'derived'). The PLACE is the ordered live path (the two-sided bar).
  const dotJoin = (ids: readonly string[]): string => ids.map(endpointNameOf).join('·');
  const composedRelationRows: ComposedRelationRow[] = (() => {
    if (!liftedForm) return [];
    const seedStoryV = (id: string): boolean => shape.vertices[id]?.createdBy.operation === 'seed';
    const rows = new Map<string, ComposedRelationRow>();
    // the Phase-B stamps carry SOURCE-universe ids; the committed load
    // prefixes every STRUCTURAL id (`<source>:…`) but the data blobs ride
    // OPAQUE (measured) — a recorded id resolves against the live pool by
    // suffix, and the RESOLVED (live) ids are what the row carries
    const liveVertexIds = Object.keys(shape.vertices);
    const liveEdgeIds = shape.edges.map((e) => e.id);
    const resolveLive = (recordedId: string, pool: readonly string[]): string =>
      pool.find((liveId) => liveId === recordedId || liveId.endsWith(`:${recordedId}`)) ?? recordedId;
    const liveEdgeById = new Map(shape.edges.map((e) => [e.id, e]));
    const readComposes = (entity: 'edge' | 'face', data: Record<string, unknown> | undefined): void => {
      const rec = data?.['composes'] as
        | { kind?: string; id?: string; parts?: string[]; sourceVertexIds?: string[] }
        | undefined;
      if (!rec || typeof rec.id !== 'string' || !Array.isArray(rec.parts)) return;
      if (rows.has(rec.id)) return;
      const source = (Array.isArray(rec.sourceVertexIds) ? rec.sourceVertexIds : []).map((v) =>
        resolveLive(v, liveVertexIds),
      );
      const parts = rec.parts.map((p) => resolveLive(p, liveEdgeIds));
      rows.set(rec.id, {
        id: rec.id,
        kind: 'composed-of',
        entity,
        label: dotJoin(source),
        pathLabels: parts.map((p) => {
          const live = liveEdgeById.get(p);
          return live ? dotJoin(live.vertexIds) : (p.split(':').pop() ?? p);
        }),
        pathIds: parts,
        typing: source.length > 0 && source.every(seedStoryV) ? 'born' : 'derived',
        sourceVertexIds: source,
      });
    };
    // composed-of EDGE records only — a coarse SIDE is a seed RELATION (the
    // seal's rows); the coarse FACE's composed record is the REGION's own
    // registry entry (Phase D's correspondence subject), not a relation row —
    // it stays on the shape, nothing hidden (disclosed)
    for (const e of shape.edges) readComposes('edge', e.data);
    const readSharedBy = (entity: 'edge' | 'face', keptId: string, data: Record<string, unknown> | undefined, corners: readonly string[]): void => {
      const dropped = data?.['sharedBy'];
      if (!Array.isArray(dropped)) return;
      for (const droppedId of dropped) {
        if (typeof droppedId !== 'string' || rows.has(droppedId)) continue;
        rows.set(droppedId, {
          id: droppedId,
          kind: 'shared-by',
          entity,
          label: dotJoin(corners),
          pathLabels: [dotJoin(corners)],
          pathIds: [keptId], // the ONE live wall — the shared place
          typing: corners.length > 0 && corners.every(seedStoryV) ? 'born' : 'derived',
          sourceVertexIds: [...corners],
        });
      }
    };
    for (const e of shape.edges) readSharedBy('edge', e.id, e.data, e.vertexIds);
    for (const f of shape.faces) readSharedBy('face', f.id, f.data, f.vertexIds);
    return [...rows.values()].sort((a, b) => a.id.localeCompare(b.id));
  })();

  // the ABSORBED partners: parent edges absent from the child — identified
  // into a surviving class by the birth word (never "dead"); listed by their
  // own endpoint letters. True vertex deaths counted separately.
  const childEdgeIds = new Set(shape.edges.map((e) => e.id));
  const absorbedRelations = parent
    ? parent.edges.filter((e) => !childEdgeIds.has(e.id)).map((e) => endpointLetters(e.vertexIds))
    : [];
  const absorbedVertexIds = new Set(conceptRows.flatMap((r) => r.sourceIds));
  // M3 — the died IDENTITIES first (the ONE filter), the count derived from
  // them: a parent vertex absent from the child and absorbed by no child row
  // is a true death; its label resolves through ITS OWN packet (the identity
  // law — the memorial names the concept, never an index).
  const diedConceptRows = parent
    ? Object.keys(parent.vertices)
        .filter((id) => !shape.vertices[id] && !absorbedVertexIds.has(id))
        .sort()
        .map((id) => ({ id, label: rootDisplayBase(id) }))
    : [];
  const diedConcepts = diedConceptRows.length;

  // THE GRAIN LAW: the lift's own honest marks, read off the lifted copies'
  // data (never re-derived here — the detection lived at the source)
  const grainMarks = [
    ...new Set(
      [
        ...shape.edges.map((e) => e.data?.['grainMark']),
        ...shape.faces.map((f) => f.data?.['grainMark']),
      ].filter((m): m is string => typeof m === 'string' && m.length > 0),
    ),
  ];

  // the words-line — counts, mechanical (the designer's wording rides later)
  const words = parent
    ? `${Object.keys(parent.vertices).length} concepts become ${conceptRows.length} · ${parent.edges.length} relations become ${relationRows.length}${
        absorbedRelations.length > 0 ? ` · ${absorbedRelations.length} absorbed` : ''
      }${diedConcepts > 0 ? ` · ${diedConcepts} die` : ''}`
    : liftedForm
      ? `${conceptRows.length} concepts, ${relationRows.length} ${
          composedRelationRows.length > 0 ? 'finer relations' : 'relations'
        }${
          // THE TWO-SIDED BAR (Phase C): the count never hides the recorded
          // coarse relations — "9 finer + 3 composed seed", never a bare 9
          composedRelationRows.length > 0
            ? ` + ${composedRelationRows.length} composed seed relation${composedRelationRows.length === 1 ? '' : 's'}`
            : ''
        } — lifted whole${grainMarks.length > 0 ? ' · finer structure not carried' : ''}`
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
            // the valence split: boundary +δ = the rim turning (never a
            // cone); interior +δ = a cone; −δ = a saddle either way
            kind:
              r.valence === 'boundary' && r.curvature > 0
                ? ('rim-turn' as const)
                : r.curvature > 0
                  ? ('cone' as const)
                  : ('saddle' as const),
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
      // the lift's gloss names its SPECIFIC source ("lifted from <source>" —
      // the sealed header phrase); every other op keeps its word, with the
      // reasoned `the <op> move` fall-through (never silent)
      gloss: liftedForm ? `lifted from ${sourceNameFor(form)}` : (OP_WORDS[op] ?? `the ${op} move`),
    },
    conceptRows,
    relationRows,
    absorbedRelations,
    diedConcepts,
    diedConceptRows,
    words,
    wordRows,
    incidence,
    stance,
    verdict,
    gloss,
    refusal,
    declare,
    grainMarks,
    composedRelationRows,
    // the receipt: which existing card rows demote under the hairline (the
    // view filters its OWN rows by these labels — nothing re-derived here)
    certificateLabels: ['χ', 'χ (certified)', 'class', 'name', 'H₁', 'w₁', 'genus', 'b₁'],
  };
}
