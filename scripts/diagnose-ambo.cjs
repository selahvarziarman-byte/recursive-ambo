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
const { createSeedShape, seedRegistry } = require(path.join(repoRoot, 'src/data/seeds.ts'));
const {
  applyAmboDissection,
  canApplyAmboDissection,
} = require(path.join(repoRoot, 'src/lib/ambo.ts'));
const {
  getCellLifecycleStatus,
  isCellActiveFrontier,
} = require(path.join(repoRoot, 'src/lib/cellLifecycle.ts'));
const {
  getCellTopologySignature,
} = require(path.join(repoRoot, 'src/lib/topologySignature.ts'));

const scenarios = [
  {
    name: 'tetrahedron -> octahedron -> cuboctahedron -> rhombicuboctahedron frontier',
    seedKey: 'tetrahedron',
    steps: [
      step('dissect tetrahedron seed', selectSeedCell),
      step('dissect octahedron core', selectActiveCell({ kind: 'core', topology: 'octahedron' })),
      step('dissect cuboctahedron core', selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })),
    ],
  },
  {
    name: 'octahedron -> square-pyramid -> rectified-square-pyramid chain',
    seedKey: 'octahedron',
    steps: [
      step('dissect octahedron seed', selectSeedCell),
      step(
        'dissect first square-pyramid residue',
        selectActiveCell({ kind: 'residue', topology: 'square-pyramid' }),
      ),
      step(
        'dissect rectified-square-pyramid core',
        selectActiveCell({ kind: 'core', topology: 'rectified-square-pyramid' }),
      ),
      step(
        'dissect rectified-square-pyramid-ambo-core core',
        selectActiveCell({ kind: 'core', topology: 'rectified-square-pyramid-ambo-core' }),
      ),
    ],
  },
  {
    name: 'cube -> cuboctahedron -> rhombicuboctahedron frontier',
    seedKey: 'cube',
    steps: [
      step('dissect cube seed', selectSeedCell),
      step('dissect cuboctahedron core', selectActiveCell({ kind: 'core', topology: 'cuboctahedron' })),
    ],
  },
];

const failures = [];

console.log('Recursive Ambo topology diagnostics');
console.log(`Seeds: ${Object.keys(seedRegistry).sort().join(', ')}`);
console.log('');

for (const scenario of scenarios) {
  runScenario(scenario);
}

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

function runScenario(scenario) {
  let shape = createSeedShape(scenario.seedKey);

  printDivider(scenario.name);
  printGenerationSummary('initial seed', shape);

  scenario.steps.forEach((scenarioStep, index) => {
    const targetCell = scenarioStep.select(shape);
    const stepNumber = index + 1;

    if (!targetCell) {
      recordFailure(`${scenario.name}: step ${stepNumber} (${scenarioStep.label}) did not find a target`);
      return;
    }

    const active = isCellActiveFrontier(shape, targetCell.id);
    const engineValid = canApplyAmboDissection(shape, targetCell.id);

    console.log(
      `\nStep ${stepNumber}: ${scenarioStep.label} -> ${describeCell(targetCell)} ` +
        `active=${active ? 'yes' : 'no'} engine-valid=${engineValid ? 'yes' : 'no'}`,
    );

    if (!active || !engineValid) {
      recordFailure(
        `${scenario.name}: step ${stepNumber} target ${targetCell.id} was not an active valid Ambo source`,
      );
      return;
    }

    shape = applyAmboDissection(shape, targetCell.id);
    printGenerationSummary(`after step ${stepNumber}`, shape);
  });
}

function printGenerationSummary(label, shape) {
  const lifecycleCounts = countCellsByLifecycle(shape);
  const kindCounts = countBy(shape.cells, (cell) => cell.kind);
  const topologyCounts = countBy(shape.cells, getCellTopologyLabel);
  const activeCells = sortedCells(shape.cells.filter((cell) => isCellActiveFrontier(shape, cell.id)));
  const operableCells = activeCells.filter((cell) => canApplyAmboDissection(shape, cell.id));
  const engineValidNonActiveCells = shape.cells.filter(
    (cell) => !isCellActiveFrontier(shape, cell.id) && canApplyAmboDissection(shape, cell.id),
  );
  const unsupportedActiveCounts = countBy(
    activeCells.filter((cell) => !canApplyAmboDissection(shape, cell.id)),
    getCellTopologyLabel,
  );
  const lineageSummary = getGeneratedMidpointLineageSummary(shape);

  console.log(`\n[${label}]`);
  console.log(`shape: ${shape.id}`);
  console.log(`generation depth: ${shape.genealogy.generationDepth}`);
  console.log(`cells: ${shape.cells.length}`);
  console.log(
    `lifecycle: active=${lifecycleCounts.active} expanded=${lifecycleCounts.expanded} ` +
      `historical=${lifecycleCounts.historical} unknown=${lifecycleCounts.unknown}`,
  );
  console.log(`kinds: ${formatCounts(kindCounts)}`);
  console.log(`topologies: ${formatCounts(topologyCounts)}`);
  console.log(
    `unsupported active frontier: ${
      Object.keys(unsupportedActiveCounts).length ? formatCounts(unsupportedActiveCounts) : 'none'
    }`,
  );
  console.log(
    `operable active cells: ${operableCells.length}; lifecycle guard excludes ` +
      `${engineValidNonActiveCells.length} non-active engine-valid cell(s)`,
  );
  console.log(
    `generated midpoint packet lineage: ${lineageSummary.valid}/${lineageSummary.total} structurally valid`,
  );

  if (lineageSummary.invalid.length) {
    recordFailure(
      `${shape.id}: ${lineageSummary.invalid.length} generated midpoint vertex packet lineage issue(s)`,
    );
  }

  printActiveCellDetails(shape, activeCells);
}

function printActiveCellDetails(shape, activeCells) {
  if (!activeCells.length) {
    console.log('active cell details: none');
    return;
  }

  console.log('active cell details:');

  for (const cell of activeCells) {
    const signature = getCellTopologySignature(shape, cell);
    const engineValid = canApplyAmboDissection(shape, cell.id);

    console.log(
      `  - ${describeCell(cell)} ${signature.vertexCount}V ${signature.edgeCount}E ` +
        `${signature.faceCount}F faces=${formatHistogram(signature.faceSizeHistogram)} ` +
        `degrees=${formatHistogram(signature.vertexDegreeHistogram)} ` +
        `readiness=${signature.readinessStatus} engine=${engineValid ? 'valid' : 'unsupported'}`,
    );
  }
}

function getGeneratedMidpointLineageSummary(shape) {
  const generatedMidpoints = Object.values(shape.vertices).filter(
    (vertex) => vertex.createdBy.operation === 'ambo-dissection' && vertex.createdBy.sourceEdgeId,
  );
  const invalid = [];
  let valid = 0;

  for (const vertex of generatedMidpoints) {
    const lineage = vertex.data?.lineage;
    const sources = lineage?.sources ?? [];
    const edgeSources = sources.filter((source) => source.kind === 'edge');
    const vertexSources = sources.filter((source) => source.kind === 'vertex');
    const hasEndpointVertices =
      vertex.createdBy.sourceVertexIds.length >= 2 &&
      vertex.createdBy.sourceVertexIds.every((vertexId) =>
        vertexSources.some((source) => source.id === vertexId),
      );
    const hasSourceEdge = edgeSources.some((source) => source.id === vertex.createdBy.sourceEdgeId);
    const structurallyValid =
      lineage?.inheritanceMode === 'derived-from-edge' && hasSourceEdge && hasEndpointVertices;

    if (structurallyValid) {
      valid += 1;
    } else {
      invalid.push(vertex.id);
    }
  }

  return {
    invalid,
    total: generatedMidpoints.length,
    valid,
  };
}

function step(label, select) {
  return { label, select };
}

function selectSeedCell(shape) {
  return selectActiveCell({ kind: 'seed' })(shape);
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

function countCellsByLifecycle(shape) {
  const counts = { active: 0, expanded: 0, historical: 0, unknown: 0 };

  for (const cell of shape.cells) {
    counts[getCellLifecycleStatus(shape, cell.id)] += 1;
  }

  return counts;
}

function countBy(values, getKey) {
  return values.reduce((counts, value) => {
    const key = getKey(value);

    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
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

function shortenId(id) {
  return id.length > 28 ? `${id.slice(0, 13)}...${id.slice(-8)}` : id;
}

function formatCounts(counts) {
  const entries = Object.entries(counts).sort(([a], [b]) => a.localeCompare(b));

  if (!entries.length) {
    return 'none';
  }

  return entries.map(([key, count]) => `${key}:${count}`).join(' ');
}

function formatHistogram(histogram) {
  const entries = Object.entries(histogram).sort(([a], [b]) => Number(a) - Number(b));

  if (!entries.length) {
    return 'none';
  }

  return entries.map(([size, count]) => `${size}:${count}`).join(',');
}

function printDivider(label) {
  console.log('');
  console.log(`=== ${label} ===`);
}

function recordFailure(message) {
  failures.push(message);
}
