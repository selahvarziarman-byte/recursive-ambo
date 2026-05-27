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
const { applyAmboDissection } = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const {
  applyPyritohedralDiagonalization,
} = require(path.join(repoRoot, 'src/lib/pyritohedralDiagonalization.ts'));
const { isCellActiveFrontier } = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const {
  buildDualUniverseRenderGeometry,
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

console.log('Dual Universe inspection diagnostics');
console.log('');

verifyInspectionScenario({
  name: 'tetrahedron -> octahedron -> cuboctahedron -> pyritohedral-icosahedron',
  seedKey: 'tetrahedron',
  amboTopologies: ['seed', 'octahedron'],
});

verifyInspectionScenario({
  name: 'cube -> cuboctahedron -> pyritohedral-icosahedron',
  seedKey: 'cube',
  amboTopologies: ['seed'],
});

verifyCorrespondenceInspectionCoverage();
verifyUnsupportedInspectionGuard();
verifySelectionBoundary();

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

function verifyInspectionScenario({ name, seedKey, amboTopologies }) {
  let shape = createSeedShape(seedKey);

  for (const topology of amboTopologies) {
    const targetCell =
      topology === 'seed'
        ? shape.cells.find((cell) => cell.kind === 'seed')
        : findActiveCell(shape, { kind: 'core', topology });

    assert(targetCell, `${name}: missing Ambo target ${topology}`);
    shape = applyAmboDissection(shape, targetCell.id);
  }

  const cuboctahedron = findActiveCell(shape, { kind: 'core', topology: 'cuboctahedron' });
  assert(cuboctahedron, `${name}: missing cuboctahedron for pyritohedral diagonalization`);
  shape = applyPyritohedralDiagonalization(shape, cuboctahedron.id);

  const sourceCell = findActiveCell(shape, {
    kind: 'core',
    topology: 'pyritohedral-icosahedron',
  });
  assert(sourceCell, `${name}: missing active pyritohedral-icosahedron source`);

  const beforeJson = JSON.stringify(shape);
  const beforeSummary = summarizeShape(shape);
  const renderGeometry = buildDualUniverseRenderGeometry(shape, sourceCell);

  assert(renderGeometry.kind === 'semantic-model', `${name}: expected semantic render geometry`);

  if (renderGeometry.kind !== 'semantic-model') {
    return;
  }

  const semanticModel = renderGeometry.viewModel.semanticModel;
  const sourceFaceIds = new Set(sourceCell.faceIds);
  const sourceVertexIds = new Set(sourceCell.vertexIds);
  const sourceEdgeIds = getSourceCellEdgeIds(shape, sourceCell);

  for (const dualFace of semanticModel.dualFaces) {
    const target = createDualFaceInspectionTarget(semanticModel, dualFace.id);
    const resolved = target ? resolveDualInspectionTarget(shape, target) : null;

    assert(target, `${name}: missing face inspection target for ${dualFace.id}`);
    assert(
      resolved?.kind === 'face' && resolved.modelKind === 'semantic',
      `${name}: failed to resolve semantic dual face ${dualFace.id}`,
    );

    if (resolved?.kind !== 'face' || resolved.modelKind !== 'semantic') {
      continue;
    }

    assert(
      sourceVertexIds.has(resolved.target.sourceVertexId),
      `${name}: dual face ${dualFace.id} source vertex is not in source cell`,
    );
    assert(
      resolved.dualFace.lineage?.inheritanceMode === 'derived-from-vertex',
      `${name}: dual face ${dualFace.id} lineage is not derived-from-vertex`,
    );
  }

  for (const dualEdge of semanticModel.dualEdges) {
    const target = createDualEdgeInspectionTarget(semanticModel, dualEdge.id);
    const resolved = target ? resolveDualInspectionTarget(shape, target) : null;

    assert(target, `${name}: missing edge inspection target for ${dualEdge.id}`);
    assert(
      resolved?.kind === 'edge' && resolved.modelKind === 'semantic',
      `${name}: failed to resolve semantic dual edge ${dualEdge.id}`,
    );

    if (resolved?.kind !== 'edge' || resolved.modelKind !== 'semantic') {
      continue;
    }

    assert(
      sourceEdgeIds.has(resolved.target.sourceEdgeId),
      `${name}: dual edge ${dualEdge.id} source edge is not in source cell`,
    );
    assert(
      resolved.dualEdge.lineage?.inheritanceMode === 'derived-from-edge',
      `${name}: dual edge ${dualEdge.id} lineage is not derived-from-edge`,
    );
  }

  for (const dualVertex of Object.values(semanticModel.dualVertices)) {
    const target = createDualVertexInspectionTarget(semanticModel, dualVertex.id);
    const resolved = target ? resolveDualInspectionTarget(shape, target) : null;

    assert(target, `${name}: missing vertex inspection target for ${dualVertex.id}`);
    assert(
      resolved?.kind === 'vertex' && resolved.modelKind === 'semantic',
      `${name}: failed to resolve semantic dual vertex ${dualVertex.id}`,
    );

    if (resolved?.kind !== 'vertex' || resolved.modelKind !== 'semantic') {
      continue;
    }

    assert(
      sourceFaceIds.has(resolved.target.sourceFaceId),
      `${name}: dual vertex ${dualVertex.id} source face is not in source cell`,
    );
    assert(
      resolved.dualVertex.data.lineage?.inheritanceMode === 'derived-from-face',
      `${name}: dual vertex ${dualVertex.id} lineage is not derived-from-face`,
    );
  }

  const afterSummary = summarizeShape(shape);

  assert(shape.id === beforeSummary.id, `${name}: shape id changed`);
  assert(shape.generations.length === beforeSummary.generationCount, `${name}: generation count changed`);
  assert(shape.cells.length === beforeSummary.cellCount, `${name}: cell count changed`);
  assert(JSON.stringify(shape) === beforeJson, `${name}: serialized shape changed`);

  console.log(
    `${name}: ${semanticModel.dualFaces.length} faces, ${semanticModel.dualEdges.length} edges, ${
      Object.keys(semanticModel.dualVertices).length
    } vertices inspected`,
  );
}

function verifyCorrespondenceInspectionCoverage() {
  for (const seedKey of ['tetrahedron', 'octahedron', 'cube']) {
    const shape = createSeedShape(seedKey);
    const sourceCell = shape.cells[0];

    verifyCorrespondenceInspectionForCell(seedKey, shape, sourceCell);
  }

  for (const scenario of [
    {
      label: 'tetrahedron -> octahedron -> cuboctahedron',
      seedKey: 'tetrahedron',
      amboTopologies: ['seed', 'octahedron'],
    },
    {
      label: 'cube -> cuboctahedron',
      seedKey: 'cube',
      amboTopologies: ['seed'],
    },
  ]) {
    let shape = createSeedShape(scenario.seedKey);

    for (const topology of scenario.amboTopologies) {
      const targetCell =
        topology === 'seed'
          ? shape.cells.find((cell) => cell.kind === 'seed')
          : findActiveCell(shape, { kind: 'core', topology });

      assert(targetCell, `${scenario.label}: missing Ambo target ${topology}`);
      shape = applyAmboDissection(shape, targetCell.id);
    }

    const sourceCell = findActiveCell(shape, { kind: 'core', topology: 'cuboctahedron' });

    assert(sourceCell, `${scenario.label}: missing cuboctahedron`);

    if (sourceCell) {
      verifyCorrespondenceInspectionForCell(scenario.label, shape, sourceCell, {
        topology: 'rhombic-dodecahedron',
        vertices: 14,
        edges: 24,
        faces: 12,
      });
    }
  }

  for (const scenario of [
    {
      label: 'tetrahedron -> octahedron -> cuboctahedron -> rhombicuboctahedron',
      seedKey: 'tetrahedron',
      amboTopologies: ['seed', 'octahedron', 'cuboctahedron'],
    },
    {
      label: 'cube -> cuboctahedron -> rhombicuboctahedron',
      seedKey: 'cube',
      amboTopologies: ['seed', 'cuboctahedron'],
    },
  ]) {
    let shape = createSeedShape(scenario.seedKey);

    for (const topology of scenario.amboTopologies) {
      const targetCell =
        topology === 'seed'
          ? shape.cells.find((cell) => cell.kind === 'seed')
          : findActiveCell(shape, { kind: 'core', topology });

      assert(targetCell, `${scenario.label}: missing Ambo target ${topology}`);
      shape = applyAmboDissection(shape, targetCell.id);
    }

    const sourceCell = findActiveCell(shape, { kind: 'core', topology: 'rhombicuboctahedron' });

    assert(sourceCell, `${scenario.label}: missing rhombicuboctahedron`);

    if (sourceCell) {
      verifyCorrespondenceInspectionForCell(scenario.label, shape, sourceCell, {
        topology: 'deltoidal-icositetrahedron',
        vertices: 26,
        edges: 48,
        faces: 24,
      });
    }
  }

  console.log('correspondence Dual View proxies reject stale semantic inspection targets');
}

function verifyCorrespondenceInspectionForCell(label, shape, sourceCell, expected) {
  const renderGeometry = buildDualUniverseRenderGeometry(shape, sourceCell);

  assert(
    renderGeometry.kind === 'correspondence-proxy',
    `${label}: expected correspondence Dual View render geometry`,
  );

  if (renderGeometry.kind !== 'correspondence-proxy') {
    return;
  }

  if (expected) {
    assert(renderGeometry.topology === expected.topology, `${label}: expected ${expected.topology} topology`);
    assert(renderGeometry.vertices.length === expected.vertices, `${label}: expected ${expected.vertices} dual vertices`);
    assert(renderGeometry.edges.length === expected.edges, `${label}: expected ${expected.edges} dual edges`);
    assert(renderGeometry.faces.length === expected.faces, `${label}: expected ${expected.faces} dual faces`);
  }

  const model = renderGeometry.viewModel.correspondenceProxy.correspondenceModel;
  const dualVertex = Object.values(model.dualVertices)[0];
  const dualFace = model.dualFaces[0];
  const dualEdge = model.dualEdges[0];

  const vertexTarget = dualVertex
    ? createDualCorrespondenceVertexInspectionTarget(model, dualVertex.id)
    : null;
  const resolvedVertex = vertexTarget ? resolveDualInspectionTarget(shape, vertexTarget) : null;

  assert(vertexTarget, `${label}: missing correspondence vertex inspection target`);
  assert(
    resolvedVertex?.kind === 'vertex' &&
      resolvedVertex.modelKind === 'correspondence' &&
      resolvedVertex.target.sourceFaceId === model.dualVertexToSourceFace[dualVertex?.id],
    `${label}: failed to resolve correspondence dual vertex`,
  );

  const faceTarget = dualFace
    ? createDualCorrespondenceFaceInspectionTarget(model, dualFace.id)
    : null;
  const resolvedFace = faceTarget ? resolveDualInspectionTarget(shape, faceTarget) : null;

  assert(faceTarget, `${label}: missing correspondence face inspection target`);
  assert(
    resolvedFace?.kind === 'face' &&
      resolvedFace.modelKind === 'correspondence' &&
      resolvedFace.target.sourceVertexId === model.dualFaceToSourceVertex[dualFace?.id],
    `${label}: failed to resolve correspondence dual face`,
  );

  const edgeTarget = dualEdge
    ? createDualCorrespondenceEdgeInspectionTarget(model, dualEdge.id)
    : null;
  const resolvedEdge = edgeTarget ? resolveDualInspectionTarget(shape, edgeTarget) : null;

  assert(edgeTarget, `${label}: missing correspondence edge inspection target`);
  assert(
    resolvedEdge?.kind === 'edge' &&
      resolvedEdge.modelKind === 'correspondence' &&
      resolvedEdge.target.sourceEdgeId === model.dualEdgeToSourceEdge[dualEdge?.id],
    `${label}: failed to resolve correspondence dual edge`,
  );

  const semanticTarget = {
    universe: 'dual',
    modelKind: 'semantic',
    kind: 'face',
    sourceCellId: sourceCell.id,
    dualModelId: 'dual-model:correspondence-proxy-mismatch',
    dualFaceId: renderGeometry.faces[0]?.id ?? 'dual:missing',
    sourceVertexId: sourceCell.vertexIds[0] ?? 'vertex:missing',
  };

  assert(
    resolveDualInspectionTarget(shape, semanticTarget) === null,
    `${label}: correspondence proxy unexpectedly resolved as semantic inspection`,
  );

  console.log(`${label}: correspondence vertex, face, and edge targets inspected`);
}

function verifyUnsupportedInspectionGuard() {
  let shape = createSeedShape('octahedron');
  const seedCell = shape.cells.find((cell) => cell.kind === 'seed');

  assert(seedCell, 'unsupported guard: missing octahedron seed');
  if (!seedCell) {
    return;
  }
  shape = applyAmboDissection(shape, seedCell.id);

  const squarePyramid = findActiveCell(shape, {
    kind: 'residue',
    topology: 'square-pyramid',
  });

  assert(squarePyramid, 'unsupported guard: missing square-pyramid residue');

  if (!squarePyramid) {
    return;
  }

  const renderGeometry = buildDualUniverseRenderGeometry(shape, squarePyramid);

  assert(
    renderGeometry.kind === 'unsupported',
    'square-pyramid: expected unsupported Dual Universe render geometry',
  );

  const target = {
    universe: 'dual',
    modelKind: 'correspondence',
    kind: 'face',
    sourceCellId: squarePyramid.id,
    dualModelId: 'dual-model:unsupported',
    dualFaceId: 'dual:unsupported-face',
    sourceVertexId: squarePyramid.vertexIds[0] ?? 'vertex:missing',
  };

  assert(
    resolveDualInspectionTarget(shape, target) === null,
    'square-pyramid: unsupported Dual Universe unexpectedly resolved correspondence inspection',
  );

  console.log('unsupported square-pyramid rejects correspondence inspection targets');
}

function verifySelectionBoundary() {
  const dualViewSource = fs.readFileSync(path.join(repoRoot, 'src/lib/dualView.ts'), 'utf8');
  const storeSource = fs.readFileSync(path.join(repoRoot, 'src/store/geometryStore.ts'), 'utf8');

  assert(
    !dualViewSource.includes('selectedVertexId'),
    'dual inspection resolver/model path must not read selectedVertexId',
  );
  assert(
    storeSource.includes('set({ dualInspectionTarget: target, selectedVertexId: null'),
    'setDualInspectionTarget must keep dual inspection separate from primal selectedVertexId',
  );

  console.log('dual inspection targets remain separate from primal selectedVertexId');
}

function findActiveCell(shape, { kind, topology }) {
  return shape.cells.find(
    (cell) =>
      cell.kind === kind &&
      cell.topology === topology &&
      isCellActiveFrontier(shape, cell.id),
  );
}

function getSourceCellEdgeIds(shape, cell) {
  const facesById = new Map(shape.faces.map((face) => [face.id, face]));
  const edgeByKey = new Map(shape.edges.map((edge) => [canonicalEdgeKey(...edge.vertexIds), edge]));
  const edgeIds = new Set();

  for (const faceId of cell.faceIds) {
    const face = facesById.get(faceId);

    if (!face) {
      continue;
    }

    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const edge = edgeByKey.get(canonicalEdgeKey(a, b));

      if (edge) {
        edgeIds.add(edge.id);
      }
    }
  }

  return edgeIds;
}

function summarizeShape(shape) {
  return {
    id: shape.id,
    generationCount: shape.generations.length,
    cellCount: shape.cells.length,
  };
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}
