#!/usr/bin/env node

// DIAGNOSTIC — G5.2 Part B: born-form routing (word → surface class → immersion).
//
// Through the REAL modules: for each v0-reachable op the born form (committed op
// + committed G5.0 materializer) ROUTES to the correct immersion class — the
// classifier derived from the committed pairings/pairSigns, never per-op; the
// recovery is REPLAY-VERIFIED (a foreign id never routes); anything unclassified
// (non-opposite pairing, collapse) falls back to the pre-quotient PATCH (no dot,
// no throw); no parent in the store → 'raw' (surfaced). The immersion each class
// routes to actually BUILDS (Part A + R0).
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

const { parsePairingSuffix, recoverBornSurface, classifyGluingWord, routeBornForm } = req('src/playground/bornFormRouting.ts');
const { glueFace, flipGlueFace, collapseFace } = req('src/lib/surfaceOperations.ts');
const { materializeSurfaceResult } = req('src/lib/materializeOperation.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const P = (edgeA, edgeB, mode) => ({ edgeA, edgeB, mode });

console.log('G5.2 born-form routing: gluing word -> surface class -> immersion (guard: render boundary only)\n');

const parent = loadForm(nGon(4));
const parentSnapshot = JSON.stringify(parent);
const face = parent.faces[0];

// ===== [1] the v0-reachable map, against the committed pairSigns =====
console.log('----- [1] WORD → CLASS (derived from committed pairings/pairSigns; per-op hardcoding impossible) -----');
const routedTable = [];
// (a) TWO-PAIR words — materializable today: full end-to-end (op → G5.0 → route).
const TWO_PAIR = [
  { name: 'two {pres,pres} → torus', op: glueFace, pairings: [P(0, 2, 'preserving'), P(1, 3, 'preserving')], expected: 'torus', signs: [1, 1] },
  { name: 'two {pres,rev} → klein', op: flipGlueFace, pairings: [P(0, 2, 'preserving'), P(1, 3, 'reversing')], expected: 'klein', signs: [1, -1] },
  { name: 'two {rev,rev} (antipodal — the registry op) → rp2', op: flipGlueFace, pairings: [P(0, 2, 'reversing'), P(1, 3, 'reversing')], expected: 'rp2', signs: [-1, -1] },
];
for (const entry of TWO_PAIR) {
  const trace = entry.op(parent, face, entry.pairings);
  const born = materializeSurfaceResult(parent, face, trace).shape;
  const route = routeBornForm(born, parent);
  const signsMatch = JSON.stringify(trace.pairSigns) === JSON.stringify(entry.signs);
  check(`§1 ${entry.name}: committed pairSigns ${JSON.stringify(trace.pairSigns)}; routed 'immersion'/${entry.expected}`, signsMatch && route.kind === 'immersion' && route.surface === entry.expected);
  check(`§1 ${entry.name}: classifyGluingWord(pairings) === '${entry.expected}'`, classifyGluingWord(entry.pairings, 4) === entry.expected);
  routedTable.push({ word: entry.pairings.map((p) => `${p.edgeA}-${p.edgeB}${p.mode[0]}`).join(':'), signs: JSON.stringify(trace.pairSigns), routed: route.kind === 'immersion' ? route.surface : route.kind });
}
// (b) SINGLE-PAIR words — the (soon) single-pair registry ops: the CLASSIFIER is
// proven ready against the committed pairSigns; end-to-end materialization is NOT
// possible today — FINDING (surfaced, guard held): G5.0's pairing reconstruction
// requires every boundary edge paired (`remaining.length !== 0`), so an OPEN
// (partial-pairing) certificate is refused ("NO pairing reproduces this trace").
// materializeOperation is byte-unchanged per THIS mandate's guard; the one-line
// completeness fix needs its own sanction (reported for the engineer).
const SINGLE_PAIR = [
  { name: 'single preserving → cylinder', op: glueFace, pairings: [P(0, 2, 'preserving')], expected: 'cylinder', signs: [1] },
  { name: 'single reversing → mobius', op: flipGlueFace, pairings: [P(0, 2, 'reversing')], expected: 'mobius', signs: [-1] },
];
for (const entry of SINGLE_PAIR) {
  const trace = entry.op(parent, face, entry.pairings);
  const signsMatch = JSON.stringify(trace.pairSigns) === JSON.stringify(entry.signs);
  check(`§1 ${entry.name}: committed pairSigns ${JSON.stringify(trace.pairSigns)}; classifier ready`, signsMatch && classifyGluingWord(entry.pairings, 4) === entry.expected);
  let openRefused = false;
  try {
    materializeSurfaceResult(parent, face, trace);
  } catch (error) {
    openRefused = String(error.message).includes('NO pairing reproduces');
  }
  check(`§1 ${entry.name}: FINDING — G5.0 refuses the open (partial-pairing) certificate today (surfaced, not patched: the guard holds)`, openRefused);
  routedTable.push({ word: entry.pairings.map((p) => `${p.edgeA}-${p.edgeB}${p.mode[0]}`).join(':'), signs: JSON.stringify(trace.pairSigns), routed: `${entry.expected} (classifier ready; materializer gap — finding)` });
}

// each routed class's immersion BUILDS (Part A + R0) — the render target exists.
for (const key of ['cylinder', 'mobius', 'torus', 'klein', 'rp2']) {
  const { shape } = immerseSurface({ surface: key, resolution: 4 });
  check(`§1 immersion target '${key}' builds (R=4 smoke)`, Object.keys(shape.vertices).length > 0 && shape.faces.length === 16);
}

// ===== [2] recovery is replay-verified =====
console.log('\n----- [2] RECOVERY (parsed suffix + committed replay; foreign ids never route) -----');
const rp2Trace = flipGlueFace(parent, face, [P(0, 2, 'reversing'), P(1, 3, 'reversing')]);
const rp2Born = materializeSurfaceResult(parent, face, rp2Trace).shape;
const parsed = parsePairingSuffix(rp2Born.id);
check('§2 the materializer id suffix parses to the pairings', JSON.stringify(parsed) === JSON.stringify([P(0, 2, 'reversing'), P(1, 3, 'reversing')]));
const recovery = recoverBornSurface(rp2Born, parent);
check('§2 recovery replays the committed op to a BYTE-IDENTICAL born form', Boolean(recovery) && JSON.stringify(recovery.materialized.shape) === JSON.stringify(rp2Born));
const tampered = { ...rp2Born, id: rp2Born.id.replace('0-2r', '0-2p') };
check('§2 a tampered pairing suffix does NOT route (replay mismatch → null → fallback)', recoverBornSurface(tampered, parent) === null && routeBornForm(tampered, parent).kind !== 'immersion');
const wrongParent = loadForm(nGon(6));
check('§2 the wrong parent does NOT route (parent id mismatch)', recoverBornSurface(rp2Born, wrongParent) === null);

// ===== [3] the fallback (unclassified → patch; never a dot, never a throw) =====
console.log('\n----- [3] FALLBACK (unclassified → the pre-quotient patch) -----');
// (a) a NON-OPPOSITE pairing (adjacent edges) — replays fine, classifies null.
const adjacentTrace = flipGlueFace(parent, face, [P(0, 1, 'reversing'), P(2, 3, 'reversing')]);
const adjacentBorn = materializeSurfaceResult(parent, face, adjacentTrace).shape;
let adjacentRoute = null;
let adjacentThrew = false;
try {
  adjacentRoute = routeBornForm(adjacentBorn, parent);
} catch {
  adjacentThrew = true;
}
check('§3 a non-opposite word is UNCLASSIFIED → patch fallback (no throw)', !adjacentThrew && adjacentRoute.kind === 'patch');
check('§3 the patch carries the parent face + the quotient classes (renderable — not a dot)', adjacentRoute.kind === 'patch' && adjacentRoute.displayFaces.length === 1 && adjacentRoute.displayFaces[0].id === face.id && Object.keys(adjacentRoute.vertexClassOf).length > 0);
check('§3 classifyGluingWord rejects the non-opposite structure', classifyGluingWord([P(0, 1, 'reversing'), P(2, 3, 'reversing')], 4) === null);
// (b) collapse — a surface op outside the glue family: recovery declines → patch.
const collapseBorn = materializeSurfaceResult(parent, face, collapseFace(parent, face)).shape;
const collapseRoute = routeBornForm(collapseBorn, parent);
check("§3 a collapse born form routes to 'patch' (op outside the glue family; honest fallback)", collapseRoute.kind === 'patch');
// (c) no parent in the store → 'raw' (the caller keeps its primitive viewport).
check("§3 no parent → 'raw' (surfaced last resort)", routeBornForm(rp2Born, null).kind === 'raw');

// ===== the routing table =====
console.log('\n  WORD (suffix)   pairSigns   ROUTED');
for (const r of routedTable) {
  const pad = (s, w) => String(s).padEnd(w);
  console.log(`  ${pad(r.word, 16)}${pad(r.signs, 12)}${r.routed}`);
}

console.log('\n----- discipline -----');
check('derive-only: the parent form is byte-unchanged after all routing', JSON.stringify(parent) === parentSnapshot);

console.log(
  `\n--- G5.2 born-form routing (word→class vs committed pairSigns, replay-verified recovery, honest fallbacks): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
