import { applyAmboDissection, canApplyAmboDissection } from '../lib/ambo';
import type { GeometryOperation, OperationContext } from './types';

export const amboDissectionOperation: GeometryOperation = {
  id: 'ambo-dissection',
  label: 'Ambo Dissection',
  description: 'Dissect supported tetrahedron and octahedron cells.',
  supportedTargets: [
    { cellKind: 'seed', topology: 'tetrahedron' },
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

    if (context.selectedCell?.kind === 'seed') {
      return 'Ready to dissect selected seed tetrahedron.';
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
