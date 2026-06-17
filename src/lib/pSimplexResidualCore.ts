import {
  cleanNumber,
  cleanVec3,
  dotVec3,
  normalizeVec3OrNull,
  normVec3,
  PSIMPLEX_EPSILON,
  projectionScalarOntoAxis,
  transverseResidual,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexResidualProbeCase = 'R0' | 'R1' | 'R2' | 'R3' | 'R4' | 'R5';
export type PSimplexResidualStatus =
  | 'no-residual'
  | 'A3-root-aligned-residual'
  | 'A3-root-composite-residual'
  | 'octa-axis-leakage'
  | 'mixed-residual'
  | 'unclassified-residual'
  | 'axis-clean-secondary-residual'
  | 'axis-suppressed-residual';

export interface PSimplexResidualRootCandidate {
  rootId: string;
  normalizedDirection: PSimplexVec3;
}

export interface PSimplexResidualDecomposition {
  p: number;
  residualVector: PSimplexVec3;
  residualMagnitude: number;
  alpha: number;
}

export interface PSimplexResidualRootAlignment {
  bestMatchingRootId: string | null;
  bestMatchingRootDirection: PSimplexVec3 | null;
  rootAlignmentScoreBeta: number;
  substantialRootProjectionCount: number;
}

export interface PSimplexResidualClassificationInput {
  probeCase: PSimplexResidualProbeCase;
  residualMagnitude: number;
  beta: number;
  octaAxisLeakageScore: number;
  substantialRootProjectionCount: number;
  rootAlignmentThreshold?: number;
}

export const PSIMPLEX_ROOT_ALIGNMENT_THRESHOLD = 0.9;

export function decomposeSourceDriveAgainstAxis(
  sourceDriveJ: PSimplexVec3,
  childAxis: PSimplexVec3,
): PSimplexResidualDecomposition {
  const p = projectionScalarOntoAxis(sourceDriveJ, childAxis);
  const residualVector = transverseResidual(sourceDriveJ, childAxis);
  const residualMagnitude = normVec3(residualVector);
  const sourceNorm = normVec3(sourceDriveJ);
  const alpha = sourceNorm > 0 ? Math.abs(p) / sourceNorm : 0;

  return {
    p: cleanNumber(p),
    residualVector: cleanVec3(residualVector),
    residualMagnitude: cleanNumber(residualMagnitude),
    alpha: cleanNumber(alpha),
  };
}

export function bestResidualRootAlignment(
  residualVector: PSimplexVec3,
  rootCandidates: readonly PSimplexResidualRootCandidate[],
  substantialProjectionThreshold = PSIMPLEX_ROOT_ALIGNMENT_THRESHOLD,
): PSimplexResidualRootAlignment {
  const residualMagnitude = normVec3(residualVector);

  if (residualMagnitude <= PSIMPLEX_EPSILON) {
    return {
      bestMatchingRootId: null,
      bestMatchingRootDirection: null,
      rootAlignmentScoreBeta: 0,
      substantialRootProjectionCount: 0,
    };
  }

  const residualDirection = normalizeVec3OrNull(residualVector);
  const scored = rootCandidates.flatMap((candidate) => {
    const candidateDirection = normalizeVec3OrNull(candidate.normalizedDirection);

    if (!residualDirection || !candidateDirection) {
      return [];
    }

    const signedAlignment = dotVec3(residualDirection, candidateDirection);

    return [
      {
        ...candidate,
        normalizedDirection: candidateDirection,
        signedAlignment,
        beta: Math.abs(signedAlignment),
      },
    ];
  });

  if (scored.length === 0) {
    return {
      bestMatchingRootId: null,
      bestMatchingRootDirection: null,
      rootAlignmentScoreBeta: 0,
      substantialRootProjectionCount: 0,
    };
  }

  const best = scored.reduce((currentBest, candidate) =>
    candidate.signedAlignment > currentBest.signedAlignment ? candidate : currentBest,
  );
  const bestIsPositivelyOriented = best.signedAlignment > PSIMPLEX_EPSILON;

  return {
    bestMatchingRootId: bestIsPositivelyOriented ? best.rootId : null,
    bestMatchingRootDirection: bestIsPositivelyOriented ? cleanVec3(best.normalizedDirection) : null,
    rootAlignmentScoreBeta: cleanNumber(best.beta),
    substantialRootProjectionCount: scored.filter((candidate) => candidate.beta >= substantialProjectionThreshold).length,
  };
}

export function classifyResidualStatus(input: PSimplexResidualClassificationInput): PSimplexResidualStatus {
  const threshold = input.rootAlignmentThreshold ?? PSIMPLEX_ROOT_ALIGNMENT_THRESHOLD;

  if (input.residualMagnitude <= PSIMPLEX_EPSILON) {
    return 'no-residual';
  }

  if (['R1', 'R2', 'R3'].includes(input.probeCase) && input.beta >= threshold) {
    return 'A3-root-aligned-residual';
  }

  if (input.probeCase === 'R4') {
    return input.octaAxisLeakageScore > input.beta ? 'octa-axis-leakage' : 'mixed-residual';
  }

  if (input.probeCase === 'R5') {
    if (input.beta < threshold && input.substantialRootProjectionCount >= 2) {
      return 'A3-root-composite-residual';
    }

    return 'mixed-residual';
  }

  return input.beta >= threshold ? 'mixed-residual' : 'unclassified-residual';
}
