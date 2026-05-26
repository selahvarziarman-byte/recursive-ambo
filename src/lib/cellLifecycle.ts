import type { Cell, CellId, Shape } from '../types/geometry';

export type CellLifecycleStatus = 'active' | 'expanded' | 'historical' | 'unknown';

export function isCellExpanded(shape: Shape, cellId: CellId): boolean {
  return shape.cells.some((cell) => cell.parentCellId === cellId);
}

export function isCellActiveFrontier(shape: Shape, cellId: CellId): boolean {
  return getCellLifecycleStatus(shape, cellId) === 'active';
}

export function getCellLifecycleStatus(shape: Shape, cellId: CellId): CellLifecycleStatus {
  const cell = shape.cells.find((candidate) => candidate.id === cellId);

  if (!cell) {
    return 'unknown';
  }

  if (isCellExpanded(shape, cellId)) {
    return 'expanded';
  }

  if (cell.kind === 'parent') {
    return 'historical';
  }

  return 'active';
}

export function getCellChildCount(shape: Shape, cellId: CellId): number {
  return shape.cells.filter((cell) => cell.parentCellId === cellId).length;
}

export function getCellLifecycleStatusLabel(status: CellLifecycleStatus): string {
  if (status === 'active') {
    return 'active';
  }

  if (status === 'expanded') {
    return 'expanded parent';
  }

  if (status === 'historical') {
    return 'historical';
  }

  return 'unknown';
}

export function isExpandedOrHistoricalCell(shape: Shape, cell: Cell): boolean {
  const status = getCellLifecycleStatus(shape, cell.id);

  return status === 'expanded' || status === 'historical';
}
