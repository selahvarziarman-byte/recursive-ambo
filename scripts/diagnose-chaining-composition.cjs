#!/usr/bin/env node

// DIAGNOSTIC — Q-M2 CHAINING UNFREEZE (sanctioned engine-faithfulness edit):
// chaining ops on born quotient faces is RULED — a chain is the COMPOSITION of
// identifications (quotient-of-a-quotient = ONE composed word on the polygon),
// decided by the committed GATE (link valences), never pre-refused.
//
//   §1 (a) the flagship composition: square → glue-cylinder-born [P,Q,Q,P] →
//       glue its two boundary edge-classes (rim slots, preserving) → a SOUND
//       CLOSED χ=0 surface (v=1, e=2, f=1; the single support's link is ONE
//       interior circle; w₁=0 — the torus by every committed instrument), with
//       the 2-GENERATION LINEAGE COMPOSED: the born class pulls back to born1's
//       minted classes and through them to ALL FOUR square corners; the
//       genealogy DAG records square → born1 → born2. The reversing variant
//       reads w₁=1 (the Klein) — same cells, same interior link.
//   §2 (b) an OVER-IDENTIFYING chain (seam+rim) RUNS — no refusal — and the
//       gate returns the non-interior verdict (a JUNCTION link): instruments,
//       not guards. Re-gluing the already-identified seam pair is idempotent
//       (the cylinder again, χ=0).
//   §3 (c) a DEGENERATE boundary (all corners one class — the minimal torus)
//       refuses WITH THE PATH: subdivide first (ADR 0018); the subdivided
//       complex's faces are first-generation and OPERATE.
//   §4 (d) a JUNCTION-carrying face (probed via the committed parent replay —
//       the born form's OWN birth links) refuses with the principled deferral,
//       verbatim: "junction-crossing — GSR path deferred".
//   §5 honesty rails: no birth word → refuse (never an unfaithful slot-level
//       run); parallel identified edge-classes → deferred (the carried-edge
//       correspondence is ambiguous); the v0 word classifier ABSTAINS on
//       quotient parents (patch fallback, no immersion lie); the manuscript
//       runs the engine and draws the honest CLASS BODY (P-IMMERSE 2026-07-11
//       — the disclosed render gap CLOSED: bookkeeping positions are still
//       never drawn; the body is a self-certifying representative of the
//       certified class carrying the committed Option-B generators).
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

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

const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const {
  executeCustomGlue,
  previewCustomGlue,
  validateCustomPairings,
} = req('src/playground/customGluing.ts');
const {
  classifyFaceChainPath,
  degenerateBoundaryReason,
  getPlaygroundOperation,
  JUNCTION_CROSSING_REASON,
} = req('src/playground/playgroundOperations.ts');
const { recoverBornSurface, routeBornForm } = req('src/playground/bornFormRouting.ts');
const { globalW1Class } = req('src/lib/globalW1.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { buildGenealogyDag, ancestorsOf } = req('src/lib/genealogyDag.ts');
const { usePlaygroundStore } = req('src/store/playgroundStore.ts');
const { applyPlaygroundOperationTo } = req('src/manuscript/writtenFormModel.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const P = (edgeA, edgeB, mode) => ({ edgeA, edgeB, mode });
const ctxOf = (form, parent) => ({
  form,
  selectedFaceId: form.faces[0]?.id ?? null,
  selectedFace: form.faces[0] ?? null,
  parentShape: parent ?? null,
});
const setEq = (a, b) => eq([...a].sort(), [...b].sort());

console.log('Q-M2 chaining unfreeze: composition of identifications through the committed pipeline\n');

// ===== [1] (a) the flagship: cylinder-born → glue the two boundary edge-classes =====
console.log('----- [1] TEST (a): square → cylinder-born → rim-to-rim chain → sound closed χ=0 -----');
const sq = loadForm(nGon(4), 'qa');
const born1 = executeCustomGlue(sq, sq.faces[0], [P(0, 2, 'preserving')]);
const f1 = born1.faces[0];
check('§a the cylinder-born face is a QUOTIENT cycle: 4 slots over 2 corner classes [P,Q,Q,P]',
  f1.vertexIds.length === 4 && new Set(f1.vertexIds).size === 2 &&
  f1.vertexIds[0] === f1.vertexIds[3] && f1.vertexIds[1] === f1.vertexIds[2]);
check("§a classifyFaceChainPath: 'generic-quotient' — ALLOWED, carrying the replay-verified birth word",
  (() => { const c = classifyFaceChainPath(f1, born1, sq); return c.path === 'generic-quotient' && eq(c.priorPairings, [P(0, 2, 'preserving')]); })());
const preview = previewCustomGlue(born1, f1, [P(1, 3, 'preserving')], sq);
check('§a the dry-run preview accepts the chain and reads the COMPOSED certificate: χ=0, w₁=0, 0 free edges (closed)',
  preview.ok && preview.preview.chi === 0 && preview.preview.w1 === 0 && preview.preview.freeEdges === 0);
const born2 = executeCustomGlue(born1, f1, [P(1, 3, 'preserving')], sq);
const rec2 = recoverBornSurface(born2, born1);
check('§a the chain EXECUTES and the born form REPLAY-RECOVERS against born1 (byte-compared)',
  Boolean(rec2) && eq(rec2.pairings, [P(0, 2, 'preserving'), P(1, 3, 'preserving')]));
check('§a the composed trace: χ=0 with REAL CW counts v=1, e=2, f=1 (the prior seam counted ONCE — the composition, not the slot arithmetic)',
  rec2.trace.chi === 0 && eq(rec2.trace.cellCounts, { v: 1, e: 2, f: 1 }));
check("§a SOUND CLOSED: exactly one merged support and its link is ONE INTERIOR CIRCLE (valence 'interior', no pinch) — the gate's own verdict",
  rec2.trace.links.length === 1 && rec2.trace.links[0].valence === 'interior' && rec2.trace.links[0].decomposition.pinch === false);
check('§a orientable: trace w₁ = 0 (both composed pair signs +1)',
  rec2.trace.w1 === 0 && eq(rec2.trace.pairSigns, [1, 1]));
const complex2 = rec2.materialized.complex;
const indepChi = complex2.vertices.length - complex2.edges.length + complex2.faces.length;
check('§a INDEPENDENT of the trace: χ over the materialized complex = 0 and the committed globalW1 reads orientable',
  indepChi === 0 && globalW1Class(complex2).nonOrientable === false);
note(`torus-by-every-instrument: cells ${JSON.stringify(rec2.trace.cellCounts)} · link ${rec2.trace.links[0].valence} · w₁ ${rec2.trace.w1} · independent χ ${indepChi}`);

// the reversing variant — the Klein bottle by the same instruments
const born2k = executeCustomGlue(born1, f1, [P(1, 3, 'reversing')], sq);
const rec2k = recoverBornSurface(born2k, born1);
check('§a the REVERSING rim chain: same closed cells (v1,e2,f1), same interior link, w₁ = 1 — the Klein, and the independent certifier AGREES',
  Boolean(rec2k) && rec2k.trace.chi === 0 && eq(rec2k.trace.cellCounts, { v: 1, e: 2, f: 1 }) &&
  rec2k.trace.links.length === 1 && rec2k.trace.links[0].valence === 'interior' &&
  rec2k.trace.w1 === 1 && globalW1Class(rec2k.materialized.complex).nonOrientable === true);

// ----- the 2-GENERATION LINEAGE composition -----
const born2Vertices = Object.values(born2.vertices);
check('§a lineage, generation 2→1: born2 has ONE class whose sources are EXACTLY born1\'s two minted classes',
  born2Vertices.length === 1 && setEq(born2Vertices[0].createdBy.sourceVertexIds, Object.keys(born1.vertices)));
const expanded = born2Vertices[0].createdBy.sourceVertexIds.flatMap(
  (id) => born1.vertices[id].createdBy.sourceVertexIds,
);
check('§a lineage, generation 1→0: expanding through born1\'s ledger reaches ALL FOUR square corners — the pull-back COMPOSES',
  setEq(expanded, Object.keys(sq.vertices)));
check('§a genealogy: born2.parent = born1, born1.parent = square, depths 0→1→2',
  born2.genealogy.parentShapeId === born1.id && born1.genealogy.parentShapeId === sq.id &&
  sq.genealogy.generationDepth === 0 && born1.genealogy.generationDepth === 1 && born2.genealogy.generationDepth === 2);
const dag = buildGenealogyDag([sq, born1, born2]);
const dagEdges = dag.edges.map((e) => `${e.parent}→${e.child}`).sort();
check('§a the committed DAG ACCEPTS and records the chain: square→born1 and born1→born2, ancestors(born2) = {born1, square}',
  dag.integrity.accepted === true &&
  eq(dagEdges, [`${born1.id}→${born2.id}`, `${sq.id}→${born1.id}`].sort()) &&
  setEq([...ancestorsOf(dag, born2.id)], [born1.id, sq.id]));

// ----- the same chain through the REAL store action -----
usePlaygroundStore.getState().resetPlayground();
const A = usePlaygroundStore.getState().invokeForm(nGon(4), 'qs');
usePlaygroundStore.getState().selectForm(A.id);
usePlaygroundStore.getState().selectFace(A.faces[0].id);
const sBorn1 = usePlaygroundStore.getState().applyCustomGlueToSelection([P(0, 2, 'preserving')]);
usePlaygroundStore.getState().selectForm(sBorn1.id);
usePlaygroundStore.getState().selectFace(sBorn1.faces[0].id);
const sBorn2 = usePlaygroundStore.getState().applyCustomGlueToSelection([P(1, 3, 'preserving')]);
const sRec = recoverBornSurface(sBorn2, sBorn1);
const storeShapes = usePlaygroundStore.getState().formOrder.map((id) => usePlaygroundStore.getState().forms[id].shape);
const storeDag = buildGenealogyDag(storeShapes);
check('§a the REAL store action chains too: applyCustomGlueToSelection on the born form births the same closed χ=0 surface; the store DAG accepts',
  Boolean(sRec) && sRec.trace.chi === 0 && sRec.trace.links.every((l) => l.valence === 'interior') &&
  storeDag.integrity.accepted === true);

// ===== [2] (b) the over-identifying chain RUNS; the gate says NON-INTERIOR =====
console.log('\n----- [2] TEST (b): over-identifying chain RUNS — the gate returns the junction verdict -----');
const overBorn = executeCustomGlue(born1, f1, [P(0, 1, 'preserving')], sq);
const overRec = recoverBornSurface(overBorn, born1);
check('§b the seam+rim chain (composes the seam pair with a seam-to-rim pair) RUNS — no refusal, the born form exists and replay-recovers',
  Boolean(overRec) && overBorn.genealogy.parentShapeId === born1.id);
check("§b THE GATE'S VERDICT: the merged support's link is a JUNCTION (non-interior) — reported, never pre-refused (instruments, not guards)",
  overRec.trace.links.length === 1 && overRec.trace.links[0].valence === 'junction');
note(`over-identified: trace χ=${overRec.trace.chi} cells=${JSON.stringify(overRec.trace.cellCounts)} link=${overRec.trace.links[0].valence}`);
const reglued = executeCustomGlue(born1, f1, [P(0, 2, 'preserving')], sq);
const regluedRec = recoverBornSurface(reglued, born1);
check('§b re-gluing the ALREADY-IDENTIFIED seam pair is an IDEMPOTENT composition: runs, χ=0 (the cylinder again), no new merges',
  Boolean(regluedRec) && regluedRec.trace.chi === 0 && eq(regluedRec.trace.cellCounts, { v: 2, e: 3, f: 1 }) && regluedRec.trace.links.length === 0);

// ===== [3] (c) degenerate boundary → refused WITH the subdivide-first path =====
console.log('\n----- [3] TEST (c): degenerate wedge → subdivide-first; the subdivided complex OPERATES -----');
const sqT = loadForm(nGon(4), 'qt');
const torusBorn = executeCustomGlue(sqT, sqT.faces[0], [P(0, 2, 'preserving'), P(1, 3, 'preserving')]);
const fT = torusBorn.faces[0];
check('§c the torus-born face is the DEGENERATE case: all 4 corners ONE class (the wedge at the single point)',
  new Set(fT.vertexIds).size === 1);
const degReason = validateCustomPairings(fT, [P(0, 1, 'preserving')], torusBorn, sqT);
check('§c customGluing refuses WITH THE PATH: the reason names the degenerate boundary AND the subdivide-first route (ADR 0018)',
  typeof degReason === 'string' && /degenerate/.test(degReason) && /Subdivide first/.test(degReason) && /ADR 0018/.test(degReason));
check('§c the registry ops speak the SAME committed reason (word op and whole-face op alike)',
  getPlaygroundOperation('glue-cylinder').getDisabledReason(ctxOf(torusBorn, sqT)) === degenerateBoundaryReason(fT) &&
  getPlaygroundOperation('collapse-sphere').getDisabledReason(ctxOf(torusBorn, sqT)) === degenerateBoundaryReason(fT));
check("§c classifyFaceChainPath: 'degenerate-boundary'",
  classifyFaceChainPath(fT, torusBorn, sqT).path === 'degenerate-boundary');
// ... and the named path WORKS: the subdivided complex operates
const imm = immerseSurface({ surface: 'torus', resolution: 4 });
const immFace = imm.shape.faces[0];
const immCtx = { form: imm.shape, selectedFaceId: immFace.id, selectedFace: immFace, parentShape: null };
check('§c the subdivided torus (committed immersion, R=4) has FIRST-GENERATION faces — the path out of the wedge',
  classifyFaceChainPath(immFace, imm.shape, null).path === 'first-generation');
const cutOp = getPlaygroundOperation('cut');
const cutBorn = cutOp.canApply(immCtx) ? cutOp.execute(immCtx) : null;
check('§c AFTER SUBDIVIDING, the op operates: cut on a subdivided face executes (16 faces → 15, the logged loss)',
  Boolean(cutBorn) && imm.shape.faces.length === 16 && cutBorn.faces.length === 15);

// ===== [4] (d) junction-crossing chain → the principled DEFERRED refusal =====
console.log('\n----- [4] TEST (d): junction-carrying face → "junction-crossing — GSR path deferred" -----');
const oct = loadForm(nGon(8), 'qo');
const octCyl = executeCustomGlue(oct, oct.faces[0], [P(0, 4, 'preserving')]);
const junctionBorn = executeCustomGlue(octCyl, octCyl.faces[0], [P(0, 1, 'preserving')], oct);
const jRec = recoverBornSurface(junctionBorn, octCyl);
const fJ = junctionBorn.faces[0];
check('§d the probe fixture BIRTHS: an octagon-cylinder chained seam+rim — its OWN birth links carry a JUNCTION and its face is NOT degenerate',
  Boolean(jRec) && jRec.trace.links.some((l) => l.valence === 'junction') && new Set(fJ.vertexIds).size > 1);
const jPath = classifyFaceChainPath(fJ, junctionBorn, octCyl);
check("§d classifyFaceChainPath: 'junction-crossing' — probed via the committed parent REPLAY reading the birth trace's own link verdicts",
  jPath.path === 'junction-crossing');
check('§d the refusal is the principled deferral, VERBATIM: it begins exactly "junction-crossing — GSR path deferred"',
  typeof jPath.reason === 'string' && jPath.reason.startsWith('junction-crossing — GSR path deferred') &&
  jPath.reason === JUNCTION_CROSSING_REASON);
const jCtx = ctxOf(junctionBorn, octCyl);
check('§d the registry gates with it: canApply false, getDisabledReason = the deferral (word op and whole-face op alike)',
  getPlaygroundOperation('glue-cylinder').canApply(jCtx) === false &&
  getPlaygroundOperation('glue-cylinder').getDisabledReason(jCtx) === JUNCTION_CROSSING_REASON &&
  getPlaygroundOperation('collapse-sphere').getDisabledReason(jCtx) === JUNCTION_CROSSING_REASON);
let jThrew = false;
try {
  getPlaygroundOperation('glue-cylinder').execute(jCtx);
} catch (error) {
  jThrew = /ineligible/.test(String(error.message));
}
check('§d forcing the execute anyway throws LOUDLY (the guard re-checks; misuse never births)', jThrew);
check('§d customGluing refuses the same face with the same deferral',
  validateCustomPairings(fJ, [P(1, 2, 'preserving')], junctionBorn, octCyl) === JUNCTION_CROSSING_REASON);

// ===== [5] honesty rails (the unfreeze never trades faithfulness) =====
console.log('\n----- [5] HONESTY RAILS: no unfaithful run, no immersion lie, fail-honest render -----');
const noParentPath = classifyFaceChainPath(f1, born1, null);
check('§5 WITHOUT the parent the birth word is unrecoverable → the chain REFUSES (a slot-level run would be unfaithful — never allowed)',
  noParentPath.path === 'word-unrecoverable' && getPlaygroundOperation('glue-cylinder').canApply(ctxOf(born1, null)) === false);
const sqR = loadForm(nGon(4), 'qr');
const rp2Born = getPlaygroundOperation('flip-glue').execute(ctxOf(sqR, null));
const rp2Path = classifyFaceChainPath(rp2Born.faces[0], rp2Born, sqR);
check('§5 PARALLEL identified edge-classes (RP²-born: two classes on one endpoint pair) → deferred — the carried-edge correspondence is ambiguous, refused not mis-carried',
  rp2Path.path === 'parallel-classes-deferred' && getPlaygroundOperation('flip-glue').canApply(ctxOf(rp2Born, sqR)) === false);
check('§5 the v0 word classifier ABSTAINS on a quotient parent face: the chained torus routes to the honest PATCH fallback (no cylinder/immersion lie)',
  routeBornForm(born2, born1).kind === 'patch');
check('§5 the preview classifier abstains too (surface null on a quotient face) while the trace χ/w₁ still speak',
  preview.ok && preview.preview.surface === null);
const chainWritten = applyPlaygroundOperationTo('glue-cylinder', born1, sq, 90, 8);
// P-IMMERSE (2026-07-11, disclosed): the fail-honest render GAP is CLOSED — the
// manuscript still never draws bookkeeping positions; the patch-routed chain now
// renders the honest CLASS BODY (classified from the certified invariants; the
// re-glued seam pair counts once, so this chain composes to the cylinder class).
check('§5 the manuscript RUNS the engine (registry canApply TRUE with the parent) and draws the CLASS BODY — bookkeeping positions still never drawn (P-IMMERSE; this used to refuse)',
  getPlaygroundOperation('glue-cylinder').canApply(ctxOf(born1, sq)) === true &&
  chainWritten.ok && chainWritten.born.render.mode === 'classBody' &&
  chainWritten.born.render.model.components[0].label === 'genus 0 · 2 boundary circles');
note(`manuscript chained render (P-IMMERSE): "${chainWritten.ok ? chainWritten.born.title : '—'}"`);

console.log(
  failures === 0
    ? '\n--- chaining composition (Q-M2 unfreeze: compose → gate decides → lineage carries): no failures ---\n\nALL PASS'
    : `\n--- chaining composition: ${failures} FAILURE(S) ---`,
);
process.exitCode = failures === 0 ? 0 : 1;
