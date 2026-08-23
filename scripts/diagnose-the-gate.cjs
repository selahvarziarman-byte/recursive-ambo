#!/usr/bin/env node

// DIAGNOSTIC — THE GATE (engineer-chartered 2026-07-17; mothership: THE WIRE
// withdrawn, THE GATE ratified — "Take it." SEAL-BEFORE-BUILD — BUILT BLIND to
// `.handoff/SEAL_THE_GATE.md`, SHA-256 d130debf…21d3, natively measured; every
// pin below is the builder's own measurement).
//
// WHY THIS EXISTS: the chord, the rim, the seam and the exit all cured walls
// for a caller that did not exist. connectedSum's only importers were the
// CATALOGUE (grid tori — multi-face, distinct corners, no parallels: the
// walls never fire), while the PERSON — whose begotten minimal word-forms are
// exactly what the walls refuse — had NO route to the op at all. GESTURE ≠
// CATALOGUE. The app even told the person to use "combine" (the committed
// single-face gate sentence) while no combine existed: a refusal naming a
// cure that does not exist, live in the product — LAW 14 at the panel.
//
// THE GATE: `applyCombineToSelection(secondFormId)` in playgroundStore.ts (a
// STORE ACTION — the committed binary precedent is `applyAssembleToSelection`;
// the frozen unary registry has no vocabulary for a second form) + its panel
// control. THE WIRE lives in the gate: a minimal 1-face word-form is refined
// through the committed pair (refineToDisk — THE EXIT tests every wall) and
// the sum receives its minted disk; a multi-face form passes through (it is
// already summable — wiring it would mint a NEW wall). Zero frozen files.
//
// THE CENTREPIECE MUTANT: a witness that drives the OP cannot see a missing
// DOOR by construction — driving connectedSum directly on refined forms
// passes at HEAD (exactly what diagnose-the-exit.cjs does) while the person,
// at HEAD, has no route. That instrument-blindness is carried below as a
// permanent, on-purpose exhibit.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

'use strict';
const fs = require('node:fs');
const path = require('node:path');
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
const { checkEngineFreeze, sha256OfCrStripped } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));

// ── THE PERSON'S SURFACES (the payoff leg may touch ONLY these — asserted) ──
const { usePlaygroundStore, buildPlaygroundSquareForm } = req('src/store/playgroundStore.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { singleFaceGateReason } = req('src/playground/playgroundOperations.ts');

// ── INSTRUMENT SURFACES (mutant/DAG/wire legs only — NEVER the payoff) ──
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { executeCustomGlue } = req('src/playground/customGluing.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');
const { refineToDisk } = req('src/lib/surfaceRefinement.ts');
const { buildGenealogyDag } = req('src/lib/genealogyDag.ts');

// the ONE plumbing read (pinned in the flagship's HEAD-read inventory):
// non-movement ×5 + the HEAD-state arrival branch (gate present at HEAD?)
const headBlobOf = (file) => execSync(`git cat-file blob HEAD:${file}`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });

let failures = 0;
const check = (name, cond) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}`);
  if (!cond) failures += 1;
};
const note = (msg) => console.log(`  ↳ ${msg}`);

console.log('the gate: the person combines two of their own forms — the door the walls were waiting for (blind concretes)\n');

// HEAD-STATE ARRIVAL BRANCH (THE WITNESS LAW): pre-commit the gate is absent
// from HEAD (the exhibit of the missing door); post-commit it has ARRIVED and
// the same legs witness the arrival instead of failing on it.
const gateAtHead = headBlobOf('src/store/playgroundStore.ts').includes('applyCombineToSelection');
const panelAtHead = headBlobOf('src/components/PlaygroundOperationsPanel.tsx').includes('Combine (connected sum)');

// ═════ [1] ★★★ THE PERSON'S ROUTE — the only clause that counts ═══════════════════
console.log("----- [1] ★★★ THE PERSON'S ROUTE: begotten minimal forms → combine → the zoo of sums (clause 1) -----");
// The payoff route — THIS FUNCTION drives THE STORE and nothing else. Its own
// source is asserted below to contain no `src/lib` require and no catalogue
// fixture (grid tori, buildClassBody, loaded octagons): the person begets
// squares, glues them by registry gesture, and combines. 141 of 145 witnesses
// drive src/lib; this one drives the registry or it witnesses nothing.
function personsPayoffRoute() {
  const S = () => usePlaygroundStore.getState();
  const beget = (opId, ns) => {
    const square = S().invokeForm(buildPlaygroundSquareForm, ns);
    S().selectForm(square.id);
    S().selectFace(square.faces[0].id);
    return S().applyOperationToSelection(opId);
  };
  S().resetPlayground();
  const torusA = beget('glue-torus', 'gateTA');
  const torusB = beget('glue-torus', 'gateTB');
  S().selectForm(torusA.id);
  const genus2 = S().applyCombineToSelection(torusB.id);
  const rp2A = beget('flip-glue', 'gateRA');
  const rp2B = beget('flip-glue', 'gateRB');
  S().selectForm(rp2A.id);
  const klein = S().applyCombineToSelection(rp2B.id);
  const rp2C = beget('flip-glue', 'gateRC');
  const torusC = beget('glue-torus', 'gateTC');
  S().selectForm(rp2C.id);
  const dyck = S().applyCombineToSelection(torusC.id);
  const kleinBegot = beget('flip-glue-klein', 'gateKA');
  return { S, torusA, torusB, rp2A, rp2B, rp2C, torusC, genus2, klein, dyck, kleinBegot };
}
const R = personsPayoffRoute();
const invOf = (shape) => readFormInvariants(shape, []);
check('★★★ THE PERSON COMBINES AND THE ZOO ANSWERS — two begotten tori → THE GENUS-2 (χ=−2 · w₁=0 · "genus 2 (closed, orientable)" · closed · via direct) · two begotten RP²s → THE KLEIN (χ=0 · "cross-caps 2 (closed, non-orientable)") · a begotten RP² + a begotten torus → DYCK\'S SURFACE (χ=−1 · "cross-caps 3 (closed, non-orientable)") — every one through the STORE\'s own combine, and the payoff route\'s source is SELF-ASSERTED to require nothing from src/lib and to name no catalogue fixture',
  (() => {
    const g = invOf(R.genus2);
    const k = invOf(R.klein);
    const d = invOf(R.dyck);
    note(`T² # T²  : χ=${g.chi} · "${g.classification}" · ${g.boundary} · nonOrientable=${g.cert ? g.cert.nonOrientable : '?'} · b₁=${g.cert ? g.cert.b1 : '?'} · via ${g.complexSource}`);
    note(`RP² # RP²: χ=${k.chi} · "${k.classification}" · via ${k.complexSource}`);
    note(`RP² # T² : χ=${d.chi} · "${d.classification}" · via ${d.complexSource} (the researcher names this DYCK'S SURFACE — the engine's answer matches)`);
    const src = personsPayoffRoute.toString();
    const clean = !src.includes('src/lib') && !src.includes('buildClassBody') && !src.includes('standardBodies') && !src.includes('nGon');
    note(`payoff-leg source: src/lib references=${src.includes('src/lib')} · catalogue fixtures=${!clean && src.includes('src/lib') === false}`);
    return g.chi === -2 && g.chiCertified === -2 && g.classification === 'genus 2 (closed, orientable)' &&
      g.boundary === 'closed' && g.cert !== null && g.cert.nonOrientable === false && g.complexSource === 'direct' &&
      k.chi === 0 && k.classification === 'cross-caps 2 (closed, non-orientable)' && k.complexSource === 'direct' &&
      d.chi === -1 && d.classification === 'cross-caps 3 (closed, non-orientable)' && d.complexSource === 'direct' &&
      clean;
  })());

// ═════ [2] ★★ the centrepiece mutant — instrument blindness, permanent ════════════
console.log('\n----- [2] ★★ THE MUTANT: the op-driving witness passes while the person has no door (clause 2) -----');
check('★★ INSTRUMENT BLINDNESS, MADE PERMANENT: driving connectedSum DIRECTLY on refined forms (loadForm + executeCustomGlue + refineToDisk + connectedSum — byte-for-byte the diagnose-the-exit mechanism) PASSES and yields the genus-2 — an op-driving witness CANNOT see a missing door by construction. And the person\'s route: at the pre-gate HEAD it DID NOT EXIST (no applyCombineToSelection in the store, no Combine control in the panel — the arrival branch witnesses whichever state HEAD is in). This is the instrument that hid the missing door for two days',
  (() => {
    const bear = (ns) => {
      const poly = loadForm(nGon(4), ns);
      const born = executeCustomGlue(poly, poly.faces[0], [
        { edgeA: 0, edgeB: 2, mode: 'preserving' },
        { edgeA: 1, edgeB: 3, mode: 'preserving' },
      ], null);
      const refined = refineToDisk(born, poly);
      return { refined: refined.shape, disk: refined.shape.faces.find((f) => f.id.endsWith(':disk')) };
    };
    const A = bear('mutOpA');
    const B = bear('mutOpB');
    const sum = connectedSum(A.refined, B.refined, { faceA: A.disk, faceB: B.disk });
    const inv = readFormInvariants(sum.shape, [A.refined, B.refined]);
    const opWitnessGreen = inv.chi === -2 && inv.classification === 'genus 2 (closed, orientable)';
    note(`the op-driving mechanism: χ=${inv.chi} · "${inv.classification}" — GREEN (it never asks whether a person can reach the op)`);
    if (!gateAtHead) {
      note(`HEAD (pre-gate): store carries applyCombineToSelection=${gateAtHead} · panel carries the control=${panelAtHead} — the person's route VISIBLY DOES NOT EXIST while the op-witness above passes`);
      return opWitnessGreen && !panelAtHead;
    }
    note(`HEAD (the gate has ARRIVED): store carries applyCombineToSelection=${gateAtHead} · panel carries the control=${panelAtHead} — the blindness exhibit is now historical; the mechanism above stays green either way`);
    return opWitnessGreen && panelAtHead;
  })());

// ═════ [3] the forms are the person's own ═════════════════════════════════════════
console.log("\n----- [3] THE FORMS ARE THE PERSON'S OWN — begotten, minimal, word-born (clause 3) -----");
check('THE FIXTURES ARE BEGOTTEN, NOT BUILT: the torus from the registry gesture `glue-torus`, the RP² from `flip-glue`, the Klein from `flip-glue-klein` — every one a 1-FACE word-form born in the store with its registry source on the provenance; NO grid tori, NO buildClassBody, NO loaded octagons anywhere in the payoff (self-asserted in [1] — a grid torus sums at HEAD and proves nothing; that is exactly how the catalogue hid this)',
  (() => {
    const store = R.S();
    const rows = [
      ['torus', R.torusA, 'glue-torus'],
      ['RP²', R.rp2A, 'flip-glue'],
      ['Klein', R.kleinBegot, 'flip-glue-klein'],
    ];
    return rows.every(([label, shape, source]) => {
      const prov = store.forms[shape.id]?.provenance;
      note(`${label}: faces=${shape.faces.length} · provenance.source=${prov?.source} · origin=${prov?.origin}`);
      return shape.faces.length === 1 && prov?.source === source && prov?.origin === 'operated';
    });
  })());

// ═════ [4] the wire fires, measurably ═════════════════════════════════════════════
console.log('\n----- [4] THE WIRE FIRES: the raw refusal at :98, then the gate on the SAME forms (clause 4) -----');
check('THE WIRE IS REAL AND MEASURED: the person\'s raw begotten torus, handed to connectedSum AS BEGOTTEN, is REFUSED at the single-face wall VERBATIM ("has a single face — cutting its only face leaves no surface") — and the gate\'s refined path SUCCEEDED on the very same two store forms in [1] (the genus-2 above): the wire (refine-to-disk in the gate, never in the frozen op) is exactly the difference',
  (() => {
    let refusal = null;
    try {
      connectedSum(R.torusA, R.torusB);
    } catch (error) {
      refusal = error.message;
    }
    note(`raw: "${refusal ? refusal.slice(0, 100) : 'SUCCEEDED?!'}…"`);
    note(`gated (from [1]): the same two forms → χ=−2 genus-2 — the wall cleared by the caller, not moved`);
    return refusal !== null && refusal.includes('has a single face — cutting its only face leaves no surface') &&
      invOf(R.genus2).chi === -2;
  })());

// ═════ [5] LAW 14 discharged ══════════════════════════════════════════════════════
console.log('\n----- [5] LAW 14 DISCHARGED: the sentence now names a door that exists (clause 5) -----');
check('THE SIGN STOPPED — AND THE CURE STANDS (B-103 §2b recut): the reroute tail is STRIPPED by the designer\'s Δ11 ruling (a refusal says why IT declines and stops — the sign that once had to be backed is gone; what the form takes lives in the card\'s computed affordance line), while the once-promised cure REMAINS reachable: the store exposes `applyCombineToSelection` and the panel carries the "Combine (connected sum)" control — no regression rode the strip',
  (() => {
    const reason = singleFaceGateReason(R.genus2);
    const panelNow = fs.readFileSync(path.join(repoRoot, 'src/components/PlaygroundOperationsPanel.tsx'), 'utf8');
    const storeNow = fs.readFileSync(path.join(repoRoot, 'src/store/playgroundStore.ts'), 'utf8');
    note(`the sentence: "…${String(reason).slice(-72)}"`);
    note(`the cure: store action=${typeof R.S().applyCombineToSelection} · panel control present=${panelNow.includes('Combine (connected sum)')}`);
    return typeof reason === 'string' && !reason.includes('(Or cut / combine.)') &&
      !reason.includes('Sew its boundary instead') &&
      reason.endsWith('where the word denotes nothing.') &&
      typeof R.S().applyCombineToSelection === 'function' &&
      panelNow.includes('Combine (connected sum)') && panelNow.includes('applyCombineToSelection') &&
      storeNow.includes('applyCombineToSelection');
  })());

// ═════ [6] the birth is real ══════════════════════════════════════════════════════
console.log('\n----- [6] THE BIRTH IS REAL: the genealogy reads a multi-parent birth (clause 6) -----');
check('THE CHILD CARRIES BOTH PARENTS: `buildGenealogyDag` over the store\'s forms reads the combined child as a MULTI-PARENT birth — its parent set is EXACTLY the person\'s two tori (the committed multi-parent walk recovers them by site-provenance from the store\'s candidates: the refined intermediates carry the parents\' ids VERBATIM because refine is not a birth)',
  (() => {
    const shapes = Object.values(R.S().forms).map((entry) => entry.shape);
    const dag = buildGenealogyDag(shapes);
    const parents = dag.edges.filter((e) => e.child === R.genus2.id).map((e) => e.parent);
    const expected = new Set([R.torusA.id, R.torusB.id]);
    note(`child's parents: ${parents.length} — [${parents.map((p) => p.slice(0, 44)).join(' | ')}]`);
    return parents.length === 2 && parents.every((p) => expected.has(p)) && new Set(parents).size === 2;
  })());

// ═════ [7] non-movement ═══════════════════════════════════════════════════════════
console.log('\n----- [7] NON-MOVEMENT: the engine did not move — the gate is caller-side only (clause 7) -----');
check('connectedSum.ts (incl. :132) · playgroundOperations.ts (and its strings) · surfaceRefinement.ts · complexIdentification.ts · multiform.ts are CR-insensitively BYTE-IDENTICAL to HEAD — this build touched only files absent from the freeze manifest (the store, the panel, the door-column instrument, this witness)',
  ['src/lib/connectedSum.ts', 'src/playground/playgroundOperations.ts', 'src/lib/surfaceRefinement.ts', 'src/lib/complexIdentification.ts', 'src/lib/multiform.ts'].every(
    (file) => sha256OfCrStripped(fs.readFileSync(path.join(repoRoot, file), 'utf8')) === sha256OfCrStripped(headBlobOf(file)),
  ));

// ═════ [8] the door column flips ══════════════════════════════════════════════════
console.log('\n----- [8] THE DOOR COLUMN: GESTURE ✓ where it read ⚠ CATALOGUE ONLY (clause 8) -----');
check('★ THE TRACKED COLUMN STANDS, AND SPEAKS THE DELIVERED WORLD — RE-CUT AT H2 (THE PERSON\'S HANDS): scripts/diagnose-the-door-column.cjs runs GREEN on any clone (absence or redness = this leg fails loud — the old gitignored-instrument absence branch stays dead), and it reads the arc\'s close honestly: the refine stayed plumbing exactly as ruled 2026-07-17 UNTIL H2 put the AIMED CHORD (subdivideFace, the same file) into the person\'s hands via handGestureModel — the column keys by FILE, so the refineToDisk row now reads ✅ PRODUCTION AS A GESTURE (this leg\'s old "never ✅" pin was FALSIFIED BY DESIGN at the H2 commit — the loud flavor) — while connectedSum reads ✅ PRODUCTION and its row says REFINES FIRST (the production combine still satisfies its own precondition; the fold\'s customGluing row reads ✅ too, pinned in the column itself). The gate\'s own arrival stays measured inside the column (applyCombineToSelection: 2 src files at HEAD, 0 at bd99fb5 — printed below verbatim)',
  (() => {
    const columnPath = path.join(repoRoot, 'scripts', 'diagnose-the-door-column.cjs');
    // execSync throws on a missing file or a non-zero exit — absence IS failure
    const run = execSync(`node "${columnPath}"`, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 1e8 });
    const lines = run.split(/\r?\n/);
    const sumRow = lines.find((l) => l.includes('connectedSum (add a handle/crosscap)') && l.includes('PRODUCTION')) ?? '';
    const refineRow = lines.find((l) => l.includes('refineToDisk (THE EXIT)') && l.includes('PRODUCTION')) ?? '';
    const arrival = lines.find((l) => l.includes('applyCombineToSelection:')) ?? '';
    note(`column verdict: ${run.includes('ALL PASS') ? 'ALL PASS' : 'NOT GREEN'}`);
    note(`@HEAD: ${sumRow.trim().slice(0, 110) || 'connectedSum row not found'}`);
    note(`@HEAD: ${refineRow.trim().slice(0, 110) || 'refineToDisk row not found'}`);
    note(`the arrival, verbatim: ${arrival.trim() || 'arrival line not found'}`);
    return run.includes('ALL PASS') &&
      sumRow.includes('✅ PRODUCTION') && sumRow.includes('REFINES FIRST') &&
      refineRow.includes('✅ PRODUCTION') && refineRow.includes('the person acts') &&
      !refineRow.includes('DEV-ONLY') && !refineRow.includes('via neither door') &&
      arrival.includes('2 src file(s) at cb507c4') && arrival.includes('0 at bd99fb5');
  })());

// ═════ [9] the freeze reads ok ════════════════════════════════════════════════════
console.log('\n----- [9] the freeze is green (zero frozen files in this build) -----');
const freeze = checkEngineFreeze(repoRoot);
check('THE ENGINE FREEZE reads ok with zero drift, zero missing, zero unlisted, zero nulled — no frozen file moved, no manifest hash re-sealed (the count stays the flagship\'s to pin)',
  freeze.ok);

console.log(failures === 0 ? '\nALL PASS' : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
