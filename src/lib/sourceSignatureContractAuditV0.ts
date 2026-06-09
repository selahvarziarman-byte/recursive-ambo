import { buildTetrahedralAmboChildContexts } from './fieldSourceChildContexts';
import type { TetrahedralAmboChildContext } from './fieldSourceChildContexts';
import {
  buildTetrahedralChildSourceProfileDerivationReport,
  type FieldChildSourceProfileDerivationReport,
} from './fieldSourceChildDerivations';
import {
  buildTetrahedralChildProfileDegeneracyReport,
  type FieldSourceChildDegeneracyReport,
} from './fieldSourceChildDegeneracy';
import {
  buildProfileAwareFieldSourcePolicyDiagnosticReport,
  type ProfileAwareFieldSourcePolicyDiagnosticReport,
  type ProfileAwareSourceEntry,
  type ProfileAwareSourceReadiness,
} from './fieldSourceProfileAwarePolicy';
import {
  buildPrimalProfileAssignmentDiagnosticReport,
  createTetrahedronFieldSourceProfileSetupFixture,
  createTetrahedronPrimalProfileAssignmentFixture,
  createUniformCirclePrimalProfileSystemFixture,
  generateFieldSourceProfiles,
  type FieldSourceEmissionParameters,
  type FieldSourceProfile,
  type FieldSourceProfileAssignmentDiagnosticReport,
  type FieldSourceProfileSystem,
} from './fieldSourceProfiles';
import {
  buildTetrahedralQuarkChannelReport,
  type QuarkChannelRecord,
  type TetrahedralQuarkChannelReport,
} from './fieldSourceQuarkChannels';
import {
  buildPythagoreanTetrachordQuarkRegimeV0Report,
  type PythagoreanTetrachordQuarkRegimeV0Report,
} from './fieldSourcePythagoreanTetrachordQuarkRegimeV0';
import {
  buildFieldCueV0Report,
  type FieldCueV0Report,
} from './fieldCueV0';
import {
  buildGeneratedSiteReadingV0Report,
  type GeneratedSiteReadingV0Report,
} from './generatedSiteReadingV0';

export type SourceSignatureContractAuditV0Method =
  'source-signature-contract-audit-v0';
export type SourceSignatureContractAuditV0DiagnosticScope =
  'one-ambo-tetrahedron-source-signature-audit';
export type SourceSignatureContractAuditV0SourcePolicyId =
  'profile-aware-quark-child-inheritance-v0';
export type SourceSignatureContractAuditV0SemanticStatus =
  'not-semantic-naming';
export type SourceSignatureContractAuditV0TopologyStatus =
  'not-topology-workspace';
export type SourceSignatureContractAuditV0PacketWriteStatus =
  'not-packet-writing';
export type SourceSignatureContractAuditV0ShapeMutationStatus =
  'not-shape-mutation';
export type SourceSignatureContractAuditV0OperationRegistryStatus =
  'not-operation-registry-work';
export type SourceSignatureContractAuditV0ScalarVariationStatus =
  | 'nontrivial'
  | 'scalar-invariant';
export type SourceSignatureContractAuditV0ChildReadinessStatus =
  | 'all-field-ready'
  | 'partial-fallback'
  | 'failed';
export type SourceSignatureContractAuditV0ProvingEventSignatureStatus =
  | 'pass'
  | 'fail';
export type SourceSignatureContractAuditV0ChildScalarDistinctivenessStatus =
  | 'nontrivial'
  | 'scalar-invariant'
  | 'not-applicable';
export type SourceSignatureContractAuditV0StructuralContractStatus =
  | 'pass'
  | 'fail';
export type SourceSignatureContractAuditV0ProvingFixtureUsefulnessStatus =
  | 'pass'
  | 'fail';
export type SourceSignatureContractAuditV0HumanLegibilityStatus =
  | 'useful'
  | 'weak'
  | 'misleading';
export type SourceSignatureContractAuditV0CircularMergeStatus =
  | 'derived'
  | 'undefined-circular-mean'
  | 'fallback';

export type SourceSignatureContractAuditV0IssueCode =
  | 'primal-scalar-invariance'
  | 'child-scalar-invariance'
  | 'child-signature-fallback'
  | 'child-signature-unresolved'
  | 'phase-circular-mean-cancellation'
  | 'proving-fixture-not-useful'
  | 'misleading-signature-ui-risk';

export interface SourceSignatureContractAuditV0Tuple {
  amplitude: number;
  waveNumber: number;
  phase: number;
  attenuation: number;
}

export interface SourceSignatureContractAuditV0ProfileSlot {
  vertexId: string;
  profileId: string;
  amplitude: number;
  waveNumber: number;
  phase: number;
  attenuation: number;
}

export interface SourceSignatureContractAuditV0ProfileSystemSection {
  profileSystemId: string;
  profileCount: number;
  baseAmplitude: number;
  baseWaveNumber: number;
  baseAttenuation: number;
  phaseOrigin: number;
  phaseArrangement: FieldSourceProfileSystem['phaseArrangement'];
  profileSlots: SourceSignatureContractAuditV0ProfileSlot[];
}

export interface SourceSignatureContractAuditV0PrimalScalarVariationAudit {
  amplitudeUniqueCount: number;
  waveNumberUniqueCount: number;
  attenuationUniqueCount: number;
  phaseUniqueCount: number;
  scalarVariationStatus: SourceSignatureContractAuditV0ScalarVariationStatus;
  scalarVariationWarning?: string;
}

export interface SourceSignatureContractAuditV0QuarkChannelTuple {
  channelId: string;
  pair: string;
  parentVertexId: string;
  projectionVertexId: string;
  tuple: SourceSignatureContractAuditV0Tuple;
}

export interface SourceSignatureContractAuditV0ChildDerivationRow {
  childId: string;
  sourceEdgeId: string;
  complementEdgeId: string;
  antipodalChildId: string;
  projectionVertexIds: string[];
  channelPairs: string[];
  channelTuples: SourceSignatureContractAuditV0QuarkChannelTuple[];
  derivedTuple?: SourceSignatureContractAuditV0Tuple;
  fallbackKind?: string;
  fallbackReason?: string;
  localDerivationStatus: string;
  fieldReadyStatus: ProfileAwareSourceReadiness | 'missing-policy-source';
  fieldReady: boolean;
}

export interface SourceSignatureContractAuditV0ChildSignatureReadinessAudit {
  expectedChildCount: 6;
  derivedChildCount: number;
  fallbackChildCount: number;
  unresolvedChildCount: number;
  fieldReadyChildCount: number;
  nonFieldReadyChildCount: number;
  childReadinessStatus: SourceSignatureContractAuditV0ChildReadinessStatus;
}

export interface SourceSignatureContractAuditV0PhaseMergeRow {
  childId: string;
  channelPhases: number[];
  circularMergeStatus: SourceSignatureContractAuditV0CircularMergeStatus;
  explanation?: string;
}

export interface SourceSignatureContractAuditV0ChildScalarDistinctivenessAudit {
  uniqueAmplitudeCount: number;
  uniqueWaveNumberCount: number;
  uniqueAttenuationCount: number;
  uniquePhaseCount: number;
  childScalarDistinctivenessStatus: SourceSignatureContractAuditV0ChildScalarDistinctivenessStatus;
  warning?: string;
}

export interface SourceSignatureContractAuditV0Issue {
  code: SourceSignatureContractAuditV0IssueCode;
  message: string;
  childId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface SourceSignatureContractAuditV0Report {
  reportId: string;
  method: SourceSignatureContractAuditV0Method;
  diagnosticScope: SourceSignatureContractAuditV0DiagnosticScope;
  sourcePolicyId: SourceSignatureContractAuditV0SourcePolicyId;
  semanticStatus: SourceSignatureContractAuditV0SemanticStatus;
  topologyStatus: SourceSignatureContractAuditV0TopologyStatus;
  packetWriteStatus: SourceSignatureContractAuditV0PacketWriteStatus;
  shapeMutationStatus: SourceSignatureContractAuditV0ShapeMutationStatus;
  operationRegistryStatus: SourceSignatureContractAuditV0OperationRegistryStatus;
  profileSystem: SourceSignatureContractAuditV0ProfileSystemSection;
  primalScalarVariationAudit: SourceSignatureContractAuditV0PrimalScalarVariationAudit;
  childDerivationTable: SourceSignatureContractAuditV0ChildDerivationRow[];
  childSignatureReadinessAudit: SourceSignatureContractAuditV0ChildSignatureReadinessAudit;
  phaseMergeAudit: SourceSignatureContractAuditV0PhaseMergeRow[];
  childScalarDistinctivenessAudit: SourceSignatureContractAuditV0ChildScalarDistinctivenessAudit;
  structuralContractStatus: SourceSignatureContractAuditV0StructuralContractStatus;
  provingFixtureUsefulnessStatus: SourceSignatureContractAuditV0ProvingFixtureUsefulnessStatus;
  provingEventSignatureStatus: SourceSignatureContractAuditV0ProvingEventSignatureStatus;
  humanLegibilityStatus: SourceSignatureContractAuditV0HumanLegibilityStatus;
  diagnosticOk: boolean;
  ok: boolean;
  issueCount: number;
  issues: SourceSignatureContractAuditV0Issue[];
  sourceReports: {
    profileAssignmentOk: boolean;
    childDegeneracyOk: boolean;
    profileAwarePolicyOk: boolean;
    quarkChannelReportOkCount: number;
    childDerivationReportCount: number;
    profileAwarePolicyIssueCount: number;
  };
}

export type SourceSignatureContractAuditV0ComparisonStatus = 'pass' | 'fail';
export type SourceSignatureContractAuditV0Gate1Status = 'pass' | 'fail';
export type SourceSignatureContractAuditV0Gate2Status = 'pass' | 'fail';
export type SourceSignatureContractAuditV0DownstreamSwitchStatus =
  'field-cue-switched-generated-reading-inherits-v0';
export type SourceSignatureContractAuditV0ControlRole = 'bad-control';
export type SourceSignatureContractAuditV0ControlExpectedFailureStatus =
  | 'failed-as-expected'
  | 'unexpected-pass';
export type SourceSignatureContractAuditV0ProvingCandidateStatus =
  | 'pass'
  | 'fail';

export interface SourceSignatureContractAuditV0ComparisonIssue {
  code: string;
  message: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface SourceSignatureContractAuditV0ComparisonReport {
  reportId: string;
  method: 'source-signature-contract-audit-v0-comparison';
  diagnosticScope: SourceSignatureContractAuditV0DiagnosticScope;
  controlRegime: {
    controlRole: SourceSignatureContractAuditV0ControlRole;
    report: SourceSignatureContractAuditV0Report;
    expectedFailureStatus: SourceSignatureContractAuditV0ControlExpectedFailureStatus;
  };
  provingCandidateRegime: {
    provingRegimeId: PythagoreanTetrachordQuarkRegimeV0Report['provingRegimeId'];
    report: PythagoreanTetrachordQuarkRegimeV0Report;
    candidateStatus: SourceSignatureContractAuditV0ProvingCandidateStatus;
  };
  comparisonStatus: SourceSignatureContractAuditV0ComparisonStatus;
  gate1SourceSignatureProvingStatus: SourceSignatureContractAuditV0Gate1Status;
  gate2DownstreamSourceIntegrationStatus: SourceSignatureContractAuditV0Gate2Status;
  downstreamSwitchStatus: SourceSignatureContractAuditV0DownstreamSwitchStatus;
  downstreamReports: {
    fieldCueOk: boolean;
    generatedSiteReadingOk: boolean;
    fieldCueCount: number;
    generatedSiteReadingCount: number;
    fieldReadyCueCount: number;
    generatedFieldReadyReadingCount: number;
  };
  semanticStatus: SourceSignatureContractAuditV0SemanticStatus;
  topologyStatus: SourceSignatureContractAuditV0TopologyStatus;
  packetWriteStatus: SourceSignatureContractAuditV0PacketWriteStatus;
  shapeMutationStatus: SourceSignatureContractAuditV0ShapeMutationStatus;
  operationRegistryStatus: SourceSignatureContractAuditV0OperationRegistryStatus;
  issueCount: number;
  issues: SourceSignatureContractAuditV0ComparisonIssue[];
  ok: boolean;
}

interface SourceSignatureContractAuditV0Fixture {
  profileSystem: FieldSourceProfileSystem;
  profiles: FieldSourceProfile[];
  profileAssignmentReport: FieldSourceProfileAssignmentDiagnosticReport;
  childContexts: TetrahedralAmboChildContext[];
  quarkChannelReports: TetrahedralQuarkChannelReport[];
  childDerivationReports: FieldChildSourceProfileDerivationReport[];
  childDegeneracyReport: FieldSourceChildDegeneracyReport;
  policyReport: ProfileAwareFieldSourcePolicyDiagnosticReport;
}

const METHOD: SourceSignatureContractAuditV0Method =
  'source-signature-contract-audit-v0';
const DIAGNOSTIC_SCOPE: SourceSignatureContractAuditV0DiagnosticScope =
  'one-ambo-tetrahedron-source-signature-audit';
const SOURCE_POLICY_ID: SourceSignatureContractAuditV0SourcePolicyId =
  'profile-aware-quark-child-inheritance-v0';
const SEMANTIC_STATUS: SourceSignatureContractAuditV0SemanticStatus =
  'not-semantic-naming';
const TOPOLOGY_STATUS: SourceSignatureContractAuditV0TopologyStatus =
  'not-topology-workspace';
const PACKET_WRITE_STATUS: SourceSignatureContractAuditV0PacketWriteStatus =
  'not-packet-writing';
const SHAPE_MUTATION_STATUS: SourceSignatureContractAuditV0ShapeMutationStatus =
  'not-shape-mutation';
const OPERATION_REGISTRY_STATUS: SourceSignatureContractAuditV0OperationRegistryStatus =
  'not-operation-registry-work';
const ACTIVE_TETRAHEDRON_PRIMAL_VERTICES = ['A', 'B', 'C', 'D'] as const;
const EXPECTED_CHILD_COUNT = 6 as const;

export function buildSourceSignatureContractAuditV0Report(): SourceSignatureContractAuditV0Report {
  const fixture = buildFixture();
  const profileSystem = buildProfileSystemSection(fixture);
  const primalScalarVariationAudit = buildPrimalScalarVariationAudit(
    profileSystem.profileSlots,
  );
  const policySourceByVertexId = new Map(
    fixture.policyReport.sources.map((source) => [source.vertexId, source]),
  );
  const childDerivationReportByVertexId = new Map(
    fixture.childDerivationReports.map((report) => [report.childVertexId, report]),
  );
  const quarkReportByChildId = new Map(
    fixture.quarkChannelReports.map((report) => [report.childVertexId, report]),
  );
  const childDerivationTable = fixture.childContexts.map((context) =>
    buildChildDerivationRow({
      context,
      derivationReport: childDerivationReportByVertexId.get(context.childVertexId),
      quarkChannelReport: quarkReportByChildId.get(context.childVertexId),
      policySource: policySourceByVertexId.get(context.childVertexId),
    }),
  );
  const childSignatureReadinessAudit =
    buildChildSignatureReadinessAudit(childDerivationTable);
  const phaseMergeAudit = buildPhaseMergeAudit(childDerivationTable);
  const childScalarDistinctivenessAudit =
    buildChildScalarDistinctivenessAudit(childDerivationTable);
  const structuralContractStatus = pickStructuralContractStatus(
    fixture,
    childDerivationTable,
  );
  const provingFixtureUsefulnessStatus = pickProvingFixtureUsefulnessStatus({
    childSignatureReadinessAudit,
    childScalarDistinctivenessAudit,
    phaseMergeAudit,
  });
  const provingEventSignatureStatus: SourceSignatureContractAuditV0ProvingEventSignatureStatus =
    childSignatureReadinessAudit.fieldReadyChildCount === EXPECTED_CHILD_COUNT &&
    provingFixtureUsefulnessStatus === 'pass'
      ? 'pass'
      : 'fail';
  const humanLegibilityStatus = pickHumanLegibilityStatus({
    primalScalarVariationAudit,
    childScalarDistinctivenessAudit,
    childSignatureReadinessAudit,
    phaseMergeAudit,
  });
  const issues = buildIssues({
    primalScalarVariationAudit,
    childDerivationTable,
    childSignatureReadinessAudit,
    phaseMergeAudit,
    childScalarDistinctivenessAudit,
    provingFixtureUsefulnessStatus,
    humanLegibilityStatus,
  });
  const diagnosticOk =
    structuralContractStatus === 'pass' &&
    profileSystem.profileSlots.length === ACTIVE_TETRAHEDRON_PRIMAL_VERTICES.length &&
    childDerivationTable.length === EXPECTED_CHILD_COUNT &&
    phaseMergeAudit.length === EXPECTED_CHILD_COUNT;

  return {
    reportId: `${METHOD}:one-ambo-tetrahedron`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    sourcePolicyId: SOURCE_POLICY_ID,
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    profileSystem,
    primalScalarVariationAudit,
    childDerivationTable,
    childSignatureReadinessAudit,
    phaseMergeAudit,
    childScalarDistinctivenessAudit,
    structuralContractStatus,
    provingFixtureUsefulnessStatus,
    provingEventSignatureStatus,
    humanLegibilityStatus,
    diagnosticOk,
    ok: diagnosticOk,
    issueCount: issues.length,
    issues,
    sourceReports: {
      profileAssignmentOk: fixture.profileAssignmentReport.ok,
      childDegeneracyOk: fixture.childDegeneracyReport.ok,
      profileAwarePolicyOk: fixture.policyReport.ok,
      quarkChannelReportOkCount: fixture.quarkChannelReports.filter(
        (report) => report.ok,
      ).length,
      childDerivationReportCount: fixture.childDerivationReports.length,
      profileAwarePolicyIssueCount: fixture.policyReport.issueCount,
    },
  };
}

export function buildSourceSignatureContractAuditV0ComparisonReport(): SourceSignatureContractAuditV0ComparisonReport {
  const controlReport = buildSourceSignatureContractAuditV0Report();
  const provingCandidateReport =
    buildPythagoreanTetrachordQuarkRegimeV0Report();
  const fieldCueReport = buildFieldCueV0Report();
  const generatedSiteReadingReport = buildGeneratedSiteReadingV0Report();
  const expectedFailureStatus: SourceSignatureContractAuditV0ControlExpectedFailureStatus =
    controlReport.provingFixtureUsefulnessStatus === 'fail' &&
    controlReport.provingEventSignatureStatus === 'fail' &&
    controlReport.humanLegibilityStatus === 'misleading'
      ? 'failed-as-expected'
      : 'unexpected-pass';
  const candidateStatus: SourceSignatureContractAuditV0ProvingCandidateStatus =
    provingCandidateReport.structuralContractStatus === 'pass' &&
    provingCandidateReport.provingFixtureUsefulnessStatus === 'pass' &&
    provingCandidateReport.provingEventSignatureStatus === 'pass' &&
    provingCandidateReport.pairSumUniquenessAudit.pairSumUniquenessStatus ===
      'pass' &&
    provingCandidateReport.eventShellProvenance.eventShellProvenanceStatus ===
      'pass' &&
    provingCandidateReport.baseWaveNumberCalibration
      .baseWaveNumberCalibrationAuditStatus === 'pass' &&
    provingCandidateReport.childReadinessAudit.fieldReadyChildCount ===
      EXPECTED_CHILD_COUNT &&
    provingCandidateReport.childReadinessAudit.fallbackChildCount === 0 &&
    provingCandidateReport.childReadinessAudit.unresolvedChildCount === 0 &&
    provingCandidateReport.packetWriteStatus === PACKET_WRITE_STATUS &&
    provingCandidateReport.shapeMutationStatus === SHAPE_MUTATION_STATUS &&
    provingCandidateReport.topologyStatus === TOPOLOGY_STATUS &&
    provingCandidateReport.operationRegistryStatus === OPERATION_REGISTRY_STATUS
      ? 'pass'
      : 'fail';
  const issues = buildComparisonIssues({
    controlReport,
    provingCandidateReport,
    fieldCueReport,
    generatedSiteReadingReport,
    expectedFailureStatus,
    candidateStatus,
  });
  const gate2DownstreamSourceIntegrationStatus: SourceSignatureContractAuditV0Gate2Status =
    pickGate2DownstreamSourceIntegrationStatus({
      fieldCueReport,
      generatedSiteReadingReport,
    });
  const comparisonStatus: SourceSignatureContractAuditV0ComparisonStatus =
    expectedFailureStatus === 'failed-as-expected' &&
    candidateStatus === 'pass' &&
    gate2DownstreamSourceIntegrationStatus === 'pass' &&
    issues.length === 0
      ? 'pass'
      : 'fail';
  const gate1SourceSignatureProvingStatus: SourceSignatureContractAuditV0Gate1Status =
    comparisonStatus === 'pass' ? 'pass' : 'fail';

  return {
    reportId: `${METHOD}:comparison:uniform-control-vs-pythagorean-tetrachord`,
    method: 'source-signature-contract-audit-v0-comparison',
    diagnosticScope: DIAGNOSTIC_SCOPE,
    controlRegime: {
      controlRole: 'bad-control',
      report: controlReport,
      expectedFailureStatus,
    },
    provingCandidateRegime: {
      provingRegimeId: provingCandidateReport.provingRegimeId,
      report: provingCandidateReport,
      candidateStatus,
    },
    comparisonStatus,
    gate1SourceSignatureProvingStatus,
    gate2DownstreamSourceIntegrationStatus,
    downstreamSwitchStatus: 'field-cue-switched-generated-reading-inherits-v0',
    downstreamReports: {
      fieldCueOk: fieldCueReport.ok,
      generatedSiteReadingOk: generatedSiteReadingReport.ok,
      fieldCueCount: fieldCueReport.cueCount,
      generatedSiteReadingCount: generatedSiteReadingReport.readingCount,
      fieldReadyCueCount: fieldCueReport.cues.filter(
        (cue) =>
          cue.sourceSignatureProvenance.provingRegimeId ===
            provingCandidateReport.provingRegimeId &&
          cue.inheritanceAxis.inheritanceStatus === 'complete' &&
          cue.emittedSourceSignature.fieldReady,
      ).length,
      generatedFieldReadyReadingCount: generatedSiteReadingReport.readings.filter(
        (reading) =>
          reading.fieldWitness.sourceRegimeId ===
            provingCandidateReport.provingRegimeId &&
          reading.fieldWitness.sourceSignatureStatus === 'field-ready',
      ).length,
    },
    semanticStatus: SEMANTIC_STATUS,
    topologyStatus: TOPOLOGY_STATUS,
    packetWriteStatus: PACKET_WRITE_STATUS,
    shapeMutationStatus: SHAPE_MUTATION_STATUS,
    operationRegistryStatus: OPERATION_REGISTRY_STATUS,
    issueCount: issues.length,
    issues,
    ok: comparisonStatus === 'pass',
  };
}

function buildComparisonIssues(args: {
  controlReport: SourceSignatureContractAuditV0Report;
  provingCandidateReport: PythagoreanTetrachordQuarkRegimeV0Report;
  fieldCueReport: FieldCueV0Report;
  generatedSiteReadingReport: GeneratedSiteReadingV0Report;
  expectedFailureStatus: SourceSignatureContractAuditV0ControlExpectedFailureStatus;
  candidateStatus: SourceSignatureContractAuditV0ProvingCandidateStatus;
}): SourceSignatureContractAuditV0ComparisonIssue[] {
  const issues: SourceSignatureContractAuditV0ComparisonIssue[] = [];

  if (args.expectedFailureStatus !== 'failed-as-expected') {
    issues.push({
      code: 'uniform-control-did-not-fail-as-expected',
      message:
        'Uniform-circle control must remain represented as the scalar-invariant bad control.',
      details: {
        provingFixtureUsefulnessStatus:
          args.controlReport.provingFixtureUsefulnessStatus,
        provingEventSignatureStatus:
          args.controlReport.provingEventSignatureStatus,
        humanLegibilityStatus: args.controlReport.humanLegibilityStatus,
      },
    });
  }

  if (args.candidateStatus !== 'pass') {
    issues.push({
      code: 'pythagorean-proving-candidate-failed',
      message:
        'Pythagorean tetrachord proving candidate did not pass all Gate 1 source-signature requirements.',
      details: {
        structuralContractStatus:
          args.provingCandidateReport.structuralContractStatus,
        provingFixtureUsefulnessStatus:
          args.provingCandidateReport.provingFixtureUsefulnessStatus,
        provingEventSignatureStatus:
          args.provingCandidateReport.provingEventSignatureStatus,
        issueCount: args.provingCandidateReport.issueCount,
      },
    });
  }

  if (
    args.provingCandidateReport.baseWaveNumberCalibration
      .baseWaveNumberCalibrationStatus !== 'human-specified-v0'
  ) {
    issues.push({
      code: 'base-wave-number-calibration-not-human-specified',
      message:
        'Gate 1 requires the human-specified 1:8 edge/wavelength calibration.',
    });
  }

  if (
    args.provingCandidateReport.shellScalingApplication !== 'record-only-v0' ||
    args.provingCandidateReport.eventShellProvenance.shellScalingApplication !==
      'record-only-v0'
  ) {
    issues.push({
      code: 'shell-scaling-not-record-only',
      message:
        'Gate 1 records tetrahedron to midpoint-octahedron shell provenance but does not apply shell scaling to emitted tuples.',
    });
  }

  if (
    pickGate2DownstreamSourceIntegrationStatus({
      fieldCueReport: args.fieldCueReport,
      generatedSiteReadingReport: args.generatedSiteReadingReport,
    }) !== 'pass'
  ) {
    issues.push({
      code: 'gate-2-downstream-source-integration-failed',
      message:
        'FieldCueV0 and GeneratedSiteReadingV0 did not both expose field-ready Pythagorean source-signature provenance.',
      details: {
        fieldCueOk: args.fieldCueReport.ok,
        generatedSiteReadingOk: args.generatedSiteReadingReport.ok,
        fieldCueCount: args.fieldCueReport.cueCount,
        generatedSiteReadingCount:
          args.generatedSiteReadingReport.readingCount,
      },
    });
  }

  return issues;
}

function pickGate2DownstreamSourceIntegrationStatus(args: {
  fieldCueReport: FieldCueV0Report;
  generatedSiteReadingReport: GeneratedSiteReadingV0Report;
}): SourceSignatureContractAuditV0Gate2Status {
  const fieldCueReady =
    args.fieldCueReport.ok &&
    args.fieldCueReport.sourcePolicyId ===
      'pythagorean-tetrachord-quark-proving-policy-v0' &&
    args.fieldCueReport.sourceSignatureProvenance.provingRegimeId ===
      'pythagorean-tetrachord-quark-regime-v0' &&
    args.fieldCueReport.cueCount === EXPECTED_CHILD_COUNT &&
    args.fieldCueReport.cues.every(
      (cue) =>
        cue.sourceSignatureProvenance.provingRegimeId ===
          'pythagorean-tetrachord-quark-regime-v0' &&
        cue.inheritanceAxis.inheritanceStatus === 'complete' &&
        cue.emittedSourceSignature.fieldReady &&
        cue.sourceSignatureProvenance.childWaveNumberShellScalingApplied ===
          false &&
        cue.sourceSignatureProvenance.childAttenuationShellScalingApplied ===
          false,
    );
  const generatedReadingReady =
    args.generatedSiteReadingReport.ok &&
    args.generatedSiteReadingReport.readingCount === EXPECTED_CHILD_COUNT &&
    args.generatedSiteReadingReport.readings.every(
      (reading) =>
        reading.fieldWitness.sourceRegimeId ===
          'pythagorean-tetrachord-quark-regime-v0' &&
        reading.fieldWitness.sourceSignatureStatus === 'field-ready' &&
        reading.fieldWitness.fieldInheritanceStatus === 'complete',
    );

  return fieldCueReady && generatedReadingReady ? 'pass' : 'fail';
}

function buildFixture(): SourceSignatureContractAuditV0Fixture {
  const profileSystem = createUniformCirclePrimalProfileSystemFixture();
  const profiles = generateFieldSourceProfiles(profileSystem);
  const assignments = createTetrahedronPrimalProfileAssignmentFixture(profiles);
  const setup = createTetrahedronFieldSourceProfileSetupFixture(
    profileSystem,
    assignments,
  );
  const profileAssignmentReport = buildPrimalProfileAssignmentDiagnosticReport({
    profileSystem,
    setup,
    activePrimalVertexIds: [...ACTIVE_TETRAHEDRON_PRIMAL_VERTICES],
    generatedProfiles: profiles,
  });
  const profileById = new Map(profiles.map((profile) => [profile.profileId, profile]));
  const profileByVertexId = new Map<string, FieldSourceProfile>();

  for (const assignment of assignments) {
    const profile = profileById.get(assignment.profileId);

    if (profile) {
      profileByVertexId.set(assignment.vertexId, profile);
    }
  }

  const childContexts = buildTetrahedralAmboChildContexts([
    ...ACTIVE_TETRAHEDRON_PRIMAL_VERTICES,
  ]);
  const quarkChannelReports = childContexts.map((childContext) =>
    buildTetrahedralQuarkChannelReport({
      childContext,
      profileByVertexId,
    }),
  );
  const childDerivationReports = childContexts.map((childContext, index) =>
    buildTetrahedralChildSourceProfileDerivationReport({
      childContext,
      quarkChannelReport: quarkChannelReports[index],
    }),
  );
  const childDegeneracyReport = buildTetrahedralChildProfileDegeneracyReport({
    childContexts,
    derivationReports: childDerivationReports,
  });
  const policyReport = buildProfileAwareFieldSourcePolicyDiagnosticReport({
    profileAssignmentReport,
    childContexts,
    childDerivationReports,
    childDegeneracyReport,
  });

  return {
    profileSystem,
    profiles,
    profileAssignmentReport,
    childContexts,
    quarkChannelReports,
    childDerivationReports,
    childDegeneracyReport,
    policyReport,
  };
}

function buildProfileSystemSection(
  fixture: SourceSignatureContractAuditV0Fixture,
): SourceSignatureContractAuditV0ProfileSystemSection {
  const profileById = new Map(
    fixture.profiles.map((profile) => [profile.profileId, profile]),
  );
  const assignmentByVertexId = new Map(
    fixture.profileAssignmentReport.activePrimalVertexIds.map((vertexId) => {
      const assignedSource = fixture.profileAssignmentReport.assignedSources.find(
        (source) => source.vertexId === vertexId,
      );

      return [vertexId, assignedSource?.profileId] as const;
    }),
  );

  return {
    profileSystemId: fixture.profileSystem.systemId,
    profileCount: fixture.profileSystem.profileCount,
    baseAmplitude: fixture.profileSystem.baseAmplitude,
    baseWaveNumber: fixture.profileSystem.baseWaveNumber,
    baseAttenuation: fixture.profileSystem.baseAttenuation,
    phaseOrigin: fixture.profileSystem.phaseOrigin,
    phaseArrangement: fixture.profileSystem.phaseArrangement,
    profileSlots: [...ACTIVE_TETRAHEDRON_PRIMAL_VERTICES].map((vertexId) => {
      const profileId = assignmentByVertexId.get(vertexId) ?? 'missing-profile';
      const profile = profileById.get(profileId);

      return {
        vertexId,
        profileId,
        amplitude: profile?.amplitude ?? Number.NaN,
        waveNumber: profile?.waveNumber ?? Number.NaN,
        phase: profile?.phase ?? Number.NaN,
        attenuation: profile?.attenuation ?? Number.NaN,
      };
    }),
  };
}

function buildPrimalScalarVariationAudit(
  profileSlots: SourceSignatureContractAuditV0ProfileSlot[],
): SourceSignatureContractAuditV0PrimalScalarVariationAudit {
  const amplitudeUniqueCount = uniqueNumericCount(
    profileSlots.map((slot) => slot.amplitude),
  );
  const waveNumberUniqueCount = uniqueNumericCount(
    profileSlots.map((slot) => slot.waveNumber),
  );
  const attenuationUniqueCount = uniqueNumericCount(
    profileSlots.map((slot) => slot.attenuation),
  );
  const phaseUniqueCount = uniqueNumericCount(profileSlots.map((slot) => slot.phase));
  const scalarVariationStatus: SourceSignatureContractAuditV0ScalarVariationStatus =
    amplitudeUniqueCount === 1 &&
    waveNumberUniqueCount === 1 &&
    attenuationUniqueCount === 1
      ? 'scalar-invariant'
      : 'nontrivial';

  return {
    amplitudeUniqueCount,
    waveNumberUniqueCount,
    attenuationUniqueCount,
    phaseUniqueCount,
    scalarVariationStatus,
    ...(scalarVariationStatus === 'scalar-invariant'
      ? {
          scalarVariationWarning:
            'Primal scalar values are invariant; child scalar signatures cannot distinguish sites under this fixture.',
        }
      : {}),
  };
}

function buildChildDerivationRow(args: {
  context: TetrahedralAmboChildContext;
  derivationReport: FieldChildSourceProfileDerivationReport | undefined;
  quarkChannelReport: TetrahedralQuarkChannelReport | undefined;
  policySource: ProfileAwareSourceEntry | undefined;
}): SourceSignatureContractAuditV0ChildDerivationRow {
  const derivation = args.derivationReport?.derivation;
  const channels = derivation?.quarkChannels ?? args.quarkChannelReport?.quarkChannels ?? [];

  return {
    childId: args.context.childVertexId,
    sourceEdgeId: args.context.sourceEdgeId,
    complementEdgeId: args.context.complementEdgeId,
    antipodalChildId: args.context.antipodalChildVertexId,
    projectionVertexIds: [...args.context.projectionVertexIds],
    channelPairs: channels.map(formatChannelPair),
    channelTuples: channels.map((channel) => ({
      channelId: channel.channelId,
      pair: formatChannelPair(channel),
      parentVertexId: channel.parent60,
      projectionVertexId: channel.projection30,
      tuple: copyTuple(channel.channelParameters),
    })),
    ...(derivation?.derivedParameters
      ? { derivedTuple: copyTuple(derivation.derivedParameters) }
      : {}),
    ...(derivation?.fallback?.fallbackKind
      ? { fallbackKind: derivation.fallback.fallbackKind }
      : {}),
    ...(derivation?.fallback?.reason ? { fallbackReason: derivation.fallback.reason } : {}),
    localDerivationStatus: derivation?.localStatus ?? 'missing-derivation',
    fieldReadyStatus: args.policySource?.readiness ?? 'missing-policy-source',
    fieldReady: args.policySource?.readiness === 'field-ready',
  };
}

function buildChildSignatureReadinessAudit(
  rows: SourceSignatureContractAuditV0ChildDerivationRow[],
): SourceSignatureContractAuditV0ChildSignatureReadinessAudit {
  const derivedChildCount = rows.filter((row) => row.derivedTuple).length;
  const fallbackChildCount = rows.filter(
    (row) =>
      row.fallbackKind ||
      row.localDerivationStatus === 'fallback-used' ||
      row.localDerivationStatus === 'undefined-circular-mean',
  ).length;
  const unresolvedChildCount = rows.filter(
    (row) => !row.derivedTuple && !row.fallbackKind,
  ).length;
  const fieldReadyChildCount = rows.filter((row) => row.fieldReady).length;
  const nonFieldReadyChildCount = EXPECTED_CHILD_COUNT - fieldReadyChildCount;
  const childReadinessStatus: SourceSignatureContractAuditV0ChildReadinessStatus =
    fieldReadyChildCount === EXPECTED_CHILD_COUNT
      ? 'all-field-ready'
      : fallbackChildCount > 0 || derivedChildCount > 0
        ? 'partial-fallback'
        : 'failed';

  return {
    expectedChildCount: EXPECTED_CHILD_COUNT,
    derivedChildCount,
    fallbackChildCount,
    unresolvedChildCount,
    fieldReadyChildCount,
    nonFieldReadyChildCount,
    childReadinessStatus,
  };
}

function buildPhaseMergeAudit(
  rows: SourceSignatureContractAuditV0ChildDerivationRow[],
): SourceSignatureContractAuditV0PhaseMergeRow[] {
  return rows.map((row) => {
    const circularMergeStatus = pickCircularMergeStatus(row);

    return {
      childId: row.childId,
      channelPhases: row.channelTuples.map((channel) => channel.tuple.phase),
      circularMergeStatus,
      ...(circularMergeStatus === 'undefined-circular-mean'
        ? {
            explanation:
              'Four-channel phase circular mean cancelled under the current symmetric profile fixture.',
          }
        : {}),
    };
  });
}

function buildChildScalarDistinctivenessAudit(
  rows: SourceSignatureContractAuditV0ChildDerivationRow[],
): SourceSignatureContractAuditV0ChildScalarDistinctivenessAudit {
  const derivedTuples = rows
    .map((row) => row.derivedTuple)
    .filter((tuple): tuple is SourceSignatureContractAuditV0Tuple => Boolean(tuple));

  if (derivedTuples.length === 0) {
    return {
      uniqueAmplitudeCount: 0,
      uniqueWaveNumberCount: 0,
      uniqueAttenuationCount: 0,
      uniquePhaseCount: 0,
      childScalarDistinctivenessStatus: 'not-applicable',
    };
  }

  const uniqueAmplitudeCount = uniqueNumericCount(
    derivedTuples.map((tuple) => tuple.amplitude),
  );
  const uniqueWaveNumberCount = uniqueNumericCount(
    derivedTuples.map((tuple) => tuple.waveNumber),
  );
  const uniqueAttenuationCount = uniqueNumericCount(
    derivedTuples.map((tuple) => tuple.attenuation),
  );
  const uniquePhaseCount = uniqueNumericCount(derivedTuples.map((tuple) => tuple.phase));
  const childScalarDistinctivenessStatus: SourceSignatureContractAuditV0ChildScalarDistinctivenessStatus =
    uniqueAmplitudeCount === 1 &&
    uniqueWaveNumberCount === 1 &&
    uniqueAttenuationCount === 1
      ? 'scalar-invariant'
      : 'nontrivial';

  return {
    uniqueAmplitudeCount,
    uniqueWaveNumberCount,
    uniqueAttenuationCount,
    uniquePhaseCount,
    childScalarDistinctivenessStatus,
    ...(childScalarDistinctivenessStatus === 'scalar-invariant'
      ? {
          warning:
            'Child scalar signatures are invariant because the primal scalar fixture is invariant.',
        }
      : {}),
  };
}

function pickStructuralContractStatus(
  fixture: SourceSignatureContractAuditV0Fixture,
  rows: SourceSignatureContractAuditV0ChildDerivationRow[],
): SourceSignatureContractAuditV0StructuralContractStatus {
  const finiteProfiles = fixture.profiles.every((profile) =>
    [profile.amplitude, profile.waveNumber, profile.phase, profile.attenuation].every(
      Number.isFinite,
    ),
  );
  const contextStructureAvailable = fixture.childContexts.every(
    (context) =>
      context.sourceEdgeId &&
      context.complementEdgeId &&
      context.antipodalChildVertexId &&
      context.projectionVertexIds.length === 2,
  );
  const quarkChannelsAvailable = fixture.quarkChannelReports.every(
    (report) => report.ok && report.channelCount === 4,
  );
  const derivationRecordsAvailable =
    rows.length === EXPECTED_CHILD_COUNT &&
    rows.every((row) => row.localDerivationStatus !== 'missing-derivation');

  return fixture.profileAssignmentReport.ok &&
    finiteProfiles &&
    fixture.childContexts.length === EXPECTED_CHILD_COUNT &&
    contextStructureAvailable &&
    quarkChannelsAvailable &&
    derivationRecordsAvailable
    ? 'pass'
    : 'fail';
}

function pickProvingFixtureUsefulnessStatus(args: {
  childSignatureReadinessAudit: SourceSignatureContractAuditV0ChildSignatureReadinessAudit;
  childScalarDistinctivenessAudit: SourceSignatureContractAuditV0ChildScalarDistinctivenessAudit;
  phaseMergeAudit: SourceSignatureContractAuditV0PhaseMergeRow[];
}): SourceSignatureContractAuditV0ProvingFixtureUsefulnessStatus {
  const hasFallback = args.childSignatureReadinessAudit.fallbackChildCount > 0;
  const hasMissingSignature =
    args.childSignatureReadinessAudit.fieldReadyChildCount !== EXPECTED_CHILD_COUNT;
  const childScalarsInvariant =
    args.childScalarDistinctivenessAudit.childScalarDistinctivenessStatus ===
    'scalar-invariant';
  const hasPhaseCancellation = args.phaseMergeAudit.some(
    (row) => row.circularMergeStatus === 'undefined-circular-mean',
  );

  return hasFallback || hasMissingSignature || childScalarsInvariant || hasPhaseCancellation
    ? 'fail'
    : 'pass';
}

function pickHumanLegibilityStatus(args: {
  primalScalarVariationAudit: SourceSignatureContractAuditV0PrimalScalarVariationAudit;
  childScalarDistinctivenessAudit: SourceSignatureContractAuditV0ChildScalarDistinctivenessAudit;
  childSignatureReadinessAudit: SourceSignatureContractAuditV0ChildSignatureReadinessAudit;
  phaseMergeAudit: SourceSignatureContractAuditV0PhaseMergeRow[];
}): SourceSignatureContractAuditV0HumanLegibilityStatus {
  const misleading =
    args.primalScalarVariationAudit.scalarVariationStatus === 'scalar-invariant' ||
    args.childScalarDistinctivenessAudit.childScalarDistinctivenessStatus ===
      'scalar-invariant' ||
    args.childSignatureReadinessAudit.nonFieldReadyChildCount > 0 ||
    args.phaseMergeAudit.some(
      (row) => row.circularMergeStatus === 'undefined-circular-mean',
    );

  if (misleading) {
    return 'misleading';
  }

  return args.childSignatureReadinessAudit.fieldReadyChildCount === EXPECTED_CHILD_COUNT
    ? 'useful'
    : 'weak';
}

function buildIssues(args: {
  primalScalarVariationAudit: SourceSignatureContractAuditV0PrimalScalarVariationAudit;
  childDerivationTable: SourceSignatureContractAuditV0ChildDerivationRow[];
  childSignatureReadinessAudit: SourceSignatureContractAuditV0ChildSignatureReadinessAudit;
  phaseMergeAudit: SourceSignatureContractAuditV0PhaseMergeRow[];
  childScalarDistinctivenessAudit: SourceSignatureContractAuditV0ChildScalarDistinctivenessAudit;
  provingFixtureUsefulnessStatus: SourceSignatureContractAuditV0ProvingFixtureUsefulnessStatus;
  humanLegibilityStatus: SourceSignatureContractAuditV0HumanLegibilityStatus;
}): SourceSignatureContractAuditV0Issue[] {
  const issues: SourceSignatureContractAuditV0Issue[] = [];

  if (args.primalScalarVariationAudit.scalarVariationStatus === 'scalar-invariant') {
    issues.push({
      code: 'primal-scalar-invariance',
      message:
        args.primalScalarVariationAudit.scalarVariationWarning ??
        'Primal scalar values are invariant.',
    });
  }

  for (const row of args.childDerivationTable) {
    if (row.fallbackKind) {
      issues.push({
        code: 'child-signature-fallback',
        message: `Child ${row.childId} has no field-ready derived source signature because derivation fell back.`,
        childId: row.childId,
        details: {
          fallbackKind: row.fallbackKind,
          fallbackReason: row.fallbackReason ?? null,
        },
      });
    } else if (!row.derivedTuple) {
      issues.push({
        code: 'child-signature-unresolved',
        message: `Child ${row.childId} has no resolved source signature.`,
        childId: row.childId,
      });
    }
  }

  for (const row of args.phaseMergeAudit) {
    if (row.circularMergeStatus === 'undefined-circular-mean') {
      issues.push({
        code: 'phase-circular-mean-cancellation',
        message:
          row.explanation ??
          'Four-channel phase circular mean cancelled under the current fixture.',
        childId: row.childId,
      });
    }
  }

  if (
    args.childScalarDistinctivenessAudit.childScalarDistinctivenessStatus ===
    'scalar-invariant'
  ) {
    issues.push({
      code: 'child-scalar-invariance',
      message:
        args.childScalarDistinctivenessAudit.warning ??
        'Child scalar signatures are invariant.',
      details: {
        uniqueAmplitudeCount:
          args.childScalarDistinctivenessAudit.uniqueAmplitudeCount,
        uniqueWaveNumberCount:
          args.childScalarDistinctivenessAudit.uniqueWaveNumberCount,
        uniqueAttenuationCount:
          args.childScalarDistinctivenessAudit.uniqueAttenuationCount,
      },
    });
  }

  if (args.provingFixtureUsefulnessStatus === 'fail') {
    issues.push({
      code: 'proving-fixture-not-useful',
      message:
        'The current source-signature fixture is not useful for the one-Ambo tetrahedron proving event.',
      details: {
        fieldReadyChildCount:
          args.childSignatureReadinessAudit.fieldReadyChildCount,
        expectedChildCount: args.childSignatureReadinessAudit.expectedChildCount,
        fallbackChildCount: args.childSignatureReadinessAudit.fallbackChildCount,
      },
    });
  }

  if (args.humanLegibilityStatus === 'misleading') {
    issues.push({
      code: 'misleading-signature-ui-risk',
      message:
        'Human-facing UI may display fixture constants such as frequency pi as if they were meaningful source-signature distinctions.',
    });
  }

  return issues;
}

function pickCircularMergeStatus(
  row: SourceSignatureContractAuditV0ChildDerivationRow,
): SourceSignatureContractAuditV0CircularMergeStatus {
  if (row.localDerivationStatus === 'derived') {
    return 'derived';
  }

  if (row.localDerivationStatus === 'undefined-circular-mean') {
    return 'undefined-circular-mean';
  }

  return 'fallback';
}

function copyTuple(
  tuple: FieldSourceEmissionParameters,
): SourceSignatureContractAuditV0Tuple {
  return {
    amplitude: tuple.amplitude,
    waveNumber: tuple.waveNumber,
    phase: tuple.phase,
    attenuation: tuple.attenuation,
  };
}

function formatChannelPair(channel: QuarkChannelRecord): string {
  return `${channel.parent60}/${channel.projection30}`;
}

function uniqueNumericCount(values: number[]): number {
  return new Set(values.map(formatNumericKey)).size;
}

function formatNumericKey(value: number): string {
  return Number.isFinite(value) ? value.toFixed(12) : String(value);
}
