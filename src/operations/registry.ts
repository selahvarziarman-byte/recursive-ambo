import { amboDissectionOperation } from './amboDissectionOperation';
import { pyritohedralDiagonalizationOperation } from './pyritohedralDiagonalizationOperation';
import type { GeometryOperation } from './types';

export const registeredOperations: GeometryOperation[] = [
  amboDissectionOperation,
  pyritohedralDiagonalizationOperation,
];

export const operationRegistry: Record<string, GeometryOperation> = Object.fromEntries(
  registeredOperations.map((operation) => [operation.id, operation]),
);

export const defaultOperation = amboDissectionOperation;

export function getOperation(operationId: string): GeometryOperation | null {
  return operationRegistry[operationId] ?? null;
}
