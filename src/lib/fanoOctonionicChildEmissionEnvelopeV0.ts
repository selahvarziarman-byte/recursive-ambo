import {
  buildFanoOctonionicLocalChannelTableV0Report,
  type FanoCanonicalChildCarrierState,
  type FanoLocalChannelRow,
} from './fanoOctonionicLocalChannelTableV0';
import {
  buildHarmonicEmissionProfilesV0Report,
  type HarmonicEmissionProfileRow,
  type HarmonicFrequencyRatio,
  type HarmonicProfileSetRow,
} from './harmonicEmissionProfilesV0';
import {
  type FanoCarrierRay,
  type FanoOrderedLiftId,
  type FanoPairTokenId,
  type FanoPrimalSourceId,
  type FanoSign,
  type FanoSignedLift,
  type FanoSourcePair,
} from './fanoOctonionicCarrierTableV0';

export interface FanoChildIntrinsicBirthEmission {
  birthLawId: 'product-modulation-octave-folded-v0';
  birthLawStatus: 'candidate-intrinsic-oscillator-law-not-spatial-field-law';
  parentProfileIdsInCanonicalOrder: string[];
  parentSourceSlotsInCanonicalOrder: FanoSourcePair;
  birthCoupling: number;
  amplitude: number;
  rawFrequencyRatio: HarmonicFrequencyRatio;
  foldedFrequencyRatio: HarmonicFrequencyRatio;
  octaveFoldCount: number;
  phaseRadians: number;
  carrierOrientationPhaseOffset: number;
  attenuation: number;
  frequencyNormalizationStatus: 'octave-folded-to-unit-octave';
  carrierPhaseProjectionStatus: 'signed-lift-phase-offset-applied-without-reducing-carrier';
  intrinsicOscillatorStatus: 'intrinsic-child-oscillator-profile-defined';
  spatialProjectionStatus: 'not-projected-to-spatial-field-in-e1';
}

export interface FanoChildEmissionChannelKernelRow {
  envelopeId: string;
  childTokenId: FanoPairTokenId;
  channelFamily: 'parent-return' | 'projection-loop';
  actionSourceId: FanoPrimalSourceId;
  expectedRecoveredSourceId: FanoPrimalSourceId;
  childLeftSignedResult: FanoSignedLift;
  sourceLeftSignedResult: FanoSignedLift;
  activationStatus: 'available-response-not-free-emission';
  derivationStatus: 'derived-from-c1-local-channel-row';
}

export interface FanoChildComplementCouplingKernelRow {
  envelopeId: string;
  childTokenId: FanoPairTokenId;
  complementTokenId: FanoPairTokenId;
  sharedCarrierRay: FanoCarrierRay;
  couplingFamily: 'complement-coupling';
  activationStatus: 'available-response-not-free-emission';
  derivationStatus: 'derived-from-c1-canonical-child-complement';
}

export interface FanoChildEmissionEnvelopeRow {
  envelopeId: string;
  profileSetId: string;
  childTokenId: FanoPairTokenId;
  childCanonicalLiftId: FanoOrderedLiftId;
  childSignedLift: FanoSignedLift;
  carrierRay: FanoCarrierRay;
  parentSet: FanoSourcePair;
  projectedSourceSet: FanoSourcePair;
  complementTokenId: FanoPairTokenId;
  intrinsicBirthEmission: FanoChildIntrinsicBirthEmission;
  parentReturnKernelRows: FanoChildEmissionChannelKernelRow[];
  projectionLoopKernelRows: FanoChildEmissionChannelKernelRow[];
  complementCouplingKernelRow: FanoChildComplementCouplingKernelRow;
  freeEmissionStatus: 'intrinsic-birth-emission-only';
  channelResponseStatus: 'local-channels-available-not-always-on';
  carrierEmissionSeparationStatus: 'carrier-read-from-c1-profiles-read-from-e0';
  spatialProjectionStatus: 'not-projected-to-spatial-field-in-e1';
  semanticLabelStatus: 'not-attached-placeholders-only';
  derivationStatus: 'derived-from-c1-carrier-channels-and-e0-profile-library';
}

export interface FanoOctonionicChildEmissionEnvelopeV0Summary {
  method: 'fano-octonionic-child-emission-envelope-v0';
  c1DependencyStatus: 'derived-from-c1-local-channel-table';
  e0DependencyStatus: 'derived-from-e0-finite-profile-library';
  profileSetCount: number;
  canonicalChildCarrierCount: number;
  childEmissionEnvelopeCount: number;
  intrinsicBirthEmissionCount: number;
  parentReturnKernelRowCount: number;
  projectionLoopKernelRowCount: number;
  complementCouplingKernelRowCount: number;
  totalChannelKernelRowCount: number;
  birthLawStatus: 'candidate-product-modulation-octave-folded-v0';
  frequencyNormalizationStatus: 'octave-folded-to-unit-octave';
  freeEmissionStatus: 'intrinsic-birth-emission-only';
  channelResponseStatus: 'local-channels-available-not-always-on';
  carrierPhaseProjectionStatus: 'signed-lift-phase-offset-applied-without-reducing-carrier';
  carrierEmissionSeparationStatus: 'carrier-and-emission-separated';
  spatialProjectionStatus: 'not-projected-to-spatial-field-in-e1';
  semanticLabelStatus: 'not-attached-placeholders-only';
  generationalFieldUpdateStatus: 'not-computed-in-e1';
  trisonSemanticStatus: 'not-computed-in-e1';
  spinorBridgeStatus: 'not-in-e1-carrier-bridge-preserved-upstream';
  uiStatus: 'no-ui';
  recommendedNextGate: 'S0 - Fano-Trison Semantic Residual Model Card';
}

export interface FanoOctonionicChildEmissionEnvelopeV0Issue {
  code: string;
  message: string;
}

export interface FanoOctonionicChildEmissionEnvelopeV0Report {
  method: 'fano-octonionic-child-emission-envelope-v0';
  childEmissionEnvelopes: FanoChildEmissionEnvelopeRow[];
  summary: FanoOctonionicChildEmissionEnvelopeV0Summary;
  issues: FanoOctonionicChildEmissionEnvelopeV0Issue[];
  ok: boolean;
}

const TWO_PI = Math.PI * 2;
const BIRTH_COUPLING = 1;

export function buildFanoOctonionicChildEmissionEnvelopeV0Report(): FanoOctonionicChildEmissionEnvelopeV0Report {
  const c1Report = buildFanoOctonionicLocalChannelTableV0Report();
  const e0Report = buildHarmonicEmissionProfilesV0Report();
  const childEmissionEnvelopes = e0Report.profileSetRows.flatMap((profileSetRow) =>
    c1Report.canonicalChildCarrierStates.map((childState) =>
      buildChildEmissionEnvelope({
        profileSetRow,
        childState,
        profileRows: e0Report.profileRows,
        localChannelRows: c1Report.localChannelRows,
      }),
    ),
  );
  const summary = buildSummary({
    profileSetCount: e0Report.profileSetRows.length,
    canonicalChildCarrierCount: c1Report.canonicalChildCarrierStates.length,
    childEmissionEnvelopes,
  });
  const issues = buildIssues({
    c1Ok: c1Report.ok,
    e0Ok: e0Report.ok,
    childEmissionEnvelopes,
    summary,
  });

  return {
    method: 'fano-octonionic-child-emission-envelope-v0',
    childEmissionEnvelopes,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildChildEmissionEnvelope(args: {
  profileSetRow: HarmonicProfileSetRow;
  childState: FanoCanonicalChildCarrierState;
  profileRows: HarmonicEmissionProfileRow[];
  localChannelRows: FanoLocalChannelRow[];
}): FanoChildEmissionEnvelopeRow {
  const envelopeId = `${args.profileSetRow.profileSetId}:${args.childState.tokenId}`;
  const childLocalChannelRows = args.localChannelRows.filter(
    (row) => row.childTokenId === args.childState.tokenId,
  );

  return {
    envelopeId,
    profileSetId: args.profileSetRow.profileSetId,
    childTokenId: args.childState.tokenId,
    childCanonicalLiftId: args.childState.canonicalLiftId,
    childSignedLift: args.childState.signedLift,
    carrierRay: args.childState.carrierRay,
    parentSet: args.childState.parentSet,
    projectedSourceSet: args.childState.projectedSourceSet,
    complementTokenId: args.childState.complementTokenId,
    intrinsicBirthEmission: buildIntrinsicBirthEmission({
      profileSetRow: args.profileSetRow,
      childState: args.childState,
      profileRows: args.profileRows,
    }),
    parentReturnKernelRows: childLocalChannelRows
      .filter((row) => row.channelFamily === 'child-parent-return')
      .map((row) => buildChannelKernelRow(envelopeId, row, 'parent-return')),
    projectionLoopKernelRows: childLocalChannelRows
      .filter((row) => row.channelFamily === 'child-projection-loop')
      .map((row) => buildChannelKernelRow(envelopeId, row, 'projection-loop')),
    complementCouplingKernelRow: {
      envelopeId,
      childTokenId: args.childState.tokenId,
      complementTokenId: args.childState.complementTokenId,
      sharedCarrierRay: args.childState.carrierRay,
      couplingFamily: 'complement-coupling',
      activationStatus: 'available-response-not-free-emission',
      derivationStatus: 'derived-from-c1-canonical-child-complement',
    },
    freeEmissionStatus: 'intrinsic-birth-emission-only',
    channelResponseStatus: 'local-channels-available-not-always-on',
    carrierEmissionSeparationStatus: 'carrier-read-from-c1-profiles-read-from-e0',
    spatialProjectionStatus: 'not-projected-to-spatial-field-in-e1',
    semanticLabelStatus: 'not-attached-placeholders-only',
    derivationStatus: 'derived-from-c1-carrier-channels-and-e0-profile-library',
  };
}

function buildIntrinsicBirthEmission(args: {
  profileSetRow: HarmonicProfileSetRow;
  childState: FanoCanonicalChildCarrierState;
  profileRows: HarmonicEmissionProfileRow[];
}): FanoChildIntrinsicBirthEmission {
  const parentSourceSlotsInCanonicalOrder = parseCanonicalLiftOrder(
    args.childState.canonicalLiftId,
  );
  const [firstParentProfile, secondParentProfile] =
    parentSourceSlotsInCanonicalOrder.map((sourceSlotId) =>
      getProfileForSourceSlot({
        profileSetRow: args.profileSetRow,
        sourceSlotId,
        profileRows: args.profileRows,
      }),
    ) as [HarmonicEmissionProfileRow, HarmonicEmissionProfileRow];
  const rawFrequencyRatio = addFrequencyRatios(
    firstParentProfile.frequencyRatio,
    secondParentProfile.frequencyRatio,
  );
  const foldedFrequency = octaveFold(rawFrequencyRatio);
  const carrierOrientationPhaseOffset =
    getSignedLiftSign(args.childState.signedLift) === '+' ? 0 : Math.PI;

  return {
    birthLawId: 'product-modulation-octave-folded-v0',
    birthLawStatus: 'candidate-intrinsic-oscillator-law-not-spatial-field-law',
    parentProfileIdsInCanonicalOrder: [
      firstParentProfile.profileId,
      secondParentProfile.profileId,
    ],
    parentSourceSlotsInCanonicalOrder,
    birthCoupling: BIRTH_COUPLING,
    amplitude:
      firstParentProfile.amplitude *
      secondParentProfile.amplitude *
      BIRTH_COUPLING,
    rawFrequencyRatio,
    foldedFrequencyRatio: foldedFrequency.frequencyRatio,
    octaveFoldCount: foldedFrequency.octaveFoldCount,
    phaseRadians: normalizeRadians(
      firstParentProfile.phaseRadians +
        secondParentProfile.phaseRadians +
        carrierOrientationPhaseOffset,
    ),
    carrierOrientationPhaseOffset,
    attenuation:
      firstParentProfile.attenuation + secondParentProfile.attenuation,
    frequencyNormalizationStatus: 'octave-folded-to-unit-octave',
    carrierPhaseProjectionStatus:
      'signed-lift-phase-offset-applied-without-reducing-carrier',
    intrinsicOscillatorStatus: 'intrinsic-child-oscillator-profile-defined',
    spatialProjectionStatus: 'not-projected-to-spatial-field-in-e1',
  };
}

function buildChannelKernelRow(
  envelopeId: string,
  localChannelRow: FanoLocalChannelRow,
  channelFamily: FanoChildEmissionChannelKernelRow['channelFamily'],
): FanoChildEmissionChannelKernelRow {
  return {
    envelopeId,
    childTokenId: localChannelRow.childTokenId,
    channelFamily,
    actionSourceId: localChannelRow.actionSourceId,
    expectedRecoveredSourceId: localChannelRow.expectedRecoveredSourceId,
    childLeftSignedResult: localChannelRow.childLeftSignedResult,
    sourceLeftSignedResult: localChannelRow.sourceLeftSignedResult,
    activationStatus: 'available-response-not-free-emission',
    derivationStatus: 'derived-from-c1-local-channel-row',
  };
}

function buildSummary(args: {
  profileSetCount: number;
  canonicalChildCarrierCount: number;
  childEmissionEnvelopes: FanoChildEmissionEnvelopeRow[];
}): FanoOctonionicChildEmissionEnvelopeV0Summary {
  const parentReturnKernelRowCount = args.childEmissionEnvelopes.reduce(
    (count, envelope) => count + envelope.parentReturnKernelRows.length,
    0,
  );
  const projectionLoopKernelRowCount = args.childEmissionEnvelopes.reduce(
    (count, envelope) => count + envelope.projectionLoopKernelRows.length,
    0,
  );
  const complementCouplingKernelRowCount = args.childEmissionEnvelopes.length;

  return {
    method: 'fano-octonionic-child-emission-envelope-v0',
    c1DependencyStatus: 'derived-from-c1-local-channel-table',
    e0DependencyStatus: 'derived-from-e0-finite-profile-library',
    profileSetCount: args.profileSetCount,
    canonicalChildCarrierCount: args.canonicalChildCarrierCount,
    childEmissionEnvelopeCount: args.childEmissionEnvelopes.length,
    intrinsicBirthEmissionCount: args.childEmissionEnvelopes.length,
    parentReturnKernelRowCount,
    projectionLoopKernelRowCount,
    complementCouplingKernelRowCount,
    totalChannelKernelRowCount:
      parentReturnKernelRowCount +
      projectionLoopKernelRowCount +
      complementCouplingKernelRowCount,
    birthLawStatus: 'candidate-product-modulation-octave-folded-v0',
    frequencyNormalizationStatus: 'octave-folded-to-unit-octave',
    freeEmissionStatus: 'intrinsic-birth-emission-only',
    channelResponseStatus: 'local-channels-available-not-always-on',
    carrierPhaseProjectionStatus:
      'signed-lift-phase-offset-applied-without-reducing-carrier',
    carrierEmissionSeparationStatus: 'carrier-and-emission-separated',
    spatialProjectionStatus: 'not-projected-to-spatial-field-in-e1',
    semanticLabelStatus: 'not-attached-placeholders-only',
    generationalFieldUpdateStatus: 'not-computed-in-e1',
    trisonSemanticStatus: 'not-computed-in-e1',
    spinorBridgeStatus: 'not-in-e1-carrier-bridge-preserved-upstream',
    uiStatus: 'no-ui',
    recommendedNextGate: 'S0 - Fano-Trison Semantic Residual Model Card',
  };
}

function buildIssues(args: {
  c1Ok: boolean;
  e0Ok: boolean;
  childEmissionEnvelopes: FanoChildEmissionEnvelopeRow[];
  summary: FanoOctonionicChildEmissionEnvelopeV0Summary;
}): FanoOctonionicChildEmissionEnvelopeV0Issue[] {
  const issues: FanoOctonionicChildEmissionEnvelopeV0Issue[] = [];

  if (!args.c1Ok) {
    issues.push(issue('c1-report-not-ok', 'C1 local channel report is not ok'));
  }

  if (!args.e0Ok) {
    issues.push(issue('e0-report-not-ok', 'E0 harmonic profile report is not ok'));
  }

  expectCount(issues, args.summary.profileSetCount, 3, 'profile-set-count');
  expectCount(
    issues,
    args.summary.canonicalChildCarrierCount,
    6,
    'canonical-child-carrier-count',
  );
  expectCount(
    issues,
    args.summary.childEmissionEnvelopeCount,
    18,
    'child-emission-envelope-count',
  );
  expectCount(
    issues,
    args.summary.intrinsicBirthEmissionCount,
    18,
    'intrinsic-birth-emission-count',
  );
  expectCount(
    issues,
    args.summary.parentReturnKernelRowCount,
    36,
    'parent-return-kernel-row-count',
  );
  expectCount(
    issues,
    args.summary.projectionLoopKernelRowCount,
    36,
    'projection-loop-kernel-row-count',
  );
  expectCount(
    issues,
    args.summary.complementCouplingKernelRowCount,
    18,
    'complement-coupling-kernel-row-count',
  );
  expectCount(
    issues,
    args.summary.totalChannelKernelRowCount,
    90,
    'total-channel-kernel-row-count',
  );

  for (const envelope of args.childEmissionEnvelopes) {
    if (envelope.parentReturnKernelRows.length !== 2) {
      issues.push(
        issue(
          'unexpected-parent-return-kernel-count',
          `${envelope.envelopeId}: ${envelope.parentReturnKernelRows.length}`,
        ),
      );
    }

    if (envelope.projectionLoopKernelRows.length !== 2) {
      issues.push(
        issue(
          'unexpected-projection-loop-kernel-count',
          `${envelope.envelopeId}: ${envelope.projectionLoopKernelRows.length}`,
        ),
      );
    }

    if (!envelope.complementCouplingKernelRow) {
      issues.push(
        issue('missing-complement-coupling-kernel', envelope.envelopeId),
      );
    }

    checkIntrinsicBirthEmission(issues, envelope);
    checkEnvelopeStatuses(issues, envelope);
  }

  if (args.summary.spatialProjectionStatus !== 'not-projected-to-spatial-field-in-e1') {
    issues.push(
      issue('spatial-projection-attached', args.summary.spatialProjectionStatus),
    );
  }

  if (args.summary.semanticLabelStatus !== 'not-attached-placeholders-only') {
    issues.push(
      issue('semantic-label-attached', 'semantic labels must remain unattached'),
    );
  }

  if (args.summary.trisonSemanticStatus !== 'not-computed-in-e1') {
    issues.push(
      issue('trison-semantic-computed', args.summary.trisonSemanticStatus),
    );
  }

  if (args.summary.generationalFieldUpdateStatus !== 'not-computed-in-e1') {
    issues.push(
      issue(
        'generational-field-update-computed',
        args.summary.generationalFieldUpdateStatus,
      ),
    );
  }

  if (
    args.summary.spinorBridgeStatus !==
    'not-in-e1-carrier-bridge-preserved-upstream'
  ) {
    issues.push(
      issue('spinor-representation-claimed', args.summary.spinorBridgeStatus),
    );
  }

  if (args.summary.uiStatus !== 'no-ui') {
    issues.push(issue('ui-attached', args.summary.uiStatus));
  }

  return issues;
}

function checkIntrinsicBirthEmission(
  issues: FanoOctonionicChildEmissionEnvelopeV0Issue[],
  envelope: FanoChildEmissionEnvelopeRow,
) {
  const emission = envelope.intrinsicBirthEmission;

  if (emission.amplitude <= 0) {
    issues.push(issue('non-positive-birth-amplitude', envelope.envelopeId));
  }

  if (emission.rawFrequencyRatio.value <= 0) {
    issues.push(issue('non-positive-raw-frequency', envelope.envelopeId));
  }

  if (
    emission.foldedFrequencyRatio.value < 1 ||
    emission.foldedFrequencyRatio.value >= 2
  ) {
    issues.push(
      issue(
        'folded-frequency-outside-unit-octave',
        `${envelope.envelopeId}: ${emission.foldedFrequencyRatio.value}`,
      ),
    );
  }

  if (
    !Number.isFinite(emission.phaseRadians) ||
    emission.phaseRadians < 0 ||
    emission.phaseRadians >= TWO_PI
  ) {
    issues.push(
      issue(
        'phase-outside-normalized-range',
        `${envelope.envelopeId}: ${emission.phaseRadians}`,
      ),
    );
  }

  if (emission.attenuation < 0) {
    issues.push(issue('negative-birth-attenuation', envelope.envelopeId));
  }

  if (
    emission.carrierOrientationPhaseOffset !== 0 &&
    emission.carrierOrientationPhaseOffset !== Math.PI
  ) {
    issues.push(
      issue(
        'unexpected-carrier-phase-offset',
        `${envelope.envelopeId}: ${emission.carrierOrientationPhaseOffset}`,
      ),
    );
  }
}

function checkEnvelopeStatuses(
  issues: FanoOctonionicChildEmissionEnvelopeV0Issue[],
  envelope: FanoChildEmissionEnvelopeRow,
) {
  const channelRows = [
    ...envelope.parentReturnKernelRows,
    ...envelope.projectionLoopKernelRows,
    envelope.complementCouplingKernelRow,
  ];

  if (
    channelRows.some(
      (row) => row.activationStatus !== 'available-response-not-free-emission',
    )
  ) {
    issues.push(issue('channel-kernel-free-emission', envelope.envelopeId));
  }

  if (envelope.freeEmissionStatus !== 'intrinsic-birth-emission-only') {
    issues.push(issue('free-emission-status-mismatch', envelope.envelopeId));
  }

  if (
    envelope.channelResponseStatus !==
    'local-channels-available-not-always-on'
  ) {
    issues.push(issue('channel-response-status-mismatch', envelope.envelopeId));
  }

  if (envelope.spatialProjectionStatus !== 'not-projected-to-spatial-field-in-e1') {
    issues.push(issue('envelope-spatial-projection-attached', envelope.envelopeId));
  }

  if (envelope.semanticLabelStatus !== 'not-attached-placeholders-only') {
    issues.push(issue('envelope-semantic-label-attached', envelope.envelopeId));
  }
}

function parseCanonicalLiftOrder(canonicalLiftId: FanoOrderedLiftId): FanoSourcePair {
  const [left, right] = canonicalLiftId.split('·');

  if (!isPrimalSourceId(left) || !isPrimalSourceId(right)) {
    throw new Error(`Invalid canonical child lift id ${canonicalLiftId}`);
  }

  return [left, right];
}

function getProfileForSourceSlot(args: {
  profileSetRow: HarmonicProfileSetRow;
  sourceSlotId: FanoPrimalSourceId;
  profileRows: HarmonicEmissionProfileRow[];
}): HarmonicEmissionProfileRow {
  const profileRow = args.profileRows.find(
    (row) =>
      row.profileFamilyId === args.profileSetRow.profileFamilyId &&
      row.sourceSlotId === args.sourceSlotId,
  );

  if (!profileRow) {
    throw new Error(
      `No E0 profile found for ${args.profileSetRow.profileSetId}/${args.sourceSlotId}`,
    );
  }

  return profileRow;
}

function addFrequencyRatios(
  left: HarmonicFrequencyRatio,
  right: HarmonicFrequencyRatio,
): HarmonicFrequencyRatio {
  return normalizeFrequencyRatio({
    numerator:
      left.numerator * right.denominator + right.numerator * left.denominator,
    denominator: left.denominator * right.denominator,
  });
}

function octaveFold(frequencyRatio: HarmonicFrequencyRatio): {
  frequencyRatio: HarmonicFrequencyRatio;
  octaveFoldCount: number;
} {
  let numerator = frequencyRatio.numerator;
  let denominator = frequencyRatio.denominator;
  let octaveFoldCount = 0;

  while (numerator >= 2 * denominator) {
    denominator *= 2;
    octaveFoldCount += 1;
  }

  while (numerator < denominator) {
    numerator *= 2;
    octaveFoldCount -= 1;
  }

  return {
    frequencyRatio: normalizeFrequencyRatio({ numerator, denominator }),
    octaveFoldCount,
  };
}

function normalizeFrequencyRatio(args: {
  numerator: number;
  denominator: number;
}): HarmonicFrequencyRatio {
  const divisor = greatestCommonDivisor(args.numerator, args.denominator);
  const numerator = args.numerator / divisor;
  const denominator = args.denominator / divisor;

  return {
    numerator,
    denominator,
    value: numerator / denominator,
  };
}

function normalizeRadians(radians: number): number {
  const normalized = radians % TWO_PI;

  return normalized < 0 ? normalized + TWO_PI : normalized;
}

function greatestCommonDivisor(left: number, right: number): number {
  let leftValue = Math.abs(left);
  let rightValue = Math.abs(right);

  while (rightValue !== 0) {
    const nextRightValue = leftValue % rightValue;

    leftValue = rightValue;
    rightValue = nextRightValue;
  }

  return leftValue || 1;
}

function getSignedLiftSign(signedLift: FanoSignedLift): FanoSign {
  return signedLift.slice(0, 1) as FanoSign;
}

function isPrimalSourceId(value: string | undefined): value is FanoPrimalSourceId {
  return value === 'A' || value === 'B' || value === 'C' || value === 'D';
}

function expectCount(
  issues: FanoOctonionicChildEmissionEnvelopeV0Issue[],
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
): FanoOctonionicChildEmissionEnvelopeV0Issue {
  return { code, message };
}
