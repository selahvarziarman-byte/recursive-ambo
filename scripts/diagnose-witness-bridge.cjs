#!/usr/bin/env node

// DIAGNOSTIC — the Engine→UI witnessBridge: a tiny STRUCTURAL check that the bridge
// TRANSLATES faithfully and READS (never invents) the committed engine's known w₁=1 seam.
//
// Through the REAL committed modules (anti-mock = the .ts transpile hook, mirroring
// diagnose-global-w1.cjs): ambo.applyAmboDissection · seeds.createSeedShape ·
// cascadeDriver · globalW1.analyzeGlobalW1 · s4FrameWitnessV0.runFrameWitness/
// buildSiteFrames/transportDirector · connectionWaveInstrumentV0.cycleGraph + the NEW
// src/selectors/witnessBridge.ts.
//
// The VISUAL proof is the running dev server (npm run dev → WitnessRenderV0); this script
// asserts ONLY the structure the render rests on:
//   [1] translate is faithful — appShapeToAssembledComplex(F0) reads b₁/w1Class/χ as grounded.
//   [2] the render-state seam IS the committed engine's seam (site-witness {bd, cd}); the
//       render reads runFrameWitness, it does not invent the seam (non-circular cross-checks).
//   [3] derive-only — the render-state's w₁/orientation/director are the committed outputs,
//       and the bridge re-implements no engine math; F0 is byte-unchanged after all reads.

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

const bridge = req('src/selectors/witnessBridge.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { createSeedShape } = req('src/data/seeds.ts');
const { applyAmboDissection } = req('src/lib/ambo.ts');
const { buildSelfGlueSeed, runCascade, certifyCascadeOrientation } = req('src/lib/cascadeDriver.ts');
const { faceEdgePairs } = req('src/lib/surfaceOperations.ts');
const frame = req('src/lib/s4FrameWitnessV0.ts');
const inst = req('src/lib/connectionWaveInstrumentV0.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sortEdges = (es) =>
  es
    .map((e) => [e.a, e.b].sort((x, y) => x - y))
    .sort((p, q) => p[0] - q[0] || p[1] - q[1]);

// independent substrate (the diagnostic builds its OWN F0 — never the bridge's instance).
const T = createSeedShape('tetrahedron');
const F0 = applyAmboDissection(T);
const F0Snapshot = JSON.stringify(F0); // derive-only guard
const midpointSet = new Set(
  Object.values(F0.vertices)
    .filter((v) => v.createdBy.operation === 'ambo-dissection' && v.createdBy.sourceVertexIds.length === 2)
    .map((v) => v.id),
);
const pureFaces = F0.faces.filter((f) => f.vertexIds.length === 3 && f.vertexIds.every((v) => midpointSet.has(v)));
const intrinsicFace = pureFaces[0];

// independent assembledFromCascade (mirrors the committed witness/SF diagnostics) — used
// ONLY to cross-check the bridge's perCycleW1 without trusting the bridge's own path.
const edgeKey = (u, v) => [u, v].sort((a, b) => a.localeCompare(b)).join('|');
const edgeByKey = new Map();
for (const e of F0.edges) edgeByKey.set(edgeKey(e.vertexIds[0], e.vertexIds[1]), e);
function assembledFromCascade(face, mode) {
  const trace = runCascade(F0, [face], buildSelfGlueSeed(F0, face, mode));
  const repOf = (cs, id) => {
    for (const c of cs) if (c.includes(id)) return c[0];
    return id;
  };
  const vClass = (v) => repOf(trace.partition[0], v);
  const eClass = (e) => repOf(trace.partition[1], e);
  const edges = trace.partition[1].map((c) => {
    const r = F0.edges.find((e) => e.id === c[0]);
    return { id: c[0], u: vClass(r.vertexIds[0]), v: vClass(r.vertexIds[1]) };
  });
  const boundary = faceEdgePairs(face).map(([from, to]) => {
    const r = edgeByKey.get(edgeKey(from, to));
    const cid = eClass(r.id);
    const ae = edges.find((e) => e.id === cid);
    return { edge: cid, dir: ae.u === vClass(from) && ae.v === vClass(to) ? 1 : -1 };
  });
  return { vertices: [...new Set(face.vertexIds.map(vClass))], edges, faces: [{ boundary }] };
}

console.log('witnessBridge: Engine→UI structural check (translate faithful · seam IS the engine · derive-only)\n');

// ===========================================================================
// [1] TRANSLATE IS FAITHFUL — appShapeToAssembledComplex(F0) reads as grounded
// ===========================================================================
console.log('----- [1] translate faithful (the §3 face-word; grounded anchors) -----');
const nV = Object.keys(F0.vertices).length;
const nE = F0.edges.length;
const nF = F0.faces.length;
const translated = bridge.appShapeToAssembledComplex(F0);
const { cert, debug } = analyzeGlobalW1(translated);
check('§1 F0 = 10 vertices / 30 edges / 28 faces (the grounded substrate)', nV === 10 && nE === 30 && nF === 28);
check('§1 translate → cert.b1 === 3 (three independent cycles; the thick 2-complex)', cert.b1 === 3);
check('§1 translate → cert.w1Class === [0,0,0] (every cycle orientable — native dissection carries NO seam)', eq(cert.w1Class, [0, 0, 0]));
check('§1 translate → debug.euler === 8 (χ = V−E+F = 10−30+28; subdivision-invariant)', debug.euler === 8);
check('§1 translate → cert.nonDegenerate === true', cert.nonDegenerate === true);
check('§1 translate → cert.nonOrientable === false (no flip)', cert.nonOrientable === false);
note(`translate: supports=${translated.vertices.length} edge-classes=${translated.edges.length} faces=${translated.faces.length} | b1=${cert.b1} w1Class=${JSON.stringify(cert.w1Class)} χ=${debug.euler} nonDeg=${cert.nonDegenerate}`);

// ===========================================================================
// [2] THE RENDER-STATE SEAM IS THE COMMITTED ENGINE'S SEAM (site-witness {bd, cd})
// ===========================================================================
console.log('\n----- [2] the render-state seam IS the engine seam (non-circular: render reads runFrameWitness) -----');

// (a) the engine seam, derived INDEPENDENTLY in this diagnostic.
const perCycleW1Indep = analyzeGlobalW1(assembledFromCascade(intrinsicFace, 'flip')).debug.perCycleW1; // [1]
const cycle = inst.cycleGraph(6);
const loop = [0, 1, 2, 3, 4, 5];
const witIndep = frame.runFrameWitness(cycle, perCycleW1Indep, loop).witness; // flipEdges over loop indices
// the {bd, cd} site-witness, mapped via the canonical HAM ordering (loop index i → HAM[i]),
// exactly as the committed diagnose-s4-frame-witness.cjs orders the X_K sites.
const HAM = ['ab', 'ac', 'ad', 'bd', 'cd', 'bc'];
const witnessKeysIndep = witIndep.witnessSites.map((i) => HAM[i]).sort();

// (b) the bridge's seam — read from the SAME committed call.
const seam = bridge.buildKnownSeam();
const renderState = bridge.buildKnownSeamRenderState();

check('§2 the glued seam is the committed w₁=1 form: perCycleW1 === [1] (independent) === bridge.perCycleW1', eq(perCycleW1Indep, [1]) && eq(seam.perCycleW1, [1]) && seam.cascadeW1 === 1);
check('§2 the bridge reads the SAME committed witness (flipEdges + witnessSites equal the independent runFrameWitness)', eq(seam.witness.flipEdges, witIndep.flipEdges) && eq(seam.witness.witnessSites, witIndep.witnessSites));
check('§2 the engine seam localizes to the KNOWN site-witness {bd, cd}', eq(witnessKeysIndep, ['bd', 'cd']) && eq(seam.siteKeys.filter((_k, i) => seam.witness.witnessSites.includes(i)).sort(), ['bd', 'cd']));

// (c) the RENDER-STATE seam reduces to the same {bd, cd} — the render did not invent it.
const rsSeamKeys = renderState.seamEdges
  .map((e) => {
    const ka = renderState.sites.find((s) => s.siteId === e.a)?.siteKey;
    const kb = renderState.sites.find((s) => s.siteId === e.b)?.siteKey;
    return [ka, kb].sort();
  });
check('§2 render-state.seamEdges is exactly ONE edge joining the {bd, cd} sites (the highlighted seam)', rsSeamKeys.length === 1 && eq(rsSeamKeys[0], ['bd', 'cd']));
// the bridge's flip edges, mapped back to loop indices via the bridge's own ordering, equal the witness.
const idToIndex = new Map(seam.orderedSiteIds.map((id, i) => [id, i]));
const rsFlipIdx = renderState.seamEdges.map((e) => ({ a: idToIndex.get(e.a), b: idToIndex.get(e.b) }));
check('§2 render-state.seamEdges === the committed flip edges (mapped to loop indices) — reads the engine, invents nothing', eq(sortEdges(rsFlipIdx), sortEdges(seam.witness.flipEdges)));
check('§2 the seam winds: ∏U === −1 (the director returns flipped)', seam.windingSign === -1 && renderState.windingSign === -1);
note(`known seam: flip edge {bd, cd}, witnessSites=${JSON.stringify(seam.witness.witnessSites)} keys={bd,cd} ∏U=${seam.windingSign} | perCycleW1=${JSON.stringify(seam.perCycleW1)}`);
note(`render-state seam edge(s): ${renderState.seamEdges.map((e) => rsSeamKeys[0].join('–')).join(', ')} (joined to F0 site positions by id)`);

// ===========================================================================
// [3] DERIVE-ONLY — the render-state IS the committed outputs; no engine math re-implemented
// ===========================================================================
console.log('\n----- [3] derive-only (w₁/orientation/director are committed outputs; F0 byte-unchanged) -----');

// w₁ is the committed perCycleW1, verbatim.
check('§3 render-state.w1 === committed perCycleW1 (read, not invented)', eq(renderState.w1, perCycleW1Indep) && eq(renderState.w1, [1]));

// the orientation 2-colouring is the committed transportDirector applied to the committed gauge.
const edgeSignsIndep = frame.runFrameWitness(cycle, perCycleW1Indep, loop).edgeSigns;
const orientationsIndep = frame.transportDirector(cycle, edgeSignsIndep, loop).orientations;
const rsOrient = renderState.sites.map((s) => (s.orientationSign > 0 ? 1 : -1));
const expectOrient = loop.map((_i, i) => (orientationsIndep[i] < 0 ? -1 : 1));
check('§3 orientationSign per site === committed transportDirector(flat gauge).orientations (NOT recomputed)', eq(rsOrient, expectOrient));
check('§3 the orientation 2-colouring is non-trivial (the seam splits +1 / −1 sites)', new Set(rsOrient).size === 2);

// the director axes are the committed S₄ frame n_site (the signed octahedral axes).
const labels = renderState.sites.map((s) => s.axisLabel).sort();
check('§3 director axes are the committed signed octahedron {±x,±y,±z} (n_site from buildSiteFrames)', eq(labels, ['+x', '+y', '+z', '-x', '-y', '-z'].sort()));

// the bridge re-implements NO engine math — it IMPORTS the committed modules and contains
// none of their internals (mirrors the §3-watch source-scan in diagnose-s4-frame-witness).
const bridgeSrc = fs.readFileSync(path.join(repoRoot, 'src/selectors/witnessBridge.ts'), 'utf8');
const codeOnly = bridgeSrc.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const importsCommitted =
  /from '\.\.\/lib\/globalW1'/.test(codeOnly) &&
  /from '\.\.\/lib\/s4FrameWitnessV0'/.test(codeOnly) &&
  /from '\.\.\/lib\/connectionWaveInstrumentV0'/.test(codeOnly) &&
  /from '\.\.\/lib\/cascadeDriver'/.test(codeOnly);
const reimplementsMath =
  /\bnullspace\b/.test(codeOnly) ||
  /barycentricSubdivision|\bsubdivide\s*\(/.test(codeOnly) ||
  /\bsignedLaplacian\b/.test(codeOnly) ||
  /\bbuildFlatConnection\s*\(/.test(codeOnly) || // would mean computing the gauge itself
  /function\s+\w*[wW]1\w*\s*\(/.test(codeOnly);
check('§3 the bridge IMPORTS the committed engine (globalW1 · s4FrameWitnessV0 · connectionWaveInstrumentV0 · cascadeDriver)', importsCommitted);
check('§3 the bridge re-implements NO engine math (no nullspace/subdivision/signedLaplacian/own flat-gauge/own w₁)', !reimplementsMath);

// derive-only guard: nothing the bridge did mutated the Shape.
check('§3 derive-only: F0 JSON byte-identical after all bridge + diagnostic reads', JSON.stringify(F0) === F0Snapshot);
note(`render-state: ${renderState.sites.length} X_K sites, orientation 2-colouring=${JSON.stringify(rsOrient)}, axes=${renderState.sites.map((s) => s.axisLabel).join(' ')}`);

// ===========================================================================
console.log(
  `\n--- witnessBridge structural check (translate faithful · seam IS the committed {bd,cd} · derive-only): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
