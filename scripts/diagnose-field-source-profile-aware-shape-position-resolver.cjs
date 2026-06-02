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
  buildTetrahedralAmboChildContexts,
  createTetrahedralVertexFixture,
} = require(path.join(repoRoot, 'src/lib/fieldSourceChildContexts.ts'));
const {
  buildPrimalProfileAssignmentDiagnosticReport,
  createTetrahedronFieldSourceProfileSetupFixture,
  createTetrahedronPrimalProfileAssignmentFixture,
  createUniformCirclePrimalProfileSystemFixture,
  generateFieldSourceProfiles,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfiles.ts'));
const {
  buildTetrahedralQuarkChannelReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceQuarkChannels.ts'));
const {
  buildTetrahedralChildSourceProfileDerivationReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceChildDerivations.ts'));
const {
  buildTetrahedralChildProfileDegeneracyReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceChildDegeneracy.ts'));
const {
  buildProfileAwareFieldSourcePolicyDiagnosticReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwarePolicy.ts'));
const {
  buildProfileAwareAtlasAdapterReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareAtlasAdapter.ts'));
const {
  buildProfileAwareAtlasExecutionReportFromPositionMap,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareAtlasExecution.ts'));
const {
  buildProfileAwareShapePositionResolverReport,
} = require(path.join(repoRoot, 'src/lib/fieldSourceProfileAwareShapePositionResolver.ts'));

const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'];
const RATIO_SUM_TOLERANCE = 1e-9;
const failures = [];

console.log('Field source profile-aware Shape position resolver diagnostics');

runShapeResolverExecutionDiagnostic();
runUnsupportedShapeContextDiagnostic();
runMissingPrimalDiagnostic();
runMissingChildDiagnostic();
runNoInvarianceClaimDiagnostic();

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

function runShapeResolverExecutionDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = buildTetrahedronAfterOneAmboDissection();
  const beforeShapeJson = JSON.stringify(shape);
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const executionReport = buildExecutionReportFromResolver(adapterReport, resolverReport);

  expectEqual(resolverReport.ok, true, 'shape resolver ok');
  expectEqual(
    resolverReport.method,
    'profile-aware-shape-position-resolver-diagnostic-v0',
    'shape resolver method',
  );
  expectEqual(
    resolverReport.diagnosticScope,
    'tetrahedron-seed-one-ambo-dissection-position-resolution-only',
    'shape resolver diagnostic scope',
  );
  expectEqual(
    resolverReport.shapeMutationStatus,
    'not-shape-mutation',
    'shape resolver mutation status',
  );
  expectEqual(
    resolverReport.packetWriteStatus,
    'not-packet-writing',
    'shape resolver packet write status',
  );
  expectEqual(
    resolverReport.shapeContextStatus,
    'supported',
    'shape resolver context status',
  );
  expectEqual(resolverReport.shapeSeedKey, 'tetrahedron', 'shape resolver seed key');
  expectEqual(
    resolverReport.shapeOperation,
    'ambo-dissection',
    'shape resolver shape operation',
  );
  expectAtLeast(
    resolverReport.shapeGenerationDepth,
    1,
    'shape resolver generation depth',
  );
  expectEqual(resolverReport.resolvedPrimalCount, 4, 'shape resolver primal count');
  expectEqual(resolverReport.resolvedChildCount, 6, 'shape resolver child count');
  expectEqual(
    resolverReport.totalResolvedPositionCount,
    10,
    'shape resolver total position count',
  );
  expectEqual(resolverReport.missingPrimalCount, 0, 'shape resolver missing primal count');
  expectEqual(resolverReport.missingChildCount, 0, 'shape resolver missing child count');
  expectEqual(
    resolverReport.duplicatePrimalLabelCount,
    0,
    'shape resolver duplicate primal label count',
  );
  expectEqual(
    resolverReport.nonFinitePositionCount,
    0,
    'shape resolver non-finite position count',
  );
  expectEqual(executionReport.ok, true, 'shape-resolved execution ok');
  expectEqual(
    executionReport.executableSourceCount,
    adapterReport.atlasInputSourceCount,
    'shape-resolved execution source count',
  );
  expectEqual(
    executionReport.contributionRatioSummary.invalidSampleCount,
    0,
    'shape-resolved execution invalid ratio count',
  );
  expectAtMost(
    executionReport.contributionRatioSummary.maxRatioSumError ?? 0,
    RATIO_SUM_TOLERANCE,
    'shape-resolved execution max ratio sum error',
  );
  expectFiniteSamples(executionReport, 'shape-resolved execution');

  if (JSON.stringify(shape) !== beforeShapeJson) {
    recordFailure('shape resolver diagnostic mutated the Ambo Shape');
  }

  printResolverReport('shape resolver', resolverReport);
  printExecutionReport('shape-resolved execution', executionReport);
}

function runUnsupportedShapeContextDiagnostic() {
  const shape = createSeedShape('tetrahedron');
  const beforeShapeJson = JSON.stringify(shape);
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);

  expectEqual(resolverReport.ok, false, 'unsupported shape resolver ok');
  expectEqual(
    resolverReport.shapeContextStatus,
    'unsupported',
    'unsupported shape context status',
  );
  expectEqual(
    resolverReport.shapeSeedKey,
    'tetrahedron',
    'unsupported shape seed key',
  );
  expectEqual(resolverReport.shapeOperation, 'seed', 'unsupported shape operation');
  expectEqual(
    resolverReport.shapeGenerationDepth,
    0,
    'unsupported shape generation depth',
  );
  expectIssueCode(
    resolverReport,
    'unsupported-shape-context',
    'unsupported shape context issue',
  );
  expectEqual(
    resolverReport.totalResolvedPositionCount,
    0,
    'unsupported shape resolved position count',
  );

  if (JSON.stringify(shape) !== beforeShapeJson) {
    recordFailure('unsupported shape resolver diagnostic mutated the seed Shape');
  }

  printResolverReport('unsupported shape context', resolverReport);
}

function runMissingPrimalDiagnostic() {
  const shape = buildTetrahedronAfterOneAmboDissection();
  const tamperedShape = cloneShapeWithSeedLabel(shape, 'A', 'A-missing');
  const resolverReport = buildProfileAwareShapePositionResolverReport(tamperedShape);

  expectEqual(resolverReport.ok, false, 'missing primal resolver ok');
  expectIssueCode(resolverReport, 'missing-primal-label', 'missing primal issue');
  expectEqual(resolverReport.missingPrimalCount, 1, 'missing primal count');
  expectAtLeast(resolverReport.missingChildCount, 1, 'missing primal dependent child count');

  printResolverReport('missing primal', resolverReport);
}

function runMissingChildDiagnostic() {
  const shape = buildTetrahedronAfterOneAmboDissection();
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const missingChildBinding = resolverReport.resolvedBindings.find(
    (binding) => binding.symbolId === 'M_AB',
  );

  if (!missingChildBinding) {
    recordFailure('missing child diagnostic: M_AB binding was unavailable');
    return;
  }

  const tamperedShape = cloneShapeWithoutVertex(shape, missingChildBinding.shapeVertexId);
  const tamperedResolverReport =
    buildProfileAwareShapePositionResolverReport(tamperedShape);

  expectEqual(tamperedResolverReport.ok, false, 'missing child resolver ok');
  expectIssueCode(
    tamperedResolverReport,
    'missing-child-midpoint',
    'missing child issue',
  );
  expectEqual(tamperedResolverReport.missingPrimalCount, 0, 'missing child primal count');
  expectEqual(tamperedResolverReport.missingChildCount, 1, 'missing child count');

  printResolverReport('missing child', tamperedResolverReport);
}

function runNoInvarianceClaimDiagnostic() {
  const { adapterReport } = buildBaseFixture();
  const shape = buildTetrahedronAfterOneAmboDissection();
  const resolverReport = buildProfileAwareShapePositionResolverReport(shape);
  const executionReport = buildExecutionReportFromResolver(adapterReport, resolverReport);

  expectNoOwnProperty(resolverReport, 'invariant', 'resolver no invariant property');
  expectNoOwnProperty(
    resolverReport,
    'invariantWithDefaultPolicy',
    'resolver no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    resolverReport,
    'preservesOldFeatures',
    'resolver no preservesOldFeatures property',
  );
  expectNoOwnProperty(
    resolverReport,
    'oldFeaturesStillHold',
    'resolver no oldFeaturesStillHold property',
  );
  expectNoOwnProperty(executionReport, 'invariant', 'execution no invariant property');
  expectNoOwnProperty(
    executionReport,
    'invariantWithDefaultPolicy',
    'execution no invariantWithDefaultPolicy property',
  );
  expectNoOwnProperty(
    executionReport,
    'preservesOldFeatures',
    'execution no preservesOldFeatures property',
  );
  expectNoOwnProperty(
    executionReport,
    'oldFeaturesStillHold',
    'execution no oldFeaturesStillHold property',
  );

  console.log('no old-policy invariance claim: PASS');
}

function buildExecutionReportFromResolver(adapterReport, resolverReport) {
  return buildProfileAwareAtlasExecutionReportFromPositionMap(
    adapterReport.atlasSources,
    resolverReport.positionByVertexId,
    {
      reportIdSuffix: `${adapterReport.reportId}:shape-resolved-position-map`,
      profileSystemId: adapterReport.profileSystemId,
      profileSetupId: adapterReport.profileSetupId,
      childInheritanceGrammarId: adapterReport.childInheritanceGrammarId,
      sourceCountMetadata: {
        fieldReadySourceCount: adapterReport.fieldReadySourceCount,
        fallbackChildSourceCount: adapterReport.fallbackChildSourceCount,
        unresolvedChildSourceCount: adapterReport.unresolvedChildSourceCount,
        degeneracyStatusCount: adapterReport.degeneracyStatusCount,
      },
      samplePoints: [
        {
          id: 'shape-resolved:origin',
          position: [0, 0, 0],
        },
      ],
    },
  );
}

function buildTetrahedronAfterOneAmboDissection() {
  return applyAmboDissection(createSeedShape('tetrahedron'));
}

function buildBaseFixture() {
  const vertexIds = createTetrahedralVertexFixture();
  const profileSystem = createUniformCirclePrimalProfileSystemFixture();
  const profiles = generateFieldSourceProfiles(profileSystem);
  const assignments = createTetrahedronPrimalProfileAssignmentFixture(profiles);
  const setup = createTetrahedronFieldSourceProfileSetupFixture(profileSystem, assignments);
  const profileAssignmentReport = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem,
    setup,
    activePrimalVertexIds: ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  });
  const profileById = new Map(profiles.map((profile) => [profile.profileId, profile]));
  const profileByVertexId = new Map(
    assignments.map((assignment) => [assignment.vertexId, profileById.get(assignment.profileId)]),
  );
  const childContexts = buildTetrahedralAmboChildContexts(vertexIds);
  const childDerivationReports = childContexts.map((childContext) => {
    const quarkChannelReport = buildTetrahedralQuarkChannelReport({
      childContext,
      profileByVertexId,
    });

    return buildTetrahedralChildSourceProfileDerivationReport({
      childContext,
      quarkChannelReport,
    });
  });
  const childDegeneracyReport = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: childDerivationReports,
  });
  const profileAwarePolicyReport = buildProfileAwareFieldSourcePolicyDiagnosticReport({
    profileAssignmentReport,
    childContexts,
    childDerivationReports,
    childDegeneracyReport,
  });
  const adapterReport = buildProfileAwareAtlasAdapterReport({
    profileAwarePolicyReport,
  });

  return {
    profileSystem,
    profiles,
    assignments,
    setup,
    profileAssignmentReport,
    profileByVertexId,
    childContexts,
    childDerivationReports,
    childDegeneracyReport,
    profileAwarePolicyReport,
    adapterReport,
  };
}

function cloneShapeWithSeedLabel(shape, label, replacementLabel) {
  return cloneShapeVertices(shape, (vertex) => {
    if (vertex.createdBy.operation !== 'seed' || vertex.data.label !== label) {
      return cloneVertex(vertex);
    }

    return {
      ...cloneVertex(vertex),
      data: {
        ...vertex.data,
        label: replacementLabel,
      },
    };
  });
}

function cloneShapeWithoutVertex(shape, removedVertexId) {
  return cloneShapeVertices(shape, (vertex) =>
    vertex.id === removedVertexId ? null : cloneVertex(vertex),
  );
}

function cloneShapeVertices(shape, transformVertex) {
  const vertices = {};

  for (const [vertexId, vertex] of Object.entries(shape.vertices)) {
    const transformedVertex = transformVertex(vertex);

    if (transformedVertex) {
      vertices[vertexId] = transformedVertex;
    }
  }

  return {
    ...shape,
    vertices,
  };
}

function cloneVertex(vertex) {
  return {
    ...vertex,
    position: [...vertex.position],
    data: {
      ...vertex.data,
      tags: [...vertex.data.tags],
      custom: {
        ...vertex.data.custom,
      },
      lineage: vertex.data.lineage
        ? {
            ...vertex.data.lineage,
            sources: vertex.data.lineage.sources.map((source) => ({ ...source })),
          }
        : undefined,
    },
    createdBy: {
      ...vertex.createdBy,
      sourceVertexIds: [...vertex.createdBy.sourceVertexIds],
    },
  };
}

function printResolverReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  shape: ${report.shapeId}`);
  console.log(`  shape context: ${report.shapeContextStatus}`);
  console.log(`  resolved primal: ${report.resolvedPrimalCount}`);
  console.log(`  resolved child: ${report.resolvedChildCount}`);
  console.log(`  total positions: ${report.totalResolvedPositionCount}`);
  console.log(`  missing primal: ${report.missingPrimalCount}`);
  console.log(`  missing child: ${report.missingChildCount}`);
  console.log(`  duplicate primal labels: ${report.duplicatePrimalLabelCount}`);
  console.log(`  non-finite positions: ${report.nonFinitePositionCount}`);
  console.log(`  issues: ${report.issueCount}${formatIssueCounts(report)}`);
}

function printExecutionReport(label, report) {
  console.log(`${label}: ${report.ok ? 'PASS' : 'FAIL'}`);
  console.log(`  atlas input sources: ${report.atlasInputSourceCount}`);
  console.log(`  executable sources: ${report.executableSourceCount}`);
  console.log(`  samples: ${report.sampleCount}`);
  console.log(
    `  ratio sums: invalid=${report.contributionRatioSummary.invalidSampleCount} maxError=${formatNumber(
      report.contributionRatioSummary.maxRatioSumError,
    )}`,
  );
  console.log(`  issues: ${report.issueCount}${formatIssueCounts(report)}`);
}

function formatIssueCounts(report) {
  const counts = new Map();

  for (const issue of report.issues) {
    counts.set(issue.code, (counts.get(issue.code) ?? 0) + 1);
  }

  if (counts.size === 0) {
    return '';
  }

  return ` (${Array.from(counts)
    .map(([code, count]) => `${code}=${count}`)
    .join(', ')})`;
}

function expectFiniteSamples(report, label) {
  for (const sample of report.sampleSummaries) {
    expectFinite(sample.psi.re, `${label} ${sample.sampleId} psi.re`);
    expectFinite(sample.psi.im, `${label} ${sample.sampleId} psi.im`);
    expectFiniteNonnegative(sample.intensity, `${label} ${sample.sampleId} intensity`);
    expectFinite(sample.phase, `${label} ${sample.sampleId} phase`);
    expectEqual(
      sample.contributionCount,
      report.executableSourceCount,
      `${label} ${sample.sampleId} contribution count`,
    );
    expectApprox(
      sample.contributionRatioSum,
      1,
      RATIO_SUM_TOLERANCE,
      `${label} ${sample.sampleId} ratio sum`,
    );
  }
}

function expectIssueCode(report, code, label) {
  if (!report.issues.some((issue) => issue.code === code)) {
    recordFailure(`${label}: expected issue ${code}`);
  }
}

function expectNoOwnProperty(value, property, label) {
  if (Object.prototype.hasOwnProperty.call(value, property)) {
    recordFailure(`${label}: did not expect property ${property}`);
  }
}

function expectFinite(value, label) {
  if (!Number.isFinite(value)) {
    recordFailure(`${label}: expected finite number, got ${value}`);
  }
}

function expectFiniteNonnegative(value, label) {
  expectFinite(value, label);

  if (value < 0) {
    recordFailure(`${label}: expected nonnegative number, got ${value}`);
  }
}

function expectAtLeast(actual, expectedMinimum, label) {
  if (actual < expectedMinimum) {
    recordFailure(`${label}: expected at least ${expectedMinimum}, got ${actual}`);
  }
}

function expectAtMost(actual, expectedMaximum, label) {
  if (actual > expectedMaximum) {
    recordFailure(`${label}: expected at most ${expectedMaximum}, got ${actual}`);
  }
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function expectApprox(actual, expected, tolerance, label) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    recordFailure(
      `${label}: expected ${formatNumber(expected)} +/- ${formatNumber(
        tolerance,
      )}, got ${formatNumber(actual)}`,
    );
  }
}

function formatNumber(value) {
  if (value === null || value === undefined) {
    return 'n/a';
  }

  if (!Number.isFinite(value)) {
    return String(value);
  }

  if (Math.abs(value) < 1e-12) {
    return '0';
  }

  return value.toPrecision(6);
}

function recordFailure(message) {
  failures.push(message);
}
