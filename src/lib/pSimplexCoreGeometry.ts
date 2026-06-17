import {
  addVec3,
  cleanVec3,
  copyVec3,
  normalizeVec3,
  normVec3,
  subVec3,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexPrimalSourceId = 'A' | 'B' | 'C' | 'D';
export type PSimplexChildEdgeId = 'AB' | 'AC' | 'AD' | 'BC' | 'BD' | 'CD';
export type PSimplexChildSourceId = `M_${PSimplexChildEdgeId}`;
export type PSimplexSignedAxis = '+x' | '-x' | '+y' | '-y' | '+z' | '-z';
export type PSimplexA3RootId =
  | 'r_AB'
  | 'r_BA'
  | 'r_AC'
  | 'r_CA'
  | 'r_AD'
  | 'r_DA'
  | 'r_BC'
  | 'r_CB'
  | 'r_BD'
  | 'r_DB'
  | 'r_CD'
  | 'r_DC';
export type PSimplexCoordinateAxis = 'x' | 'y' | 'z';
export type PSimplexSign = 1 | -1;

export interface PSimplexChildAxisDefinition {
  childId: PSimplexChildSourceId;
  edge: PSimplexChildEdgeId;
  endpoints: [PSimplexPrimalSourceId, PSimplexPrimalSourceId];
  signedAxis: PSimplexSignedAxis;
}

export interface PSimplexA3RootDefinition {
  rootId: PSimplexA3RootId;
  from: PSimplexPrimalSourceId;
  to: PSimplexPrimalSourceId;
}

export interface PSimplexNamedDirection {
  directionId: string;
  normalizedDirection: PSimplexVec3;
}

const ONE_OVER_SQRT_THREE = 1 / Math.sqrt(3);

export const PSIMPLEX_PRIMAL_SOURCE_IDS: readonly PSimplexPrimalSourceId[] = ['A', 'B', 'C', 'D'];
export const PSIMPLEX_CHILD_SOURCE_IDS: readonly PSimplexChildSourceId[] = [
  'M_AB',
  'M_AC',
  'M_AD',
  'M_BC',
  'M_BD',
  'M_CD',
];
export const PSIMPLEX_COORDINATE_AXES: readonly PSimplexCoordinateAxis[] = ['x', 'y', 'z'];
export const PSIMPLEX_SIGN_FLIPS: ReadonlyArray<[PSimplexSign, PSimplexSign, PSimplexSign]> = [
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, 1],
  [1, -1, -1],
  [-1, 1, 1],
  [-1, 1, -1],
  [-1, -1, 1],
  [-1, -1, -1],
];
export const PSIMPLEX_PRIMAL_VECTOR_BY_ID: Record<PSimplexPrimalSourceId, PSimplexVec3> = {
  A: [ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE],
  B: [ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE],
  C: [-ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE],
  D: [-ONE_OVER_SQRT_THREE, -ONE_OVER_SQRT_THREE, ONE_OVER_SQRT_THREE],
};
export const PSIMPLEX_CHILD_AXIS_DEFINITIONS: readonly PSimplexChildAxisDefinition[] = [
  { childId: 'M_AB', edge: 'AB', endpoints: ['A', 'B'], signedAxis: '+x' },
  { childId: 'M_AC', edge: 'AC', endpoints: ['A', 'C'], signedAxis: '+y' },
  { childId: 'M_AD', edge: 'AD', endpoints: ['A', 'D'], signedAxis: '+z' },
  { childId: 'M_BC', edge: 'BC', endpoints: ['B', 'C'], signedAxis: '-z' },
  { childId: 'M_BD', edge: 'BD', endpoints: ['B', 'D'], signedAxis: '-y' },
  { childId: 'M_CD', edge: 'CD', endpoints: ['C', 'D'], signedAxis: '-x' },
];
export const PSIMPLEX_A3_ROOT_DEFINITIONS: readonly PSimplexA3RootDefinition[] = [
  { rootId: 'r_AB', from: 'A', to: 'B' },
  { rootId: 'r_BA', from: 'B', to: 'A' },
  { rootId: 'r_AC', from: 'A', to: 'C' },
  { rootId: 'r_CA', from: 'C', to: 'A' },
  { rootId: 'r_AD', from: 'A', to: 'D' },
  { rootId: 'r_DA', from: 'D', to: 'A' },
  { rootId: 'r_BC', from: 'B', to: 'C' },
  { rootId: 'r_CB', from: 'C', to: 'B' },
  { rootId: 'r_BD', from: 'B', to: 'D' },
  { rootId: 'r_DB', from: 'D', to: 'B' },
  { rootId: 'r_CD', from: 'C', to: 'D' },
  { rootId: 'r_DC', from: 'D', to: 'C' },
];

export function primalSourceVector(sourceId: PSimplexPrimalSourceId): PSimplexVec3 {
  return copyVec3(PSIMPLEX_PRIMAL_VECTOR_BY_ID[sourceId]);
}

export function childAxisDefinition(childId: PSimplexChildSourceId): PSimplexChildAxisDefinition {
  const definition = PSIMPLEX_CHILD_AXIS_DEFINITIONS.find((row) => row.childId === childId);

  if (!definition) {
    throw new Error(`Unknown P-simplex child source ${childId}`);
  }

  return definition;
}

export function childAxisVector(childId: PSimplexChildSourceId): PSimplexVec3 {
  const definition = childAxisDefinition(childId);
  const edgeSum = addVec3(primalSourceVector(definition.endpoints[0]), primalSourceVector(definition.endpoints[1]));

  return cleanVec3(normalizeVec3(edgeSum));
}

export function signedAxisVector(axis: PSimplexSignedAxis): PSimplexVec3 {
  if (axis === '+x') {
    return [1, 0, 0];
  }

  if (axis === '-x') {
    return [-1, 0, 0];
  }

  if (axis === '+y') {
    return [0, 1, 0];
  }

  if (axis === '-y') {
    return [0, -1, 0];
  }

  return axis === '+z' ? [0, 0, 1] : [0, 0, -1];
}

export function axisDirectionId(axis: PSimplexSignedAxis): string {
  return `axis-${axis}`;
}

export function buildPSimplexChildAxisDirections(): PSimplexNamedDirection[] {
  return PSIMPLEX_CHILD_AXIS_DEFINITIONS.map((definition) => ({
    directionId: axisDirectionId(definition.signedAxis),
    normalizedDirection: signedAxisVector(definition.signedAxis),
  }));
}

export function buildPSimplexA3RootDirections(): PSimplexNamedDirection[] {
  return PSIMPLEX_A3_ROOT_DEFINITIONS.map((definition) => ({
    directionId: definition.rootId,
    normalizedDirection: cleanVec3(
      normalizeVec3(subVec3(primalSourceVector(definition.from), primalSourceVector(definition.to))),
    ),
  }));
}

export function buildPSimplexBodyDiagonalDirections(): PSimplexNamedDirection[] {
  return PSIMPLEX_SIGN_FLIPS.map(([x, y, z]) => ({
    directionId: `body-diagonal-${signToken(x)}x-${signToken(y)}y-${signToken(z)}z`,
    normalizedDirection: [
      cleanNumberForGeometry(x * ONE_OVER_SQRT_THREE),
      cleanNumberForGeometry(y * ONE_OVER_SQRT_THREE),
      cleanNumberForGeometry(z * ONE_OVER_SQRT_THREE),
    ],
  }));
}

export function applySignedCoordinatePermutation(
  value: PSimplexVec3,
  permutation: PSimplexCoordinateAxis[],
  signFlips: [PSimplexSign, PSimplexSign, PSimplexSign],
): PSimplexVec3 {
  return [
    signFlips[0] * value[axisIndex(permutation[0])],
    signFlips[1] * value[axisIndex(permutation[1])],
    signFlips[2] * value[axisIndex(permutation[2])],
  ];
}

export function coordinatePermutations<T>(values: T[]): T[][] {
  if (values.length <= 1) {
    return [values];
  }

  return values.flatMap((value, index) => {
    const remaining = [...values.slice(0, index), ...values.slice(index + 1)];

    return coordinatePermutations(remaining).map((permutation) => [value, ...permutation]);
  });
}

export function axisIndex(axis: PSimplexCoordinateAxis): 0 | 1 | 2 {
  if (axis === 'x') {
    return 0;
  }

  if (axis === 'y') {
    return 1;
  }

  return 2;
}

export function signToken(value: PSimplexSign): string {
  return value > 0 ? 'plus' : 'minus';
}

function cleanNumberForGeometry(value: number): number {
  if (Math.abs(value) <= 1e-9) {
    return 0;
  }

  return Number(value.toFixed(12));
}

export function childOrder(targetChild: PSimplexChildSourceId): number {
  return PSIMPLEX_CHILD_SOURCE_IDS.indexOf(targetChild);
}

export function childEdgeMagnitude(edge: PSimplexChildEdgeId): number {
  const definition = PSIMPLEX_CHILD_AXIS_DEFINITIONS.find((row) => row.edge === edge);

  if (!definition) {
    throw new Error(`Unknown P-simplex child edge ${edge}`);
  }

  return normVec3(addVec3(primalSourceVector(definition.endpoints[0]), primalSourceVector(definition.endpoints[1])));
}
