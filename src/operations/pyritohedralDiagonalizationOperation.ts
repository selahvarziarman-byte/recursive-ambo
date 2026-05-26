import {
  applyPyritohedralDiagonalization,
  canApplyPyritohedralDiagonalization,
} from '../lib/pyritohedralDiagonalization';
import { isCellActiveFrontier, isExpandedOrHistoricalCell } from '../lib/cellLifecycle';
import type { GeometryOperation, OperationContext } from './types';

export const pyritohedralDiagonalizationOperation: GeometryOperation = {
  id: 'pyritohedral-diagonalization',
  label: 'Pyritohedral Diagonalization',
  description:
    'Split the six square faces of an active cuboctahedron into a pyritohedral-icosahedron with construction diagonals.',
  supportedTargets: [{ cellKind: 'core', topology: 'cuboctahedron' }],
  canApply: (context) => {
    const { shape, selectedCell } = context;

    return Boolean(
      selectedCell &&
        selectedCell.kind === 'core' &&
        selectedCell.topology === 'cuboctahedron' &&
        isCellActiveFrontier(shape, selectedCell.id) &&
        canApplyPyritohedralDiagonalization(shape, selectedCell.id),
    );
  },
  getDisabledReason: (context) => {
    if (context.selectedCellId !== null && !context.selectedCell) {
      return 'Selected cell is no longer in the current workspace.';
    }

    const { shape, selectedCell } = context;

    if (!selectedCell) {
      return 'Select an active cuboctahedron core to apply Pyritohedral Diagonalization.';
    }

    if (isExpandedOrHistoricalCell(shape, selectedCell)) {
      return 'Cell has already been expanded.';
    }

    if (selectedCell.topology !== 'cuboctahedron' || selectedCell.kind !== 'core') {
      return 'Pyritohedral Diagonalization is only implemented for cuboctahedron core cells.';
    }

    if (!canApplyPyritohedralDiagonalization(shape, selectedCell.id)) {
      return 'Selected cuboctahedron does not have valid ordered topology or a coherent diagonal matching for Pyritohedral Diagonalization.';
    }

    return null;
  },
  getStatusMessage: (context) =>
    pyritohedralDiagonalizationOperation.getDisabledReason(context) ??
    'Ready to split the selected cuboctahedron into a pyritohedral-icosahedron.',
  execute: (context) => {
    if (!pyritohedralDiagonalizationOperation.canApply(context)) {
      throw new Error('Pyritohedral Diagonalization cannot be applied to the current selection.');
    }

    return applyPyritohedralDiagonalization(context.shape, context.selectedCellId);
  },
};
