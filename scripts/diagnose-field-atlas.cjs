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
  DEFAULT_FIELD_ATLAS_SOURCE_POLICY,
  buildFieldSourcePopulation,
  buildShapeVerticesSourceDomain,
  buildTriangleFaceSourceDomain,
  buildTriangleRepresentativeSamplePoints,
  sampleFieldAtlasPoints,
} = require(path.join(repoRoot, 'src/lib/fieldAtlas.ts'));

const failures = [];

console.log('Field atlas diagnostics');
console.log(
  `Source policy: ${DEFAULT_FIELD_ATLAS_SOURCE_POLICY.name} ` +
    `(A=${DEFAULT_FIELD_ATLAS_SOURCE_POLICY.amplitude}, ` +
    `k=${formatNumber(DEFAULT_FIELD_ATLAS_SOURCE_POLICY.waveNumber)}, ` +
    `phaseStep=${formatNumber(DEFAULT_FIELD_ATLAS_SOURCE_POLICY.phaseStep)}, ` +
    `attenuation=${DEFAULT_FIELD_ATLAS_SOURCE_POLICY.attenuation})`,
);

runTriangularReferenceDiagnostic();
runGeneratedChildSourceDiagnostic();

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

function runTriangularReferenceDiagnostic() {
  const shape = createSeedShape('tetrahedron');
  const before = JSON.stringify(shape);
  const domain = buildTriangleFaceSourceDomain(shape, 'face:tetrahedron:abc');
  const sources = buildFieldSourcePopulation(shape, domain);
  const samplePoints = buildTriangleRepresentativeSamplePoints(domain);
  const samples = sampleFieldAtlasPoints(sources, samplePoints);

  expectEqual(domain.kind, 'triangle-reference', 'source-domain should be triangular');
  expectEqual(domain.vertexIds.length, 3, 'triangular source-domain should have three vertices');
  expectEqual(sources.length, 3, 'triangular source-domain should build three sources');
  expectEqual(samplePoints.length, 7, 'triangle should expose vertices, centroid, and edge midpoints');

  for (const source of sources) {
    if (!sameVec3(source.position, domain.positions[source.sourceOrder])) {
      recordFailure(`source ${source.vertexId} did not use source-domain position`);
    }
  }

  runSourceDomainPositionAuthorityCheck(shape, domain);

  for (const sample of samples) {
    expectFiniteComplex(sample.psi, `${sample.id} psi`);
    expectFiniteNonnegative(sample.intensity, `${sample.id} intensity`);
    expectFinite(sample.phase, `${sample.id} phase`);
    expectEqual(
      sample.contributionMagnitudes.length,
      sources.length,
      `${sample.id} contribution magnitude count`,
    );
    expectEqual(
      sample.contributionRatios.length,
      sources.length,
      `${sample.id} contribution ratio count`,
    );

    for (const magnitude of sample.contributionMagnitudes) {
      expectFiniteNonnegative(magnitude.value, `${sample.id} magnitude for ${magnitude.vertexId}`);
    }

    for (const ratio of sample.contributionRatios) {
      expectFiniteNonnegative(ratio.value, `${sample.id} ratio for ${ratio.vertexId}`);
    }

    const ratioSum = sample.contributionRatios.reduce((sum, ratio) => sum + ratio.value, 0);

    expectApprox(ratioSum, 1, 1e-9, `${sample.id} contribution ratios should sum to 1`);
  }

  const centroid = samples.find((sample) => sample.id === 'triangle:centroid');

  if (!centroid) {
    recordFailure('centroid sample was unavailable');
  } else {
    const centroidRatios = centroid.contributionRatios.map((ratio) => ratio.value);
    const mixedButCancelled =
      centroid.intensity < 1e-20 && centroidRatios.every((ratio) => ratio > 0.2);

    if (!mixedButCancelled) {
      recordFailure(
        `centroid should show mixture and intensity separation, got intensity=${centroid.intensity} ratios=${centroidRatios.join(',')}`,
      );
    }

    console.log(
      `intensity/mixture separation: centroid intensity=${formatNumber(
        centroid.intensity,
      )}, ratios=${formatNumberList(centroidRatios)}`,
    );
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure('triangle field-atlas diagnostic mutated the seed shape');
  }

  console.log(`triangle domain: ${shortenId(domain.faceId)} vertices=${domain.vertexIds.map(shortenId).join(', ')}`);
  console.log(`triangle sources: ${sources.length}/${domain.vertexIds.length}`);
  console.log('representative samples:');

  for (const sample of samples) {
    const ratios = sample.contributionRatios.map((ratio) => ratio.value);

    console.log(
      `- ${sample.id}: psi=${formatComplex(sample.psi)} intensity=${formatNumber(
        sample.intensity,
      )} phase=${formatNumber(sample.phase)} ratios=${formatNumberList(ratios)}`,
    );
  }
}

function runSourceDomainPositionAuthorityCheck(shape, domain) {
  const authorityDomain = {
    ...domain,
    id: `${domain.id}:position-authority-check`,
    positions: domain.positions.map((position, index) =>
      index === 0 ? [position[0] + 0.25, position[1] - 0.125, position[2] + 0.0625] : [...position],
    ),
  };
  const sources = buildFieldSourcePopulation(shape, authorityDomain);
  const firstVertex = shape.vertices[authorityDomain.vertexIds[0]];

  if (!sameVec3(sources[0].position, authorityDomain.positions[0])) {
    recordFailure('source population did not preserve the source-domain position override');
  }

  if (sameVec3(sources[0].position, firstVertex.position)) {
    recordFailure('source population re-read the shape vertex position instead of the source-domain position');
  }
}

function runGeneratedChildSourceDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);
  const generatedVertexIds = Object.values(amboShape.vertices)
    .filter((vertex) => isAmboMidpointVertex(vertex))
    .map((vertex) => vertex.id)
    .sort();
  const currentShapeDomain = buildShapeVerticesSourceDomain(amboShape);
  const currentShapeSources = buildFieldSourcePopulation(amboShape, currentShapeDomain);
  const generatedCurrentShapeSources = currentShapeSources
    .filter((source) => source.sourceKind === 'ambo-midpoint-child')
    .map((source) => source.vertexId)
    .sort();

  expectEqual(
    generatedCurrentShapeSources.length,
    generatedVertexIds.length,
    'current-shape source population should include every generated Ambo midpoint child',
  );

  for (const vertexId of generatedVertexIds) {
    if (!generatedCurrentShapeSources.includes(vertexId)) {
      recordFailure(`generated Ambo midpoint ${vertexId} was not included as a current-shape source`);
    }
  }

  const generatedTriangleFace = amboShape.faces.find(
    (face) =>
      face.vertexIds.length === 3 &&
      face.vertexIds.every((vertexId) => isAmboMidpointVertex(amboShape.vertices[vertexId])),
  );

  if (generatedTriangleFace) {
    const generatedDomain = buildTriangleFaceSourceDomain(amboShape, generatedTriangleFace.id);
    const generatedSources = buildFieldSourcePopulation(amboShape, generatedDomain);
    const generatedSamplePoints = buildTriangleRepresentativeSamplePoints(generatedDomain);
    const generatedSamples = sampleFieldAtlasPoints(generatedSources, generatedSamplePoints);

    expectEqual(
      generatedSources.length,
      3,
      'generated triangular source-domain should build three sources',
    );

    for (const source of generatedSources) {
      if (source.sourceKind !== 'ambo-midpoint-child') {
        recordFailure(
          `generated triangle source ${source.vertexId} was classified as ${source.sourceKind}`,
        );
      }
    }

    for (const sample of generatedSamples) {
      expectFiniteComplex(sample.psi, `${sample.id} generated-domain psi`);
      expectFiniteNonnegative(sample.intensity, `${sample.id} generated-domain intensity`);
      expectFinite(sample.phase, `${sample.id} generated-domain phase`);
    }

    console.log(
      `generated triangle child sources: ${generatedSources.length}/3 from ${shortenId(
        generatedTriangleFace.id,
      )}`,
    );
  } else {
    console.log(
      'generated triangle child sources: no clean generated triangular face found; using current-shape source-domain fallback',
    );
  }

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('child-source field-atlas diagnostic mutated the Ambo shape');
  }

  console.log(
    `current-shape child sources: ${generatedCurrentShapeSources.length}/${generatedVertexIds.length} generated Ambo midpoints included`,
  );
}

function isAmboMidpointVertex(vertex) {
  return Boolean(
    vertex &&
      vertex.createdBy.operation === 'ambo-dissection' &&
      (vertex.createdBy.sourceEdgeId ||
        vertex.data.lineage?.inheritanceMode === 'derived-from-edge'),
  );
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function expectApprox(actual, expected, tolerance, label) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    recordFailure(`${label}: expected ${expected} +/- ${tolerance}, got ${actual}`);
  }
}

function expectFinite(value, label) {
  if (!Number.isFinite(value)) {
    recordFailure(`${label} should be finite, got ${value}`);
  }
}

function expectFiniteNonnegative(value, label) {
  if (!Number.isFinite(value) || value < 0) {
    recordFailure(`${label} should be finite and nonnegative, got ${value}`);
  }
}

function expectFiniteComplex(value, label) {
  if (!value || !Number.isFinite(value.re) || !Number.isFinite(value.im)) {
    recordFailure(`${label} should be a finite complex value, got ${JSON.stringify(value)}`);
  }
}

function sameVec3(a, b) {
  return Boolean(b) && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function formatComplex(value) {
  return `${formatNumber(value.re)}${value.im < 0 ? '' : '+'}${formatNumber(value.im)}i`;
}

function formatNumber(value) {
  return Number.isFinite(value) ? value.toExponential(6) : String(value);
}

function formatNumberList(values) {
  return `[${values.map(formatNumber).join(', ')}]`;
}

function shortenId(id) {
  if (!id) {
    return 'none';
  }

  const parts = id.split(':');

  return parts.length > 2 ? parts.slice(-2).join(':') : id;
}

function recordFailure(message) {
  failures.push(message);
}
