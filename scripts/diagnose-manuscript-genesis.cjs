#!/usr/bin/env node

// DIAGNOSTIC — Manuscript Phase 3b (the final build): the manuscript's MEMORY
// is the engine's own (anti-mock: transpile-hook require of the real .ts).
//
//   · BIRTH === the CO-RATIFIED CONNECTED SUM (COMBINE IS THE CONNECTED SUM,
//     engineer-chartered 2026-07-12, superseding the raw-assemble door):
//     birthChild's child is BYTE-IDENTICAL to connectedSum on the same pair
//     with the SAME person-picked port faces; the pair GATE stays
//     canAssemblePair / getAssemblePairDisabledReason verbatim, and the door
//     additionally REFUSES BY NAME without a picked port face on each side
//     (no faces[0] default — the array-order defect stays dead). Two invoked
//     SQUARES — the old fixture — now refuse honestly (a single-face form has
//     no face to spare; the raw assemble of them was never a connected sum).
//     Full battery: diagnose-combine-is-connected-sum.cjs.
//   · PENTIMENTO === the DAG's consumed population: assemble parents die;
//     a glue parent dies; DUALIZATION does not consume (NON_CONSUMING) — the
//     pencil set is buildGenealogyDag(...).liveAtEnd's complement, never a
//     chosen visual state.
//   · STEMMA === the committed GenealogyEdges, Q3 transitive-reduced.
//   · THE RECORD === the same reduced committed DAG: on the two-generation
//     fixture (a+b → child; child+c → grandchild) the record carries the
//     direct-parent edges ONLY — no grandparent shortcut — with the DAG's
//     integrity verdict surfaced.
//   · THE SHELF === the committed snapshot pipeline: serializeSnapshot →
//     deserializeSnapshot (source-namespaced, E1: co-location ≠ identity —
//     the SAME file loaded as two universes yields DISJOINT forms, and the
//     cross-universe combine is LEGAL); a loaded word-born quotient is
//     HONESTLY unplaceable (bookkeeping positions, no parent to replay).

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        esModuleInterop: true,
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
      fileName: filename,
    }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const {
  canAssemblePair,
  getAssemblePairDisabledReason,
} = req('src/playground/playgroundOperations.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { transitiveReduceEdges } = req('src/playground/genealogyLayout.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const {
  birthChild,
  birthGateFor,
  combineGateFor,
  footRecord,
  genesisStoryShapes,
  loadUniverseSnapshot,
  placeShelfEntry,
  readGenesis,
} = req('src/manuscript/genesisModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

// fixtures — COMBINE IS THE CONNECTED SUM (2026-07-12): the combine door now
// needs multi-face forms (a square has no face to spare) with PICKED port
// faces; the tori are distinct-universe immersion copies. The squares stay as
// the honest-refusal fixture and for the single-parent (word-op) sections.
const { serializeSnapshot: ser, deserializeSnapshot: deser } = req('src/playground/snapshot.ts');
const torusOf = (prefix) => deser(ser(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix)).shape;
const tA = torusOf('mgA');
const tB = torusOf('mgB');
const tC = torusOf('mgC');
const asWritten = (shape) => ({ form: { id: shape.id, title: shape.name, shape, parentShape: null, opId: null, provenance: '', render: null } });
const a = invokePrimitive('square', 1);
const b = invokePrimitive('square', 2);
const c = invokePrimitive('triangle', 3);

// ----- birth === the co-ratified connected sum --------------------------------
{
  console.log('----- [birth] the CONNECTED SUM behind the door, byte-identical, port-gated by name -----');
  const gate = birthGateFor(tA, tB);
  check('the pair gate: two distinct-universe tori are LEGAL (canAssemblePair true, reason null — verbatim committed)',
    gate.legal === true && gate.reason === null && canAssemblePair(tA, tB));
  const noPorts = combineGateFor(tA, tB, null, null);
  check('⛔ NO PORT FACE ⇒ the gate REFUSES BY NAME (never a faces[0] fallback — the seam location is the person\'s choice, not array order)',
    noPorts.legal === false && /PORT FACE/.test(noPorts.reason) && /array-order artifact/.test(noPorts.reason));
  const faceA = tA.faces[5];
  const faceB = tB.faces[11];
  const mine = birthChild(tA, tB, 4, faceA, faceB, 8);
  const direct = connectedSum(torusOf('mgA'), torusOf('mgB'), { faceA, faceB }).shape;
  check('the child === connectedSum on the SAME picked ports, BYTE-IDENTICAL (the co-ratified macro, not a fork; opId connect-sum; the csum: seam marker in the birth id)',
    mine.ok && JSON.stringify(mine.born.shape) === JSON.stringify(direct) &&
    mine.born.opId === 'connect-sum' && mine.born.shape.id.includes('csum:'));
  check('the child is a multi-parent ROOT (parentShapeId null — committed semantics) carrying BOTH parents on the written record, committed argument order',
    mine.ok && mine.born.shape.genealogy.parentShapeId === null &&
    Array.isArray(mine.born.parentShapes) &&
    mine.born.parentShapes.length === 2 && mine.born.parentShapes[0].id === tA.id && mine.born.parentShapes[1].id === tB.id);
  check('★ THE DELIVERABLE: the person\'s genus-2 — certified "genus 2 (closed, orientable)", χ=−2, rendered as the honest CLASS BODY ("genus 2 — born")',
    mine.ok && mine.born.render.mode === 'classBody' &&
    mine.born.render.model.components[0].label === 'genus 2' &&
    mine.born.title === 'genus 2 — born' &&
    (() => {
      const inv = readFormInvariants(mine.born.shape, [tA, tB]);
      return inv.classification === 'genus 2 (closed, orientable)' && inv.chiCertified === -2;
    })());
  check('the mode is INERT and NOT OFFERED: no mode reaches the door, none leaks into title/provenance as a choice — its inertness is STATED as a computed fact (the seam separates), and the seam is DISCLOSED (recorded on the child\'s complex; not drawable on the class body)',
    mine.ok && !/preserving|reversing/.test(mine.born.title) &&
    /INERT/.test(mine.born.provenance) && /separates/.test(mine.born.provenance) &&
    /recorded on the child's complex/.test(mine.born.provenance) && /not drawable on the class body/.test(mine.born.provenance));
  // the OLD fixture, now the honest refusal: a square has no face to spare
  const squares = birthChild(a.shape, b.shape, 5, a.shape.faces[0], b.shape.faces[0], 8);
  check('two invoked SQUARES now REFUSE honestly (single face — cutting the only face leaves no surface; the subdivide path named): the raw-assemble union of them was never a connected sum',
    squares.ok === false && /single face/.test(squares.reason) && /Subdivide first/.test(squares.reason));
  const sameGate = birthGateFor(tA, tA);
  check("gate: the SAME form twice → the committed 'Pick a DIFFERENT form' reason, verbatim",
    !sameGate.legal && sameGate.reason === getAssemblePairDisabledReason(tA, tA) &&
    /DIFFERENT form/.test(sameGate.reason));
  const { loadForm } = req('src/lib/multiform.ts');
  const { nGon } = req('src/playground/primitiveCatalogue.ts');
  const plainSquare = loadForm(nGon(4)); // PLAIN ids (no source) — v0..v3
  const plainTriangle = loadForm(nGon(3)); // PLAIN ids too — overlapping v0..v2, distinct shape ids
  const clashGate = birthGateFor(plainSquare, plainTriangle);
  check("gate: shared vertex ids → the committed disjoint-universes reason (co-location ≠ identity), verbatim",
    !clashGate.legal && clashGate.reason === getAssemblePairDisabledReason(plainSquare, plainTriangle) &&
    /DISTINCT sources/.test(clashGate.reason));
  note(mine.ok ? `child: ${mine.born.shape.id.slice(0, 90)}…` : `UNEXPECTED: ${mine.reason}`);
}

// ----- pentimento === the DAG's consumed -------------------------------------
{
  console.log('----- [pentimento] the really-consumed, per the committed DAG -----');
  const child = birthChild(tA, tB, 5, tA.faces[5], tB.faces[11], 8);
  const written = [
    asWritten(tA),
    asWritten(tB),
    { form: child.born },
  ];
  const genesis = readGenesis(genesisStoryShapes(written));
  check('the connect-sum consumes: BOTH parents are pentimenti (two ghosts owed, two recorded); the child is live',
    genesis && genesis.pentimentoIds.has(tA.id) && genesis.pentimentoIds.has(tB.id) &&
    !genesis.pentimentoIds.has(child.born.shape.id) &&
    JSON.stringify(genesis.dag.liveAtEnd) === JSON.stringify([child.born.shape.id]));
  check('the pentimento set === the DAG liveAtEnd complement (no chosen visual state)',
    genesis && [...genesis.pentimentoIds].sort().join(',') ===
      genesisStoryShapes(written).map((s) => s.id).filter((id) => !genesis.dag.liveAtEnd.includes(id)).sort().join(','));
  // a glue parent is consumed too (glue ∉ NON_CONSUMING)
  const sq = invokePrimitive('square', 6);
  const glueBorn = applyPlaygroundOperationTo('glue-cylinder', sq.shape, null, 7, 8);
  const glueGenesis = readGenesis(genesisStoryShapes([{ form: sq }, { form: glueBorn.born }]));
  check('a glue parent settles to pencil (glue consumes, per the engine)',
    glueGenesis && glueGenesis.pentimentoIds.has(sq.shape.id) && !glueGenesis.pentimentoIds.has(glueBorn.born.shape.id));
  // dualization does NOT consume (the committed NON_CONSUMING set)
  const torus = immerseSurface({ surface: 'torus', resolution: 8 });
  const dualBorn = applyPlaygroundOperationTo('dual', torus.shape, null, 8, 8);
  const dualGenesis = readGenesis([torus.shape, dualBorn.born.shape]);
  check('dualization does NOT consume: the dualized torus stays live (both live)',
    dualGenesis && dualGenesis.pentimentoIds.size === 0 && dualGenesis.dag.liveAtEnd.length === 2);
  note(`assemble deaths: ${genesis ? [...genesis.pentimentoIds].length : '?'} | dual deaths: ${dualGenesis ? dualGenesis.pentimentoIds.size : '?'}`);
}

// ----- stemma + record === the committed reduced DAG -------------------------
{
  console.log('----- [record] the foot-marginalia === transitiveReduceEdges(buildGenealogyDag) -----');
  const child = birthChild(tA, tB, 10, tA.faces[5], tB.faces[11], 8);
  const grand = birthChild(child.born.shape, tC, 11, child.born.shape.faces[7], tC.faces[3], 8);
  check('the two-generation birth chain is legal end to end (child # tC → grandchild — the connect-sum CHAINS)',
    grand.ok === true);
  const written = [asWritten(tA), asWritten(tB), asWritten(tC), { form: child.born }, { form: grand.born }];
  const story = genesisStoryShapes(written);
  const genesis = readGenesis(story);
  const directReduced = transitiveReduceEdges(buildGenealogyDag(story));
  check('stemma edges === the committed reduced edges, verbatim',
    genesis && JSON.stringify(genesis.reducedEdges) === JSON.stringify(directReduced));
  check('DAG integrity ACCEPTED (acyclic, lineage ⊆ parents) — surfaced, not hidden',
    genesis && genesis.accepted === true && genesis.violations.length === 0);
  const names = new Map(story.map((s) => [s.id, s.name]));
  const record = footRecord(genesis, (id) => names.get(id) ?? id);
  check('the record carries the two births, assemble-labelled, direct parents only',
    record.length === 2 && record.every((e) => e.operation === 'assemble') &&
    record[0].parents.length === 2 && record[1].parents.length === 2);
  check('NO grandparent shortcut: the grandchild’s record parents are {child, tC} — never tA or tB',
    Boolean(genesis) && (() => {
      const grandEntry = record.find((e) => e.childId === grand.born.shape.id);
      const parentIds = grandEntry ? grandEntry.parents.map((p) => p.id).sort() : [];
      return (
        JSON.stringify(parentIds) === JSON.stringify([child.born.shape.id, tC.id].sort()) &&
        !parentIds.includes(tA.id) &&
        !parentIds.includes(tB.id)
      );
    })());
  note(record.map((e) => `${e.parents.map((p) => p.name).join(' + ')} ─${e.operation}→ ${e.childName}`).join('  ·  '));
}

// ----- the sources shelf === the committed snapshot pipeline ------------------
{
  console.log('----- [shelf] the committed snapshot load — source-namespaced, honest refusals -----');
  const tri = invokePrimitive('triangle', 20);
  const file = serializeSnapshot(tri.shape, 'ambo-u1');
  const mine = loadUniverseSnapshot(file);
  const direct = deserializeSnapshot(file);
  check('the loaded form === deserializeSnapshot, verbatim (shape + provenance)',
    JSON.stringify(mine.loaded) === JSON.stringify(direct) && mine.placeable === true);
  check('E1 source-namespacing: every loaded id carries the universe prefix',
    Object.keys(mine.loaded.shape.vertices).every((id) => id.startsWith('ambo-u1:')));
  const asU2 = loadUniverseSnapshot(file, 'ambo-u2');
  check('co-location ≠ identity: the SAME file as a second universe is DISJOINT — and the cross-universe combine is LEGAL',
    Object.keys(asU2.loaded.shape.vertices).every((id) => id.startsWith('ambo-u2:')) &&
    canAssemblePair(mine.loaded.shape, asU2.loaded.shape) === true);
  const placed = placeShelfEntry(mine, 21);
  check('placing a shelf entry yields the loaded committed Shape, source-tagged (a name, not a doorway)',
    placed.shape === mine.loaded.shape && /ambo-u1/.test(placed.provenance) && placed.parentShape === null);
  // a loaded word-born quotient: honestly unplaceable
  const sq = invokePrimitive('square', 22);
  const born = applyPlaygroundOperationTo('glue-torus', sq.shape, null, 23, 8);
  const bornFile = serializeSnapshot(born.born.shape, 'ambo-u3');
  const refused = loadUniverseSnapshot(bornFile);
  check('a loaded glue-born quotient is UNPLACEABLE with the honest reason (bookkeeping positions, no parent to replay)',
    refused.placeable === false && /refusing to draw/.test(refused.reason) && refused.render === null);
  // a loaded cut-born skeleton: real positions pass through → placeable
  const cutBorn = applyPlaygroundOperationTo('cut', invokePrimitive('pentagon', 24).shape, null, 25, 8);
  const cutFile = serializeSnapshot(cutBorn.born.shape, 'ambo-u4');
  const cutLoaded = loadUniverseSnapshot(cutFile);
  check('a loaded cut-born SKELETON is placeable (real pass-through positions; level-1 H₁ = ℤ)',
    cutLoaded.placeable === true && cutLoaded.render && cutLoaded.render.mode === 'skeleton' &&
    cutLoaded.render.model.h1Label === 'ℤ');
  note(`refusal: ${refused.reason}`);
}

console.log(
  failures === 0
    ? '\n--- manuscript genesis (3b: birth===assemble · pentimento===consumed · stemma/record===committed DAG · shelf===committed load): no failures ---\n\nALL PASS'
    : `\n--- manuscript genesis: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;
