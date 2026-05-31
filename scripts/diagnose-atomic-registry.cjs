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
const { buildAtomicRegistryReport } = require(path.join(repoRoot, 'src/lib/atomicRegistry.ts'));

const failures = [];

console.log('Atomic registry diagnostics');

runSupportedTetrahedronMidpoint();
runSupportedSingleContextMidpoint();
runVertexNotFound();
runNotGeneratedMidpoint();
runMissingSourceEdge();
runMissingSourceFaceContext();
runNonTriangularContext();

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

function runSupportedTetrahedronMidpoint() {
  const shape = createAmboShape('tetrahedron');
  const midpoint = getFirstGeneratedMidpoint(shape);
  const report = buildAtomicRegistryReport(shape, midpoint.id);

  expectSupported(report, 'tetrahedron generated midpoint');

  if (report.status !== 'supported') {
    return;
  }

  expectEqual(
    report.triangularFaceContexts.length,
    2,
    'tetrahedron generated midpoint should expose two triangular projection contexts',
  );
  expectEqual(
    report.candidateReadings[0]?.kind,
    'edge-mediation-with-face-local-projection',
    'tetrahedron generated midpoint should expose the conservative candidate reading',
  );
  expectEqual(
    report.parentVertices.length,
    2,
    'tetrahedron generated midpoint should recover two parent vertices',
  );

  console.log(
    `supported two-context midpoint: ${shortenId(midpoint.id)} ` +
      `projection sources=${report.triangularFaceContexts
        .map((context) => shortenId(context.projectionSourceVertexId))
        .join(', ')}`,
  );
}

function runSupportedSingleContextMidpoint() {
  const shape = createAmboShape('tetrahedron');
  const midpoint = getFirstGeneratedMidpoint(shape);
  const oneContextShape = keepOnlyFirstContext(shape, midpoint.id);
  const report = buildAtomicRegistryReport(oneContextShape, midpoint.id);

  expectSupported(report, 'single-context generated midpoint');

  if (report.status !== 'supported') {
    return;
  }

  expectEqual(
    report.triangularFaceContexts.length,
    1,
    'single-context generated midpoint should expose exactly one projection context',
  );

  console.log(`supported one-context midpoint: ${shortenId(midpoint.id)}`);
}

function runVertexNotFound() {
  const shape = createAmboShape('tetrahedron');
  const report = buildAtomicRegistryReport(shape, 'vertex:missing');

  expectUnsupported(report, 'vertex-not-found', 'missing vertex should be unsupported');
}

function runNotGeneratedMidpoint() {
  const shape = createSeedShape('tetrahedron');
  const vertexId = Object.keys(shape.vertices).sort()[0];
  const report = buildAtomicRegistryReport(shape, vertexId);

  expectUnsupported(report, 'not-generated-midpoint', 'seed vertex should not be a generated midpoint');
}

function runMissingSourceEdge() {
  const shape = createAmboShape('tetrahedron');
  const midpoint = getFirstGeneratedMidpoint(shape);
  const malformedShape = {
    ...shape,
    vertices: {
      ...shape.vertices,
      [midpoint.id]: {
        ...midpoint,
        createdBy: {
          ...midpoint.createdBy,
          sourceVertexIds: [],
          sourceEdgeId: undefined,
        },
      },
    },
  };
  const report = buildAtomicRegistryReport(malformedShape, midpoint.id);

  expectUnsupported(
    report,
    'missing-source-edge',
    'generated midpoint without edge or endpoint lineage should be unsupported',
  );
}

function runMissingSourceFaceContext() {
  const shape = createAmboShape('tetrahedron');
  const midpoint = getFirstGeneratedMidpoint(shape);
  const strippedShape = removeTargetFaceContexts(shape, midpoint.id);
  const report = buildAtomicRegistryReport(strippedShape, midpoint.id);

  expectUnsupported(
    report,
    'missing-source-face-context',
    'generated midpoint without source face context should be unsupported',
  );
}

function runNonTriangularContext() {
  const shape = createAmboShape('cube');
  const midpoint = getFirstGeneratedMidpoint(shape);
  const report = buildAtomicRegistryReport(shape, midpoint.id);

  expectUnsupported(
    report,
    'non-triangular-context',
    'cube generated midpoint should not claim triangular projection context',
  );
}

function createAmboShape(seedKey) {
  const seedShape = createSeedShape(seedKey);
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    throw new Error(`Missing seed cell for ${seedKey}`);
  }

  return applyAmboDissection(seedShape, seedCell.id);
}

function getFirstGeneratedMidpoint(shape) {
  const midpoint = Object.values(shape.vertices)
    .filter((vertex) => vertex.createdBy.operation === 'ambo-dissection')
    .sort((a, b) => a.id.localeCompare(b.id))[0];

  if (!midpoint) {
    throw new Error(`No generated midpoint found in ${shape.id}`);
  }

  return midpoint;
}

function keepOnlyFirstContext(shape, targetVertexId) {
  const contexts = getTargetGeneratedContexts(shape, targetVertexId);
  const keepContext = contexts[0];

  if (!keepContext?.sourceFaceId) {
    throw new Error(`No generated source-face context found for ${targetVertexId}`);
  }

  const relevantSourceFaceIds = new Set(contexts.map((face) => face.sourceFaceId));
  const relevantGeneratedFaceIds = new Set(contexts.map((face) => face.id));
  const keepFaceIds = new Set([keepContext.id]);
  const faces = shape.faces.filter((face) => {
    if (relevantGeneratedFaceIds.has(face.id)) {
      return keepFaceIds.has(face.id);
    }

    if (face.role === 'parent-cell-face' && relevantSourceFaceIds.has(face.sourceFaceId)) {
      return face.sourceFaceId === keepContext.sourceFaceId;
    }

    return true;
  });

  return withFilteredFaces(shape, faces);
}

function removeTargetFaceContexts(shape, targetVertexId) {
  const contexts = getTargetGeneratedContexts(shape, targetVertexId);
  const relevantSourceFaceIds = new Set(contexts.map((face) => face.sourceFaceId));
  const relevantGeneratedFaceIds = new Set(contexts.map((face) => face.id));
  const faces = shape.faces.filter((face) => {
    if (relevantGeneratedFaceIds.has(face.id)) {
      return false;
    }

    if (face.role === 'parent-cell-face' && relevantSourceFaceIds.has(face.sourceFaceId)) {
      return false;
    }

    return true;
  });

  return withFilteredFaces(shape, faces);
}

function getTargetGeneratedContexts(shape, targetVertexId) {
  return shape.faces
    .filter(
      (face) =>
        face.role === 'dissection-core-face' &&
        face.sourceFaceId &&
        face.vertexIds.includes(targetVertexId),
    )
    .sort((a, b) => a.id.localeCompare(b.id));
}

function withFilteredFaces(shape, faces) {
  const faceIds = new Set(faces.map((face) => face.id));

  return {
    ...shape,
    faces,
    cells: shape.cells.map((cell) => ({
      ...cell,
      faceIds: cell.faceIds.filter((faceId) => faceIds.has(faceId)),
    })),
  };
}

function expectSupported(report, label) {
  if (report.status !== 'supported') {
    recordFailure(`${label}: expected supported, got ${report.reason}`);
  }
}

function expectUnsupported(report, reason, label) {
  if (report.status !== 'unsupported') {
    recordFailure(`${label}: expected ${reason}, got supported`);
    return;
  }

  if (report.reason !== reason) {
    recordFailure(`${label}: expected ${reason}, got ${report.reason}`);
  }
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function recordFailure(message) {
  failures.push(message);
}

function shortenId(id) {
  return id.length > 28 ? `${id.slice(0, 13)}...${id.slice(-8)}` : id;
}
