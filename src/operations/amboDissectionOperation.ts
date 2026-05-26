import { applyAmboDissection, canApplyAmboDissection } from '../lib/ambo';
import { isCellActiveFrontier, isExpandedOrHistoricalCell } from '../lib/cellLifecycle';
import type { Cell } from '../types/geometry';
import type { GeometryOperation, OperationContext } from './types';

export const amboDissectionOperation: GeometryOperation = {
  id: 'ambo-dissection',
  label: 'Ambo Dissection',
  description: 'Dissect supported tetrahedron, octahedron, cube, cuboctahedron, square-pyramid, and rectified-square-pyramid cells.',
  supportedTargets: [
    { cellKind: 'seed', topology: 'tetrahedron' },
    { cellKind: 'seed', topology: 'octahedron' },
    { cellKind: 'seed', topology: 'cube' },
    { cellKind: 'residue', topology: 'tetrahedron' },
    { cellKind: 'residue', topology: 'square-pyramid' },
    { cellKind: 'core', topology: 'octahedron' },
    { cellKind: 'core', topology: 'cuboctahedron' },
    { cellKind: 'core', topology: 'rectified-square-pyramid' },
  ],
  canApply: (context) => {
    const targetCell = getTargetCell(context);

    return Boolean(
      targetCell &&
        isCellActiveFrontier(context.shape, targetCell.id) &&
        canApplyAmboDissection(context.shape, targetCell.id),
    );
  },
  getDisabledReason: (context) => {
    if (hasMissingSelection(context)) {
      return 'Selected cell is no longer in the current workspace.';
    }

    const { selectedCell } = context;
    const targetCell = getTargetCell(context);

    if (targetCell && isExpandedOrHistoricalCell(context.shape, targetCell)) {
      return 'Cell has already been expanded.';
    }

    if (
      targetCell &&
      isCellActiveFrontier(context.shape, targetCell.id) &&
      canApplyAmboDissection(context.shape, targetCell.id)
    ) {
      return null;
    }

    const targetTopology = targetCell ? describeTargetTopology(targetCell) : null;

    if (targetTopology === 'cube') {
      return 'Selected cube does not have valid ordered topology for Ambo Dissection.';
    }

    if (targetTopology === 'cuboctahedron') {
      return 'Selected cuboctahedron does not have valid ordered topology for Ambo Dissection.';
    }

    if (targetTopology === 'rhombicuboctahedron') {
      return 'Ambo Dissection for rhombicuboctahedron is not enabled yet.';
    }

    if (targetTopology === 'rectified-square-pyramid') {
      return 'Selected rectified-square-pyramid does not have valid ordered topology for Ambo Dissection.';
    }

    if (targetTopology === 'rectified-square-pyramid-ambo-core') {
      return 'Ambo Dissection for rectified-square-pyramid-ambo-core is not enabled yet.';
    }

    if (targetTopology === 'square-pyramid') {
      return 'Selected square-pyramid does not have valid ordered topology for Ambo Dissection.';
    }

    if (selectedCell?.kind === 'core') {
      return selectedCell.vertexIds.length === 12
        ? 'Cuboctahedron dissection is not implemented yet.'
        : 'Core cell dissection is not implemented yet.';
    }

    if (selectedCell?.kind === 'residue') {
      return selectedCell.vertexIds.length === 5
        ? 'Selected square-pyramid does not have valid ordered topology for Ambo Dissection.'
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
      return `Ready to dissect selected ${describeTargetTopology(context.selectedCell) ?? 'core'} core.`;
    }

    if (context.selectedCell?.kind === 'residue') {
      return `Ready to dissect selected ${describeTargetTopology(context.selectedCell) ?? 'residue'} residue.`;
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

  if (cell.kind === 'core' && cell.vertexIds.length === 16) {
    return 'rectified-square-pyramid-ambo-core';
  }

  return null;
}
