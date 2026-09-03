#!/usr/bin/env node

// DIAGNOSTIC — the general COMPLEX-IDENTIFICATION op (researcher-ruled G1–G4;
// SEAL-BEFORE-BUILD). BUILT BLIND to `.handoff/SEAL_COMPLEX_IDENTIFICATION.md`
// — every pin below is the BUILDER'S OWN measured concrete; the engineer
// unseals and audits these against the seal; the mothership co-ratifies.
//
//   §a ★ THE RIM GLUE, BOTH MODES — a ≥2-face committed cylinder (immersion
//      rep, {V:20,E:36,F:16}, two 4-edge rims) sewn rim-to-rim:
//      PRESERVING → {V:16,E:32,F:16}, χ=0, w₁=0, connected, closed, gate
//      PASS — the certifier reads "genus 1 (closed, orientable)": THE TORUS.
//      REVERSING → same counts, χ=0, w₁=1, connected, closed, gate PASS —
//      "cross-caps 2 (closed, non-orientable)": THE KLEIN BOTTLE. The two
//      modes are GENUINELY different (the seam is non-separating — the G3
//      anti-over-claim law's biting side).
//   §b THE ENDPOINT-KEYED CONTROL — the same rim glue on a height-1 tube
//      (V8 E12 F4; its sewn torus carries PARALLEL edge classes), re-derived
//      endpoint-keyed: the parallel classes FUSE, E 8→4, χ 0→4, junctions
//      everywhere — the route-B trap is REAL; the explicit-signed-class
//      enactment is load-bearing, not decorative.
//   §c INTERIOR identification — ENACTED (G1: never pre-refused), the merged
//      class carries 4 wedges, and the GATE refuses naming the junction.
//   §d ★ THE SINGLE-FACE ADAPTER (delegation truth pinned 2026-07-12,
//      mothership-ruled): identify()'s single-face path DELEGATES to the
//      committed word machinery BY CONSTRUCTION (`via: 'committed-word'`,
//      asserted below), so this section witnesses the ADAPTER — the
//      edge-walk → slot resolution and the mode convention — reproducing the
//      committed word-op result byte-identically (shape, complex, ledger,
//      invariants) for ALL FIVE words: torus (abAB), Klein (abaB), RP²
//      (abab), cylinder (abcB), Möbius (abcb); the Klein's MIXED word rides
//      the per-pair modes. It is NOT — and must never again be described
//      as — a witness of the general enactment (`identifyOnComplex`): the
//      enactment's independent witness is diagnose-identify-oracle.cjs.
//   §e RE-CERTIFICATION — the born identification replays + byte-compares
//      (foreign parents rejected); the recovered complex certifies through
//      the committed certifier + classifier; the sewn torus even
//      direct-bridges into readFormInvariants ("genus 1 (closed,
//      orientable)").
//   §f THE EXPOSURE — the registry's two SEW ops (the meaningful boundary
//      sub-family; eligibility = the committed P-IMMERSE boundary-circle
//      counter): eligible exactly on ≥2-circle explicit complexes; a disk, a
//      closed genus-2, and a single-face quotient each refuse with their
//      honest reasons; the sewn birth routes to a CLASS BODY in the
//      manuscript (the P-IMMERSE pipeline reads it genus-1).
//   §g NO-REGRESSION — the committed word ops, chaining machinery, assemble/
//      connectedSum, cut, the certifiers, the gate: byte-unchanged vs HEAD.
//
// Anti-mock: requiring the REAL TS modules through the transpile hook is the guard.

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');
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
  identify,
  sewBoundaryCircles,
  walkBoundaryCircles,
  recoverIdentifiedComplex,
  readIdentificationGate,
  parseIdentificationSuffix,
} = req('src/lib/complexIdentification.ts');
const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { serializeSnapshot, deserializeSnapshot } = req('src/playground/snapshot.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { loadForm } = req('src/lib/multiform.ts');
const { nGon } = req('src/playground/primitiveCatalogue.ts');
const { getPlaygroundOperation, PLAYGROUND_OPERATIONS } = req('src/playground/playgroundOperations.ts');
const { glueFace, flipGlueFace } = req('src/lib/surfaceOperations.ts');
const { materializeSurfaceResult } = req('src/lib/materializeOperation.ts');
const { buildLedgerFromIdentification } = req('src/lib/transformationLedger.ts');
const { readFormInvariants } = req('src/playground/formInvariants.ts');
const { classifyComplexComponent, classLabel, readBoundary, acquireFaithfulComplex } = req('src/manuscript/surfaceClassifier.ts');
const { routeWrittenRender } = req('src/manuscript/writtenFormModel.ts');
const { connectedSum } = req('src/lib/connectedSum.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const copyOf = (shape, prefix) => deserializeSnapshot(serializeSnapshot(shape, prefix)).shape;

const b0Of = (shape) => {
  const parent = new Map();
  const find = (x) => {
    if (!parent.has(x)) parent.set(x, x);
    let r = x;
    while (parent.get(r) !== r) r = parent.get(r);
    return r;
  };
  for (const v of Object.keys(shape.vertices)) find(v);
  for (const e of shape.edges) parent.set(find(e.vertexIds[0]), find(e.vertexIds[1]));
  return new Set(Object.keys(shape.vertices).map((v) => find(v))).size;
};
const summarize = (r) => {
  const cert = analyzeGlobalW1(r.complex);
  return {
    V: Object.keys(r.shape.vertices).length,
    E: r.complex.edges.length,
    F: r.complex.faces.length,
    chi: cert.debug.euler,
    w1: cert.cert.nonOrientable ? 1 : 0,
    b1: cert.cert.b1,
    b0: b0Of(r.shape),
    free: r.gate.freeEdgeIds.length,
    manifold: r.gate.manifold,
  };
};

console.log('complex identification: the complex can be SEWN (blind concretes)\n');

// ===== [a] ★ the rim glue, both modes ==========================================
console.log('----- [a] the cylinder rim sew: preserving → torus · reversing → Klein -----');
const cyl = copyOf(immerseSurface({ surface: 'cylinder', resolution: 4 }).shape, 'ciA');
check('fixture: the committed ≥2-face cylinder rep is {V:20, E:36, F:16} with TWO 4-edge boundary circles',
  Object.keys(cyl.vertices).length === 20 && cyl.edges.length === 36 && cyl.faces.length === 16 &&
  (() => {
    const acquired = acquireFaithfulComplex(cyl, null);
    const circles = walkBoundaryCircles(acquired.complex);
    return acquired.source === 'direct' && circles !== null && circles.length === 2 &&
      circles.every((c) => c.edgeIds.length === 4) &&
      readBoundary(acquired.complex).circles === 2; // the walker agrees with the committed counter
  })());
const torusSewn = sewBoundaryCircles(cyl, 'preserving');
const mT = summarize(torusSewn);
check('PRESERVING: {V:16, E:32, F:16}, χ=0, w₁=0, CONNECTED (b₀=1), CLOSED (0 free), manifold gate PASS',
  eq(mT, { V: 16, E: 32, F: 16, chi: 0, w1: 0, b1: 2, b0: 1, free: 0, manifold: true }));
const clsT = classifyComplexComponent(torusSewn.complex);
check('…and the committed certifier names it: THE TORUS (genus 1, b₁=2)',
  clsT.ok && classLabel(clsT.class) === 'genus 1');
const kleinSewn = sewBoundaryCircles(cyl, 'reversing');
const mK = summarize(kleinSewn);
check('REVERSING: same counts, χ=0, w₁=1, CONNECTED, CLOSED, manifold gate PASS',
  eq(mK, { V: 16, E: 32, F: 16, chi: 0, w1: 1, b1: 2, b0: 1, free: 0, manifold: true }));
const clsK = classifyComplexComponent(kleinSewn.complex);
check('…and the committed certifier names it: THE KLEIN BOTTLE (2 cross-caps)',
  clsK.ok && classLabel(clsK.class) === '2 cross-caps');
check('the two modes are GENUINELY different (w₁ 0 vs 1 — the non-separating seam BITES: the G3 anti-over-claim law\'s biting side)',
  mT.w1 !== mK.w1);
note(`preserving: ${JSON.stringify(mT)}`);
note(`reversing:  ${JSON.stringify(mK)}`);
const lawSource = fs.readFileSync(path.join(repoRoot, 'src/lib/complexIdentification.ts'), 'utf8');
check('the anti-over-claim law is STATED IN THE CODE (mode bites iff non-separating; connectedSum\'s separating seam is the inert side)',
  lawSource.includes('ANTI-OVER-CLAIM LAW') && lawSource.includes('NON-SEPARATING') && lawSource.includes('SEPARAT'));

// ===== [b] the endpoint-keyed control ===========================================
console.log('\n----- [b] the route-B trap is REAL: endpoint-keying corrupts χ -----');
const tube = loadForm(() => ({
  name: 'tube4x1',
  vertices: [
    { id: 'a0', position: [1, 0, 0] }, { id: 'a1', position: [0, 0, 1] }, { id: 'a2', position: [-1, 0, 0] }, { id: 'a3', position: [0, 0, -1] },
    { id: 'b0', position: [1, 1, 0] }, { id: 'b1', position: [0, 1, 1] }, { id: 'b2', position: [-1, 1, 0] }, { id: 'b3', position: [0, 1, -1] },
  ],
  faces: [0, 1, 2, 3].map((i) => ({ vertexIds: [`a${i}`, `a${(i + 1) % 4}`, `b${(i + 1) % 4}`, `b${i}`] })),
}), 'tb');
const tubeSewn = sewBoundaryCircles(tube, 'preserving');
const mTube = summarize(tubeSewn);
check('the height-1 tube (V8 E12 F4) sews CORRECTLY: the 4×1 torus — {V:4, E:8, F:4}, χ=0, w₁=0, manifold (its 4 seam classes run PARALLEL to the verticals — explicit classes carry it)',
  eq(mTube, { V: 4, E: 8, F: 4, chi: 0, w1: 0, b1: 2, b0: 1, free: 0, manifold: true }) && tubeSewn.seamEdgeIds.length === 4);
// the CONTROL: re-derive the enacted complex ENDPOINT-KEYED (the trap, deliberately)
const seen = new Map();
for (const e of tubeSewn.complex.edges) {
  const key = [e.u, e.v].sort().join('|');
  if (!seen.has(key)) seen.set(key, { id: e.id, u: e.u, v: e.v });
}
const corrupt = {
  vertices: tubeSewn.complex.vertices,
  edges: [...seen.values()],
  faces: tubeSewn.complex.faces.map((f) => ({
    boundary: f.boundary.map((slot) => {
      const orig = tubeSewn.complex.edges.find((e) => e.id === slot.edge);
      const rec = seen.get([orig.u, orig.v].sort().join('|'));
      return { edge: rec.id, dir: rec.u === (slot.dir === 1 ? orig.u : orig.v) ? 1 : -1 };
    }),
  })),
};
const chiCorrupt = corrupt.vertices.length - corrupt.edges.length + corrupt.faces.length;
const gateCorrupt = readIdentificationGate(corrupt);
check('the SAME sew re-derived by ENDPOINTS: the parallel classes FUSE (E 8→4), χ CORRUPTS (0→4), and the gate reads junctions everywhere',
  corrupt.edges.length === 4 && chiCorrupt === 4 && gateCorrupt.manifold === false && gateCorrupt.junctionEdgeIds.length === 4);
note(`control: E ${tubeSewn.complex.edges.length}→${corrupt.edges.length}, χ ${mTube.chi}→${chiCorrupt} — the explicit-signed-class enactment is load-bearing`);
const tubeKlein = sewBoundaryCircles(tube, 'reversing');
check('(the tube\'s reversing sew is its Klein: χ=0, w₁=1, manifold — both modes live on parallel-class complexes too)',
  summarize(tubeKlein).w1 === 1 && summarize(tubeKlein).manifold === true);

// ===== [c] interior identification: enacted, gate-refused ======================
console.log('\n----- [c] interior identification: the op runs; the GATE refuses, naming the junction -----');
const cylB = copyOf(immerseSurface({ surface: 'cylinder', resolution: 4 }).shape, 'ciB');
const acquiredB = acquireFaithfulComplex(cylB, null);
const wedgeCount = new Map();
for (const e of acquiredB.complex.edges) wedgeCount.set(e.id, 0);
for (const f of acquiredB.complex.faces) for (const s of f.boundary) wedgeCount.set(s.edge, wedgeCount.get(s.edge) + 1);
const interiorIds = acquiredB.complex.edges.filter((e) => wedgeCount.get(e.id) === 2).map((e) => e.id);
const interiorResult = identify(cylB, [interiorIds[0]], [interiorIds[5]], 'preserving');
check('the op ENACTS the interior identification — no pre-refusal (G1)', interiorResult.via === 'general' && interiorResult.shape.faces.length === 16);
const seamWedges = interiorResult.complex.faces.flatMap((f) => f.boundary).filter((s) => s.edge === interiorResult.seamEdgeIds[0]).length;
check('the merged class carries FOUR face wedges (G2: one class, the union of wedges)', seamWedges === 4);
check('…and the GATE refuses, NAMING the junction class (instruments, not guards)',
  interiorResult.gate.manifold === false &&
  interiorResult.gate.junctionEdgeIds.length === 1 &&
  interiorResult.gate.junctionEdgeIds[0] === interiorResult.seamEdgeIds[0] &&
  String(interiorResult.gate.refusal).includes('>2 face wedges') &&
  String(interiorResult.gate.refusal).includes(interiorResult.seamEdgeIds[0]));
note(`gate: ${String(interiorResult.gate.refusal).slice(0, 120)}…`);

// ===== [d] ★ the single-face ADAPTER (delegation — the five-word compare) =====
// DELEGATION TRUTH (mothership-ruled, 2026-07-12): `mine.via ===
// 'committed-word'` below is the plain marker that BOTH sides of this compare
// run the SAME committed machinery — the adapter is what this witnesses;
// `identifyOnComplex` never executes here and is witnessed by the
// differential oracle (diagnose-identify-oracle.cjs), never by this section.
console.log('\n----- [d] the five committed words through the single-face ADAPTER (delegation — witnesses the adapter, never the enactment) -----');
const WORDS = [
  { id: 'glue-cylinder', word: 'cylinder (abcB)', arcsA: [0], arcsB: [2], modes: ['preserving'] },
  { id: 'flip-glue-mobius', word: 'Möbius (abcb)', arcsA: [0], arcsB: [2], modes: ['reversing'] },
  { id: 'glue-torus', word: 'torus (abAB)', arcsA: [0, 1], arcsB: [2, 3], modes: ['preserving', 'preserving'] },
  { id: 'flip-glue-klein', word: 'Klein (abaB) — MIXED modes', arcsA: [0, 1], arcsB: [2, 3], modes: ['preserving', 'reversing'] },
  { id: 'flip-glue', word: 'RP² (abab)', arcsA: [0, 1], arcsB: [2, 3], modes: ['reversing', 'reversing'] },
];
const edgeOfSlot = (form, k) => {
  const vs = form.faces[0].vertexIds;
  const [a, b] = [vs[k], vs[(k + 1) % vs.length]];
  return form.edges.find((e) => (e.vertexIds[0] === a && e.vertexIds[1] === b) || (e.vertexIds[0] === b && e.vertexIds[1] === a)).id;
};
for (const w of WORDS) {
  const sqMine = loadForm(nGon(4), 'w5');
  const sqTheirs = loadForm(nGon(4), 'w5'); // identical namespace → byte-identical fixtures
  const mine = identify(sqMine, w.arcsA.map((k) => edgeOfSlot(sqMine, k)), w.arcsB.map((k) => edgeOfSlot(sqMine, k)), w.modes);
  const committedShape = getPlaygroundOperation(w.id).execute({
    form: sqTheirs, selectedFaceId: sqTheirs.faces[0].id, selectedFace: sqTheirs.faces[0], parentShape: null,
  });
  const pairings = w.arcsA.map((a, i) => ({ edgeA: a, edgeB: w.arcsB[i], mode: w.modes[i] }));
  const op = pairings.some((p) => p.mode === 'reversing') ? flipGlueFace : glueFace;
  const mat = materializeSurfaceResult(sqTheirs, sqTheirs.faces[0], op(sqTheirs, sqTheirs.faces[0], pairings), pairings);
  const committedLedger = buildLedgerFromIdentification(
    [...new Set(sqTheirs.faces[0].vertexIds)],
    (siteId) => mat.supportOf[siteId] ?? siteId,
  );
  check(`${w.word}: shape, complex, ledger, invariants — ALL byte-identical to the committed word op`,
    mine.via === 'committed-word' &&
    eq(mine.shape, committedShape) &&
    eq(mine.complex, mat.complex) &&
    eq(mine.ledger, committedLedger) &&
    eq(readFormInvariants(mine.shape, sqMine), readFormInvariants(committedShape, sqTheirs)));
}

// ===== [e] re-certification ====================================================
console.log('\n----- [e] the born identification is replayable + certifiable forever -----');
const cylC = copyOf(immerseSurface({ surface: 'cylinder', resolution: 4 }).shape, 'ciC');
const sewn = sewBoundaryCircles(cylC, 'preserving');
check('the birth id ENCODES the identification (parse round-trip)',
  eq(parseIdentificationSuffix(sewn.shape.id), sewn.spec));
const recovered = recoverIdentifiedComplex(sewn.shape, cylC);
check('replay + byte-compare recovers the born identification (shape, complex, ledger)',
  recovered !== null && eq(recovered.complex, sewn.complex) && eq(recovered.ledger, sewn.ledger));
check('a FOREIGN parent never recovers (the committed recoverBornSurface idiom)',
  recoverIdentifiedComplex(sewn.shape, copyOf(immerseSurface({ surface: 'cylinder', resolution: 4 }).shape, 'ciD')) === null);
const recCert = analyzeGlobalW1(recovered.complex);
check('the recovered complex certifies through the COMMITTED certifier (χ=0, b₁=2, orientable)',
  recCert.debug.euler === 0 && recCert.cert.b1 === 2 && !recCert.cert.nonOrientable);
const sewnInv = readFormInvariants(sewn.shape);
check('…and this born form even DIRECT-bridges: readFormInvariants reads "genus 1 (closed, orientable)" (not un-certifiable)',
  sewnInv.complexSource === 'direct' && sewnInv.classification === 'genus 1 (closed, orientable)');

// ===== [f] the exposure: the registry SEW ops ==================================
console.log('\n----- [f] the registry sub-family: sew two boundary circles -----');
const sewOps = ['sew-boundary-preserving', 'sew-boundary-reversing'].map((id) => getPlaygroundOperation(id));
const cylCtx = { form: cyl, selectedFaceId: null, selectedFace: null, parentShape: null };
check('both sew ops APPLY to the two-rim cylinder (whole-form; no face needed — the dual precedent)',
  sewOps.every((op) => op.canApply(cylCtx) === true && op.getDisabledReason(cylCtx) === null));
const bornViaRegistry = sewOps[0].execute(cylCtx);
check('the registry execute births the sewn torus (χ via the certifier on the recovery)',
  readFormInvariants(bornViaRegistry).classification === 'genus 1 (closed, orientable)');
const disk = loadForm(nGon(4), 'dsk');
const diskCtx = { form: disk, selectedFaceId: null, selectedFace: null, parentShape: null };
check('a disk refuses: "1 boundary circle — sewing needs two"',
  sewOps.every((op) => op.canApply(diskCtx) === false) &&
  String(sewOps[0].getDisabledReason(diskCtx)).includes('1 boundary circle'));
const torusRep = (prefix) => copyOf(immerseSurface({ surface: 'torus', resolution: 4 }).shape, prefix);
const genus2 = connectedSum(torusRep('sgA'), torusRep('sgB')).shape;
const g2Ctx = { form: genus2, selectedFaceId: null, selectedFace: null, parentShape: null };
check('a CLOSED genus-2 refuses: "0 boundary circles"',
  sewOps.every((op) => op.canApply(g2Ctx) === false) &&
  String(sewOps[0].getDisabledReason(g2Ctx)).includes('0 boundary circles'));
const sqQ = loadForm(nGon(4), 'sqQ');
const bornCyl = getPlaygroundOperation('glue-cylinder').execute({ form: sqQ, selectedFaceId: sqQ.faces[0].id, selectedFace: sqQ.faces[0], parentShape: null });
const bornCylCtx = { form: bornCyl, selectedFaceId: null, selectedFace: null, parentShape: sqQ };
check('a SINGLE-FACE quotient (the word-born cylinder) refuses toward the committed word chain (its rims are the composed word\'s to sew)',
  sewOps.every((op) => op.canApply(bornCylCtx) === false) &&
  String(sewOps[0].getDisabledReason(bornCylCtx)).includes('committed word ops'));
const manuscriptRender = routeWrittenRender(bornViaRegistry, cyl, 8);
check('the sewn birth renders in the MANUSCRIPT as an honest CLASS BODY: genus 1 (the P-IMMERSE pipeline reads the new op\'s child)',
  manuscriptRender.mode === 'classBody' && manuscriptRender.model.components[0].label === 'genus 1');

// ===== [g] no-regression byte-guards ===========================================
console.log('\n----- [g] the committed machinery is byte-unchanged -----');
// THE ENGINE FREEZE MANIFEST (engineer-chartered 2026-07-12): the old
// per-diagnostic HEAD-differential guard REQUIRED A HOLE IN ITSELF to permit
// any sanctioned change (a carve-out — silent, and permanent unless a human
// remembered; `playgroundOperations.ts` ended up guarded by NOBODY). The
// engine is now frozen by ONE on-repo manifest of content hashes
// (docs/governance/ENGINE_FREEZE_MANIFEST.txt): a sanctioned change is a
// one-line hash update in the SAME commit, and coverage never lapses. The
// shared checker READS the manifest and can never write it.
const { checkEngineFreeze } = require(path.join(__dirname, 'lib', 'engineFreeze.cjs'));
const freeze = checkEngineFreeze();
// 27 → 44 (2026-07-14, THE SMALL RUN): the freeze closed under imports — a
// frozen file is only as frozen as its dependencies; src/types joined the scan.
check('THE ENGINE FREEZE MANIFEST: all 45 frozen engine files (import-closed) match their manifest hashes and every source file under the engine roots is classified — drifted [] · missing [] · unlisted []',
  freeze.ok === true && freeze.checked === 48 /* 47 → 48: cornerCycleName.ts joined the frozen set at the A-3b closure cure (2d9eb97) — the ONE corner-cycle composer frozen beside its frozen consumer */ &&
  freeze.drifted.length === 0 && freeze.missing.length === 0 && freeze.unlisted.length === 0);
if (!freeze.ok) note(`drifted: [${freeze.drifted}] · missing: [${freeze.missing}] · unlisted: [${freeze.unlisted}]`);
// THE FREEZE CHECK STILL BITES (stub-proof — a checker that cannot fail is dead):
const FREEZE_SENTINEL = 'src/lib/incidenceTraceRegistry.ts';
const sentinelContent = fs.readFileSync(path.join(repoRoot, FREEZE_SENTINEL), 'utf8');
const sentinelFlipped = sentinelContent.slice(0, 100) + (sentinelContent[100] === 'X' ? 'Y' : 'X') + sentinelContent.slice(101);
const freezeBite = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelFlipped } });
const freezeCrlf = checkEngineFreeze({ overrides: { [FREEZE_SENTINEL]: sentinelContent.replace(/\r/g, '').replace(/\n/g, '\r\n') } });
check('…and the freeze check still BITES: a one-character in-memory mutation of the sentinel FAILS it (exactly that file drifts) while the CRLF re-expression PASSES (CR-insensitive — no false wolf)',
  freezeBite.ok === false && freezeBite.drifted.length === 1 && freezeBite.drifted[0] === FREEZE_SENTINEL &&
  freezeCrlf.ok === true);

console.log(`\n${failures === 0 ? 'ALL PASS' : `${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
