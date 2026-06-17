export type PSimplexVec3 = [number, number, number];

export const PSIMPLEX_EPSILON = 1e-9;
export const PSIMPLEX_ZERO_VEC3: PSimplexVec3 = [0, 0, 0];

export interface PSimplexFiniteWinnerResult<T> {
  minimumValue: number;
  winningEntries: T[];
}

export function addVec3(left: PSimplexVec3, right: PSimplexVec3): PSimplexVec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

export function subVec3(left: PSimplexVec3, right: PSimplexVec3): PSimplexVec3 {
  return [left[0] - right[0], left[1] - right[1], left[2] - right[2]];
}

export function scaleVec3(value: PSimplexVec3, scale: number): PSimplexVec3 {
  return [value[0] * scale, value[1] * scale, value[2] * scale];
}

export function dotVec3(left: PSimplexVec3, right: PSimplexVec3): number {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

export function normSquaredVec3(value: PSimplexVec3): number {
  return dotVec3(value, value);
}

export function normVec3(value: PSimplexVec3): number {
  return Math.sqrt(normSquaredVec3(value));
}

export function normalizeVec3(value: PSimplexVec3, epsilon = PSIMPLEX_EPSILON): PSimplexVec3 {
  const magnitude = normVec3(value);

  if (magnitude <= epsilon) {
    return copyVec3(PSIMPLEX_ZERO_VEC3);
  }

  return scaleVec3(value, 1 / magnitude);
}

export function normalizeVec3OrNull(value: PSimplexVec3, epsilon = PSIMPLEX_EPSILON): PSimplexVec3 | null {
  const magnitude = normVec3(value);

  if (magnitude <= epsilon) {
    return null;
  }

  return scaleVec3(value, 1 / magnitude);
}

export function sumVec3(values: readonly PSimplexVec3[]): PSimplexVec3 {
  return values.reduce<PSimplexVec3>((sum, value) => addVec3(sum, value), copyVec3(PSIMPLEX_ZERO_VEC3));
}

export function isNearZeroVec3(value: PSimplexVec3, epsilon = PSIMPLEX_EPSILON): boolean {
  return normVec3(value) <= epsilon;
}

export function projectionScalarOntoAxis(value: PSimplexVec3, axis: PSimplexVec3): number {
  return dotVec3(value, normalizeVec3(axis));
}

export function projectionOntoAxis(value: PSimplexVec3, axis: PSimplexVec3): PSimplexVec3 {
  const normalizedAxis = normalizeVec3(axis);

  return scaleVec3(normalizedAxis, dotVec3(value, normalizedAxis));
}

export function transverseResidual(value: PSimplexVec3, axis: PSimplexVec3): PSimplexVec3 {
  return subVec3(value, projectionOntoAxis(value, axis));
}

export function axisAlignmentScore(value: PSimplexVec3, axis: PSimplexVec3): number {
  const normalizedValue = normalizeVec3OrNull(value);
  const normalizedAxis = normalizeVec3OrNull(axis);

  if (!normalizedValue || !normalizedAxis) {
    return 0;
  }

  return Math.abs(dotVec3(normalizedValue, normalizedAxis));
}

export function copyVec3(value: PSimplexVec3): PSimplexVec3 {
  return [value[0], value[1], value[2]];
}

export function cleanVec3(value: PSimplexVec3): PSimplexVec3 {
  return [cleanNumber(value[0]), cleanNumber(value[1]), cleanNumber(value[2])];
}

export function cleanNumber(value: number): number {
  if (Math.abs(value) <= PSIMPLEX_EPSILON) {
    return 0;
  }

  return Number(value.toFixed(12));
}

export function nearlyEqual(left: number, right: number, epsilon = PSIMPLEX_EPSILON): boolean {
  return Math.abs(left - right) <= epsilon;
}

export function allNearlyEqual(values: readonly number[], expected: number, epsilon = PSIMPLEX_EPSILON): boolean {
  return values.length > 0 && values.every((value) => nearlyEqual(value, expected, epsilon));
}

export function finiteMinimumWinners<T>(
  entries: readonly T[],
  valueForEntry: (entry: T) => number,
  epsilon = PSIMPLEX_EPSILON,
): PSimplexFiniteWinnerResult<T> {
  const minimumValue = Math.min(...entries.map(valueForEntry));
  const winningEntries = entries.filter((entry) => Math.abs(valueForEntry(entry) - minimumValue) <= epsilon);

  return { minimumValue, winningEntries };
}
