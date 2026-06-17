import {
  dotVec3,
  normSquaredVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexPotentialDirectionStatus =
  | 'axis-well-direction'
  | 'a3-transition-direction'
  | 'high-mixing-direction'
  | 'unexpected-direction-level';

export const PSIMPLEX_LG_LAMBDA = 1;
export const PSIMPLEX_LG_MU = 1;
export const PSIMPLEX_LG_V = 1;
export const PSIMPLEX_AXIS_ANISOTROPY = 0;
export const PSIMPLEX_A3_ANISOTROPY = 0.25;
export const PSIMPLEX_BODY_DIAGONAL_ANISOTROPY = 1 / 3;

export function pSimplexRadialTerm(phi: PSimplexVec3): number {
  return PSIMPLEX_LG_LAMBDA * (normSquaredVec3(phi) - PSIMPLEX_LG_V * PSIMPLEX_LG_V) ** 2;
}

export function pSimplexAnisotropyTerm(phi: PSimplexVec3): number {
  const [x, y, z] = phi;

  return PSIMPLEX_LG_MU * (x * x * y * y + y * y * z * z + z * z * x * x);
}

export function classifyPotentialDirectionStatus(
  anisotropy: number,
  epsilon = 1e-9,
): PSimplexPotentialDirectionStatus {
  if (Math.abs(anisotropy - PSIMPLEX_AXIS_ANISOTROPY) <= epsilon) {
    return 'axis-well-direction';
  }

  if (Math.abs(anisotropy - PSIMPLEX_A3_ANISOTROPY) <= epsilon) {
    return 'a3-transition-direction';
  }

  if (Math.abs(anisotropy - PSIMPLEX_BODY_DIAGONAL_ANISOTROPY) <= epsilon) {
    return 'high-mixing-direction';
  }

  return 'unexpected-direction-level';
}

export function pSimplexFiniteResponseEnergy(n: PSimplexVec3, sourceDriveJHat: PSimplexVec3 | null, s: number): number {
  return pSimplexAnisotropyTerm(n) - (sourceDriveJHat ? s * dotVec3(sourceDriveJHat, n) : 0);
}

export function pSimplexFiniteResponseEnergyFromAnisotropy(
  anisotropy: number,
  n: PSimplexVec3,
  sourceDriveJHat: PSimplexVec3 | null,
  s: number,
): number {
  return anisotropy - (sourceDriveJHat ? s * dotVec3(sourceDriveJHat, n) : 0);
}
