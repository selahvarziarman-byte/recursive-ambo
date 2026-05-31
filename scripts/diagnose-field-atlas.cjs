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
  buildClosedShapeSurfaceRepresentativeSamplePoints,
  buildClosedShapeSurfaceSourceDomain,
  buildCellSurfaceRepresentativeSamplePoints,
  buildCellSurfaceSourceDomain,
  buildFieldSourcePopulation,
  buildPolygonFaceSourceDomain,
  buildPolygonRepresentativeSamplePoints,
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
runPolygonalFaceReferenceDiagnostic();
runCellSurfaceReferenceDiagnostic();
runClosedShapeSurfaceReferenceDiagnostic();
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

function runPolygonalFaceReferenceDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const faceId = 'face:cube:bottom';
  const face = shape.faces.find((candidate) => candidate.id === faceId);
  const domain = buildPolygonFaceSourceDomain(shape, faceId);
  const sources = buildFieldSourcePopulation(shape, domain);
  const samplePoints = buildPolygonRepresentativeSamplePoints(domain);
  const samples = sampleFieldAtlasPoints(sources, samplePoints);

  if (!face) {
    recordFailure(`${faceId} was unavailable for polygonal field-atlas diagnostic`);
    return;
  }

  expectEqual(domain.kind, 'polygon-face-reference', 'polygon source-domain kind');
  expectEqual(
    domain.vertexIds.length,
    face.vertexIds.length,
    'polygon source-domain should use every boundary vertex',
  );
  expectEqual(
    sources.length,
    domain.vertexIds.length,
    'polygon source population should include boundary vertices only',
  );
  expectEqual(
    domain.computationalCharts.length,
    domain.vertexIds.length,
    'polygon centroid fan should create one computational chart per boundary edge',
  );

  for (const source of sources) {
    if (!domain.vertexIds.includes(source.vertexId)) {
      recordFailure(`polygon source ${source.vertexId} was not a boundary vertex`);
    }

    if (!sameVec3(source.position, domain.positions[source.sourceOrder])) {
      recordFailure(`polygon source ${source.vertexId} did not use source-domain position`);
    }
  }

  for (let index = 0; index < domain.computationalCharts.length; index += 1) {
    const chart = domain.computationalCharts[index];
    const expectedBoundary = [
      domain.vertexIds[index],
      domain.vertexIds[(index + 1) % domain.vertexIds.length],
    ];

    expectEqual(
      chart.kind,
      'computational-triangle-chart',
      `${chart.chartId} should be a computational triangle chart`,
    );
    expectEqual(
      chart.semanticRole,
      'computational-only',
      `${chart.chartId} should be marked computational-only`,
    );
    expectEqual(
      chart.sourceFaceId,
      domain.faceId,
      `${chart.chartId} should preserve polygon source face provenance`,
    );
    expectEqual(
      chart.computationalSupport.kind,
      'polygon-centroid',
      `${chart.chartId} should use centroid as computational support`,
    );
    expectEqual(
      chart.sourceVertexIds.length,
      2,
      `${chart.chartId} should reference only boundary source vertices`,
    );

    if (!sameArray(chart.sourceVertexIds, expectedBoundary)) {
      recordFailure(
        `${chart.chartId} should reference adjacent boundary vertices ${expectedBoundary.join(', ')}, got ${chart.sourceVertexIds.join(', ')}`,
      );
    }
  }

  const nonBoundarySources = sources.filter((source) => !domain.vertexIds.includes(source.vertexId));

  expectEqual(
    nonBoundarySources.length,
    0,
    'computational centroid or chart points must not become field sources',
  );

  for (const samplePoint of samplePoints.filter((point) => point.chartId)) {
    expectEqual(
      samplePoint.chartSemanticRole,
      'computational-only',
      `${samplePoint.id} should carry computational-only chart role`,
    );
  }

  for (const sample of samples) {
    expectFiniteComplex(sample.psi, `${sample.id} polygon psi`);
    expectFiniteNonnegative(sample.intensity, `${sample.id} polygon intensity`);
    expectFinite(sample.phase, `${sample.id} polygon phase`);
    expectEqual(
      sample.contributionMagnitudes.length,
      sources.length,
      `${sample.id} polygon contribution magnitude count`,
    );
    expectEqual(
      sample.contributionRatios.length,
      sources.length,
      `${sample.id} polygon contribution ratio count`,
    );

    const ratioSum = sample.contributionRatios.reduce((sum, ratio) => sum + ratio.value, 0);

    expectApprox(ratioSum, 1, 1e-9, `${sample.id} polygon contribution ratios should sum to 1`);
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure('polygon field-atlas diagnostic mutated the cube shape');
  }

  console.log(
    `polygon domain: ${shortenId(domain.faceId)} boundary=${domain.vertexIds.length} sources=${sources.length} computational charts=${domain.computationalCharts.length}`,
  );
  console.log(
    `polygon chart roles: ${Array.from(new Set(domain.computationalCharts.map((chart) => chart.semanticRole))).join(', ')}`,
  );
  console.log(`polygon representative samples: ${samples.length}`);
}

function runCellSurfaceReferenceDiagnostic() {
  runTetrahedronCellSurfaceDiagnostic();
  runCubeCellSurfaceDiagnostic();
  runAmboGeneratedCellSurfaceDiagnostic();
}

function runClosedShapeSurfaceReferenceDiagnostic() {
  runTetrahedronClosedShapeSurfaceDiagnostic();
  runCubeClosedShapeSurfaceDiagnostic();
  runAmboClosedShapeSurfaceDiagnostic();
}

function runTetrahedronClosedShapeSurfaceDiagnostic() {
  const shape = createSeedShape('tetrahedron');
  const before = JSON.stringify(shape);
  const seedCell = shape.cells.find((candidate) => candidate.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for closed-shape diagnostic');
    return;
  }

  const domain = buildClosedShapeSurfaceSourceDomain(shape);
  const sources = buildFieldSourcePopulation(shape, domain);
  const samplePoints = buildClosedShapeSurfaceRepresentativeSamplePoints(domain);
  const samples = sampleFieldAtlasPoints(sources, samplePoints);
  const uniqueSurfaceVertexIds = uniqueVertexIdsFromFaces(shape, seedCell.faceIds);

  expectEqual(domain.kind, 'closed-shape-surface-reference', 'tetrahedron closed-shape domain kind');
  expectEqual(domain.shapeId, shape.id, 'tetrahedron closed-shape domain shape id');
  expectEqual(
    domain.surfaceSelectionStrategy.kind,
    'single-cell-seed-surface',
    'tetrahedron closed-shape selection strategy',
  );
  expectEqual(
    domain.surfaceSelectionStrategy.reliability,
    'supported',
    'tetrahedron closed-shape selection reliability',
  );
  expectEqual(
    domain.faceIds.length,
    seedCell.faceIds.length,
    'tetrahedron closed-shape face count should match seed cell surface',
  );
  expectEqual(
    domain.vertexIds.length,
    uniqueSurfaceVertexIds.length,
    'tetrahedron closed-shape should collect unique surface vertices',
  );
  expectEqual(
    sources.length,
    uniqueSurfaceVertexIds.length,
    'tetrahedron closed-shape source count should equal unique surface vertices',
  );
  expectEqual(
    domain.surfaceCharts.length,
    seedCell.faceIds.length,
    'tetrahedron closed-shape chart count should match triangular faces',
  );

  assertSourcesMatchDomainPositions(sources, domain, 'tetrahedron closed-shape surface');
  assertFieldSamplesAreFinite(samples, sources, 'tetrahedron closed-shape surface');

  if (JSON.stringify(shape) !== before) {
    recordFailure('tetrahedron closed-shape diagnostic mutated the seed shape');
  }

  console.log(
    `closed shape tetrahedron: strategy=${domain.surfaceSelectionStrategy.kind} faces=${domain.faceIds.length} sources=${sources.length} charts=${domain.surfaceCharts.length}`,
  );
}

function runCubeClosedShapeSurfaceDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const seedCell = shape.cells.find((candidate) => candidate.kind === 'seed');

  if (!seedCell) {
    recordFailure('cube seed cell was unavailable for closed-shape diagnostic');
    return;
  }

  const domain = buildClosedShapeSurfaceSourceDomain(shape);
  const sources = buildFieldSourcePopulation(shape, domain);
  const samplePoints = buildClosedShapeSurfaceRepresentativeSamplePoints(domain);
  const samples = sampleFieldAtlasPoints(sources, samplePoints);
  const uniqueSurfaceVertexIds = uniqueVertexIdsFromFaces(shape, seedCell.faceIds);
  const faceCornerCount = countFaceCorners(shape, seedCell.faceIds);
  const computationalCharts = domain.surfaceCharts.filter(
    (chart) => chart.kind === 'computational-triangle-chart',
  );
  const directCharts = domain.surfaceCharts.filter(
    (chart) => chart.kind === 'direct-triangle-face-chart',
  );

  expectEqual(domain.kind, 'closed-shape-surface-reference', 'cube closed-shape domain kind');
  expectEqual(domain.shapeId, shape.id, 'cube closed-shape domain shape id');
  expectEqual(
    domain.surfaceSelectionStrategy.kind,
    'single-cell-seed-surface',
    'cube closed-shape selection strategy',
  );
  expectEqual(domain.vertexIds.length, 8, 'cube closed-shape should use all 8 cube vertices');
  expectEqual(uniqueSurfaceVertexIds.length, 8, 'cube unique closed-surface vertex count should be 8');
  expectEqual(sources.length, 8, 'cube closed-shape should build 8 unique sources');
  expectEqual(faceCornerCount, 24, 'cube closed-shape face-corner count should show duplication risk');
  expectEqual(
    directCharts.length,
    0,
    'cube closed-shape square faces should not become direct triangular charts',
  );
  expectEqual(
    computationalCharts.length,
    faceCornerCount,
    'cube closed-shape square faces should create one computational chart per face boundary edge',
  );

  for (const chart of computationalCharts) {
    expectEqual(
      chart.semanticRole,
      'computational-only',
      `${chart.chartId} should remain computational-only on cube closed surface`,
    );
    expectEqual(
      chart.computationalSupport.kind,
      'polygon-centroid',
      `${chart.chartId} should use centroid as computational support only`,
    );
  }

  assertSourcesMatchDomainPositions(sources, domain, 'cube closed-shape surface');
  assertFieldSamplesAreFinite(samples, sources, 'cube closed-shape surface');

  if (JSON.stringify(shape) !== before) {
    recordFailure('cube closed-shape diagnostic mutated the seed shape');
  }

  console.log(
    `closed shape cube: strategy=${domain.surfaceSelectionStrategy.kind} unique sources=${sources.length}/${faceCornerCount} face-corners charts=${domain.surfaceCharts.length}`,
  );
  console.log(
    `closed shape cube chart roles: ${Array.from(new Set(domain.surfaceCharts.map((chart) => chart.semanticRole))).join(', ')}`,
  );
}

function runAmboClosedShapeSurfaceDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for generated closed-shape diagnostic');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);

  try {
    const domain = buildClosedShapeSurfaceSourceDomain(amboShape);
    const sources = buildFieldSourcePopulation(amboShape, domain);
    const childSources = sources.filter((source) => source.sourceKind === 'ambo-midpoint-child');

    if (!childSources.length) {
      recordFailure(
        'generated closed-shape surface support returned a domain but did not include generated Ambo midpoint sources',
      );
    }

    console.log(
      `closed shape Ambo generated surface: supported strategy=${domain.surfaceSelectionStrategy.kind} child sources=${childSources.length}/${sources.length}`,
    );
  } catch (error) {
    console.log(
      `closed shape Ambo generated surface: unsupported - missing reliable exterior-face metadata (${error.message})`,
    );
  }

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('generated closed-shape diagnostic mutated the Ambo shape');
  }
}

function runTetrahedronCellSurfaceDiagnostic() {
  const shape = createSeedShape('tetrahedron');
  const before = JSON.stringify(shape);
  const cell = shape.cells.find((candidate) => candidate.kind === 'seed');

  if (!cell) {
    recordFailure('tetrahedron seed cell was unavailable for cell-surface diagnostic');
    return;
  }

  const domain = buildCellSurfaceSourceDomain(shape, cell.id);
  const sources = buildFieldSourcePopulation(shape, domain);
  const samplePoints = buildCellSurfaceRepresentativeSamplePoints(domain);
  const samples = sampleFieldAtlasPoints(sources, samplePoints);
  const uniqueSurfaceVertexIds = uniqueVertexIdsFromFaces(shape, cell.faceIds);
  const directCharts = domain.surfaceCharts.filter(
    (chart) => chart.kind === 'direct-triangle-face-chart',
  );

  expectEqual(domain.kind, 'cell-surface-reference', 'tetrahedron cell-surface domain kind');
  expectEqual(domain.cellId, cell.id, 'tetrahedron cell-surface domain cell id');
  expectEqual(
    domain.faceIds.length,
    cell.faceIds.length,
    'tetrahedron cell-surface should preserve cell face ids',
  );
  expectEqual(
    domain.vertexIds.length,
    uniqueSurfaceVertexIds.length,
    'tetrahedron cell-surface should collect unique surface vertices',
  );
  expectEqual(
    sources.length,
    uniqueSurfaceVertexIds.length,
    'tetrahedron cell-surface source count should equal unique surface vertices',
  );
  expectEqual(
    directCharts.length,
    cell.faceIds.length,
    'tetrahedron triangular faces should become direct face charts',
  );
  expectEqual(
    domain.surfaceCharts.length,
    cell.faceIds.length,
    'tetrahedron face/chart count should match triangular surface faces',
  );

  for (const chart of directCharts) {
    expectEqual(
      chart.semanticRole,
      'face-local',
      `${chart.chartId} should be a direct face-local chart`,
    );
    expectEqual(
      chart.support.kind,
      'source-face',
      `${chart.chartId} should mark source-face support`,
    );

    if (!domain.faceIds.includes(chart.sourceFaceId)) {
      recordFailure(`${chart.chartId} source face was not in the cell-surface face set`);
    }
  }

  assertSourcesMatchDomainPositions(sources, domain, 'tetrahedron cell-surface');
  assertFieldSamplesAreFinite(samples, sources, 'tetrahedron cell-surface');

  if (JSON.stringify(shape) !== before) {
    recordFailure('tetrahedron cell-surface diagnostic mutated the seed shape');
  }

  console.log(
    `cell surface tetrahedron: faces=${domain.faceIds.length} sources=${sources.length} charts=${domain.surfaceCharts.length}`,
  );
}

function runCubeCellSurfaceDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const cell = shape.cells.find((candidate) => candidate.kind === 'seed');

  if (!cell) {
    recordFailure('cube seed cell was unavailable for cell-surface diagnostic');
    return;
  }

  const domain = buildCellSurfaceSourceDomain(shape, cell.id);
  const sources = buildFieldSourcePopulation(shape, domain);
  const samplePoints = buildCellSurfaceRepresentativeSamplePoints(domain);
  const samples = sampleFieldAtlasPoints(sources, samplePoints);
  const uniqueSurfaceVertexIds = uniqueVertexIdsFromFaces(shape, cell.faceIds);
  const faceCornerCount = countFaceCorners(shape, cell.faceIds);
  const computationalCharts = domain.surfaceCharts.filter(
    (chart) => chart.kind === 'computational-triangle-chart',
  );
  const directCharts = domain.surfaceCharts.filter(
    (chart) => chart.kind === 'direct-triangle-face-chart',
  );

  expectEqual(domain.kind, 'cell-surface-reference', 'cube cell-surface domain kind');
  expectEqual(domain.vertexIds.length, 8, 'cube cell-surface should use all 8 cube vertices');
  expectEqual(
    uniqueSurfaceVertexIds.length,
    8,
    'cube unique surface vertex count should be 8',
  );
  expectEqual(sources.length, 8, 'cube cell-surface should build 8 unique sources');
  expectEqual(faceCornerCount, 24, 'cube face-corner count should show the duplication risk');
  expectEqual(
    directCharts.length,
    0,
    'cube square faces should not become direct triangular face charts',
  );
  expectEqual(
    computationalCharts.length,
    faceCornerCount,
    'cube square faces should create one computational chart per face boundary edge',
  );

  for (const chart of computationalCharts) {
    expectEqual(
      chart.semanticRole,
      'computational-only',
      `${chart.chartId} should remain computational-only`,
    );
    expectEqual(
      chart.computationalSupport.kind,
      'polygon-centroid',
      `${chart.chartId} should use centroid as computational support only`,
    );

    if (!domain.faceIds.includes(chart.sourceFaceId)) {
      recordFailure(`${chart.chartId} source face was not in the cube cell-surface face set`);
    }
  }

  assertSourcesMatchDomainPositions(sources, domain, 'cube cell-surface');
  assertFieldSamplesAreFinite(samples, sources, 'cube cell-surface');

  if (JSON.stringify(shape) !== before) {
    recordFailure('cube cell-surface diagnostic mutated the seed shape');
  }

  console.log(
    `cell surface cube: faces=${domain.faceIds.length} unique sources=${sources.length}/${faceCornerCount} face-corners charts=${domain.surfaceCharts.length}`,
  );
  console.log(
    `cell surface cube chart roles: ${Array.from(new Set(domain.surfaceCharts.map((chart) => chart.semanticRole))).join(', ')}`,
  );
}

function runAmboGeneratedCellSurfaceDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for Ambo cell-surface diagnostic');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);
  const generatedCell = amboShape.cells.find(
    (cell) =>
      cell.kind === 'core' &&
      cell.sourceOperation === 'ambo-dissection' &&
      cell.vertexIds.every((vertexId) => isAmboMidpointVertex(amboShape.vertices[vertexId])),
  );

  if (!generatedCell) {
    recordFailure(
      'no clean generated Ambo core cell was available for cell-surface source diagnostic',
    );
    return;
  }

  const domain = buildCellSurfaceSourceDomain(amboShape, generatedCell.id);
  const sources = buildFieldSourcePopulation(amboShape, domain);
  const samplePoints = buildCellSurfaceRepresentativeSamplePoints(domain);
  const samples = sampleFieldAtlasPoints(sources, samplePoints);
  const generatedMidpointSourceIds = sources
    .filter((source) => source.sourceKind === 'ambo-midpoint-child')
    .map((source) => source.vertexId);

  expectEqual(domain.kind, 'cell-surface-reference', 'Ambo cell-surface domain kind');
  expectEqual(
    sources.length,
    domain.vertexIds.length,
    'Ambo generated cell should build one source per unique surface vertex',
  );
  expectEqual(
    generatedMidpointSourceIds.length,
    domain.vertexIds.length,
    'Ambo generated cell surface should include generated midpoint children as sources',
  );
  expectEqual(
    domain.vertexIds.length,
    uniqueVertexIdsFromFaces(amboShape, generatedCell.faceIds).length,
    'Ambo generated cell surface should dedupe vertices across faces',
  );

  for (const vertexId of domain.vertexIds) {
    if (!generatedMidpointSourceIds.includes(vertexId)) {
      recordFailure(`Ambo generated cell surface vertex ${vertexId} was not an active child source`);
    }
  }

  assertSourcesMatchDomainPositions(sources, domain, 'Ambo generated cell-surface');
  assertFieldSamplesAreFinite(samples, sources, 'Ambo generated cell-surface');

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('Ambo generated cell-surface diagnostic mutated the Ambo shape');
  }

  console.log(
    `cell surface Ambo generated core: topology=${generatedCell.topology} sources=${generatedMidpointSourceIds.length}/${domain.vertexIds.length} charts=${domain.surfaceCharts.length}`,
  );
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

function assertSourcesMatchDomainPositions(sources, domain, label) {
  for (const source of sources) {
    if (!sameVec3(source.position, domain.positions[source.sourceOrder])) {
      recordFailure(`${label} source ${source.vertexId} did not use source-domain position`);
    }
  }
}

function assertFieldSamplesAreFinite(samples, sources, label) {
  for (const sample of samples) {
    expectFiniteComplex(sample.psi, `${label} ${sample.id} psi`);
    expectFiniteNonnegative(sample.intensity, `${label} ${sample.id} intensity`);
    expectFinite(sample.phase, `${label} ${sample.id} phase`);
    expectEqual(
      sample.contributionMagnitudes.length,
      sources.length,
      `${label} ${sample.id} contribution magnitude count`,
    );
    expectEqual(
      sample.contributionRatios.length,
      sources.length,
      `${label} ${sample.id} contribution ratio count`,
    );

    const ratioSum = sample.contributionRatios.reduce((sum, ratio) => sum + ratio.value, 0);

    expectApprox(ratioSum, 1, 1e-9, `${label} ${sample.id} contribution ratios should sum to 1`);
  }
}

function uniqueVertexIdsFromFaces(shape, faceIds) {
  return Array.from(
    new Set(
      faceIds.flatMap((faceId) => {
        const face = shape.faces.find((candidate) => candidate.id === faceId);

        return face ? face.vertexIds : [];
      }),
    ),
  );
}

function countFaceCorners(shape, faceIds) {
  return faceIds.reduce((sum, faceId) => {
    const face = shape.faces.find((candidate) => candidate.id === faceId);

    return sum + (face ? face.vertexIds.length : 0);
  }, 0);
}

function sameVec3(a, b) {
  return Boolean(b) && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function sameArray(a, b) {
  return a.length === b.length && a.every((value, index) => value === b[index]);
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
