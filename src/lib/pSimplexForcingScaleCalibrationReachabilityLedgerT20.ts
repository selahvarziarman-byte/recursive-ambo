import {
  buildPSimplexA3ResidualDecompositionLedgerT10Report,
  type PSimplexT10ResidualDecompositionRow,
} from './pSimplexA3ResidualDecompositionLedgerT10';
import {
  buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report,
  type PSimplexT13ProbeSourceDriveRow,
} from './pSimplexGeometryProbeSourceForcedResponseLedgerT13';
import {
  buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report,
  type PSimplexT14RelaxationRow,
} from './pSimplexBoundedPointwiseVectorLGRelaxationLedgerT14';
import { buildPSimplexBoundedRelaxationResponseStatusLedgerT15Report } from './pSimplexBoundedRelaxationResponseStatusLedgerT15';
import {
  buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report,
  type PSimplexT16DriveRow,
} from './pSimplexNonAxisThresholdSweepReadoutLedgerT16';
import {
  buildPSimplexA3ProvisionalReadoutLedgerT17Report,
  type PSimplexT17A3ProvisionalRegime,
  type PSimplexT17A3RootRegimeSequenceRow,
} from './pSimplexA3ProvisionalReadoutLedgerT17';
import { buildPSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report } from './pSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18';
import { buildPSimplexD3BodyDriveBranchAnatomyLedgerT19Report } from './pSimplexD3BodyDriveBranchAnatomyLedgerT19';
import {
  bestDirectionMatch,
  buildPSimplexFiniteResponseDirections,
  type PSimplexRuntimeAnisotropyLabeledResponseDirection,
  type PSimplexRuntimeResponseDirectionClass,
} from './pSimplexResponseCore';
import {
  cleanNumber,
  cleanVec3,
  normVec3,
  normalizeVec3OrNull,
  PSIMPLEX_EPSILON,
  type PSimplexVec3,
} from './pSimplexVectorMath';

export type PSimplexT20Verdict = 'PASS' | 'PARTIAL' | 'FAIL';
export type PSimplexT20DriveFamily =
  | 'axis-child-axis'
  | 'A3-root'
  | 'A3-residual'
  | 'D3-body-diagonal'
  | 'D4-residual-composite'
  | 'T-suppressed-transverse';
export type PSimplexT20EvidenceClass =
  | 'actual-generated-site-evidence'
  | 'approved-axis-probe'
  | 'abstract-control'
  | 'diagnostic-control'
  | 'residual-mechanism'
  | 'missing-evidence';
export type PSimplexT20CalibrationId = 'N0' | 'N1' | 'N2' | 'N3' | 'N4';
export type PSimplexT20ReachabilityClassification =
  | 'axis-closed-reachable'
  | 'A3-structurally-available'
  | 'A3-residual-reachable'
  | 'A3-continuous-tilt-reachable'
  | 'A3-near-reachable'
  | 'A3-gain-inflated-only'
  | 'A3-not-reached-under-axis-calibration'
  | 'body-control-only'
  | 'body-near-reachable-under-axis-calibration'
  | 'body-gain-inflated-only'
  | 'body-threshold-refinement-needed'
  | 'body-quarantined'
  | 'diagnostic-only'
  | 'suppressed-control'
  | 'not-readout-channel';
export type PSimplexT20FinalRecommendation =
  | 'A3-operationally-grounded'
  | 'A3-residual-readable-only'
  | 'A3-structurally-coherent-but-not-active'
  | 'A3-gain-inflated'
  | 'source-magnitude-evidence-incomplete'
  | 'return-to-C1-C2';

export interface PSimplexT20ParentEvidenceRow {
  ledgerId: string;
  availability: 'available' | 'committed-document-available' | 'incomplete';
  verdict: string | null;
  ok: boolean;
  integrityIssueCount: number | null;
  requiredForT20: boolean;
  notes: string[];
}

export interface PSimplexT20AxisCalibrationReferenceRow {
  calibrationId: PSimplexT20CalibrationId;
  calibrationName: string;
  axisReferenceDriveId: string | null;
  axisReferenceJNorm: number | null;
  gain: number | null;
  isOperationalCalibration: boolean;
  inflationRisk: 'none' | 'scale-free-only' | 'gain-inflated' | 'sensitivity-only';
  notes: string[];
  ok: boolean;
}

export interface PSimplexT20SourceDriveMagnitudeRow {
  driveId: string;
  sourceRowId: string;
  driveFamily: PSimplexT20DriveFamily;
  sourceMechanism: string;
  evidenceClass: PSimplexT20EvidenceClass;
  targetChild: string | null;
  probeClass: string | null;
  residualStatus: string | null;
  J: PSimplexVec3;
  JNorm: number;
  JHat: PSimplexVec3 | null;
  nearestAxisDirectionId: string | null;
  nearestAxisAlignment: number;
  nearestA3DirectionId: string | null;
  nearestA3Alignment: number;
  nearestBodyDirectionId: string | null;
  nearestBodyAlignment: number;
  isReadoutChannelCandidate: boolean;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT20ScaleFreeRatioRow {
  rowId: string;
  driveId: string;
  driveFamily: PSimplexT20DriveFamily;
  evidenceClass: PSimplexT20EvidenceClass;
  JNorm: number;
  canonicalAxisJNorm: number;
  strongestAxisJNorm: number;
  weakestAxisJNorm: number;
  ratioToCanonicalAxis: number;
  ratioToStrongestAxis: number;
  ratioToWeakestAxis: number;
  responseReachabilityClaimAllowed: false;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT20ReachabilityRow {
  rowId: string;
  driveId: string;
  driveFamily: PSimplexT20DriveFamily;
  evidenceClass: PSimplexT20EvidenceClass;
  sourceMechanism: string;
  calibrationId: Exclude<PSimplexT20CalibrationId, 'N0' | 'N4'>;
  gain: number;
  JNorm: number;
  sCase: number;
  mappedResponseRegime: string;
  mappedClosureStatus: string;
  classifications: PSimplexT20ReachabilityClassification[];
  a3ResidualReachability: 'residual-reachable' | 'not-residual-evidence';
  a3ResponseReachability: 'response-reachable' | 'response-not-reached' | 'not-response-evidence';
  bodyQuarantineStatus: 'quarantined' | 'not-body-control';
  gainInflated: boolean;
  operationallyGrounded: boolean;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT20SensitivityOnlyRow {
  rowId: string;
  driveId: string;
  driveFamily: PSimplexT20DriveFamily;
  evidenceClass: PSimplexT20EvidenceClass;
  referenceCalibrationId: 'N3';
  n3SCase: number;
  a3ContinuousTiltThreshold: number;
  a3NearThreshold: number;
  bodyActualThreshold: number | null;
  finiteLedgerBodyErrorBand: [number, number] | null;
  marginToA3ContinuousTilt: number;
  marginToA3Near: number;
  marginToBodyActual: number | null;
  sensitivityJudgment: string;
  operationalClaimAllowed: false;
  ok: boolean;
}

export interface PSimplexT20A3ResidualReachabilityRow {
  rowId: string;
  sourceDriveRowId: string;
  sourceResidualRowId: string;
  residualStatus: string;
  residualMagnitude: number;
  bestMatchingRootId: string | null;
  residualReachability: 'A3-residual-reachable';
  responseReachabilityClaimAllowed: false;
  generatedSiteMagnitudeEvidence: false;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT20A3ResponseReachabilityRow {
  rowId: string;
  driveId: string;
  calibrationId: Exclude<PSimplexT20CalibrationId, 'N0' | 'N4'>;
  evidenceClass: PSimplexT20EvidenceClass;
  sCase: number;
  mappedResponseRegime: string;
  responseReachability: 'response-reachable' | 'response-not-reached';
  operationallyGrounded: boolean;
  gainInflated: boolean;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT20BodyQuarantineCheckRow {
  rowId: string;
  driveId: string;
  evidenceClass: PSimplexT20EvidenceClass;
  calibrationId: Exclude<PSimplexT20CalibrationId, 'N0' | 'N4'>;
  sCase: number;
  mappedResponseRegime: string;
  bodyQuarantineStatus: 'body-quarantined';
  thresholdRefinementNeeded: true;
  safeForReadoutSubstrate: false;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT20GainInflationRow {
  rowId: string;
  driveId: string;
  driveFamily: PSimplexT20DriveFamily;
  evidenceClass: PSimplexT20EvidenceClass;
  calibrationId: 'N3';
  gain: number;
  sCase: number;
  gainInflated: true;
  inflatedReachabilityClaim: boolean;
  notes: string[];
  ok: boolean;
}

export interface PSimplexT20RecommendedResearchConsequenceRow {
  consequenceId: string;
  status: PSimplexT20FinalRecommendation;
  statement: string;
  ok: boolean;
}

export interface PSimplexT20InvalidInterpretationBoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface PSimplexT20Summary {
  totalDriveRows: number;
  actualGeneratedSiteEvidenceCount: number;
  approvedAxisProbeCount: number;
  abstractControlCount: number;
  diagnosticControlCount: number;
  residualMechanismCount: number;
  axisReferenceCount: number;
  axisCalibrationOperationalCount: number;
  a3StructuralAvailableCount: number;
  a3ResidualReachableCount: number;
  a3ResponseReachableOperationalCount: number;
  a3ResponseReachableOnlyInflatedCount: number;
  a3NotReachedUnderAxisCalibrationCount: number;
  bodyReachableOperationalCount: number;
  bodyReachableOnlyInflatedCount: number;
  bodyQuarantinedCount: number;
  generatedSiteA3ResidualEvidenceComplete: boolean;
  generatedSiteA3ResponseGrounded: boolean;
  d3BodyStillQuarantined: boolean;
  strictResidualResponseSeparationPassed: boolean;
  forbiddenBoundaryPassed: boolean;
}

export interface PSimplexForcingScaleCalibrationReachabilityLedgerT20Report {
  method: 'p-simplex-forcing-scale-calibration-reachability-ledger-t20';
  candidatePackage: 'p-simplex-readout-substrate-calibration-reachability-ledger-t20';
  parentConsolidationCharter: 'PLATONIC_ENGINE_P_SIMPLEX_READOUT_SUBSTRATE_CONSOLIDATION_CHARTER_C1';
  parentResearchNote: 'PLATONIC_ENGINE_P_SIMPLEX_READOUT_SUBSTRATE_RESEARCH_NOTE_C2';
  diagnosticScope: 'forcing-scale-calibration-and-reachability-ledger-only';
  solverStatus: 'not-new-solver';
  calibrationStatus: 'axis-grounded-gain-laws-only';
  residualResponseSeparationStatus: 'strict-residual-response-separation';
  spatialDynamicsStatus: 'not-spatial-lg-dynamics';
  fieldAtlasStatus: 'not-field-atlas';
  renderingStatus: 'not-rendering';
  fieldCueStatus: 'not-field-cue';
  semanticStatus: 'not-semantic-interpretation';
  routeStatus: 'no-route-walk-holonomy';
  defectStatus: 'no-defect-vortex-claims';
  denseSamplingStatus: 'not-dense-sampling';
  parentEvidenceRows: PSimplexT20ParentEvidenceRow[];
  axisCalibrationReferenceRows: PSimplexT20AxisCalibrationReferenceRow[];
  sourceDriveMagnitudeRows: PSimplexT20SourceDriveMagnitudeRow[];
  scaleFreeRatioRows: PSimplexT20ScaleFreeRatioRow[];
  reachabilityRows: PSimplexT20ReachabilityRow[];
  sensitivityOnlyRows: PSimplexT20SensitivityOnlyRow[];
  a3ResidualReachabilityRows: PSimplexT20A3ResidualReachabilityRow[];
  a3ResponseReachabilityRows: PSimplexT20A3ResponseReachabilityRow[];
  bodyQuarantineCheckRows: PSimplexT20BodyQuarantineCheckRow[];
  gainInflationRows: PSimplexT20GainInflationRow[];
  recommendedResearchConsequenceRows: PSimplexT20RecommendedResearchConsequenceRow[];
  invalidInterpretationBoundaryRows: PSimplexT20InvalidInterpretationBoundaryRow[];
  summary: PSimplexT20Summary;
  verdict: PSimplexT20Verdict;
  finalRecommendation: PSimplexT20FinalRecommendation;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface ParentReports {
  t10: ReturnType<typeof buildPSimplexA3ResidualDecompositionLedgerT10Report>;
  t13: ReturnType<typeof buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report>;
  t14: ReturnType<typeof buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report>;
  t15: ReturnType<typeof buildPSimplexBoundedRelaxationResponseStatusLedgerT15Report>;
  t16: ReturnType<typeof buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report>;
  t17: ReturnType<typeof buildPSimplexA3ProvisionalReadoutLedgerT17Report>;
  t18: ReturnType<typeof buildPSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report>;
  t19: ReturnType<typeof buildPSimplexD3BodyDriveBranchAnatomyLedgerT19Report>;
}

const OPERATIONAL_CALIBRATION_IDS = ['N1', 'N2', 'N3'] as const;

export function buildPSimplexForcingScaleCalibrationReachabilityLedgerT20Report(): PSimplexForcingScaleCalibrationReachabilityLedgerT20Report {
  const parentReports = buildParentReports();
  const finiteDirections = buildPSimplexFiniteResponseDirections();
  const parentEvidenceRows = buildParentEvidenceRows(parentReports);
  const sourceDriveMagnitudeRows = buildSourceDriveMagnitudeRows(parentReports, finiteDirections);
  const axisCalibrationReferenceRows = buildAxisCalibrationReferenceRows(sourceDriveMagnitudeRows);
  const scaleFreeRatioRows = buildScaleFreeRatioRows(sourceDriveMagnitudeRows, axisCalibrationReferenceRows);
  const reachabilityRows = buildReachabilityRows(
    sourceDriveMagnitudeRows,
    axisCalibrationReferenceRows,
    parentReports.t17.canonicalA3RegimeSequenceRows,
    parentReports.t19.summary.sBodyActual,
    parentReports.t19.summary.finiteLedgerErrorBand,
  );
  const sensitivityOnlyRows = buildSensitivityOnlyRows(
    sourceDriveMagnitudeRows,
    axisCalibrationReferenceRows,
    parentReports.t17.canonicalA3RegimeSequenceRows,
    parentReports.t19.summary.sBodyActual,
    parentReports.t19.summary.finiteLedgerErrorBand,
  );
  const a3ResidualReachabilityRows = buildA3ResidualReachabilityRows(sourceDriveMagnitudeRows);
  const a3ResponseReachabilityRows = buildA3ResponseReachabilityRows(reachabilityRows);
  const bodyQuarantineCheckRows = buildBodyQuarantineCheckRows(reachabilityRows);
  const gainInflationRows = buildGainInflationRows(reachabilityRows);
  const invalidInterpretationBoundaryRows = buildInvalidInterpretationBoundaryRows();
  const summary = buildSummary({
    sourceDriveMagnitudeRows,
    axisCalibrationReferenceRows,
    reachabilityRows,
    a3ResidualReachabilityRows,
    a3ResponseReachabilityRows,
    bodyQuarantineCheckRows,
    invalidInterpretationBoundaryRows,
  });
  const finalRecommendation = recommendationForSummary(summary);
  const recommendedResearchConsequenceRows = buildRecommendedResearchConsequenceRows(summary, finalRecommendation);
  const integrityIssues = buildIntegrityIssues({
    parentEvidenceRows,
    axisCalibrationReferenceRows,
    sourceDriveMagnitudeRows,
    scaleFreeRatioRows,
    reachabilityRows,
    summary,
  });
  const verdict = classifyVerdict(integrityIssues, summary);

  return {
    method: 'p-simplex-forcing-scale-calibration-reachability-ledger-t20',
    candidatePackage: 'p-simplex-readout-substrate-calibration-reachability-ledger-t20',
    parentConsolidationCharter: 'PLATONIC_ENGINE_P_SIMPLEX_READOUT_SUBSTRATE_CONSOLIDATION_CHARTER_C1',
    parentResearchNote: 'PLATONIC_ENGINE_P_SIMPLEX_READOUT_SUBSTRATE_RESEARCH_NOTE_C2',
    diagnosticScope: 'forcing-scale-calibration-and-reachability-ledger-only',
    solverStatus: 'not-new-solver',
    calibrationStatus: 'axis-grounded-gain-laws-only',
    residualResponseSeparationStatus: 'strict-residual-response-separation',
    spatialDynamicsStatus: 'not-spatial-lg-dynamics',
    fieldAtlasStatus: 'not-field-atlas',
    renderingStatus: 'not-rendering',
    fieldCueStatus: 'not-field-cue',
    semanticStatus: 'not-semantic-interpretation',
    routeStatus: 'no-route-walk-holonomy',
    defectStatus: 'no-defect-vortex-claims',
    denseSamplingStatus: 'not-dense-sampling',
    parentEvidenceRows,
    axisCalibrationReferenceRows,
    sourceDriveMagnitudeRows,
    scaleFreeRatioRows,
    reachabilityRows,
    sensitivityOnlyRows,
    a3ResidualReachabilityRows,
    a3ResponseReachabilityRows,
    bodyQuarantineCheckRows,
    gainInflationRows,
    recommendedResearchConsequenceRows,
    invalidInterpretationBoundaryRows,
    summary,
    verdict,
    finalRecommendation,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0 && verdict !== 'FAIL',
  };
}

function buildParentReports(): ParentReports {
  return {
    t10: buildPSimplexA3ResidualDecompositionLedgerT10Report(),
    t13: buildPSimplexGeometryProbeSourceForcedResponseLedgerT13Report(),
    t14: buildPSimplexBoundedPointwiseVectorLGRelaxationLedgerT14Report(),
    t15: buildPSimplexBoundedRelaxationResponseStatusLedgerT15Report(),
    t16: buildPSimplexNonAxisThresholdSweepReadoutLedgerT16Report(),
    t17: buildPSimplexA3ProvisionalReadoutLedgerT17Report(),
    t18: buildPSimplexD3BodyDiagonalDivergenceAnatomyLedgerT18Report(),
    t19: buildPSimplexD3BodyDriveBranchAnatomyLedgerT19Report(),
  };
}

function buildParentEvidenceRows(parentReports: ParentReports): PSimplexT20ParentEvidenceRow[] {
  return [
    evidenceRow('T10', parentReports.t10.verdict, parentReports.t10.ok, parentReports.t10.integrityIssueCount, false, [
      'A3 residual mechanisms are accepted only as residual reachability evidence.',
    ]),
    evidenceRow('T13', parentReports.t13.verdict, parentReports.t13.ok, parentReports.t13.integrityIssueCount, false, [
      'Approved child-axis probe magnitudes provide the axis calibration inventory.',
    ]),
    evidenceRow('T14', parentReports.t14.verdict, parentReports.t14.ok, parentReports.t14.integrityIssueCount, false, [
      'Bounded relaxation remains parent evidence; T20 does not rerun or modify minimization.',
    ]),
    evidenceRow('T15', parentReports.t15.verdict, parentReports.t15.ok, parentReports.t15.integrityIssueCount, false, [
      'Response-status closure categories are inherited as parent evidence only.',
    ]),
    evidenceRow('T16', parentReports.t16.verdict, parentReports.t16.ok, parentReports.t16.integrityIssueCount, true, [
      'Non-axis D2 and D3 drive inventory and response sweep evidence are required.',
    ]),
    evidenceRow('T17', parentReports.t17.verdict, parentReports.t17.ok, parentReports.t17.integrityIssueCount, true, [
      'D2/A3 provisional regime sequence is required for response reachability mapping.',
    ]),
    evidenceRow('T18', parentReports.t18.verdict, parentReports.t18.ok, parentReports.t18.integrityIssueCount, true, [
      'D3 body divergence anatomy is required for body quarantine carry-forward.',
    ]),
    evidenceRow('T19', parentReports.t19.verdict, parentReports.t19.ok, parentReports.t19.integrityIssueCount, true, [
      'D3 branch anatomy supplies the actual body onset and quarantine rule.',
    ]),
    {
      ledgerId: 'C1',
      availability: 'committed-document-available',
      verdict: null,
      ok: true,
      integrityIssueCount: null,
      requiredForT20: true,
      notes: ['C1 remains the governing consolidation charter; T20 does not amend it.'],
    },
    {
      ledgerId: 'C2',
      availability: 'committed-document-available',
      verdict: null,
      ok: true,
      integrityIssueCount: null,
      requiredForT20: true,
      notes: ['C2 is used as the researcher-facing substrate note; T20 does not amend it.'],
    },
  ];
}

function evidenceRow(
  ledgerId: string,
  verdict: string,
  ok: boolean,
  integrityIssueCount: number,
  requiredForT20: boolean,
  notes: string[],
): PSimplexT20ParentEvidenceRow {
  return {
    ledgerId,
    availability: ok && integrityIssueCount === 0 ? 'available' : 'incomplete',
    verdict,
    ok,
    integrityIssueCount,
    requiredForT20,
    notes,
  };
}

function buildSourceDriveMagnitudeRows(
  parentReports: ParentReports,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexT20SourceDriveMagnitudeRow[] {
  return [
    ...parentReports.t13.probeSourceDriveRows
      .filter((row) => row.sourceKind === 'approved-clean-geometry-probe')
      .map((row) => sourceRowFromT13Approved(row)),
    ...parentReports.t16.driveRows
      .filter((row) => row.driveFamily === 'D2')
      .map((row) => sourceRowFromT16Drive(row, finiteDirections)),
    ...parentReports.t10.residualDecompositionRows
      .filter(isA3ResidualMechanismRow)
      .map((row) => sourceRowFromT10Residual(row, finiteDirections)),
    ...parentReports.t16.driveRows
      .filter((row) => row.driveFamily === 'D3')
      .map((row) => sourceRowFromT16Drive(row, finiteDirections)),
    ...uniqueT14Rows(parentReports.t14.relaxationRows, 'D4').map((row) => sourceRowFromT14Diagnostic(row, finiteDirections)),
    ...parentReports.t13.probeSourceDriveRows
      .filter((row) => row.sourceKind === 'residual-control-transverse-probe')
      .map((row) => sourceRowFromT13Suppressed(row)),
  ].sort(compareSourceRows);
}

function sourceRowFromT13Approved(row: PSimplexT13ProbeSourceDriveRow): PSimplexT20SourceDriveMagnitudeRow {
  return {
    driveId: `T13:${row.rowId}`,
    sourceRowId: row.rowId,
    driveFamily: 'axis-child-axis',
    sourceMechanism: 't13-approved-clean-geometry-probe',
    evidenceClass: 'approved-axis-probe',
    targetChild: row.targetChild,
    probeClass: row.probeClass,
    residualStatus: null,
    J: cleanVec3(row.sourceDriveJ),
    JNorm: cleanNumber(row.sourceDriveNorm),
    JHat: row.sourceDriveJHat ? cleanVec3(row.sourceDriveJHat) : null,
    nearestAxisDirectionId: row.bestAxisDirectionId,
    nearestAxisAlignment: cleanNumber(row.bestAxisAlignment),
    nearestA3DirectionId: row.bestA3DirectionId,
    nearestA3Alignment: cleanNumber(row.bestA3Alignment),
    nearestBodyDirectionId: row.bestBodyDiagonalDirectionId,
    nearestBodyAlignment: cleanNumber(row.bestBodyDiagonalAlignment),
    isReadoutChannelCandidate: true,
    notes: [
      `approved-axis-probe:${row.probeClass}`,
      'Eligible as an axis calibration magnitude; this is not an A3 forcing choice.',
    ],
    ok: row.ok && row.cleanChildAxisCandidate && !row.diagnosticOnly,
  };
}

function sourceRowFromT13Suppressed(row: PSimplexT13ProbeSourceDriveRow): PSimplexT20SourceDriveMagnitudeRow {
  return {
    driveId: `T13:${row.rowId}`,
    sourceRowId: row.rowId,
    driveFamily: 'T-suppressed-transverse',
    sourceMechanism: 't13-suppressed-transverse-control',
    evidenceClass: 'diagnostic-control',
    targetChild: row.targetChild,
    probeClass: row.probeClass,
    residualStatus: null,
    J: cleanVec3(row.sourceDriveJ),
    JNorm: cleanNumber(row.sourceDriveNorm),
    JHat: row.sourceDriveJHat ? cleanVec3(row.sourceDriveJHat) : null,
    nearestAxisDirectionId: row.bestAxisDirectionId,
    nearestAxisAlignment: cleanNumber(row.bestAxisAlignment),
    nearestA3DirectionId: row.bestA3DirectionId,
    nearestA3Alignment: cleanNumber(row.bestA3Alignment),
    nearestBodyDirectionId: row.bestBodyDiagonalDirectionId,
    nearestBodyAlignment: cleanNumber(row.bestBodyDiagonalAlignment),
    isReadoutChannelCandidate: false,
    notes: ['Suppressed transverse controls remain diagnostic-only.'],
    ok: row.ok && row.diagnosticOnly,
  };
}

function sourceRowFromT16Drive(
  row: PSimplexT16DriveRow,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexT20SourceDriveMagnitudeRow {
  const matches = directionMatches(row.JHat, finiteDirections);
  const isA3 = row.driveFamily === 'D2';

  return {
    driveId: `T16:${row.driveId}`,
    sourceRowId: row.driveId,
    driveFamily: isA3 ? 'A3-root' : 'D3-body-diagonal',
    sourceMechanism: isA3 ? 't16-d2-a3-root-unit-control' : 't16-d3-body-diagonal-unit-control',
    evidenceClass: 'abstract-control',
    targetChild: null,
    probeClass: null,
    residualStatus: null,
    J: cleanVec3(row.J),
    JNorm: cleanNumber(normVec3(row.J)),
    JHat: cleanVec3(row.JHat),
    nearestAxisDirectionId: matches.axis.directionId,
    nearestAxisAlignment: matches.axis.alignment,
    nearestA3DirectionId: matches.a3.directionId,
    nearestA3Alignment: matches.a3.alignment,
    nearestBodyDirectionId: matches.body.directionId,
    nearestBodyAlignment: matches.body.alignment,
    isReadoutChannelCandidate: isA3,
    notes: [
      isA3
        ? 'D2 A3-root unit controls are abstract response probes unless tied to actual generated-site source magnitudes.'
        : 'D3 body-diagonal unit controls are retained as quarantined controls.',
    ],
    ok: normVec3(row.J) > PSIMPLEX_EPSILON,
  };
}

function sourceRowFromT10Residual(
  row: PSimplexT10ResidualDecompositionRow,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexT20SourceDriveMagnitudeRow {
  const JHat = normalizeVec3OrNull(row.residualVector);
  const matches = directionMatches(JHat, finiteDirections);

  return {
    driveId: `T10:${row.rowId}`,
    sourceRowId: row.rowId,
    driveFamily: 'A3-residual',
    sourceMechanism: 't10-a3-residual-mechanism',
    evidenceClass: 'residual-mechanism',
    targetChild: row.targetChild,
    probeClass: row.probeCase,
    residualStatus: row.residualStatus,
    J: cleanVec3(row.residualVector),
    JNorm: cleanNumber(row.residualMagnitude),
    JHat: JHat ? cleanVec3(JHat) : null,
    nearestAxisDirectionId: matches.axis.directionId,
    nearestAxisAlignment: matches.axis.alignment,
    nearestA3DirectionId: matches.a3.directionId,
    nearestA3Alignment: matches.a3.alignment,
    nearestBodyDirectionId: matches.body.directionId,
    nearestBodyAlignment: matches.body.alignment,
    isReadoutChannelCandidate: false,
    notes: [
      `residual-status:${row.residualStatus}`,
      'Counts as A3 residual reachability only; it does not prove A3 response reachability.',
    ],
    ok: row.residualMagnitude > PSIMPLEX_EPSILON,
  };
}

function sourceRowFromT14Diagnostic(
  row: PSimplexT14RelaxationRow,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): PSimplexT20SourceDriveMagnitudeRow {
  const JHat = normalizeVec3OrNull(row.J);
  const matches = directionMatches(JHat, finiteDirections);

  return {
    driveId: `T14:${row.driveId}`,
    sourceRowId: row.rowId,
    driveFamily: 'D4-residual-composite',
    sourceMechanism: 't14-d4-residual-composite-control',
    evidenceClass: 'diagnostic-control',
    targetChild: row.targetChild,
    probeClass: row.probeClass,
    residualStatus: null,
    J: cleanVec3(row.J),
    JNorm: cleanNumber(row.sourceDriveNorm),
    JHat: JHat ? cleanVec3(JHat) : null,
    nearestAxisDirectionId: matches.axis.directionId,
    nearestAxisAlignment: matches.axis.alignment,
    nearestA3DirectionId: matches.a3.directionId,
    nearestA3Alignment: matches.a3.alignment,
    nearestBodyDirectionId: matches.body.directionId,
    nearestBodyAlignment: matches.body.alignment,
    isReadoutChannelCandidate: false,
    notes: ['D4 residual/composite rows remain diagnostic-only and do not define a readout channel.'],
    ok: row.diagnosticOnly,
  };
}

function directionMatches(
  JHat: PSimplexVec3 | null,
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
): Record<'axis' | 'a3' | 'body', { directionId: string | null; alignment: number }> {
  return {
    axis: bestDirectionMatchByClass(finiteDirections, 'axis-well', JHat),
    a3: bestDirectionMatchByClass(finiteDirections, 'a3-transition', JHat),
    body: bestDirectionMatchByClass(finiteDirections, 'body-diagonal-high-mixing', JHat),
  };
}

function bestDirectionMatchByClass(
  finiteDirections: readonly PSimplexRuntimeAnisotropyLabeledResponseDirection[],
  responseClass: PSimplexRuntimeResponseDirectionClass,
  JHat: PSimplexVec3 | null,
): { directionId: string | null; alignment: number } {
  const match = bestDirectionMatch(finiteDirections, responseClass, JHat);

  return {
    directionId: match.directionId,
    alignment: cleanNumber(match.alignment),
  };
}

function uniqueT14Rows(
  rows: readonly PSimplexT14RelaxationRow[],
  driveFamily: PSimplexT14RelaxationRow['driveFamily'],
): PSimplexT14RelaxationRow[] {
  const uniqueRowsByDriveId = new Map<string, PSimplexT14RelaxationRow>();

  rows
    .filter((row) => row.driveFamily === driveFamily)
    .forEach((row) => {
      if (!uniqueRowsByDriveId.has(row.driveId)) {
        uniqueRowsByDriveId.set(row.driveId, row);
      }
    });

  return [...uniqueRowsByDriveId.values()];
}

function isA3ResidualMechanismRow(row: PSimplexT10ResidualDecompositionRow): boolean {
  return (
    row.residualMagnitude > PSIMPLEX_EPSILON &&
    (row.residualStatus === 'A3-root-aligned-residual' || row.residualStatus === 'A3-root-composite-residual')
  );
}

function compareSourceRows(left: PSimplexT20SourceDriveMagnitudeRow, right: PSimplexT20SourceDriveMagnitudeRow): number {
  return left.driveId.localeCompare(right.driveId);
}

function buildAxisCalibrationReferenceRows(
  sourceRows: readonly PSimplexT20SourceDriveMagnitudeRow[],
): PSimplexT20AxisCalibrationReferenceRow[] {
  const axisRows = sourceRows.filter((row) => row.evidenceClass === 'approved-axis-probe' && row.JNorm > PSIMPLEX_EPSILON);
  const canonicalAxisRow = chooseCanonicalAxisRow(axisRows);
  const strongestAxisRow = chooseExtremeAxisRow(axisRows, 'strongest');
  const weakestAxisRow = chooseExtremeAxisRow(axisRows, 'weakest');

  return [
    {
      calibrationId: 'N0',
      calibrationName: 'scale-free ratio only',
      axisReferenceDriveId: canonicalAxisRow?.driveId ?? null,
      axisReferenceJNorm: canonicalAxisRow?.JNorm ?? null,
      gain: null,
      isOperationalCalibration: false,
      inflationRisk: 'scale-free-only',
      notes: ['Reports magnitude ratios only. N0 cannot claim response reachability.'],
      ok: Boolean(canonicalAxisRow && strongestAxisRow && weakestAxisRow),
    },
    {
      calibrationId: 'N1',
      calibrationName: 'canonical approved axis probe has s=1',
      axisReferenceDriveId: canonicalAxisRow?.driveId ?? null,
      axisReferenceJNorm: canonicalAxisRow?.JNorm ?? null,
      gain: canonicalAxisRow ? cleanNumber(1 / canonicalAxisRow.JNorm) : null,
      isOperationalCalibration: Boolean(canonicalAxisRow),
      inflationRisk: 'none',
      notes: [
        'The canonical reference is the G probe class because T13 treats G as an approved clean child-axis probe and all G rows share one stable norm.',
      ],
      ok: Boolean(canonicalAxisRow),
    },
    {
      calibrationId: 'N2',
      calibrationName: 'strongest approved axis probe has s=1',
      axisReferenceDriveId: strongestAxisRow?.driveId ?? null,
      axisReferenceJNorm: strongestAxisRow?.JNorm ?? null,
      gain: strongestAxisRow ? cleanNumber(1 / strongestAxisRow.JNorm) : null,
      isOperationalCalibration: Boolean(strongestAxisRow),
      inflationRisk: 'none',
      notes: ['Uses the largest approved T13 child-axis source magnitude as the unit forcing reference.'],
      ok: Boolean(strongestAxisRow),
    },
    {
      calibrationId: 'N3',
      calibrationName: 'weakest approved axis probe has s=1',
      axisReferenceDriveId: weakestAxisRow?.driveId ?? null,
      axisReferenceJNorm: weakestAxisRow?.JNorm ?? null,
      gain: weakestAxisRow ? cleanNumber(1 / weakestAxisRow.JNorm) : null,
      isOperationalCalibration: Boolean(weakestAxisRow),
      inflationRisk: 'gain-inflated',
      notes: ['This high-gain reference is allowed only when gain inflation is explicitly marked.'],
      ok: Boolean(weakestAxisRow),
    },
    {
      calibrationId: 'N4',
      calibrationName: 'barrier sensitivity control only',
      axisReferenceDriveId: strongestAxisRow?.driveId ?? null,
      axisReferenceJNorm: strongestAxisRow?.JNorm ?? null,
      gain: null,
      isOperationalCalibration: false,
      inflationRisk: 'sensitivity-only',
      notes: ['N4 reports threshold sensitivity only and cannot produce an operational readout claim.'],
      ok: Boolean(strongestAxisRow),
    },
  ];
}

function chooseCanonicalAxisRow(
  axisRows: readonly PSimplexT20SourceDriveMagnitudeRow[],
): PSimplexT20SourceDriveMagnitudeRow | null {
  const gRows = axisRows.filter((row) => row.probeClass === 'G').sort(compareSourceRows);

  return gRows[0] ?? [...axisRows].sort(compareSourceRows)[0] ?? null;
}

function chooseExtremeAxisRow(
  axisRows: readonly PSimplexT20SourceDriveMagnitudeRow[],
  mode: 'strongest' | 'weakest',
): PSimplexT20SourceDriveMagnitudeRow | null {
  if (axisRows.length === 0) {
    return null;
  }

  return [...axisRows].sort((left, right) => {
    const normComparison = mode === 'strongest' ? right.JNorm - left.JNorm : left.JNorm - right.JNorm;

    return Math.abs(normComparison) > PSIMPLEX_EPSILON ? normComparison : left.driveId.localeCompare(right.driveId);
  })[0];
}

function buildScaleFreeRatioRows(
  sourceRows: readonly PSimplexT20SourceDriveMagnitudeRow[],
  calibrationRows: readonly PSimplexT20AxisCalibrationReferenceRow[],
): PSimplexT20ScaleFreeRatioRow[] {
  const canonicalAxisJNorm = requiredReferenceNorm(calibrationRows, 'N1');
  const strongestAxisJNorm = requiredReferenceNorm(calibrationRows, 'N2');
  const weakestAxisJNorm = requiredReferenceNorm(calibrationRows, 'N3');

  return sourceRows.map((row) => ({
    rowId: `N0:${row.driveId}`,
    driveId: row.driveId,
    driveFamily: row.driveFamily,
    evidenceClass: row.evidenceClass,
    JNorm: row.JNorm,
    canonicalAxisJNorm,
    strongestAxisJNorm,
    weakestAxisJNorm,
    ratioToCanonicalAxis: cleanNumber(row.JNorm / canonicalAxisJNorm),
    ratioToStrongestAxis: cleanNumber(row.JNorm / strongestAxisJNorm),
    ratioToWeakestAxis: cleanNumber(row.JNorm / weakestAxisJNorm),
    responseReachabilityClaimAllowed: false,
    notes: ['N0 is scale-free. It reports magnitude ratios but does not claim response reachability.'],
    ok: canonicalAxisJNorm > PSIMPLEX_EPSILON && strongestAxisJNorm > PSIMPLEX_EPSILON && weakestAxisJNorm > PSIMPLEX_EPSILON,
  }));
}

function buildReachabilityRows(
  sourceRows: readonly PSimplexT20SourceDriveMagnitudeRow[],
  calibrationRows: readonly PSimplexT20AxisCalibrationReferenceRow[],
  a3SequenceRows: readonly PSimplexT17A3RootRegimeSequenceRow[],
  bodyActualThreshold: number | null,
  finiteLedgerBodyErrorBand: [number, number] | null,
): PSimplexT20ReachabilityRow[] {
  const calibrations = calibrationRows.filter(isOperationalCalibrationRow);

  return sourceRows.flatMap((sourceRow) =>
    calibrations.map((calibrationRow) =>
      buildReachabilityRow(sourceRow, calibrationRow, a3SequenceRows, bodyActualThreshold, finiteLedgerBodyErrorBand),
    ),
  );
}

function buildReachabilityRow(
  sourceRow: PSimplexT20SourceDriveMagnitudeRow,
  calibrationRow: PSimplexT20AxisCalibrationReferenceRow & {
    calibrationId: Exclude<PSimplexT20CalibrationId, 'N0' | 'N4'>;
    gain: number;
  },
  a3SequenceRows: readonly PSimplexT17A3RootRegimeSequenceRow[],
  bodyActualThreshold: number | null,
  finiteLedgerBodyErrorBand: [number, number] | null,
): PSimplexT20ReachabilityRow {
  const sCase = cleanNumber(calibrationRow.gain * sourceRow.JNorm);
  const gainInflated = calibrationRow.calibrationId === 'N3' && sourceRow.evidenceClass !== 'approved-axis-probe';
  const mappedResponseRegime = mappedRegimeForSource(sourceRow, sCase, a3SequenceRows, bodyActualThreshold);
  const classifications = classificationsForSource(
    sourceRow,
    calibrationRow.calibrationId,
    mappedResponseRegime,
    sCase,
    gainInflated,
    bodyActualThreshold,
  );
  const a3ResidualReachability = classifications.includes('A3-residual-reachable')
    ? 'residual-reachable'
    : 'not-residual-evidence';
  const a3ResponseReachability =
    sourceRow.driveFamily === 'A3-root'
      ? a3ResponseReachabilityForRegime(mappedResponseRegime)
      : 'not-response-evidence';
  const bodyQuarantineStatus = sourceRow.driveFamily === 'D3-body-diagonal' ? 'quarantined' : 'not-body-control';
  const operationallyGrounded =
    calibrationRow.isOperationalCalibration &&
    (sourceRow.evidenceClass === 'approved-axis-probe' || sourceRow.evidenceClass === 'actual-generated-site-evidence');
  const notes = notesForReachabilityRow({
    sourceRow,
    calibrationId: calibrationRow.calibrationId,
    sCase,
    mappedResponseRegime,
    gainInflated,
    a3ResponseReachability,
    bodyActualThreshold,
    finiteLedgerBodyErrorBand,
  });

  return {
    rowId: `${calibrationRow.calibrationId}:${sourceRow.driveId}`,
    driveId: sourceRow.driveId,
    driveFamily: sourceRow.driveFamily,
    evidenceClass: sourceRow.evidenceClass,
    sourceMechanism: sourceRow.sourceMechanism,
    calibrationId: calibrationRow.calibrationId,
    gain: calibrationRow.gain,
    JNorm: sourceRow.JNorm,
    sCase,
    mappedResponseRegime,
    mappedClosureStatus: closureStatusForSource(sourceRow, mappedResponseRegime),
    classifications,
    a3ResidualReachability,
    a3ResponseReachability,
    bodyQuarantineStatus,
    gainInflated,
    operationallyGrounded,
    notes,
    ok: true,
  };
}

function isOperationalCalibrationRow(
  row: PSimplexT20AxisCalibrationReferenceRow,
): row is PSimplexT20AxisCalibrationReferenceRow & {
  calibrationId: Exclude<PSimplexT20CalibrationId, 'N0' | 'N4'>;
  gain: number;
} {
  return (
    (row.calibrationId === 'N1' || row.calibrationId === 'N2' || row.calibrationId === 'N3') &&
    typeof row.gain === 'number' &&
    row.isOperationalCalibration
  );
}

function requiredReferenceNorm(
  calibrationRows: readonly PSimplexT20AxisCalibrationReferenceRow[],
  calibrationId: PSimplexT20CalibrationId,
): number {
  return calibrationRows.find((row) => row.calibrationId === calibrationId)?.axisReferenceJNorm ?? Number.NaN;
}

function mappedRegimeForSource(
  sourceRow: PSimplexT20SourceDriveMagnitudeRow,
  sCase: number,
  a3SequenceRows: readonly PSimplexT17A3RootRegimeSequenceRow[],
  bodyActualThreshold: number | null,
): string {
  if (sourceRow.driveFamily === 'axis-child-axis') {
    return 'axis-closed-regime';
  }

  if (sourceRow.driveFamily === 'A3-root' || sourceRow.driveFamily === 'A3-residual') {
    return mapA3RegimeForS(sCase, a3SequenceRows);
  }

  if (sourceRow.driveFamily === 'D3-body-diagonal') {
    if (bodyActualThreshold !== null && sCase >= bodyActualThreshold - PSIMPLEX_EPSILON) {
      return 'body-near-regime';
    }

    return mapA3RegimeForS(sCase, a3SequenceRows);
  }

  return 'diagnostic-only';
}

function mapA3RegimeForS(
  sCase: number,
  a3SequenceRows: readonly PSimplexT17A3RootRegimeSequenceRow[],
): PSimplexT17A3ProvisionalRegime {
  const exactSequenceRow = a3SequenceRows.find(
    (row) => sCase >= row.sStart - PSIMPLEX_EPSILON && sCase <= row.sEnd + PSIMPLEX_EPSILON,
  );

  if (exactSequenceRow) {
    return exactSequenceRow.a3ProvisionalRegime;
  }

  const axisLockedEnd = maxSequenceEnd(a3SequenceRows, 'axis-locked-regime', 0.5);
  const continuousTiltStart = minSequenceStart(a3SequenceRows, 'continuous-tilt-regime', 2);
  const a3NearStart = minSequenceStart(a3SequenceRows, 'A3-near-regime', 3);

  if (sCase <= axisLockedEnd + PSIMPLEX_EPSILON) {
    return 'axis-locked-regime';
  }

  if (sCase < continuousTiltStart - PSIMPLEX_EPSILON) {
    return 'axis-dominant-tilted-regime';
  }

  if (sCase < a3NearStart - PSIMPLEX_EPSILON) {
    return 'continuous-tilt-regime';
  }

  return 'A3-near-regime';
}

function minSequenceStart(
  rows: readonly PSimplexT17A3RootRegimeSequenceRow[],
  regime: PSimplexT17A3ProvisionalRegime,
  fallback: number,
): number {
  const starts = rows.filter((row) => row.a3ProvisionalRegime === regime).map((row) => row.sStart);

  return starts.length > 0 ? Math.min(...starts) : fallback;
}

function maxSequenceEnd(
  rows: readonly PSimplexT17A3RootRegimeSequenceRow[],
  regime: PSimplexT17A3ProvisionalRegime,
  fallback: number,
): number {
  const ends = rows.filter((row) => row.a3ProvisionalRegime === regime).map((row) => row.sEnd);

  return ends.length > 0 ? Math.max(...ends) : fallback;
}

function a3ResponseReachabilityForRegime(
  mappedResponseRegime: string,
): 'response-reachable' | 'response-not-reached' {
  return mappedResponseRegime === 'continuous-tilt-regime' || mappedResponseRegime === 'A3-near-regime'
    ? 'response-reachable'
    : 'response-not-reached';
}

function classificationsForSource(
  sourceRow: PSimplexT20SourceDriveMagnitudeRow,
  calibrationId: Exclude<PSimplexT20CalibrationId, 'N0' | 'N4'>,
  mappedResponseRegime: string,
  sCase: number,
  gainInflated: boolean,
  bodyActualThreshold: number | null,
): PSimplexT20ReachabilityClassification[] {
  if (sourceRow.driveFamily === 'axis-child-axis') {
    return ['axis-closed-reachable'];
  }

  if (sourceRow.driveFamily === 'A3-root') {
    const classifications: PSimplexT20ReachabilityClassification[] = ['A3-structurally-available'];
    const responseReachable = a3ResponseReachabilityForRegime(mappedResponseRegime) === 'response-reachable';

    if (responseReachable) {
      classifications.push(mappedResponseRegime === 'A3-near-regime' ? 'A3-near-reachable' : 'A3-continuous-tilt-reachable');
      if (gainInflated) {
        classifications.push('A3-gain-inflated-only');
      }
    } else {
      classifications.push('A3-not-reached-under-axis-calibration');
    }

    classifications.push('not-readout-channel');

    return uniqueClassifications(classifications);
  }

  if (sourceRow.driveFamily === 'A3-residual') {
    return [
      'A3-structurally-available',
      'A3-residual-reachable',
      'not-readout-channel',
    ];
  }

  if (sourceRow.driveFamily === 'D3-body-diagonal') {
    const classifications: PSimplexT20ReachabilityClassification[] = [
      'body-control-only',
      'body-threshold-refinement-needed',
      'body-quarantined',
      'not-readout-channel',
    ];
    const bodyNear = bodyActualThreshold !== null && sCase >= bodyActualThreshold - PSIMPLEX_EPSILON;

    if (bodyNear) {
      classifications.push('body-near-reachable-under-axis-calibration');
      if (gainInflated) {
        classifications.push('body-gain-inflated-only');
      }
    }

    return classifications;
  }

  const classifications: PSimplexT20ReachabilityClassification[] = ['diagnostic-only', 'not-readout-channel'];

  if (sourceRow.driveFamily === 'T-suppressed-transverse') {
    classifications.push('suppressed-control');
  }

  return classifications;
}

function uniqueClassifications(
  classifications: readonly PSimplexT20ReachabilityClassification[],
): PSimplexT20ReachabilityClassification[] {
  return [...new Set(classifications)];
}

function closureStatusForSource(sourceRow: PSimplexT20SourceDriveMagnitudeRow, mappedResponseRegime: string): string {
  if (sourceRow.driveFamily === 'axis-child-axis') {
    return 'closed';
  }

  if (sourceRow.driveFamily === 'A3-root') {
    return mappedResponseRegime === 'continuous-tilt-regime' || mappedResponseRegime === 'A3-near-regime'
      ? 'provisional-readout'
      : 'below-provisional-response-threshold';
  }

  if (sourceRow.driveFamily === 'D3-body-diagonal') {
    return 'threshold-refinement-needed-quarantined';
  }

  return 'diagnostic-only';
}

function notesForReachabilityRow(args: {
  sourceRow: PSimplexT20SourceDriveMagnitudeRow;
  calibrationId: Exclude<PSimplexT20CalibrationId, 'N0' | 'N4'>;
  sCase: number;
  mappedResponseRegime: string;
  gainInflated: boolean;
  a3ResponseReachability: 'response-reachable' | 'response-not-reached' | 'not-response-evidence';
  bodyActualThreshold: number | null;
  finiteLedgerBodyErrorBand: [number, number] | null;
}): string[] {
  const notes = [`sCase=${args.sCase} under ${args.calibrationId}`, `mapped-regime:${args.mappedResponseRegime}`];

  if (args.gainInflated) {
    notes.push('N3 applies the weakest approved axis reference and is marked gain-inflated.');
  }

  if (args.sourceRow.driveFamily === 'A3-residual') {
    notes.push('Residual reachability is reported separately from response reachability.');
  }

  if (args.sourceRow.driveFamily === 'A3-root' && args.a3ResponseReachability === 'response-not-reached') {
    notes.push('A3 response is not operationally reached under this declared axis calibration.');
  }

  if (args.sourceRow.driveFamily === 'D3-body-diagonal') {
    notes.push(
      `D3 remains quarantined; actual body onset is ${args.bodyActualThreshold ?? 'unknown'} and finite error band is ${
        args.finiteLedgerBodyErrorBand ? `[${args.finiteLedgerBodyErrorBand.join(', ')}]` : 'unknown'
      }.`,
    );
  }

  if (args.sourceRow.evidenceClass === 'abstract-control') {
    notes.push('Abstract controls do not supply actual generated-site source magnitudes.');
  }

  return notes;
}

function buildSensitivityOnlyRows(
  sourceRows: readonly PSimplexT20SourceDriveMagnitudeRow[],
  calibrationRows: readonly PSimplexT20AxisCalibrationReferenceRow[],
  a3SequenceRows: readonly PSimplexT17A3RootRegimeSequenceRow[],
  bodyActualThreshold: number | null,
  finiteLedgerBodyErrorBand: [number, number] | null,
): PSimplexT20SensitivityOnlyRow[] {
  const n3 = calibrationRows.find((row) => row.calibrationId === 'N3');
  const n3Gain = n3?.gain ?? null;
  const a3ContinuousTiltThreshold = minSequenceStart(a3SequenceRows, 'continuous-tilt-regime', 2);
  const a3NearThreshold = minSequenceStart(a3SequenceRows, 'A3-near-regime', 3);

  if (n3Gain === null) {
    return [];
  }

  return sourceRows
    .filter((row) => row.driveFamily === 'A3-root' || row.driveFamily === 'A3-residual' || row.driveFamily === 'D3-body-diagonal')
    .map((row) => {
      const n3SCase = cleanNumber(n3Gain * row.JNorm);
      const marginToBodyActual = bodyActualThreshold === null ? null : cleanNumber(bodyActualThreshold - n3SCase);

      return {
        rowId: `N4:${row.driveId}`,
        driveId: row.driveId,
        driveFamily: row.driveFamily,
        evidenceClass: row.evidenceClass,
        referenceCalibrationId: 'N3',
        n3SCase,
        a3ContinuousTiltThreshold: cleanNumber(a3ContinuousTiltThreshold),
        a3NearThreshold: cleanNumber(a3NearThreshold),
        bodyActualThreshold: bodyActualThreshold === null ? null : cleanNumber(bodyActualThreshold),
        finiteLedgerBodyErrorBand,
        marginToA3ContinuousTilt: cleanNumber(a3ContinuousTiltThreshold - n3SCase),
        marginToA3Near: cleanNumber(a3NearThreshold - n3SCase),
        marginToBodyActual,
        sensitivityJudgment: sensitivityJudgmentForRow(row, n3SCase, a3ContinuousTiltThreshold, bodyActualThreshold),
        operationalClaimAllowed: false,
        ok: true,
      };
    });
}

function sensitivityJudgmentForRow(
  row: PSimplexT20SourceDriveMagnitudeRow,
  n3SCase: number,
  a3ContinuousTiltThreshold: number,
  bodyActualThreshold: number | null,
): string {
  if (row.driveFamily === 'D3-body-diagonal') {
    return bodyActualThreshold !== null && n3SCase >= bodyActualThreshold - PSIMPLEX_EPSILON
      ? 'sensitivity-only-body-threshold-crossed-but-still-quarantined'
      : 'sensitivity-only-body-threshold-not-crossed';
  }

  if (row.driveFamily === 'A3-root') {
    return n3SCase >= a3ContinuousTiltThreshold - PSIMPLEX_EPSILON
      ? 'sensitivity-only-A3-threshold-crossed-by-high-gain-reference'
      : 'sensitivity-only-A3-threshold-not-crossed';
  }

  return 'sensitivity-only-residual-magnitude-does-not-claim-response';
}

function buildA3ResidualReachabilityRows(
  sourceRows: readonly PSimplexT20SourceDriveMagnitudeRow[],
): PSimplexT20A3ResidualReachabilityRow[] {
  return sourceRows
    .filter((row) => row.driveFamily === 'A3-residual')
    .map((row) => ({
      rowId: `A3-residual:${row.driveId}`,
      sourceDriveRowId: row.driveId,
      sourceResidualRowId: row.sourceRowId,
      residualStatus: row.residualStatus ?? 'unknown-residual-status',
      residualMagnitude: row.JNorm,
      bestMatchingRootId: row.nearestA3DirectionId,
      residualReachability: 'A3-residual-reachable',
      responseReachabilityClaimAllowed: false,
      generatedSiteMagnitudeEvidence: false,
      notes: [
        'A3 residual reachability is structurally present.',
        'This row is not allowed to establish A3 response reachability or actual generated-site forcing scale.',
      ],
      ok: row.ok,
    }));
}

function buildA3ResponseReachabilityRows(
  reachabilityRows: readonly PSimplexT20ReachabilityRow[],
): PSimplexT20A3ResponseReachabilityRow[] {
  return reachabilityRows
    .filter((row) => row.driveFamily === 'A3-root')
    .map((row) => ({
      rowId: `A3-response:${row.rowId}`,
      driveId: row.driveId,
      calibrationId: row.calibrationId,
      evidenceClass: row.evidenceClass,
      sCase: row.sCase,
      mappedResponseRegime: row.mappedResponseRegime,
      responseReachability:
        row.a3ResponseReachability === 'response-reachable' ? 'response-reachable' : 'response-not-reached',
      operationallyGrounded: row.operationallyGrounded,
      gainInflated: row.gainInflated,
      notes:
        row.a3ResponseReachability === 'response-reachable'
          ? ['A3 response threshold is crossed by the calibrated abstract D2 control, but generated-site grounding is still required.']
          : ['A3 response threshold is not reached under this declared axis calibration.'],
      ok: row.ok,
    }));
}

function buildBodyQuarantineCheckRows(
  reachabilityRows: readonly PSimplexT20ReachabilityRow[],
): PSimplexT20BodyQuarantineCheckRow[] {
  return reachabilityRows
    .filter((row) => row.driveFamily === 'D3-body-diagonal')
    .map((row) => ({
      rowId: `D3-quarantine:${row.rowId}`,
      driveId: row.driveId,
      evidenceClass: row.evidenceClass,
      calibrationId: row.calibrationId,
      sCase: row.sCase,
      mappedResponseRegime: row.mappedResponseRegime,
      bodyQuarantineStatus: 'body-quarantined',
      thresholdRefinementNeeded: true,
      safeForReadoutSubstrate: false,
      notes: ['D3/body remains systematic but quarantined; body controls cannot enter the readout substrate.'],
      ok: row.bodyQuarantineStatus === 'quarantined' && row.classifications.includes('body-quarantined'),
    }));
}

function buildGainInflationRows(
  reachabilityRows: readonly PSimplexT20ReachabilityRow[],
): PSimplexT20GainInflationRow[] {
  return reachabilityRows
    .filter((row) => row.gainInflated)
    .map((row) => ({
      rowId: `gain-inflation:${row.rowId}`,
      driveId: row.driveId,
      driveFamily: row.driveFamily,
      evidenceClass: row.evidenceClass,
      calibrationId: 'N3',
      gain: row.gain,
      sCase: row.sCase,
      gainInflated: true,
      inflatedReachabilityClaim:
        row.classifications.includes('A3-gain-inflated-only') || row.classifications.includes('body-gain-inflated-only'),
      notes: ['N3 is retained for sensitivity bookkeeping and cannot be hidden as ordinary operational grounding.'],
      ok: row.calibrationId === 'N3',
    }));
}

function buildInvalidInterpretationBoundaryRows(): PSimplexT20InvalidInterpretationBoundaryRow[] {
  return [
    {
      boundaryId: 'no-new-solver',
      statement: 'T20 performs calibration and reachability bookkeeping only; it does not add a solver.',
      enforced: true,
    },
    {
      boundaryId: 'no-a3-forcing-choice',
      statement: 'No gain is chosen to force A3; every finite gain is derived from an approved child-axis reference.',
      enforced: true,
    },
    {
      boundaryId: 'separate-residual-from-response',
      statement: 'A3 residual mechanisms do not count as A3 response reachability by themselves.',
      enforced: true,
    },
    {
      boundaryId: 'body-stays-quarantined',
      statement: 'D3/body controls remain threshold-refinement-needed and not substrate-safe.',
      enforced: true,
    },
    {
      boundaryId: 'no-expansion-hooks',
      statement: 'No FieldCue, rendering, semantic naming, spatial coupling, route/walk/holonomy, or defect/vortex machinery is introduced.',
      enforced: true,
    },
  ];
}

function buildSummary(args: {
  sourceDriveMagnitudeRows: readonly PSimplexT20SourceDriveMagnitudeRow[];
  axisCalibrationReferenceRows: readonly PSimplexT20AxisCalibrationReferenceRow[];
  reachabilityRows: readonly PSimplexT20ReachabilityRow[];
  a3ResidualReachabilityRows: readonly PSimplexT20A3ResidualReachabilityRow[];
  a3ResponseReachabilityRows: readonly PSimplexT20A3ResponseReachabilityRow[];
  bodyQuarantineCheckRows: readonly PSimplexT20BodyQuarantineCheckRow[];
  invalidInterpretationBoundaryRows: readonly PSimplexT20InvalidInterpretationBoundaryRow[];
}): PSimplexT20Summary {
  const {
    sourceDriveMagnitudeRows,
    axisCalibrationReferenceRows,
    reachabilityRows,
    a3ResidualReachabilityRows,
    a3ResponseReachabilityRows,
    bodyQuarantineCheckRows,
    invalidInterpretationBoundaryRows,
  } = args;
  const a3ResponseReachableRows = a3ResponseReachabilityRows.filter(
    (row) => row.responseReachability === 'response-reachable',
  );
  const bodyReachableRows = reachabilityRows.filter((row) =>
    row.classifications.includes('body-near-reachable-under-axis-calibration'),
  );
  const residualRowsDoNotClaimResponse = reachabilityRows
    .filter((row) => row.driveFamily === 'A3-residual')
    .every((row) => row.a3ResponseReachability === 'not-response-evidence');

  return {
    totalDriveRows: sourceDriveMagnitudeRows.length,
    actualGeneratedSiteEvidenceCount: countEvidenceClass(sourceDriveMagnitudeRows, 'actual-generated-site-evidence'),
    approvedAxisProbeCount: countEvidenceClass(sourceDriveMagnitudeRows, 'approved-axis-probe'),
    abstractControlCount: countEvidenceClass(sourceDriveMagnitudeRows, 'abstract-control'),
    diagnosticControlCount: countEvidenceClass(sourceDriveMagnitudeRows, 'diagnostic-control'),
    residualMechanismCount: countEvidenceClass(sourceDriveMagnitudeRows, 'residual-mechanism'),
    axisReferenceCount: axisCalibrationReferenceRows.filter((row) => row.axisReferenceDriveId !== null).length,
    axisCalibrationOperationalCount: axisCalibrationReferenceRows.filter((row) => row.isOperationalCalibration).length,
    a3StructuralAvailableCount: reachabilityRows.filter((row) =>
      row.classifications.includes('A3-structurally-available'),
    ).length,
    a3ResidualReachableCount: a3ResidualReachabilityRows.filter((row) => row.residualReachability === 'A3-residual-reachable')
      .length,
    a3ResponseReachableOperationalCount: a3ResponseReachableRows.filter(
      (row) => row.operationallyGrounded && !row.gainInflated,
    ).length,
    a3ResponseReachableOnlyInflatedCount: a3ResponseReachableRows.filter((row) => row.gainInflated).length,
    a3NotReachedUnderAxisCalibrationCount: reachabilityRows.filter((row) =>
      row.classifications.includes('A3-not-reached-under-axis-calibration'),
    ).length,
    bodyReachableOperationalCount: bodyReachableRows.filter((row) => row.operationallyGrounded && !row.gainInflated).length,
    bodyReachableOnlyInflatedCount: bodyReachableRows.filter((row) => row.gainInflated).length,
    bodyQuarantinedCount: bodyQuarantineCheckRows.filter((row) => row.bodyQuarantineStatus === 'body-quarantined').length,
    generatedSiteA3ResidualEvidenceComplete: sourceDriveMagnitudeRows.some(
      (row) => row.driveFamily === 'A3-residual' && row.evidenceClass === 'actual-generated-site-evidence',
    ),
    generatedSiteA3ResponseGrounded: a3ResponseReachableRows.some(
      (row) => row.responseReachability === 'response-reachable' && row.operationallyGrounded,
    ),
    d3BodyStillQuarantined:
      bodyQuarantineCheckRows.length > 0 &&
      bodyQuarantineCheckRows.every((row) => row.bodyQuarantineStatus === 'body-quarantined' && !row.safeForReadoutSubstrate),
    strictResidualResponseSeparationPassed:
      residualRowsDoNotClaimResponse &&
      a3ResidualReachabilityRows.every((row) => row.responseReachabilityClaimAllowed === false),
    forbiddenBoundaryPassed: invalidInterpretationBoundaryRows.every((row) => row.enforced),
  };
}

function countEvidenceClass(
  rows: readonly PSimplexT20SourceDriveMagnitudeRow[],
  evidenceClass: PSimplexT20EvidenceClass,
): number {
  return rows.filter((row) => row.evidenceClass === evidenceClass).length;
}

function recommendationForSummary(summary: PSimplexT20Summary): PSimplexT20FinalRecommendation {
  if (!summary.generatedSiteA3ResidualEvidenceComplete || !summary.generatedSiteA3ResponseGrounded) {
    return 'source-magnitude-evidence-incomplete';
  }

  if (summary.a3ResponseReachableOperationalCount > 0) {
    return 'A3-operationally-grounded';
  }

  if (summary.a3ResidualReachableCount > 0) {
    return 'A3-residual-readable-only';
  }

  if (summary.a3ResponseReachableOnlyInflatedCount > 0) {
    return 'A3-gain-inflated';
  }

  if (summary.d3BodyStillQuarantined) {
    return 'return-to-C1-C2';
  }

  return 'A3-structurally-coherent-but-not-active';
}

function buildRecommendedResearchConsequenceRows(
  summary: PSimplexT20Summary,
  finalRecommendation: PSimplexT20FinalRecommendation,
): PSimplexT20RecommendedResearchConsequenceRow[] {
  return [
    {
      consequenceId: 'closed-axis-plus-provisional-a3',
      status: summary.generatedSiteA3ResponseGrounded ? 'A3-operationally-grounded' : 'A3-structurally-coherent-but-not-active',
      statement:
        'The usable substrate remains closed axis plus provisional A3; operational A3 requires generated-site source magnitude grounding.',
      ok: true,
    },
    {
      consequenceId: 'residual-response-separation',
      status: summary.a3ResidualReachableCount > 0 ? 'A3-residual-readable-only' : 'source-magnitude-evidence-incomplete',
      statement: 'A3 residual evidence is readable as residual structure, not as response reachability.',
      ok: summary.strictResidualResponseSeparationPassed,
    },
    {
      consequenceId: 'body-quarantine',
      status: summary.d3BodyStillQuarantined ? 'return-to-C1-C2' : 'source-magnitude-evidence-incomplete',
      statement: 'D3/body remains quarantined and does not block axis plus A3 consolidation.',
      ok: summary.d3BodyStillQuarantined,
    },
    {
      consequenceId: 'final-recommendation',
      status: finalRecommendation,
      statement:
        finalRecommendation === 'source-magnitude-evidence-incomplete'
          ? 'Do not claim operational A3 reachability until actual generated-site A3 source magnitudes are supplied.'
          : 'Carry forward the stated recommendation without creating a new diagnostic ledger by default.',
      ok: true,
    },
  ];
}

function buildIntegrityIssues(args: {
  parentEvidenceRows: readonly PSimplexT20ParentEvidenceRow[];
  axisCalibrationReferenceRows: readonly PSimplexT20AxisCalibrationReferenceRow[];
  sourceDriveMagnitudeRows: readonly PSimplexT20SourceDriveMagnitudeRow[];
  scaleFreeRatioRows: readonly PSimplexT20ScaleFreeRatioRow[];
  reachabilityRows: readonly PSimplexT20ReachabilityRow[];
  summary: PSimplexT20Summary;
}): string[] {
  const issues: string[] = [];
  const requiredParentFailures = args.parentEvidenceRows.filter(
    (row) => row.requiredForT20 && (!row.ok || (row.integrityIssueCount ?? 0) > 0),
  );

  if (requiredParentFailures.length > 0) {
    issues.push(`Required parent evidence incomplete: ${requiredParentFailures.map((row) => row.ledgerId).join(', ')}.`);
  }

  if (args.sourceDriveMagnitudeRows.length === 0) {
    issues.push('No source-drive magnitude rows were produced.');
  }

  if (args.summary.approvedAxisProbeCount === 0) {
    issues.push('No approved axis probes are available for axis-grounded calibration.');
  }

  if (args.axisCalibrationReferenceRows.filter((row) => row.calibrationId === 'N1' || row.calibrationId === 'N2' || row.calibrationId === 'N3').some((row) => !row.ok || row.gain === null)) {
    issues.push('At least one operational axis calibration is missing a finite gain.');
  }

  if (args.scaleFreeRatioRows.some((row) => row.responseReachabilityClaimAllowed !== false || !row.ok)) {
    issues.push('Scale-free N0 rows must remain ratio-only and valid.');
  }

  if (!args.summary.strictResidualResponseSeparationPassed) {
    issues.push('A3 residual reachability was conflated with A3 response reachability.');
  }

  if (!args.summary.d3BodyStillQuarantined) {
    issues.push('D3/body controls were not kept quarantined.');
  }

  if (!args.summary.forbiddenBoundaryPassed) {
    issues.push('At least one invalid interpretation boundary is not enforced.');
  }

  if (
    args.reachabilityRows.some(
      (row) => row.driveFamily === 'D3-body-diagonal' && row.mappedClosureStatus !== 'threshold-refinement-needed-quarantined',
    )
  ) {
    issues.push('D3/body rows must not be promoted into substrate-safe closure.');
  }

  return issues;
}

function classifyVerdict(integrityIssues: readonly string[], summary: PSimplexT20Summary): PSimplexT20Verdict {
  if (integrityIssues.length > 0) {
    return 'FAIL';
  }

  if (!summary.generatedSiteA3ResidualEvidenceComplete || !summary.generatedSiteA3ResponseGrounded) {
    return 'PARTIAL';
  }

  return 'PASS';
}
