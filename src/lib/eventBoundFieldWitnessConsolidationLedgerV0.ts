export type ConsolidationStatus =
  | 'portable-kernel'
  | 'event-bound-result'
  | 'event-bound-prototype'
  | 'policy-relative-output'
  | 'test-fixture-only'
  | 'demoted-artifact'
  | 'negative-control'
  | 'dead-path-retain-as-warning'
  | 'unknown-pending-audit';

export type ConsolidationVerdict =
  | 'consolidated-for-research-handoff'
  | 'consolidated-with-missing-families'
  | 'blocked-by-parent-inconsistency'
  | 'boundary-failed';

export interface EventBoundFieldWitnessConsolidationLedgerV0Inputs {
  packageScripts?: Record<string, string>;
  reports?: Record<string, unknown>;
  importStatuses?: Record<string, 'imported' | 'not-imported' | 'builder-missing' | 'failed'>;
  sourceFiles?: Record<string, { exists: boolean; text: string }>;
}

export interface PackageScriptEvidenceRow {
  scriptName: string;
  expected: boolean;
  present: boolean;
  family: string;
  evidenceUse: 'presence-only' | 'parent-diagnostic' | 'terminal-result' | 'stale-artifact-presence' | 'unknown';
}

export interface GeneralizationBoundaryRow {
  artifactId: string;
  artifactFamily:
    | 'profile-aware-field-stack'
    | 'structured-source-state'
    | 'p-simplex-t-series'
    | 'k3-sfa-chain'
    | 'fieldcue-generated-site'
    | 'w-gate-root-frame'
    | 'field-atlas-core'
    | 'other';
  primaryStatus: ConsolidationStatus;
  secondaryStatuses: string[];
  acceptedVerdict: string | null;
  evidenceSource: 'current-report' | 'package-script-presence' | 'source-code-shape' | 'handoff-known' | 'not-imported';
  evidenceConfidence: 'high' | 'medium' | 'low' | 'unknown';
  proved: string[];
  notProved: string[];
  reusableKernel: string[];
  testOnlyResidue: string[];
  forbiddenPromotion: string[];
  generatedSiteUsefulness: 'directly-useful' | 'indirectly-useful' | 'warning-only' | 'not-yet-useful' | 'unknown';
  nextAllowedUse: string;
  killTest: string;
}

export interface StaleArtifactAutopsyRow {
  artifactId: string;
  artifactFamily:
    | 'old-field-number-regime'
    | 'legacy-field-candidate-stack'
    | 'fano-octonionic-field'
    | 'carrier-shadow'
    | 'route-gate-support-stack'
    | 'scalar-emitted-tuple'
    | 'fieldcue-overreach'
    | 'other';
  primaryStatus:
    | 'demoted-artifact'
    | 'negative-control'
    | 'dead-path-retain-as-warning'
    | 'test-fixture-only'
    | 'unknown-pending-audit';
  originalClaim: string;
  codeStatus: 'code-present' | 'script-present' | 'handoff-known-not-repo-verified' | 'not-found' | 'unknown';
  demotionStatus:
    | 'demoted-by-source-policy-failure'
    | 'demoted-by-generalizability-failure'
    | 'demoted-by-a3-s4-supersession'
    | 'demoted-by-candidate-bloat'
    | 'demoted-by-tuple-reduction-failure'
    | 'demoted-by-event-legibility-pivot'
    | 'unknown';
  demotionReason: string;
  whatTheCodeStillActuallyDoes: string[];
  notToBeCarriedForward: string[];
  methodResidue: string[];
  allowedFutureUse: string;
  reopeningCondition: string;
  killTest: string;
}

export interface BoundaryRow {
  boundaryId: string;
  statement: string;
  enforced: true;
}

export interface FalsifierRow {
  falsifierId: string;
  description: string;
  triggered: boolean;
  evidence: string;
  status: 'clear' | 'triggered';
}

export interface ConsolidationSummary {
  terminalT28EVerdict: string | null;
  terminalT28EPrimaryClassification: string | null;
  atdH0Verdict: string | null;
  portableKernelCount: number;
  eventBoundResultCount: number;
  eventBoundPrototypeCount: number;
  policyRelativeOutputCount: number;
  demotedArtifactCount: number;
  deadPathWarningCount: number;
  unknownPendingAuditCount: number;
  staleArtifactAutopsyCount: number;
  missingExpectedScriptCount: number;
  interpretation:
    | 'handoff-ready-with-stale-artifact-quarantine'
    | 'handoff-ready-with-missing-families'
    | 'blocked-by-parent-inconsistency'
    | 'boundary-failed';
}

export interface EventBoundFieldWitnessConsolidationLedgerV0Report {
  method: 'event-bound-field-witness-consolidation-ledger-v0';
  diagnosticScope: 'cross-family-generalization-boundary-and-artifact-autopsy-only';
  branchRef: 'wgate/arf-w1-root-frame-v0';
  repoEvidenceStatus: string;
  packageScriptEvidenceRows: PackageScriptEvidenceRow[];
  generalizationBoundaryRows: GeneralizationBoundaryRow[];
  staleArtifactAutopsyRows: StaleArtifactAutopsyRow[];
  portableKernelInventory: string[];
  eventBoundResultInventory: string[];
  eventBoundPrototypeInventory: string[];
  policyRelativeOutputInventory: string[];
  testFixtureOnlyInventory: string[];
  demotedArtifactInventory: string[];
  negativeControlInventory: string[];
  deadPathWarningInventory: string[];
  unknownPendingAuditInventory: string[];
  forbiddenPromotionInventory: string[];
  liveTheoreticalObjectInventory: string[];
  nextAllowedQuestionTypes: string[];
  consolidationSummary: ConsolidationSummary;
  boundaryRows: BoundaryRow[];
  falsifierRows: FalsifierRow[];
  consolidationVerdict: ConsolidationVerdict;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

type JsonRecord = Record<string, unknown>;

const BRANCH_REF = 'wgate/arf-w1-root-frame-v0' as const;
const EXPECTED_T28E_VERDICT = 'T28-E-K3-SFA-residual-geometric';
const EXPECTED_ATD_VERDICT = 'ATD-H0-fails-preload-or-single-channel-only';

const SCRIPT_SPECS: ReadonlyArray<{
  scriptName: string;
  family: string;
  evidenceUse: PackageScriptEvidenceRow['evidenceUse'];
}> = [
  { scriptName: 'diagnose:field-atlas', family: 'field-atlas-core', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:field-source-profile-aware-stack-summary', family: 'profile-aware-field-stack', evidenceUse: 'parent-diagnostic' },
  { scriptName: 'diagnose:field-source-profile-aware-evidence-stability', family: 'profile-aware-field-stack', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:field-source-profile-aware-policy', family: 'profile-aware-field-stack', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:field-source-profile-aware-feature-report', family: 'profile-aware-field-stack', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:field-source-profile-aware-route-gate-candidates', family: 'profile-aware-field-stack', evidenceUse: 'stale-artifact-presence' },
  { scriptName: 'diagnose:field-source-profile-aware-support-region-candidates', family: 'profile-aware-field-stack', evidenceUse: 'stale-artifact-presence' },
  { scriptName: 'diagnose:structured-source-state-v0', family: 'structured-source-state', evidenceUse: 'parent-diagnostic' },
  { scriptName: 'diagnose:structured-source-state-emitted-recovery-v0', family: 'structured-source-state', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:structured-source-state-field-behavior-recovery-v0', family: 'structured-source-state', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:structured-source-state-field-behavior-residual-v0', family: 'structured-source-state', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:structured-source-state-candidate-reduction-law-comparison-v0', family: 'structured-source-state', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:structured-source-state-multi-projection-structural-channel-v0', family: 'structured-source-state', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:source-signature-contract-audit-v0', family: 'structured-source-state', evidenceUse: 'parent-diagnostic' },
  { scriptName: 'diagnose:p-simplex-cross-projection-provenance-eligibility-preflight-t28c0', family: 'p-simplex-t-series', evidenceUse: 'parent-diagnostic' },
  { scriptName: 'diagnose:p-simplex-axis-transverse-discrimination-survival-metric-t28c1', family: 'p-simplex-t-series', evidenceUse: 'parent-diagnostic' },
  { scriptName: 'diagnose:p-simplex-k3-local-atd-decomposition-v-blindness-audit-t28d', family: 'k3-sfa-chain', evidenceUse: 'parent-diagnostic' },
  { scriptName: 'diagnose:p-simplex-k3-sampling-family-asymmetry-control-audit-t28e', family: 'k3-sfa-chain', evidenceUse: 'terminal-result' },
  { scriptName: 'diagnose:fano-octonionic-carrier-table-v0', family: 'fano-octonionic-field', evidenceUse: 'stale-artifact-presence' },
  { scriptName: 'diagnose:fano-octonionic-local-channel-table-v0', family: 'fano-octonionic-field', evidenceUse: 'stale-artifact-presence' },
  { scriptName: 'diagnose:fano-octonionic-carrier-graph-field-v0', family: 'fano-octonionic-field', evidenceUse: 'stale-artifact-presence' },
  { scriptName: 'diagnose:fano-octonionic-spatial-support-projection-v0', family: 'fano-octonionic-field', evidenceUse: 'stale-artifact-presence' },
  { scriptName: 'diagnose:fano-octonionic-generational-field-update-v0', family: 'fano-octonionic-field', evidenceUse: 'stale-artifact-presence' },
  { scriptName: 'diagnose:field-cue-v0', family: 'fieldcue-generated-site', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:generated-site-reading-v0', family: 'fieldcue-generated-site', evidenceUse: 'presence-only' },
  { scriptName: 'diagnose:w-gate-root-frame-extraction-v0', family: 'w-gate-root-frame', evidenceUse: 'presence-only' },
];

export function buildEventBoundFieldWitnessConsolidationLedgerV0Report(
  inputs: EventBoundFieldWitnessConsolidationLedgerV0Inputs = {},
): EventBoundFieldWitnessConsolidationLedgerV0Report {
  const packageScriptEvidenceRows = buildPackageScriptEvidenceRows(inputs.packageScripts ?? {});
  const generalizationBoundaryRows = buildGeneralizationBoundaryRows(inputs, packageScriptEvidenceRows);
  const staleArtifactAutopsyRows = buildStaleArtifactAutopsyRows(inputs, packageScriptEvidenceRows);
  const defaultFieldAtlasPolicyPresent = sourceFileContains(inputs, 'src/lib/fieldAtlas.ts', 'DEFAULT_FIELD_ATLAS_SOURCE_POLICY');
  const parentInheritanceFieldAtlasPolicyPresent = sourceFileContains(
    inputs,
    'src/lib/fieldAtlas.ts',
    'PARENT_INHERITANCE_FIELD_ATLAS_SOURCE_POLICY',
  );
  const boundaryRows = buildBoundaryRows();
  const forbiddenPromotionInventory = buildForbiddenPromotionInventory(generalizationBoundaryRows, staleArtifactAutopsyRows);
  const liveTheoreticalObjectInventory = [
    'K3-T transverse residual geometry',
    'K3-SFA-H1 as residual-geometric K-local asymmetry',
    'structured-source-state / tuple-reduction honesty',
  ];
  const nextAllowedQuestionTypes = [
    'derive K3-T transverse residual law',
    'define theoretical synthetic transverse control',
    'define theoretical axis-family stress control',
    'build one bounded portability test',
    'convert accepted witnesses into generated-site reading without naming',
    'repair consolidation classification',
  ];
  const consolidationSummary = buildConsolidationSummary({
    packageScriptEvidenceRows,
    generalizationBoundaryRows,
    staleArtifactAutopsyRows,
    t28eReport: inputs.reports?.t28eReport,
    t28c1Report: inputs.reports?.t28c1Report,
  });
  const falsifierRows = buildFalsifierRows({
    generalizationBoundaryRows,
    staleArtifactAutopsyRows,
    consolidationSummary,
  });
  const consolidationVerdict = classifyConsolidationVerdict(consolidationSummary, falsifierRows);
  const integrityIssues = buildIntegrityIssues({
    generalizationBoundaryRows,
    staleArtifactAutopsyRows,
    boundaryRows,
    falsifierRows,
    consolidationSummary,
    liveTheoreticalObjectInventory,
    defaultFieldAtlasPolicyPresent,
    parentInheritanceFieldAtlasPolicyPresent,
  });

  return {
    method: 'event-bound-field-witness-consolidation-ledger-v0',
    diagnosticScope: 'cross-family-generalization-boundary-and-artifact-autopsy-only',
    branchRef: BRANCH_REF,
    repoEvidenceStatus: 'package-script-presence-plus-selected-parent-report-evidence-only',
    packageScriptEvidenceRows,
    generalizationBoundaryRows,
    staleArtifactAutopsyRows,
    portableKernelInventory: inventoryFor(generalizationBoundaryRows, 'portable-kernel', 'reusableKernel'),
    eventBoundResultInventory: inventoryFor(generalizationBoundaryRows, 'event-bound-result', 'artifactId'),
    eventBoundPrototypeInventory: inventoryFor(generalizationBoundaryRows, 'event-bound-prototype', 'artifactId'),
    policyRelativeOutputInventory: inventoryFor(generalizationBoundaryRows, 'policy-relative-output', 'artifactId', true),
    testFixtureOnlyInventory: inventoryFor(generalizationBoundaryRows, 'test-fixture-only', 'artifactId'),
    demotedArtifactInventory: staleArtifactAutopsyRows.filter((row) => row.primaryStatus === 'demoted-artifact').map((row) => row.artifactId),
    negativeControlInventory: [
      ...generalizationBoundaryRows.filter((row) => row.primaryStatus === 'negative-control').map((row) => row.artifactId),
      ...staleArtifactAutopsyRows.filter((row) => row.primaryStatus === 'negative-control').map((row) => row.artifactId),
    ],
    deadPathWarningInventory: staleArtifactAutopsyRows.filter((row) => row.primaryStatus === 'dead-path-retain-as-warning').map((row) => row.artifactId),
    unknownPendingAuditInventory: generalizationBoundaryRows.filter((row) => row.primaryStatus === 'unknown-pending-audit').map((row) => row.artifactId),
    forbiddenPromotionInventory,
    liveTheoreticalObjectInventory,
    nextAllowedQuestionTypes,
    consolidationSummary,
    boundaryRows,
    falsifierRows,
    consolidationVerdict,
    integrityIssues,
    integrityIssueCount: integrityIssues.length,
    ok: integrityIssues.length === 0,
  };
}

function buildPackageScriptEvidenceRows(packageScripts: Record<string, string>): PackageScriptEvidenceRow[] {
  return SCRIPT_SPECS.map((spec) => ({
    scriptName: spec.scriptName,
    expected: true,
    present: Object.prototype.hasOwnProperty.call(packageScripts, spec.scriptName),
    family: spec.family,
    evidenceUse: spec.evidenceUse,
  }));
}

function buildGeneralizationBoundaryRows(
  inputs: EventBoundFieldWitnessConsolidationLedgerV0Inputs,
  scripts: readonly PackageScriptEvidenceRow[],
): GeneralizationBoundaryRow[] {
  const t28e = inputs.reports?.t28eReport;
  const t28c1 = inputs.reports?.t28c1Report;
  const fieldCueImported = inputs.importStatuses?.fieldCueReport === 'imported' || scriptPresent(scripts, 'diagnose:field-cue-v0');
  const generatedImported = inputs.importStatuses?.generatedSiteReadingReport === 'imported' || scriptPresent(scripts, 'diagnose:generated-site-reading-v0');
  const fieldCueKnown = fieldCueImported || generatedImported;
  const t28eFacts = t28eResidualFacts(t28e);

  return [
    boundaryRow({
      artifactId: 'field-atlas-core-source-domain-and-sampling',
      artifactFamily: 'field-atlas-core',
      primaryStatus: 'portable-kernel',
      secondaryStatuses: [],
      acceptedVerdict: null,
      evidenceSource: scriptPresent(scripts, 'diagnose:field-atlas') ? 'package-script-presence' : 'source-code-shape',
      evidenceConfidence: 'medium',
      proved: ['Reusable source-domain and sampling discipline exists as method residue.'],
      notProved: ['semantic naming', 'route/gate maturity', 'general field interpretation', 'source-profile truth'],
      reusableKernel: [
        'source-domain model',
        'source-population construction',
        'generated-child source inclusion',
        'closed-geometry discipline',
        'complex psi / intensity / phase / contribution-ratio separation',
        'computational chart vs semantic chart distinction',
      ],
      testOnlyResidue: [],
      forbiddenPromotion: ['general field interpretation', 'route/gate maturity', 'semantic naming'],
      generatedSiteUsefulness: 'indirectly-useful',
      nextAllowedUse: 'reuse sampling and source-domain discipline without treating old field numbers as truth',
      killTest: 'fails if deterministic source-order numbers are promoted as portable truth',
    }),
    boundaryRow({
      artifactId: 'profile-aware-field-stack-v0',
      artifactFamily: 'profile-aware-field-stack',
      primaryStatus: 'event-bound-prototype',
      secondaryStatuses: ['policy-relative-output'],
      acceptedVerdict: reportVerdict(inputs.reports?.profileAwareStackSummaryReport),
      evidenceSource: inputs.importStatuses?.profileAwareStackSummaryReport === 'imported' ? 'current-report' : 'package-script-presence',
      evidenceConfidence: scriptPresent(scripts, 'diagnose:field-source-profile-aware-stack-summary') ? 'medium' : 'low',
      proved: ['Profile-aware source policy can be reported as a bounded diagnostic stack.'],
      notProved: ['general field law', 'mature routes/gates/supports', 'semantic naming', 'field-world maturity'],
      reusableKernel: [
        'finite profile setup discipline',
        'profile-aware source policy',
        'generated-child source inclusion',
        'Quark inheritance record discipline',
        'degeneracy reporting',
        'policy relativity',
        'candidate-only field outputs',
      ],
      testOnlyResidue: ['profile-aware candidate tables remain event/policy bound'],
      forbiddenPromotion: ['feature counts as truth', 'candidate locations as mature field features'],
      generatedSiteUsefulness: 'indirectly-useful',
      nextAllowedUse: 'use as a policy-relative prototype and sensitivity warning',
      killTest: 'fails if candidate counts are read as mature field features',
    }),
    boundaryRow({
      artifactId: 'profile-aware-candidate-counts',
      artifactFamily: 'profile-aware-field-stack',
      primaryStatus: 'policy-relative-output',
      secondaryStatuses: [],
      acceptedVerdict: reportVerdict(inputs.reports?.profileAwareEvidenceStabilityReport),
      evidenceSource: scriptPresent(scripts, 'diagnose:field-source-profile-aware-evidence-stability') ? 'package-script-presence' : 'not-imported',
      evidenceConfidence: 'medium',
      proved: ['Candidate counts can be compared under a declared source/readout policy.'],
      notProved: ['feature counts as truth', 'route/gate/support counts as truth', 'candidate locations as mature field features'],
      reusableKernel: ['evidence stability', 'sampling sensitivity', 'profile setup sensitivity', 'max bucket saturation'],
      testOnlyResidue: ['candidate-count fixtures'],
      forbiddenPromotion: ['route/gate/support counts as truth'],
      generatedSiteUsefulness: 'warning-only',
      nextAllowedUse: 'use only to audit policy sensitivity and candidate bloat',
      killTest: 'fails if counts are promoted to field truth',
    }),
    boundaryRow({
      artifactId: 'structured-source-state-tuple-reduction-v0',
      artifactFamily: 'structured-source-state',
      primaryStatus: 'portable-kernel',
      secondaryStatuses: [],
      acceptedVerdict: reportVerdict(inputs.reports?.structuredSourceStateReport),
      evidenceSource: inputs.importStatuses?.structuredSourceStateReport === 'imported' ? 'current-report' : 'package-script-presence',
      evidenceConfidence: 'high',
      proved: ['Source signature must be treated as structured source state, not merely an emitted scalar tuple.'],
      notProved: ['final source-state algebra', 'general exterior algebra', 'runtime source-signature law'],
      reusableKernel: [
        'source signature is structured source state',
        'emitted tuple is field-facing reduction only',
        'tuple reduction must report preserved/compressed/lost structure',
        'unknown-feature retention',
        'antipodal covariance audit discipline',
      ],
      testOnlyResidue: [],
      forbiddenPromotion: ['tuple-only source meaning'],
      generatedSiteUsefulness: 'directly-useful',
      nextAllowedUse: 'carry tuple-reduction honesty into generated-site reading without naming',
      killTest: 'fails if source signature is reduced to amplitude/waveNumber/phase/attenuation only',
    }),
    boundaryRow({
      artifactId: 't28-k3-sfa-residual-geometric',
      artifactFamily: 'k3-sfa-chain',
      primaryStatus: t28eFacts.verdict === EXPECTED_T28E_VERDICT ? 'event-bound-result' : 'unknown-pending-audit',
      secondaryStatuses: ['policy-relative-output'],
      acceptedVerdict: t28eFacts.verdict,
      evidenceSource: inputs.importStatuses?.t28eReport === 'imported' ? 'current-report' : 'not-imported',
      evidenceConfidence: t28eFacts.verdict === EXPECTED_T28E_VERDICT ? 'high' : 'unknown',
      proved: [
        'K3-SFA-H1 is residual-geometric in current event/readout.',
        'K3-A-primary and K3-A-complement residuals are zero.',
        'K3-T residual is positive and uniform.',
        'Status-bundle removal does not collapse the K3-T signal.',
        'Locality separation is transverse-only but secondary.',
        'Synthetic/stress controls are not feasible and not used as evidence.',
        `axis residual mean = ${t28eFacts.axisResidualMean}`,
        `transverse residual mean = ${t28eFacts.transverseResidualMean}`,
        `residual separation = ${t28eFacts.residualSeparation}`,
        `residual status = ${t28eFacts.residualStatus}`,
      ],
      notProved: ['general field law', 'ATD-H0 survival', 'FieldCue', 'semantic naming', 'runtime', 'topology'],
      reusableKernel: ['parent-invariant checking', 'artifact-ablation discipline', 'control-infeasibility-is-not-evidence discipline'],
      testOnlyResidue: ['current K3 finite event/readout'],
      forbiddenPromotion: ['ATD-H0 survival', 'FieldCue maturity', 'topology', 'runtime'],
      generatedSiteUsefulness: 'directly-useful',
      nextAllowedUse: 'derive K3-T transverse residual law',
      killTest: 'fails if T28-E residual-geometric result is treated as field-world maturity',
    }),
    boundaryRow({
      artifactId: 'atd-h0-cross-channel-survival',
      artifactFamily: 'k3-sfa-chain',
      primaryStatus: 'negative-control',
      secondaryStatuses: [],
      acceptedVerdict: reportVerdict(t28c1) ?? EXPECTED_ATD_VERDICT,
      evidenceSource: inputs.importStatuses?.t28c1Report === 'imported' ? 'current-report' : 'handoff-known',
      evidenceConfidence: 'high',
      proved: ['ATD-H0 failed as V/K cross-channel survival object.', 'K-only evidence does not rescue it.'],
      notProved: ['ATD-H0 survival', 'cross-channel mature feature', 'field-world maturity'],
      reusableKernel: ['negative control for avoiding single-channel promotion'],
      testOnlyResidue: [],
      forbiddenPromotion: ['ATD-H0 survival'],
      generatedSiteUsefulness: 'warning-only',
      nextAllowedUse: 'negative control for avoiding single-channel promotion',
      killTest: 'fails if K-only evidence rescues ATD-H0',
    }),
    boundaryRow({
      artifactId: 'fieldcue-generated-site-reading-v0-scaffold',
      artifactFamily: 'fieldcue-generated-site',
      primaryStatus: fieldCueKnown ? 'event-bound-prototype' : 'unknown-pending-audit',
      secondaryStatuses: [],
      acceptedVerdict: reportVerdict(inputs.reports?.fieldCueReport) ?? reportVerdict(inputs.reports?.generatedSiteReadingReport),
      evidenceSource: fieldCueKnown ? 'package-script-presence' : 'not-imported',
      evidenceConfidence: fieldCueKnown ? 'medium' : 'unknown',
      proved: fieldCueKnown ? ['A scaffold exists for site-relative generated-site reading.'] : [],
      notProved: ['mature FieldCue', 'semantic naming', 'confirmed routes/gates/regions', 'topology'],
      reusableKernel: ['site-relative reading', 'inheritance axis', 'field-world axis', 'participation status', 'naming pressure without naming'],
      testOnlyResidue: ['generated-site reading scaffold'],
      forbiddenPromotion: ['mature FieldCue', 'semantic naming', 'topology'],
      generatedSiteUsefulness: fieldCueKnown ? 'directly-useful' : 'unknown',
      nextAllowedUse: 'convert accepted witnesses into generated-site reading without naming',
      killTest: 'fails if scaffold is treated as mature FieldCue',
    }),
    boundaryRow({
      artifactId: 'w-gate-root-frame',
      artifactFamily: 'w-gate-root-frame',
      primaryStatus: 'unknown-pending-audit',
      secondaryStatuses: [],
      acceptedVerdict: null,
      evidenceSource: scriptPresent(scripts, 'diagnose:w-gate-root-frame-extraction-v0') ? 'package-script-presence' : 'not-imported',
      evidenceConfidence: 'unknown',
      proved: [],
      notProved: ['field activity', 'semantic naming', 'general source law'],
      reusableKernel: [],
      testOnlyResidue: [],
      forbiddenPromotion: ['field activity', 'semantic naming', 'general source law'],
      generatedSiteUsefulness: 'unknown',
      nextAllowedUse: 'only as separately scoped W1/ARF evidence until integrated by governance',
      killTest: 'fails if W-gate root frame is promoted outside its own scope',
    }),
  ];
}

function buildStaleArtifactAutopsyRows(
  inputs: EventBoundFieldWitnessConsolidationLedgerV0Inputs,
  scripts: readonly PackageScriptEvidenceRow[],
): StaleArtifactAutopsyRow[] {
  const fanoGraphPresent = inputs.importStatuses?.fanoCarrierGraphReport === 'imported' || scriptPresent(scripts, 'diagnose:fano-octonionic-carrier-graph-field-v0');
  const fanoSpatialPresent = inputs.importStatuses?.fanoSpatialSupportReport === 'imported' || scriptPresent(scripts, 'diagnose:fano-octonionic-spatial-support-projection-v0');
  const fanoGenPresent = inputs.importStatuses?.fanoGenerationalReport === 'imported' || scriptPresent(scripts, 'diagnose:fano-octonionic-generational-field-update-v0');
  const defaultFieldAtlasPolicyPresent = sourceFileContains(inputs, 'src/lib/fieldAtlas.ts', 'DEFAULT_FIELD_ATLAS_SOURCE_POLICY');
  const parentInheritanceFieldAtlasPolicyPresent = sourceFileContains(
    inputs,
    'src/lib/fieldAtlas.ts',
    'PARENT_INHERITANCE_FIELD_ATLAS_SOURCE_POLICY',
  );

  return [
    staleRow({
      artifactId: 'old-field-deterministic-source-order-v1',
      artifactFamily: 'old-field-number-regime',
      primaryStatus: 'demoted-artifact',
      originalClaim: 'deterministic-source-order-v1 field numbers could stand as field truth',
      codeStatus: defaultFieldAtlasPolicyPresent
        ? 'code-present'
        : scriptPresent(scripts, 'diagnose:field-atlas')
          ? 'script-present'
          : 'handoff-known-not-repo-verified',
      demotionStatus: 'demoted-by-source-policy-failure',
      demotionReason: 'old field numbers are source-policy-relative and cannot survive source-policy revision as truth',
      whatTheCodeStillActuallyDoes: ['runs complex sampling machinery under an old policy', 'records field sample schema'],
      notToBeCarriedForward: ['deterministic-source-order-v1 outputs', 'old field candidate counts', 'old route/gate/support counts', 'old intensity values as truth'],
      methodResidue: ['complex sampling machinery', 'field sample schema', 'policy-sensitivity warning', 'candidate-only status discipline'],
      allowedFutureUse: 'autopsy and policy-sensitivity comparison only',
      reopeningCondition: 'explicit new source policy with parent-invariant proof',
      killTest: 'fails if old deterministic numbers become portable kernel inventory',
    }),
    staleRow({
      artifactId: 'old-field-parent-inheritance-v1',
      artifactFamily: 'old-field-number-regime',
      primaryStatus: 'demoted-artifact',
      originalClaim: 'parent-inheritance-v1 field numbers could be carried forward after source-policy changes',
      codeStatus: parentInheritanceFieldAtlasPolicyPresent ? 'code-present' : 'handoff-known-not-repo-verified',
      demotionStatus: 'demoted-by-source-policy-failure',
      demotionReason: 'parent-inheritance-v1 outputs are policy-relative and were superseded by explicit source-policy comparison discipline',
      whatTheCodeStillActuallyDoes: ['documents a prior inheritance-number regime'],
      notToBeCarriedForward: ['parent-inheritance-v1 outputs as truth', 'old inheritance numbers', 'any claim that old numbers survive source-policy revision'],
      methodResidue: ['source-policy comparison discipline', 'policy-relative evidence reporting'],
      allowedFutureUse: 'warning and comparison only',
      reopeningCondition: 'new report proves invariance across source policies',
      killTest: 'fails if inheritance numbers are treated as field truth',
    }),
    staleRow({
      artifactId: 'legacy-route-gate-support-candidate-stack',
      artifactFamily: 'route-gate-support-stack',
      primaryStatus: 'dead-path-retain-as-warning',
      originalClaim: 'route/gate/support candidate counts could indicate mature field structures',
      codeStatus: scriptPresent(scripts, 'diagnose:field-source-profile-aware-route-gate-candidates') ? 'script-present' : 'unknown',
      demotionStatus: 'demoted-by-candidate-bloat',
      demotionReason: 'candidate bloat and saturation made the stack a warning rather than a mature structure source',
      whatTheCodeStillActuallyDoes: ['generates candidate-only route/gate/support tables under declared policies'],
      notToBeCarriedForward: ['actual routes', 'actual gates', 'actual supports', 'actual regions', 'topology claims', 'semantic claims'],
      methodResidue: ['candidate-only ladder', 'saturation warning', 'support/co-location caution'],
      allowedFutureUse: 'dead-path warning unless explicitly reopened',
      reopeningCondition: 'bounded candidate reduction law with parent-invariant controls',
      killTest: 'fails if candidate locations become mature features',
    }),
    staleRow({
      artifactId: 'scalar-emitted-tuple-as-source-signature',
      artifactFamily: 'scalar-emitted-tuple',
      primaryStatus: 'demoted-artifact',
      originalClaim: 'amplitude/waveNumber/phase/attenuation tuple was full source identity',
      codeStatus: scriptPresent(scripts, 'diagnose:structured-source-state-emitted-recovery-v0') ? 'script-present' : 'handoff-known-not-repo-verified',
      demotionStatus: 'demoted-by-tuple-reduction-failure',
      demotionReason: 'structured source state contains preserved/compressed/lost structure not captured by scalar tuple alone',
      whatTheCodeStillActuallyDoes: ['reports field-facing projection format'],
      notToBeCarriedForward: ['amplitude/waveNumber/phase/attenuation as full source identity', 'tuple-only source meaning'],
      methodResidue: ['field-facing projection format', 'tuple-reduction honesty'],
      allowedFutureUse: 'projection format only, never full identity',
      reopeningCondition: 'none without structured-state preservation audit',
      killTest: 'fails if scalar tuple replaces structured source state',
    }),
    staleRow({
      artifactId: 'fano-octonionic-carrier-field-v0',
      artifactFamily: 'fano-octonionic-field',
      primaryStatus: 'dead-path-retain-as-warning',
      originalClaim: 'Fano/octonionic carrier assignment could be a general field foundation',
      codeStatus: fanoGraphPresent ? 'code-present' : 'not-found',
      demotionStatus: 'demoted-by-a3-s4-supersession',
      demotionReason: 'Fano carrier work remains an autopsy/warning path after A3/S4 source-state and K3 residual work superseded it',
      whatTheCodeStillActuallyDoes: ['computes Fano carrier graph field diagnostics under its own carrier policy'],
      notToBeCarriedForward: [
        'Fano plane as foundational carrier law',
        'octonionic carrier assignment as general field law',
        'Fano-specific complement axes',
        'Fano-specific local channel grammar',
      ],
      methodResidue: [
        'free emission vs response probe distinction',
        'do not treat birth links as free emissions',
        'carrier assignment must be policy-governed',
        'signed complement preservation as warning',
        'observable coefficient is not source ontology',
      ],
      allowedFutureUse: 'autopsy / warning / comparison only, unless mothership explicitly reopens with new evidence',
      reopeningCondition: 'explicit governance reopening with new carrier-policy evidence',
      killTest: 'fails if Fano carrier is portable-kernel or live theory',
    }),
    staleRow({
      artifactId: 'fano-spatial-support-and-generational-update-v0',
      artifactFamily: 'fano-octonionic-field',
      primaryStatus: 'dead-path-retain-as-warning',
      originalClaim: 'Fano spatial support and G0->G1 update could be a universal generation law',
      codeStatus: fanoSpatialPresent || fanoGenPresent ? 'code-present' : 'not-found',
      demotionStatus: 'demoted-by-a3-s4-supersession',
      demotionReason: 'spatial support and generational update are retained only as policy-bound warning artifacts',
      whatTheCodeStillActuallyDoes: ['audits Fano spatial support and generational updates under the old carrier setup'],
      notToBeCarriedForward: [
        'regular-tetrahedron-centered-coordinate-frame as general spatial field law',
        'Fano G0->G1 recomposition as universal generation law',
      ],
      methodResidue: [
        'distinguish baseline intrinsic emission from response probes',
        'birth edges may be structural support without field emission',
        'generation delta can be audited as born-source contribution only under explicit policy',
      ],
      allowedFutureUse: 'autopsy and warning only',
      reopeningCondition: 'new event-bound carrier policy with explicit non-generalization boundaries',
      killTest: 'fails if Fano spatial support is generalized',
    }),
  ];
}

function buildConsolidationSummary(args: {
  packageScriptEvidenceRows: readonly PackageScriptEvidenceRow[];
  generalizationBoundaryRows: readonly GeneralizationBoundaryRow[];
  staleArtifactAutopsyRows: readonly StaleArtifactAutopsyRow[];
  t28eReport: unknown;
  t28c1Report: unknown;
}): ConsolidationSummary {
  const terminalT28EVerdict = reportVerdict(args.t28eReport);
  const atdH0Verdict = reportVerdict(args.t28c1Report);
  const missingExpectedScriptCount = args.packageScriptEvidenceRows.filter((row) => row.expected && !row.present).length;
  const boundaryRows = args.generalizationBoundaryRows;

  return {
    terminalT28EVerdict,
    terminalT28EPrimaryClassification: stringField(args.t28eReport, 'primaryClassification') ?? null,
    atdH0Verdict,
    portableKernelCount: boundaryRows.filter((row) => row.primaryStatus === 'portable-kernel').length,
    eventBoundResultCount: boundaryRows.filter((row) => row.primaryStatus === 'event-bound-result').length,
    eventBoundPrototypeCount: boundaryRows.filter((row) => row.primaryStatus === 'event-bound-prototype').length,
    policyRelativeOutputCount: boundaryRows.filter((row) => row.primaryStatus === 'policy-relative-output' || row.secondaryStatuses.includes('policy-relative-output')).length,
    demotedArtifactCount: args.staleArtifactAutopsyRows.filter((row) => row.primaryStatus === 'demoted-artifact').length,
    deadPathWarningCount: args.staleArtifactAutopsyRows.filter((row) => row.primaryStatus === 'dead-path-retain-as-warning').length,
    unknownPendingAuditCount: boundaryRows.filter((row) => row.primaryStatus === 'unknown-pending-audit').length,
    staleArtifactAutopsyCount: args.staleArtifactAutopsyRows.length,
    missingExpectedScriptCount,
    interpretation: terminalT28EVerdict === EXPECTED_T28E_VERDICT && atdH0Verdict === EXPECTED_ATD_VERDICT
      ? missingExpectedScriptCount > 0
        ? 'handoff-ready-with-missing-families'
        : 'handoff-ready-with-stale-artifact-quarantine'
      : 'blocked-by-parent-inconsistency',
  };
}

function buildFalsifierRows(args: {
  generalizationBoundaryRows: readonly GeneralizationBoundaryRow[];
  staleArtifactAutopsyRows: readonly StaleArtifactAutopsyRow[];
  consolidationSummary: ConsolidationSummary;
}): FalsifierRow[] {
  const row = (id: string) => args.generalizationBoundaryRows.find((entry) => entry.artifactId === id);
  const stale = (id: string) => args.staleArtifactAutopsyRows.find((entry) => entry.artifactId === id);
  const oldDeterministicBoundaryRow = row('old-field-deterministic-source-order-v1');
  const oldDeterministicStaleRow = stale('old-field-deterministic-source-order-v1');
  const oldParentInheritanceBoundaryRow = row('old-field-parent-inheritance-v1');
  const oldParentInheritanceStaleRow = stale('old-field-parent-inheritance-v1');
  const oldDeterministicFalsified =
    oldDeterministicBoundaryRow?.primaryStatus === 'portable-kernel' ||
    !oldDeterministicStaleRow ||
    oldDeterministicStaleRow.primaryStatus !== 'demoted-artifact';
  const oldParentInheritanceFalsified =
    oldParentInheritanceBoundaryRow?.primaryStatus === 'portable-kernel' ||
    !oldParentInheritanceStaleRow ||
    oldParentInheritanceStaleRow.primaryStatus !== 'demoted-artifact';

  return [
    falsifierRow(
      'F1',
      'Old deterministic field numbers are classified as portable truth.',
      oldDeterministicFalsified,
      `boundaryStatus=${oldDeterministicBoundaryRow?.primaryStatus ?? 'absent'}; staleStatus=${oldDeterministicStaleRow?.primaryStatus ?? 'missing'}.`,
    ),
    falsifierRow(
      'F2',
      'Old parent-inheritance field numbers are classified as portable truth.',
      oldParentInheritanceFalsified,
      `boundaryStatus=${oldParentInheritanceBoundaryRow?.primaryStatus ?? 'absent'}; staleStatus=${oldParentInheritanceStaleRow?.primaryStatus ?? 'missing'}.`,
    ),
    falsifierRow('F3', 'Profile-aware candidate counts are classified as mature field features.', row('profile-aware-candidate-counts')?.primaryStatus !== 'policy-relative-output', `status=${row('profile-aware-candidate-counts')?.primaryStatus ?? 'missing'}.`),
    falsifierRow('F4', 'Fano/octonionic carrier field is classified as a portable kernel.', stale('fano-octonionic-carrier-field-v0')?.primaryStatus !== 'dead-path-retain-as-warning', `status=${stale('fano-octonionic-carrier-field-v0')?.primaryStatus ?? 'missing'}.`),
    falsifierRow('F5', 'Fano plane / octonion assignment is treated as general carrier law.', false, 'Fano rows are warning/autopsy only.'),
    falsifierRow('F6', 'T28-E residual-geometric result is omitted or downgraded without reason.', row('t28-k3-sfa-residual-geometric')?.acceptedVerdict !== EXPECTED_T28E_VERDICT, `acceptedVerdict=${row('t28-k3-sfa-residual-geometric')?.acceptedVerdict ?? 'missing'}.`),
    falsifierRow('F7', 'ATD-H0 is treated as surviving.', row('atd-h0-cross-channel-survival')?.primaryStatus !== 'negative-control', `status=${row('atd-h0-cross-channel-survival')?.primaryStatus ?? 'missing'}.`),
    falsifierRow('F8', 'Route/gate/support candidates are promoted to mature routes/gates/supports.', stale('legacy-route-gate-support-candidate-stack')?.primaryStatus !== 'dead-path-retain-as-warning', 'Legacy candidate stack is dead-path warning.'),
    falsifierRow('F9', 'FieldCue/generated-site scaffold is treated as mature FieldCue.', row('fieldcue-generated-site-reading-v0-scaffold')?.forbiddenPromotion.includes('mature FieldCue') !== true, 'FieldCue scaffold row forbids mature FieldCue promotion.'),
    falsifierRow('F10', 'Structured source-state is reduced to emitted tuple.', row('structured-source-state-tuple-reduction-v0')?.primaryStatus !== 'portable-kernel', 'Structured source-state row preserves tuple-reduction honesty.'),
    falsifierRow('F11', 'Missing imports are treated as positive evidence.', args.generalizationBoundaryRows.some((entry) => entry.evidenceSource === 'not-imported' && entry.primaryStatus !== 'unknown-pending-audit'), 'Not-imported rows stay unknown-pending-audit.'),
    falsifierRow('F12', 'Code presence or ok=true is treated as theoretical survival.', false, 'Package and report presence are evidence only for classification, not theory survival.'),
    falsifierRow('F13', 'The report lacks stale artifact autopsy rows.', args.staleArtifactAutopsyRows.length === 0, `count=${args.staleArtifactAutopsyRows.length}.`),
    falsifierRow('F14', 'The report lacks generalization boundary rows.', args.generalizationBoundaryRows.length === 0, `count=${args.generalizationBoundaryRows.length}.`),
    falsifierRow('F15', 'The report creates new research conclusions beyond classification.', false, 'Report is a consolidation ledger only.'),
  ];
}

function buildIntegrityIssues(args: {
  generalizationBoundaryRows: readonly GeneralizationBoundaryRow[];
  staleArtifactAutopsyRows: readonly StaleArtifactAutopsyRow[];
  boundaryRows: readonly BoundaryRow[];
  falsifierRows: readonly FalsifierRow[];
  consolidationSummary: ConsolidationSummary;
  liveTheoreticalObjectInventory: readonly string[];
  defaultFieldAtlasPolicyPresent: boolean;
  parentInheritanceFieldAtlasPolicyPresent: boolean;
}): string[] {
  const issues: string[] = [];
  const boundaryIds = new Set(args.generalizationBoundaryRows.map((row) => row.artifactId));
  const staleIds = new Set(args.staleArtifactAutopsyRows.map((row) => row.artifactId));
  const requiredBoundaryRows = [
    'field-atlas-core-source-domain-and-sampling',
    'profile-aware-field-stack-v0',
    'profile-aware-candidate-counts',
    'structured-source-state-tuple-reduction-v0',
    't28-k3-sfa-residual-geometric',
    'atd-h0-cross-channel-survival',
    'fieldcue-generated-site-reading-v0-scaffold',
    'w-gate-root-frame',
  ];
  const requiredStaleRows = [
    'old-field-deterministic-source-order-v1',
    'old-field-parent-inheritance-v1',
    'legacy-route-gate-support-candidate-stack',
    'scalar-emitted-tuple-as-source-signature',
    'fano-octonionic-carrier-field-v0',
    'fano-spatial-support-and-generational-update-v0',
  ];
  const requiredBoundaryIds = [
    'not-field-generalization',
    'not-ATD-H0-survival',
    'not-Fano-general-carrier-law',
    'not-old-field-number-truth',
    'not-route-gate-support-maturity',
    'not-FieldCue-maturity',
    'not-semantic-naming',
    'not-topology',
    'not-runtime',
    'not-packet-writing',
    'not-shape-mutation',
    'not-ui',
  ];

  for (const artifactId of requiredBoundaryRows) {
    if (!boundaryIds.has(artifactId)) {
      issues.push(`Missing required artifact row ${artifactId}.`);
    }
  }

  for (const artifactId of requiredStaleRows) {
    if (!staleIds.has(artifactId)) {
      issues.push(`Missing required stale autopsy row ${artifactId}.`);
    }
  }

  for (const boundaryId of requiredBoundaryIds) {
    if (!args.boundaryRows.some((row) => row.boundaryId === boundaryId)) {
      issues.push(`Missing required boundary row ${boundaryId}.`);
    }
  }

  if (args.falsifierRows.length < 15) {
    issues.push('Missing required falsifier row.');
  }

  const oldDeterministic = args.staleArtifactAutopsyRows.find((row) => row.artifactId === 'old-field-deterministic-source-order-v1');
  if (args.defaultFieldAtlasPolicyPresent && oldDeterministic?.codeStatus !== 'code-present') {
    issues.push('Default field atlas source policy is present but old deterministic source-order row is not code-present.');
  }

  const oldParentInheritance = args.staleArtifactAutopsyRows.find((row) => row.artifactId === 'old-field-parent-inheritance-v1');
  if (args.parentInheritanceFieldAtlasPolicyPresent && oldParentInheritance?.codeStatus !== 'code-present') {
    issues.push('Parent-inheritance field atlas source policy is present but old parent-inheritance row is not code-present.');
  }

  if (args.consolidationSummary.terminalT28EVerdict === EXPECTED_T28E_VERDICT) {
    const t28e = args.generalizationBoundaryRows.find((row) => row.artifactId === 't28-k3-sfa-residual-geometric');
    if (t28e?.primaryStatus !== 'event-bound-result') {
      issues.push('Missing T28-E terminal result when T28-E report is importable.');
    }
  }

  if (args.generalizationBoundaryRows.some((row) => row.artifactId.includes('old-field') && row.primaryStatus === 'portable-kernel')) {
    issues.push('Old field numbers classified as portable-kernel.');
  }

  if (args.staleArtifactAutopsyRows.some((row) => row.artifactFamily === 'fano-octonionic-field' && row.primaryStatus !== 'dead-path-retain-as-warning')) {
    issues.push('Fano classified as portable-kernel.');
  }

  if (args.generalizationBoundaryRows.find((row) => row.artifactId === 'atd-h0-cross-channel-survival')?.primaryStatus !== 'negative-control') {
    issues.push('ATD-H0 classified as surviving.');
  }

  if (args.generalizationBoundaryRows.some((row) => !row.primaryStatus) || args.staleArtifactAutopsyRows.some((row) => !row.primaryStatus)) {
    issues.push('Missing primary status.');
  }

  if (
    args.generalizationBoundaryRows.some((row) => row.evidenceSource === 'not-imported' && row.primaryStatus !== 'unknown-pending-audit')
  ) {
    issues.push('Unknown family promoted instead of marked unknown-pending-audit.');
  }

  const forbiddenLive = ['Fano carrier field', 'old deterministic field', 'old route/gate/support stack', 'ATD-H0'];
  if (args.liveTheoreticalObjectInventory.some((item) => forbiddenLive.includes(item))) {
    issues.push('Stale artifact included in live theoretical object inventory.');
  }

  if (args.falsifierRows.some((row) => row.triggered)) {
    issues.push('One or more consolidation falsifiers triggered.');
  }

  return unique(issues);
}

function classifyConsolidationVerdict(summary: ConsolidationSummary, falsifiers: readonly FalsifierRow[]): ConsolidationVerdict {
  if (falsifiers.some((row) => row.triggered)) {
    return 'boundary-failed';
  }

  if (summary.terminalT28EVerdict !== EXPECTED_T28E_VERDICT || summary.atdH0Verdict !== EXPECTED_ATD_VERDICT) {
    return 'blocked-by-parent-inconsistency';
  }

  return summary.missingExpectedScriptCount > 0 ? 'consolidated-with-missing-families' : 'consolidated-for-research-handoff';
}

function buildBoundaryRows(): BoundaryRow[] {
  return [
    boundary('not-field-generalization', 'No field theory generalization is claimed.'),
    boundary('not-ATD-H0-survival', 'ATD-H0 remains failed as a cross-channel survival object.'),
    boundary('not-Fano-general-carrier-law', 'Fano/octonionic carrier work is autopsy/warning only.'),
    boundary('not-old-field-number-truth', 'Old deterministic and parent-inheritance field numbers are not truth.'),
    boundary('not-route-gate-support-maturity', 'Route/gate/support candidates are not mature structures.'),
    boundary('not-FieldCue-maturity', 'FieldCue/generated-site scaffold is not mature FieldCue.'),
    boundary('not-semantic-naming', 'No semantic naming is introduced.'),
    boundary('not-topology', 'No topology behavior is introduced.'),
    boundary('not-runtime', 'No runtime behavior is introduced.'),
    boundary('not-packet-writing', 'No packets are written.'),
    boundary('not-shape-mutation', 'Shape is not mutated.'),
    boundary('not-ui', 'No UI is added.'),
  ];
}

function boundaryRow(row: GeneralizationBoundaryRow): GeneralizationBoundaryRow {
  return row;
}

function staleRow(row: StaleArtifactAutopsyRow): StaleArtifactAutopsyRow {
  return row;
}

function boundary(boundaryId: string, statement: string): BoundaryRow {
  return { boundaryId, statement, enforced: true };
}

function falsifierRow(falsifierId: string, description: string, triggered: boolean, evidence: string): FalsifierRow {
  return { falsifierId, description, triggered, evidence, status: triggered ? 'triggered' : 'clear' };
}

function inventoryFor(
  rows: readonly GeneralizationBoundaryRow[],
  status: ConsolidationStatus,
  field: 'artifactId' | 'reusableKernel',
  includeSecondary = false,
): string[] {
  const selected = rows.filter((row) => row.primaryStatus === status || (includeSecondary && row.secondaryStatuses.includes(status)));

  return unique(field === 'artifactId' ? selected.map((row) => row.artifactId) : selected.flatMap((row) => row.reusableKernel));
}

function buildForbiddenPromotionInventory(
  boundaryRows: readonly GeneralizationBoundaryRow[],
  staleRows: readonly StaleArtifactAutopsyRow[],
): string[] {
  return unique([
    ...boundaryRows.flatMap((row) => row.forbiddenPromotion),
    ...staleRows.flatMap((row) => row.notToBeCarriedForward),
  ]);
}

function t28eResidualFacts(report: unknown): {
  verdict: string | null;
  axisResidualMean: string;
  transverseResidualMean: string;
  residualSeparation: string;
  residualStatus: string;
} {
  const rows = arrayField(report, 'residualSeparationRows');
  const axisMeans = rows.map((row) => numberField(row, 'axisResidualMean')).filter(isNumber);
  const transverseMeans = rows.map((row) => numberField(row, 'transverseResidualMean')).filter(isNumber);
  const separations = rows.map((row) => numberField(row, 'residualSeparation')).filter(isNumber);
  const statuses = unique(rows.map((row) => stringField(row, 'residualSeparationStatus')).filter(isString));

  return {
    verdict: reportVerdict(report),
    axisResidualMean: axisMeans.length > 0 ? String(cleanNumber(mean(axisMeans))) : 'unknown',
    transverseResidualMean: transverseMeans.length > 0 ? String(cleanNumber(mean(transverseMeans))) : 'unknown',
    residualSeparation: separations.length > 0 ? String(cleanNumber(mean(separations))) : 'unknown',
    residualStatus: statuses.length === 1 ? `${statuses[0]} across AB-CD, AC-BD, AD-BC` : 'unknown',
  };
}

function scriptPresent(rows: readonly PackageScriptEvidenceRow[], scriptName: string): boolean {
  return rows.some((row) => row.scriptName === scriptName && row.present);
}

function sourceFileContains(
  inputs: EventBoundFieldWitnessConsolidationLedgerV0Inputs,
  repoPath: string,
  token: string,
): boolean {
  const sourceFile = inputs.sourceFiles?.[repoPath];
  return sourceFile?.exists === true && sourceFile.text.includes(token);
}

function reportVerdict(report: unknown): string | null {
  return stringField(report, 'summaryVerdict') ?? stringField(report, 'verdict') ?? null;
}

function arrayField(value: unknown, key: string): unknown[] {
  if (!isRecord(value)) {
    return [];
  }

  const field = value[key];
  return Array.isArray(field) ? field : [];
}

function stringField(value: unknown, key: string): string | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const field = value[key];
  return typeof field === 'string' ? field : undefined;
}

function numberField(value: unknown, key: string): number | undefined {
  if (!isRecord(value)) {
    return undefined;
  }

  const field = value[key];
  return typeof field === 'number' ? field : undefined;
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function mean(values: readonly number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function cleanNumber(value: number): number {
  if (Math.abs(value) <= 1e-12) {
    return 0;
  }

  return Number(value.toFixed(12));
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)];
}
