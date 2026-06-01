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
  classifyClosedShapeSurfaceBoundary,
  sampleFieldAtlasPoints,
} = require(path.join(repoRoot, 'src/lib/fieldAtlas.ts'));
const {
  buildSurfaceChartSamplePoints,
  sampleClosedShapeSurfaceAtlas,
} = require(path.join(repoRoot, 'src/lib/fieldAtlasSurfaceSampling.ts'));
const {
  buildChartGradientDiagnostics,
  buildGradientDiagnostics,
  estimateChartSampleGradients,
} = require(path.join(repoRoot, 'src/lib/fieldAtlasGradient.ts'));
const {
  buildChartPhaseDiagnostics,
  buildPhaseDiagnostics,
  estimateChartPhaseGradients,
  unwrapChartSamplePhases,
} = require(path.join(repoRoot, 'src/lib/fieldAtlasPhase.ts'));

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
runClosedShapeSurfaceSamplingDiagnostic();
runClosedShapeSurfaceGradientDiagnostic();
runClosedShapeSurfacePhaseDiagnostic();
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

function runClosedShapeSurfaceSamplingDiagnostic() {
  runSeedClosedShapeSurfaceSamplingDiagnostic('tetrahedron');
  runSeedClosedShapeSurfaceSamplingDiagnostic('cube');
  runAmboClosedShapeSurfaceSamplingDiagnostic();
  runClosedShapeSurfaceSamplingBoundsDiagnostic();
}

function runClosedShapeSurfaceGradientDiagnostic() {
  runSeedClosedShapeSurfaceGradientDiagnostic('tetrahedron');
  runSeedClosedShapeSurfaceGradientDiagnostic('cube');
  runAmboClosedShapeSurfaceGradientDiagnostic();
  runUnderdeterminedClosedShapeSurfaceGradientDiagnostic();
}

function runClosedShapeSurfacePhaseDiagnostic() {
  console.log(
    'phase diagnostics policy: chart-local-nearest-phase-unwrap-plane-v1; scope=chart-local-only; global continuity=none',
  );
  runSeedClosedShapeSurfacePhaseDiagnostic('tetrahedron');
  runSeedClosedShapeSurfacePhaseDiagnostic('cube');
  runAmboClosedShapeSurfacePhaseDiagnostic();
  runUnderdeterminedClosedShapeSurfacePhaseDiagnostic();
}

function runSeedClosedShapeSurfaceSamplingDiagnostic(seedKey) {
  const shape = createSeedShape(seedKey);
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape);
  const directCharts = atlas.domain.surfaceCharts.filter(
    (chart) => chart.kind === 'direct-triangle-face-chart',
  );
  const computationalCharts = atlas.domain.surfaceCharts.filter(
    (chart) => chart.kind === 'computational-triangle-chart',
  );

  assertSampledClosedShapeSurfaceAtlas(atlas, `${seedKey} sampled closed-shape surface`);

  expectEqual(atlas.options.subdivisions, 2, `${seedKey} sampled surface default subdivisions`);
  expectEqual(atlas.options.maxSamples, 512, `${seedKey} sampled surface default max samples`);

  if (seedKey === 'tetrahedron') {
    expectEqual(
      directCharts.length,
      atlas.domain.surfaceCharts.length,
      'tetrahedron sampled surface should use direct face-local charts',
    );
  }

  if (seedKey === 'cube') {
    expectEqual(directCharts.length, 0, 'cube sampled surface should not use direct charts');
    expectEqual(
      computationalCharts.length,
      atlas.domain.surfaceCharts.length,
      'cube sampled surface should use computational charts for square faces',
    );
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure(`${seedKey} sampled closed-shape surface mutated the shape`);
  }

  console.log(
    `sampled closed shape ${seedKey}: charts=${atlas.domain.surfaceCharts.length} samples=${atlas.samples.length}/${atlas.options.maxSamples} subdivisions=${atlas.options.subdivisions}`,
  );
}

function runAmboClosedShapeSurfaceSamplingDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for generated sampled surface diagnostic');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);
  const boundaryClassification = classifyClosedShapeSurfaceBoundary(amboShape);

  if (boundaryClassification.status === 'unsupported') {
    console.log(
      `sampled closed shape Ambo generated surface: unsupported - ${boundaryClassification.reason}${formatOptionalDetails(
        boundaryClassification.details,
      )}`,
    );

    if (JSON.stringify(amboShape) !== before) {
      recordFailure('generated sampled closed-shape surface diagnostic mutated the Ambo shape');
    }

    return;
  }

  const atlas = sampleClosedShapeSurfaceAtlas(amboShape);
  const childSources = atlas.sources.filter((source) => source.sourceKind === 'ambo-midpoint-child');

  assertSampledClosedShapeSurfaceAtlas(atlas, 'generated sampled closed-shape surface');

  if (!childSources.length) {
    recordFailure('generated sampled closed-shape surface did not include Ambo child sources');
  }

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('generated sampled closed-shape surface diagnostic mutated the Ambo shape');
  }

  console.log(
    `sampled closed shape Ambo generated surface: charts=${atlas.domain.surfaceCharts.length} samples=${atlas.samples.length}/${atlas.options.maxSamples} childSources=${childSources.length}`,
  );
}

function runClosedShapeSurfaceSamplingBoundsDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const maxSamples = 17;
  const atlas = sampleClosedShapeSurfaceAtlas(shape, { subdivisions: 8, maxSamples });
  const samplePoints = buildSurfaceChartSamplePoints(atlas.domain, {
    subdivisions: atlas.options.subdivisions,
    maxSamples,
  });

  expectEqual(atlas.options.subdivisions, 8, 'bounded sampled surface should keep requested subdivisions');
  expectEqual(atlas.options.maxSamples, maxSamples, 'bounded sampled surface should keep requested cap');
  expectEqual(atlas.samples.length, maxSamples, 'bounded sampled surface should honor maxSamples');
  expectEqual(
    samplePoints.length,
    atlas.samplePoints.length,
    'direct sampled surface point builder should match sampled atlas points under the same bounds',
  );

  if (atlas.samples.length > atlas.options.maxSamples) {
    recordFailure(
      `bounded sampled surface produced ${atlas.samples.length} samples over cap ${atlas.options.maxSamples}`,
    );
  }

  assertSampledClosedShapeSurfaceAtlas(atlas, 'bounded sampled closed-shape surface');

  if (JSON.stringify(shape) !== before) {
    recordFailure('bounded sampled closed-shape surface diagnostic mutated the cube shape');
  }

  console.log(
    `sampled closed shape bounded cap: samples=${atlas.samples.length}/${atlas.options.maxSamples} subdivisions=${atlas.options.subdivisions}`,
  );
}

function runSeedClosedShapeSurfaceGradientDiagnostic(seedKey) {
  const shape = createSeedShape(seedKey);
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape);
  const gradientDiagnostics = buildGradientDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, `${seedKey} gradient sampled closed-shape surface`);
  assertGradientDiagnostics(atlas, gradientDiagnostics, `${seedKey} surface gradients`, {
    requireDeterminedCharts: true,
  });

  if (seedKey === 'cube') {
    assertComputationalGradientRolesStayNonSemantic(
      atlas,
      gradientDiagnostics,
      'cube surface gradients',
    );
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure(`${seedKey} surface gradient diagnostic mutated the shape`);
  }

  console.log(
    `surface gradients ${seedKey}: charts=${gradientDiagnostics.chartDiagnostics.length} estimates=${gradientDiagnostics.sampleGradients.length} underdetermined=${countUnderdeterminedGradientCharts(gradientDiagnostics)}`,
  );
}

function runAmboClosedShapeSurfaceGradientDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for generated surface gradient diagnostic');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);
  const boundaryClassification = classifyClosedShapeSurfaceBoundary(amboShape);

  if (boundaryClassification.status === 'unsupported') {
    console.log(
      `surface gradients Ambo generated surface: unsupported - ${boundaryClassification.reason}${formatOptionalDetails(
        boundaryClassification.details,
      )}`,
    );

    if (JSON.stringify(amboShape) !== before) {
      recordFailure('generated surface gradient diagnostic mutated the Ambo shape');
    }

    return;
  }

  const atlas = sampleClosedShapeSurfaceAtlas(amboShape);
  const gradientDiagnostics = buildGradientDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'generated surface gradient sampled atlas');
  assertGradientDiagnostics(atlas, gradientDiagnostics, 'generated surface gradients', {
    requireDeterminedCharts: true,
  });
  assertComputationalGradientRolesStayNonSemantic(
    atlas,
    gradientDiagnostics,
    'generated surface gradients',
  );

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('generated surface gradient diagnostic mutated the Ambo shape');
  }

  console.log(
    `surface gradients Ambo generated surface: charts=${gradientDiagnostics.chartDiagnostics.length} estimates=${gradientDiagnostics.sampleGradients.length} underdetermined=${countUnderdeterminedGradientCharts(gradientDiagnostics)}`,
  );
}

function runUnderdeterminedClosedShapeSurfaceGradientDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape, { maxSamples: 1 });
  const gradientDiagnostics = buildGradientDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'underdetermined surface gradient sampled atlas');
  assertGradientDiagnostics(atlas, gradientDiagnostics, 'underdetermined surface gradients', {
    requireUnderdeterminedChart: true,
  });

  if (!gradientDiagnostics.chartDiagnostics.every((diagnostic) => diagnostic.underdetermined)) {
    recordFailure('underdetermined surface gradient diagnostic guessed a chart gradient');
  }

  expectEqual(
    gradientDiagnostics.sampleGradients.length,
    0,
    'underdetermined surface gradient diagnostic should not emit sample gradients',
  );

  if (JSON.stringify(shape) !== before) {
    recordFailure('underdetermined surface gradient diagnostic mutated the cube shape');
  }

  console.log(
    `surface gradients underdetermined cap: charts=${gradientDiagnostics.chartDiagnostics.length} underdetermined=${countUnderdeterminedGradientCharts(gradientDiagnostics)}`,
  );
}

function runSeedClosedShapeSurfacePhaseDiagnostic(seedKey) {
  const shape = createSeedShape(seedKey);
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape);
  const phaseDiagnostics = buildPhaseDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, `${seedKey} phase sampled closed-shape surface`);
  assertPhaseDiagnostics(atlas, phaseDiagnostics, `${seedKey} surface phase diagnostics`, {
    requireDeterminedCharts: true,
  });

  if (seedKey === 'cube') {
    assertComputationalPhaseRolesStayNonSemantic(
      atlas,
      phaseDiagnostics,
      'cube surface phase diagnostics',
    );
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure(`${seedKey} surface phase diagnostic mutated the shape`);
  }

  console.log(
    `surface phase ${seedKey}: charts=${phaseDiagnostics.chartDiagnostics.length} unwraps=${phaseDiagnostics.sampleUnwraps.length} estimates=${phaseDiagnostics.samplePhaseGradients.length} underdetermined=${countUnderdeterminedPhaseCharts(phaseDiagnostics)} scope=${phaseDiagnostics.scope} global=${phaseDiagnostics.globalContinuity}`,
  );
}

function runAmboClosedShapeSurfacePhaseDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for generated surface phase diagnostic');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);
  const boundaryClassification = classifyClosedShapeSurfaceBoundary(amboShape);

  if (boundaryClassification.status === 'unsupported') {
    console.log(
      `surface phase Ambo generated surface: unsupported - ${boundaryClassification.reason}${formatOptionalDetails(
        boundaryClassification.details,
      )}`,
    );

    if (JSON.stringify(amboShape) !== before) {
      recordFailure('generated surface phase diagnostic mutated the Ambo shape');
    }

    return;
  }

  const atlas = sampleClosedShapeSurfaceAtlas(amboShape);
  const phaseDiagnostics = buildPhaseDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'generated surface phase sampled atlas');
  assertPhaseDiagnostics(atlas, phaseDiagnostics, 'generated surface phase diagnostics', {
    requireDeterminedCharts: true,
  });
  assertComputationalPhaseRolesStayNonSemantic(
    atlas,
    phaseDiagnostics,
    'generated surface phase diagnostics',
  );

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('generated surface phase diagnostic mutated the Ambo shape');
  }

  console.log(
    `surface phase Ambo generated surface: charts=${phaseDiagnostics.chartDiagnostics.length} unwraps=${phaseDiagnostics.sampleUnwraps.length} estimates=${phaseDiagnostics.samplePhaseGradients.length} underdetermined=${countUnderdeterminedPhaseCharts(phaseDiagnostics)} scope=${phaseDiagnostics.scope} global=${phaseDiagnostics.globalContinuity}`,
  );
}

function runUnderdeterminedClosedShapeSurfacePhaseDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape, { maxSamples: 1 });
  const phaseDiagnostics = buildPhaseDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'underdetermined surface phase sampled atlas');
  assertPhaseDiagnostics(atlas, phaseDiagnostics, 'underdetermined surface phase diagnostics', {
    requireUnderdeterminedChart: true,
  });

  if (!phaseDiagnostics.chartDiagnostics.every((diagnostic) => diagnostic.underdetermined)) {
    recordFailure('underdetermined surface phase diagnostic guessed a chart phase gradient');
  }

  expectEqual(
    phaseDiagnostics.samplePhaseGradients.length,
    0,
    'underdetermined surface phase diagnostic should not emit sample phase gradients',
  );

  if (JSON.stringify(shape) !== before) {
    recordFailure('underdetermined surface phase diagnostic mutated the cube shape');
  }

  console.log(
    `surface phase underdetermined cap: charts=${phaseDiagnostics.chartDiagnostics.length} underdetermined=${countUnderdeterminedPhaseCharts(phaseDiagnostics)} scope=${phaseDiagnostics.scope} global=${phaseDiagnostics.globalContinuity}`,
  );
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
  const boundaryClassification = classifyClosedShapeSurfaceBoundary(amboShape);

  if (boundaryClassification.status === 'unsupported') {
    try {
      buildClosedShapeSurfaceSourceDomain(amboShape);
      recordFailure(
        'generated closed-shape surface support returned a domain after boundary classification was unsupported',
      );
    } catch (_error) {
      // Unsupported is acceptable here; the diagnostic should report it without pretending support.
    }

    console.log(
      `closed shape Ambo generated surface: unsupported - ${boundaryClassification.reason}${formatOptionalDetails(
        boundaryClassification.details,
      )}`,
    );

    if (JSON.stringify(amboShape) !== before) {
      recordFailure('generated closed-shape diagnostic mutated the Ambo shape');
    }

    return;
  }

  try {
    const domain = buildClosedShapeSurfaceSourceDomain(amboShape);
    const sources = buildFieldSourcePopulation(amboShape, domain);
    const samplePoints = buildClosedShapeSurfaceRepresentativeSamplePoints(domain);
    const samples = sampleFieldAtlasPoints(sources, samplePoints);
    const strategy = domain.surfaceSelectionStrategy;
    const childSources = sources.filter((source) => source.sourceKind === 'ambo-midpoint-child');
    const sourceVertexIds = new Set(sources.map((source) => source.vertexId));
    const boundaryFaceIds = boundaryClassification.boundaryFaces.map(
      (boundaryFace) => boundaryFace.incidence.faceId,
    );
    const internalFaceIds = boundaryClassification.internalFaces.flatMap((internalFace) =>
      internalFace.incidences.map((incidence) => incidence.faceId),
    );
    const boundaryVertexIds = uniqueVertexIdsFromFaces(amboShape, boundaryFaceIds);
    const internalVertexIds = uniqueVertexIdsFromFaces(amboShape, internalFaceIds);
    const internalOnlyVertexIds = internalVertexIds.filter(
      (vertexId) => !boundaryVertexIds.includes(vertexId),
    );
    const boundaryMidpointVertexIds = boundaryVertexIds.filter((vertexId) =>
      isAmboMidpointVertex(amboShape.vertices[vertexId]),
    );

    expectEqual(
      strategy.kind,
      'topological-cell-face-incidence',
      'generated closed-shape should use structural cell-face incidence strategy',
    );
    expectEqual(
      strategy.reliability,
      'supported',
      'generated closed-shape boundary strategy should be supported',
    );
    expectEqual(
      strategy.boundaryFaceCount,
      boundaryClassification.boundaryFaces.length,
      'generated closed-shape boundary face count',
    );
    expectEqual(
      strategy.internalFaceCount,
      boundaryClassification.internalFaces.length,
      'generated closed-shape internal face count',
    );
    expectEqual(
      strategy.activeCellIds.length,
      boundaryClassification.activeCellIds.length,
      'generated closed-shape active cell count',
    );
    expectFiniteNonnegative(
      strategy.boundaryFaceCount,
      'generated closed-shape boundary face count should be finite',
    );
    expectFiniteNonnegative(
      strategy.internalFaceCount,
      'generated closed-shape internal face count should be finite',
    );

    if (strategy.boundaryFaceCount === 0) {
      recordFailure('generated closed-shape boundary classifier found no boundary faces');
    }

    if (strategy.internalFaceCount === 0) {
      recordFailure('generated Ambo closed-shape boundary classifier found no internal interface faces');
    }

    if (boundaryClassification.internalFaces.length > 0 && strategy.internalFaceCount === 0) {
      recordFailure('generated closed-shape boundary classifier lost internal face incidences');
    }

    for (const faceId of internalFaceIds) {
      if (domain.faceIds.includes(faceId)) {
        recordFailure(`generated closed-shape included internal face ${faceId} as boundary`);
      }
    }

    expectEqual(
      domain.faceIds.length,
      boundaryFaceIds.length,
      'generated closed-shape domain should include each boundary face once',
    );
    expectEqual(
      domain.vertexIds.length,
      boundaryVertexIds.length,
      'generated closed-shape domain should dedupe shared boundary vertices',
    );
    expectEqual(
      sources.length,
      boundaryVertexIds.length,
      'generated closed-shape source count should equal unique boundary vertices',
    );

    for (const vertexId of boundaryVertexIds) {
      if (!sourceVertexIds.has(vertexId)) {
        recordFailure(`generated closed-shape boundary vertex ${vertexId} was not a source`);
      }
    }

    for (const vertexId of internalOnlyVertexIds) {
      if (sourceVertexIds.has(vertexId)) {
        recordFailure(`internal-only vertex ${vertexId} became a closed-shape source`);
      }
    }

    if (!childSources.length) {
      recordFailure(
        'generated closed-shape surface support returned a domain but did not include generated Ambo midpoint sources',
      );
    }

    expectEqual(
      childSources.length,
      boundaryMidpointVertexIds.length,
      'generated closed-shape should include all boundary Ambo midpoint children as sources',
    );

    assertSourcesMatchDomainPositions(sources, domain, 'generated closed-shape surface');
    assertFieldSamplesAreFinite(samples, sources, 'generated closed-shape surface');

    console.log(
      `closed shape Ambo generated surface: supported strategy=${strategy.kind} activeCells=${strategy.activeCellIds.length} boundaryFaces=${strategy.boundaryFaceCount} internalFaces=${strategy.internalFaceCount} sources=${sources.length} childSources=${childSources.length}/${boundaryMidpointVertexIds.length} charts=${domain.surfaceCharts.length}`,
    );
  } catch (error) {
    recordFailure(`generated closed-shape surface was classified as supported but failed: ${error.message}`);
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

function assertSampledClosedShapeSurfaceAtlas(atlas, label) {
  expectEqual(atlas.domain.kind, 'closed-shape-surface-reference', `${label} domain kind`);
  expectEqual(
    atlas.sources.length,
    atlas.domain.vertexIds.length,
    `${label} source count should match domain vertices`,
  );

  if (!Number.isInteger(atlas.samplePoints.length) || atlas.samplePoints.length < 0) {
    recordFailure(`${label} sample point count should be a finite nonnegative integer`);
  }

  if (atlas.samplePoints.length > atlas.options.maxSamples) {
    recordFailure(
      `${label} sample point count ${atlas.samplePoints.length} exceeded cap ${atlas.options.maxSamples}`,
    );
  }

  expectEqual(atlas.samples.length, atlas.samplePoints.length, `${label} sample count`);
  expectEqual(
    atlas.chartSummaries.length,
    atlas.domain.surfaceCharts.length,
    `${label} chart summary count`,
  );
  expectEqual(
    atlas.chartSummaries.reduce((sum, summary) => sum + summary.sampleCount, 0),
    atlas.samples.length,
    `${label} chart summary sample count total`,
  );

  assertSourcesMatchDomainPositions(atlas.sources, atlas.domain, label);
  assertFieldSamplesAreFinite(atlas.samples, atlas.sources, label);
  assertSurfaceSampleProvenance(atlas, label);
  assertComputationalChartsStayNonSemantic(atlas, label);
  assertComputationalSupportsAreNotSources(atlas, label);
}

function assertGradientDiagnostics(atlas, gradientDiagnostics, label, options = {}) {
  expectEqual(
    gradientDiagnostics.method,
    'chart-local-least-squares-plane-v1',
    `${label} gradient method`,
  );
  expectEqual(
    gradientDiagnostics.chartDiagnostics.length,
    atlas.domain.surfaceCharts.length,
    `${label} chart diagnostic count`,
  );

  const chartDiagnostics = buildChartGradientDiagnostics(atlas);
  const sampleGradientEstimates = estimateChartSampleGradients(atlas);

  expectEqual(
    chartDiagnostics.length,
    gradientDiagnostics.chartDiagnostics.length,
    `${label} chart diagnostics helper count`,
  );
  expectEqual(
    sampleGradientEstimates.length,
    gradientDiagnostics.sampleGradients.length,
    `${label} sample gradient helper count`,
  );

  const chartById = new Map(atlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart]));
  const chartSummaryById = new Map(atlas.chartSummaries.map((summary) => [summary.chartId, summary]));
  const diagnosticByChartId = new Map(
    gradientDiagnostics.chartDiagnostics.map((diagnostic) => [diagnostic.chartId, diagnostic]),
  );
  const estimatedGradientTotal = gradientDiagnostics.chartDiagnostics.reduce(
    (sum, diagnostic) => sum + diagnostic.estimatedGradientCount,
    0,
  );

  expectEqual(
    estimatedGradientTotal,
    gradientDiagnostics.sampleGradients.length,
    `${label} estimated gradient count total`,
  );

  for (const chart of atlas.domain.surfaceCharts) {
    const chartSummary = chartSummaryById.get(chart.chartId);
    const diagnostic = diagnosticByChartId.get(chart.chartId);
    const chartSampleCount = atlas.samples.filter((sample) => sample.chartId === chart.chartId).length;

    if (!chartSummary) {
      recordFailure(`${label} chart ${chart.chartId} had no sampled atlas chart summary`);
    } else {
      expectEqual(chartSummary.chartId, chart.chartId, `${label} chart summary id`);
      expectEqual(
        chartSummary.chartSemanticRole,
        chart.semanticRole,
        `${label} chart summary semantic role`,
      );
      expectEqual(
        chartSummary.sourceFaceId,
        chart.sourceFaceId,
        `${label} chart summary source face provenance`,
      );
    }

    if (!diagnostic) {
      recordFailure(`${label} chart ${chart.chartId} had no gradient diagnostic`);
      continue;
    }

    expectEqual(diagnostic.chartId, chart.chartId, `${label} gradient chart id`);
    expectEqual(
      diagnostic.chartSemanticRole,
      chart.semanticRole,
      `${label} gradient chart semantic role`,
    );
    expectEqual(
      diagnostic.sourceFaceId,
      chart.sourceFaceId,
      `${label} gradient source face provenance`,
    );
    expectEqual(diagnostic.sampleCount, chartSampleCount, `${label} gradient sample count`);
    expectEqual(diagnostic.method, gradientDiagnostics.method, `${label} gradient diagnostic method`);
    expectEqual(
      diagnostic.phaseGradientStatus.status,
      'omitted',
      `${label} phase gradient status`,
    );

    if (diagnostic.underdetermined) {
      if (!diagnostic.underdeterminedReason) {
        recordFailure(`${label} underdetermined chart ${chart.chartId} did not explain why`);
      }

      expectEqual(
        diagnostic.estimatedGradientCount,
        0,
        `${label} underdetermined chart ${chart.chartId} estimated gradient count`,
      );
      continue;
    }

    expectFiniteNonnegative(
      diagnostic.minIntensityGradientMagnitude,
      `${label} ${chart.chartId} min intensity gradient magnitude`,
    );
    expectFiniteNonnegative(
      diagnostic.maxIntensityGradientMagnitude,
      `${label} ${chart.chartId} max intensity gradient magnitude`,
    );
    expectFiniteNonnegative(
      diagnostic.averageIntensityGradientMagnitude,
      `${label} ${chart.chartId} average intensity gradient magnitude`,
    );

    if (diagnostic.minIntensityGradientMagnitude > diagnostic.maxIntensityGradientMagnitude) {
      recordFailure(`${label} ${chart.chartId} gradient magnitude range is inverted`);
    }

    if (diagnostic.estimatedGradientCount <= 0) {
      recordFailure(`${label} ${chart.chartId} did not emit any gradient estimates`);
    }
  }

  for (const estimate of gradientDiagnostics.sampleGradients) {
    const chart = chartById.get(estimate.chartId);

    if (!chart) {
      recordFailure(`${label} sample gradient ${estimate.sampleId} referenced unknown chart ${estimate.chartId}`);
      continue;
    }

    expectEqual(estimate.chartSemanticRole, chart.semanticRole, `${label} ${estimate.sampleId} chart role`);
    expectEqual(estimate.sourceFaceId, chart.sourceFaceId, `${label} ${estimate.sampleId} source face`);
    expectEqual(estimate.localChartPosition.length, 2, `${label} ${estimate.sampleId} local coord count`);
    expectFinite(estimate.intensityGradient[0], `${label} ${estimate.sampleId} du intensity gradient`);
    expectFinite(estimate.intensityGradient[1], `${label} ${estimate.sampleId} dv intensity gradient`);
    expectFiniteNonnegative(
      estimate.intensityGradientMagnitude,
      `${label} ${estimate.sampleId} intensity gradient magnitude`,
    );
    expectEqual(estimate.method, gradientDiagnostics.method, `${label} ${estimate.sampleId} method`);
    expectEqual(
      estimate.phaseGradientStatus.status,
      'omitted',
      `${label} ${estimate.sampleId} phase gradient status`,
    );
  }

  if (
    options.requireDeterminedCharts &&
    gradientDiagnostics.chartDiagnostics.some((diagnostic) => diagnostic.underdetermined)
  ) {
    recordFailure(`${label} unexpectedly reported underdetermined default chart gradients`);
  }

  if (
    options.requireUnderdeterminedChart &&
    !gradientDiagnostics.chartDiagnostics.some((diagnostic) => diagnostic.underdetermined)
  ) {
    recordFailure(`${label} did not report any underdetermined chart gradients`);
  }
}

function assertComputationalGradientRolesStayNonSemantic(atlas, gradientDiagnostics, label) {
  const computationalChartIds = new Set(
    atlas.domain.surfaceCharts
      .filter((chart) => chart.kind === 'computational-triangle-chart')
      .map((chart) => chart.chartId),
  );

  for (const diagnostic of gradientDiagnostics.chartDiagnostics) {
    if (computationalChartIds.has(diagnostic.chartId)) {
      expectEqual(
        diagnostic.chartSemanticRole,
        'computational-only',
        `${label} computational gradient diagnostic ${diagnostic.chartId} role`,
      );
    }
  }

  for (const estimate of gradientDiagnostics.sampleGradients) {
    if (computationalChartIds.has(estimate.chartId)) {
      expectEqual(
        estimate.chartSemanticRole,
        'computational-only',
        `${label} computational sample gradient ${estimate.sampleId} role`,
      );
    }
  }
}

function assertPhaseDiagnostics(atlas, phaseDiagnostics, label, options = {}) {
  expectEqual(
    phaseDiagnostics.method,
    'chart-local-nearest-phase-unwrap-plane-v1',
    `${label} phase method`,
  );
  expectEqual(phaseDiagnostics.scope, 'chart-local-only', `${label} phase scope`);
  expectEqual(
    phaseDiagnostics.globalContinuity,
    'none',
    `${label} global phase continuity claim`,
  );
  expectEqual(
    phaseDiagnostics.chartDiagnostics.length,
    atlas.domain.surfaceCharts.length,
    `${label} chart diagnostic count`,
  );

  const chartDiagnostics = buildChartPhaseDiagnostics(atlas);
  const samplePhaseGradientEstimates = estimateChartPhaseGradients(atlas);
  const samplePhaseUnwraps = unwrapChartSamplePhases(atlas);

  expectEqual(
    chartDiagnostics.length,
    phaseDiagnostics.chartDiagnostics.length,
    `${label} chart phase diagnostics helper count`,
  );
  expectEqual(
    samplePhaseGradientEstimates.length,
    phaseDiagnostics.samplePhaseGradients.length,
    `${label} sample phase gradient helper count`,
  );
  expectEqual(
    samplePhaseUnwraps.length,
    phaseDiagnostics.sampleUnwraps.length,
    `${label} sample phase unwrap helper count`,
  );

  const chartById = new Map(atlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart]));
  const chartSummaryById = new Map(atlas.chartSummaries.map((summary) => [summary.chartId, summary]));
  const diagnosticByChartId = new Map(
    phaseDiagnostics.chartDiagnostics.map((diagnostic) => [diagnostic.chartId, diagnostic]),
  );
  const estimatedGradientTotal = phaseDiagnostics.chartDiagnostics.reduce(
    (sum, diagnostic) => sum + diagnostic.estimatedGradientCount,
    0,
  );
  const unwrappedSampleTotal = phaseDiagnostics.chartDiagnostics.reduce(
    (sum, diagnostic) => sum + diagnostic.unwrappedSampleCount,
    0,
  );

  expectEqual(
    estimatedGradientTotal,
    phaseDiagnostics.samplePhaseGradients.length,
    `${label} estimated phase gradient count total`,
  );
  expectEqual(
    unwrappedSampleTotal,
    phaseDiagnostics.sampleUnwraps.length,
    `${label} unwrapped sample count total`,
  );

  for (const chart of atlas.domain.surfaceCharts) {
    const chartSummary = chartSummaryById.get(chart.chartId);
    const diagnostic = diagnosticByChartId.get(chart.chartId);
    const chartSampleCount = atlas.samples.filter((sample) => sample.chartId === chart.chartId).length;

    if (!chartSummary) {
      recordFailure(`${label} chart ${chart.chartId} had no sampled atlas chart summary`);
    } else {
      expectEqual(chartSummary.chartId, chart.chartId, `${label} chart summary id`);
      expectEqual(
        chartSummary.chartSemanticRole,
        chart.semanticRole,
        `${label} chart summary semantic role`,
      );
      expectEqual(
        chartSummary.sourceFaceId,
        chart.sourceFaceId,
        `${label} chart summary source face provenance`,
      );
    }

    if (!diagnostic) {
      recordFailure(`${label} chart ${chart.chartId} had no phase diagnostic`);
      continue;
    }

    expectEqual(diagnostic.chartId, chart.chartId, `${label} phase chart id`);
    expectEqual(
      diagnostic.chartSemanticRole,
      chart.semanticRole,
      `${label} phase chart semantic role`,
    );
    expectEqual(
      diagnostic.sourceFaceId,
      chart.sourceFaceId,
      `${label} phase source face provenance`,
    );
    expectEqual(diagnostic.sampleCount, chartSampleCount, `${label} phase sample count`);
    expectEqual(diagnostic.method, phaseDiagnostics.method, `${label} phase diagnostic method`);
    expectEqual(diagnostic.scope, 'chart-local-only', `${label} phase diagnostic scope`);
    expectEqual(
      diagnostic.globalContinuity,
      'none',
      `${label} phase diagnostic global continuity claim`,
    );

    if (diagnostic.underdetermined) {
      if (!diagnostic.underdeterminedReason) {
        recordFailure(`${label} underdetermined chart ${chart.chartId} did not explain why`);
      }

      expectEqual(
        diagnostic.estimatedGradientCount,
        0,
        `${label} underdetermined chart ${chart.chartId} estimated phase gradient count`,
      );
      continue;
    }

    expectEqual(
      diagnostic.unwrappedSampleCount,
      chartSampleCount,
      `${label} ${chart.chartId} unwrapped sample count`,
    );
    expectFiniteNonnegative(
      diagnostic.minPhaseGradientMagnitude,
      `${label} ${chart.chartId} min phase gradient magnitude`,
    );
    expectFiniteNonnegative(
      diagnostic.maxPhaseGradientMagnitude,
      `${label} ${chart.chartId} max phase gradient magnitude`,
    );
    expectFiniteNonnegative(
      diagnostic.averagePhaseGradientMagnitude,
      `${label} ${chart.chartId} average phase gradient magnitude`,
    );

    if (diagnostic.minPhaseGradientMagnitude > diagnostic.maxPhaseGradientMagnitude) {
      recordFailure(`${label} ${chart.chartId} phase gradient magnitude range is inverted`);
    }

    if (diagnostic.estimatedGradientCount <= 0) {
      recordFailure(`${label} ${chart.chartId} did not emit any phase gradient estimates`);
    }
  }

  for (const unwrap of phaseDiagnostics.sampleUnwraps) {
    const chart = chartById.get(unwrap.chartId);

    if (!chart) {
      recordFailure(`${label} phase unwrap ${unwrap.sampleId} referenced unknown chart ${unwrap.chartId}`);
      continue;
    }

    expectEqual(unwrap.chartSemanticRole, chart.semanticRole, `${label} ${unwrap.sampleId} chart role`);
    expectEqual(unwrap.sourceFaceId, chart.sourceFaceId, `${label} ${unwrap.sampleId} source face`);
    expectEqual(unwrap.localChartPosition.length, 2, `${label} ${unwrap.sampleId} local coord count`);
    expectFinite(unwrap.wrappedPhase, `${label} ${unwrap.sampleId} wrapped phase`);
    expectFinite(unwrap.unwrappedPhase, `${label} ${unwrap.sampleId} unwrapped phase`);
    expectFinite(unwrap.phaseShiftTurns, `${label} ${unwrap.sampleId} phase shift turns`);
    expectEqual(unwrap.method, phaseDiagnostics.method, `${label} ${unwrap.sampleId} method`);
    expectEqual(unwrap.scope, 'chart-local-only', `${label} ${unwrap.sampleId} scope`);
    expectEqual(unwrap.globalContinuity, 'none', `${label} ${unwrap.sampleId} global continuity`);

    if (unwrap.wrappedPhase < -Math.PI - 1e-9 || unwrap.wrappedPhase > Math.PI + 1e-9) {
      recordFailure(`${label} ${unwrap.sampleId} wrapped phase left [-pi, pi]`);
    }
  }

  for (const estimate of phaseDiagnostics.samplePhaseGradients) {
    const chart = chartById.get(estimate.chartId);

    if (!chart) {
      recordFailure(
        `${label} sample phase gradient ${estimate.sampleId} referenced unknown chart ${estimate.chartId}`,
      );
      continue;
    }

    expectEqual(estimate.chartSemanticRole, chart.semanticRole, `${label} ${estimate.sampleId} chart role`);
    expectEqual(estimate.sourceFaceId, chart.sourceFaceId, `${label} ${estimate.sampleId} source face`);
    expectEqual(estimate.localChartPosition.length, 2, `${label} ${estimate.sampleId} local coord count`);
    expectFinite(estimate.wrappedPhase, `${label} ${estimate.sampleId} wrapped phase`);
    expectFinite(estimate.unwrappedPhase, `${label} ${estimate.sampleId} unwrapped phase`);
    expectFinite(estimate.phaseGradient[0], `${label} ${estimate.sampleId} du phase gradient`);
    expectFinite(estimate.phaseGradient[1], `${label} ${estimate.sampleId} dv phase gradient`);
    expectFiniteNonnegative(
      estimate.phaseGradientMagnitude,
      `${label} ${estimate.sampleId} phase gradient magnitude`,
    );
    expectEqual(estimate.method, phaseDiagnostics.method, `${label} ${estimate.sampleId} method`);
    expectEqual(estimate.scope, 'chart-local-only', `${label} ${estimate.sampleId} scope`);
    expectEqual(estimate.globalContinuity, 'none', `${label} ${estimate.sampleId} global continuity`);
  }

  if (
    options.requireDeterminedCharts &&
    phaseDiagnostics.chartDiagnostics.some((diagnostic) => diagnostic.underdetermined)
  ) {
    recordFailure(`${label} unexpectedly reported underdetermined default chart phase gradients`);
  }

  if (
    options.requireUnderdeterminedChart &&
    !phaseDiagnostics.chartDiagnostics.some((diagnostic) => diagnostic.underdetermined)
  ) {
    recordFailure(`${label} did not report any underdetermined chart phase gradients`);
  }
}

function assertComputationalPhaseRolesStayNonSemantic(atlas, phaseDiagnostics, label) {
  const computationalChartIds = new Set(
    atlas.domain.surfaceCharts
      .filter((chart) => chart.kind === 'computational-triangle-chart')
      .map((chart) => chart.chartId),
  );

  for (const diagnostic of phaseDiagnostics.chartDiagnostics) {
    if (computationalChartIds.has(diagnostic.chartId)) {
      expectEqual(
        diagnostic.chartSemanticRole,
        'computational-only',
        `${label} computational phase diagnostic ${diagnostic.chartId} role`,
      );
    }
  }

  for (const unwrap of phaseDiagnostics.sampleUnwraps) {
    if (computationalChartIds.has(unwrap.chartId)) {
      expectEqual(
        unwrap.chartSemanticRole,
        'computational-only',
        `${label} computational phase unwrap ${unwrap.sampleId} role`,
      );
    }
  }

  for (const estimate of phaseDiagnostics.samplePhaseGradients) {
    if (computationalChartIds.has(estimate.chartId)) {
      expectEqual(
        estimate.chartSemanticRole,
        'computational-only',
        `${label} computational sample phase gradient ${estimate.sampleId} role`,
      );
    }
  }
}

function assertSurfaceSampleProvenance(atlas, label) {
  const chartById = new Map(atlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart]));

  for (const samplePoint of atlas.samplePoints) {
    const chart = chartById.get(samplePoint.chartId);

    if (!chart) {
      recordFailure(`${label} sample point ${samplePoint.id} references unknown chart ${samplePoint.chartId}`);
      continue;
    }

    expectEqual(
      samplePoint.chartSemanticRole,
      chart.semanticRole,
      `${label} sample point ${samplePoint.id} chart semantic role`,
    );
    expectEqual(
      samplePoint.sourceFaceId,
      chart.sourceFaceId,
      `${label} sample point ${samplePoint.id} source face provenance`,
    );
    expectEqual(
      samplePoint.barycentric.length,
      3,
      `${label} sample point ${samplePoint.id} barycentric coordinate count`,
    );
    expectEqual(
      samplePoint.localChartPosition.length,
      2,
      `${label} sample point ${samplePoint.id} local chart coordinate count`,
    );

    for (const coordinate of samplePoint.barycentric) {
      expectFiniteNonnegative(coordinate, `${label} ${samplePoint.id} barycentric coordinate`);
    }

    expectApprox(
      samplePoint.barycentric.reduce((sum, coordinate) => sum + coordinate, 0),
      1,
      1e-9,
      `${label} ${samplePoint.id} barycentric coordinates should sum to 1`,
    );
  }

  for (const sample of atlas.samples) {
    const chart = chartById.get(sample.chartId);

    if (!chart) {
      recordFailure(`${label} sample ${sample.id} references unknown chart ${sample.chartId}`);
      continue;
    }

    expectEqual(sample.chartSemanticRole, chart.semanticRole, `${label} ${sample.id} chart role`);
    expectEqual(sample.sourceFaceId, chart.sourceFaceId, `${label} ${sample.id} source face`);
    expectEqual(sample.barycentric.length, 3, `${label} ${sample.id} barycentric count`);
    expectEqual(sample.localChartPosition.length, 2, `${label} ${sample.id} local coordinate count`);
  }
}

function assertComputationalChartsStayNonSemantic(atlas, label) {
  const computationalChartIds = new Set(
    atlas.domain.surfaceCharts
      .filter((chart) => chart.kind === 'computational-triangle-chart')
      .map((chart) => chart.chartId),
  );

  for (const chart of atlas.domain.surfaceCharts) {
    if (chart.kind === 'computational-triangle-chart') {
      expectEqual(
        chart.semanticRole,
        'computational-only',
        `${label} computational chart ${chart.chartId} semantic role`,
      );
    }
  }

  for (const samplePoint of atlas.samplePoints) {
    if (computationalChartIds.has(samplePoint.chartId)) {
      expectEqual(
        samplePoint.chartSemanticRole,
        'computational-only',
        `${label} computational sample point ${samplePoint.id} role`,
      );
    }
  }

  for (const sample of atlas.samples) {
    if (computationalChartIds.has(sample.chartId)) {
      expectEqual(
        sample.chartSemanticRole,
        'computational-only',
        `${label} computational sample ${sample.id} role`,
      );
    }
  }

  for (const summary of atlas.chartSummaries) {
    if (computationalChartIds.has(summary.chartId)) {
      expectEqual(
        summary.chartSemanticRole,
        'computational-only',
        `${label} computational summary ${summary.chartId} role`,
      );
    }

    if (!summary.allContributionRatiosValid) {
      recordFailure(`${label} chart summary ${summary.chartId} reported invalid contribution ratios`);
    }

    expectFiniteNonnegative(summary.minIntensity, `${label} ${summary.chartId} min intensity`);
    expectFiniteNonnegative(summary.maxIntensity, `${label} ${summary.chartId} max intensity`);
    expectFinite(summary.minPhase, `${label} ${summary.chartId} min phase`);
    expectFinite(summary.maxPhase, `${label} ${summary.chartId} max phase`);
  }
}

function assertComputationalSupportsAreNotSources(atlas, label) {
  const computationalSupports = atlas.domain.surfaceCharts
    .filter((chart) => chart.kind === 'computational-triangle-chart')
    .map((chart) => chart.computationalSupport.position);

  for (const supportPosition of computationalSupports) {
    if (atlas.sources.some((source) => sameVec3(source.position, supportPosition))) {
      recordFailure(`${label} computational chart support became a field source`);
    }
  }

  for (const source of atlas.sources) {
    if (!atlas.domain.vertexIds.includes(source.vertexId)) {
      recordFailure(`${label} source ${source.vertexId} is not a domain boundary vertex`);
    }
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

function formatOptionalDetails(details) {
  return details?.length ? ` (${details.join(' ')})` : '';
}

function countUnderdeterminedGradientCharts(gradientDiagnostics) {
  return gradientDiagnostics.chartDiagnostics.filter((diagnostic) => diagnostic.underdetermined)
    .length;
}

function countUnderdeterminedPhaseCharts(phaseDiagnostics) {
  return phaseDiagnostics.chartDiagnostics.filter((diagnostic) => diagnostic.underdetermined).length;
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
