export type ProfileAwareRuntimeSupportPolicyRegistryStatus =
  | 'current-baseline'
  | 'candidate-not-promoted'
  | 'not-yet-supported'
  | 'unsupported-control';

export type ProfileAwareRuntimeSupportPolicyRegistryScope =
  | 'shape-level'
  | 'selected-cell'
  | 'multi-cell'
  | 'source-profile-assignment';

export interface ProfileAwareRuntimeSupportPolicyRegistryEntry {
  policyId: string;
  label: string;
  status: ProfileAwareRuntimeSupportPolicyRegistryStatus;
  scope: ProfileAwareRuntimeSupportPolicyRegistryScope;
  supportExpansionStatus:
    | 'accepted-current-baseline'
    | 'not-expanded-this-branch'
    | 'not-yet-supported';
  runtimeBehaviorStatus:
    | 'current-runtime-supported'
    | 'diagnostic-only'
    | 'unsupported'
    | 'not-promoted';
  seedKey?: string;
  operation?: string;
  minGenerationDepth?: number;
  maxGenerationDepth?: number;
  targetCellKind?: string;
  targetCellTopology?: string;
  caveats: string[];
}

export interface ProfileAwareRuntimeSupportPolicyRegistrySummary {
  registryId: typeof PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_REGISTRY_ID;
  entryCount: number;
  currentBaselineCount: number;
  candidateNotPromotedCount: number;
  notYetSupportedCount: number;
  unsupportedControlCount: number;
  supportExpansionStatus: 'not-expanded-this-branch';
  fallbackSupportStatus: 'no-silent-fallback';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  packetWriteStatus: 'not-packet-writing';
}

export const PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_REGISTRY_ID =
  'profile-aware-runtime-support-policy-registry-v0';

export const PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_REGISTRY_ENTRIES: ProfileAwareRuntimeSupportPolicyRegistryEntry[] =
  [
    {
      policyId: 'profile-aware-runtime-support-policy-v0',
      label: 'Tetrahedron Ambo shape-level runtime policy',
      status: 'current-baseline',
      scope: 'shape-level',
      supportExpansionStatus: 'accepted-current-baseline',
      runtimeBehaviorStatus: 'current-runtime-supported',
      seedKey: 'tetrahedron',
      operation: 'ambo-dissection',
      minGenerationDepth: 1,
      caveats: [
        'current accepted runtime boundary',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
        'no silent fallback',
      ],
    },
    {
      policyId: 'unsupported-seed-tetrahedron-control-v0',
      label: 'Unsupported seed tetrahedron control',
      status: 'unsupported-control',
      scope: 'shape-level',
      supportExpansionStatus: 'not-yet-supported',
      runtimeBehaviorStatus: 'unsupported',
      seedKey: 'tetrahedron',
      maxGenerationDepth: 0,
      caveats: [
        'unsupported control',
        'not support expansion',
        'no silent fallback',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    },
    {
      policyId: 'unsupported-seed-cube-control-v0',
      label: 'Unsupported seed cube control',
      status: 'unsupported-control',
      scope: 'shape-level',
      supportExpansionStatus: 'not-yet-supported',
      runtimeBehaviorStatus: 'unsupported',
      seedKey: 'cube',
      caveats: [
        'unsupported control',
        'not support expansion',
        'no silent fallback',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    },
    {
      policyId: 'candidate-shape-level-cube-ambo-v0',
      label: 'Candidate cube Ambo shape-level runtime policy',
      status: 'candidate-not-promoted',
      scope: 'shape-level',
      supportExpansionStatus: 'not-expanded-this-branch',
      runtimeBehaviorStatus: 'not-promoted',
      seedKey: 'cube',
      operation: 'ambo-dissection',
      minGenerationDepth: 1,
      caveats: [
        'not promoted',
        'not support expansion',
        'no silent fallback',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    },
    {
      policyId: 'candidate-shape-level-tetrahedron-second-generation-v0',
      label: 'Candidate tetrahedron second-generation shape-level runtime policy',
      status: 'candidate-not-promoted',
      scope: 'shape-level',
      supportExpansionStatus: 'not-expanded-this-branch',
      runtimeBehaviorStatus: 'not-promoted',
      seedKey: 'tetrahedron',
      operation: 'ambo-dissection',
      minGenerationDepth: 2,
      caveats: [
        'not promoted',
        'not support expansion',
        'no silent fallback',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    },
    {
      policyId: 'candidate-selected-core-cell-tetrahedron-second-generation-v0',
      label: 'Candidate selected core-cell tetrahedron second-generation policy',
      status: 'candidate-not-promoted',
      scope: 'selected-cell',
      supportExpansionStatus: 'not-expanded-this-branch',
      runtimeBehaviorStatus: 'not-promoted',
      seedKey: 'tetrahedron',
      operation: 'ambo-dissection',
      minGenerationDepth: 2,
      targetCellKind: 'core',
      caveats: [
        'not promoted',
        'selected-cell not enabled',
        'no silent fallback',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    },
    {
      policyId: 'candidate-selected-residue-cell-tetrahedron-second-generation-v0',
      label:
        'Candidate selected residue-cell tetrahedron second-generation policy',
      status: 'candidate-not-promoted',
      scope: 'selected-cell',
      supportExpansionStatus: 'not-expanded-this-branch',
      runtimeBehaviorStatus: 'not-promoted',
      seedKey: 'tetrahedron',
      operation: 'ambo-dissection',
      minGenerationDepth: 2,
      targetCellKind: 'residue',
      caveats: [
        'not promoted',
        'selected-cell not enabled',
        'no silent fallback',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    },
    {
      policyId: 'future-multi-cell-runtime-context-v0',
      label: 'Future multi-cell runtime context',
      status: 'not-yet-supported',
      scope: 'multi-cell',
      supportExpansionStatus: 'not-yet-supported',
      runtimeBehaviorStatus: 'diagnostic-only',
      caveats: [
        'not yet supported',
        'not support expansion',
        'no silent fallback',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    },
    {
      policyId: 'future-editable-source-profile-assignment-v0',
      label: 'Future editable source-profile assignment',
      status: 'not-yet-supported',
      scope: 'source-profile-assignment',
      supportExpansionStatus: 'not-yet-supported',
      runtimeBehaviorStatus: 'diagnostic-only',
      caveats: [
        'not yet supported',
        'not support expansion',
        'no silent fallback',
        'not semantic naming',
        'not topology workspace',
        'not packet writing',
      ],
    },
  ];

export function getProfileAwareRuntimeSupportPolicyRegistryEntry(
  policyId: string,
): ProfileAwareRuntimeSupportPolicyRegistryEntry | undefined {
  return PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_REGISTRY_ENTRIES.find(
    (entry) => entry.policyId === policyId,
  );
}

export function listProfileAwareRuntimeSupportPolicyRegistryEntries(): ProfileAwareRuntimeSupportPolicyRegistryEntry[] {
  return [...PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_REGISTRY_ENTRIES];
}

export function getProfileAwareRuntimeSupportPolicyRegistrySummary(): ProfileAwareRuntimeSupportPolicyRegistrySummary {
  return {
    registryId: PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_REGISTRY_ID,
    entryCount: PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_REGISTRY_ENTRIES.length,
    currentBaselineCount: countRegistryEntriesByStatus('current-baseline'),
    candidateNotPromotedCount: countRegistryEntriesByStatus(
      'candidate-not-promoted',
    ),
    notYetSupportedCount: countRegistryEntriesByStatus('not-yet-supported'),
    unsupportedControlCount: countRegistryEntriesByStatus('unsupported-control'),
    supportExpansionStatus: 'not-expanded-this-branch',
    fallbackSupportStatus: 'no-silent-fallback',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    packetWriteStatus: 'not-packet-writing',
  };
}

function countRegistryEntriesByStatus(
  status: ProfileAwareRuntimeSupportPolicyRegistryStatus,
): number {
  return PROFILE_AWARE_RUNTIME_SUPPORT_POLICY_REGISTRY_ENTRIES.filter(
    (entry) => entry.status === status,
  ).length;
}
