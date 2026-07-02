#!/usr/bin/env node

// DIAGNOSTIC — R0: the render-immersion foundation (ADR 0018).
//
// For each degenerate-boundary surface {torus, klein, rp2}: `immerseSurface`
// emits a subdivided Shape whose COMBINATORIAL topology matches the known class
// — asserted through the COMMITTED `analyzeGlobalW1` (χ via its cellCounts/euler
// path on the same working complex, orientability + w₁ class via the certified
// cocycle) — whose every vertex link is a single interior cycle (a closed
// combinatorial manifold; Klein/RP² self-intersection is geometric only), whose
// immersion RESPECTS the gluing word (every merged class's members map to one R³
// point — verified here independently via the exported `immersionPosition`),
// and whose quotient correspondence is complete and consistent (for L2/L3).
// The topology targets are standard/ratified (no seal): torus χ=0 orientable
// b₁=2 w₁=[0,0]; Klein χ=0 non-orientable b₁=2 w₁=[0,1]; RP² χ=1 non-orientable
// b₁=1 w₁=[1].
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

const { immerseSurface, immersionPosition } = req('src/lib/surfaceImmersion.ts');
const { SURFACE_CATALOGUE } = req('src/playground/surfaceCatalogue.ts');
const { analyzeGlobalW1 } = req('src/lib/globalW1.ts');
const { buildVertexLinkAdjacency, decomposeLink } = req('src/lib/incidenceTraceRegistry.ts');
const { canonicalEdgeKey } = req('src/lib/ids.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Build the AssembledComplex of a Shape: edge-classes from shape.edges, each
// face's boundary word read slot-by-slot against the edge's stored orientation
// (mirrors the committed diagnose-global-w1 construction; derive-only).
function buildAssembled(shape) {
  const edgeByKey = new Map(
    shape.edges.map((e) => [canonicalEdgeKey(e.vertexIds[0], e.vertexIds[1]), e]),
  );
  const faces = shape.faces.map((face) => {
    const vs = face.vertexIds;
    const boundary = vs.map((x, k) => {
      const y = vs[(k + 1) % vs.length];
      const edge = edgeByKey.get(canonicalEdgeKey(x, y));
      if (!edge) throw new Error(`no edge for face slot ${x}->${y}`);
      const dir = edge.vertexIds[0] === x && edge.vertexIds[1] === y ? 1 : -1;
      return { edge: edge.id, dir };
    });
    return { boundary };
  });
  return {
    vertices: Object.keys(shape.vertices),
    edges: shape.edges.map((e) => ({ id: e.id, u: e.vertexIds[0], v: e.vertexIds[1] })),
    faces,
  };
}

// Per-vertex link via the COMMITTED constructions: reading-shaped face cycles ->
// buildVertexLinkAdjacency -> decomposeLink.
function linkValences(shape) {
  const results = [];
  for (const vertexId of Object.keys(shape.vertices)) {
    const readings = shape.faces
      .filter((face) => face.vertexIds.includes(vertexId))
      .map((face) => ({ medialCycle: face.vertexIds }));
    const decomposition = decomposeLink(buildVertexLinkAdjacency(vertexId, readings));
    results.push({ vertexId, valence: decomposition.valence, strata: decomposition.strata.length, pinch: decomposition.pinch });
  }
  return results;
}

// The ratified class targets (standard — no seal on this mandate).
const TARGETS = {
  torus: { chi: 0, nonOrientable: false, b1: 2, w1Class: [0, 0] },
  klein: { chi: 0, nonOrientable: true, b1: 2, w1Class: [0, 1] },
  rp2: { chi: 1, nonOrientable: true, b1: 1, w1Class: [1] },
};
const DIAG_RESOLUTION = 8; // small enough for the committed GF(2) H₁ pipeline

console.log('R0 surface immersion: degenerate-boundary surfaces -> subdivided immersed Shapes\n');

for (const surface of ['torus', 'klein', 'rp2']) {
  const target = TARGETS[surface];
  console.log(`----- [${surface}] R=${DIAG_RESOLUTION} (word-glued quotient, immersed) -----`);
  const { shape, correspondence } = immerseSurface({ surface, resolution: DIAG_RESOLUTION });
  const R = DIAG_RESOLUTION;
  const V = Object.keys(shape.vertices).length;
  const E = shape.edges.length;
  const F = shape.faces.length;

  // topology of the class — through the COMMITTED analyzeGlobalW1 (χ from its
  // cellCounts/euler on the working complex; orientability from the certificate).
  const { cert, debug } = analyzeGlobalW1(buildAssembled(shape));
  check(`${surface}: χ === ${target.chi} (committed cellCounts/euler path)`, debug.euler === target.chi);
  check(`${surface}: shape-level V−E+F agrees (χ === ${target.chi})`, V - E + F === target.chi);
  check(`${surface}: nonOrientable === ${target.nonOrientable} (committed globalW1Class)`, cert.nonOrientable === target.nonOrientable);
  check(`${surface}: b₁ === ${target.b1} and w1Class === ${JSON.stringify(target.w1Class)}`, cert.b1 === target.b1 && eq(cert.w1Class, target.w1Class));
  check(`${surface}: w₁ certificate non-degenerate`, cert.nonDegenerate === true);
  note(`V=${V} E=${E} F=${F} | χ(shape)=${V - E + F} χ(subdivided)=${debug.euler} | b₁=${cert.b1} w1Class=${JSON.stringify(cert.w1Class)} nonOrientable=${cert.nonOrientable}`);
  note(`subdivision cellCounts=${JSON.stringify(debug.cellCounts)}`);

  // closed combinatorial manifold: every vertex link one interior cycle.
  const links = linkValences(shape);
  check(`${surface}: every vertex link single-component interior (${links.length} vertices)`, links.length === V && links.every((l) => l.valence === 'interior' && l.strata === 1 && !l.pinch));

  // the quotient correspondence is complete + consistent.
  const gridPoints = (R + 1) * (R + 1);
  const mappedGrid = Object.keys(correspondence.gridVertexTo).length;
  const absorbed = Object.values(correspondence.vertexClasses).reduce((sum, refs) => sum + refs.length, 0);
  const multiClasses = Object.entries(correspondence.vertexClasses).filter(([, refs]) => refs.length > 1);
  const interiorSingletons = Object.values(correspondence.vertexClasses).every((refs) => {
    const isBoundary = (ref) => ref.i === 0 || ref.j === 0 || ref.i === R || ref.j === R;
    return refs.length === 1 ? true : refs.every(isBoundary);
  });
  check(`${surface}: correspondence covers every grid point exactly once (${gridPoints})`, mappedGrid === gridPoints && absorbed === gridPoints);
  check(`${surface}: every grid point lands on a real shape vertex`, Object.values(correspondence.gridVertexTo).every((id) => Boolean(shape.vertices[id])));
  check(`${surface}: identifications land ONLY on boundary grid points (interior stays singleton)`, interiorSingletons && multiClasses.length > 0);
  check(`${surface}: faceCells covers all R² faces`, Object.keys(correspondence.faceCells).length === R * R && F === R * R);
  check(`${surface}: gluing word recorded (${correspondence.word})`, typeof correspondence.word === 'string' && correspondence.word.length === 4);
  note(`classes=${Object.keys(correspondence.vertexClasses).length} (merged: ${multiClasses.length}) word=${correspondence.word}`);

  // the immersion respects the gluings — INDEPENDENT recheck via the exported map.
  const consistent = Object.entries(correspondence.vertexClasses).every(([vertexId, refs]) => {
    const p = shape.vertices[vertexId].position;
    return refs.every((ref) => {
      const q = immersionPosition(surface, ref.u, ref.v);
      return Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]) <= 1e-6 && q.every(Number.isFinite);
    });
  });
  check(`${surface}: immersion respects the gluing word (every class member -> one R³ point)`, consistent);
  console.log('');
}

// ---------------------------------------------------------------------------
// catalogue + rejection teeth
// ---------------------------------------------------------------------------
console.log('----- catalogue + rejection -----');
check('catalogue carries exactly torus/klein/rp2', SURFACE_CATALOGUE.map((e) => e.key).join(',') === 'torus,klein,rp2');
for (const entry of SURFACE_CATALOGUE) {
  const { shape } = immerseSurface(entry.spec);
  const R = entry.spec.resolution;
  check(`catalogue ${entry.key} (R=${R}) builds: F === R²`, shape.faces.length === R * R);
  note(`${entry.key} "${entry.label}": V=${Object.keys(shape.vertices).length} E=${shape.edges.length} F=${shape.faces.length}`);
}
for (const bad of [3, 2.5, 0]) {
  let threw = false;
  try {
    immerseSurface({ surface: 'torus', resolution: bad });
  } catch (error) {
    threw = String(error.message).includes('resolution');
  }
  check(`resolution ${bad} is rejected loudly`, threw);
}
let badSurface = false;
try {
  immerseSurface({ surface: 'sphere', resolution: 8 });
} catch (error) {
  badSurface = String(error.message).includes('unknown surface');
}
check('unknown surface key is rejected loudly', badSurface);

console.log(
  `\n--- R0 surface immersion (class topology via committed χ/w₁, manifold links, gluing-consistent immersion, correspondence): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
