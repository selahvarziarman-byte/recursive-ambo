import {
  cleanNumber,
  dotVec3,
  finiteMinimumWinners,
  normalizeVec3OrNull,
  type PSimplexVec3,
} from './pSimplexVectorMath';
import {
  buildPSimplexA3RootDirections,
  buildPSimplexBodyDiagonalDirections,
  buildPSimplexChildAxisDirections,
} from './pSimplexCoreGeometry';
import {
  pSimplexFiniteResponseEnergyFromAnisotropy,
  PSIMPLEX_A3_ANISOTROPY,
  PSIMPLEX_AXIS_ANISOTROPY,
  PSIMPLEX_BODY_DIAGONAL_ANISOTROPY,
} from './pSimplexVectorLGCore';

export type PSimplexRuntimeResponseDirectionClass =
  | 'axis-well'
  | 'a3-transition'
  | 'body-diagonal-high-mixing';

export interface PSimplexRuntimeResponseDirection {
  responseDirectionId: string;
  responseDirectionClass: PSimplexRuntimeResponseDirectionClass;
  n: PSimplexVec3;
  anisotropy: number;
}

export interface PSimplexRuntimeAnisotropyLabeledResponseDirection
  extends PSimplexRuntimeResponseDirection {
  expectedAnisotropy: number;
}

export interface PSimplexCandidateEnergy<TDirection extends PSimplexRuntimeResponseDirection> {
  direction: TDirection;
  energy: number;
}

export interface PSimplexFiniteResponseComparison<TDirection extends PSimplexRuntimeResponseDirection> {
  energies: Array<PSimplexCandidateEnergy<TDirection>>;
  minimumEnergy: number;
  winningEntries: Array<PSimplexCandidateEnergy<TDirection>>;
  winningResponseDirectionIds: string[];
  winningResponseClasses: PSimplexRuntimeResponseDirectionClass[];
  energyByResponseClass: {
    axisWellMin: number;
    a3TransitionMin: number;
    bodyDiagonalMin: number;
  };
}

export interface PSimplexSourceDrive {
  J: PSimplexVec3;
  JHat: PSimplexVec3 | null;
  normJ: number;
}

export interface PSimplexBestDirectionMatch {
  directionId: string | null;
  alignment: number;
}

export const PSIMPLEX_A3_AXIS_TO_A3_THRESHOLD = 0.25 / (1 - 1 / Math.sqrt(2));
export const PSIMPLEX_BODY_AXIS_TO_BODY_THRESHOLD = (1 / 3) / (1 - 1 / Math.sqrt(3));
export const PSIMPLEX_BODY_A3_TO_BODY_REFERENCE_THRESHOLD = (1 / 12) / (1 - Math.sqrt(2 / 3));

export function buildPSimplexFiniteResponseDirections(): PSimplexRuntimeAnisotropyLabeledResponseDirection[] {
  return [
    ...buildPSimplexChildAxisDirections().map((row) => ({
      responseDirectionId: row.directionId,
      responseDirectionClass: 'axis-well' as const,
      n: row.normalizedDirection,
      anisotropy: PSIMPLEX_AXIS_ANISOTROPY,
      expectedAnisotropy: PSIMPLEX_AXIS_ANISOTROPY,
    })),
    ...buildPSimplexA3RootDirections().map((row) => ({
      responseDirectionId: row.directionId,
      responseDirectionClass: 'a3-transition' as const,
      n: row.normalizedDirection,
      anisotropy: PSIMPLEX_A3_ANISOTROPY,
      expectedAnisotropy: PSIMPLEX_A3_ANISOTROPY,
    })),
    ...buildPSimplexBodyDiagonalDirections().map((row) => ({
      responseDirectionId: row.directionId,
      responseDirectionClass: 'body-diagonal-high-mixing' as const,
      n: row.normalizedDirection,
      anisotropy: PSIMPLEX_BODY_DIAGONAL_ANISOTROPY,
      expectedAnisotropy: PSIMPLEX_BODY_DIAGONAL_ANISOTROPY,
    })),
  ];
}

export function buildSourceDrive(J: PSimplexVec3): PSimplexSourceDrive {
  const JHat = normalizeVec3OrNull(J);

  return {
    J,
    JHat,
    normJ: JHat ? Math.sqrt(J[0] * J[0] + J[1] * J[1] + J[2] * J[2]) : 0,
  };
}

export function compareFiniteResponseDirections<TDirection extends PSimplexRuntimeResponseDirection>(
  directions: readonly TDirection[],
  sourceDriveJHat: PSimplexVec3 | null,
  s: number,
  epsilon = 1e-9,
): PSimplexFiniteResponseComparison<TDirection> {
  const energies = directions.map((direction) => ({
    direction,
    energy: pSimplexFiniteResponseEnergyFromAnisotropy(direction.anisotropy, direction.n, sourceDriveJHat, s),
  }));
  const { minimumValue, winningEntries } = finiteMinimumWinners(energies, (entry) => entry.energy, epsilon);

  return {
    energies,
    minimumEnergy: minimumValue,
    winningEntries,
    winningResponseDirectionIds: winningEntries.map((entry) => entry.direction.responseDirectionId),
    winningResponseClasses: uniqueResponseClasses(winningEntries.map((entry) => entry.direction.responseDirectionClass)),
    energyByResponseClass: {
      axisWellMin: classMinimumEnergy(energies, 'axis-well'),
      a3TransitionMin: classMinimumEnergy(energies, 'a3-transition'),
      bodyDiagonalMin: classMinimumEnergy(energies, 'body-diagonal-high-mixing'),
    },
  };
}

export function classMinimumEnergy<TDirection extends PSimplexRuntimeResponseDirection>(
  energies: Array<PSimplexCandidateEnergy<TDirection>>,
  responseClass: PSimplexRuntimeResponseDirectionClass,
): number {
  return Math.min(
    ...energies.filter((entry) => entry.direction.responseDirectionClass === responseClass).map((entry) => entry.energy),
  );
}

export function uniqueResponseClasses(
  values: readonly PSimplexRuntimeResponseDirectionClass[],
): PSimplexRuntimeResponseDirectionClass[] {
  return [...new Set(values)];
}

export function bestDirectionMatch<TDirection extends PSimplexRuntimeResponseDirection>(
  directions: readonly TDirection[],
  responseClass: PSimplexRuntimeResponseDirectionClass,
  sourceDriveJHat: PSimplexVec3 | null,
): PSimplexBestDirectionMatch {
  if (!sourceDriveJHat) {
    return { directionId: null, alignment: 0 };
  }

  const classRows = directions.filter((row) => row.responseDirectionClass === responseClass);
  const best = classRows.reduce<{ direction: TDirection; alignment: number } | null>((currentBest, row) => {
    const alignment = dotVec3(sourceDriveJHat, row.n);

    if (!currentBest || alignment > currentBest.alignment) {
      return { direction: row, alignment };
    }

    return currentBest;
  }, null);

  return {
    directionId: best?.direction.responseDirectionId ?? null,
    alignment: cleanNumber(best?.alignment ?? 0),
  };
}
