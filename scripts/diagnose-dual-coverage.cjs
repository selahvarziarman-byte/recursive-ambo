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
const {
  applyDualization,
  canApplyDualization,
} = require(path.join(repoRoot, 'src/lib/dualization.ts'));
const { isCellActiveFrontier } = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const {
  buildDualUniverseRenderGeometry,
  buildDualUniverseViewModel,
  createDualEdgeInspectionTarget,
  createDualFaceInspectionTarget,
  createDualVertexInspectionTarget,
  isDualViewSupportedCell,
  resolveDualInspectionTarget,
} = require(path.join(repoRoot, 'src/lib/dualView.ts'));
const { canonicalEdgeKey } = require(path.join(repoRoot, 'src/lib/ids.ts'));
const { registeredOperations } = require(path.join(repoRoot, 'src/operations/registry.ts'));

const failures = [];

console.log('Dual coverage policy diagnostics');
console.log('');

verifyOperationRegistryBoundary();
verifyLegacyProxyCoverage();
verifyUnsupportedCoverage();
verifyPyritohedralSemanticPolicy();
verifyMaterializedDodecahedronSourcePolicy();

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

function verifyOperationRegistryBoundary() {
  printDivider('operation registry boundary');

  const operationIds = registeredOperations.map((operation) => operation.id);
  const expectedOperationIds = ['ambo-dissection', 'pyritohedral-diagonalization'];

  expectSameSet('registered operation ids', operationIds, expectedOperationIds);
  expect(
    !operationIds.includes('dualization'),
    'Materialized Dualization must not be registered as a normal UI operation',
  );
  logPolicy(
    'registered operations',
    'EXPLICITLY_FORBIDDEN',
    'dualization is absent; only Ambo Dissection and Pyritohedral Diagonalization are registered',
  );
}

function verifyLegacyProxyCoverage() {
  printDivider('legacy proxy coverage');

  for (const fixture of [
    {
      seedKey: 'tetrahedron',
      expectedTopology: 'tetrahedron',
      expectedCounts: { vertices: 4, faces: 4, edges: 6 },
    },
    {
      seedKey: 'octahedron',
      expectedTopology: 'cube',
      expectedCounts: { vertices: 8, faces: 6, edges: 12 },
    },
    {
      seedKey: 'cube',
      expectedTopology: 'octahedron',
      expectedCounts: { vertices: 6, faces: 8, edges: 12 },
    },
  ]) {
    const shape = createSeedShape(fixture.seedKey);
    const cell = shape.cells[0];
    const viewModel = buildDualUniverseViewModel(shape, cell);
    const renderGeometry = buildDualUniverseRenderGeometry(shape, cell);

    expect(viewModel.kind === 'legacy-proxy', `${fixture.seedKey}: expected legacy proxy view model`);
    expect(renderGeometry.kind === 'legacy-proxy', `${fixture.seedKey}: expected legacy proxy render geometry`);
    expect(isDualViewSupportedCell(shape, cell), `${fixture.seedKey}: expected Dual View supported cell`);

    if (viewModel.kind === 'legacy-proxy') {
      expect(
        viewModel.proxy.topology === fixture.expectedTopology,
        `${fixture.seedKey}: expected counterpart ${fixture.expectedTopology}`,
      );
      verifyLegacyCorrespondenceModel(fixture.seedKey, shape, cell, viewModel.proxy.correspondenceModel, fixture);
    }

    if (renderGeometry.kind === 'legacy-proxy') {
      expect(
        renderGeometry.topology === fixture.expectedTopology,
        `${fixture.seedKey}: expected render topology ${fixture.expectedTopology}`,
      );
      expect(
        renderGeometry.vertices.length === fixture.expectedCounts.vertices,
        `${fixture.seedKey}: wrong legacy render vertex count`,
      );
      expect(
        renderGeometry.faces.length === fixture.expectedCounts.faces,
        `${fixture.seedKey}: wrong legacy render face count`,
      );
      expect(
        renderGeometry.edges.length === fixture.expectedCounts.edges,
        `${fixture.seedKey}: wrong legacy render edge count`,
      );
      expect(
        renderGeometry.edges.every((edge) => Boolean(edge.id) && Boolean(edge.sourceEdgeId)),
        `${fixture.seedKey}: legacy render edges must come from correspondence model source edges`,
      );
      verifyRenderEdgesBackedByModel(
        fixture.seedKey,
        renderGeometry.edges,
        renderGeometry.viewModel.proxy.correspondenceModel,
      );
      expect(
        resolveDualInspectionTarget(shape, fakeDualFaceTarget(cell, renderGeometry)) === null,
        `${fixture.seedKey}: legacy proxy unexpectedly resolved semantic inspection target`,
      );
    }

    logPolicy(
      fixture.seedKey,
      'LEGACY_PROXY_OK',
      `counterpart ${fixture.expectedTopology}; semantic inspection disabled`,
    );
  }
}

function verifyLegacyCorrespondenceModel(seedKey, shape, cell, model, fixture) {
  const sourceFaces = getCellFaces(shape, cell);
  const sourceEdges = getCellEdges(shape, cell);
  const sourceFaceIds = sourceFaces.map((face) => face.id).sort();
  const sourceVertexIds = [...cell.vertexIds].sort();
  const sourceEdgeIds = sourceEdges.map((edge) => edge.id).sort();
  const dualVertexIds = Object.keys(model.dualVertices).sort();
  const dualFaceIds = model.dualFaces.map((face) => face.id).sort();
  const dualEdgeIds = model.dualEdges.map((edge) => edge.id).sort();

  expect(model.sourceCellId === cell.id, `${seedKey}: correspondence model source cell mismatch`);
  expect(model.dualTopologyLabel === fixture.expectedTopology, `${seedKey}: correspondence model topology mismatch`);
  expect(dualVertexIds.length === fixture.expectedCounts.vertices, `${seedKey}: wrong correspondence vertex count`);
  expect(dualFaceIds.length === fixture.expectedCounts.faces, `${seedKey}: wrong correspondence face count`);
  expect(dualEdgeIds.length === fixture.expectedCounts.edges, `${seedKey}: wrong correspondence edge count`);
  expectNoDuplicates(`${seedKey}: dual vertex ids`, dualVertexIds);
  expectNoDuplicates(`${seedKey}: dual face ids`, dualFaceIds);
  expectNoDuplicates(`${seedKey}: dual edge ids`, dualEdgeIds);
  expect(
    model.dualEdges.every((edge) => Boolean(edge.id) && Boolean(edge.sourceEdgeId)),
    `${seedKey}: each correspondence dual edge must have sourceEdgeId`,
  );
  verifyModelFaceEdgeCoherence(seedKey, model);
  verifyInverseMap(
    seedKey,
    'legacy sourceFaceToDualVertex',
    model.sourceFaceToDualVertex,
    model.dualVertexToSourceFace,
    sourceFaceIds,
    dualVertexIds,
  );
  verifyInverseMap(
    seedKey,
    'legacy sourceVertexToDualFace',
    model.sourceVertexToDualFace,
    model.dualFaceToSourceVertex,
    sourceVertexIds,
    dualFaceIds,
  );
  verifyInverseMap(
    seedKey,
    'legacy sourceEdgeToDualEdge',
    model.sourceEdgeToDualEdge,
    model.dualEdgeToSourceEdge,
    sourceEdgeIds,
    dualEdgeIds,
  );
}

function verifyModelFaceEdgeCoherence(label, model) {
  const boundaryEdgeCounts = getBoundaryEdgeCounts(model.dualFaces);
  const boundaryEdgeKeys = Array.from(boundaryEdgeCounts.keys()).sort();
  const modelEdgeKeys = model.dualEdges.map((edge) => canonicalEdgeKey(...edge.vertexIds)).sort();

  expectSameSet(`${label}: dual face boundary edge keys`, boundaryEdgeKeys, modelEdgeKeys);
  expectNoDuplicates(`${label}: model dual edge vertex-pair keys`, modelEdgeKeys);

  for (const edge of model.dualEdges) {
    const key = canonicalEdgeKey(...edge.vertexIds);

    expect(boundaryEdgeCounts.has(key), `${label}: model dual edge ${edge.id} missing from face boundary set`);
  }

  for (const [key, count] of boundaryEdgeCounts) {
    expect(count === 2, `${label}: dual face boundary edge ${key} occurs ${count} times`);
  }
}

function verifyRenderEdgesBackedByModel(label, renderEdges, model) {
  const modelEdgesByKey = new Map(
    model.dualEdges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]),
  );
  const renderEdgeKeys = renderEdges.map((edge) => canonicalEdgeKey(...edge.vertexIds)).sort();

  expectSameSet(`${label}: render edge keys`, renderEdgeKeys, Array.from(modelEdgesByKey.keys()).sort());
  expectNoDuplicates(`${label}: render edge vertex-pair keys`, renderEdgeKeys);

  for (const renderEdge of renderEdges) {
    const key = canonicalEdgeKey(...renderEdge.vertexIds);
    const modelEdge = modelEdgesByKey.get(key);

    expect(Boolean(modelEdge), `${label}: render edge ${key} is missing from correspondence model`);
    expect(
      !modelEdge || renderEdge.id === modelEdge.id,
      `${label}: render edge ${key} id does not match correspondence model`,
    );
    expect(
      !modelEdge || renderEdge.sourceEdgeId === modelEdge.sourceEdgeId,
      `${label}: render edge ${key} sourceEdgeId does not match correspondence model`,
    );
  }
}

function verifyUnsupportedCoverage() {
  printDivider('unsupported intermediate/frontier coverage');

  let cubePath = createSeedShape('cube');
  cubePath = applyAmbo(cubePath, selectActiveCell({ kind: 'seed' })(cubePath), 'cube seed');
  const cuboctahedron = requireActiveCell(cubePath, {
    kind: 'core',
    topology: 'cuboctahedron',
  });

  verifyUnsupportedCell(cubePath, cuboctahedron, 'cuboctahedron', 'UNSUPPORTED_PENDING_POLICY');

  cubePath = applyAmbo(cubePath, cuboctahedron, 'cuboctahedron core');
  const rhombicuboctahedron = requireActiveCell(cubePath, {
    kind: 'core',
    topology: 'rhombicuboctahedron',
  });

  verifyUnsupportedCell(cubePath, rhombicuboctahedron, 'rhombicuboctahedron', 'EXPLICITLY_FORBIDDEN');

  let rectifiedPath = createSeedShape('octahedron');
  rectifiedPath = applyAmbo(
    rectifiedPath,
    selectActiveCell({ kind: 'seed' })(rectifiedPath),
    'octahedron seed',
  );

  const squarePyramid = requireActiveCell(rectifiedPath, {
    kind: 'residue',
    topology: 'square-pyramid',
  });

  verifyUnsupportedCell(rectifiedPath, squarePyramid, 'square-pyramid', 'UNSUPPORTED_PENDING_POLICY');

  rectifiedPath = applyAmbo(rectifiedPath, squarePyramid, 'square-pyramid residue');

  const rectifiedSquarePyramid = requireActiveCell(rectifiedPath, {
    kind: 'core',
    topology: 'rectified-square-pyramid',
  });

  verifyUnsupportedCell(
    rectifiedPath,
    rectifiedSquarePyramid,
    'rectified-square-pyramid',
    'UNSUPPORTED_PENDING_POLICY',
  );

  rectifiedPath = applyAmbo(
    rectifiedPath,
    rectifiedSquarePyramid,
    'rectified-square-pyramid core',
  );

  const rectifiedAmboCore = requireActiveCell(rectifiedPath, {
    kind: 'core',
    topology: 'rectified-square-pyramid-ambo-core',
  });

  verifyUnsupportedCell(
    rectifiedPath,
    rectifiedAmboCore,
    'rectified-square-pyramid-ambo-core',
    'UNSUPPORTED_PENDING_POLICY',
  );

  rectifiedPath = applyAmbo(
    rectifiedPath,
    rectifiedAmboCore,
    'rectified-square-pyramid-ambo-core core',
  );

  const rectifiedAmboCoreAmboCore = requireActiveCell(rectifiedPath, {
    kind: 'core',
    topology: 'rectified-square-pyramid-ambo-core-ambo-core',
  });

  verifyUnsupportedCell(
    rectifiedPath,
    rectifiedAmboCoreAmboCore,
    'rectified-square-pyramid-ambo-core-ambo-core',
    'UNSUPPORTED_PENDING_POLICY',
  );
}

function verifyPyritohedralSemanticPolicy() {
  printDivider('pyritohedral semantic Dual Universe policy');

  for (const scenario of [
    {
      name: 'tetrahedron path',
      seedKey: 'tetrahedron',
      amboSteps: [
        step('tetrahedron seed', selectActiveCell({ kind: 'seed' })),
        step('octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
      ],
    },
    {
      name: 'cube path',
      seedKey: 'cube',
      amboSteps: [step('cube seed', selectActiveCell({ kind: 'seed' }))],
    },
  ]) {
    const { shape, sourceCell } = runPathToPyritohedralIcosahedron(scenario);
    const beforeJson = JSON.stringify(shape);
    const viewModel = buildDualUniverseViewModel(shape, sourceCell);
    const renderGeometry = buildDualUniverseRenderGeometry(shape, sourceCell);

    expect(isDualViewSupportedCell(shape, sourceCell), `${scenario.name}: pyritohedral source should support Dual View`);
    expect(viewModel.kind === 'semantic-model', `${scenario.name}: expected semantic-model view model`);
    expect(renderGeometry.kind === 'semantic-model', `${scenario.name}: expected semantic-model render geometry`);
    expect(
      renderGeometry.kind === 'semantic-model' && renderGeometry.topology === 'dodecahedron',
      `${scenario.name}: expected semantic render topology dodecahedron`,
    );

    if (viewModel.kind === 'semantic-model') {
      const semanticModel = viewModel.semanticModel;
      const dualVertexIds = Object.keys(semanticModel.dualVertices);
      const dualFaceIds = semanticModel.dualFaces.map((face) => face.id);
      const dualEdgeIds = semanticModel.dualEdges.map((edge) => edge.id);

      expect(dualVertexIds.length === 20, `${scenario.name}: expected 20 semantic dual vertices`);
      expect(dualFaceIds.length === 12, `${scenario.name}: expected 12 semantic dual faces`);
      expect(dualEdgeIds.length === 30, `${scenario.name}: expected 30 semantic dual edges`);
      expect(
        Object.keys(semanticModel.sourceFaceToDualVertex).length === 20,
        `${scenario.name}: expected source face to dual vertex map`,
      );
      expect(
        Object.keys(semanticModel.sourceVertexToDualFace).length === 12,
        `${scenario.name}: expected source vertex to dual face map`,
      );
      expect(
        Object.keys(semanticModel.sourceEdgeToDualEdge).length === 30,
        `${scenario.name}: expected source edge to dual edge map`,
      );

      verifySemanticTargetResolution(shape, semanticModel, 'vertex', dualVertexIds[0], scenario.name);
      verifySemanticTargetResolution(shape, semanticModel, 'face', dualFaceIds[0], scenario.name);
      verifySemanticTargetResolution(shape, semanticModel, 'edge', dualEdgeIds[0], scenario.name);
    }

    expect(JSON.stringify(shape) === beforeJson, `${scenario.name}: semantic Dual Universe mutated source shape`);
    logPolicy(
      `${scenario.name} pyritohedral-icosahedron`,
      'SEMANTIC_MODEL_OK',
      'active source maps to read-only dodecahedron semantic model',
    );
  }
}

function verifyMaterializedDodecahedronSourcePolicy() {
  printDivider('materialized dodecahedron source policy');

  const { shape: pyritohedralShape, sourceCell } = runPathToPyritohedralIcosahedron({
    name: 'dodecahedron materialization path',
    seedKey: 'cube',
    amboSteps: [step('cube seed', selectActiveCell({ kind: 'seed' }))],
  });

  expect(
    canApplyDualization(pyritohedralShape, sourceCell.id),
    'pyritohedral source should remain materialized-dualization capable',
  );

  const dualizedShape = applyDualization(pyritohedralShape, sourceCell.id);
  const dodecahedron = sortedCells(dualizedShape.cells).find((cell) => cell.topology === 'dodecahedron') ?? null;

  expect(Boolean(dodecahedron), 'materialized dodecahedron cell should exist for source policy check');

  if (!dodecahedron) {
    return;
  }

  const viewModel = buildDualUniverseViewModel(dualizedShape, dodecahedron);
  const renderGeometry = buildDualUniverseRenderGeometry(dualizedShape, dodecahedron);

  expect(viewModel.kind === 'unsupported', 'dodecahedron source must not produce Dual View behavior');
  expect(renderGeometry.kind === 'unsupported', 'dodecahedron source must not render an icosahedron proxy');
  expect(!isDualViewSupportedCell(dualizedShape, dodecahedron), 'dodecahedron source must not be Dual View supported');
  expect(!canApplyDualization(dualizedShape, dodecahedron.id), 'dodecahedron source must not dualize again');
  expect(
    renderGeometry.kind !== 'legacy-proxy' || renderGeometry.topology !== 'icosahedron',
    'dodecahedron source must not expose dodecahedron -> icosahedron Dual View behavior',
  );
  expect(
    resolveDualInspectionTarget(dualizedShape, fakeStandaloneDualTarget(dodecahedron)) === null,
    'dodecahedron source unexpectedly resolved semantic inspection target',
  );

  logPolicy(
    'dodecahedron as Dual View source',
    'EXPLICITLY_FORBIDDEN',
    'available only as semantic/materialized result, not as dodecahedron -> icosahedron source',
  );
}

function verifyUnsupportedCell(shape, cell, label, status) {
  expect(Boolean(cell), `${label}: expected reachable fixture cell`);

  if (!cell) {
    return;
  }

  const viewModel = buildDualUniverseViewModel(shape, cell);
  const renderGeometry = buildDualUniverseRenderGeometry(shape, cell);

  expect(viewModel.kind === 'unsupported', `${label}: expected unsupported Dual View policy`);
  expect(renderGeometry.kind === 'unsupported', `${label}: expected unsupported render geometry`);
  expect(!isDualViewSupportedCell(shape, cell), `${label}: should not be Dual View supported`);
  expect(!canApplyDualization(shape, cell.id), `${label}: should not be materialized-dualization capable`);
  expect(
    resolveDualInspectionTarget(shape, fakeStandaloneDualTarget(cell)) === null,
    `${label}: unsupported cell unexpectedly resolved semantic inspection target`,
  );

  logPolicy(label, status, 'no legacy proxy, semantic model, or materialized dualization path');
}

function verifySemanticTargetResolution(shape, semanticModel, kind, id, scenarioName) {
  let target = null;

  if (kind === 'vertex') {
    target = createDualVertexInspectionTarget(semanticModel, id);
  } else if (kind === 'face') {
    target = createDualFaceInspectionTarget(semanticModel, id);
  } else {
    target = createDualEdgeInspectionTarget(semanticModel, id);
  }

  const resolved = target ? resolveDualInspectionTarget(shape, target) : null;

  expect(Boolean(target), `${scenarioName}: expected semantic ${kind} inspection target`);
  expect(resolved?.kind === kind, `${scenarioName}: expected resolved semantic ${kind} target`);
}

function runPathToPyritohedralIcosahedron(scenario) {
  let shape = createSeedShape(scenario.seedKey);

  for (const scenarioStep of scenario.amboSteps) {
    const targetCell = scenarioStep.select(shape);

    shape = applyAmbo(shape, targetCell, scenarioStep.label);
  }

  const cuboctahedron = requireActiveCell(shape, { kind: 'core', topology: 'cuboctahedron' });

  if (!canApplyPyritohedralDiagonalization(shape, cuboctahedron.id)) {
    recordFailure(`${scenario.name}: cuboctahedron was not pyritohedral-ready`);
    return { shape, sourceCell: cuboctahedron };
  }

  shape = applyPyritohedralDiagonalization(shape, cuboctahedron.id);

  return {
    shape,
    sourceCell: requireActiveCell(shape, { kind: 'core', topology: 'pyritohedral-icosahedron' }),
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

function fakeDualFaceTarget(sourceCell, renderGeometry) {
  return {
    universe: 'dual',
    kind: 'face',
    sourceCellId: sourceCell.id,
    dualFaceId: renderGeometry.faces[0]?.id ?? 'dual:missing-face',
    sourceVertexId: sourceCell.vertexIds[0] ?? 'vertex:missing',
  };
}

function fakeStandaloneDualTarget(sourceCell) {
  return {
    universe: 'dual',
    kind: 'face',
    sourceCellId: sourceCell.id,
    dualFaceId: 'dual:policy-forbidden-face',
    sourceVertexId: sourceCell.vertexIds[0] ?? 'vertex:missing',
  };
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

function step(label, select) {
  return { label, select };
}

function logPolicy(label, status, detail) {
  console.log(`${status}: ${label} - ${detail}`);
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

function verifyInverseMap(scenarioName, label, forward, reverse, expectedSources, expectedTargets) {
  expectSameSet(`${scenarioName}: ${label} source keys`, Object.keys(forward), expectedSources);
  expectSameSet(`${scenarioName}: ${label} reverse values`, Object.values(reverse), expectedSources);
  expectSameSet(`${scenarioName}: ${label} target values`, Object.values(forward), expectedTargets);
  expectSameSet(`${scenarioName}: ${label} target keys`, Object.keys(reverse), expectedTargets);

  for (const [sourceId, targetId] of Object.entries(forward)) {
    expect(reverse[targetId] === sourceId, `${scenarioName}: ${label} inverse mismatch at ${sourceId}`);
  }

  for (const [targetId, sourceId] of Object.entries(reverse)) {
    expect(forward[sourceId] === targetId, `${scenarioName}: ${label} forward mismatch at ${targetId}`);
  }
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
