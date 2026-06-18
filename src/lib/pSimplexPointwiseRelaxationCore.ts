import {
  addVec3,
  cleanNumber,
  cleanVec3,
  copyVec3,
  dotVec3,
  finiteMinimumWinners,
  normVec3,
  normalizeVec3OrNull,
  PSIMPLEX_EPSILON,
  scaleVec3,
  subVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';
import {
  buildPSimplexFiniteResponseDirections,
  type PSimplexRuntimeAnisotropyLabeledResponseDirection,
  type PSimplexRuntimeResponseDirectionClass,
} from './pSimplexResponseCore';
import {
  PSIMPLEX_LG_LAMBDA,
  PSIMPLEX_LG_MU,
  PSIMPLEX_LG_V,
  pSimplexAnisotropyTerm,
  pSimplexRadialTerm,
} from './pSimplexVectorLGCore';

export type PSimplexRelaxedResponseClass =
  | 'axis-relaxed-response'
  | 'A3-relaxed-response'
  | 'body-diagonal-relaxed-response'
  | 'intermediate-relaxed-response'
  | 'zero-drive-degenerate'
  | 'threshold-sensitive';

export type PSimplexPointwiseStopReason =
  | 'gradient-tolerance'
  | 'energy-step-tolerance'
  | 'line-search-step-underflow'
  | 'max-iterations'
  | 'boundary-hit';

export interface PSimplexPointwiseRelaxationOptions {
  maxRadius?: number;
  maxIterations?: number;
  initialStep?: number;
  gradientTolerance?: number;
  energyTolerance?: number;
  stepTolerance?: number;
  directionAlignmentThreshold?: number;
  boundaryTolerance?: number;
}

export interface PSimplexPointwiseRelaxationSeed {
  seedId: string;
  phi0: PSimplexVec3;
}

export interface PSimplexPointwiseLocalMinimum {
  seedId: string;
  initialPhi: PSimplexVec3;
  phi: PSimplexVec3;
  phiNorm: number;
  energy: number;
  iterations: number;
  gradientNorm: number;
  stopReason: PSimplexPointwiseStopReason;
  lastEnergyDelta: number;
  lastStepSize: number;
  hitBoundary: boolean;
  converged: boolean;
}

export interface PSimplexNearestFiniteResponseDirection {
  directionId: string | null;
  responseDirectionClass: PSimplexRuntimeResponseDirectionClass | null;
  alignment: number;
}

export interface PSimplexPointwiseRelaxationResult {
  sourceDriveJ: PSimplexVec3;
  eta: number;
  maxRadius: number;
  seedRows: PSimplexPointwiseRelaxationSeed[];
  localMinima: PSimplexPointwiseLocalMinimum[];
  bestLocalMinimum: PSimplexPointwiseLocalMinimum;
  bestMinimumStopReason: PSimplexPointwiseStopReason;
  bestMinimumConverged: boolean;
  bestMinimumGradientNorm: number;
  bestMinimumIterations: number;
  bestMinimumLastEnergyDelta: number;
  bestMinimumLastStepSize: number;
  localMinimumCountWithinTolerance: number;
  boundaryHitSeedIds: string[];
  phiStar: PSimplexVec3;
  phiNorm: number;
  phiHat: PSimplexVec3 | null;
  nearestFiniteResponseDirection: PSimplexNearestFiniteResponseDirection;
  relaxedResponseClass: PSimplexRelaxedResponseClass;
}

interface ResolvedOptions {
  maxRadius: number;
  maxIterations: number;
  initialStep: number;
  gradientTolerance: number;
  energyTolerance: number;
  stepTolerance: number;
  directionAlignmentThreshold: number;
  boundaryTolerance: number;
}

const DEFAULT_OPTIONS: ResolvedOptions = {
  maxRadius: 3,
  maxIterations: 700,
  initialStep: 0.08,
  gradientTolerance: 1e-8,
  energyTolerance: 1e-7,
  stepTolerance: 1e-10,
  directionAlignmentThreshold: 0.985,
  boundaryTolerance: 1e-6,
};

export function pSimplexPointwisePotential(
  phi: PSimplexVec3,
  sourceDriveJ: PSimplexVec3,
  eta: number,
): number {
  return pSimplexRadialTerm(phi) + pSimplexAnisotropyTerm(phi) - eta * dotVec3(sourceDriveJ, phi);
}

export function pSimplexPointwisePotentialGradient(
  phi: PSimplexVec3,
  sourceDriveJ: PSimplexVec3,
  eta: number,
): PSimplexVec3 {
  const [x, y, z] = phi;
  const radiusSquared = dotVec3(phi, phi);
  const radialScale = 4 * PSIMPLEX_LG_LAMBDA * (radiusSquared - PSIMPLEX_LG_V * PSIMPLEX_LG_V);
  const anisotropyGradient: PSimplexVec3 = [
    2 * PSIMPLEX_LG_MU * x * (y * y + z * z),
    2 * PSIMPLEX_LG_MU * y * (x * x + z * z),
    2 * PSIMPLEX_LG_MU * z * (x * x + y * y),
  ];
  const radialGradient = scaleVec3(phi, radialScale);

  return subVec3(addVec3(radialGradient, anisotropyGradient), scaleVec3(sourceDriveJ, eta));
}

export function buildPSimplexPointwiseRelaxationSeeds(
  sourceDriveJ: PSimplexVec3,
  finiteDirections = buildPSimplexFiniteResponseDirections(),
): PSimplexPointwiseRelaxationSeed[] {
  const sourceDirection = normalizeVec3OrNull(sourceDriveJ);
  const finiteSeeds = finiteDirections.map((direction) => ({
    seedId: direction.responseDirectionId,
    phi0: copyVec3(direction.n),
  }));
  const sourceSeed = sourceDirection
    ? [{ seedId: 'source-drive-aligned', phi0: sourceDirection }]
    : [];

  return [{ seedId: 'zero', phi0: [0, 0, 0] }, ...finiteSeeds, ...sourceSeed];
}

export function minimizePSimplexBoundedPointwiseVectorLG(
  sourceDriveJ: PSimplexVec3,
  eta: number,
  options: PSimplexPointwiseRelaxationOptions = {},
): PSimplexPointwiseRelaxationResult {
  const resolvedOptions = resolveOptions(options);
  const finiteDirections = buildPSimplexFiniteResponseDirections();
  const seedRows = buildPSimplexPointwiseRelaxationSeeds(sourceDriveJ, finiteDirections);
  const localMinima = seedRows.map((seed) =>
    minimizeFromSeed(seed, sourceDriveJ, eta, resolvedOptions),
  );
  const { minimumValue, winningEntries } = finiteMinimumWinners(
    localMinima,
    (entry) => entry.energy,
    resolvedOptions.energyTolerance,
  );
  const bestLocalMinimum = winningEntries[0];
  const phiStar = cleanVec3(bestLocalMinimum.phi);
  const phiNorm = cleanNumber(bestLocalMinimum.phiNorm);
  const phiHat = normalizeVec3OrNull(phiStar);
  const nearestFiniteResponseDirection = nearestFiniteDirection(phiHat, finiteDirections);
  const sourceDriveNorm = normVec3(sourceDriveJ);
  const relaxedResponseClass = classifyRelaxedResponse({
    sourceDriveNorm,
    localMinimumCountWithinTolerance: clusterLocalMinima(winningEntries).length,
    nearestFiniteResponseDirection,
    directionAlignmentThreshold: resolvedOptions.directionAlignmentThreshold,
  });

  return {
    sourceDriveJ: cleanVec3(sourceDriveJ),
    eta: cleanNumber(eta),
    maxRadius: resolvedOptions.maxRadius,
    seedRows: seedRows.map((seed) => ({ seedId: seed.seedId, phi0: cleanVec3(seed.phi0) })),
    localMinima,
    bestLocalMinimum: {
      ...bestLocalMinimum,
      energy: cleanNumber(minimumValue),
      phi: cleanVec3(bestLocalMinimum.phi),
    },
    bestMinimumStopReason: bestLocalMinimum.stopReason,
    bestMinimumConverged: bestLocalMinimum.converged,
    bestMinimumGradientNorm: bestLocalMinimum.gradientNorm,
    bestMinimumIterations: bestLocalMinimum.iterations,
    bestMinimumLastEnergyDelta: bestLocalMinimum.lastEnergyDelta,
    bestMinimumLastStepSize: bestLocalMinimum.lastStepSize,
    localMinimumCountWithinTolerance: clusterLocalMinima(winningEntries).length,
    boundaryHitSeedIds: localMinima
      .filter((entry) => entry.hitBoundary)
      .map((entry) => entry.seedId),
    phiStar,
    phiNorm,
    phiHat: phiHat ? cleanVec3(phiHat) : null,
    nearestFiniteResponseDirection,
    relaxedResponseClass,
  };
}

function minimizeFromSeed(
  seed: PSimplexPointwiseRelaxationSeed,
  sourceDriveJ: PSimplexVec3,
  eta: number,
  options: ResolvedOptions,
): PSimplexPointwiseLocalMinimum {
  let phi = projectToBall(seed.phi0, options.maxRadius);
  let energy = pSimplexPointwisePotential(phi, sourceDriveJ, eta);
  let hitBoundary = normVec3(phi) >= options.maxRadius - options.boundaryTolerance;
  let gradientNorm = Number.POSITIVE_INFINITY;
  let converged = false;
  let stopReason: PSimplexPointwiseStopReason = 'max-iterations';
  let lastEnergyDelta = 0;
  let lastStepSize = 0;
  let iterations = 0;

  for (iterations = 0; iterations < options.maxIterations; iterations += 1) {
    const gradient = pSimplexPointwisePotentialGradient(phi, sourceDriveJ, eta);
    gradientNorm = normVec3(gradient);

    if (gradientNorm <= options.gradientTolerance) {
      converged = true;
      stopReason = 'gradient-tolerance';
      break;
    }

    let step = options.initialStep;
    let acceptedPhi: PSimplexVec3 | null = null;
    let acceptedEnergy = energy;
    let acceptedStep = 0;
    let trialEnergyDelta = 0;
    let trialStep = step;

    for (;;) {
      const candidate = projectToBall(subVec3(phi, scaleVec3(gradient, step)), options.maxRadius);
      const candidateEnergy = pSimplexPointwisePotential(candidate, sourceDriveJ, eta);
      const energyDelta = candidateEnergy - energy;
      trialEnergyDelta = energyDelta;
      trialStep = step;

      if (candidateEnergy <= energy - 1e-12) {
        acceptedPhi = candidate;
        acceptedEnergy = candidateEnergy;
        acceptedStep = step;
        break;
      }

      if (step <= options.stepTolerance) {
        break;
      }

      step *= 0.5;
    }

    if (!acceptedPhi) {
      lastEnergyDelta = trialEnergyDelta;
      lastStepSize = trialStep;
      converged = Math.abs(lastEnergyDelta) <= options.energyTolerance && lastStepSize <= options.stepTolerance;
      stopReason = converged ? 'energy-step-tolerance' : 'line-search-step-underflow';
      break;
    }

    lastEnergyDelta = acceptedEnergy - energy;
    lastStepSize = acceptedStep;
    phi = acceptedPhi;
    energy = acceptedEnergy;
    hitBoundary = hitBoundary || normVec3(phi) >= options.maxRadius - options.boundaryTolerance;

    if (hitBoundary) {
      converged = false;
      stopReason = 'boundary-hit';
      break;
    }
  }

  const finalGradientNorm = Number.isFinite(gradientNorm)
    ? gradientNorm
    : normVec3(pSimplexPointwisePotentialGradient(phi, sourceDriveJ, eta));

  return {
    seedId: seed.seedId,
    initialPhi: cleanVec3(seed.phi0),
    phi: cleanVec3(phi),
    phiNorm: cleanNumber(normVec3(phi)),
    energy: cleanNumber(energy),
    iterations,
    gradientNorm: cleanNumber(finalGradientNorm),
    stopReason,
    lastEnergyDelta: cleanSolverNumber(lastEnergyDelta),
    lastStepSize: cleanSolverNumber(lastStepSize),
    hitBoundary,
    converged,
  };
}

function nearestFiniteDirection(
  phiHat: PSimplexVec3 | null,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexNearestFiniteResponseDirection {
  if (!phiHat) {
    return {
      directionId: null,
      responseDirectionClass: null,
      alignment: 0,
    };
  }

  const best = finiteDirections.reduce<{
    direction: PSimplexRuntimeAnisotropyLabeledResponseDirection;
    alignment: number;
  } | null>((currentBest, direction) => {
    const alignment = dotVec3(phiHat, direction.n);

    if (!currentBest || alignment > currentBest.alignment) {
      return { direction, alignment };
    }

    return currentBest;
  }, null);

  return {
    directionId: best?.direction.responseDirectionId ?? null,
    responseDirectionClass: best?.direction.responseDirectionClass ?? null,
    alignment: cleanNumber(best?.alignment ?? 0),
  };
}

function classifyRelaxedResponse(args: {
  sourceDriveNorm: number;
  localMinimumCountWithinTolerance: number;
  nearestFiniteResponseDirection: PSimplexNearestFiniteResponseDirection;
  directionAlignmentThreshold: number;
}): PSimplexRelaxedResponseClass {
  if (args.sourceDriveNorm <= PSIMPLEX_EPSILON) {
    return 'zero-drive-degenerate';
  }

  if (args.localMinimumCountWithinTolerance > 1) {
    return 'threshold-sensitive';
  }

  if (
    !args.nearestFiniteResponseDirection.responseDirectionClass ||
    args.nearestFiniteResponseDirection.alignment < args.directionAlignmentThreshold
  ) {
    return 'intermediate-relaxed-response';
  }

  if (args.nearestFiniteResponseDirection.responseDirectionClass === 'axis-well') {
    return 'axis-relaxed-response';
  }

  if (args.nearestFiniteResponseDirection.responseDirectionClass === 'a3-transition') {
    return 'A3-relaxed-response';
  }

  return 'body-diagonal-relaxed-response';
}

function clusterLocalMinima(localMinima: readonly PSimplexPointwiseLocalMinimum[]): PSimplexPointwiseLocalMinimum[] {
  const clusters: PSimplexPointwiseLocalMinimum[] = [];

  for (const localMinimum of localMinima) {
    const alreadyRepresented = clusters.some(
      (representative) => normVec3(subVec3(representative.phi, localMinimum.phi)) <= 1e-5,
    );

    if (!alreadyRepresented) {
      clusters.push(localMinimum);
    }
  }

  return clusters;
}

function projectToBall(value: PSimplexVec3, maxRadius: number): PSimplexVec3 {
  const magnitude = normVec3(value);

  if (magnitude <= maxRadius || magnitude <= PSIMPLEX_EPSILON) {
    return copyVec3(value);
  }

  return scaleVec3(value, maxRadius / magnitude);
}

function resolveOptions(options: PSimplexPointwiseRelaxationOptions): ResolvedOptions {
  return {
    maxRadius: options.maxRadius ?? DEFAULT_OPTIONS.maxRadius,
    maxIterations: options.maxIterations ?? DEFAULT_OPTIONS.maxIterations,
    initialStep: options.initialStep ?? DEFAULT_OPTIONS.initialStep,
    gradientTolerance: options.gradientTolerance ?? DEFAULT_OPTIONS.gradientTolerance,
    energyTolerance: options.energyTolerance ?? DEFAULT_OPTIONS.energyTolerance,
    stepTolerance: options.stepTolerance ?? DEFAULT_OPTIONS.stepTolerance,
    directionAlignmentThreshold:
      options.directionAlignmentThreshold ?? DEFAULT_OPTIONS.directionAlignmentThreshold,
    boundaryTolerance: options.boundaryTolerance ?? DEFAULT_OPTIONS.boundaryTolerance,
  };
}

function cleanSolverNumber(value: number): number {
  if (!Number.isFinite(value)) {
    return value;
  }

  return Number(value.toPrecision(12));
}
