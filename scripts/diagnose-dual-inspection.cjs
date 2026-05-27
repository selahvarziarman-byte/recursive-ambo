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

verifyLegacyInspectionGuards();
verifyUnsupportedInspectionGuard();

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
    assert(resolved?.kind === 'face', `${name}: failed to resolve dual face ${dualFace.id}`);

    if (resolved?.kind !== 'face') {
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
    assert(resolved?.kind === 'edge', `${name}: failed to resolve dual edge ${dualEdge.id}`);

    if (resolved?.kind !== 'edge') {
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
    assert(resolved?.kind === 'vertex', `${name}: failed to resolve dual vertex ${dualVertex.id}`);

    if (resolved?.kind !== 'vertex') {
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

function verifyLegacyInspectionGuards() {
  for (const seedKey of ['tetrahedron', 'octahedron', 'cube']) {
    const shape = createSeedShape(seedKey);
    const sourceCell = shape.cells[0];
    const renderGeometry = buildDualUniverseRenderGeometry(shape, sourceCell);

    assert(
      renderGeometry.kind === 'legacy-proxy',
      `${seedKey}: expected legacy Dual View render geometry`,
    );

    const target = {
      universe: 'dual',
      kind: 'face',
      sourceCellId: sourceCell.id,
      dualFaceId: renderGeometry.kind === 'legacy-proxy' ? renderGeometry.faces[0]?.id ?? 'dual:missing' : 'dual:missing',
      sourceVertexId: sourceCell.vertexIds[0] ?? 'vertex:missing',
    };

    assert(
      resolveDualInspectionTarget(shape, target) === null,
      `${seedKey}: legacy DualViewProxy unexpectedly resolved as semantic inspection`,
    );
  }

  console.log('legacy Dual View proxies reject semantic inspection targets');
}

function verifyUnsupportedInspectionGuard() {
  let shape = createSeedShape('tetrahedron');
  const seedCell = shape.cells.find((cell) => cell.kind === 'seed');

  assert(seedCell, 'unsupported guard: missing tetrahedron seed');
  if (!seedCell) {
    return;
  }
  shape = applyAmboDissection(shape, seedCell.id);

  const octahedron = findActiveCell(shape, { kind: 'core', topology: 'octahedron' });
  assert(octahedron, 'unsupported guard: missing octahedron core');
  if (!octahedron) {
    return;
  }
  shape = applyAmboDissection(shape, octahedron.id);

  const cuboctahedron = findActiveCell(shape, { kind: 'core', topology: 'cuboctahedron' });
  assert(cuboctahedron, 'unsupported guard: missing cuboctahedron core');
  if (!cuboctahedron) {
    return;
  }
  shape = applyAmboDissection(shape, cuboctahedron.id);

  const rhombicuboctahedron = findActiveCell(shape, {
    kind: 'core',
    topology: 'rhombicuboctahedron',
  });

  assert(rhombicuboctahedron, 'unsupported guard: missing rhombicuboctahedron frontier');

  if (!rhombicuboctahedron) {
    return;
  }

  const renderGeometry = buildDualUniverseRenderGeometry(shape, rhombicuboctahedron);

  assert(
    renderGeometry.kind === 'unsupported',
    'rhombicuboctahedron: expected unsupported Dual Universe render geometry',
  );

  const target = {
    universe: 'dual',
    kind: 'face',
    sourceCellId: rhombicuboctahedron.id,
    dualFaceId: 'dual:unsupported-face',
    sourceVertexId: rhombicuboctahedron.vertexIds[0] ?? 'vertex:missing',
  };

  assert(
    resolveDualInspectionTarget(shape, target) === null,
    'rhombicuboctahedron: unsupported Dual Universe unexpectedly resolved semantic inspection',
  );

  console.log('unsupported rhombicuboctahedron rejects semantic inspection targets');
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
