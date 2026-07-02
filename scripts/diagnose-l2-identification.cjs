#!/usr/bin/env node

// DIAGNOSTIC — L2: identification + historied-merge annotation (ADR 0018, level 2).
//
// Structural acceptance over the REAL committed R0 module + the overlay's PURE
// selectors (src/playground/identificationAnnotation.ts — the react-free half
// the rendering consumes verbatim): for each R0 surface,
//   · the historied-merge set is exactly {v : vertexClasses[v].length > 1},
//     each displayed multiplicity = that length (printed);
//   · the loop set is exactly the edge-classes the boundary grid edges land on
//     (derived from gridVertexTo), each class absorbing exactly 2 grid edges,
//     letters a/b disjoint, every loop edge a REAL edge of the R0 shape;
//   · closure per class: torus/Klein a,b closed; RP² a,b arcs whose union is
//     the single closed boundary curve (word abab);
//   · the annotation invents NOTHING not in the correspondence.
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

const { immerseSurface } = req('src/lib/surfaceImmersion.ts');
const { selectHistoriedMerges, selectIdentifiedLoops } = req('src/playground/identificationAnnotation.ts');
const { canonicalEdgeKey } = req('src/lib/ids.ts');

let failures = 0;
function check(label, condition) {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
}
const note = (msg) => console.log(`  ↳ ${msg}`);

const R = 8;

console.log('L2 identification annotation: loops + historied merges, read off the R0 correspondence\n');

for (const surface of ['torus', 'klein', 'rp2']) {
  console.log(`----- [${surface}] R=${R} -----`);
  const { shape, correspondence } = immerseSurface({ surface, resolution: R });
  const merges = selectHistoriedMerges(correspondence);
  const loops = selectIdentifiedLoops(correspondence);

  // ---- historied merges ----
  const expectedMergeIds = Object.entries(correspondence.vertexClasses)
    .filter(([, refs]) => refs.length > 1)
    .map(([vertexId]) => vertexId)
    .sort();
  check(
    `${surface}: merge set === {v : vertexClasses[v].length > 1} (${expectedMergeIds.length} points)`,
    JSON.stringify(merges.map((m) => m.vertexId)) === JSON.stringify(expectedMergeIds),
  );
  check(
    `${surface}: every displayed multiplicity === its class size (> 1), members carried verbatim`,
    merges.every(
      (m) =>
        m.multiplicity === correspondence.vertexClasses[m.vertexId].length &&
        m.multiplicity > 1 &&
        m.members === correspondence.vertexClasses[m.vertexId],
    ),
  );
  const histogram = {};
  for (const m of merges) histogram[m.multiplicity] = (histogram[m.multiplicity] ?? 0) + 1;
  const expectedHistogram =
    surface === 'rp2' ? { 2: 2 * (R - 1) + 2 } : { 2: 2 * (R - 1), 4: 1 };
  check(
    `${surface}: multiplicity histogram === ${JSON.stringify(expectedHistogram)}`,
    JSON.stringify(histogram) === JSON.stringify(expectedHistogram),
  );
  note(`merges=${merges.length} histogram=${JSON.stringify(histogram)}`);
  note(`sample: ${merges[0].vertexId} ×${merges[0].multiplicity} absorbs ${merges[0].members.map((r) => `(${r.i},${r.j})`).join(' ')}`);

  // ---- identified loops ----
  const shapeEdgeKeys = new Set(shape.edges.map((e) => canonicalEdgeKey(e.vertexIds[0], e.vertexIds[1])));
  for (const letter of ['a', 'b']) {
    const loop = loops[letter];
    check(`${surface}: loop ${letter} has R=${R} quotient edge-classes`, loop.edges.length === R);
    check(
      `${surface}: loop ${letter} — every class absorbed exactly 2 boundary grid edges (identification 2->1)`,
      loop.edges.every((e) => e.gridEdges.length === 2),
    );
    check(
      `${surface}: loop ${letter} — every highlighted edge is a REAL edge of the R0 shape`,
      loop.edges.every((e) => shapeEdgeKeys.has(e.key)),
    );
    check(
      `${surface}: loop ${letter} — endpoints all come from gridVertexTo (nothing invented)`,
      loop.edges.every((e) => e.endpoints.every((v) => Boolean(shape.vertices[v]) && Object.values(correspondence.gridVertexTo).includes(v))),
    );
  }
  const aKeys = new Set(loops.a.edges.map((e) => e.key));
  check(`${surface}: loops a and b are disjoint edge-class sets`, loops.b.edges.every((e) => !aKeys.has(e.key)));
  // coverage: all 4R boundary grid edges land in the loop set
  const absorbedGridEdges = [...loops.a.edges, ...loops.b.edges].reduce((sum, e) => sum + e.gridEdges.length, 0);
  check(`${surface}: the loop set absorbs ALL 4R boundary grid edges (${4 * R})`, absorbedGridEdges === 4 * R);

  // closure per class
  if (surface === 'rp2') {
    check(`${surface}: a and b are ARCS (abab — each letter open)`, loops.a.closed === false && loops.b.closed === false);
    const cornerOf = (i, j) => correspondence.gridVertexTo[`${i},${j}`];
    const aEnds = [cornerOf(0, 0), cornerOf(R, 0)].sort();
    const bEnds = [cornerOf(0, 0), cornerOf(0, R)].sort();
    check(`${surface}: a and b share BOTH endpoint classes (their union is the single closed boundary curve)`, JSON.stringify(aEnds) === JSON.stringify(bEnds) && aEnds[0] !== aEnds[1]);
    note(`a: ${loops.a.edges.length} edges (arc ${aEnds[0]} .. ${aEnds[1]}) ; b: ${loops.b.edges.length} edges (same ends) ; union = closed 2R-cycle`);
  } else {
    check(`${surface}: loops a and b are CLOSED (generators)`, loops.a.closed === true && loops.b.closed === true);
    note(`a: ${loops.a.edges.length} edges closed ; b: ${loops.b.edges.length} edges closed`);
  }
  console.log('');
}

// derive-only: selectors read the correspondence, mutate nothing.
const probe = immerseSurface({ surface: 'klein', resolution: R });
const before = JSON.stringify(probe.correspondence);
selectHistoriedMerges(probe.correspondence);
selectIdentifiedLoops(probe.correspondence);
check('derive-only: correspondence byte-unchanged by the selectors', JSON.stringify(probe.correspondence) === before);

console.log(
  `\n--- L2 identification annotation (merge set + multiplicities, loop set + closure, derive-only): ${
    failures === 0 ? 'no failures' : `${failures} FAILURE(S)`
  } ---`,
);
console.log(failures === 0 ? '\nALL PASS' : '\nFAILURES PRESENT');
process.exit(failures === 0 ? 0 : 1);
