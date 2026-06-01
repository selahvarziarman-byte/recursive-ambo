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
const {
  buildChartSampleGraph,
  buildSurfaceSampleGraph,
  summarizeSurfaceSampleGraph,
} = require(path.join(repoRoot, 'src/lib/fieldAtlasSampleGraph.ts'));
const {
  buildIntensityCandidateDiagnostics,
  findChartLocalIntensityExtrema,
  findChartLocalNearNodeCandidates,
} = require(path.join(repoRoot, 'src/lib/fieldAtlasIntensityCandidates.ts'));
const {
  buildFieldFeatureReport,
  buildFieldFeatureReportFromAtlas,
  summarizeFieldFeatureReport,
} = require(path.join(repoRoot, 'src/lib/fieldAtlasFeatureReport.ts'));

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
runClosedShapeSurfaceSampleGraphDiagnostic();
runClosedShapeSurfaceIntensityCandidateDiagnostic();
runFieldFeatureReportDiagnostic();
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

function runClosedShapeSurfaceSampleGraphDiagnostic() {
  console.log(
    'sample graph policy: chart-local-barycentric-lattice-v1; scope=chart-local-only; global surface continuity=none',
  );
  runSeedClosedShapeSurfaceSampleGraphDiagnostic('tetrahedron');
  runSeedClosedShapeSurfaceSampleGraphDiagnostic('cube');
  runAmboClosedShapeSurfaceSampleGraphDiagnostic();
  runBoundedClosedShapeSurfaceSampleGraphDiagnostic();
}

function runClosedShapeSurfaceIntensityCandidateDiagnostic() {
  console.log(
    'intensity candidate policy: chart-local-sample-graph-intensity-candidates-v1; scope=chart-local-only; global surface continuity=none; status=candidate-only',
  );
  runSeedClosedShapeSurfaceIntensityCandidateDiagnostic('tetrahedron');
  runSeedClosedShapeSurfaceIntensityCandidateDiagnostic('cube');
  runAmboClosedShapeSurfaceIntensityCandidateDiagnostic();
  runBoundedClosedShapeSurfaceIntensityCandidateDiagnostic();
  runCalibratedClosedShapeSurfaceNearNodeDiagnostic();
}

function runFieldFeatureReportDiagnostic() {
  console.log(
    'field feature report policy: field-feature-report-v0; scope=chart-local-only; global surface continuity=none; semantic=not-semantic-naming; status=report-candidate',
  );
  runSeedFieldFeatureReportDiagnostic('tetrahedron');
  runSeedFieldFeatureReportDiagnostic('cube');
  runAmboFieldFeatureReportDiagnostic();
  runBoundedFieldFeatureReportDiagnostic();
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

function runSeedClosedShapeSurfaceSampleGraphDiagnostic(seedKey) {
  const shape = createSeedShape(seedKey);
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape);
  const graph = buildSurfaceSampleGraph(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, `${seedKey} sample graph sampled closed-shape surface`);
  assertSurfaceSampleGraph(atlas, graph, `${seedKey} surface sample graph`, {
    requireNoUnderconnectedCharts: true,
  });

  if (seedKey === 'cube') {
    assertComputationalSampleGraphRolesStayNonSemantic(atlas, graph, 'cube surface sample graph');
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure(`${seedKey} surface sample graph diagnostic mutated the shape`);
  }

  console.log(
    `surface sample graph ${seedKey}: charts=${graph.summary.chartCount} nodes=${graph.summary.totalNodeCount} edges=${graph.summary.totalEdgeCount} isolated=${graph.summary.isolatedNodeCount} strategy=${graph.adjacencyStrategy} scope=${graph.scope} global=${graph.globalSurfaceContinuity}`,
  );
}

function runAmboClosedShapeSurfaceSampleGraphDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for generated surface sample graph diagnostic');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);
  const boundaryClassification = classifyClosedShapeSurfaceBoundary(amboShape);

  if (boundaryClassification.status === 'unsupported') {
    console.log(
      `surface sample graph Ambo generated surface: unsupported - ${boundaryClassification.reason}${formatOptionalDetails(
        boundaryClassification.details,
      )}`,
    );

    if (JSON.stringify(amboShape) !== before) {
      recordFailure('generated surface sample graph diagnostic mutated the Ambo shape');
    }

    return;
  }

  const atlas = sampleClosedShapeSurfaceAtlas(amboShape);
  const graph = buildSurfaceSampleGraph(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'generated surface sample graph sampled atlas');
  assertSurfaceSampleGraph(atlas, graph, 'generated surface sample graph', {
    requireNoUnderconnectedCharts: true,
  });
  assertComputationalSampleGraphRolesStayNonSemantic(atlas, graph, 'generated surface sample graph');

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('generated surface sample graph diagnostic mutated the Ambo shape');
  }

  console.log(
    `surface sample graph Ambo generated surface: charts=${graph.summary.chartCount} nodes=${graph.summary.totalNodeCount} edges=${graph.summary.totalEdgeCount} isolated=${graph.summary.isolatedNodeCount} strategy=${graph.adjacencyStrategy} scope=${graph.scope} global=${graph.globalSurfaceContinuity}`,
  );
}

function runBoundedClosedShapeSurfaceSampleGraphDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape, { subdivisions: 8, maxSamples: 17 });
  const graph = buildSurfaceSampleGraph(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'bounded surface sample graph sampled atlas');
  assertSurfaceSampleGraph(atlas, graph, 'bounded surface sample graph', {
    requireUnderconnectedChart: true,
  });

  if (graph.summary.totalNodeCount > atlas.options.maxSamples) {
    recordFailure(
      `bounded surface sample graph produced ${graph.summary.totalNodeCount} nodes over cap ${atlas.options.maxSamples}`,
    );
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure('bounded surface sample graph diagnostic mutated the cube shape');
  }

  console.log(
    `surface sample graph bounded cap: nodes=${graph.summary.totalNodeCount}/${atlas.options.maxSamples} edges=${graph.summary.totalEdgeCount} underconnectedCharts=${graph.summary.underconnectedChartCount}`,
  );
}

function runSeedClosedShapeSurfaceIntensityCandidateDiagnostic(seedKey) {
  const shape = createSeedShape(seedKey);
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape, { subdivisions: 4 });
  const candidateDiagnostics = buildIntensityCandidateDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, `${seedKey} intensity candidate sampled atlas`);
  assertIntensityCandidateDiagnostics(
    atlas,
    candidateDiagnostics,
    `${seedKey} surface intensity candidates`,
    {
      requireExtremaCandidates: true,
    },
  );

  if (seedKey === 'cube') {
    assertComputationalIntensityCandidateRolesStayNonSemantic(
      atlas,
      candidateDiagnostics,
      'cube surface intensity candidates',
    );
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure(`${seedKey} surface intensity candidate diagnostic mutated the shape`);
  }

  console.log(
    `surface intensity candidates ${seedKey}: charts=${candidateDiagnostics.chartDiagnostics.length} extrema=${candidateDiagnostics.extremaCandidates.length} nearNodes=${candidateDiagnostics.nearNodeCandidates.length} scope=${candidateDiagnostics.scope} global=${candidateDiagnostics.globalSurfaceContinuity}`,
  );
}

function runAmboClosedShapeSurfaceIntensityCandidateDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for generated intensity candidate diagnostic');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);
  const boundaryClassification = classifyClosedShapeSurfaceBoundary(amboShape);

  if (boundaryClassification.status === 'unsupported') {
    console.log(
      `surface intensity candidates Ambo generated surface: unsupported - ${boundaryClassification.reason}${formatOptionalDetails(
        boundaryClassification.details,
      )}`,
    );

    if (JSON.stringify(amboShape) !== before) {
      recordFailure('generated intensity candidate diagnostic mutated the Ambo shape');
    }

    return;
  }

  const atlas = sampleClosedShapeSurfaceAtlas(amboShape);
  const candidateDiagnostics = buildIntensityCandidateDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'generated intensity candidate sampled atlas');
  assertIntensityCandidateDiagnostics(
    atlas,
    candidateDiagnostics,
    'generated surface intensity candidates',
    {
      requireExtremaCandidates: true,
    },
  );
  assertComputationalIntensityCandidateRolesStayNonSemantic(
    atlas,
    candidateDiagnostics,
    'generated surface intensity candidates',
  );

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('generated intensity candidate diagnostic mutated the Ambo shape');
  }

  console.log(
    `surface intensity candidates Ambo generated surface: charts=${candidateDiagnostics.chartDiagnostics.length} extrema=${candidateDiagnostics.extremaCandidates.length} nearNodes=${candidateDiagnostics.nearNodeCandidates.length} scope=${candidateDiagnostics.scope} global=${candidateDiagnostics.globalSurfaceContinuity}`,
  );
}

function runBoundedClosedShapeSurfaceIntensityCandidateDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape, { subdivisions: 8, maxSamples: 17 });
  const candidateDiagnostics = buildIntensityCandidateDiagnostics(atlas);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'bounded intensity candidate sampled atlas');
  assertIntensityCandidateDiagnostics(
    atlas,
    candidateDiagnostics,
    'bounded surface intensity candidates',
    {
      requireUnderconnectedChart: true,
    },
  );

  if (candidateDiagnostics.sampleGraph.summary.totalNodeCount > atlas.options.maxSamples) {
    recordFailure(
      `bounded intensity candidates graph produced ${candidateDiagnostics.sampleGraph.summary.totalNodeCount} nodes over cap ${atlas.options.maxSamples}`,
    );
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure('bounded surface intensity candidate diagnostic mutated the cube shape');
  }

  console.log(
    `surface intensity candidates bounded cap: samples=${atlas.samples.length}/${atlas.options.maxSamples} extrema=${candidateDiagnostics.extremaCandidates.length} nearNodes=${candidateDiagnostics.nearNodeCandidates.length} underconnectedCharts=${candidateDiagnostics.sampleGraph.summary.underconnectedChartCount}`,
  );
}

function runCalibratedClosedShapeSurfaceNearNodeDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const candidateOptions = {
    nearNodeRelativeIntensityMax: 1,
    minEffectiveSourceCount: 1,
  };
  const atlas = sampleClosedShapeSurfaceAtlas(shape, { subdivisions: 4 });
  const candidateDiagnostics = buildIntensityCandidateDiagnostics(atlas, candidateOptions);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'calibrated near-node sampled atlas');
  assertIntensityCandidateDiagnostics(
    atlas,
    candidateDiagnostics,
    'calibrated surface near-node candidates',
    {
      candidateOptions,
      requireExtremaCandidates: true,
      requireNearNodeCandidate: true,
    },
  );
  assertComputationalIntensityCandidateRolesStayNonSemantic(
    atlas,
    candidateDiagnostics,
    'calibrated surface near-node candidates',
  );

  if (JSON.stringify(shape) !== before) {
    recordFailure('calibrated near-node diagnostic mutated the cube shape');
  }

  console.log(
    `surface near-node calibrated: extrema=${candidateDiagnostics.extremaCandidates.length} nearNodes=${candidateDiagnostics.nearNodeCandidates.length} maxRelative=${candidateDiagnostics.options.nearNodeRelativeIntensityMax} minEffectiveSources=${candidateDiagnostics.options.minEffectiveSourceCount}`,
  );
}

function runSeedFieldFeatureReportDiagnostic(seedKey) {
  const shape = createSeedShape(seedKey);
  const before = JSON.stringify(shape);
  const atlas = sampleClosedShapeSurfaceAtlas(shape, { subdivisions: 4 });
  const report = buildFieldFeatureReportFromAtlas(atlas, { sampling: { subdivisions: 4 } });
  const reportFromShape = buildFieldFeatureReport(shape, { sampling: { subdivisions: 4 } });

  assertSampledClosedShapeSurfaceAtlas(atlas, `${seedKey} field feature report sampled atlas`);
  assertFieldFeatureReport(atlas, report, `${seedKey} field feature report`);
  assertSupportedFieldFeatureReport(reportFromShape, `${seedKey} field feature report from shape`);

  if (seedKey === 'cube') {
    assertComputationalFieldFeatureReportObservationsStayNonSemantic(
      atlas,
      report,
      'cube field feature report',
    );
  }

  if (JSON.stringify(shape) !== before) {
    recordFailure(`${seedKey} field feature report diagnostic mutated the shape`);
  }

  console.log(`field feature report ${seedKey}: ${summarizeFieldFeatureReport(report)}`);
}

function runAmboFieldFeatureReportDiagnostic() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable for generated field feature report diagnostic');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const before = JSON.stringify(amboShape);
  const boundaryClassification = classifyClosedShapeSurfaceBoundary(amboShape);

  if (boundaryClassification.status === 'unsupported') {
    console.log(
      `field feature report Ambo generated surface: unsupported - ${boundaryClassification.reason}${formatOptionalDetails(
        boundaryClassification.details,
      )}`,
    );

    if (JSON.stringify(amboShape) !== before) {
      recordFailure('generated field feature report diagnostic mutated the Ambo shape');
    }

    return;
  }

  const atlas = sampleClosedShapeSurfaceAtlas(amboShape);
  const report = buildFieldFeatureReportFromAtlas(atlas);
  const reportFromShape = buildFieldFeatureReport(amboShape);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'generated field feature report sampled atlas');
  assertFieldFeatureReport(atlas, report, 'generated field feature report');
  assertSupportedFieldFeatureReport(reportFromShape, 'generated field feature report from shape');
  assertComputationalFieldFeatureReportObservationsStayNonSemantic(
    atlas,
    report,
    'generated field feature report',
  );

  if (report.sourceSummary.amboMidpointSources === 0) {
    recordFailure('generated field feature report did not include Ambo midpoint sources');
  }

  if (JSON.stringify(amboShape) !== before) {
    recordFailure('generated field feature report diagnostic mutated the Ambo shape');
  }

  console.log(
    `field feature report Ambo generated surface: ${summarizeFieldFeatureReport(report)}`,
  );
}

function runBoundedFieldFeatureReportDiagnostic() {
  const shape = createSeedShape('cube');
  const before = JSON.stringify(shape);
  const options = {
    sampling: { subdivisions: 4 },
    intensityCandidates: {
      nearNodeRelativeIntensityMax: 1,
      minEffectiveSourceCount: 1,
    },
    maxCancellationLike: 2,
    maxHighIntensityAnchors: 2,
    maxAmbiguous: 2,
    highIntensityRelativeMin: 0.75,
  };
  const atlas = sampleClosedShapeSurfaceAtlas(shape, options.sampling);
  const report = buildFieldFeatureReportFromAtlas(atlas, options);

  assertSampledClosedShapeSurfaceAtlas(atlas, 'bounded field feature report sampled atlas');
  assertFieldFeatureReport(atlas, report, 'bounded field feature report', {
    requireCancellationLikeObservation: true,
    requireHighIntensityAnchorObservation: true,
    requireAmbiguousObservation: true,
  });
  assertComputationalFieldFeatureReportObservationsStayNonSemantic(
    atlas,
    report,
    'bounded field feature report',
  );

  if (JSON.stringify(shape) !== before) {
    recordFailure('bounded field feature report diagnostic mutated the cube shape');
  }

  console.log(
    `field feature report bounded: observations=${report.observationSummary.totalObservations} cancellation=${report.observationSummary.cancellationLikeCount}/${report.options.maxCancellationLike} high=${report.observationSummary.highIntensityAnchorCount}/${report.options.maxHighIntensityAnchors} ambiguous=${report.observationSummary.ambiguousCount}/${report.options.maxAmbiguous}`,
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

function expectFiniteVec3(value, label) {
  if (
    !Array.isArray(value) ||
    value.length !== 3 ||
    value.some((coordinate) => !Number.isFinite(coordinate))
  ) {
    recordFailure(`${label} should be a finite Vec3, got ${JSON.stringify(value)}`);
  }
}

function countDiagnosticSourceKinds(sources) {
  return sources.reduce(
    (counts, source) => ({
      ...counts,
      [source.sourceKind]: counts[source.sourceKind] + 1,
    }),
    {
      seed: 0,
      preserved: 0,
      'generated-child': 0,
      'ambo-midpoint-child': 0,
    },
  );
}

function getDiagnosticIntensityRange(values) {
  const finiteValues = values.filter(Number.isFinite);

  if (!finiteValues.length) {
    return { min: 0, max: 0 };
  }

  return finiteValues.reduce(
    (range, value) => ({
      min: Math.min(range.min, value),
      max: Math.max(range.max, value),
    }),
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
  );
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

function assertSurfaceSampleGraph(atlas, graph, label, options = {}) {
  expectEqual(graph.scope, 'chart-local-only', `${label} graph scope`);
  expectEqual(
    graph.globalSurfaceContinuity,
    'none',
    `${label} graph global surface continuity claim`,
  );
  expectEqual(
    graph.summary.scope,
    'chart-local-only',
    `${label} graph summary scope`,
  );
  expectEqual(
    graph.summary.globalSurfaceContinuity,
    'none',
    `${label} graph summary global surface continuity claim`,
  );
  expectEqual(
    graph.summary.chartCount,
    atlas.domain.surfaceCharts.length,
    `${label} graph chart count`,
  );
  expectEqual(graph.nodes.length, atlas.samples.length, `${label} graph node count`);
  expectEqual(
    graph.summary.totalNodeCount,
    graph.nodes.length,
    `${label} summary node count`,
  );
  expectEqual(
    graph.summary.totalEdgeCount,
    graph.edges.length,
    `${label} summary edge count`,
  );
  expectEqual(
    graph.summary.chartSummaries.length,
    atlas.domain.surfaceCharts.length,
    `${label} chart summary count`,
  );

  if (graph.nodes.length > atlas.options.maxSamples) {
    recordFailure(
      `${label} graph node count ${graph.nodes.length} exceeded sample cap ${atlas.options.maxSamples}`,
    );
  }

  const summary = summarizeSurfaceSampleGraph(atlas);
  expectEqual(summary.totalNodeCount, graph.summary.totalNodeCount, `${label} helper node count`);
  expectEqual(summary.totalEdgeCount, graph.summary.totalEdgeCount, `${label} helper edge count`);
  expectEqual(
    summary.underconnectedChartCount,
    graph.summary.underconnectedChartCount,
    `${label} helper underconnected chart count`,
  );

  const chartById = new Map(atlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart]));
  const chartGraphById = new Map(graph.chartGraphs.map((chartGraph) => [chartGraph.chartId, chartGraph]));
  const graphSummaryByChartId = new Map(
    graph.summary.chartSummaries.map((chartSummary) => [chartSummary.chartId, chartSummary]),
  );
  const nodeById = new Map();
  const duplicateNodeIds = new Set();

  for (const node of graph.nodes) {
    if (nodeById.has(node.sampleId)) {
      duplicateNodeIds.add(node.sampleId);
    }

    nodeById.set(node.sampleId, node);
  }

  for (const duplicateNodeId of duplicateNodeIds) {
    recordFailure(`${label} graph duplicated node ${duplicateNodeId}`);
  }

  for (const chart of atlas.domain.surfaceCharts) {
    const chartGraph = chartGraphById.get(chart.chartId);
    const chartSummary = graphSummaryByChartId.get(chart.chartId);
    const helperChartGraph = buildChartSampleGraph(atlas, chart.chartId);

    if (!chartGraph) {
      recordFailure(`${label} missing chart graph ${chart.chartId}`);
      continue;
    }

    if (!chartSummary) {
      recordFailure(`${label} missing chart graph summary ${chart.chartId}`);
      continue;
    }

    expectEqual(chartGraph.chartSemanticRole, chart.semanticRole, `${label} ${chart.chartId} graph role`);
    expectEqual(chartGraph.sourceFaceId, chart.sourceFaceId, `${label} ${chart.chartId} graph source face`);
    expectEqual(chartGraph.scope, 'chart-local-only', `${label} ${chart.chartId} graph scope`);
    expectEqual(
      chartGraph.globalSurfaceContinuity,
      'none',
      `${label} ${chart.chartId} graph global continuity`,
    );
    expectEqual(
      chartGraph.adjacencyStrategy,
      'chart-local-barycentric-lattice-v1',
      `${label} ${chart.chartId} adjacency strategy`,
    );
    expectEqual(
      helperChartGraph.summary.nodeCount,
      chartGraph.summary.nodeCount,
      `${label} ${chart.chartId} chart helper node count`,
    );
    expectEqual(
      helperChartGraph.summary.edgeCount,
      chartGraph.summary.edgeCount,
      `${label} ${chart.chartId} chart helper edge count`,
    );
    expectEqual(chartSummary.chartSemanticRole, chart.semanticRole, `${label} ${chart.chartId} summary role`);
    expectEqual(chartSummary.sourceFaceId, chart.sourceFaceId, `${label} ${chart.chartId} summary source face`);
    expectEqual(
      chartSummary.nodeCount,
      chartGraph.nodes.length,
      `${label} ${chart.chartId} summary node count`,
    );
    expectEqual(
      chartSummary.edgeCount,
      chartGraph.edges.length,
      `${label} ${chart.chartId} summary edge count`,
    );
    expectEqual(
      chartSummary.adjacencyStrategy,
      'chart-local-barycentric-lattice-v1',
      `${label} ${chart.chartId} summary adjacency strategy`,
    );
  }

  for (const node of graph.nodes) {
    const chart = chartById.get(node.chartId);

    if (!chart) {
      recordFailure(`${label} graph node ${node.sampleId} referenced unknown chart ${node.chartId}`);
      continue;
    }

    expectEqual(node.chartSemanticRole, chart.semanticRole, `${label} ${node.sampleId} node chart role`);
    expectEqual(node.sourceFaceId, chart.sourceFaceId, `${label} ${node.sampleId} node source face`);
    expectEqual(node.localChartPosition.length, 2, `${label} ${node.sampleId} local coordinate count`);
    expectEqual(node.barycentric.length, 3, `${label} ${node.sampleId} barycentric count`);
    expectFiniteNonnegative(node.intensity, `${label} ${node.sampleId} node intensity`);
    expectFinite(node.phase, `${label} ${node.sampleId} node phase`);
    assertBarycentricLatticeMetadata(node, `${label} ${node.sampleId} graph node`);
  }

  const edgeIds = new Set();

  for (const edge of graph.edges) {
    if (edgeIds.has(edge.edgeId)) {
      recordFailure(`${label} graph duplicated edge ${edge.edgeId}`);
    }

    edgeIds.add(edge.edgeId);

    const firstNode = nodeById.get(edge.sampleIds[0]);
    const secondNode = nodeById.get(edge.sampleIds[1]);

    if (!firstNode || !secondNode) {
      recordFailure(`${label} graph edge ${edge.edgeId} referenced a missing sample node`);
      continue;
    }

    if (firstNode.sampleId === secondNode.sampleId) {
      recordFailure(`${label} graph edge ${edge.edgeId} connects a sample to itself`);
    }

    expectEqual(firstNode.chartId, secondNode.chartId, `${label} ${edge.edgeId} edge same-chart endpoints`);
    expectEqual(edge.chartId, firstNode.chartId, `${label} ${edge.edgeId} edge chart id`);
    expectEqual(
      edge.chartSemanticRole,
      firstNode.chartSemanticRole,
      `${label} ${edge.edgeId} edge chart role`,
    );
    expectEqual(
      edge.sourceFaceId,
      firstNode.sourceFaceId,
      `${label} ${edge.edgeId} edge source face`,
    );
    expectEqual(edge.edgeKind, 'chart-local-neighbor', `${label} ${edge.edgeId} edge kind`);
    expectFiniteNonnegative(edge.localDistance, `${label} ${edge.edgeId} local distance`);
  }

  if (options.requireNoUnderconnectedCharts && graph.summary.underconnectedChartCount !== 0) {
    recordFailure(
      `${label} unexpectedly reported ${graph.summary.underconnectedChartCount} underconnected chart(s)`,
    );
  }

  if (options.requireUnderconnectedChart && graph.summary.underconnectedChartCount === 0) {
    recordFailure(`${label} did not report an underconnected chart under bounded sampling`);
  }
}

function assertComputationalSampleGraphRolesStayNonSemantic(atlas, graph, label) {
  const computationalChartIds = new Set(
    atlas.domain.surfaceCharts
      .filter((chart) => chart.kind === 'computational-triangle-chart')
      .map((chart) => chart.chartId),
  );

  for (const chartGraph of graph.chartGraphs) {
    if (computationalChartIds.has(chartGraph.chartId)) {
      expectEqual(
        chartGraph.chartSemanticRole,
        'computational-only',
        `${label} computational chart graph ${chartGraph.chartId} role`,
      );
    }
  }

  for (const summary of graph.summary.chartSummaries) {
    if (computationalChartIds.has(summary.chartId)) {
      expectEqual(
        summary.chartSemanticRole,
        'computational-only',
        `${label} computational graph summary ${summary.chartId} role`,
      );
    }
  }

  for (const node of graph.nodes) {
    if (computationalChartIds.has(node.chartId)) {
      expectEqual(
        node.chartSemanticRole,
        'computational-only',
        `${label} computational graph node ${node.sampleId} role`,
      );
    }
  }

  for (const edge of graph.edges) {
    if (computationalChartIds.has(edge.chartId)) {
      expectEqual(
        edge.chartSemanticRole,
        'computational-only',
        `${label} computational graph edge ${edge.edgeId} role`,
      );
    }
  }
}

function assertIntensityCandidateDiagnostics(atlas, candidateDiagnostics, label, options = {}) {
  expectEqual(
    candidateDiagnostics.method,
    'chart-local-sample-graph-intensity-candidates-v1',
    `${label} candidate method`,
  );
  expectEqual(candidateDiagnostics.scope, 'chart-local-only', `${label} candidate scope`);
  expectEqual(
    candidateDiagnostics.globalSurfaceContinuity,
    'none',
    `${label} candidate global surface continuity claim`,
  );
  expectEqual(
    candidateDiagnostics.thresholdPolicy,
    'chart-local-relative-intensity-and-mixture-v1',
    `${label} near-node threshold policy`,
  );
  expectEqual(
    candidateDiagnostics.chartDiagnostics.length,
    atlas.domain.surfaceCharts.length,
    `${label} chart diagnostic count`,
  );
  expectEqual(
    candidateDiagnostics.sampleGraph.summary.totalNodeCount,
    atlas.samples.length,
    `${label} candidate sample graph node count`,
  );
  expectEqual(
    candidateDiagnostics.sampleGraph.scope,
    'chart-local-only',
    `${label} candidate sample graph scope`,
  );
  expectEqual(
    candidateDiagnostics.sampleGraph.globalSurfaceContinuity,
    'none',
    `${label} candidate sample graph global continuity claim`,
  );
  expectFiniteNonnegative(
    candidateDiagnostics.options.extremaTolerance,
    `${label} extrema tolerance`,
  );
  expectFiniteNonnegative(
    candidateDiagnostics.options.relativeIntensityEpsilon,
    `${label} relative intensity epsilon`,
  );
  expectFiniteNonnegative(
    candidateDiagnostics.options.nearNodeRelativeIntensityMax,
    `${label} near-node relative intensity max`,
  );
  expectFiniteNonnegative(
    candidateDiagnostics.options.minEffectiveSourceCount,
    `${label} min effective source count`,
  );

  const helperOptions = options.candidateOptions ?? {};
  const helperExtrema = findChartLocalIntensityExtrema(atlas, helperOptions);
  const helperNearNodes = findChartLocalNearNodeCandidates(atlas, helperOptions);

  expectEqual(
    helperExtrema.length,
    candidateDiagnostics.extremaCandidates.length,
    `${label} helper extrema count`,
  );
  expectEqual(
    helperNearNodes.length,
    candidateDiagnostics.nearNodeCandidates.length,
    `${label} helper near-node count`,
  );

  const chartById = new Map(atlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart]));
  const chartGraphById = new Map(
    candidateDiagnostics.sampleGraph.chartGraphs.map((chartGraph) => [chartGraph.chartId, chartGraph]),
  );
  const sampleById = new Map(atlas.samples.map((sample) => [sample.id, sample]));
  const nodeById = new Map(
    candidateDiagnostics.sampleGraph.nodes.map((node) => [node.sampleId, node]),
  );
  const neighborsBySampleId = buildDiagnosticNeighborsBySampleId(candidateDiagnostics.sampleGraph);
  const diagnosticByChartId = new Map(
    candidateDiagnostics.chartDiagnostics.map((diagnostic) => [diagnostic.chartId, diagnostic]),
  );
  const extremaById = new Map(
    candidateDiagnostics.extremaCandidates.map((candidate) => [candidate.candidateId, candidate]),
  );

  const extremaTotal = candidateDiagnostics.chartDiagnostics.reduce(
    (sum, diagnostic) => sum + diagnostic.intensityExtremumCandidateCount,
    0,
  );
  const nearNodeTotal = candidateDiagnostics.chartDiagnostics.reduce(
    (sum, diagnostic) => sum + diagnostic.nearNodeCandidateCount,
    0,
  );

  expectEqual(
    extremaTotal,
    candidateDiagnostics.extremaCandidates.length,
    `${label} chart extrema count total`,
  );
  expectEqual(
    nearNodeTotal,
    candidateDiagnostics.nearNodeCandidates.length,
    `${label} chart near-node count total`,
  );
  assertIntensityCandidateSummary(candidateDiagnostics, label);

  for (const chart of atlas.domain.surfaceCharts) {
    const diagnostic = diagnosticByChartId.get(chart.chartId);
    const chartGraph = chartGraphById.get(chart.chartId);

    if (!diagnostic) {
      recordFailure(`${label} chart ${chart.chartId} had no intensity candidate diagnostic`);
      continue;
    }

    if (!chartGraph) {
      recordFailure(`${label} chart ${chart.chartId} had no candidate sample graph`);
      continue;
    }

    expectEqual(diagnostic.chartSemanticRole, chart.semanticRole, `${label} ${chart.chartId} role`);
    expectEqual(diagnostic.sourceFaceId, chart.sourceFaceId, `${label} ${chart.chartId} source face`);
    expectEqual(diagnostic.sampleCount, chartGraph.nodes.length, `${label} ${chart.chartId} sample count`);
    expectEqual(diagnostic.neighborEdgeCount, chartGraph.edges.length, `${label} ${chart.chartId} edge count`);
    expectFiniteNonnegative(diagnostic.minIntensity, `${label} ${chart.chartId} min intensity`);
    expectFiniteNonnegative(diagnostic.maxIntensity, `${label} ${chart.chartId} max intensity`);
    expectFiniteNonnegative(
      diagnostic.intensityRange,
      `${label} ${chart.chartId} intensity range`,
    );
    expectFiniteNonnegative(
      diagnostic.nearNodeRelativeIntensityMax,
      `${label} ${chart.chartId} near-node relative intensity max`,
    );
    expectFiniteNonnegative(
      diagnostic.minEffectiveSourceCount,
      `${label} ${chart.chartId} min effective source count`,
    );
    expectEqual(diagnostic.method, candidateDiagnostics.method, `${label} ${chart.chartId} method`);
    expectEqual(diagnostic.scope, 'chart-local-only', `${label} ${chart.chartId} scope`);
    expectEqual(
      diagnostic.globalSurfaceContinuity,
      'none',
      `${label} ${chart.chartId} global continuity claim`,
    );

    if (diagnostic.minIntensity > diagnostic.maxIntensity) {
      recordFailure(`${label} ${chart.chartId} intensity range is inverted`);
    }

    if (diagnostic.underconnected && !diagnostic.underconnectedReason) {
      recordFailure(`${label} underconnected chart ${chart.chartId} did not explain why`);
    }
  }

  for (const candidate of candidateDiagnostics.extremaCandidates) {
    assertIntensityCandidateBase(
      atlas,
      candidate,
      sampleById,
      nodeById,
      neighborsBySampleId,
      chartById,
      candidateDiagnostics.options,
      label,
    );

    expectEqual(
      candidate.candidateKind,
      'chart-local-intensity-extremum-candidate',
      `${label} ${candidate.candidateId} kind`,
    );

    if (
      candidate.extremumKind !== 'local-minimum-candidate' &&
      candidate.extremumKind !== 'local-maximum-candidate'
    ) {
      recordFailure(`${label} ${candidate.candidateId} has unsupported extremum kind`);
    }

    if (candidate.comparison !== 'strict' && candidate.comparison !== 'plateau') {
      recordFailure(`${label} ${candidate.candidateId} has unsupported comparison`);
    }

    expectFinite(
      candidate.intensityMarginToNearestNeighbor,
      `${label} ${candidate.candidateId} margin`,
    );
    assertExtremumCandidateNeighborComparison(
      candidate,
      neighborsBySampleId,
      candidateDiagnostics.options.extremaTolerance,
      label,
    );
  }

  for (const candidate of candidateDiagnostics.nearNodeCandidates) {
    assertIntensityCandidateBase(
      atlas,
      candidate,
      sampleById,
      nodeById,
      neighborsBySampleId,
      chartById,
      candidateDiagnostics.options,
      label,
    );

    expectEqual(
      candidate.candidateKind,
      'chart-local-near-node-candidate',
      `${label} ${candidate.candidateId} kind`,
    );
    expectEqual(
      candidate.thresholdPolicy,
      'chart-local-relative-intensity-and-mixture-v1',
      `${label} ${candidate.candidateId} threshold policy`,
    );
    expectFiniteNonnegative(
      candidate.nearNodeRelativeIntensityMax,
      `${label} ${candidate.candidateId} near-node relative intensity max`,
    );
    expectFiniteNonnegative(
      candidate.minEffectiveSourceCount,
      `${label} ${candidate.candidateId} min effective source count`,
    );
    expectFiniteNonnegative(
      candidate.chartMinIntensity,
      `${label} ${candidate.candidateId} chart min intensity`,
    );
    expectFiniteNonnegative(
      candidate.chartMaxIntensity,
      `${label} ${candidate.candidateId} chart max intensity`,
    );

    if (!candidate.derivedFromExtremumCandidateId) {
      recordFailure(`${label} ${candidate.candidateId} did not reference a source extremum candidate`);
    }

    const sourceExtremum = extremaById.get(candidate.derivedFromExtremumCandidateId);

    if (!sourceExtremum) {
      recordFailure(
        `${label} ${candidate.candidateId} referenced unknown source extremum ${candidate.derivedFromExtremumCandidateId}`,
      );
    } else {
      expectEqual(
        sourceExtremum.extremumKind,
        'local-minimum-candidate',
        `${label} ${candidate.candidateId} source extremum should be a local minimum`,
      );
    }

    if (candidate.relativeIntensity > candidate.nearNodeRelativeIntensityMax + 1e-9) {
      recordFailure(
        `${label} ${candidate.candidateId} exceeded near-node relative intensity max ${candidate.nearNodeRelativeIntensityMax}`,
      );
    }

    if (candidate.effectiveSourceCount < candidate.minEffectiveSourceCount - 1e-9) {
      recordFailure(
        `${label} ${candidate.candidateId} did not satisfy min effective source count ${candidate.minEffectiveSourceCount}`,
      );
    }
  }

  if (options.requireExtremaCandidates && candidateDiagnostics.extremaCandidates.length === 0) {
    recordFailure(`${label} did not emit any chart-local intensity extrema candidates`);
  }

  if (options.requireNearNodeCandidate && candidateDiagnostics.nearNodeCandidates.length === 0) {
    recordFailure(`${label} did not emit any chart-local near-node candidates`);
  }

  if (
    options.requireUnderconnectedChart &&
    candidateDiagnostics.sampleGraph.summary.underconnectedChartCount === 0
  ) {
    recordFailure(`${label} did not report an underconnected chart under bounded sampling`);
  }
}

function assertIntensityCandidateSummary(candidateDiagnostics, label) {
  const summary = candidateDiagnostics.summary;
  const allCandidates = [
    ...candidateDiagnostics.extremaCandidates,
    ...candidateDiagnostics.nearNodeCandidates,
  ];
  const localMinimumCount = candidateDiagnostics.extremaCandidates.filter(
    (candidate) => candidate.extremumKind === 'local-minimum-candidate',
  ).length;
  const localMaximumCount = candidateDiagnostics.extremaCandidates.filter(
    (candidate) => candidate.extremumKind === 'local-maximum-candidate',
  ).length;
  const computationalOnlyCandidateCount = allCandidates.filter(
    (candidate) => candidate.chartSemanticRole === 'computational-only',
  ).length;

  if (!summary) {
    recordFailure(`${label} did not include a global intensity candidate summary`);
    return;
  }

  expectEqual(
    summary.chartCount,
    candidateDiagnostics.chartDiagnostics.length,
    `${label} summary chart count`,
  );
  expectEqual(
    summary.totalCandidateCount,
    allCandidates.length,
    `${label} summary total candidate count`,
  );
  expectEqual(
    summary.totalIntensityExtremumCandidateCount,
    candidateDiagnostics.extremaCandidates.length,
    `${label} summary extrema count`,
  );
  expectEqual(
    summary.totalLocalMinimumCandidateCount,
    localMinimumCount,
    `${label} summary local minimum count`,
  );
  expectEqual(
    summary.totalLocalMaximumCandidateCount,
    localMaximumCount,
    `${label} summary local maximum count`,
  );
  expectEqual(
    summary.totalNearNodeCandidateCount,
    candidateDiagnostics.nearNodeCandidates.length,
    `${label} summary near-node count`,
  );
  expectEqual(
    summary.computationalOnlyCandidateCount,
    computationalOnlyCandidateCount,
    `${label} summary computational-only candidate count`,
  );
  expectEqual(
    summary.underconnectedChartCount,
    candidateDiagnostics.sampleGraph.summary.underconnectedChartCount,
    `${label} summary underconnected chart count`,
  );
  expectEqual(summary.method, candidateDiagnostics.method, `${label} summary method`);
  expectEqual(summary.scope, 'chart-local-only', `${label} summary scope`);
  expectEqual(
    summary.globalSurfaceContinuity,
    'none',
    `${label} summary global continuity claim`,
  );
}

function assertIntensityCandidateBase(
  atlas,
  candidate,
  sampleById,
  nodeById,
  neighborsBySampleId,
  chartById,
  candidateOptions,
  label,
) {
  const chart = chartById.get(candidate.chartId);
  const sample = sampleById.get(candidate.sampleId);
  const node = nodeById.get(candidate.sampleId);
  const neighborNodes = neighborsBySampleId.get(candidate.sampleId) ?? [];

  if (!chart) {
    recordFailure(`${label} ${candidate.candidateId} referenced unknown chart ${candidate.chartId}`);
    return;
  }

  if (!sample) {
    recordFailure(`${label} ${candidate.candidateId} referenced unknown sample ${candidate.sampleId}`);
    return;
  }

  if (!node) {
    recordFailure(`${label} ${candidate.candidateId} referenced unknown graph node ${candidate.sampleId}`);
    return;
  }

  expectEqual(candidate.chartSemanticRole, chart.semanticRole, `${label} ${candidate.candidateId} role`);
  expectEqual(candidate.sourceFaceId, chart.sourceFaceId, `${label} ${candidate.candidateId} source face`);
  expectEqual(candidate.confirmationStatus, 'candidate-only', `${label} ${candidate.candidateId} status`);
  expectEqual(candidate.method, 'chart-local-sample-graph-intensity-candidates-v1', `${label} ${candidate.candidateId} method`);
  expectEqual(candidate.scope, 'chart-local-only', `${label} ${candidate.candidateId} scope`);
  expectEqual(
    candidate.globalSurfaceContinuity,
    'none',
    `${label} ${candidate.candidateId} global continuity claim`,
  );
  expectEqual(candidate.localChartPosition.length, 2, `${label} ${candidate.candidateId} local coord count`);
  expectEqual(candidate.barycentric.length, 3, `${label} ${candidate.candidateId} barycentric count`);
  expectEqual(
    candidate.contributionMagnitudes.length,
    atlas.sources.length,
    `${label} ${candidate.candidateId} contribution magnitude count`,
  );
  expectEqual(
    candidate.contributionRatios.length,
    atlas.sources.length,
    `${label} ${candidate.candidateId} contribution ratio count`,
  );
  expectFiniteComplex(candidate.psi, `${label} ${candidate.candidateId} psi`);
  expectFiniteNonnegative(candidate.intensity, `${label} ${candidate.candidateId} intensity`);
  expectFinite(candidate.phase, `${label} ${candidate.candidateId} phase`);
  expectFiniteNonnegative(
    candidate.relativeIntensity,
    `${label} ${candidate.candidateId} relative intensity`,
  );
  expectFiniteNonnegative(
    candidate.neighborCount,
    `${label} ${candidate.candidateId} neighbor count`,
  );
  expectFiniteNonnegative(
    candidate.effectiveSourceCount,
    `${label} ${candidate.candidateId} effective source count`,
  );
  expectFiniteNonnegative(
    candidate.topContributionRatio,
    `${label} ${candidate.candidateId} top contribution ratio`,
  );

  if (candidate.topContributionRatio > 1 + 1e-9) {
    recordFailure(`${label} ${candidate.candidateId} top contribution ratio exceeded 1`);
  }

  if (typeof candidate.reason !== 'string' || !candidate.reason.trim()) {
    recordFailure(`${label} ${candidate.candidateId} did not explain its selection reason`);
  }

  if (candidate.neighborSampleIds.length === 0 || neighborNodes.length === 0) {
    recordFailure(`${label} ${candidate.candidateId} has no chart-local neighbors`);
  }

  expectEqual(
    candidate.neighborCount,
    neighborNodes.length,
    `${label} ${candidate.candidateId} neighbor count should match graph neighbors`,
  );

  for (const neighborId of candidate.neighborSampleIds) {
    if (!neighborNodes.some((neighbor) => neighbor.sampleId === neighborId)) {
      recordFailure(`${label} ${candidate.candidateId} listed non-neighbor ${neighborId}`);
    }
  }

  if (sample.chartId !== candidate.chartId) {
    recordFailure(`${label} ${candidate.candidateId} sample is from a different chart`);
  }

  const chartSamples = atlas.samples.filter((chartSample) => chartSample.chartId === candidate.chartId);
  const chartMinIntensity = chartSamples.reduce(
    (minimum, chartSample) => Math.min(minimum, chartSample.intensity),
    Number.POSITIVE_INFINITY,
  );
  const chartMaxIntensity = chartSamples.reduce(
    (maximum, chartSample) => Math.max(maximum, chartSample.intensity),
    Number.NEGATIVE_INFINITY,
  );
  const expectedRelativeIntensity =
    (sample.intensity - chartMinIntensity) /
    Math.max(
      candidateOptions.relativeIntensityEpsilon,
      chartMaxIntensity - chartMinIntensity,
    );

  expectApprox(
    candidate.intensity,
    sample.intensity,
    1e-12,
    `${label} ${candidate.candidateId} intensity should preserve sample intensity`,
  );
  expectApprox(
    candidate.phase,
    sample.phase,
    1e-12,
    `${label} ${candidate.candidateId} phase should preserve sample phase`,
  );
  expectApprox(
    candidate.relativeIntensity,
    expectedRelativeIntensity,
    1e-9,
    `${label} ${candidate.candidateId} relative intensity should be chart-local`,
  );
  expectApprox(
    candidate.contributionRatios.reduce((sum, ratio) => sum + ratio.value, 0),
    1,
    1e-9,
    `${label} ${candidate.candidateId} contribution ratios should sum to 1`,
  );

  const ratioValues = candidate.contributionRatios.map((ratio) => ratio.value);
  const expectedEffectiveSourceCount =
    1 / ratioValues.reduce((sum, ratio) => sum + ratio * ratio, 0);
  const expectedTopContributionRatio = Math.max(...ratioValues);

  expectApprox(
    candidate.effectiveSourceCount,
    expectedEffectiveSourceCount,
    1e-9,
    `${label} ${candidate.candidateId} effective source count`,
  );
  expectApprox(
    candidate.topContributionRatio,
    expectedTopContributionRatio,
    1e-9,
    `${label} ${candidate.candidateId} top contribution ratio`,
  );
}

function assertExtremumCandidateNeighborComparison(
  candidate,
  neighborsBySampleId,
  tolerance,
  label,
) {
  const neighborNodes = neighborsBySampleId.get(candidate.sampleId) ?? [];

  if (candidate.extremumKind === 'local-minimum-candidate') {
    if (neighborNodes.some((neighbor) => candidate.intensity > neighbor.intensity + tolerance)) {
      recordFailure(`${label} ${candidate.candidateId} is not a chart-local minimum candidate`);
    }

    if (!neighborNodes.some((neighbor) => candidate.intensity < neighbor.intensity - tolerance)) {
      recordFailure(`${label} ${candidate.candidateId} has no higher chart-local neighbor`);
    }

    return;
  }

  if (neighborNodes.some((neighbor) => candidate.intensity < neighbor.intensity - tolerance)) {
    recordFailure(`${label} ${candidate.candidateId} is not a chart-local maximum candidate`);
  }

  if (!neighborNodes.some((neighbor) => candidate.intensity > neighbor.intensity + tolerance)) {
    recordFailure(`${label} ${candidate.candidateId} has no lower chart-local neighbor`);
  }
}

function assertComputationalIntensityCandidateRolesStayNonSemantic(
  atlas,
  candidateDiagnostics,
  label,
) {
  const computationalChartIds = new Set(
    atlas.domain.surfaceCharts
      .filter((chart) => chart.kind === 'computational-triangle-chart')
      .map((chart) => chart.chartId),
  );

  for (const diagnostic of candidateDiagnostics.chartDiagnostics) {
    if (computationalChartIds.has(diagnostic.chartId)) {
      expectEqual(
        diagnostic.chartSemanticRole,
        'computational-only',
        `${label} computational candidate diagnostic ${diagnostic.chartId} role`,
      );
    }
  }

  for (const candidate of [
    ...candidateDiagnostics.extremaCandidates,
    ...candidateDiagnostics.nearNodeCandidates,
  ]) {
    if (computationalChartIds.has(candidate.chartId)) {
      expectEqual(
        candidate.chartSemanticRole,
        'computational-only',
        `${label} computational candidate ${candidate.candidateId} role`,
      );
    }
  }
}

function assertSupportedFieldFeatureReport(report, label) {
  expectEqual(report.status, 'supported', `${label} status`);
  expectEqual(report.method, 'field-feature-report-v0', `${label} method`);
  expectEqual(report.scope, 'chart-local-only', `${label} scope`);
  expectEqual(
    report.globalSurfaceContinuity,
    'none',
    `${label} global surface continuity claim`,
  );
  expectEqual(report.semanticStatus, 'not-semantic-naming', `${label} semantic status`);

  if (!report.sourceSummary) {
    recordFailure(`${label} did not include a source summary`);
  }

  if (!report.atlasSummary) {
    recordFailure(`${label} did not include an atlas summary`);
  }

  if (!Array.isArray(report.observations)) {
    recordFailure(`${label} did not include an observation array`);
  }
}

function assertFieldFeatureReport(atlas, report, label, options = {}) {
  assertSupportedFieldFeatureReport(report, label);

  if (report.status !== 'supported') {
    return;
  }

  const graph = buildSurfaceSampleGraph(atlas);
  const candidateDiagnostics = buildIntensityCandidateDiagnostics(
    atlas,
    report.options.intensityCandidates,
  );
  const sampleById = new Map(atlas.samples.map((sample) => [sample.id, sample]));
  const chartById = new Map(atlas.domain.surfaceCharts.map((chart) => [chart.chartId, chart]));
  const nearNodeById = new Map(
    candidateDiagnostics.nearNodeCandidates.map((candidate) => [candidate.candidateId, candidate]),
  );
  const extremumById = new Map(
    candidateDiagnostics.extremaCandidates.map((candidate) => [candidate.candidateId, candidate]),
  );
  const candidateById = new Map([
    ...candidateDiagnostics.nearNodeCandidates.map((candidate) => [candidate.candidateId, candidate]),
    ...candidateDiagnostics.extremaCandidates.map((candidate) => [candidate.candidateId, candidate]),
  ]);
  const underconnectedChartIds = new Set(
    graph.summary.chartSummaries
      .filter((summary) => summary.underconnected)
      .map((summary) => summary.chartId),
  );
  const sourceKindCounts = countDiagnosticSourceKinds(atlas.sources);
  const intensityRange = getDiagnosticIntensityRange(
    atlas.samples.map((sample) => sample.intensity),
  );
  const cancellationLikeObservations = report.observations.filter(
    (observation) =>
      observation.observationKind === 'cancellation-like-site-candidate',
  );
  const highIntensityAnchorObservations = report.observations.filter(
    (observation) =>
      observation.observationKind === 'high-intensity-anchor-candidate',
  );
  const ambiguousObservations = report.observations.filter(
    (observation) => observation.observationKind === 'ambiguous-field-site',
  );
  const computationalOnlyObservationCount = report.observations.filter(
    (observation) => observation.chartSemanticRole === 'computational-only',
  ).length;

  expectEqual(
    report.sourceSummary.totalSources,
    atlas.sources.length,
    `${label} source summary total`,
  );
  expectEqual(
    report.sourceSummary.generatedSources,
    sourceKindCounts['generated-child'] + sourceKindCounts['ambo-midpoint-child'],
    `${label} generated source summary`,
  );
  expectEqual(
    report.sourceSummary.amboMidpointSources,
    sourceKindCounts['ambo-midpoint-child'],
    `${label} Ambo midpoint source summary`,
  );
  expectEqual(
    report.atlasSummary.chartCount,
    atlas.domain.surfaceCharts.length,
    `${label} atlas chart count`,
  );
  expectEqual(
    report.atlasSummary.sampleCount,
    atlas.samples.length,
    `${label} atlas sample count`,
  );
  expectApprox(
    report.atlasSummary.intensityRange.min,
    intensityRange.min,
    1e-12,
    `${label} atlas min intensity`,
  );
  expectApprox(
    report.atlasSummary.intensityRange.max,
    intensityRange.max,
    1e-12,
    `${label} atlas max intensity`,
  );
  expectEqual(
    report.atlasSummary.underconnectedChartCount,
    graph.summary.underconnectedChartCount,
    `${label} underconnected chart count`,
  );
  expectEqual(
    report.atlasSummary.computationalOnlyChartCount,
    atlas.domain.surfaceCharts.filter((chart) => chart.semanticRole === 'computational-only')
      .length,
    `${label} computational-only chart count`,
  );
  expectEqual(
    report.observationSummary.totalObservations,
    report.observations.length,
    `${label} observation summary total`,
  );
  expectEqual(
    report.observationSummary.cancellationLikeCount,
    cancellationLikeObservations.length,
    `${label} cancellation-like observation count`,
  );
  expectEqual(
    report.observationSummary.highIntensityAnchorCount,
    highIntensityAnchorObservations.length,
    `${label} high-intensity observation count`,
  );
  expectEqual(
    report.observationSummary.ambiguousCount,
    ambiguousObservations.length,
    `${label} ambiguous observation count`,
  );
  expectEqual(
    report.observationSummary.computationalOnlyObservationCount,
    computationalOnlyObservationCount,
    `${label} computational-only observation count`,
  );

  expectFiniteNonnegative(
    report.options.highIntensityRelativeMin,
    `${label} high intensity relative min`,
  );
  expectFiniteNonnegative(
    report.options.maxCancellationLike,
    `${label} max cancellation-like observations`,
  );
  expectFiniteNonnegative(
    report.options.maxHighIntensityAnchors,
    `${label} max high-intensity observations`,
  );
  expectFiniteNonnegative(report.options.maxAmbiguous, `${label} max ambiguous observations`);

  if (cancellationLikeObservations.length > report.options.maxCancellationLike) {
    recordFailure(`${label} emitted too many cancellation-like observations`);
  }

  if (highIntensityAnchorObservations.length > report.options.maxHighIntensityAnchors) {
    recordFailure(`${label} emitted too many high-intensity anchor observations`);
  }

  if (ambiguousObservations.length > report.options.maxAmbiguous) {
    recordFailure(`${label} emitted too many ambiguous observations`);
  }

  if (
    report.observations.length >
    report.options.maxCancellationLike +
      report.options.maxHighIntensityAnchors +
      report.options.maxAmbiguous
  ) {
    recordFailure(`${label} emitted more observations than the combined option bounds`);
  }

  for (const observation of report.observations) {
    assertFieldFeatureReportObservation(
      atlas,
      observation,
      sampleById,
      chartById,
      candidateById,
      nearNodeById,
      extremumById,
      underconnectedChartIds,
      label,
    );
  }

  if (
    options.requireCancellationLikeObservation &&
    cancellationLikeObservations.length === 0
  ) {
    recordFailure(`${label} did not emit a cancellation-like report observation`);
  }

  if (
    options.requireHighIntensityAnchorObservation &&
    highIntensityAnchorObservations.length === 0
  ) {
    recordFailure(`${label} did not emit a high-intensity anchor report observation`);
  }

  if (options.requireAmbiguousObservation && ambiguousObservations.length === 0) {
    recordFailure(`${label} did not emit an ambiguous report observation`);
  }
}

function assertFieldFeatureReportObservation(
  atlas,
  observation,
  sampleById,
  chartById,
  candidateById,
  nearNodeById,
  extremumById,
  underconnectedChartIds,
  label,
) {
  const sample = sampleById.get(observation.sampleId);
  const chart = chartById.get(observation.chartId);
  const sourceCandidate = candidateById.get(observation.sourceCandidateId);

  if (!sample) {
    recordFailure(`${label} ${observation.observationId} referenced unknown sample ${observation.sampleId}`);
    return;
  }

  if (!chart) {
    recordFailure(`${label} ${observation.observationId} referenced unknown chart ${observation.chartId}`);
    return;
  }

  if (!sourceCandidate) {
    recordFailure(
      `${label} ${observation.observationId} did not reference an internal source candidate`,
    );
    return;
  }

  expectEqual(
    observation.status,
    'report-candidate',
    `${label} ${observation.observationId} report status`,
  );
  expectEqual(
    observation.semanticStatus,
    'not-semantic-naming',
    `${label} ${observation.observationId} semantic status`,
  );
  expectEqual(observation.scope, 'chart-local-only', `${label} ${observation.observationId} scope`);
  expectEqual(
    observation.globalSurfaceContinuity,
    'none',
    `${label} ${observation.observationId} global continuity claim`,
  );
  expectEqual(observation.chartId, sample.chartId, `${label} ${observation.observationId} sample chart`);
  expectEqual(
    observation.chartSemanticRole,
    chart.semanticRole,
    `${label} ${observation.observationId} chart role`,
  );
  expectEqual(
    observation.chartSemanticRole,
    sample.chartSemanticRole,
    `${label} ${observation.observationId} sample chart role`,
  );
  expectEqual(
    observation.sourceFaceId,
    chart.sourceFaceId,
    `${label} ${observation.observationId} chart source face`,
  );
  expectEqual(
    observation.sourceFaceId,
    sample.sourceFaceId,
    `${label} ${observation.observationId} sample source face`,
  );
  expectEqual(
    observation.sourceCandidateKind,
    sourceCandidate.candidateKind,
    `${label} ${observation.observationId} source candidate kind`,
  );
  expectFiniteVec3(observation.position, `${label} ${observation.observationId} position`);
  expectEqual(
    observation.localChartPosition.length,
    2,
    `${label} ${observation.observationId} local chart position`,
  );
  expectFiniteNonnegative(
    observation.intensity,
    `${label} ${observation.observationId} intensity`,
  );
  expectFinite(observation.phase, `${label} ${observation.observationId} phase`);
  expectFiniteNonnegative(
    observation.relativeIntensity,
    `${label} ${observation.observationId} relative intensity`,
  );
  expectFiniteNonnegative(
    observation.effectiveSourceCount,
    `${label} ${observation.observationId} effective source count`,
  );
  expectFiniteNonnegative(
    observation.topContributionRatio,
    `${label} ${observation.observationId} top contribution ratio`,
  );

  if (
    observation.observationKind !== 'cancellation-like-site-candidate' &&
    observation.observationKind !== 'high-intensity-anchor-candidate' &&
    observation.observationKind !== 'ambiguous-field-site'
  ) {
    recordFailure(`${label} ${observation.observationId} has unsupported observation kind`);
  }

  if (typeof observation.reason !== 'string' || !observation.reason.trim()) {
    recordFailure(`${label} ${observation.observationId} did not explain its report reason`);
  }

  expectApprox(
    observation.intensity,
    sourceCandidate.intensity,
    1e-12,
    `${label} ${observation.observationId} preserved candidate intensity`,
  );
  expectApprox(
    observation.phase,
    sourceCandidate.phase,
    1e-12,
    `${label} ${observation.observationId} preserved candidate phase`,
  );
  expectApprox(
    observation.relativeIntensity,
    sourceCandidate.relativeIntensity,
    1e-12,
    `${label} ${observation.observationId} preserved candidate relative intensity`,
  );
  expectApprox(
    observation.effectiveSourceCount,
    sourceCandidate.effectiveSourceCount,
    1e-12,
    `${label} ${observation.observationId} preserved candidate effective source count`,
  );
  expectApprox(
    observation.topContributionRatio,
    sourceCandidate.topContributionRatio,
    1e-12,
    `${label} ${observation.observationId} preserved candidate top contribution ratio`,
  );

  if (chart.semanticRole === 'computational-only') {
    expectEqual(
      observation.chartSemanticRole,
      'computational-only',
      `${label} ${observation.observationId} computational-only role`,
    );
  }

  if (observation.observationKind === 'cancellation-like-site-candidate') {
    if (!nearNodeById.has(observation.sourceCandidateId)) {
      recordFailure(
        `${label} ${observation.observationId} cancellation-like observation did not derive from a near-node candidate`,
      );
    }
  }

  if (observation.observationKind === 'high-intensity-anchor-candidate') {
    const extremum = extremumById.get(observation.sourceCandidateId);

    if (!extremum) {
      recordFailure(
        `${label} ${observation.observationId} high-intensity observation did not derive from an extremum candidate`,
      );
    } else {
      expectEqual(
        extremum.extremumKind,
        'local-maximum-candidate',
        `${label} ${observation.observationId} high-intensity source extremum`,
      );
      expectEqual(
        observation.sourceExtremumKind,
        'local-maximum-candidate',
        `${label} ${observation.observationId} preserved source extremum kind`,
      );
    }
  }

  if (observation.observationKind === 'ambiguous-field-site') {
    const boundaryLocal = sourceCandidate.barycentric.some(
      (coordinate) => Math.abs(coordinate) <= 1e-12,
    );
    const ambiguousCondition =
      underconnectedChartIds.has(observation.chartId) ||
      observation.chartSemanticRole === 'computational-only' ||
      boundaryLocal;

    if (!ambiguousCondition) {
      recordFailure(
        `${label} ${observation.observationId} ambiguous observation lacked an underconnected, computational-only, or boundary-local reason`,
      );
    }
  }

  if (observation.topContributionRatio > 1 + 1e-9) {
    recordFailure(`${label} ${observation.observationId} top contribution ratio exceeded 1`);
  }

  if (atlas.samples.every((candidate) => candidate.id !== observation.sampleId)) {
    recordFailure(`${label} ${observation.observationId} did not preserve a sampled atlas id`);
  }
}

function assertComputationalFieldFeatureReportObservationsStayNonSemantic(
  atlas,
  report,
  label,
) {
  const computationalChartIds = new Set(
    atlas.domain.surfaceCharts
      .filter((chart) => chart.kind === 'computational-triangle-chart')
      .map((chart) => chart.chartId),
  );

  for (const observation of report.observations) {
    if (computationalChartIds.has(observation.chartId)) {
      expectEqual(
        observation.chartSemanticRole,
        'computational-only',
        `${label} computational observation ${observation.observationId} role`,
      );
    }
  }
}

function buildDiagnosticNeighborsBySampleId(graph) {
  const nodeById = new Map(graph.nodes.map((node) => [node.sampleId, node]));
  const neighborsBySampleId = new Map(graph.nodes.map((node) => [node.sampleId, []]));

  for (const edge of graph.edges) {
    const first = nodeById.get(edge.sampleIds[0]);
    const second = nodeById.get(edge.sampleIds[1]);

    if (!first || !second) {
      continue;
    }

    neighborsBySampleId.get(first.sampleId)?.push(second);
    neighborsBySampleId.get(second.sampleId)?.push(first);
  }

  return neighborsBySampleId;
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
    assertBarycentricLatticeMetadata(samplePoint, `${label} sample point ${samplePoint.id}`);
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
    assertBarycentricLatticeMetadata(sample, `${label} sample ${sample.id}`);
  }
}

function assertBarycentricLatticeMetadata(value, label) {
  if (!Array.isArray(value.barycentricIndices) || value.barycentricIndices.length !== 3) {
    recordFailure(`${label} should carry three barycentric lattice indices`);
    return;
  }

  if (!Number.isInteger(value.subdivisions) || value.subdivisions < 1) {
    recordFailure(`${label} should carry a positive integer subdivision count`);
    return;
  }

  for (const index of value.barycentricIndices) {
    if (!Number.isInteger(index) || index < 0) {
      recordFailure(`${label} barycentric lattice index should be a nonnegative integer`);
    }
  }

  expectEqual(
    value.barycentricIndices.reduce((sum, index) => sum + index, 0),
    value.subdivisions,
    `${label} barycentric lattice indices should sum to subdivisions`,
  );

  if (Array.isArray(value.barycentric) && value.barycentric.length === 3) {
    value.barycentric.forEach((coordinate, index) => {
      expectApprox(
        coordinate,
        value.barycentricIndices[index] / value.subdivisions,
        1e-9,
        `${label} barycentric coordinate ${index} should match lattice metadata`,
      );
    });
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
