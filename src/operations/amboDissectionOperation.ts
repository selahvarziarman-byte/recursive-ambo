import { applyAmboDissection, canApplyAmboDissection } from '../lib/ambo';
import { isCellActiveFrontier, isExpandedOrHistoricalCell } from '../lib/cellLifecycle';
import type { Cell } from '../types/geometry';
import { shapeWords } from './shapeWords';
import type { GeometryOperation, OperationContext } from './types';

export const amboDissectionOperation: GeometryOperation = {
  id: 'ambo-dissection',
  label: 'Ambo Dissection',
  description: 'Dissect supported tetrahedron, octahedron, cube, cuboctahedron, square-pyramid, rectified-square-pyramid, and rectified-square-pyramid-ambo-core cells.',
  supportedTargets: [
    { cellKind: 'seed', topology: 'tetrahedron' },
    { cellKind: 'seed', topology: 'octahedron' },
    { cellKind: 'seed', topology: 'cube' },
    { cellKind: 'residue', topology: 'tetrahedron' },
    { cellKind: 'residue', topology: 'square-pyramid' },
    { cellKind: 'core', topology: 'octahedron' },
    { cellKind: 'core', topology: 'cuboctahedron' },
    { cellKind: 'core', topology: 'rectified-square-pyramid' },
    { cellKind: 'core', topology: 'rectified-square-pyramid-ambo-core' },
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
      return 'this cell is no longer in the workspace';
    }

    const { selectedCell } = context;
    const targetCell = getTargetCell(context);

    if (targetCell && isExpandedOrHistoricalCell(context.shape, targetCell)) {
      return 'this cell has already been dissected';
    }

    if (
      targetCell &&
      isCellActiveFrontier(context.shape, targetCell.id) &&
      canApplyAmboDissection(context.shape, targetCell.id)
    ) {
      return null;
    }

    // COPY-1 §5.5 — the reasons in words (the shape's name by P2)
    const targetTopology = targetCell ? describeTargetTopology(targetCell) : null;
    const unordered = (code: string): string => `Ambo can't dissect this ${shapeWords(code) ?? code}: its faces aren't ordered`;

    if (targetTopology === 'cube' || targetTopology === 'cuboctahedron' || targetTopology === 'rectified-square-pyramid' || targetTopology === 'rectified-square-pyramid-ambo-core' || targetTopology === 'square-pyramid') {
      return unordered(targetTopology);
    }

    if (targetTopology === 'rhombicuboctahedron') {
      return "Ambo doesn't dissect a rhombicuboctahedron yet";
    }

    if (selectedCell?.kind === 'core') {
      return selectedCell.vertexIds.length === 12 ? "Ambo doesn't dissect a cuboctahedron yet" : "Ambo doesn't dissect this core cell yet";
    }

    if (selectedCell?.kind === 'residue') {
      return selectedCell.vertexIds.length === 5 ? unordered('square-pyramid') : 'Ambo dissects a residue cell only when it is a tetrahedron';
    }

    if (selectedCell?.kind === 'parent') {
      // shadowed (a parent cell is always expanded or historical — the branch above answers first); the same fact, said the same way
      return 'this cell has already been dissected';
    }

    // two facts for the two cases that remain: no cell, or a cell nothing applies to
    return selectedCell ? 'no operation applies to this cell yet' : 'no cell selected';
  },
  getStatusMessage: (context) => {
    const disabledReason = amboDissectionOperation.getDisabledReason(context);

    if (disabledReason) {
      return disabledReason;
    }

    // COPY-1 §5.5 — `ready: the octahedron core` · `ready: the tetrahedron residue` · `ready: the seed tetrahedron` (with no
    // recorded shape, `ready: the core` · `ready: the residue` · `ready: the seed cell`)
    if (context.selectedCell?.kind === 'core') {
      const words = shapeWords(describeTargetTopology(context.selectedCell));
      return `ready: the ${words ? `${words} ` : ''}core`;
    }

    if (context.selectedCell?.kind === 'residue') {
      const words = shapeWords(describeTargetTopology(context.selectedCell));
      return `ready: the ${words ? `${words} ` : ''}residue`;
    }

    const targetCell = getTargetCell(context);

    if (targetCell?.kind === 'seed') {
      const words = shapeWords(describeTargetTopology(targetCell));
      return words ? `ready: the seed ${words}` : 'ready: the seed cell';
    }

    return 'ready: the seed tetrahedron';
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
