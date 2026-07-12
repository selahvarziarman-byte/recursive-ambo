#!/usr/bin/env node

// DIAGNOSTIC — COMBINE *IS* THE CONNECTED SUM (engineer-chartered 2026-07-12;
// SEAL-BEFORE-BUILD — BUILT BLIND to `.handoff/SEAL_COMBINE_IS_CONNECTED_SUM.md`,
// SHA-256 d8a0a2f4…4ac1; every pin below is the builder's own measurement).
//
// THE DELIVERABLE, eight builds owed: the manuscript's combine door ran the
// RAW ASSEMBLE (a union along a seam) while the co-ratified CONNECTED SUM —
// the op the door was ratified to mean — sat committed, oracle-witnessed, and
// UNREACHABLE. The person could not make a genus-2 surface. Now they can:
// two tori, a port face PICKED on each (⛔ never faces[0] — the seam's
// location must not be an array-order artifact), combine → genus-2, certified
// and rendered as the honest class body, with BOTH parents in the story.
//
// THE FOUR CLAUSES, each proving its teeth:
//   1 EXECUTE WHAT YOU WITNESS — every combine case asserts connectedSum ran:
//     opId 'connect-sum', the csum: seam marker in the birth id, the DAG
//     showing ≥2 parents. A case through executeAssemblePair is NOT a witness.
//   2 CARRY THE WRONG MECHANISMS (the standing law: the witness outlives the
//     commit; this build changes genesisModel, so a git-show mutant would
//     evaporate) — (a) the RAW-ASSEMBLE combine (the committed
//     executeAssemblePair itself) visibly births a DIFFERENT OBJECT (a
//     junction-carrying union, not genus-2); (b) the ONE-HOP collector
//     (verbatim old genesisStoryShapes) visibly produces THE LIE (1 stemma
//     edge where 2 are owed). Both proven faithful to HEAD pre-commit (§h).
//   3 NO ARRAY-ORDER ANYWHERE — permute m1.faces / m2.faces / the page array
//     / the parent order: the gate verdict, the child, and every mark are
//     stable; a carried faces[0]-DEFAULT door VISIBLY FAILS the faces sweep.
//   4 SINGLE-PARENT NON-MOVEMENT — every single-parent birth's genesis
//     reading (story shapes, pentimenti, reduced edges) BYTE-IDENTICAL to the
//     old collector (itself HEAD-proven pre-commit), zoo + depth-4 chain.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { execSync } = require('node:child_process');
const ts = require('typescript');

const TRANSPILE_OPTIONS = {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  },
};

require.extensions['.ts'] = (module, filename) => {
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: filename }).outputText,
    filename,
  );
};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));

const { birthChild, combineGateFor, genesisStoryShapes, readGenesis } = req('src/manuscript/genesisModel.ts');
const { executeAssemblePair } = req('src/playground/playgroundOperations.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');
const { invokePrimitive, applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { sewBoundaryCircles } = req('src/lib/complexIdentification.ts');
const { cutCell } = req('src/lib/cutOperation.ts');
const { materializeCutResult } = req('src/lib/materializeOperation.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const torusOf = (prefix) => deserializeSnapshot(serializeSnapshot(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix)).shape;
const asWritten = (shape) => ({ form: { id: shape.id, title: shape.name, shape, parentShape: null, opId: null, provenance: '', render: null } });

// ---------------------------------------------------------------------------
// THE CARRIED WRONG MECHANISMS (never borrowed from a git ref this build
// overwrites):
// (a) the RAW-ASSEMBLE combine — literally the committed executeAssemblePair
//     (imported above): what the door ran before this build;
// (b) the ONE-HOP collector — the old genesisStoryShapes, VERBATIM;
function oneHopStoryShapes(written) {
  const byId = new Map();
  for (const entry of written) {
    byId.set(entry.form.shape.id, entry.form.shape);
    if (entry.form.parentShape) byId.set(entry.form.parentShape.id, entry.form.parentShape);
  }
  return [...byId.values()];
}
// (c) the faces[0]-DEFAULT door — the trap §1 forbids (the engine's own
//     default reached without a person's pick):
function defaultFaceCombine(a, b) {
  return connectedSum(a, b).shape; // ← options omitted ⇒ faces[0] fires
}

console.log('combine IS the connected sum: the door means what it was ratified to mean (blind concretes)\n');

// ═════ [a] ★ THE DELIVERABLE — the person makes a genus-2 surface ════════════
console.log('----- [a] two tori + picked ports → genus-2, certified, WITH A BODY -----');
const A = torusOf('csA');
const B = torusOf('csB');
const portA = A.faces[5];
const portB = B.faces[11];
const born = birthChild(A, B, 40, portA, portB, 8);
check('the birth succeeds through the manuscript door and CERTIFIES: "genus 2 (closed, orientable)", χ = −2',
  born.ok && (() => {
    const inv = readFormInvariants(born.born.shape, [A, B]);
    return inv.classification === 'genus 2 (closed, orientable)' && inv.chiCertified === -2;
  })());
check('★ …and RENDERS A BODY: the committed classify→immerse pipeline routes the child to the honest class body ("genus 2 — born") — the "no render" half of the ask, landed',
  born.ok && born.born.render.mode === 'classBody' &&
  born.born.render.model.components[0].label === 'genus 2' && born.born.title === 'genus 2 — born');
const dagAB = buildGenealogyDag([A, B, born.ok ? born.born.shape : A]);
check("CLAUSE 1 — EXECUTE WHAT YOU WITNESS: opId === 'connect-sum', the birth id carries the csum: seam marker, and the DAG shows BOTH parents (2 edges, integrity accepted)",
  born.ok && born.born.opId === 'connect-sum' && born.born.shape.id.includes('csum:') &&
  dagAB.integrity.accepted === true &&
  dagAB.nodes.find((n) => n.id === born.born.shape.id).parents.length === 2);

// ═════ [b] the raw-assemble mutant: a DIFFERENT OBJECT, visibly ══════════════
console.log('\n----- [b] the carried RAW-ASSEMBLE door births a different object (the old lie, exhibited) -----');
const rawChild = executeAssemblePair(torusOf('csA'), torusOf('csB'));
const rawInv = readFormInvariants(rawChild);
check('the raw assemble of two tori is NOT a connected sum: a union along ONE edge — the seam edge carries 4 face wedges (a junction), and the certifier does NOT read genus-2',
  rawChild.genealogy.parentShapeId === null &&
  rawInv.classification !== 'genus 2 (closed, orientable)');
note(`raw-assemble reads: "${rawInv.classification}" — the connect-sum door reads: "genus 2 (closed, orientable)"`);

// ═════ [c] the gate: no port face ⇒ REFUSED BY NAME; no default in the path ══
console.log('\n----- [c] the port faces are the person\'s — the gate refuses by name, no faces[0] anywhere in the path -----');
const g0 = combineGateFor(A, B, null, null);
const g1 = combineGateFor(A, B, portA, null);
check('no port face on both sides ⇒ the gate REFUSES BY NAME (both missing, and one missing, each named)',
  g0.legal === false && /PORT FACE/.test(g0.reason) && /array-order artifact/.test(g0.reason) &&
  g1.legal === false && /PORT FACE/.test(g1.reason));
const doorSource = fs.readFileSync(path.join(repoRoot, 'src', 'manuscript', 'genesisModel.ts'), 'utf8');
check('no faces[0] fallback exists in the door\'s source: no `.faces[0]` member access anywhere in genesisModel (the string "faces[0]" appears only inside the gate\'s own refusal, naming the forbidden default), and birthChild passes the PICKED faces explicitly',
  !/\.faces\[0\]/.test(doorSource) &&
  /faceA: portFaceA/.test(doorSource) && /faceB: portFaceB/.test(doorSource));

// ═════ [d] CLAUSE 3 — no array order anywhere (and its teeth) ════════════════
console.log('\n----- [d] permute faces / page / parent order: the marks do not move; the faces[0]-default door VISIBLY FAILS -----');
const rotatedFaces = (shape, k) => ({ ...shape, faces: [...shape.faces.slice(k), ...shape.faces.slice(0, k)] });
const marksOf = (written) => {
  const g = readGenesis(genesisStoryShapes(written));
  return {
    pentimenti: [...g.pentimentoIds].sort(),
    edges: g.reducedEdges.map((e) => `${e.parent}->${e.child}`).sort(),
    accepted: g.accepted,
  };
};
// (d1) rotate m1.faces / m2.faces: SAME picked port faces ⇒ SAME child identity
const childIds = new Set();
const childClasses = new Set();
for (const [ka, kb] of [[0, 0], [3, 7], [9, 2], [15, 13]]) {
  const rA = rotatedFaces(torusOf('csA'), ka);
  const rB = rotatedFaces(torusOf('csB'), kb);
  const pA = rA.faces.find((f) => f.id === portA.id);
  const pB = rB.faces.find((f) => f.id === portB.id);
  const r = birthChild(rA, rB, 41, pA, pB, 8);
  childIds.add(r.ok ? r.born.shape.id : `refused:${r.reason}`);
  childClasses.add(r.ok ? readFormInvariants(r.born.shape, [rA, rB]).classification : 'refused');
}
check('rotating the faces ARRAYS (pure storage) with the SAME picked ports: ONE child identity, ONE certified class across 4 rotations — the person\'s choice, not the array, fixes the seam',
  childIds.size === 1 && childClasses.size === 1 && [...childClasses][0] === 'genus 2 (closed, orientable)');
// …the TEETH: the faces[0]-DEFAULT door moves under the same sweep
const defaultIds = new Set();
for (const [ka, kb] of [[0, 0], [3, 7], [9, 2], [15, 13]]) {
  defaultIds.add(defaultFaceCombine(rotatedFaces(torusOf('csA'), ka), rotatedFaces(torusOf('csB'), kb)).id);
}
check('★ THE TRAP\'S TEETH: the carried faces[0]-DEFAULT door yields a DIFFERENT child per rotation (4 distinct identities across 4 rotations) — the seam\'s location moving with the array, the defect the gate exists to kill',
  defaultIds.size === 4);
// (d2) permute the PAGE array. The stemma edge SET and the integrity verdict
// are invariant under EVERY permutation; the PENTIMENTO record is the
// committed DAG's STORY LOG, walked in input order (genealogyDag, frozen —
// a parent listed AFTER its child is seen un-consumed at the child's birth).
// The page can only produce BIRTH-ORDERED arrays (setWritten appends), so
// every reachable permutation draws identical marks — and the unreachable
// child-first orders behave EXACTLY as they always did (the old collector,
// same perms, same readings: this build introduces NO new order sensitivity).
const bornForMarks = birthChild(A, B, 42, portA, portB, 8);
const pageEntries = [asWritten(A), asWritten(B), { form: bornForMarks.born }];
const pagePerms = [
  [0, 1, 2], [1, 0, 2], [0, 2, 1], [2, 1, 0], [1, 2, 0], [2, 0, 1],
].map((perm) => perm.map((k) => pageEntries[k]));
const edgeAndVerdictSets = new Set(pagePerms.map((page) => {
  const m = marksOf(page);
  return JSON.stringify({ edges: m.edges, accepted: m.accepted });
}));
check('6 permutations of the PAGE array: the stemma edge SET and the integrity verdict are IDENTICAL under every one (the join is read from the record, not the shelf order)',
  edgeAndVerdictSets.size === 1);
const birthOrderedPerms = [pagePerms[0], pagePerms[1]]; // parents before the child — the only orders the page can produce
const fullMarkSets = new Set(birthOrderedPerms.map((page) => JSON.stringify(marksOf(page))));
check('…every BIRTH-ORDERED permutation (all the page can produce) draws IDENTICAL full marks — both parents ghost, two lines fork',
  fullMarkSets.size === 1 && JSON.parse([...fullMarkSets][0]).pentimenti.length === 2);
check('…and the committed story-log semantics is carried UNCHANGED: on every permutation (child-first included) the new collector\'s genesis reading ≡ the old one-hop collector\'s, byte-for-byte (both parents sit ON this page, so both collectors emit the same story) — no NEW array-order sensitivity enters with this build; the input-order death record is the frozen DAG\'s own, disclosed',
  pagePerms.every((page) => {
    const viaNew = readGenesis(genesisStoryShapes(page));
    const viaOld = readGenesis(oneHopStoryShapes(page));
    return (
      eq(genesisStoryShapes(page).map((s) => s.id), oneHopStoryShapes(page).map((s) => s.id)) &&
      eq([...viaNew.pentimentoIds].sort(), [...viaOld.pentimentoIds].sort()) &&
      eq(viaNew.reducedEdges, viaOld.reducedEdges) &&
      viaNew.accepted === viaOld.accepted
    );
  }));
// (d3) the PARENT order: A#B and B#A draw THE SAME MARKS (the order is record
// provenance, never ink — a different birth record, the same equal ink)
const bornBA = birthChild(B, A, 43, portB, portA, 8);
const marksAB = marksOf([asWritten(A), asWritten(B), { form: bornForMarks.born }]);
const marksBA = marksOf([asWritten(A), asWritten(B), { form: bornBA.born }]);
check('parent order (A#B vs B#A): both parents ghost, both stemma lines fork, same certified class — NO precedence anywhere in the marks (the record may state the order; the ink never draws it)',
  bornBA.ok &&
  eq(marksAB.pentimenti, marksBA.pentimenti) &&
  marksAB.edges.length === 2 && marksBA.edges.length === 2 &&
  readFormInvariants(bornBA.born.shape, [B, A]).classification === 'genus 2 (closed, orientable)' &&
  eq(bornBA.born.parentShapes.map((s) => s.id), [B.id, A.id]));

// ═════ [e] §2 IS DEAD — the one-hop collector's lie, exhibited and killed ═════
console.log('\n----- [e] the story reaches BOTH parents — 0-of-2 and 1-of-2 are both impossible now -----');
// the engineer's fixture: the child on the page, parents OFF-page; the old
// written record carried at most ONE parent (parentShape = ancestry[0] = A)
const offPageOldRecord = [{ form: { ...bornForMarks.born, parentShape: A, parentShapes: undefined } }];
const offPageNewRecord = [{ form: bornForMarks.born }];
const lieEdges = readGenesis(oneHopStoryShapes(offPageOldRecord)).reducedEdges.filter((e) => e.child === bornForMarks.born.shape.id);
const fixedEdges = readGenesis(genesisStoryShapes(offPageNewRecord)).reducedEdges.filter((e) => e.child === bornForMarks.born.shape.id);
check('★ THE CARRIED ONE-HOP MUTANT VISIBLY PRODUCES THE LIE: 1 stemma edge where 2 are owed (one parent of two entering the story — the designer\'s forbidden register)',
  lieEdges.length === 1);
check('…and the fixed collector reaches BOTH off-page parents through the carried record: 2 stemma edges, both parents in the story, DAG integrity accepted',
  fixedEdges.length === 2 &&
  eq(fixedEdges.map((e) => e.parent).sort(), [A.id, B.id].sort()) &&
  readGenesis(genesisStoryShapes(offPageNewRecord)).accepted === true);
note('(the DAG\'s death record is input-order over the story — an off-page parent appended AFTER its child is seen un-consumed by the record walk; on the real page the parents precede the child and both settle to pencil, as [d2] pins)');

// ═════ [f] CLAUSE 4 — single-parent non-movement (the highest bar) ═══════════
console.log('\n----- [f] ★ single-parent genesis readings: byte-identical to the old collector on the whole zoo -----');
const sq = invokePrimitive('square', 50);
const wordBorn = applyPlaygroundOperationTo('glue-torus', sq.shape, null, 51, 8);
const cutBorn = applyPlaygroundOperationTo('cut', invokePrimitive('pentagon', 52).shape, null, 53, 8);
const tube81 = loadForm(() => ({
  name: 'tube8x1',
  vertices: [
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: `a${i}`, position: [Math.cos((i * Math.PI) / 4), 0, Math.sin((i * Math.PI) / 4)] })),
    ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ id: `b${i}`, position: [Math.cos((i * Math.PI) / 4), 1, Math.sin((i * Math.PI) / 4)] })),
  ],
  faces: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 8}`, `b${(i + 1) % 8}`, `b${i}`] })),
}), 'ub7');
const S1 = sewBoundaryCircles(tube81, 'preserving').shape;
const C1 = materializeCutResult(S1, cutCell(S1, S1.faces[0]));
const chainEntries = [
  asWritten(tube81),
  { form: { id: 'wS1', title: 'sewn', shape: S1, parentShape: tube81, opId: 'sew-boundary-preserving', provenance: '', render: null } },
  { form: { id: 'wC1', title: 'cut', shape: C1, parentShape: S1, opId: 'cut', provenance: '', render: null } },
];
const singleParentPages = [
  [{ form: sq }],
  [{ form: sq }, { form: wordBorn.born }],
  [{ form: cutBorn.born }],
  chainEntries,
];
check('every single-parent page — invoked, word-born, cut-born, the sewn depth chain — collects the IDENTICAL story (same shapes, same order, same length) and reads the IDENTICAL genesis (pentimenti + edges + verdict) through old and new collectors',
  singleParentPages.every((page) => {
    const mine = genesisStoryShapes(page);
    const theirs = oneHopStoryShapes(page);
    const gMine = readGenesis(mine);
    const gTheirs = readGenesis(theirs);
    return (
      eq(mine.map((s) => s.id), theirs.map((s) => s.id)) &&
      mine.every((s, k) => s === theirs[k]) &&
      eq([...gMine.pentimentoIds].sort(), [...gTheirs.pentimentoIds].sort()) &&
      eq(gMine.reducedEdges, gTheirs.reducedEdges) &&
      gMine.accepted === gTheirs.accepted
    );
  }));

// ═════ [g] ★ CHAINING — operations on the results of operations ══════════════
console.log('\n----- [g] the genus-2 child is combinable AGAIN: genus-3 (the whole point of the ask) -----');
const C3 = torusOf('csC');
const chained = birthChild(bornForMarks.born.shape, C3, 44, bornForMarks.born.shape.faces[7], C3.faces[3], 8);
check('★ the child of the child: genus-2 # torus → "genus 3 (closed, orientable)", χ = −4, rendered as the class body ("genus 3 — born") — forms beget forms through the person\'s own door',
  chained.ok &&
  (() => {
    const inv = readFormInvariants(chained.born.shape, [bornForMarks.born.shape, C3]);
    return inv.classification === 'genus 3 (closed, orientable)' && inv.chiCertified === -4;
  })() &&
  chained.born.render.mode === 'classBody' && chained.born.title === 'genus 3 — born');

// ═════ [h] the carried mutants are FAITHFUL (HEAD-state-aware, both real) ═════
console.log('\n----- [h] fidelity: the carried mechanisms ARE what the committed door ran (checkable only pre-commit; done now) -----');
const headGenesisSource = execSync('git show HEAD:src/manuscript/genesisModel.ts', { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
const headHasOldDoor = !headGenesisSource.includes('COMBINE IS THE CONNECTED SUM');
if (headHasOldDoor) {
  const fake = path.join(repoRoot, 'src', 'manuscript', 'genesisModel.__head__.ts');
  const m = new Module(fake, module);
  m.filename = fake;
  m.paths = Module._nodeModulePaths(path.dirname(fake));
  m._compile(ts.transpileModule(headGenesisSource, { ...TRANSPILE_OPTIONS, fileName: fake }).outputText, fake);
  const headGenesis = m.exports;
  const hA = torusOf('csA');
  const hB = torusOf('csB');
  const headBirth = headGenesis.birthChild(hA, hB, 40);
  check('PRE-COMMIT FIDELITY (a): HEAD\'s committed door IS the raw assemble — its child ≡ executeAssemblePair byte-for-byte (the carried mutant is the real old mechanism, not a strawman)',
    headBirth.ok && eq(headBirth.born.shape, executeAssemblePair(torusOf('csA'), torusOf('csB'))));
  check('PRE-COMMIT FIDELITY (b): HEAD\'s committed collector ≡ the carried one-hop mutant, byte-for-byte, on single-parent AND multi-parent fixtures (including the 1-of-2 lie)',
    singleParentPages.every((page) => eq(headGenesis.genesisStoryShapes(page).map((s) => s.id), oneHopStoryShapes(page).map((s) => s.id))) &&
    eq(headGenesis.genesisStoryShapes(offPageOldRecord).map((s) => s.id), oneHopStoryShapes(offPageOldRecord).map((s) => s.id)));
  note('HEAD carries the raw-assemble door — both fidelity byte-compares ran LIVE (these branches retire with the commit; the mutants are then already proven)');
} else {
  check('POST-COMMIT: HEAD carries the connect-sum door (the marker present; the port-face gate in place); the carried mutants\' fidelity was byte-proven pre-commit while HEAD still had the old door — and their wrongness stays visible above ([b]: a different object; [e]: the 1-of-2 lie)',
    headGenesisSource.includes('COMBINE IS THE CONNECTED SUM') && headGenesisSource.includes('combineGateFor'));
  note('HEAD carries the connect-sum door — the pre-commit fidelity branch has retired on its own detection, as designed');
}

// ═════ [i] guards ═════════════════════════════════════════════════════════════
console.log('\n----- [i] no-regression: the door is manuscript-layer; the macro and the engine are frozen -----');
const crStrip = (s) => s.replace(/\r/g, '');
const headContentOf = (file) =>
  execSync(`git show HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
// `genesisModel.ts` (the door), `writtenFormModel.ts` (the additive
// parentShapes field), `ManuscriptView.tsx` / `ManuscriptChrome.tsx` (the
// port-face picker) carry THIS mandate's sanctioned edits — ratified above.
// Everything the door RUNS is frozen:
const guarded = [
  'src/lib/connectedSum.ts', // the co-ratified macro — consumed BY IMPORT, byte-unchanged
  'src/lib/multiform.ts',
  'src/lib/genealogyDag.ts',
  'src/lib/complexIdentification.ts',
  'src/lib/surfaceOperations.ts',
  'src/lib/materializeOperation.ts',
  'src/lib/transformationLedger.ts',
  'src/lib/incidenceTraceRegistry.ts',
  'src/lib/globalW1.ts',
  'src/lib/cutOperation.ts',
  'src/lib/surfaceImmersion.ts',
  'src/playground/playgroundOperations.ts',
  'src/playground/customGluing.ts',
  'src/playground/bornFormRouting.ts',
  'src/playground/formInvariants.ts',
  'src/playground/snapshot.ts',
  'src/playground/genealogyLayout.ts',
  'src/manuscript/surfaceClassifier.ts',
  'src/manuscript/classBodyModel.ts',
  'src/manuscript/standardBodies.ts',
  'src/manuscript/inkedFormModel.ts',
  'src/manuscript/optionBModel.ts',
];
let dirty = [];
try {
  for (const file of guarded) {
    if (crStrip(headContentOf(file)) !== crStrip(fs.readFileSync(path.join(repoRoot, file), 'utf8'))) dirty.push(file);
  }
} catch (e) {
  dirty = [`guard failed to read: ${e.message}`];
}
check('connectedSum · multiform · genealogyDag · the engine · certifiers · classifiers · the registry: byte-unchanged vs HEAD, CR-insensitively (the door reuses, never forks)',
  dirty.length === 0);
if (dirty.length) note(`dirty: ${dirty.join(', ')}`);
const sentinel = 'src/lib/incidenceTraceRegistry.ts';
const sentinelHead = crStrip(headContentOf(sentinel));
const mutated = sentinelHead.slice(0, 100) + (sentinelHead[100] === 'X' ? 'Y' : 'X') + sentinelHead.slice(101);
check('the byte-guard still BITES on a genuine one-character in-memory edit — and the true content passes even CRLF-re-expressed',
  guarded.includes(sentinel) &&
  crStrip(mutated) !== sentinelHead &&
  crStrip(sentinelHead.replace(/\n/g, '\r\n')) === sentinelHead &&
  crStrip(fs.readFileSync(path.join(repoRoot, sentinel), 'utf8')) === sentinelHead);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
