import { createSeedShape } from '../data/seeds';
import { applyAmboDissection } from './ambo';
import { buildProfileAwareFieldAtlasViewModelRuntimeReport } from './fieldSourceProfileAwareAtlasViewModel';
import { buildProfileAwareRuntimeSupportPolicyReport } from './fieldSourceProfileAwareRuntimeSupportPolicy';
import { getProfileAwareRuntimeSupportPolicyRegistryEntry } from './fieldSourceProfileAwareRuntimeSupportPolicyRegistry';
import type { Cell, Shape } from '../types/geometry';

export type ProfileAwareRuntimeSupportMatrixCaseClass =
  | 'current-baseline'
  | 'unsupported-control'
  | 'expansion-candidate';

export type ProfileAwareRuntimeSupportMatrixConstructionStatus =
  | 'constructed'
  | 'construction-failed'
  | 'skipped';

export type ProfileAwareRuntimeSupportMatrixPromotionStatus =
  | 'current-baseline'
  | 'not-promoted'
  | 'not-yet-supported'
  | 'construction-failed';

export interface ProfileAwareRuntimeSupportMatrixCase {
  caseId: string;
  label: string;
  caseClass: ProfileAwareRuntimeSupportMatrixCaseClass;
  constructionStatus: ProfileAwareRuntimeSupportMatrixConstructionStatus;
  promotionStatus: ProfileAwareRuntimeSupportMatrixPromotionStatus;
  candidatePolicyId?: string;
  candidatePolicyStatus?: string;
  candidatePolicyLabel?: string;
  shapeId?: string;
  seedKey?: string;
  operation?: string;
  generationDepth?: number;
  createdVertexCount?: number;
  targetCellId?: string;
  targetCellKind?: string;
  targetCellTopology?: string;
  policySupportStatus?: 'supported' | 'unsupported';
  runtimeBoundaryStatus?: 'supported' | 'unsupported';
  policyRuntimeAgreement?: boolean;
  constructionFailureReason?: string;
  unsupportedReason?: string;
  caveats: string[];
}

export interface ProfileAwareRuntimeSupportMatrixReport {
  reportId: string;
  method: 'profile-aware-runtime-support-matrix-diagnostic-v0';
  diagnosticScope: 'runtime-support-expansion-candidates-diagnostic-only';
  supportExpansionStatus: 'not-expanded-this-branch';
  fallbackSupportStatus: 'no-silent-fallback';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  packetWriteStatus: 'not-packet-writing';
  shapeMutationStatus: 'not-shape-mutation';
  caseCount: number;
  supportedRuntimeCaseCount: number;
  unsupportedRuntimeCaseCount: number;
  constructionFailedCaseCount: number;
  notPromotedCandidateCount: number;
  policyRuntimeMismatchCount: number;
  cases: ProfileAwareRuntimeSupportMatrixCase[];
  ok: boolean;
  issueCount: number;
  issues: Array<{ code: string; message: string; caseId?: string }>;
}

const METHOD = 'profile-aware-runtime-support-matrix-diagnostic-v0';
const DIAGNOSTIC_SCOPE = 'runtime-support-expansion-candidates-diagnostic-only';
const BASE_CAVEATS = [
  'diagnostic only',
  'not support expansion',
  'no silent fallback',
  'not semantic naming',
  'not topology workspace',
  'not packet writing',
];
const EXPANSION_CAVEATS = ['not promoted', 'not named support policy'];

export function buildProfileAwareRuntimeSupportMatrixReport(): ProfileAwareRuntimeSupportMatrixReport {
  const issues: ProfileAwareRuntimeSupportMatrixReport['issues'] = [];
  const seedTetrahedron = createSeedShape('tetrahedron');
  const oneAmboTetrahedron = applyAmboDissection(createSeedShape('tetrahedron'));
  const seedCube = createSeedShape('cube');
  const cases: ProfileAwareRuntimeSupportMatrixCase[] = [
    buildConstructedRuntimeSupportMatrixCase({
      caseId: 'seed-tetrahedron',
      label: 'Seed tetrahedron',
      caseClass: 'unsupported-control',
      promotionStatus: 'not-yet-supported',
      candidatePolicyId: 'unsupported-seed-tetrahedron-control-v0',
      shape: seedTetrahedron,
      issues,
    }),
    buildConstructedRuntimeSupportMatrixCase({
      caseId: 'one-ambo-tetrahedron',
      label: 'One-Ambo tetrahedron',
      caseClass: 'current-baseline',
      promotionStatus: 'current-baseline',
      candidatePolicyId: 'profile-aware-runtime-support-policy-v0',
      shape: oneAmboTetrahedron,
      issues,
    }),
    buildConstructedRuntimeSupportMatrixCase({
      caseId: 'seed-cube',
      label: 'Seed cube',
      caseClass: 'unsupported-control',
      promotionStatus: 'not-yet-supported',
      candidatePolicyId: 'unsupported-seed-cube-control-v0',
      shape: seedCube,
      issues,
    }),
    buildAttemptedRuntimeSupportMatrixCase({
      caseId: 'one-ambo-cube',
      label: 'One-Ambo cube',
      candidatePolicyId: 'candidate-shape-level-cube-ambo-v0',
      constructShape: () => applyAmboDissection(createSeedShape('cube')),
      issues,
    }),
    buildAttemptedRuntimeSupportMatrixCase({
      caseId: 'tetrahedron-second-generation-default-attempt',
      label: 'Tetrahedron second-generation default attempt',
      candidatePolicyId: 'candidate-shape-level-tetrahedron-second-generation-v0',
      constructShape: () => applyAmboDissection(oneAmboTetrahedron),
      issues,
    }),
    buildTargetCellRuntimeSupportMatrixCase({
      caseId: 'tetrahedron-second-generation-core-cell',
      label: 'Tetrahedron second-generation core cell',
      candidatePolicyId: 'candidate-selected-core-cell-tetrahedron-second-generation-v0',
      parentShape: oneAmboTetrahedron,
      targetCell: findGeneratedCell(oneAmboTetrahedron, 'core'),
      targetCellDescription: 'generated core cell',
      issues,
    }),
    buildTargetCellRuntimeSupportMatrixCase({
      caseId: 'tetrahedron-second-generation-first-residue-cell',
      label: 'Tetrahedron second-generation first residue cell',
      candidatePolicyId:
        'candidate-selected-residue-cell-tetrahedron-second-generation-v0',
      parentShape: oneAmboTetrahedron,
      targetCell: findGeneratedCell(oneAmboTetrahedron, 'residue'),
      targetCellDescription: 'generated residue cell',
      issues,
    }),
  ];

  return {
    reportId: 'profile-aware-runtime-support-matrix:diagnostic:v0',
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    supportExpansionStatus: 'not-expanded-this-branch',
    fallbackSupportStatus: 'no-silent-fallback',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    packetWriteStatus: 'not-packet-writing',
    shapeMutationStatus: 'not-shape-mutation',
    caseCount: cases.length,
    supportedRuntimeCaseCount: cases.filter(
      (matrixCase) => matrixCase.runtimeBoundaryStatus === 'supported',
    ).length,
    unsupportedRuntimeCaseCount: cases.filter(
      (matrixCase) => matrixCase.runtimeBoundaryStatus === 'unsupported',
    ).length,
    constructionFailedCaseCount: cases.filter(
      (matrixCase) =>
        matrixCase.constructionStatus === 'construction-failed' ||
        matrixCase.constructionStatus === 'skipped',
    ).length,
    notPromotedCandidateCount: cases.filter(
      (matrixCase) =>
        matrixCase.caseClass === 'expansion-candidate' &&
        matrixCase.promotionStatus === 'not-promoted',
    ).length,
    policyRuntimeMismatchCount: cases.filter(
      (matrixCase) => matrixCase.policyRuntimeAgreement === false,
    ).length,
    cases,
    ok: issues.length === 0,
    issueCount: issues.length,
    issues,
  };
}

function buildConstructedRuntimeSupportMatrixCase({
  caseId,
  label,
  caseClass,
  promotionStatus,
  candidatePolicyId,
  shape,
  targetCell,
  issues,
}: {
  caseId: string;
  label: string;
  caseClass: ProfileAwareRuntimeSupportMatrixCaseClass;
  promotionStatus: ProfileAwareRuntimeSupportMatrixPromotionStatus;
  candidatePolicyId?: string;
  shape: Shape;
  targetCell?: Cell;
  issues: ProfileAwareRuntimeSupportMatrixReport['issues'];
}): ProfileAwareRuntimeSupportMatrixCase {
  const snapshot = JSON.stringify(shape);
  const policyReport = buildProfileAwareRuntimeSupportPolicyReport(shape);
  const runtimeReport = buildProfileAwareFieldAtlasViewModelRuntimeReport(shape);
  const registryEntry = candidatePolicyId
    ? getProfileAwareRuntimeSupportPolicyRegistryEntry(candidatePolicyId)
    : undefined;
  const mutated = JSON.stringify(shape) !== snapshot;

  if (candidatePolicyId && !registryEntry) {
    issues.push({
      code: 'missing-registry-policy',
      message: 'Runtime support matrix case references an unknown registry policy.',
      caseId,
    });
  }

  if (mutated) {
    issues.push({
      code: 'shape-mutated',
      message: 'Runtime support matrix report construction mutated a shape.',
      caseId,
    });
  }

  return {
    caseId,
    label,
    caseClass,
    constructionStatus: 'constructed',
    promotionStatus,
    candidatePolicyId,
    candidatePolicyStatus: registryEntry?.status,
    candidatePolicyLabel: registryEntry?.label,
    shapeId: shape.id,
    seedKey: shape.seedKey,
    operation: shape.genealogy.operation,
    generationDepth: shape.genealogy.generationDepth,
    createdVertexCount: shape.genealogy.createdVertexIds.length,
    targetCellId: targetCell?.id,
    targetCellKind: targetCell?.kind,
    targetCellTopology: targetCell?.topology,
    policySupportStatus: policyReport.supportStatus,
    runtimeBoundaryStatus: runtimeReport.runtimeBoundaryStatus,
    policyRuntimeAgreement:
      policyReport.supportStatus === runtimeReport.runtimeBoundaryStatus,
    unsupportedReason:
      runtimeReport.runtimeBoundaryStatus === 'unsupported'
        ? runtimeReport.unsupportedReason
        : undefined,
    caveats: getRuntimeSupportMatrixCaseCaveats(caseClass),
  };
}

function buildAttemptedRuntimeSupportMatrixCase({
  caseId,
  label,
  candidatePolicyId,
  constructShape,
  issues,
}: {
  caseId: string;
  label: string;
  candidatePolicyId: string;
  constructShape: () => Shape;
  issues: ProfileAwareRuntimeSupportMatrixReport['issues'];
}): ProfileAwareRuntimeSupportMatrixCase {
  try {
    return buildConstructedRuntimeSupportMatrixCase({
      caseId,
      label,
      caseClass: 'expansion-candidate',
      promotionStatus: 'not-promoted',
      candidatePolicyId,
      shape: constructShape(),
      issues,
    });
  } catch (error) {
    return buildConstructionFailedRuntimeSupportMatrixCase({
      caseId,
      label,
      candidatePolicyId,
      constructionStatus: 'construction-failed',
      constructionFailureReason: formatRuntimeSupportMatrixConstructionError(error),
    });
  }
}

function buildTargetCellRuntimeSupportMatrixCase({
  caseId,
  label,
  candidatePolicyId,
  parentShape,
  targetCell,
  targetCellDescription,
  issues,
}: {
  caseId: string;
  label: string;
  candidatePolicyId: string;
  parentShape: Shape;
  targetCell?: Cell;
  targetCellDescription: string;
  issues: ProfileAwareRuntimeSupportMatrixReport['issues'];
}): ProfileAwareRuntimeSupportMatrixCase {
  if (!targetCell) {
    return buildConstructionFailedRuntimeSupportMatrixCase({
      caseId,
      label,
      candidatePolicyId,
      constructionStatus: 'skipped',
      constructionFailureReason: `No ${targetCellDescription} is available.`,
    });
  }

  try {
    return buildConstructedRuntimeSupportMatrixCase({
      caseId,
      label,
      caseClass: 'expansion-candidate',
      promotionStatus: 'not-promoted',
      candidatePolicyId,
      shape: applyAmboDissection(parentShape, targetCell.id),
      targetCell,
      issues,
    });
  } catch (error) {
    return buildConstructionFailedRuntimeSupportMatrixCase({
      caseId,
      label,
      candidatePolicyId,
      constructionStatus: 'construction-failed',
      constructionFailureReason: formatRuntimeSupportMatrixConstructionError(error),
      targetCell,
    });
  }
}

function buildConstructionFailedRuntimeSupportMatrixCase({
  caseId,
  label,
  candidatePolicyId,
  constructionStatus,
  constructionFailureReason,
  targetCell,
}: {
  caseId: string;
  label: string;
  candidatePolicyId: string;
  constructionStatus: ProfileAwareRuntimeSupportMatrixConstructionStatus;
  constructionFailureReason: string;
  targetCell?: Cell;
}): ProfileAwareRuntimeSupportMatrixCase {
  const registryEntry =
    getProfileAwareRuntimeSupportPolicyRegistryEntry(candidatePolicyId);

  return {
    caseId,
    label,
    caseClass: 'expansion-candidate',
    constructionStatus,
    promotionStatus: 'construction-failed',
    candidatePolicyId,
    candidatePolicyStatus: registryEntry?.status,
    candidatePolicyLabel: registryEntry?.label,
    targetCellId: targetCell?.id,
    targetCellKind: targetCell?.kind,
    targetCellTopology: targetCell?.topology,
    constructionFailureReason,
    caveats: getRuntimeSupportMatrixCaseCaveats('expansion-candidate'),
  };
}

function getRuntimeSupportMatrixCaseCaveats(
  caseClass: ProfileAwareRuntimeSupportMatrixCaseClass,
): string[] {
  return caseClass === 'expansion-candidate'
    ? [...BASE_CAVEATS, ...EXPANSION_CAVEATS]
    : BASE_CAVEATS;
}

function findGeneratedCell(shape: Shape, kind: 'core' | 'residue'): Cell | undefined {
  return shape.cells.find(
    (cell) => cell.kind === kind && cell.sourceOperation === 'ambo-dissection',
  );
}

function formatRuntimeSupportMatrixConstructionError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
