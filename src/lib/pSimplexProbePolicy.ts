import {
  axisDirectionId,
  childOrder,
  type PSimplexChildSourceId,
  type PSimplexSignedAxis,
} from './pSimplexCoreGeometry';

export type PSimplexApprovedProbeClass = 'G' | 'E' | 'A+' | 'A-';
export type PSimplexResidualControlProbeClass = 'T';
export type PSimplexProbeClass = PSimplexApprovedProbeClass | PSimplexResidualControlProbeClass;

export const PSIMPLEX_APPROVED_CLEAN_PROBE_CLASSES: readonly PSimplexApprovedProbeClass[] = [
  'G',
  'E',
  'A+',
  'A-',
];
export const PSIMPLEX_RESIDUAL_CONTROL_PROBE_CLASS: PSimplexResidualControlProbeClass = 'T';
export const PSIMPLEX_CLEAN_AXIS_ALIGNMENT_THRESHOLD = 0.9;
export const PSIMPLEX_EXPECTED_AXIS_BY_CHILD: Record<PSimplexChildSourceId, PSimplexSignedAxis> = {
  M_AB: '+x',
  M_CD: '-x',
  M_AC: '+y',
  M_BD: '-y',
  M_AD: '+z',
  M_BC: '-z',
};

export function isApprovedCleanProbeClass(probeClass: PSimplexProbeClass): probeClass is PSimplexApprovedProbeClass {
  return PSIMPLEX_APPROVED_CLEAN_PROBE_CLASSES.includes(probeClass as PSimplexApprovedProbeClass);
}

export function isResidualControlProbeClass(
  probeClass: PSimplexProbeClass,
): probeClass is PSimplexResidualControlProbeClass {
  return probeClass === PSIMPLEX_RESIDUAL_CONTROL_PROBE_CLASS;
}

export function expectedAxisForChild(targetChild: PSimplexChildSourceId): PSimplexSignedAxis {
  return PSIMPLEX_EXPECTED_AXIS_BY_CHILD[targetChild];
}

export function expectedAxisDirectionIdForChild(targetChild: PSimplexChildSourceId): string {
  return axisDirectionId(expectedAxisForChild(targetChild));
}

export function probeClassId(probeClass: PSimplexProbeClass): string {
  if (probeClass === 'A+') {
    return 'A-plus';
  }

  if (probeClass === 'A-') {
    return 'A-minus';
  }

  return probeClass;
}

export function probeOrder(probeClass: PSimplexProbeClass): number {
  return ['G', 'E', 'A+', 'A-', 'T'].indexOf(probeClass);
}

export function compareChildProbeOrder(
  left: { targetChild: PSimplexChildSourceId; probeClass: PSimplexProbeClass },
  right: { targetChild: PSimplexChildSourceId; probeClass: PSimplexProbeClass },
): number {
  const childOrderDifference = childOrder(left.targetChild) - childOrder(right.targetChild);

  if (childOrderDifference !== 0) {
    return childOrderDifference;
  }

  return probeOrder(left.probeClass) - probeOrder(right.probeClass);
}

export function cleanReadoutAllowed(probeClass: PSimplexProbeClass): boolean {
  return isApprovedCleanProbeClass(probeClass);
}

export function diagnosticOnly(probeClass: PSimplexProbeClass): boolean {
  return isResidualControlProbeClass(probeClass);
}

export function suppressionReasonForResidualControl(existingReason: string | null | undefined): string {
  return existingReason ?? 'residual-control-transverse-probe-remains-diagnostic-only';
}
