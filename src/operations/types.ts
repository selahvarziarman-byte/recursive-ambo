import type { Cell, CellId, CellKind, Shape } from '../types/geometry';

export interface OperationContext {
  shape: Shape;
  selectedCellId: CellId | null;
  selectedCell: Cell | null;
}

export interface OperationTargetMetadata {
  cellKind: CellKind;
  topology: string;
}

export interface GeometryOperation {
  id: string;
  label: string;
  description: string;
  supportedTargets?: OperationTargetMetadata[];
  canApply: (context: OperationContext) => boolean;
  getDisabledReason: (context: OperationContext) => string | null;
  getStatusMessage?: (context: OperationContext) => string;
  execute: (context: OperationContext) => Shape;
}
