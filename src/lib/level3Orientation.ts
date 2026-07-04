// level3Orientation — Build 2: the oriented INTEGER chain complex (the shared foundation).
//
// From a Build-1 `Level3Complex`, build the signed incidence matrices
// ∂₁ (E→V), ∂₂ (F→E), ∂₃ (C→F) over the IDENTIFIED classes — Tier-2 w₁ is this
// foundation's mod-2 shadow, Tier-3 homology its Smith normal form. Everything
// is DERIVED, nothing assumed:
//
//   · Local orientations: an edge by its stored endpoint order; a face by its
//     stored boundary cycle; a cell by a PROPAGATED consistent orientation of
//     its boundary surface (adjacent faces are consistently oriented iff they
//     traverse their shared edge in OPPOSITE directions — BFS from the first
//     face; disconnected/inconsistent boundaries throw). The committed cube's
//     faces happen to be outward-consistent (every ε=+1) — measured, not assumed.
//   · Class cells: each identified class is ONE cell of the quotient, oriented
//     by its lexicographically-least member (the REP). Every other member
//     carries a RELATIVE DIRECTION vs the rep, read off Build 1's flag algebra
//     (edge members: END classes — tails-with-tails ⇒ +1, tails-with-heads ⇒ −1,
//     ambiguous ⇒ a fold, thrown; face members: the pairing map's cycle STEP).
//   · The researcher's §3 convention: a face-gluing is orientation-REVERSING
//     (the orientable kind) iff step · ε(faceA) · ε(faceB) = −1 — i.e. the map
//     carries the induced (outward) orientation of faceA onto the OPPOSITE of
//     faceB's. `mode:'preserving'` names the ambient identification (the T³
//     translations) and corresponds to reverses=true — exactly the level-2
//     'preserving'-seam convention one dimension up. The per-pairing bit is
//     exported; Tier-2 consumes it as the w₁ support, ∂₃ consumes it as signs
//     (a reversing gluing cancels the pair's net ∂₃ contribution; a
//     non-reversing one leaves ±2 — the torsion source).
//
// FORBIDDEN-held: `globalW1.ts`, level-2, Build-1 modules byte-unchanged —
// Build 1's class lookups are consumed as-is; no invariant it emits is redone.

import type { FacePairing, Level3Complex } from './faceIdentification';

export interface OrientedChainComplex {
  // class reps (lexicographically-least member), in matrix order
  vertexReps: string[];
  edgeReps: string[];
  faceReps: string[];
  cellIds: string[];
  // signed incidence over classes: d1[vRow][eCol], d2[eRow][fCol], d3[fRow][cCol]
  d1: number[][];
  d2: number[][];
  d3: number[][];
  // the per-pairing orientation bits (the Tier-2 support + the ∂₃ sign source)
  gluings: {
    index: number;
    faceA: string;
    faceB: string;
    mode: FacePairing['mode'];
    step: 1 | -1; // the map's cycle direction (faceA cycle → faceB cycle)
    epsilonA: 1 | -1; // faceA's stored cycle vs its cell's propagated boundary orientation
    epsilonB: 1 | -1;
    reversesInducedOrientation: boolean; // step·εA·εB === −1 (the orientable kind)
    modeConsistent: boolean; // mode 'preserving' ⟺ reverses (the §3 convention)
  }[];
  // ε per ORIGINAL face (relative to its cell's propagated boundary orientation)
  epsilonOf: Record<string, 1 | -1>;
}

function classGroups(items: string[], classOf: (id: string) => string): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const id of items) {
    const root = classOf(id);
    const list = groups.get(root);
    if (list) list.push(id);
    else groups.set(root, [id]);
  }
  for (const list of groups.values()) list.sort((a, b) => a.localeCompare(b));
  return groups;
}

const zero = (rows: number, cols: number): number[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));

export function buildOrientedChainComplex(complex: Level3Complex): OrientedChainComplex {
  // ---- class groups + reps (deterministic: lexicographic least member) ----
  const vGroups = classGroups(complex.originalVertices, complex.vertexClassOf);
  const eGroups = classGroups(complex.originalEdges.map((e) => e.id), complex.edgeClassOf);
  const fGroups = classGroups(complex.originalFaces.map((f) => f.id), complex.faceClassOf);
  const vertexReps = [...vGroups.values()].map((g) => g[0]).sort((a, b) => a.localeCompare(b));
  const edgeReps = [...eGroups.values()].map((g) => g[0]).sort((a, b) => a.localeCompare(b));
  const faceReps = [...fGroups.values()].map((g) => g[0]).sort((a, b) => a.localeCompare(b));
  const cellIds = complex.cells.map((c) => c.id);

  const vRow = new Map(vertexReps.map((r, i) => [complex.vertexClassOf(r), i]));
  const eRow = new Map(edgeReps.map((r, i) => [complex.edgeClassOf(r), i]));
  const fRow = new Map(faceReps.map((r, i) => [complex.faceClassOf(r), i]));

  const edgeById = new Map(complex.originalEdges.map((e) => [e.id, e]));
  const faceById = new Map(complex.originalFaces.map((f) => [f.id, f]));
  const edgeRepOfClass = new Map<string, string>();
  for (const reps of edgeReps) edgeRepOfClass.set(complex.edgeClassOf(reps), reps);
  const faceRepOfClass = new Map<string, string>();
  for (const reps of faceReps) faceRepOfClass.set(complex.faceClassOf(reps), reps);

  // ---- relative direction of an original edge vs its CLASS REP (END classes) ----
  const edgeRelDir = (edgeId: string): 1 | -1 => {
    const rep = edgeRepOfClass.get(complex.edgeClassOf(edgeId)) as string;
    if (rep === edgeId) return 1;
    const e = edgeById.get(edgeId) as { id: string; a: string; b: string };
    const r = edgeById.get(rep) as { id: string; a: string; b: string };
    const tailsTogether = complex.endClassOf(e.id, e.a) === complex.endClassOf(r.id, r.a);
    const tailToHead = complex.endClassOf(e.id, e.a) === complex.endClassOf(r.id, r.b);
    if (tailsTogether && tailToHead) {
      throw new Error(`level3Orientation: edge class of ${edgeId} is FOLDED onto itself — outside the oriented-chain scope`);
    }
    if (tailsTogether) return 1;
    if (tailToHead) return -1;
    throw new Error(`level3Orientation: edge ${edgeId} shares a class with ${rep} but their ends do not correspond`);
  };

  // ---- ε per original face: propagate a consistent orientation over each cell's boundary ----
  // adjacent faces are CONSISTENT iff they traverse their shared edge in opposite directions.
  const traversalDir = (faceId: string, edgeId: string): 1 | -1 => {
    const f = faceById.get(faceId) as { id: string; cycle: string[] };
    const n = f.cycle.length;
    for (let k = 0; k < n; k += 1) {
      if (complex.edgeOfFaceSlot(faceId, k) === edgeId) {
        const e = edgeById.get(edgeId) as { a: string; b: string };
        return f.cycle[k] === e.a && f.cycle[(k + 1) % n] === e.b ? 1 : -1;
      }
    }
    throw new Error(`level3Orientation: edge ${edgeId} is not on face ${faceId}`);
  };
  const epsilonOf: Record<string, 1 | -1> = {};
  for (const cell of complex.cells) {
    const cellFaces = complex.originalFaces.filter((f) => f.cellId === cell.id);
    // face adjacency within the cell via shared ORIGINAL edges
    const facesAtEdge = new Map<string, string[]>();
    for (const f of cellFaces) {
      for (let k = 0; k < f.cycle.length; k += 1) {
        const edgeId = complex.edgeOfFaceSlot(f.id, k);
        const list = facesAtEdge.get(edgeId);
        if (list) list.push(f.id);
        else facesAtEdge.set(edgeId, [f.id]);
      }
    }
    const queue: string[] = [cellFaces[0].id];
    epsilonOf[cellFaces[0].id] = 1;
    while (queue.length) {
      const current = queue.shift() as string;
      const f = faceById.get(current) as { id: string; cycle: string[] };
      for (let k = 0; k < f.cycle.length; k += 1) {
        const edgeId = complex.edgeOfFaceSlot(current, k);
        for (const other of facesAtEdge.get(edgeId) ?? []) {
          if (other === current) continue;
          // consistent ⇔ opposite traversal ⇔ ε(other) = −ε(current)·(same-traversal sign)
          const same = traversalDir(current, edgeId) === traversalDir(other, edgeId);
          const expected = (same ? -1 : 1) * epsilonOf[current];
          if (epsilonOf[other] === undefined) {
            epsilonOf[other] = expected as 1 | -1;
            queue.push(other);
          } else if (epsilonOf[other] !== expected) {
            throw new Error(
              `level3Orientation: cell ${cell.id}'s boundary surface is NOT orientable/consistent at faces ${current} ~ ${other}`,
            );
          }
        }
      }
    }
    for (const f of cellFaces) {
      if (epsilonOf[f.id] === undefined) {
        throw new Error(`level3Orientation: cell ${cell.id}'s boundary surface is disconnected at face ${f.id}`);
      }
    }
  }

  // ---- the pairing STEP (map cycle direction) + relative face directions vs class reps ----
  const stepOf = (pairing: FacePairing): 1 | -1 => {
    const fA = faceById.get(pairing.faceA) as { cycle: string[] };
    const fB = faceById.get(pairing.faceB) as { cycle: string[] };
    const n = fB.cycle.length;
    const pos = new Map(fB.cycle.map((v, i) => [v, i]));
    const p0 = pos.get(pairing.map[fA.cycle[0]]) as number;
    const p1 = pos.get(pairing.map[fA.cycle[1]]) as number;
    return ((p1 - p0 + n) % n) === 1 ? 1 : -1; // Build-1 validation guarantees ±1 steps
  };
  const faceRelDirOfMember = new Map<string, 1 | -1>(); // original face -> dir vs ITS class rep
  for (const rep of faceReps) faceRelDirOfMember.set(rep, 1);
  const gluings: OrientedChainComplex['gluings'] = complex.pairings.map((pairing, index) => {
    const step = stepOf(pairing);
    const epsilonA = epsilonOf[pairing.faceA];
    const epsilonB = epsilonOf[pairing.faceB];
    const rep = faceRepOfClass.get(complex.faceClassOf(pairing.faceA)) as string;
    const member = rep === pairing.faceA ? pairing.faceB : pairing.faceA;
    // the member's stored cycle vs the rep's, THROUGH the map: step is symmetric
    // for a cyclic bijection, so the member's relative direction IS the step.
    faceRelDirOfMember.set(member, step);
    const reversesInducedOrientation = step * epsilonA * epsilonB === -1;
    return {
      index,
      faceA: pairing.faceA,
      faceB: pairing.faceB,
      mode: pairing.mode,
      step,
      epsilonA,
      epsilonB,
      reversesInducedOrientation,
      // the §3 convention: 'preserving' (ambient identification) ⟺ reverses induced
      modeConsistent: (pairing.mode === 'preserving') === reversesInducedOrientation,
    };
  });

  // ---- ∂₁ (E → V): the class edge is the REP's oriented edge ----
  const d1 = zero(vertexReps.length, edgeReps.length);
  edgeReps.forEach((repId, col) => {
    const rep = edgeById.get(repId) as { a: string; b: string };
    const headRow = vRow.get(complex.vertexClassOf(rep.b)) as number;
    const tailRow = vRow.get(complex.vertexClassOf(rep.a)) as number;
    d1[headRow][col] += 1;
    d1[tailRow][col] -= 1;
  });

  // ---- ∂₂ (F → E): walk the REP face's boundary; each slot contributes
  // (slot direction vs the original edge) × (that edge's direction vs ITS class rep)
  const d2 = zero(edgeReps.length, faceReps.length);
  faceReps.forEach((repId, col) => {
    const f = faceById.get(repId) as { id: string; cycle: string[] };
    const n = f.cycle.length;
    for (let k = 0; k < n; k += 1) {
      const edgeId = complex.edgeOfFaceSlot(repId, k);
      const slotDir = traversalDir(repId, edgeId);
      const row = eRow.get(complex.edgeClassOf(edgeId)) as number;
      d2[row][col] += slotDir * edgeRelDir(edgeId);
    }
  });

  // ---- ∂₃ (C → F): each original boundary face contributes ε(face) × (its
  // direction vs its class rep) to its class row ----
  const d3 = zero(faceReps.length, cellIds.length);
  complex.cells.forEach((cell, col) => {
    for (const f of complex.originalFaces) {
      if (f.cellId !== cell.id) continue;
      const relDir = faceRelDirOfMember.get(f.id);
      if (relDir === undefined) {
        throw new Error(`level3Orientation: face ${f.id} has no direction vs its class rep (unpaired non-rep member?)`);
      }
      const row = fRow.get(complex.faceClassOf(f.id)) as number;
      d3[row][col] += epsilonOf[f.id] * relDir;
    }
  });

  return { vertexReps, edgeReps, faceReps, cellIds, d1, d2, d3, gluings, epsilonOf };
}
