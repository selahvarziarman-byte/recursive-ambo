import type { Shape } from '../types/geometry';

export const PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_ID =
  'profile-aware-runtime-support-policy-v0';

export type ProfileAwareRuntimeSupportPolicyStatus = 'supported' | 'unsupported';

export type ProfileAwareRuntimeSupportPolicyCriterionId =
  | 'tetrahedron-seed'
  | 'ambo-dissection-operation'
  | 'minimum-generation-depth'
  | 'created-vertices-present';

export type ProfileAwareRuntimeSupportExpansionCandidateId =
  | 'other-seeds'
  | 'selected-cell-contexts'
  | 'deeper-named-generation-support'
  | 'multi-cell-contexts'
  | 'editable-source-profile-assignment';

export interface ProfileAwareRuntimeSupportPolicyCriterion {
  id: ProfileAwareRuntimeSupportPolicyCriterionId;
  label: string;
  passed: boolean;
  actual: string | number | null;
  expected: string;
}

export interface ProfileAwareRuntimeSupportExpansionCandidate {
  id: ProfileAwareRuntimeSupportExpansionCandidateId;
  status: 'not-yet-supported';
  note: string;
}

export interface ProfileAwareRuntimeSupportPolicyReport {
  policyId: typeof PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_ID;
  method: 'profile-aware-runtime-support-policy-v0';
  policyScope: 'current-shape-runtime-field-mode';
  supportStatus: ProfileAwareRuntimeSupportPolicyStatus;
  inputShapeId: string;
  seedKey?: string;
  operation: string;
  generationDepth: number;
  createdVertexCount: number;
  criteria: ProfileAwareRuntimeSupportPolicyCriterion[];
  unsupportedIssueCode?: 'unsupported-shape-context';
  unsupportedReason?: string;
  expansionCandidates: ProfileAwareRuntimeSupportExpansionCandidate[];
  supportExpansionStatus: 'not-expanded-this-branch';
  fallbackSupportStatus: 'no-silent-fallback';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  packetWriteStatus: 'not-packet-writing';
  shapeMutationStatus: 'not-shape-mutation';
}

const METHOD = 'profile-aware-runtime-support-policy-v0';
const POLICY_SCOPE = 'current-shape-runtime-field-mode';
const UNSUPPORTED_SHAPE_CONTEXT_REASON =
  'Profile-aware Shape position resolution currently supports only a tetrahedron seed-derived Shape after at least one Ambo dissection.';

export function buildProfileAwareRuntimeSupportPolicyReport(
  shape: Shape,
): ProfileAwareRuntimeSupportPolicyReport {
  const shapeSnapshot = JSON.stringify(shape);
  const createdVertexCount = shape.genealogy.createdVertexIds.length;
  const criteria: ProfileAwareRuntimeSupportPolicyCriterion[] = [
    {
      id: 'tetrahedron-seed',
      label: 'Tetrahedron seed',
      passed: shape.seedKey === 'tetrahedron',
      actual: shape.seedKey ?? null,
      expected: 'tetrahedron',
    },
    {
      id: 'ambo-dissection-operation',
      label: 'Ambo dissection operation',
      passed: shape.genealogy.operation === 'ambo-dissection',
      actual: shape.genealogy.operation,
      expected: 'ambo-dissection',
    },
    {
      id: 'minimum-generation-depth',
      label: 'Minimum generation depth',
      passed: shape.genealogy.generationDepth >= 1,
      actual: shape.genealogy.generationDepth,
      expected: '>= 1',
    },
    {
      id: 'created-vertices-present',
      label: 'Created vertices present',
      passed: createdVertexCount > 0,
      actual: createdVertexCount,
      expected: '> 0',
    },
  ];
  const supportStatus: ProfileAwareRuntimeSupportPolicyStatus = criteria.every(
    (criterion) => criterion.passed,
  )
    ? 'supported'
    : 'unsupported';
  const unsupportedFields =
    supportStatus === 'unsupported'
      ? {
          unsupportedIssueCode: 'unsupported-shape-context' as const,
          unsupportedReason: UNSUPPORTED_SHAPE_CONTEXT_REASON,
        }
      : {};
  const seedKeyField = shape.seedKey ? { seedKey: shape.seedKey } : {};
  const report: ProfileAwareRuntimeSupportPolicyReport = {
    policyId: PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_ID,
    method: METHOD,
    policyScope: POLICY_SCOPE,
    supportStatus,
    inputShapeId: shape.id,
    ...seedKeyField,
    operation: shape.genealogy.operation,
    generationDepth: shape.genealogy.generationDepth,
    createdVertexCount,
    criteria,
    expansionCandidates: [
      {
        id: 'other-seeds',
        status: 'not-yet-supported',
        note: 'Non-tetrahedron seed support remains outside the current runtime policy.',
      },
      {
        id: 'selected-cell-contexts',
        status: 'not-yet-supported',
        note: 'Selected-cell runtime contexts are not part of this support policy.',
      },
      {
        id: 'deeper-named-generation-support',
        status: 'not-yet-supported',
        note: 'Deeper named-generation support is reserved for an explicit future policy.',
      },
      {
        id: 'multi-cell-contexts',
        status: 'not-yet-supported',
        note: 'Multi-cell runtime contexts are not expanded in this branch.',
      },
      {
        id: 'editable-source-profile-assignment',
        status: 'not-yet-supported',
        note: 'Editable source-profile assignment remains unsupported here.',
      },
    ],
    supportExpansionStatus: 'not-expanded-this-branch',
    fallbackSupportStatus: 'no-silent-fallback',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    packetWriteStatus: 'not-packet-writing',
    shapeMutationStatus: 'not-shape-mutation',
    ...unsupportedFields,
  };

  if (JSON.stringify(shape) !== shapeSnapshot) {
    throw new Error('Profile-aware runtime support policy mutated shape input.');
  }

  return report;
}
