#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  }).outputText;

  module._compile(output, filename);
};

const repoRoot = path.resolve(__dirname, '..');
const { createSeedShape } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const {
  applyAmboDissection,
  canApplyAmboDissection,
} = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const {
  applyPyritohedralDiagonalization,
  canApplyPyritohedralDiagonalization,
} = require(path.join(repoRoot, 'src/lib/pyritohedralDiagonalization.ts'));
const { isCellActiveFrontier } = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const {
  buildDualCorrespondenceModel,
  buildDualUniverseRenderGeometry,
  buildDualUniverseViewModel,
  createDualCorrespondenceEdgeInspectionTarget,
  createDualCorrespondenceFaceInspectionTarget,
  createDualCorrespondenceVertexInspectionTarget,
  createDualEdgeInspectionTarget,
  createDualFaceInspectionTarget,
  createDualVertexInspectionTarget,
  resolveDualInspectionTarget,
} = require(path.join(repoRoot, 'src/lib/dualView.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));

const failures = [];

console.log('Dual correspondence candidate expansion diagnostics');
console.log('');

verifyCuboctahedronCandidatePath({
  pathLabel: 'tetrahedron -> Ambo -> octahedron -> Ambo -> cuboctahedron',
  build: buildCuboctahedronFromTetrahedronPath,
});
verifyCuboctahedronCandidatePath({
  pathLabel: 'cube -> Ambo -> cuboctahedron',
  build: buildCuboctahedronFromCubePath,
});
verifyExistingDemoCorrespondenceRegression();
verifySemanticDodecahedronRegression();

if (failures.length) {
  console.error('');
  console.error('Diagnostics failed:');

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exitCode = 1;
} else {
  console.log('');
  console.log('Diagnostics passed.');
}

function verifyCuboctahedronCandidatePath({ pathLabel, build }) {
  printDivider(pathLabel);

  const { shape, cell } = build();

  if (!cell) {
    return;
  }

  const beforeJson = JSON.stringify(shape);
  const sourceFaces = getCellFaces(shape, cell);
  const sourceEdges = getCellEdges(shape, cell);
  const sourceFaceSizeHistogram = histogram(sourceFaces.map((face) => face.vertexIds.length));
  const incidentFacesByEdgeKey = getIncidentFacesByEdgeKey(sourceFaces);

  expect(cell.topology === 'cuboctahedron', `${pathLabel}: expected cuboctahedron source topology`);
  expect(cell.vertexIds.length === 12, `${pathLabel}: expected 12 source vertices`);
  expect(sourceEdges.length === 24, `${pathLabel}: expected 24 source edges`);
  expect(sourceFaces.length === 14, `${pathLabel}: expected 14 source faces`);
  expect(sourceFaceSizeHistogram.get(3) === 8, `${pathLabel}: expected 8 triangular source faces`);
  expect(sourceFaceSizeHistogram.get(4) === 6, `${pathLabel}: expected 6 square source faces`);

  for (const edge of sourceEdges) {
    const incidentFaces = incidentFacesByEdgeKey.get(canonicalEdgeKey(...edge.vertexIds)) ?? [];
    expect(
      incidentFaces.length === 2,
      `${pathLabel}: source edge ${edge.id} should have exactly two incident source faces`,
    );
  }

  const model = buildDualCorrespondenceModel(shape, cell, 'rhombic-dodecahedron');

  expect(Boolean(model), `${pathLabel}: direct cuboctahedron candidate builder returned null`);

  if (!model) {
    return;
  }

  expect(JSON.stringify(shape) === beforeJson, `${pathLabel}: direct candidate builder mutated source shape`);
  verifyCandidateModelCounts(pathLabel, shape, cell, sourceFaces, sourceEdges, model);
  verifyCandidateFaceEdgeCoherence(pathLabel, model);
  verifyCandidateSourceEdgeRule(pathLabel, model, sourceEdges, incidentFacesByEdgeKey);
  verifyPolicyEnabled(pathLabel, shape, cell, model);

  const dualFaceSizeHistogram = histogram(model.dualFaces.map((face) => face.vertexIds.length));

  console.log(`source path: ${pathLabel}`);
  console.log(
    `source counts: ${cell.vertexIds.length}V ${sourceEdges.length}E ${sourceFaces.length}F; ` +
      `face sizes ${formatHistogram(sourceFaceSizeHistogram)}`,
  );
  console.log(
    `candidate rhombic-dodecahedron counts: ${Object.keys(model.dualVertices).length}V ` +
      `${model.dualEdges.length}E ${model.dualFaces.length}F`,
  );
  console.log(`dual face-size histogram: ${formatHistogram(dualFaceSizeHistogram)}`);
  console.log('correspondence maps: complete inverse maps');
  console.log('face/edge coherence: boundary edge set equals model dual edges');
  console.log('source edge rule: every source edge maps to its two incident source-face dual vertices');
  console.log('POLICY_ENABLED: cuboctahedron -> rhombic-dodecahedron is enabled through DualCorrespondenceModel');
}

function verifyCandidateModelCounts(pathLabel, shape, cell, sourceFaces, sourceEdges, model) {
  const sourceFaceIds = sourceFaces.map((face) => face.id).sort();
  const sourceVertexIds = [...cell.vertexIds].sort();
  const sourceEdgeIds = sourceEdges.map((edge) => edge.id).sort();
  const dualVertexIds = Object.keys(model.dualVertices).sort();
  const dualFaceIds = model.dualFaces.map((face) => face.id).sort();
  const dualEdgeIds = model.dualEdges.map((edge) => edge.id).sort();

  expect(model.sourceCellId === cell.id, `${pathLabel}: model source cell mismatch`);
  expect(model.dualTopologyLabel === 'rhombic-dodecahedron', `${pathLabel}: model topology label mismatch`);
  expect(dualVertexIds.length === 14, `${pathLabel}: expected 14 candidate dual vertices`);
  expect(dualEdgeIds.length === 24, `${pathLabel}: expected 24 candidate dual edges`);
  expect(dualFaceIds.length === 12, `${pathLabel}: expected 12 candidate dual faces`);
  expect(
    model.dualFaces.every((face) => face.vertexIds.length === 4),
    `${pathLabel}: every candidate dual face should be quadrilateral`,
  );
  expectNoDuplicates(`${pathLabel}: candidate dual vertex ids`, dualVertexIds);
  expectNoDuplicates(`${pathLabel}: candidate dual face ids`, dualFaceIds);
  expectNoDuplicates(`${pathLabel}: candidate dual edge ids`, dualEdgeIds);
  verifyInverseMap(
    pathLabel,
    'candidate sourceFaceToDualVertex',
    model.sourceFaceToDualVertex,
    model.dualVertexToSourceFace,
    sourceFaceIds,
    dualVertexIds,
  );
  verifyInverseMap(
    pathLabel,
    'candidate sourceVertexToDualFace',
    model.sourceVertexToDualFace,
    model.dualFaceToSourceVertex,
    sourceVertexIds,
    dualFaceIds,
  );
  verifyInverseMap(
    pathLabel,
    'candidate sourceEdgeToDualEdge',
    model.sourceEdgeToDualEdge,
    model.dualEdgeToSourceEdge,
    sourceEdgeIds,
    dualEdgeIds,
  );
  expect(
    Object.values(model.dualVertices).every((vertex) => Array.isArray(vertex.position) && vertex.position.length === 3),
    `${pathLabel}: every candidate dual vertex should have a Vec3 position`,
  );
  expect(
    model.dualFaces.every((face) => face.vertexIds.every((vertexId) => Boolean(model.dualVertices[vertexId]))),
    `${pathLabel}: every candidate dual face vertex should exist in dualVertices`,
  );
  expect(
    model.dualEdges.every((edge) => edge.vertexIds.every((vertexId) => Boolean(model.dualVertices[vertexId]))),
    `${pathLabel}: every candidate dual edge vertex should exist in dualVertices`,
  );
}

function verifyCandidateFaceEdgeCoherence(pathLabel, model) {
  const boundaryEdgeCounts = getBoundaryEdgeCounts(model.dualFaces);
  const boundaryEdgeKeys = Array.from(boundaryEdgeCounts.keys()).sort();
  const modelEdgeKeys = model.dualEdges.map((edge) => canonicalEdgeKey(...edge.vertexIds)).sort();

  expectSameSet(`${pathLabel}: candidate dual face boundary edge keys`, boundaryEdgeKeys, modelEdgeKeys);
  expectNoDuplicates(`${pathLabel}: candidate model dual edge vertex-pair keys`, modelEdgeKeys);

  for (const edge of model.dualEdges) {
    const key = canonicalEdgeKey(...edge.vertexIds);

    expect(boundaryEdgeCounts.has(key), `${pathLabel}: model dual edge ${edge.id} missing from face boundary set`);
  }

  for (const [key, count] of boundaryEdgeCounts) {
    expect(count === 2, `${pathLabel}: candidate dual boundary edge ${key} occurs ${count} times`);
  }
}

function verifyCandidateSourceEdgeRule(pathLabel, model, sourceEdges, incidentFacesByEdgeKey) {
  const dualEdgesById = new Map(model.dualEdges.map((edge) => [edge.id, edge]));

  for (const sourceEdge of sourceEdges) {
    const sourceEdgeKey = canonicalEdgeKey(...sourceEdge.vertexIds);
    const incidentFaces = incidentFacesByEdgeKey.get(sourceEdgeKey) ?? [];
    const expectedDualVertexIds = incidentFaces
      .map((face) => model.sourceFaceToDualVertex[face.id])
      .filter(Boolean);
    const dualEdgeId = model.sourceEdgeToDualEdge[sourceEdge.id];
    const dualEdge = dualEdgesById.get(dualEdgeId);

    expect(Boolean(dualEdgeId), `${pathLabel}: missing dual edge id for source edge ${sourceEdge.id}`);
    expect(Boolean(dualEdge), `${pathLabel}: missing dual edge ${dualEdgeId} for source edge ${sourceEdge.id}`);
    expect(
      expectedDualVertexIds.length === 2,
      `${pathLabel}: source edge ${sourceEdge.id} should map through two source faces`,
    );

    if (dualEdge && expectedDualVertexIds.length === 2) {
      expect(
        canonicalEdgeKey(...dualEdge.vertexIds) === canonicalEdgeKey(expectedDualVertexIds[0], expectedDualVertexIds[1]),
        `${pathLabel}: dual edge ${dualEdge.id} does not connect the two incident source-face dual vertices`,
      );
    }
  }
}

function verifyPolicyEnabled(pathLabel, shape, cell, model) {
  const viewModel = buildDualUniverseViewModel(shape, cell);
  const renderGeometry = buildDualUniverseRenderGeometry(shape, cell);
  const candidateDualVertex = Object.values(model.dualVertices)[0];
  const candidateDualFace = model.dualFaces[0];
  const candidateDualEdge = model.dualEdges[0];
  const vertexTarget = candidateDualVertex
    ? createDualCorrespondenceVertexInspectionTarget(model, candidateDualVertex.id)
    : null;
  const faceTarget = candidateDualFace
    ? createDualCorrespondenceFaceInspectionTarget(model, candidateDualFace.id)
    : null;
  const edgeTarget = candidateDualEdge
    ? createDualCorrespondenceEdgeInspectionTarget(model, candidateDualEdge.id)
    : null;
  const resolvedVertex = vertexTarget ? resolveDualInspectionTarget(shape, vertexTarget) : null;
  const resolvedFace = faceTarget ? resolveDualInspectionTarget(shape, faceTarget) : null;
  const resolvedEdge = edgeTarget ? resolveDualInspectionTarget(shape, edgeTarget) : null;

  expect(viewModel.kind === 'legacy-proxy', `${pathLabel}: runtime view model should enable cuboctahedron`);
  expect(renderGeometry.kind === 'legacy-proxy', `${pathLabel}: runtime render geometry should enable cuboctahedron`);

  if (viewModel.kind === 'legacy-proxy') {
    expect(
      viewModel.proxy.topology === 'rhombic-dodecahedron',
      `${pathLabel}: runtime view model should use rhombic-dodecahedron topology`,
    );
    expect(
      viewModel.proxy.correspondenceModel.dualModelId === model.dualModelId,
      `${pathLabel}: runtime model id should match direct candidate model id`,
    );
  }

  if (renderGeometry.kind === 'legacy-proxy') {
    expect(renderGeometry.topology === 'rhombic-dodecahedron', `${pathLabel}: wrong runtime render topology`);
    expect(renderGeometry.vertices.length === 14, `${pathLabel}: wrong runtime render vertex count`);
    expect(renderGeometry.edges.length === 24, `${pathLabel}: wrong runtime render edge count`);
    expect(renderGeometry.faces.length === 12, `${pathLabel}: wrong runtime render face count`);
  }

  expect(Boolean(vertexTarget), `${pathLabel}: candidate vertex target should be constructible`);
  expect(Boolean(faceTarget), `${pathLabel}: candidate face target should be constructible`);
  expect(Boolean(edgeTarget), `${pathLabel}: candidate edge target should be constructible`);
  expect(
    resolvedVertex?.kind === 'vertex' && resolvedVertex.modelKind === 'correspondence',
    `${pathLabel}: runtime policy should resolve candidate dual vertex inspection`,
  );
  expect(
    resolvedFace?.kind === 'face' && resolvedFace.modelKind === 'correspondence',
    `${pathLabel}: runtime policy should resolve candidate dual face inspection`,
  );
  expect(
    resolvedEdge?.kind === 'edge' && resolvedEdge.modelKind === 'correspondence',
    `${pathLabel}: runtime policy should resolve candidate dual edge inspection`,
  );
}

function verifyExistingDemoCorrespondenceRegression() {
  printDivider('existing demo correspondence regression');

  for (const fixture of [
    { seedKey: 'tetrahedron', expectedTopology: 'tetrahedron', counts: { vertices: 4, edges: 6, faces: 4 } },
    { seedKey: 'octahedron', expectedTopology: 'cube', counts: { vertices: 8, edges: 12, faces: 6 } },
    { seedKey: 'cube', expectedTopology: 'octahedron', counts: { vertices: 6, edges: 12, faces: 8 } },
  ]) {
    const shape = createSeedShape(fixture.seedKey);
    const cell = shape.cells[0];
    const renderGeometry = buildDualUniverseRenderGeometry(shape, cell);

    expect(renderGeometry.kind === 'legacy-proxy', `${fixture.seedKey}: expected legacy-proxy render geometry`);

    if (renderGeometry.kind !== 'legacy-proxy') {
      continue;
    }

    const model = renderGeometry.viewModel.proxy.correspondenceModel;

    expect(renderGeometry.topology === fixture.expectedTopology, `${fixture.seedKey}: runtime topology changed`);
    expect(renderGeometry.vertices.length === fixture.counts.vertices, `${fixture.seedKey}: runtime vertex count changed`);
    expect(renderGeometry.edges.length === fixture.counts.edges, `${fixture.seedKey}: runtime edge count changed`);
    expect(renderGeometry.faces.length === fixture.counts.faces, `${fixture.seedKey}: runtime face count changed`);
    verifyCorrespondenceTargetResolution(fixture.seedKey, shape, model);

    console.log(
      `PASS: ${fixture.seedKey} -> ${fixture.expectedTopology} ` +
        `${fixture.counts.vertices}V ${fixture.counts.edges}E ${fixture.counts.faces}F remains inspectable`,
    );
  }
}

function verifySemanticDodecahedronRegression() {
  printDivider('semantic dodecahedron regression');

  for (const scenario of [
    {
      name: 'tetrahedron path',
      build: () => {
        let shape = createSeedShape('tetrahedron');
        shape = applyAmbo(shape, selectActiveCell({ kind: 'seed' })(shape), 'tetrahedron seed');
        shape = applyAmbo(shape, selectActiveCell({ kind: 'core', topology: 'octahedron' })(shape), 'octahedron core');
        const cuboctahedron = requireActiveCell(shape, { kind: 'core', topology: 'cuboctahedron' });

        if (cuboctahedron && canApplyPyritohedralDiagonalization(shape, cuboctahedron.id)) {
          shape = applyPyritohedralDiagonalization(shape, cuboctahedron.id);
        } else {
          recordFailure('tetrahedron path: cuboctahedron was not pyritohedral-ready');
        }

        return {
          shape,
          cell: requireActiveCell(shape, { kind: 'core', topology: 'pyritohedral-icosahedron' }),
        };
      },
    },
    {
      name: 'cube path',
      build: () => {
        let shape = createSeedShape('cube');
        shape = applyAmbo(shape, selectActiveCell({ kind: 'seed' })(shape), 'cube seed');
        const cuboctahedron = requireActiveCell(shape, { kind: 'core', topology: 'cuboctahedron' });

        if (cuboctahedron && canApplyPyritohedralDiagonalization(shape, cuboctahedron.id)) {
          shape = applyPyritohedralDiagonalization(shape, cuboctahedron.id);
        } else {
          recordFailure('cube path: cuboctahedron was not pyritohedral-ready');
        }

        return {
          shape,
          cell: requireActiveCell(shape, { kind: 'core', topology: 'pyritohedral-icosahedron' }),
        };
      },
    },
  ]) {
    const { shape, cell } = scenario.build();

    if (!cell) {
      continue;
    }

    const renderGeometry = buildDualUniverseRenderGeometry(shape, cell);

    expect(renderGeometry.kind === 'semantic-model', `${scenario.name}: expected semantic-model render geometry`);

    if (renderGeometry.kind !== 'semantic-model') {
      continue;
    }

    const semanticModel = renderGeometry.viewModel.semanticModel;

    expect(renderGeometry.topology === 'dodecahedron', `${scenario.name}: expected dodecahedron topology`);
    expect(Object.keys(semanticModel.dualVertices).length === 20, `${scenario.name}: expected 20 semantic vertices`);
    expect(semanticModel.dualEdges.length === 30, `${scenario.name}: expected 30 semantic edges`);
    expect(semanticModel.dualFaces.length === 12, `${scenario.name}: expected 12 semantic faces`);
    verifySemanticTargetResolution(shape, semanticModel, 'vertex', Object.keys(semanticModel.dualVertices)[0], scenario.name);
    verifySemanticTargetResolution(shape, semanticModel, 'face', semanticModel.dualFaces[0]?.id, scenario.name);
    verifySemanticTargetResolution(shape, semanticModel, 'edge', semanticModel.dualEdges[0]?.id, scenario.name);

    console.log(`PASS: ${scenario.name} pyritohedral-icosahedron -> semantic dodecahedron remains inspectable`);
  }
}

function verifyCorrespondenceTargetResolution(label, shape, model) {
  const dualVertex = Object.values(model.dualVertices)[0];
  const dualFace = model.dualFaces[0];
  const dualEdge = model.dualEdges[0];
  const vertexTarget = dualVertex
    ? createDualCorrespondenceVertexInspectionTarget(model, dualVertex.id)
    : null;
  const faceTarget = dualFace
    ? createDualCorrespondenceFaceInspectionTarget(model, dualFace.id)
    : null;
  const edgeTarget = dualEdge
    ? createDualCorrespondenceEdgeInspectionTarget(model, dualEdge.id)
    : null;
  const resolvedVertex = vertexTarget ? resolveDualInspectionTarget(shape, vertexTarget) : null;
  const resolvedFace = faceTarget ? resolveDualInspectionTarget(shape, faceTarget) : null;
  const resolvedEdge = edgeTarget ? resolveDualInspectionTarget(shape, edgeTarget) : null;

  expect(
    resolvedVertex?.kind === 'vertex' && resolvedVertex.modelKind === 'correspondence',
    `${label}: expected correspondence dual vertex inspection to resolve`,
  );
  expect(
    resolvedFace?.kind === 'face' && resolvedFace.modelKind === 'correspondence',
    `${label}: expected correspondence dual face inspection to resolve`,
  );
  expect(
    resolvedEdge?.kind === 'edge' && resolvedEdge.modelKind === 'correspondence',
    `${label}: expected correspondence dual edge inspection to resolve`,
  );
}

function verifySemanticTargetResolution(shape, semanticModel, kind, id, label) {
  let target = null;

  if (!id) {
    recordFailure(`${label}: missing semantic ${kind} id`);
    return;
  }

  if (kind === 'vertex') {
    target = createDualVertexInspectionTarget(semanticModel, id);
  } else if (kind === 'face') {
    target = createDualFaceInspectionTarget(semanticModel, id);
  } else {
    target = createDualEdgeInspectionTarget(semanticModel, id);
  }

  const resolved = target ? resolveDualInspectionTarget(shape, target) : null;

  expect(Boolean(target), `${label}: expected semantic ${kind} inspection target`);
  expect(
    resolved?.kind === kind && resolved.modelKind === 'semantic',
    `${label}: expected semantic ${kind} inspection target to resolve`,
  );
}

function buildCuboctahedronFromTetrahedronPath() {
  let shape = createSeedShape('tetrahedron');

  shape = applyAmbo(shape, selectActiveCell({ kind: 'seed' })(shape), 'tetrahedron seed');
  shape = applyAmbo(shape, selectActiveCell({ kind: 'core', topology: 'octahedron' })(shape), 'octahedron core');

  return {
    shape,
    cell: requireActiveCell(shape, { kind: 'core', topology: 'cuboctahedron' }),
  };
}

function buildCuboctahedronFromCubePath() {
  let shape = createSeedShape('cube');

  shape = applyAmbo(shape, selectActiveCell({ kind: 'seed' })(shape), 'cube seed');

  return {
    shape,
    cell: requireActiveCell(shape, { kind: 'core', topology: 'cuboctahedron' }),
  };
}

function applyAmbo(shape, targetCell, label) {
  if (!targetCell) {
    recordFailure(`Ambo path could not find target for ${label}`);
    return shape;
  }

  if (!isCellActiveFrontier(shape, targetCell.id) || !canApplyAmboDissection(shape, targetCell.id)) {
    recordFailure(`${describeCell(targetCell)} was not an active valid Ambo source for ${label}`);
    return shape;
  }

  return applyAmboDissection(shape, targetCell.id);
}

function requireActiveCell(shape, { kind, topology }) {
  const cell = selectActiveCell({ kind, topology })(shape);

  expect(Boolean(cell), `missing active ${kind ?? 'cell'}${topology ? `/${topology}` : ''}`);

  return cell;
}

function selectActiveCell({ kind, topology }) {
  return (shape) =>
    sortedCells(shape.cells).find(
      (cell) =>
        isCellActiveFrontier(shape, cell.id) &&
        (!kind || cell.kind === kind) &&
        (!topology || getCellTopologyLabel(cell) === topology),
    ) ?? null;
}

function getCellFaces(shape, cell) {
  const facesById = new Map(shape.faces.map((face) => [face.id, face]));

  return cell.faceIds.map((faceId) => facesById.get(faceId)).filter(Boolean);
}

function getCellEdges(shape, cell) {
  const edgesByKey = new Map(shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const edges = new Map();

  for (const face of getCellFaces(shape, cell)) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);
      const edge = edgesByKey.get(key);

      if (edge) {
        edges.set(key, edge);
      }
    }
  }

  return Array.from(edges.values()).sort((a, b) => a.id.localeCompare(b.id));
}

function getIncidentFacesByEdgeKey(faces) {
  const incidentFacesByEdgeKey = new Map();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      incidentFacesByEdgeKey.set(key, [...(incidentFacesByEdgeKey.get(key) ?? []), face]);
    }
  }

  return incidentFacesByEdgeKey;
}

function getBoundaryEdgeCounts(faces) {
  const edgeCounts = new Map();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = canonicalEdgeKey(a, b);

      edgeCounts.set(key, (edgeCounts.get(key) ?? 0) + 1);
    }
  }

  return edgeCounts;
}

function verifyInverseMap(label, mapLabel, forward, reverse, expectedSources, expectedTargets) {
  expectSameSet(`${label}: ${mapLabel} source keys`, Object.keys(forward), expectedSources);
  expectSameSet(`${label}: ${mapLabel} reverse values`, Object.values(reverse), expectedSources);
  expectSameSet(`${label}: ${mapLabel} target values`, Object.values(forward), expectedTargets);
  expectSameSet(`${label}: ${mapLabel} target keys`, Object.keys(reverse), expectedTargets);

  for (const [sourceId, targetId] of Object.entries(forward)) {
    expect(reverse[targetId] === sourceId, `${label}: ${mapLabel} inverse mismatch at ${sourceId}`);
  }

  for (const [targetId, sourceId] of Object.entries(reverse)) {
    expect(forward[sourceId] === targetId, `${label}: ${mapLabel} forward mismatch at ${targetId}`);
  }
}

function histogram(values) {
  const counts = new Map();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

function formatHistogram(counts) {
  return Array.from(counts.entries())
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([size, count]) => `${size}:${count}`)
    .join(', ');
}

function sortedCells(cells) {
  return [...cells].sort(
    (a, b) =>
      a.generationDepth - b.generationDepth ||
      getCellTopologyLabel(a).localeCompare(getCellTopologyLabel(b)) ||
      a.kind.localeCompare(b.kind) ||
      a.id.localeCompare(b.id),
  );
}

function getCellTopologyLabel(cell) {
  return cell.topology ?? cell.kind ?? 'unknown';
}

function describeCell(cell) {
  return `${cell.kind}/${getCellTopologyLabel(cell)}@g${cell.generationDepth}#${shortenId(cell.id)}`;
}

function printDivider(label) {
  console.log('');
  console.log(`=== ${label} ===`);
}

function expectSameSet(label, actual, expected) {
  const actualValues = [...actual].sort();
  const expectedValues = [...expected].sort();

  expect(
    actualValues.join(',') === expectedValues.join(','),
    `${label} mismatch expected=${expectedValues.join(',')} actual=${actualValues.join(',')}`,
  );
}

function expectNoDuplicates(label, values) {
  expect(new Set(values).size === values.length, `${label} contains duplicate ids`);
}

function expect(condition, message) {
  if (!condition) {
    recordFailure(message);
  }
}

function recordFailure(message) {
  failures.push(message);
}

function shortenId(id) {
  return id.length > 28 ? `${id.slice(0, 13)}...${id.slice(-8)}` : id;
}
