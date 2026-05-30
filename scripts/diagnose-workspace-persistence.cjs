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
const { buildDualUniverseRenderGeometry } = require(path.join(repoRoot, 'src/lib/dualView.ts'));
const {
  parseWorkspaceImport,
  serializeWorkspaceSnapshot,
  validateWorkspaceImport,
} = require(path.join(repoRoot, 'src/lib/workspacePersistence.ts'));
const { useGeometryStore } = require(path.join(repoRoot, 'src/store/geometryStore.ts'));

const failures = [];

console.log('Workspace persistence diagnostics');
console.log('');

verifyWorkspaceRoundTrip();
verifyValidationFailure();

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

function verifyWorkspaceRoundTrip() {
  printDivider('workspace export/import round trip');

  const seedShape = createSeedShape('tetrahedron');
  const firstShape = applyAmboDissection(seedShape, seedShape.cells[0].id);
  const octahedron = requireActiveCell(firstShape, { kind: 'core', topology: 'octahedron' });

  if (!octahedron) {
    return;
  }

  const secondShape = applyAmboDissection(firstShape, octahedron.id);
  const cuboctahedron = requireActiveCell(secondShape, {
    kind: 'core',
    topology: 'cuboctahedron',
  });

  if (!cuboctahedron) {
    return;
  }

  const selectedVertexId = cuboctahedron.vertexIds[0];
  const selectedVertex = secondShape.vertices[selectedVertexId];

  expect(Boolean(selectedVertex), 'round trip: expected selected vertex to exist');

  if (!selectedVertex) {
    return;
  }

  const editedShape = {
    ...secondShape,
    vertices: {
      ...secondShape.vertices,
      [selectedVertexId]: {
        ...selectedVertex,
        data: {
          ...selectedVertex.data,
          label: 'Persisted packet vertex',
          notes: 'Packet notes survive workspace JSON import.',
          tags: ['persisted', 'diagnostic'],
          custom: {
            ...selectedVertex.data.custom,
            title: 'Round Trip Packet',
          },
        },
      },
    },
  };
  const shapeOrder = [seedShape.id, firstShape.id, editedShape.id];
  const shapes = {
    [seedShape.id]: seedShape,
    [firstShape.id]: firstShape,
    [editedShape.id]: editedShape,
  };
  const operationHistory = [
    historyEntry(0, 'Seed: Tetrahedron', 'seed', seedShape, seedShape.cells[0]),
    historyEntry(1, 'Ambo Dissection', 'ambo-dissection', firstShape, seedShape.cells[0]),
    historyEntry(2, 'Ambo Dissection', 'ambo-dissection', editedShape, octahedron),
  ];
  const workspace = serializeWorkspaceSnapshot(
    {
      selectedSeedKey: 'tetrahedron',
      shapes,
      shapeOrder,
      currentShapeId: editedShape.id,
      selectedCellId: cuboctahedron.id,
      selectedVertexId,
      operationHistory,
      historySequence: 2,
      cellVisibility: {
        showCoreCells: true,
        showResidueCells: false,
        showParentCells: true,
      },
      viewLayout: {
        explodeAmount: 0.35,
        dualViewEnabled: true,
        isolateSelectedCell: false,
      },
    },
    '2026-05-30T00:00:00.000Z',
  );
  const serialized = JSON.stringify(workspace, null, 2);
  const parsedJson = JSON.parse(serialized);
  const validation = validateWorkspaceImport(parsedJson);

  expect(validation.ok, 'round trip: exported workspace should validate');

  const parsedWorkspace = parseWorkspaceImport(parsedJson);
  const staleSnapshot = {
    selectedSeedKey: 'cube',
    shapes: { [seedShape.id]: seedShape },
    shapeOrder: [seedShape.id],
    currentShapeId: seedShape.id,
    selectedCellId: null,
    selectedVertexId: null,
  };

  useGeometryStore.setState({
    undoStack: [staleSnapshot],
    redoStack: [staleSnapshot],
    redoOperationHistory: [operationHistory[0]],
    hoverTarget: { kind: 'cell', cellId: seedShape.cells[0].id },
    dualInspectionTarget: {
      universe: 'dual',
      modelKind: 'correspondence',
      kind: 'face',
      sourceCellId: cuboctahedron.id,
      dualModelId: 'dual-model:stale',
      dualFaceId: 'face:stale',
      sourceVertexId: selectedVertexId,
    },
  });

  try {
    useGeometryStore.getState().importWorkspace(parsedWorkspace);
  } catch (error) {
    recordFailure(`round trip: store import threw ${formatError(error)}`);
    return;
  }

  const importedState = useGeometryStore.getState();
  const importedShape = importedState.shapes[importedState.currentShapeId];
  const importedCell = importedShape?.cells.find((cell) => cell.id === cuboctahedron.id) ?? null;
  const importedVertex = importedShape?.vertices[selectedVertexId];

  expect(importedState.currentShapeId === editedShape.id, 'round trip: current shape id was not preserved');
  expect(
    importedState.shapeOrder.join('|') === shapeOrder.join('|'),
    'round trip: shapeOrder was not preserved',
  );
  expect(Object.keys(importedState.shapes).length === shapeOrder.length, 'round trip: shape count changed');
  expect(importedShape?.cells.length === editedShape.cells.length, 'round trip: cell count changed');
  expect(
    Object.keys(importedShape?.vertices ?? {}).length === Object.keys(editedShape.vertices).length,
    'round trip: vertex count changed',
  );
  expect(importedVertex?.data.label === 'Persisted packet vertex', 'round trip: vertex packet label changed');
  expect(
    importedVertex?.data.custom?.title === 'Round Trip Packet',
    'round trip: vertex packet custom title changed',
  );
  expect(importedState.selectedCellId === cuboctahedron.id, 'round trip: selected cell was not preserved');
  expect(importedState.selectedVertexId === selectedVertexId, 'round trip: selected vertex was not preserved');
  expect(importedState.operationHistory.length === operationHistory.length, 'round trip: operation history changed');
  expect(importedState.historySequence === 2, 'round trip: history sequence changed');
  expect(importedState.cellVisibility.showResidueCells === false, 'round trip: cell visibility changed');
  expect(importedState.viewLayout.dualViewEnabled === true, 'round trip: view layout changed');
  expect(importedState.undoStack.length === 0, 'round trip: undo stack should be cleared');
  expect(importedState.redoStack.length === 0, 'round trip: redo stack should be cleared');
  expect(importedState.redoOperationHistory.length === 0, 'round trip: redo operation history should be cleared');
  expect(importedState.hoverTarget === null, 'round trip: hover target should be cleared');
  expect(importedState.dualInspectionTarget === null, 'round trip: dual inspection target should be cleared');

  if (importedShape && importedCell) {
    const renderGeometry = buildDualUniverseRenderGeometry(importedShape, importedCell);

    expect(
      renderGeometry.kind === 'correspondence-proxy',
      'round trip: correspondence render model did not rebuild after import',
    );
    expect(
      renderGeometry.kind !== 'correspondence-proxy' || renderGeometry.topology === 'rhombic-dodecahedron',
      'round trip: imported cuboctahedron rendered wrong dual topology',
    );
  } else {
    recordFailure('round trip: imported selected cell was missing');
  }

  console.log(
    `imported workspace: ${shapeOrder.length} shapes, ${editedShape.cells.length} current cells, ` +
      `${Object.keys(editedShape.vertices).length} current vertices`,
  );
}

function verifyValidationFailure() {
  printDivider('workspace validation failure');

  const seedShape = createSeedShape('tetrahedron');
  const invalidWorkspace = serializeWorkspaceSnapshot(
    {
      selectedSeedKey: 'tetrahedron',
      shapes: { [seedShape.id]: seedShape },
      shapeOrder: [seedShape.id],
      currentShapeId: seedShape.id,
      selectedCellId: null,
      selectedVertexId: null,
      operationHistory: [],
      historySequence: 0,
    },
    '2026-05-30T00:00:00.000Z',
  );

  invalidWorkspace.currentShapeId = 'shape:missing';

  const validation = validateWorkspaceImport(invalidWorkspace);

  expect(!validation.ok, 'validation failure: malformed workspace should not validate');
  console.log('invalid workspace rejected');
}

function historyEntry(sequence, label, operationId, shape, targetCell) {
  return {
    id: `history:${sequence}`,
    label,
    operationId,
    targetCellId: targetCell?.id ?? null,
    targetTopology: targetCell?.topology ?? null,
    generationDepth: shape.genealogy.generationDepth,
    producedCellCount: shape.cells.length,
    shapeId: shape.id,
    createdAt: shape.genealogy.createdAt,
  };
}

function requireActiveCell(shape, { kind, topology }) {
  const cell = shape.cells.find(
    (candidate) =>
      candidate.kind === kind &&
      candidate.topology === topology &&
      !shape.cells.some((other) => other.parentCellId === candidate.id),
  ) ?? null;

  expect(Boolean(cell), `missing active ${kind}/${topology}`);

  return cell;
}

function printDivider(label) {
  console.log('');
  console.log(`=== ${label} ===`);
}

function expect(condition, message) {
  if (!condition) {
    recordFailure(message);
  }
}

function recordFailure(message) {
  failures.push(message);
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}
