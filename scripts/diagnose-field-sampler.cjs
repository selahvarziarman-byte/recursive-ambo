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
  FIELD_KERNEL,
  buildFieldSources,
  sampleFieldAtPoint,
} = require(path.join(repoRoot, 'src/lib/fieldSampler.ts'));

const failures = [];

console.log('Field sampler diagnostics');
console.log(`Kernel: ${FIELD_KERNEL}`);

runTetrahedronSourceCount();
runFinitePositiveOriginSample();
runNearVertexIsStrongerThanFarSample();
runAmboDissectionSourceBuild();
runNoShapeMutation();

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

function runTetrahedronSourceCount() {
  const shape = createSeedShape('tetrahedron');
  const sources = buildFieldSources(shape);
  const vertexCount = Object.keys(shape.vertices).length;

  expectEqual(
    sources.length,
    vertexCount,
    'tetrahedron should create exactly one field source per vertex',
  );

  const mismatchedSource = sources.find(
    (source) => !sameVec3(source.position, shape.vertices[source.vertexId]?.position),
  );

  if (mismatchedSource) {
    recordFailure(
      `source ${mismatchedSource.vertexId} did not preserve raw closed-geometry position`,
    );
  }

  console.log(`tetrahedron sources: ${sources.length}/${vertexCount}`);
}

function runFinitePositiveOriginSample() {
  const shape = createSeedShape('tetrahedron');
  const sources = buildFieldSources(shape);
  const value = sampleFieldAtPoint(sources, [0, 0, 0]);

  if (!Number.isFinite(value) || value <= 0) {
    recordFailure(`origin sample should be finite and positive, got ${value}`);
  }

  console.log(`origin sample: ${formatNumber(value)}`);
}

function runNearVertexIsStrongerThanFarSample() {
  const shape = createSeedShape('tetrahedron');
  const sources = buildFieldSources(shape);
  const source = sources[0];
  const nearPoint = [source.position[0] + 0.05, source.position[1], source.position[2]];
  const farPoint = [10, 10, 10];
  const nearValue = sampleFieldAtPoint(sources, nearPoint);
  const farValue = sampleFieldAtPoint(sources, farPoint);

  if (!(nearValue > farValue)) {
    recordFailure(
      `near-vertex sample should be stronger than far sample, got near=${nearValue} far=${farValue}`,
    );
  }

  console.log(`near/far sample: ${formatNumber(nearValue)} > ${formatNumber(farValue)}`);
}

function runAmboDissectionSourceBuild() {
  const seedShape = createSeedShape('tetrahedron');
  const seedCell = seedShape.cells.find((cell) => cell.kind === 'seed');

  if (!seedCell) {
    recordFailure('tetrahedron seed cell was unavailable');
    return;
  }

  const amboShape = applyAmboDissection(seedShape, seedCell.id);
  const sources = buildFieldSources(amboShape);
  const vertexCount = Object.keys(amboShape.vertices).length;

  expectEqual(
    sources.length,
    vertexCount,
    'ambo-dissection shape should create one field source per current vertex',
  );

  if (sources.length <= Object.keys(seedShape.vertices).length) {
    recordFailure('ambo-dissection source count did not include generated current-geometry vertices');
  }

  console.log(`ambo-dissection sources: ${sources.length}/${vertexCount}`);
}

function runNoShapeMutation() {
  const shape = createSeedShape('tetrahedron');
  const before = JSON.stringify(shape);
  const sources = buildFieldSources(shape);

  sampleFieldAtPoint(sources, [0, 0, 0]);
  sampleFieldAtPoint(sources, [1, 1, 1], { epsilon: 0.001, power: 1.5 });

  const after = JSON.stringify(shape);

  if (after !== before) {
    recordFailure('shape changed during source building or sampling');
  }

  console.log('shape mutation check: unchanged');
}

function expectEqual(actual, expected, label) {
  if (actual !== expected) {
    recordFailure(`${label}: expected ${expected}, got ${actual}`);
  }
}

function sameVec3(a, b) {
  return Boolean(b) && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function formatNumber(value) {
  return value.toFixed(6);
}

function recordFailure(message) {
  failures.push(message);
}
