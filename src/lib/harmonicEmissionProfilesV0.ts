import {
  buildFanoOctonionicCarrierTableV0Report,
  type FanoPrimalSourceId,
  type FanoUnitId,
} from './fanoOctonionicCarrierTableV0';

export type HarmonicProfileFamilyId =
  | 'equal-phase-quadrature-control-v0'
  | 'just-intonation-tetrad-v0'
  | 'pythagorean-tetrad-v0';

export type HarmonicSourceSlotId = FanoPrimalSourceId;

export interface HarmonicFrequencyRatio {
  numerator: number;
  denominator: number;
  value: number;
}

export interface HarmonicProfileFamilyRow {
  profileFamilyId: HarmonicProfileFamilyId;
  purpose: string;
  familyStatus: 'finite-profile-family';
}

export interface HarmonicEmissionProfileRow {
  profileId: string;
  profileFamilyId: HarmonicProfileFamilyId;
  sourceSlotId: HarmonicSourceSlotId;
  sourceSlotStatus: 'placeholder-source-slot-not-semantic-label';
  amplitude: number;
  frequencyRatio: HarmonicFrequencyRatio;
  phaseRadians: number;
  attenuation: number;
  intrinsicOscillatorStatus: 'intrinsic-oscillator-profile-defined';
  spatialProjectionStatus: 'not-projected-to-spatial-field-in-e0';
  carrierAttachmentStatus: 'attachable-to-c0-primal-carrier-not-mutating-carrier';
  tuningStatus: 'finite-library-value-not-per-run-tuning';
}

export interface HarmonicProfileSetRow {
  profileSetId: string;
  profileFamilyId: HarmonicProfileFamilyId;
  sourceSlotCount: number;
  profileIds: string[];
  sourceSlots: HarmonicSourceSlotId[];
  finiteSetStatus: 'finite-four-slot-profile-set';
}

export interface PrimalProfileAttachmentRow {
  profileSetId: string;
  sourceSlotId: HarmonicSourceSlotId;
  c0CarrierUnit: FanoUnitId;
  profileId: string;
  carrierEmissionSeparationStatus: 'carrier-read-from-c0-profile-read-from-e0';
  attachmentStatus: 'attachable-not-mutating-c0-source';
}

export interface HarmonicEmissionProfilesV0Summary {
  method: 'harmonic-emission-profiles-v0';
  profileFamilyCount: number;
  profileSetCount: number;
  profileRowCount: number;
  primalProfileAttachmentRowCount: number;
  c0PrimalCarrierCount: number;
  sourceSlotCountPerSet: number;
  finiteLibraryStatus: 'finite-curated-profile-library';
  arbitraryTuningStatus: 'no-per-run-free-tuning';
  carrierEmissionSeparationStatus: 'carrier-and-emission-separated';
  spatialProjectionStatus: 'oscillator-profile-defined-spatial-projection-deferred';
  semanticLabelStatus: 'not-attached-placeholders-only';
  childEmissionEnvelopeStatus: 'not-computed-in-e0';
  spinorBridgeStatus: 'not-in-e0-carrier-bridge-preserved-upstream';
  uiStatus: 'no-ui';
  recommendedNextGate: 'E1 - Fano-Octonionic Child Emission Envelope Table';
}

export interface HarmonicEmissionProfilesV0Issue {
  code: string;
  message: string;
}

export interface HarmonicEmissionProfilesV0Report {
  method: 'harmonic-emission-profiles-v0';
  c0DependencyStatus: 'profile-slots-aligned-to-c0-primal-carriers';
  profileFamilies: HarmonicProfileFamilyRow[];
  profileRows: HarmonicEmissionProfileRow[];
  profileSetRows: HarmonicProfileSetRow[];
  primalProfileAttachmentRows: PrimalProfileAttachmentRow[];
  summary: HarmonicEmissionProfilesV0Summary;
  issues: HarmonicEmissionProfilesV0Issue[];
  ok: boolean;
}

interface HarmonicFamilyDefinition {
  profileFamilyId: HarmonicProfileFamilyId;
  purpose: string;
  slotDefinitions: readonly HarmonicSlotDefinition[];
}

interface HarmonicSlotDefinition {
  sourceSlotId: HarmonicSourceSlotId;
  numerator: number;
  denominator: number;
  phaseRadians: number;
}

const SOURCE_SLOT_ORDER: readonly HarmonicSourceSlotId[] = [
  'A',
  'B',
  'C',
  'D',
];
const AMPLITUDE = 1;
const ATTENUATION = 0.05;

const PROFILE_FAMILY_DEFINITIONS: readonly HarmonicFamilyDefinition[] = [
  {
    profileFamilyId: 'equal-phase-quadrature-control-v0',
    purpose:
      'Neutral control library with equal amplitude, equal frequency, and quadrature phases.',
    slotDefinitions: [
      { sourceSlotId: 'A', numerator: 1, denominator: 1, phaseRadians: 0 },
      {
        sourceSlotId: 'B',
        numerator: 1,
        denominator: 1,
        phaseRadians: Math.PI / 2,
      },
      { sourceSlotId: 'C', numerator: 1, denominator: 1, phaseRadians: Math.PI },
      {
        sourceSlotId: 'D',
        numerator: 1,
        denominator: 1,
        phaseRadians: (3 * Math.PI) / 2,
      },
    ],
  },
  {
    profileFamilyId: 'just-intonation-tetrad-v0',
    purpose: 'Small just-intonation harmonic candidate.',
    slotDefinitions: [
      { sourceSlotId: 'A', numerator: 1, denominator: 1, phaseRadians: 0 },
      {
        sourceSlotId: 'B',
        numerator: 9,
        denominator: 8,
        phaseRadians: Math.PI / 2,
      },
      { sourceSlotId: 'C', numerator: 5, denominator: 4, phaseRadians: Math.PI },
      {
        sourceSlotId: 'D',
        numerator: 3,
        denominator: 2,
        phaseRadians: (3 * Math.PI) / 2,
      },
    ],
  },
  {
    profileFamilyId: 'pythagorean-tetrad-v0',
    purpose: 'Small Pythagorean harmonic candidate.',
    slotDefinitions: [
      { sourceSlotId: 'A', numerator: 1, denominator: 1, phaseRadians: 0 },
      {
        sourceSlotId: 'B',
        numerator: 9,
        denominator: 8,
        phaseRadians: Math.PI / 2,
      },
      {
        sourceSlotId: 'C',
        numerator: 81,
        denominator: 64,
        phaseRadians: Math.PI,
      },
      {
        sourceSlotId: 'D',
        numerator: 3,
        denominator: 2,
        phaseRadians: (3 * Math.PI) / 2,
      },
    ],
  },
];

export function buildHarmonicEmissionProfilesV0Report(): HarmonicEmissionProfilesV0Report {
  const c0Report = buildFanoOctonionicCarrierTableV0Report();
  const c0CarrierUnitBySourceSlotId = new Map(
    c0Report.primalCarrierRows.map((row) => [row.sourceId, row.carrierUnit]),
  );
  const profileFamilies = PROFILE_FAMILY_DEFINITIONS.map((definition) => ({
    profileFamilyId: definition.profileFamilyId,
    purpose: definition.purpose,
    familyStatus: 'finite-profile-family' as const,
  }));
  const profileRows = PROFILE_FAMILY_DEFINITIONS.flatMap((definition) =>
    definition.slotDefinitions.map((slotDefinition) =>
      buildProfileRow(definition.profileFamilyId, slotDefinition),
    ),
  );
  const profileSetRows = PROFILE_FAMILY_DEFINITIONS.map((definition) =>
    buildProfileSetRow(definition.profileFamilyId, profileRows),
  );
  const primalProfileAttachmentRows = buildPrimalProfileAttachmentRows({
    profileRows,
    profileSetRows,
    c0CarrierUnitBySourceSlotId,
  });
  const summary = buildSummary({
    profileFamilies,
    profileRows,
    profileSetRows,
    primalProfileAttachmentRows,
    c0PrimalCarrierCount: c0Report.primalCarrierRows.length,
  });
  const issues = buildIssues({
    c0Ok: c0Report.ok,
    profileRows,
    profileSetRows,
    summary,
  });

  return {
    method: 'harmonic-emission-profiles-v0',
    c0DependencyStatus: 'profile-slots-aligned-to-c0-primal-carriers',
    profileFamilies,
    profileRows,
    profileSetRows,
    primalProfileAttachmentRows,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildProfileRow(
  profileFamilyId: HarmonicProfileFamilyId,
  slotDefinition: HarmonicSlotDefinition,
): HarmonicEmissionProfileRow {
  return {
    profileId: `${profileFamilyId}:${slotDefinition.sourceSlotId}`,
    profileFamilyId,
    sourceSlotId: slotDefinition.sourceSlotId,
    sourceSlotStatus: 'placeholder-source-slot-not-semantic-label',
    amplitude: AMPLITUDE,
    frequencyRatio: {
      numerator: slotDefinition.numerator,
      denominator: slotDefinition.denominator,
      value: slotDefinition.numerator / slotDefinition.denominator,
    },
    phaseRadians: slotDefinition.phaseRadians,
    attenuation: ATTENUATION,
    intrinsicOscillatorStatus: 'intrinsic-oscillator-profile-defined',
    spatialProjectionStatus: 'not-projected-to-spatial-field-in-e0',
    carrierAttachmentStatus: 'attachable-to-c0-primal-carrier-not-mutating-carrier',
    tuningStatus: 'finite-library-value-not-per-run-tuning',
  };
}

function buildProfileSetRow(
  profileFamilyId: HarmonicProfileFamilyId,
  profileRows: HarmonicEmissionProfileRow[],
): HarmonicProfileSetRow {
  const familyProfileRows = profileRows.filter(
    (row) => row.profileFamilyId === profileFamilyId,
  );

  return {
    profileSetId: `profile-set:${profileFamilyId}`,
    profileFamilyId,
    sourceSlotCount: familyProfileRows.length,
    profileIds: familyProfileRows.map((row) => row.profileId),
    sourceSlots: familyProfileRows.map((row) => row.sourceSlotId),
    finiteSetStatus: 'finite-four-slot-profile-set',
  };
}

function buildPrimalProfileAttachmentRows(args: {
  profileRows: HarmonicEmissionProfileRow[];
  profileSetRows: HarmonicProfileSetRow[];
  c0CarrierUnitBySourceSlotId: Map<HarmonicSourceSlotId, FanoUnitId>;
}): PrimalProfileAttachmentRow[] {
  return args.profileSetRows.flatMap((profileSetRow) =>
    profileSetRow.sourceSlots.map((sourceSlotId) => {
      const profileRow = args.profileRows.find(
        (row) =>
          row.profileFamilyId === profileSetRow.profileFamilyId &&
          row.sourceSlotId === sourceSlotId,
      );
      const c0CarrierUnit = args.c0CarrierUnitBySourceSlotId.get(sourceSlotId);

      if (!profileRow || !c0CarrierUnit) {
        throw new Error(
          `Unable to build primal profile attachment for ${profileSetRow.profileSetId}/${sourceSlotId}`,
        );
      }

      return {
        profileSetId: profileSetRow.profileSetId,
        sourceSlotId,
        c0CarrierUnit,
        profileId: profileRow.profileId,
        carrierEmissionSeparationStatus:
          'carrier-read-from-c0-profile-read-from-e0',
        attachmentStatus: 'attachable-not-mutating-c0-source',
      };
    }),
  );
}

function buildSummary(args: {
  profileFamilies: HarmonicProfileFamilyRow[];
  profileRows: HarmonicEmissionProfileRow[];
  profileSetRows: HarmonicProfileSetRow[];
  primalProfileAttachmentRows: PrimalProfileAttachmentRow[];
  c0PrimalCarrierCount: number;
}): HarmonicEmissionProfilesV0Summary {
  return {
    method: 'harmonic-emission-profiles-v0',
    profileFamilyCount: args.profileFamilies.length,
    profileSetCount: args.profileSetRows.length,
    profileRowCount: args.profileRows.length,
    primalProfileAttachmentRowCount: args.primalProfileAttachmentRows.length,
    c0PrimalCarrierCount: args.c0PrimalCarrierCount,
    sourceSlotCountPerSet: SOURCE_SLOT_ORDER.length,
    finiteLibraryStatus: 'finite-curated-profile-library',
    arbitraryTuningStatus: 'no-per-run-free-tuning',
    carrierEmissionSeparationStatus: 'carrier-and-emission-separated',
    spatialProjectionStatus:
      'oscillator-profile-defined-spatial-projection-deferred',
    semanticLabelStatus: 'not-attached-placeholders-only',
    childEmissionEnvelopeStatus: 'not-computed-in-e0',
    spinorBridgeStatus: 'not-in-e0-carrier-bridge-preserved-upstream',
    uiStatus: 'no-ui',
    recommendedNextGate: 'E1 - Fano-Octonionic Child Emission Envelope Table',
  };
}

function buildIssues(args: {
  c0Ok: boolean;
  profileRows: HarmonicEmissionProfileRow[];
  profileSetRows: HarmonicProfileSetRow[];
  summary: HarmonicEmissionProfilesV0Summary;
}): HarmonicEmissionProfilesV0Issue[] {
  const issues: HarmonicEmissionProfilesV0Issue[] = [];

  if (!args.c0Ok) {
    issues.push(issue('c0-report-not-ok', 'C0 carrier table report is not ok'));
  }

  expectCount(issues, args.summary.profileFamilyCount, 3, 'profile-family-count');
  expectCount(issues, args.summary.profileSetCount, 3, 'profile-set-count');
  expectCount(issues, args.summary.profileRowCount, 12, 'profile-row-count');
  expectCount(
    issues,
    args.summary.primalProfileAttachmentRowCount,
    12,
    'primal-profile-attachment-row-count',
  );

  for (const profileSetRow of args.profileSetRows) {
    if (!hasExactlySourceSlots(profileSetRow.sourceSlots)) {
      issues.push(
        issue(
          'profile-set-source-slots-mismatch',
          `${profileSetRow.profileSetId}: ${profileSetRow.sourceSlots.join('/')}`,
        ),
      );
    }
  }

  for (const profileRow of args.profileRows) {
    if (profileRow.amplitude <= 0) {
      issues.push(issue('non-positive-amplitude', profileRow.profileId));
    }

    if (profileRow.frequencyRatio.value <= 0) {
      issues.push(issue('non-positive-frequency-ratio', profileRow.profileId));
    }

    if (!Number.isFinite(profileRow.phaseRadians)) {
      issues.push(issue('non-finite-phase', profileRow.profileId));
    }

    if (profileRow.attenuation < 0) {
      issues.push(issue('negative-attenuation', profileRow.profileId));
    }

    if (
      profileRow.sourceSlotStatus !==
      'placeholder-source-slot-not-semantic-label'
    ) {
      issues.push(issue('source-slot-status-mismatch', profileRow.profileId));
    }

    if (
      profileRow.spatialProjectionStatus !==
      'not-projected-to-spatial-field-in-e0'
    ) {
      issues.push(issue('spatial-projection-attached', profileRow.profileId));
    }
  }

  if (args.summary.arbitraryTuningStatus !== 'no-per-run-free-tuning') {
    issues.push(
      issue('arbitrary-tuning-status-mismatch', args.summary.arbitraryTuningStatus),
    );
  }

  if (
    args.summary.carrierEmissionSeparationStatus !==
    'carrier-and-emission-separated'
  ) {
    issues.push(
      issue(
        'carrier-emission-separation-missing',
        args.summary.carrierEmissionSeparationStatus,
      ),
    );
  }

  if (args.summary.semanticLabelStatus !== 'not-attached-placeholders-only') {
    issues.push(
      issue('semantic-label-attached', 'semantic labels must remain unattached'),
    );
  }

  if (args.summary.childEmissionEnvelopeStatus !== 'not-computed-in-e0') {
    issues.push(
      issue(
        'child-emission-envelope-computed',
        args.summary.childEmissionEnvelopeStatus,
      ),
    );
  }

  if (args.summary.uiStatus !== 'no-ui') {
    issues.push(issue('ui-attached', args.summary.uiStatus));
  }

  return issues;
}

function hasExactlySourceSlots(sourceSlots: HarmonicSourceSlotId[]): boolean {
  return (
    sourceSlots.length === SOURCE_SLOT_ORDER.length &&
    SOURCE_SLOT_ORDER.every((sourceSlotId) => sourceSlots.includes(sourceSlotId))
  );
}

function expectCount(
  issues: HarmonicEmissionProfilesV0Issue[],
  actual: number,
  expected: number,
  code: string,
) {
  if (actual !== expected) {
    issues.push(issue(code, `expected ${expected}, got ${actual}`));
  }
}

function issue(
  code: string,
  message: string,
): HarmonicEmissionProfilesV0Issue {
  return { code, message };
}
