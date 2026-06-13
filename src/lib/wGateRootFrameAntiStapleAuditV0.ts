import {
  buildWGateRootFrameExtractionV0Report,
  type WGateRootFrameExtractionRowV0,
  type WGateRootFrameExtractionV0Report,
  type WGateRootFrameLabel,
  type WGateRootKey,
  type WGateSourceEdgeLabels,
} from './wGateRootFrameExtractionV0';

declare const require: (id: string) => unknown;
declare const process: { cwd: () => string };

type AuditUsage =
  | 'used-for-assignment'
  | 'used-for-verification'
  | 'used-for-control'
  | 'mentioned-only'
  | 'not-present';
type AuditClassification = 'permitted' | 'forbidden';

export interface WGateRootFrameStaticFindingV0 {
  pattern: string;
  classification: AuditClassification;
  usage: AuditUsage;
  subjectFunction: string;
  ok: boolean;
  notes: string;
}

export interface WGateRootFrameRuntimeDependencyRowV0 {
  controlId: string;
  evidenceKind: string;
  source: 'parent-destructive-control' | 'w1a-runtime-control';
  observed: Record<string, unknown>;
  ok: boolean;
}

export interface WGateRootFrameMockStapleRowV0 {
  mockId: string;
  mockKind: string;
  producesCorrectRootCount: boolean;
  producesCorrectRootSet: boolean;
  consumesIncidence: boolean;
  consumesExpectedRootSetForAssignment: boolean;
  consumesCarrierLabels: boolean;
  rejectedByAudit: boolean;
  ok: boolean;
  reason: string;
}

export interface WGateRootFrameProvenanceLedgerRowV0 {
  g2ChildId: string;
  g1EndpointVertexIds: [string, string];
  g1EndpointSourceEdgeLabels: [WGateSourceEdgeLabels, WGateSourceEdgeLabels];
  sharedIndex: WGateRootFrameLabel;
  omittedIndex: WGateRootFrameLabel;
  derivedRoot: WGateRootKey;
  assignmentSource: 'incidence-derived';
  carrierLabelsConsumed: false;
  storedFlagRowsConsumed: false;
  storedRootMapConsumed: false;
  expectedRootSetConsumedForAssignment: false;
  childIdStringConsumedForAssignment: false;
  sourceVertexMetadataConsumed: true;
  sourceEdgeMetadataConsumed: true;
}

export interface WGateRootFrameCompetitorContextSummaryV0 {
  status: 'provided-by-caller' | 'not-provided-to-builder';
  workspacePath: string | null;
  branch: string | null;
  head: string | null;
  dirtyStatus: string[];
  relevantArtifacts: string[];
  notes: string[];
}

export interface WGateRootFrameAntiStapleAuditV0Report {
  method: 'w-gate-root-frame-anti-staple-audit-v0';
  candidateW: 'ambo-root-frame-source-regime-v0';
  shortName: 'W_ARF_v0';
  diagnosticScope: 'w1a-anti-staple-leakage-audit-only';
  parentDiagnostic: 'w-gate-root-frame-extraction-v0';
  verdictStatus: 'computes-and-reports-only-auditor-classifies';
  fieldStatus: 'not-field-law';
  observableStatus: 'not-w2';
  carrierShadowStatus: 'comparator-not-consumed-as-source-legitimacy';
  carrierShadowComparatorStatus: 'not-consumed-in-w1a';
  reverseReturnStatus: 'not-resolved-by-this-diagnostic';
  shapeMutationStatus: 'no-shape-mutation-beyond-derived-test-shapes';
  packetWriteStatus: 'no-packet-writing';
  uiStatus: 'no-ui';
  operationRegistryStatus: 'not-operation-registry-work';
  topologyStatus: 'not-topology-workspace';
  leakageStatus:
    | 'no-assignment-level-leakage-detected'
    | 'assignment-level-leakage-detected';
  incidenceDependencyStatus:
    | 'incidence-required-by-parent-and-w1a-controls'
    | 'incidence-dependency-not-established';
  storedMapLeakStatus:
    | 'no-stored-map-assignment-route-detected'
    | 'stored-map-assignment-route-detected';
  carrierLabelLeakStatus:
    | 'no-carrier-label-assignment-route-detected'
    | 'carrier-label-assignment-route-detected';
  orderedFlagLeakStatus:
    | 'no-ordered-flag-assignment-route-detected'
    | 'ordered-flag-assignment-route-detected';
  antiStapleControlStatus:
    | 'passed-controls-fired-and-mocks-rejected'
    | 'failed-control-or-mock';
  parentSummary: {
    ok: boolean;
    integrityIssueCount: number;
    rootExtractionRowsLength: number;
    usedCarrierLabels: boolean;
    usedStoredOrderedFlagTable: boolean;
    rootExtractionSource: string;
  };
  staticAuditSummary: {
    sourcePath: string;
    subjectFunctions: string[];
    findingCount: number;
    assignmentLeakCount: number;
    requiredAssignmentSignalRows: Array<{ signal: string; presentInAssignmentPath: boolean; ok: boolean }>;
    findings: WGateRootFrameStaticFindingV0[];
    ok: boolean;
  };
  runtimeDependencySummary: {
    realIncidenceExtractionPasses: boolean;
    parentDestructiveEvidencePassCount: number;
    parentDestructiveEvidenceExpectedCount: number;
    harmlessRelabelingControl: WGateRootFrameRuntimeDependencyRowV0;
    handMapRouteControl: WGateRootFrameRuntimeDependencyRowV0;
    rows: WGateRootFrameRuntimeDependencyRowV0[];
    ok: boolean;
  };
  mockStapleSummary: {
    mockRows: WGateRootFrameMockStapleRowV0[];
    rejectedMockCount: number;
    realIncidenceRoutePasses: boolean;
    ok: boolean;
  };
  provenanceConsumptionLedger: WGateRootFrameProvenanceLedgerRowV0[];
  competitorContextSummary: WGateRootFrameCompetitorContextSummaryV0;
  integrityIssues: string[];
  integrityIssueCount: number;
  ok: boolean;
}

interface WGateRootFrameAntiStapleAuditV0Options {
  competitorContextSummary?: WGateRootFrameCompetitorContextSummaryV0;
}

interface PatternSpec {
  pattern: string;
  regex: RegExp;
  classification: AuditClassification;
  notes: string;
  sanitizeAssignmentText?: (text: string) => string;
}

const LABELS: readonly WGateRootFrameLabel[] = ['A', 'B', 'C', 'D'];
const ASSIGNMENT_FUNCTIONS = [
  'buildExtractionInputs',
  'recoverG0SourceEdge',
  'extractRowsFromInputs',
  'extractRootFromSourceEdges',
] as const;
const VERIFICATION_FUNCTIONS = [
  'buildRootSetSummary',
  'buildAntipodalSummary',
  'buildA2SubsystemSummary',
  'buildMetricSummary',
  'expectedRootKeys',
  'rootVector',
  'requireRootVector',
] as const;
const CONTROL_FUNCTIONS = [
  'buildS4EquivarianceSummary',
  'buildDestructiveTestRows',
  'runSourceEdgeMetadataRemovalControl',
  'runCorruptedAdjacencyControl',
  'runUnionOnlyCollapseControl',
  'runUnorderedRootCollapseControl',
  'runArbitraryLabelReplacementControl',
  'enumeratePermutations',
] as const;

export function buildWGateRootFrameAntiStapleAuditV0Report(
  options: WGateRootFrameAntiStapleAuditV0Options = {},
): WGateRootFrameAntiStapleAuditV0Report {
  const parent = buildWGateRootFrameExtractionV0Report();
  const integrityIssues: string[] = [];
  const parentSummary = buildParentSummary(parent);

  if (!parent.ok || parent.integrityIssueCount !== 0) {
    integrityIssues.push('Parent W-1 extraction report is not clean; W-1A cannot certify anti-staple controls.');
  }

  if (
    parent.usedCarrierLabels !== false ||
    parent.usedStoredOrderedFlagTable !== false ||
    parent.rootExtractionSource !== 'g0-g1-g2-ambo-incidence' ||
    parent.rootExtractionRows.length !== 12
  ) {
    integrityIssues.push('Parent W-1 extraction report does not expose the required incidence-only status fields.');
  }

  const sourcePath = joinPath(process.cwd(), 'src', 'lib', 'wGateRootFrameExtractionV0.ts');
  const sourceText = readTextFile(sourcePath);
  const staticAuditSummary = buildStaticAuditSummary(sourcePath, sourceText);
  const provenanceConsumptionLedger = buildProvenanceLedger(parent.rootExtractionRows);
  const runtimeDependencySummary = buildRuntimeDependencySummary(parent);
  const mockStapleSummary = buildMockStapleSummary(parent);

  if (!staticAuditSummary.ok) {
    integrityIssues.push('Static audit found assignment-level leakage or missing assignment-path incidence signals.');
  }

  if (!runtimeDependencySummary.ok) {
    integrityIssues.push('Runtime dependency controls did not establish incidence dependence.');
  }

  if (!mockStapleSummary.ok) {
    integrityIssues.push('Mock-staple audit did not reject a staple route while accepting real incidence extraction.');
  }

  if (!provenanceConsumptionLedger.every(isCompleteLedgerRow)) {
    integrityIssues.push('At least one provenance-consumption ledger row is incomplete.');
  }

  const assignmentLeaks = staticAuditSummary.findings.filter(
    (finding) => !finding.ok && finding.usage === 'used-for-assignment',
  );
  const dedupedIssues = dedupeStrings(integrityIssues);
  const ok = dedupedIssues.length === 0;

  return {
    method: 'w-gate-root-frame-anti-staple-audit-v0',
    candidateW: 'ambo-root-frame-source-regime-v0',
    shortName: 'W_ARF_v0',
    diagnosticScope: 'w1a-anti-staple-leakage-audit-only',
    parentDiagnostic: 'w-gate-root-frame-extraction-v0',
    verdictStatus: 'computes-and-reports-only-auditor-classifies',
    fieldStatus: 'not-field-law',
    observableStatus: 'not-w2',
    carrierShadowStatus: 'comparator-not-consumed-as-source-legitimacy',
    carrierShadowComparatorStatus: 'not-consumed-in-w1a',
    reverseReturnStatus: 'not-resolved-by-this-diagnostic',
    shapeMutationStatus: 'no-shape-mutation-beyond-derived-test-shapes',
    packetWriteStatus: 'no-packet-writing',
    uiStatus: 'no-ui',
    operationRegistryStatus: 'not-operation-registry-work',
    topologyStatus: 'not-topology-workspace',
    leakageStatus: assignmentLeaks.length === 0
      ? 'no-assignment-level-leakage-detected'
      : 'assignment-level-leakage-detected',
    incidenceDependencyStatus: runtimeDependencySummary.ok
      ? 'incidence-required-by-parent-and-w1a-controls'
      : 'incidence-dependency-not-established',
    storedMapLeakStatus: hasAssignmentLeak(staticAuditSummary.findings, ['stored', 'root', 'map'])
      ? 'stored-map-assignment-route-detected'
      : 'no-stored-map-assignment-route-detected',
    carrierLabelLeakStatus: hasAssignmentLeak(staticAuditSummary.findings, ['carrier'])
      ? 'carrier-label-assignment-route-detected'
      : 'no-carrier-label-assignment-route-detected',
    orderedFlagLeakStatus: hasAssignmentLeak(staticAuditSummary.findings, ['flag'])
      ? 'ordered-flag-assignment-route-detected'
      : 'no-ordered-flag-assignment-route-detected',
    antiStapleControlStatus: runtimeDependencySummary.ok && mockStapleSummary.ok
      ? 'passed-controls-fired-and-mocks-rejected'
      : 'failed-control-or-mock',
    parentSummary,
    staticAuditSummary,
    runtimeDependencySummary,
    mockStapleSummary,
    provenanceConsumptionLedger,
    competitorContextSummary: options.competitorContextSummary ?? defaultCompetitorContextSummary(),
    integrityIssues: dedupedIssues,
    integrityIssueCount: dedupedIssues.length,
    ok,
  };
}

function buildParentSummary(parent: WGateRootFrameExtractionV0Report): WGateRootFrameAntiStapleAuditV0Report['parentSummary'] {
  return {
    ok: parent.ok,
    integrityIssueCount: parent.integrityIssueCount,
    rootExtractionRowsLength: parent.rootExtractionRows.length,
    usedCarrierLabels: parent.usedCarrierLabels,
    usedStoredOrderedFlagTable: parent.usedStoredOrderedFlagTable,
    rootExtractionSource: parent.rootExtractionSource,
  };
}

function buildStaticAuditSummary(
  sourcePath: string,
  sourceText: string,
): WGateRootFrameAntiStapleAuditV0Report['staticAuditSummary'] {
  const assignmentText = ASSIGNMENT_FUNCTIONS.map((name) => getFunctionText(sourceText, name)).join('\n');
  const verificationText = VERIFICATION_FUNCTIONS.map((name) => getFunctionText(sourceText, name)).join('\n');
  const controlText = CONTROL_FUNCTIONS.map((name) => getFunctionText(sourceText, name)).join('\n');
  const findings = buildStaticFindings(assignmentText, verificationText, controlText);
  const requiredAssignmentSignalRows = [
    'g1EndpointSourceEdges',
    'createdBy.sourceVertexIds',
    'sourceEdgeId',
    'sharedIndex',
    'omittedIndex',
    'extractRootFromSourceEdges',
  ].map((signal) => ({
    signal,
    presentInAssignmentPath: assignmentText.includes(signal),
    ok: assignmentText.includes(signal),
  }));
  const assignmentLeakCount = findings.filter((finding) => !finding.ok && finding.usage === 'used-for-assignment').length;
  const missingSignals = requiredAssignmentSignalRows.filter((row) => !row.ok).length;

  return {
    sourcePath,
    subjectFunctions: [...ASSIGNMENT_FUNCTIONS],
    findingCount: findings.length,
    assignmentLeakCount,
    requiredAssignmentSignalRows,
    findings,
    ok: assignmentLeakCount === 0 && missingSignals === 0,
  };
}

function buildStaticFindings(
  assignmentText: string,
  verificationText: string,
  controlText: string,
): WGateRootFrameStaticFindingV0[] {
  const patternSpecs: PatternSpec[] = [
    {
      pattern: 'stored ordered-root table',
      regex: /stored\s+ordered[- ]root|ordered[- ]root\s+table|root\s+table|hard-coded\s+.*root/i,
      classification: 'forbidden',
      notes: 'A stored root table may not assign rho(shared, omitted).',
    },
    {
      pattern: 'stored ordered-flag table',
      regex: /stored\s+ordered[- ]flag|ordered[- ]flag\s+table|flag\s+map|stored\s+flag|usedStoredFlagTable/i,
      classification: 'forbidden',
      notes: 'Flag tables may not supply ordered roots.',
      sanitizeAssignmentText: (text) => stripBenignBooleanFalseMentions(text, ['usedStoredFlagTable']),
    },
    {
      pattern: 'hard-coded child id to root map',
      regex: /child[- ]id.*rho|g2VertexId.*rho|vertex:mid.*rho|child.*root\s+map/i,
      classification: 'forbidden',
      notes: 'Child ids may witness rows but may not encode root assignment.',
    },
    {
      pattern: 'carrier labels',
      regex: /carrier/i,
      classification: 'forbidden',
      notes: 'Carrier vocabulary may only appear as explicit non-consumption status.',
      sanitizeAssignmentText: (text) => stripBenignBooleanFalseMentions(text, ['usedCarrierLabel']),
    },
    {
      pattern: 'Fano units',
      regex: /fano/i,
      classification: 'forbidden',
      notes: 'Fano units are W0 comparator material and not an assignment source here.',
    },
    {
      pattern: 'octonion units',
      regex: /octonion/i,
      classification: 'forbidden',
      notes: 'Octonion units are W0 comparator material and not an assignment source here.',
    },
    {
      pattern: 'hub capsule flag rows',
      regex: /hub|flagRows|hubLayer/i,
      classification: 'forbidden',
      notes: 'Hub capsule rows must not feed root extraction.',
    },
    {
      pattern: 'W0 carrier table rows',
      regex: /W0|fanoOctonionic|carrierTable/i,
      classification: 'forbidden',
      notes: 'W0 carrier tables are boundary-only for W-1A.',
    },
    {
      pattern: 'expected root list',
      regex: /expectedRootKeys/i,
      classification: 'forbidden',
      notes: 'Expected roots may verify completeness but may not assign roots.',
    },
    {
      pattern: 'child id string parser',
      regex: /parse.*child|childIdString|g2VertexId\.(?:split|slice|match)|g2VertexId\s*\[/i,
      classification: 'forbidden',
      notes: 'String parsing of child ids cannot bypass createdBy/source-edge provenance.',
    },
    {
      pattern: 'precomputed permutation/orbit table',
      regex: /orbit|permutation/i,
      classification: 'forbidden',
      notes: 'Permutations are allowed only for equivariance controls.',
    },
  ];

  return patternSpecs.map((spec) => classifyPattern(spec, assignmentText, verificationText, controlText));
}

function classifyPattern(
  spec: PatternSpec,
  assignmentText: string,
  verificationText: string,
  controlText: string,
): WGateRootFrameStaticFindingV0 {
  const sanitizedAssignmentText = spec.sanitizeAssignmentText?.(assignmentText) ?? assignmentText;
  const assignmentHit = spec.regex.test(sanitizedAssignmentText);
  const assignmentHitIsBenign = !assignmentHit && spec.regex.test(assignmentText);

  if (assignmentHit && !assignmentHitIsBenign) {
    return {
      pattern: spec.pattern,
      classification: spec.classification,
      usage: 'used-for-assignment',
      subjectFunction: ASSIGNMENT_FUNCTIONS.join(','),
      ok: spec.classification !== 'forbidden',
      notes: spec.notes,
    };
  }

  if (assignmentHitIsBenign) {
    return {
      pattern: spec.pattern,
      classification: spec.classification,
      usage: 'mentioned-only',
      subjectFunction: ASSIGNMENT_FUNCTIONS.join(','),
      ok: true,
      notes: `${spec.notes} Only explicit false/non-consumption status appears on the assignment path.`,
    };
  }

  if (spec.regex.test(verificationText)) {
    return {
      pattern: spec.pattern,
      classification: spec.classification,
      usage: 'used-for-verification',
      subjectFunction: VERIFICATION_FUNCTIONS.join(','),
      ok: true,
      notes: `${spec.notes} Usage is outside the assignment path and confined to verification.`,
    };
  }

  if (spec.regex.test(controlText)) {
    return {
      pattern: spec.pattern,
      classification: spec.classification,
      usage: 'used-for-control',
      subjectFunction: CONTROL_FUNCTIONS.join(','),
      ok: true,
      notes: `${spec.notes} Usage is outside the assignment path and confined to controls.`,
    };
  }

  return {
    pattern: spec.pattern,
    classification: spec.classification,
    usage: 'not-present',
    subjectFunction: 'parent-extraction-module',
    ok: true,
    notes: spec.notes,
  };
}

function buildRuntimeDependencySummary(
  parent: WGateRootFrameExtractionV0Report,
): WGateRootFrameAntiStapleAuditV0Report['runtimeDependencySummary'] {
  const parentEvidence = buildParentDestructiveEvidence(parent);
  const harmlessRelabelingControl = runHarmlessRelabelingControl(parent.rootExtractionRows);
  const handMapRouteControl = runHandMapRouteControl(parent.rootExtractionRows);
  const rows = [...parentEvidence, harmlessRelabelingControl, handMapRouteControl];

  return {
    realIncidenceExtractionPasses: parent.ok && parent.integrityIssueCount === 0 && parent.rootExtractionRows.length === 12,
    parentDestructiveEvidencePassCount: parentEvidence.filter((row) => row.ok).length,
    parentDestructiveEvidenceExpectedCount: parentEvidence.length,
    harmlessRelabelingControl,
    handMapRouteControl,
    rows,
    ok:
      parent.ok &&
      parent.integrityIssueCount === 0 &&
      parent.rootExtractionRows.length === 12 &&
      rows.every((row) => row.ok),
  };
}

function buildParentDestructiveEvidence(
  parent: WGateRootFrameExtractionV0Report,
): WGateRootFrameRuntimeDependencyRowV0[] {
  const evidenceMap: Record<string, string> = {
    'D-RFE-1': 'source-edge dependency',
    'D-RFE-2': 'adjacency/source-edge coherence',
    'D-RFE-3': 'two endpoint edges are necessary',
    'D-RFE-5': 'hand-map equivariance theater rejected',
    'D-RFE-6': 'ordered-root dependence',
    'D-RFE-7': 'count-only/root-label-only success rejected',
  };

  return Object.entries(evidenceMap).map(([controlId, evidenceKind]) => {
    const parentRow = parent.destructiveTestRows.find((row) => row.id === controlId);

    return {
      controlId,
      evidenceKind,
      source: 'parent-destructive-control',
      observed: {
        parentStatus: parentRow?.destructiveTestStatus ?? 'missing',
        parentOk: parentRow?.ok ?? false,
        parentObserved: parentRow?.observed ?? null,
      },
      ok: parentRow?.ok === true && parentRow.destructiveTestStatus === 'passed-damaged-input-failed-as-expected',
    };
  });
}

function runHarmlessRelabelingControl(rows: WGateRootFrameExtractionRowV0[]): WGateRootFrameRuntimeDependencyRowV0 {
  const relabel: Record<WGateRootFrameLabel, WGateRootFrameLabel> = {
    A: 'B',
    B: 'C',
    C: 'D',
    D: 'A',
  };
  const failures = rows.filter((row) => {
    const relabeledEdges = row.g1EndpointSourceEdges.map((edge) =>
      sortSourceEdgeLabels([relabel[edge[0]], relabel[edge[1]]]),
    ) as [WGateSourceEdgeLabels, WGateSourceEdgeLabels];
    const extracted = extractRootFromSourceEdges(relabeledEdges);

    return !extracted.ok || rootKey(extracted.sharedIndex, extracted.omittedIndex) !== permuteRootKey(row.rootKey, relabel);
  });

  return {
    controlId: 'W1A-RUNTIME-RELABEL',
    evidenceKind: 'incidence-preserving relabeling covariance',
    source: 'w1a-runtime-control',
    observed: {
      relabel,
      rowCount: rows.length,
      passCount: rows.length - failures.length,
      failCount: failures.length,
      failedG2ChildIds: failures.map((row) => row.g2VertexId),
    },
    ok: rows.length === 12 && failures.length === 0,
  };
}

function runHandMapRouteControl(rows: WGateRootFrameExtractionRowV0[]): WGateRootFrameRuntimeDependencyRowV0 {
  const mock = buildStoredRootMapMock(rows);

  return {
    controlId: 'W1A-RUNTIME-HAND-MAP',
    evidenceKind: 'hand-map route rejected when incidence is hidden',
    source: 'w1a-runtime-control',
    observed: {
      producesCorrectRootCount: mock.producesCorrectRootCount,
      producesCorrectRootSet: mock.producesCorrectRootSet,
      consumesIncidence: mock.consumesIncidence,
      consumesExpectedRootSetForAssignment: mock.consumesExpectedRootSetForAssignment,
      rejectedByAudit: mock.rejectedByAudit,
    },
    ok: mock.rejectedByAudit && mock.producesCorrectRootCount && mock.producesCorrectRootSet && !mock.consumesIncidence,
  };
}

function buildMockStapleSummary(
  parent: WGateRootFrameExtractionV0Report,
): WGateRootFrameAntiStapleAuditV0Report['mockStapleSummary'] {
  const mockRows = [
    buildStoredRootMapMock(parent.rootExtractionRows),
    buildChildIdParserMock(parent.rootExtractionRows),
  ];

  return {
    mockRows,
    rejectedMockCount: mockRows.filter((row) => row.rejectedByAudit).length,
    realIncidenceRoutePasses: parent.ok && parent.rootExtractionRows.length === 12,
    ok: parent.ok && parent.rootExtractionRows.length === 12 && mockRows.some((row) => row.ok && row.rejectedByAudit),
  };
}

function buildStoredRootMapMock(rows: WGateRootFrameExtractionRowV0[]): WGateRootFrameMockStapleRowV0 {
  const assignedRoots = expectedRootKeys().slice(0, rows.length);
  const producesCorrectRootCount = assignedRoots.length === 12;
  const producesCorrectRootSet = setEquals(new Set(assignedRoots), new Set(expectedRootKeys()));
  const rejectedByAudit = producesCorrectRootCount && producesCorrectRootSet;

  return {
    mockId: 'mock-stored-root-map',
    mockKind: 'stored row-order root assignment',
    producesCorrectRootCount,
    producesCorrectRootSet,
    consumesIncidence: false,
    consumesExpectedRootSetForAssignment: true,
    consumesCarrierLabels: false,
    rejectedByAudit,
    ok: rejectedByAudit,
    reason:
      'Produces a shallow 12-root universe from expectedRootKeys row order, but consumes no G1 endpoint source-edge incidence.',
  };
}

function buildChildIdParserMock(rows: WGateRootFrameExtractionRowV0[]): WGateRootFrameMockStapleRowV0 {
  const parsedRoots = rows
    .map((row) => /rho\([A-D],[A-D]\)/.exec(row.g2VertexId)?.[0])
    .filter((root): root is WGateRootKey => Boolean(root));
  const producesCorrectRootCount = parsedRoots.length === 12;
  const producesCorrectRootSet = setEquals(new Set(parsedRoots), new Set(expectedRootKeys()));
  const rejectedByAudit = !producesCorrectRootCount || !producesCorrectRootSet;

  return {
    mockId: 'mock-child-id-parser',
    mockKind: 'child id string parser',
    producesCorrectRootCount,
    producesCorrectRootSet,
    consumesIncidence: false,
    consumesExpectedRootSetForAssignment: false,
    consumesCarrierLabels: false,
    rejectedByAudit,
    ok: rejectedByAudit,
    reason:
      'G2 child ids are opaque generated ids and do not encode rho(shared, omitted); parsing them is rejected as non-incidence evidence.',
  };
}

function buildProvenanceLedger(rows: WGateRootFrameExtractionRowV0[]): WGateRootFrameProvenanceLedgerRowV0[] {
  return rows.map((row) => ({
    g2ChildId: row.g2VertexId,
    g1EndpointVertexIds: row.g1EndpointVertexIds,
    g1EndpointSourceEdgeLabels: row.g1EndpointSourceEdges,
    sharedIndex: row.sharedIndex,
    omittedIndex: row.omittedIndex,
    derivedRoot: row.rootKey,
    assignmentSource: 'incidence-derived',
    carrierLabelsConsumed: false,
    storedFlagRowsConsumed: false,
    storedRootMapConsumed: false,
    expectedRootSetConsumedForAssignment: false,
    childIdStringConsumedForAssignment: false,
    sourceVertexMetadataConsumed: true,
    sourceEdgeMetadataConsumed: true,
  }));
}

function extractRootFromSourceEdges(
  sourceEdges: [WGateSourceEdgeLabels, WGateSourceEdgeLabels],
): { ok: true; sharedIndex: WGateRootFrameLabel; omittedIndex: WGateRootFrameLabel } | { ok: false; reason: string } {
  const [left, right] = sourceEdges;
  const shared = left.filter((label) => right.includes(label));

  if (shared.length !== 1) {
    return { ok: false, reason: `expected one shared index, got ${shared.length}` };
  }

  const union = LABELS.filter((label) => left.includes(label) || right.includes(label));
  const omitted = LABELS.filter((label) => !union.includes(label));

  if (union.length !== 3 || omitted.length !== 1) {
    return { ok: false, reason: `expected union size 3 and omitted size 1, got ${union.length}/${omitted.length}` };
  }

  return { ok: true, sharedIndex: shared[0], omittedIndex: omitted[0] };
}

function expectedRootKeys(): WGateRootKey[] {
  return LABELS.flatMap((from) => LABELS.filter((to) => to !== from).map((to) => rootKey(from, to)));
}

function rootKey(from: WGateRootFrameLabel, to: WGateRootFrameLabel): WGateRootKey {
  return `rho(${from},${to})` as WGateRootKey;
}

function parseRootKey(value: string): { from: WGateRootFrameLabel; to: WGateRootFrameLabel } | null {
  const match = /^rho\(([A-D]),([A-D])\)$/.exec(value);

  if (!match || match[1] === match[2]) {
    return null;
  }

  return { from: match[1] as WGateRootFrameLabel, to: match[2] as WGateRootFrameLabel };
}

function permuteRootKey(key: WGateRootKey, relabel: Record<WGateRootFrameLabel, WGateRootFrameLabel>): WGateRootKey {
  const parsed = parseRootKey(key);

  if (!parsed) {
    throw new Error(`Invalid root key ${key}`);
  }

  return rootKey(relabel[parsed.from], relabel[parsed.to]);
}

function sortSourceEdgeLabels(labels: [WGateRootFrameLabel, WGateRootFrameLabel]): WGateSourceEdgeLabels {
  return [...labels].sort((left, right) => LABELS.indexOf(left) - LABELS.indexOf(right)) as WGateSourceEdgeLabels;
}

function isCompleteLedgerRow(row: WGateRootFrameProvenanceLedgerRowV0): boolean {
  return (
    Boolean(row.g2ChildId) &&
    row.g1EndpointVertexIds.length === 2 &&
    row.g1EndpointSourceEdgeLabels.length === 2 &&
    Boolean(row.sharedIndex) &&
    Boolean(row.omittedIndex) &&
    Boolean(row.derivedRoot) &&
    row.assignmentSource === 'incidence-derived' &&
    row.carrierLabelsConsumed === false &&
    row.storedFlagRowsConsumed === false &&
    row.storedRootMapConsumed === false &&
    row.expectedRootSetConsumedForAssignment === false &&
    row.childIdStringConsumedForAssignment === false &&
    row.sourceVertexMetadataConsumed === true &&
    row.sourceEdgeMetadataConsumed === true
  );
}

function getFunctionText(source: string, functionName: string): string {
  const starts: Array<{ name: string; index: number }> = [];
  const matcher = /(?:^|\n)(?:export\s+)?function\s+([A-Za-z0-9_]+)/g;
  let match = matcher.exec(source);

  while (match) {
    starts.push({ name: match[1], index: match.index });
    match = matcher.exec(source);
  }

  const targetIndex = starts.findIndex((start) => start.name === functionName);

  if (targetIndex === -1) {
    return '';
  }

  const start = starts[targetIndex];
  const end = starts[targetIndex + 1]?.index ?? source.length;

  return source.slice(start.index, end);
}

function stripBenignBooleanFalseMentions(text: string, propertyNames: string[]): string {
  return propertyNames.reduce(
    (current, propertyName) => current.replace(new RegExp(`${propertyName}\\s*:\\s*false`, 'g'), ''),
    text,
  );
}

function readTextFile(filePath: string): string {
  const fs = require('node:fs') as { readFileSync: (path: string, encoding: 'utf8') => string };

  return fs.readFileSync(filePath, 'utf8');
}

function joinPath(...parts: string[]): string {
  const path = require('node:path') as { join: (...values: string[]) => string };

  return path.join(...parts);
}

function hasAssignmentLeak(findings: WGateRootFrameStaticFindingV0[], tokens: string[]): boolean {
  return findings.some(
    (finding) =>
      !finding.ok &&
      finding.usage === 'used-for-assignment' &&
      tokens.every((token) => finding.pattern.toLowerCase().includes(token)),
  );
}

function setEquals<TValue>(left: Set<TValue>, right: Set<TValue>): boolean {
  return left.size === right.size && [...left].every((value) => right.has(value));
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
}

function defaultCompetitorContextSummary(): WGateRootFrameCompetitorContextSummaryV0 {
  return {
    status: 'not-provided-to-builder',
    workspacePath: null,
    branch: null,
    head: null,
    dirtyStatus: [],
    relevantArtifacts: [],
    notes: [
      'The implementer must perform the required read-only competitor/worktree check before editing; this builder does not mutate or inspect the shared worktree by default.',
    ],
  };
}
