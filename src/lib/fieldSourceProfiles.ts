export interface FieldSourceEmissionParameters {
  amplitude: number;
  waveNumber: number;
  phase: number;
  attenuation: number;
}

export interface FieldSourceProfileSystem {
  systemId: string;
  label: string;
  profileCount: number;
  baseAmplitude: number;
  baseWaveNumber: number;
  baseAttenuation: number;
  phaseOrigin: number;
  phaseArrangement: 'uniform-circle' | 'custom-fixed';
  roleScope: 'primal-profile-system';
  description?: string;
}

export interface FieldSourceProfile extends FieldSourceEmissionParameters {
  profileId: string;
  systemId: string;
  profileIndex: number;
  label: string;
  roleScope: 'primal-only' | 'child-derived' | 'any';
}

export interface FieldSourceProfileAssignment {
  vertexId: string;
  profileId: string;
  assignmentMode: 'manual';
}

export interface FieldSourceProfileSetup {
  setupId: string;
  label: string;
  profileSystemId: string;
  assignments: FieldSourceProfileAssignment[];
  childInheritanceGrammarId: 'quark-coherent-child-inheritance-v0';
}

export type FieldSourceProfileDiagnosticIssueCode =
  | 'missing-profile-system'
  | 'missing-profile-setup'
  | 'invalid-profile-count'
  | 'unsupported-phase-arrangement'
  | 'duplicate-profile-id'
  | 'generated-profile-count-mismatch'
  | 'generated-profile-definition-mismatch'
  | 'generated-profile-system-mismatch'
  | 'non-finite-profile-parameter'
  | 'duplicate-active-primal-vertex'
  | 'missing-primal-assignment'
  | 'duplicate-primal-assignment'
  | 'assignment-references-unknown-profile'
  | 'assignment-mode-not-manual'
  | 'setup-profile-system-mismatch'
  | 'assigned-source-profile-mismatch';

export interface FieldSourceProfileDiagnosticIssue {
  code: FieldSourceProfileDiagnosticIssueCode;
  message: string;
  vertexId?: string;
  profileId?: string;
  profileSystemId?: string;
  setupId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface AssignedPrimalEmissionSource extends FieldSourceEmissionParameters {
  sourceId: string;
  vertexId: string;
  profileId: string;
  profileSystemId: string;
  profileIndex: number;
  assignmentMode: 'manual';
  roleScope: 'primal-only' | 'child-derived' | 'any';
  profileParameterMatch: boolean;
}

export interface BuildPrimalProfileAssignmentDiagnosticReportArgs {
  profileSystem?: FieldSourceProfileSystem | null;
  setup?: FieldSourceProfileSetup | null;
  activePrimalVertexIds: string[];
  generatedProfiles?: FieldSourceProfile[];
}

export interface FieldSourceProfileAssignmentDiagnosticReport {
  reportId: string;
  method: 'field-source-profile-assignment-diagnostic-v0';
  profileSystemId?: string;
  setupId?: string;
  profileSystemRoleScope?: 'primal-profile-system';
  phaseArrangement?: FieldSourceProfileSystem['phaseArrangement'];
  childInheritanceGrammarId?: FieldSourceProfileSetup['childInheritanceGrammarId'];
  assignmentScope: 'field-layer-setup-only';
  shapeMutationStatus: 'not-shape-mutation';
  activePrimalVertexIds: string[];
  duplicateActivePrimalVertexIds: string[];
  generatedProfileIds: string[];
  assignedSources: AssignedPrimalEmissionSource[];
  assignedSourcesMatchProfiles: boolean;
  issues: FieldSourceProfileDiagnosticIssue[];
  profileCount: number;
  activePrimalVertexCount: number;
  assignmentCount: number;
  assignedSourceCount: number;
  missingSetupCount: number;
  duplicateActivePrimalVertexCount: number;
  generatedProfileCountMismatchCount: number;
  generatedProfileDefinitionMismatchCount: number;
  generatedProfileSystemMismatchCount: number;
  missingAssignmentCount: number;
  duplicateAssignmentCount: number;
  unknownProfileAssignmentCount: number;
  nonFiniteProfileCount: number;
  issueCount: number;
  ok: boolean;
}

const TWO_PI = 2 * Math.PI;
const DEFAULT_TETRAHEDRON_PROFILE_COUNT = 4;
const TETRAHEDRON_PRIMAL_FIXTURE_VERTEX_IDS = ['A', 'B', 'C', 'D'];

export function normalizePhaseRadians(phase: number): number {
  if (!Number.isFinite(phase)) {
    return phase;
  }

  const normalized = phase % TWO_PI;
  const positive = normalized < 0 ? normalized + TWO_PI : normalized;

  return Object.is(positive, -0) ? 0 : positive;
}

export function isFiniteEmissionParameters(
  params: Partial<FieldSourceEmissionParameters> | null | undefined,
): boolean {
  return Boolean(
    params &&
      Number.isFinite(params.amplitude) &&
      Number.isFinite(params.waveNumber) &&
      Number.isFinite(params.phase) &&
      Number.isFinite(params.attenuation),
  );
}

export function generateFieldSourceProfiles(
  system: FieldSourceProfileSystem,
): FieldSourceProfile[] {
  if (!Number.isInteger(system.profileCount) || system.profileCount <= 0) {
    throw new Error(`Profile system ${system.systemId} must have a positive integer profile count.`);
  }

  if (system.phaseArrangement !== 'uniform-circle') {
    throw new Error(
      `Profile system ${system.systemId} uses unsupported phase arrangement ${system.phaseArrangement}.`,
    );
  }

  return Array.from({ length: system.profileCount }, (_, profileIndex) => ({
    profileId: buildProfileId(system.systemId, profileIndex),
    systemId: system.systemId,
    profileIndex,
    label: `profile-${formatProfileIndex(profileIndex)}`,
    amplitude: system.baseAmplitude,
    waveNumber: system.baseWaveNumber,
    phase: normalizePhaseRadians(
      system.phaseOrigin + profileIndex * (TWO_PI / system.profileCount),
    ),
    attenuation: system.baseAttenuation,
    roleScope: 'primal-only',
  }));
}

export function createUniformCirclePrimalProfileSystemFixture(
  profileCount = DEFAULT_TETRAHEDRON_PROFILE_COUNT,
): FieldSourceProfileSystem {
  return {
    systemId: `uniform-circle-primal-profile-system-v0:${profileCount}`,
    label: `uniform-circle-${profileCount}-slot-primal-profile-system`,
    profileCount,
    baseAmplitude: 1,
    baseWaveNumber: Math.PI,
    baseAttenuation: 0.05,
    phaseOrigin: 0,
    phaseArrangement: 'uniform-circle',
    roleScope: 'primal-profile-system',
    description: 'Diagnostic finite profile system for manual primal source assignment.',
  };
}

export function createTetrahedronPrimalProfileAssignmentFixture(
  profiles: FieldSourceProfile[],
): FieldSourceProfileAssignment[] {
  if (profiles.length < TETRAHEDRON_PRIMAL_FIXTURE_VERTEX_IDS.length) {
    throw new Error('Tetrahedron primal profile assignment fixture requires at least four profiles.');
  }

  return TETRAHEDRON_PRIMAL_FIXTURE_VERTEX_IDS.map((vertexId, profileIndex) => ({
    vertexId,
    profileId: profiles[profileIndex].profileId,
    assignmentMode: 'manual',
  }));
}

export function createTetrahedronFieldSourceProfileSetupFixture(
  system: FieldSourceProfileSystem,
  assignments: FieldSourceProfileAssignment[],
): FieldSourceProfileSetup {
  return {
    setupId: `tetrahedron-primal-profile-setup-v0:${system.systemId}`,
    label: 'tetrahedron-primal-profile-assignment-fixture',
    profileSystemId: system.systemId,
    assignments: assignments.map((assignment) => ({ ...assignment })),
    childInheritanceGrammarId: 'quark-coherent-child-inheritance-v0',
  };
}

export function buildPrimalProfileAssignmentDiagnosticReport(
  args: BuildPrimalProfileAssignmentDiagnosticReportArgs,
): FieldSourceProfileAssignmentDiagnosticReport {
  const issues: FieldSourceProfileDiagnosticIssue[] = [];
  const profileSystem = args.profileSystem ?? null;
  const setup = args.setup ?? null;
  const duplicateActivePrimalVertexIds = collectDuplicateIds(args.activePrimalVertexIds);
  const activePrimalVertexIds = uniquePreservingOrder(args.activePrimalVertexIds);
  const assignments = setup?.assignments ?? [];
  const resolvedGeneratedProfiles = resolveGeneratedProfiles(
    profileSystem,
    args.generatedProfiles,
    issues,
  );
  const generatedProfiles = resolvedGeneratedProfiles.profiles;

  if (!profileSystem) {
    issues.push({
      code: 'missing-profile-system',
      message: 'No active field source profile system was provided.',
    });
  }

  if (!setup) {
    issues.push({
      code: 'missing-profile-setup',
      message: 'No field source profile setup was provided.',
      profileSystemId: profileSystem?.systemId,
    });
  }

  for (const vertexId of duplicateActivePrimalVertexIds) {
    issues.push({
      code: 'duplicate-active-primal-vertex',
      message: `Active primal vertex ${vertexId} appears more than once in diagnostic input.`,
      vertexId,
      details: {
        activeInputCount: args.activePrimalVertexIds.filter((candidate) => candidate === vertexId)
          .length,
      },
    });
  }

  if (
    profileSystem &&
    setup &&
    setup.profileSystemId !== profileSystem.systemId
  ) {
    issues.push({
      code: 'setup-profile-system-mismatch',
      message: `Setup ${setup.setupId} references ${setup.profileSystemId}, not ${profileSystem.systemId}.`,
      profileSystemId: profileSystem.systemId,
      setupId: setup.setupId,
      details: {
        setupProfileSystemId: setup.profileSystemId,
      },
    });
  }

  const duplicateProfileIds = collectDuplicateIds(generatedProfiles.map((profile) => profile.profileId));
  const invalidGeneratedProfileIds = new Set(resolvedGeneratedProfiles.invalidProfileIds);

  for (const profileId of duplicateProfileIds) {
    invalidGeneratedProfileIds.add(profileId);
    issues.push({
      code: 'duplicate-profile-id',
      message: `Generated profile id ${profileId} appears more than once.`,
      profileId,
    });
  }

  const nonFiniteProfiles = generatedProfiles.filter(
    (profile) => !isFiniteEmissionParameters(profile),
  );
  const generatedProfileSystemMismatches = profileSystem
    ? generatedProfiles.filter((profile) => profile.systemId !== profileSystem.systemId)
    : [];

  for (const profile of generatedProfileSystemMismatches) {
    invalidGeneratedProfileIds.add(profile.profileId);
    issues.push({
      code: 'generated-profile-system-mismatch',
      message: `Generated profile ${profile.profileId} belongs to ${profile.systemId}, not ${profileSystem?.systemId}.`,
      profileId: profile.profileId,
      profileSystemId: profileSystem?.systemId,
      details: {
        generatedProfileSystemId: profile.systemId,
      },
    });
  }

  for (const profile of nonFiniteProfiles) {
    invalidGeneratedProfileIds.add(profile.profileId);
    issues.push({
      code: 'non-finite-profile-parameter',
      message: `Generated profile ${profile.profileId} contains a non-finite emission parameter.`,
      profileId: profile.profileId,
      profileSystemId: profile.systemId,
    });
  }

  const profileById = new Map<string, FieldSourceProfile>();

  for (const profile of generatedProfiles) {
    if (invalidGeneratedProfileIds.has(profile.profileId)) {
      continue;
    }

    if (!profileById.has(profile.profileId)) {
      profileById.set(profile.profileId, profile);
    }
  }

  const unknownProfileAssignments = assignments.filter(
    (assignment) => !profileById.has(assignment.profileId),
  );

  for (const assignment of unknownProfileAssignments) {
    issues.push({
      code: 'assignment-references-unknown-profile',
      message: `Assignment for ${assignment.vertexId} references unknown profile ${assignment.profileId}.`,
      vertexId: assignment.vertexId,
      profileId: assignment.profileId,
      setupId: setup?.setupId,
    });
  }

  for (const assignment of assignments) {
    if ((assignment as { assignmentMode?: string }).assignmentMode !== 'manual') {
      issues.push({
        code: 'assignment-mode-not-manual',
        message: `Assignment for ${assignment.vertexId} is not manual.`,
        vertexId: assignment.vertexId,
        profileId: assignment.profileId,
        setupId: setup?.setupId,
      });
    }
  }

  const manualAssignmentsByVertexId = groupManualAssignmentsByVertexId(assignments);
  const missingVertexIds: string[] = [];
  const duplicateVertexIds: string[] = [];

  for (const vertexId of activePrimalVertexIds) {
    const manualAssignments = manualAssignmentsByVertexId.get(vertexId) ?? [];

    if (manualAssignments.length === 0) {
      missingVertexIds.push(vertexId);
      issues.push({
        code: 'missing-primal-assignment',
        message: `Active primal vertex ${vertexId} has no manual source profile assignment.`,
        vertexId,
        setupId: setup?.setupId,
      });
    } else if (manualAssignments.length > 1) {
      duplicateVertexIds.push(vertexId);
      issues.push({
        code: 'duplicate-primal-assignment',
        message: `Active primal vertex ${vertexId} has ${manualAssignments.length} manual assignments.`,
        vertexId,
        setupId: setup?.setupId,
        details: {
          assignmentCount: manualAssignments.length,
        },
      });
    }
  }

  const assignedSources = buildAssignedPrimalEmissionSources(
    activePrimalVertexIds,
    manualAssignmentsByVertexId,
    profileById,
  );
  const mismatchedAssignedSources = assignedSources.filter(
    (assignedSource) => !assignedSource.profileParameterMatch,
  );

  for (const assignedSource of mismatchedAssignedSources) {
    issues.push({
      code: 'assigned-source-profile-mismatch',
      message: `Assigned source for ${assignedSource.vertexId} does not match profile ${assignedSource.profileId}.`,
      vertexId: assignedSource.vertexId,
      profileId: assignedSource.profileId,
      profileSystemId: assignedSource.profileSystemId,
      setupId: setup?.setupId,
    });
  }

  const issueCount = issues.length;

  return {
    reportId: `field-source-profile-assignment-diagnostic-v0:${
      setup?.setupId ?? profileSystem?.systemId ?? 'missing-profile-system'
    }`,
    method: 'field-source-profile-assignment-diagnostic-v0',
    ...(profileSystem
      ? {
          profileSystemId: profileSystem.systemId,
          profileSystemRoleScope: profileSystem.roleScope,
          phaseArrangement: profileSystem.phaseArrangement,
        }
      : {}),
    ...(setup
      ? {
          setupId: setup.setupId,
          childInheritanceGrammarId: setup.childInheritanceGrammarId,
        }
      : {}),
    assignmentScope: 'field-layer-setup-only',
    shapeMutationStatus: 'not-shape-mutation',
    activePrimalVertexIds,
    duplicateActivePrimalVertexIds,
    generatedProfileIds: generatedProfiles.map((profile) => profile.profileId),
    assignedSources,
    assignedSourcesMatchProfiles: mismatchedAssignedSources.length === 0,
    issues,
    profileCount: generatedProfiles.length,
    activePrimalVertexCount: activePrimalVertexIds.length,
    assignmentCount: assignments.length,
    assignedSourceCount: assignedSources.length,
    missingSetupCount: setup ? 0 : 1,
    duplicateActivePrimalVertexCount: duplicateActivePrimalVertexIds.length,
    generatedProfileCountMismatchCount:
      resolvedGeneratedProfiles.generatedProfileCountMismatchCount,
    generatedProfileDefinitionMismatchCount:
      resolvedGeneratedProfiles.generatedProfileDefinitionMismatchCount,
    generatedProfileSystemMismatchCount: generatedProfileSystemMismatches.length,
    missingAssignmentCount: missingVertexIds.length,
    duplicateAssignmentCount: duplicateVertexIds.length,
    unknownProfileAssignmentCount: unknownProfileAssignments.length,
    nonFiniteProfileCount: nonFiniteProfiles.length,
    issueCount,
    ok: issueCount === 0,
  };
}

interface ResolvedGeneratedProfiles {
  profiles: FieldSourceProfile[];
  invalidProfileIds: Set<string>;
  generatedProfileCountMismatchCount: number;
  generatedProfileDefinitionMismatchCount: number;
}

function resolveGeneratedProfiles(
  profileSystem: FieldSourceProfileSystem | null,
  explicitProfiles: FieldSourceProfile[] | undefined,
  issues: FieldSourceProfileDiagnosticIssue[],
): ResolvedGeneratedProfiles {
  const invalidProfileIds = new Set<string>();
  let generatedProfileCountMismatchCount = 0;
  let generatedProfileDefinitionMismatchCount = 0;

  if (explicitProfiles) {
    const profiles = explicitProfiles.map((profile) => ({ ...profile }));

    if (!profileSystem) {
      return {
        profiles,
        invalidProfileIds,
        generatedProfileCountMismatchCount,
        generatedProfileDefinitionMismatchCount,
      };
    }

    const canonicalProfiles = resolveCanonicalGeneratedProfiles(profileSystem, issues);

    if (profiles.length !== profileSystem.profileCount) {
      generatedProfileCountMismatchCount = 1;
      issues.push({
        code: 'generated-profile-count-mismatch',
        message: `Explicit generated profile count ${profiles.length} does not match profile system count ${profileSystem.profileCount}.`,
        profileSystemId: profileSystem.systemId,
        details: {
          suppliedProfileCount: profiles.length,
          expectedProfileCount: profileSystem.profileCount,
        },
      });
    }

    const canonicalProfileById = new Map(
      canonicalProfiles.map((profile) => [profile.profileId, profile]),
    );

    for (const profile of profiles) {
      const canonicalProfile = canonicalProfileById.get(profile.profileId);

      if (!canonicalProfile) {
        generatedProfileDefinitionMismatchCount += 1;
        invalidProfileIds.add(profile.profileId);
        issues.push({
          code: 'generated-profile-definition-mismatch',
          message: `Explicit generated profile ${profile.profileId} is not in the canonical generated profile set.`,
          profileId: profile.profileId,
          profileSystemId: profileSystem.systemId,
          details: {
            reason: 'profile-id-not-in-canonical-generated-set',
          },
        });
        continue;
      }

      const mismatchedFields = findGeneratedProfileDefinitionMismatches(
        profile,
        canonicalProfile,
      );

      if (mismatchedFields.length > 0) {
        generatedProfileDefinitionMismatchCount += 1;
        invalidProfileIds.add(profile.profileId);
        issues.push({
          code: 'generated-profile-definition-mismatch',
          message: `Explicit generated profile ${profile.profileId} differs from its canonical generated profile.`,
          profileId: profile.profileId,
          profileSystemId: profileSystem.systemId,
          details: {
            mismatchedFields: mismatchedFields.join(','),
          },
        });
      }
    }

    return {
      profiles,
      invalidProfileIds,
      generatedProfileCountMismatchCount,
      generatedProfileDefinitionMismatchCount,
    };
  }

  if (!profileSystem) {
    return {
      profiles: [],
      invalidProfileIds,
      generatedProfileCountMismatchCount,
      generatedProfileDefinitionMismatchCount,
    };
  }

  return {
    profiles: resolveCanonicalGeneratedProfiles(profileSystem, issues),
    invalidProfileIds,
    generatedProfileCountMismatchCount,
    generatedProfileDefinitionMismatchCount,
  };
}

function resolveCanonicalGeneratedProfiles(
  profileSystem: FieldSourceProfileSystem,
  issues: FieldSourceProfileDiagnosticIssue[],
): FieldSourceProfile[] {
  if (!Number.isInteger(profileSystem.profileCount) || profileSystem.profileCount <= 0) {
    issues.push({
      code: 'invalid-profile-count',
      message: `Profile system ${profileSystem.systemId} must have a positive integer profile count.`,
      profileSystemId: profileSystem.systemId,
      details: {
        profileCount: profileSystem.profileCount,
      },
    });

    return [];
  }

  if (profileSystem.phaseArrangement !== 'uniform-circle') {
    issues.push({
      code: 'unsupported-phase-arrangement',
      message: `Profile system ${profileSystem.systemId} uses unsupported phase arrangement ${profileSystem.phaseArrangement}.`,
      profileSystemId: profileSystem.systemId,
      details: {
        phaseArrangement: profileSystem.phaseArrangement,
      },
    });

    return [];
  }

  return generateFieldSourceProfiles(profileSystem);
}

function findGeneratedProfileDefinitionMismatches(
  suppliedProfile: FieldSourceProfile,
  canonicalProfile: FieldSourceProfile,
): string[] {
  const mismatchedFields: string[] = [];

  if (suppliedProfile.profileIndex !== canonicalProfile.profileIndex) {
    mismatchedFields.push('profileIndex');
  }

  if (suppliedProfile.systemId !== canonicalProfile.systemId) {
    mismatchedFields.push('systemId');
  }

  if (suppliedProfile.roleScope !== canonicalProfile.roleScope) {
    mismatchedFields.push('roleScope');
  }

  if (suppliedProfile.amplitude !== canonicalProfile.amplitude) {
    mismatchedFields.push('amplitude');
  }

  if (suppliedProfile.waveNumber !== canonicalProfile.waveNumber) {
    mismatchedFields.push('waveNumber');
  }

  if (suppliedProfile.phase !== canonicalProfile.phase) {
    mismatchedFields.push('phase');
  }

  if (suppliedProfile.attenuation !== canonicalProfile.attenuation) {
    mismatchedFields.push('attenuation');
  }

  return mismatchedFields;
}

function buildAssignedPrimalEmissionSources(
  activePrimalVertexIds: string[],
  manualAssignmentsByVertexId: Map<string, FieldSourceProfileAssignment[]>,
  profileById: Map<string, FieldSourceProfile>,
): AssignedPrimalEmissionSource[] {
  return activePrimalVertexIds.flatMap((vertexId) => {
    const assignments = manualAssignmentsByVertexId.get(vertexId) ?? [];

    if (assignments.length !== 1) {
      return [];
    }

    const assignment = assignments[0];
    const profile = profileById.get(assignment.profileId);

    if (!profile || !isFiniteEmissionParameters(profile)) {
      return [];
    }

    const assignedSource: AssignedPrimalEmissionSource = {
      sourceId: `field-source-profile-assignment:${vertexId}:${profile.profileId}`,
      vertexId,
      profileId: profile.profileId,
      profileSystemId: profile.systemId,
      profileIndex: profile.profileIndex,
      assignmentMode: 'manual',
      roleScope: profile.roleScope,
      amplitude: profile.amplitude,
      waveNumber: profile.waveNumber,
      phase: profile.phase,
      attenuation: profile.attenuation,
      profileParameterMatch: true,
    };

    assignedSource.profileParameterMatch = sameEmissionParameters(assignedSource, profile);

    return [assignedSource];
  });
}

function groupManualAssignmentsByVertexId(
  assignments: FieldSourceProfileAssignment[],
): Map<string, FieldSourceProfileAssignment[]> {
  const assignmentsByVertexId = new Map<string, FieldSourceProfileAssignment[]>();

  for (const assignment of assignments) {
    if ((assignment as { assignmentMode?: string }).assignmentMode !== 'manual') {
      continue;
    }

    const current = assignmentsByVertexId.get(assignment.vertexId) ?? [];

    current.push(assignment);
    assignmentsByVertexId.set(assignment.vertexId, current);
  }

  return assignmentsByVertexId;
}

function sameEmissionParameters(
  left: FieldSourceEmissionParameters,
  right: FieldSourceEmissionParameters,
): boolean {
  return (
    left.amplitude === right.amplitude &&
    left.waveNumber === right.waveNumber &&
    left.phase === right.phase &&
    left.attenuation === right.attenuation
  );
}

function buildProfileId(systemId: string, profileIndex: number): string {
  return `field-source-profile:${systemId}:${formatProfileIndex(profileIndex)}`;
}

function formatProfileIndex(profileIndex: number): string {
  return profileIndex.toString().padStart(2, '0');
}

function uniquePreservingOrder(values: string[]): string[] {
  const seen = new Set<string>();
  const uniqueValues: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      uniqueValues.push(value);
    }
  }

  return uniqueValues;
}

function collectDuplicateIds(ids: string[]): string[] {
  const counts = new Map<string, number>();

  for (const id of ids) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return Array.from(counts)
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
}
