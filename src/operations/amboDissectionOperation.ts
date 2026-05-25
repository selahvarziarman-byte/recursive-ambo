import { applyAmboDissection, canApplyAmboDissection } from '../lib/ambo';
import type { Cell } from '../types/geometry';
import type { GeometryOperation, OperationContext } from './types';

export const amboDissectionOperation: GeometryOperation = {
  id: 'ambo-dissection',
  label: 'Ambo Dissection',
  description: 'Dissect supported tetrahedron and octahedron cells.',
  supportedTargets: [
    { cellKind: 'seed', topology: 'tetrahedron' },
    { cellKind: 'seed', topology: 'octahedron' },
    { cellKind: 'residue', topology: 'tetrahedron' },
    { cellKind: 'core', topology: 'octahedron' },
  ],
  canApply: (context) => canApplyAmboDissection(context.shape, context.selectedCellId),
  getDisabledReason: (context) => {
    if (hasMissingSelection(context)) {
      return 'Selected cell is no longer in the current workspace.';
    }

    if (canApplyAmboDissection(context.shape, context.selectedCellId)) {
      return null;
    }

    const { selectedCell } = context;
    const targetCell = getTargetCell(context);
    const targetTopology = targetCell ? describeTargetTopology(targetCell) : null;

    if (targetTopology === 'cube') {
      return 'Ambo Dissection for cube is not enabled yet.';
    }

    if (selectedCell?.kind === 'core') {
      return selectedCell.vertexIds.length === 12
        ? 'Cuboctahedron dissection is not implemented yet.'
        : 'Core cell dissection is not implemented yet.';
    }

    if (selectedCell?.kind === 'residue') {
      return selectedCell.vertexIds.length === 5
        ? 'Square-pyramid dissection is not implemented yet.'
        : 'Selected residue cell is not a supported tetrahedron.';
    }

    if (selectedCell?.kind === 'parent') {
      return 'Previous generation cells are inspection-only.';
    }

    return 'Select a cell to inspect. Further cell operations are not implemented yet.';
  },
  getStatusMessage: (context) => {
    const disabledReason = amboDissectionOperation.getDisabledReason(context);

    if (disabledReason) {
      return disabledReason;
    }

    if (context.selectedCell?.kind === 'core') {
      return 'Ready to dissect selected octahedron core.';
    }

    if (context.selectedCell?.kind === 'residue') {
      return 'Ready to dissect selected residue tetrahedron.';
    }

    const targetCell = getTargetCell(context);

    if (targetCell?.kind === 'seed') {
      return `Ready to dissect selected seed ${describeTargetTopology(targetCell) ?? 'cell'}.`;
    }

    return 'Ready to dissect the seed tetrahedron.';
  },
  execute: (context) => {
    if (!amboDissectionOperation.canApply(context)) {
      throw new Error('Ambo Dissection cannot be applied to the current selection.');
    }

    return applyAmboDissection(context.shape, context.selectedCellId);
  },
};

function hasMissingSelection({ selectedCellId, selectedCell }: OperationContext): boolean {
  return selectedCellId !== null && !selectedCell;
}

function getTargetCell({ shape, selectedCell }: OperationContext): Cell | null {
  return selectedCell ?? shape.cells.find((cell) => cell.kind === 'seed') ?? null;
}

function describeTargetTopology(cell: Cell): string | null {
  if (cell.topology) {
    return cell.topology;
  }

  if (cell.kind === 'core' && cell.vertexIds.length === 6) {
    return 'octahedron';
  }

  if (cell.kind === 'core' && cell.vertexIds.length === 12) {
    return 'cuboctahedron';
  }

  if ((cell.kind === 'seed' || cell.kind === 'residue') && cell.vertexIds.length === 4) {
    return 'tetrahedron';
  }

  if (cell.kind === 'residue' && cell.vertexIds.length === 5) {
    return 'square-pyramid';
  }

  return null;
}
