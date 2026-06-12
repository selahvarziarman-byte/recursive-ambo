import {
  buildHubLayerSourceStateCapsuleV0Report,
  type HubLayerAntipodalFlagAxisV0,
  type HubLayerFlagStateV0,
  type HubLayerSourceStateCapsuleV0Report,
} from './hubLayerSourceStateCapsuleV0';
import {
  buildGeneratedSiteReadingV0Report,
  type GeneratedSiteReadingV0,
  type GeneratedSiteReadingV0Report,
} from './generatedSiteReadingV0';

/**
 * Station IV-B, Run 2 -- honest source-state reading (consumption adaptation).
 *
 * IV-A closed NEGATIVE (ratified): no fiber relation is field-active. This
 * module is the consumption adaptation that unblocks the reading surface as an
 * HONEST SOURCE-STATE READER ONLY (entry order section 4.1; IV-A closing memo
 * section B.4), built to the hash-committed IV-B honesty contract. Each
 * displayed relation carries its ratified Gate-C.5 status visibly; nothing is
 * presented as field-active; the misleading-raw-field warning is mandatory on
 * carrier-ray/antipodal-axis; unsupported content renders visibly EMPTY.
 *
 * Consumes READ-ONLY: the hub-layer source-state capsule (source-state truth)
 * and GeneratedSiteReadingV0 (ONLY its honest non-field parts: geometry
 * witness, birth-law witness, naming prompt). The scalar field-witness claims
 * of the pre-campaign reading are NOT carried into the revised reading; the
 * pre-campaign reading itself is rendered, unaltered, as the BASELINE by the
 * dual-reading preview. No verdict is declared here -- D4 is the human's.
 */

export const HONEST_READING_METHOD = 'honest-source-state-reading-v0' as const;

export const IV_B_CONTRACT_HASH_ECHO =
  '95B20CB2831A76DE348A25DE4E9A1576D8083CC59B66479510EEB65F573052E1' as const;

export const IV_B_UNBLOCK_AUTHORITY =
  'station-iv-entry-order-4.1 + iv-a-closing-memo-B.4 (ratified): honest source-state reading only' as const;

/** Verbatim binding warning from the IV-B honesty contract. */
export const IV_B_BINDING_RAW_FIELD_WARNING =
  'the raw scalar field returns a SYSTEMATICALLY WRONG sign here (misleading-if-read-as-raw-field); the sign lives only in the source state -- do not read it from the field.' as const;

export const CUBE_DUAL_PROVENANCE_ONLY_WORDING =
  'cube-g1-as-cuboctahedral-medial-object-via-dual-provenance-only' as const;

export type HonestReadingSiteId =
  | 'M_AB'
  | 'M_AC'
  | 'M_AD'
  | 'M_BC'
  | 'M_BD'
  | 'M_CD';

export const HONEST_READING_SITE_IDS: HonestReadingSiteId[] = [
  'M_AB',
  'M_AC',
  'M_AD',
  'M_BC',
  'M_BD',
  'M_CD',
];

export type HonestRelationId =
  | 'ordered-flag-identity'
  | 'signed-fano-lift'
  | 'carrier-ray-antipodal-axis'
  | 'triangle-closure'
  | 'square-holonomy'
  | 'orientation-sign'
  | 'provenance-tetra-g2-core'
  | 'provenance-octa-g1'
  | 'provenance-cube-g1-dual'
  | 'cube-primal-sourcehood-boundary';

export const HONEST_RELATION_DISPLAY_ORDER: HonestRelationId[] = [
  'ordered-flag-identity',
  'signed-fano-lift',
  'carrier-ray-antipodal-axis',
  'triangle-closure',
  'square-holonomy',
  'orientation-sign',
  'provenance-tetra-g2-core',
  'provenance-octa-g1',
  'provenance-cube-g1-dual',
  'cube-primal-sourcehood-boundary',
];

export type HonestDisplayStatus =
  | 'tuple-projection-lost'
  | 'source-state-only'
  | 'unsupported';

/**
 * The per-relation ratified display statuses (IV-B honesty contract rule;
 * statuses from the ratified IV-A closing-memo matrix -- the reading may claim
 * ONLY this).
 */
export const IV_B_HONESTY_CONTRACT_STATUSES: Record<HonestRelationId, HonestDisplayStatus> = {
  'ordered-flag-identity': 'tuple-projection-lost',
  'signed-fano-lift': 'tuple-projection-lost',
  'carrier-ray-antipodal-axis': 'source-state-only',
  'triangle-closure': 'tuple-projection-lost',
  'square-holonomy': 'tuple-projection-lost',
  'orientation-sign': 'tuple-projection-lost',
  'provenance-tetra-g2-core': 'unsupported',
  'provenance-octa-g1': 'unsupported',
  'provenance-cube-g1-dual': 'unsupported',
  'cube-primal-sourcehood-boundary': 'unsupported',
};

export const HONEST_RELATION_LABELS: Record<HonestRelationId, string> = {
  'ordered-flag-identity': 'ordered flag identity',
  'signed-fano-lift': 'signed fano lift',
  'carrier-ray-antipodal-axis': 'carrier-ray / antipodal axis',
  'triangle-closure': 'triangle closure',
  'square-holonomy': 'square holonomy',
  'orientation-sign': 'orientation sign',
  'provenance-tetra-g2-core': 'provenance tetra-G2-core',
  'provenance-octa-g1': 'provenance octa-G1',
  'provenance-cube-g1-dual': 'provenance cube-G1-dual',
  'cube-primal-sourcehood-boundary': 'cube-primal-sourcehood boundary',
};

export interface HonestRelationRowV0 {
  relationId: HonestRelationId;
  relationLabel: string;
  structureSummary: string;
  statusToken: HonestDisplayStatus;
  warningLines: string[];
  renderedEmpty: boolean;
  emptyMarker: string | null;
}

export interface HonestSourceStateReadingV0 {
  siteId: HonestReadingSiteId;
  geometryLine: string;
  geometryRoleLine: string;
  birthLawLine: string;
  birthLawSummaryLine: string;
  relationRows: HonestRelationRowV0[];
  namingLines: string[];
  sovereigntyLine: string;
  scopeLines: string[];
}

export interface HonestSourceStateReadingV0Issue {
  code: string;
  message: string;
}

export interface HonestSourceStateReadingV0Report {
  reportId: string;
  method: typeof HONEST_READING_METHOD;
  unblockAuthority: typeof IV_B_UNBLOCK_AUTHORITY;
  contractHashEcho: typeof IV_B_CONTRACT_HASH_ECHO;
  fieldActiveStatus: 'nothing-field-active';
  verdictStatus: 'no-d4-verdict-declared-the-human-judges';
  semanticStatus: 'not-semantic-naming';
  topologyStatus: 'not-topology-workspace';
  packetWriteStatus: 'not-packet-writing';
  shapeMutationStatus: 'not-shape-mutation';
  uiStatus: 'no-new-ui-react-panel-adaptation-deferred';
  deferredWork: string[];
  consumedReports: {
    hubCapsule: { method: string; ok: boolean; integrityIssueCount: number };
    generatedSiteReading: { method: string; ok: boolean; issueCount: number };
  };
  readings: HonestSourceStateReadingV0[];
  integrityIssueCount: number;
  integrityIssues: HonestSourceStateReadingV0Issue[];
  ok: boolean;
}

// ---------------------------------------------------------------------------
// The single render channel (same-channel fairness lives here: BOTH the
// baseline and the revised cards are framed by this function, by both the
// preview and the display-assertion diagnostic).
// ---------------------------------------------------------------------------

export const CARD_HEADER_PREFIX = '>>> [' as const;
export const CARD_FOOTER_PREFIX = '<<< end [' as const;
export const CARD_BODY_INDENT = '  ' as const;

export function renderReadingCard(
  label: string,
  siteId: string,
  bodyLines: string[],
): string[] {
  return [
    `${CARD_HEADER_PREFIX}${label}] ${siteId}`,
    ...bodyLines.map((line) => `${CARD_BODY_INDENT}${line}`),
    `${CARD_FOOTER_PREFIX}${label}] ${siteId}`,
  ];
}

// ---------------------------------------------------------------------------
// Baseline artifact splitter (shared by the preview and the diagnostic so the
// partition of the auditor-provided artifact is identical in both).
// ---------------------------------------------------------------------------

export interface BaselineArtifactParts {
  allLines: string[];
  headerLines: string[];
  siteBlocks: Record<string, string[]>;
  footerLines: string[];
}

export function splitBaselineArtifact(captureText: string): BaselineArtifactParts {
  const allLines = captureText.replace(/\r\n/g, '\n').replace(/\n+$/, '').split('\n');
  const siteStartIndices: Array<{ siteId: string; index: number }> = [];

  allLines.forEach((line, index) => {
    const match = /^== (M_[A-D]{2}) /.exec(line);

    if (match) {
      siteStartIndices.push({ siteId: match[1], index });
    }
  });

  const footerStart = allLines.findIndex((line) =>
    line.startsWith('GeneratedSiteReadingV0 report footer'),
  );
  const firstSiteIndex = siteStartIndices.length
    ? siteStartIndices[0].index
    : allLines.length;
  const headerLines = allLines
    .slice(0, firstSiteIndex)
    .filter((line) => line.trim() !== '');
  const footerLines =
    footerStart >= 0
      ? allLines.slice(footerStart).filter((line) => line.trim() !== '')
      : [];
  const siteBlocks: Record<string, string[]> = {};

  siteStartIndices.forEach((entry, position) => {
    const blockEnd =
      position + 1 < siteStartIndices.length
        ? siteStartIndices[position + 1].index
        : footerStart >= 0
          ? footerStart
          : allLines.length;
    siteBlocks[entry.siteId] = allLines
      .slice(entry.index, blockEnd)
      .filter((line) => line.trim() !== '');
  });

  return { allLines, headerLines, siteBlocks, footerLines };
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

export function buildHonestSourceStateReadingV0Report(): HonestSourceStateReadingV0Report {
  const integrityIssues: HonestSourceStateReadingV0Issue[] = [];
  const pushIssue = (code: string, message: string): void => {
    integrityIssues.push({ code, message });
  };

  const capsule = buildHubLayerSourceStateCapsuleV0Report();
  const readingReport = buildGeneratedSiteReadingV0Report();

  if (!capsule.ok) {
    pushIssue('hub-capsule-not-ok', 'Hub-layer source-state capsule report is not ok.');
  }

  if (!readingReport.ok) {
    pushIssue(
      'generated-site-reading-not-ok',
      'GeneratedSiteReadingV0 report is not ok.',
    );
  }

  const readings = HONEST_READING_SITE_IDS.map((siteId) =>
    buildSiteReading({ siteId, capsule, readingReport, pushIssue }),
  );

  runIntegrityChecks(readings, pushIssue);

  return {
    reportId: `${HONEST_READING_METHOD}:one-ambo-tetrahedron:six-generated-midpoints`,
    method: HONEST_READING_METHOD,
    unblockAuthority: IV_B_UNBLOCK_AUTHORITY,
    contractHashEcho: IV_B_CONTRACT_HASH_ECHO,
    fieldActiveStatus: 'nothing-field-active',
    verdictStatus: 'no-d4-verdict-declared-the-human-judges',
    semanticStatus: 'not-semantic-naming',
    topologyStatus: 'not-topology-workspace',
    packetWriteStatus: 'not-packet-writing',
    shapeMutationStatus: 'not-shape-mutation',
    uiStatus: 'no-new-ui-react-panel-adaptation-deferred',
    deferredWork: [
      'react-panel-adaptation (FieldCueV0Panel / GeneratedSiteReadingV0Panel / display adapters) deferred until after the D4 sitting; recorded as remaining work',
    ],
    consumedReports: {
      hubCapsule: {
        method: capsule.method,
        ok: capsule.ok,
        integrityIssueCount: capsule.integrityIssueCount,
      },
      generatedSiteReading: {
        method: readingReport.method,
        ok: readingReport.ok,
        issueCount: readingReport.summary.issueCount,
      },
    },
    readings,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: integrityIssues.length === 0,
  };
}

function buildSiteReading(args: {
  siteId: HonestReadingSiteId;
  capsule: HubLayerSourceStateCapsuleV0Report;
  readingReport: GeneratedSiteReadingV0Report;
  pushIssue: (code: string, message: string) => void;
}): HonestSourceStateReadingV0 {
  const { siteId, capsule, readingReport, pushIssue } = args;
  const pairKey = sitePairKey(siteId);
  const baseReading = readingReport.readings.find(
    (reading) => reading.siteId === siteId,
  );

  if (!baseReading) {
    pushIssue('base-reading-missing', `No GeneratedSiteReadingV0 reading for ${siteId}.`);
  }

  const siteFlags = capsule.flagStates.filter(
    (state) => flagPairKey(state.flagId) === pairKey,
  );

  if (siteFlags.length !== 2) {
    pushIssue(
      'site-flag-count-mismatch',
      `Expected 2 ordered flags for ${siteId}, got ${siteFlags.length}.`,
    );
  }

  const forwardFlag =
    siteFlags.find((state) => state.flagId === forwardFlagId(siteId)) ?? siteFlags[0];
  const axis = forwardFlag
    ? capsule.antipodalAxes.find(
        (candidate) => candidate.axisId === forwardFlag.antipodalAxisId,
      )
    : undefined;

  if (!axis) {
    pushIssue('site-axis-missing', `No antipodal axis found for ${siteId}.`);
  }

  const siteFlagIds = new Set(siteFlags.map((state) => state.flagId));
  const closureRelations = capsule.triangleClosureRelations.filter((relation) =>
    relation.flagIds.some((flagId) => siteFlagIds.has(flagId)),
  );
  const holonomyRelations = capsule.squareHolonomyRelations.filter((relation) =>
    relation.canonicalFlagCycle.some((flagId) => siteFlagIds.has(flagId)),
  );

  const relationRows = HONEST_RELATION_DISPLAY_ORDER.map((relationId) =>
    buildRelationRow({
      relationId,
      siteId,
      capsule,
      siteFlags,
      axis,
      closureRelations,
      holonomyRelations,
      pushIssue,
    }),
  );

  // The naming prompt stays question-only. Secondary questions phrased in
  // pre-campaign field-activity terms ("field pressure", "field-world
  // participation") are dropped from the REVISED reading -- the ratified
  // statuses answered them; the BASELINE keeps them unaltered.
  const honestSecondaryQuestions = baseReading
    ? baseReading.humanNamingPrompt.secondaryNamingQuestions.filter(
        (question) => !/field pressure|field-world participation/i.test(question),
      )
    : [];
  const namingLines = baseReading
    ? [
        `naming: ${baseReading.humanNamingPrompt.primaryNamingQuestion}`,
        `secondary: ${formatList(honestSecondaryQuestions.slice(0, 3), 'none')}`,
        'forbidden: no auto-name; no packet write; no topology; no final semantic assignment',
      ]
    : [];

  return {
    siteId,
    geometryLine: baseReading ? buildGeometryLine(baseReading) : 'geometry witness: n/a',
    geometryRoleLine: baseReading
      ? `geometry role: ${baseReading.geometryWitness.structuralRoleSummary}`
      : 'geometry role: n/a',
    birthLawLine: baseReading ? buildBirthLawLine(baseReading) : 'birth-law witness: n/a',
    birthLawSummaryLine: baseReading
      ? `birth-law summary: ${baseReading.atomicWitness.birthLawSummary}`
      : 'birth-law summary: n/a',
    relationRows,
    namingLines,
    sovereigntyLine: `sovereignty: source signature = ${capsule.tupleReductionDeclaration.sourceSignatureStatus} | emitted tuple = ${capsule.tupleReductionDeclaration.emittedTupleStatus}`,
    scopeLines: [
      'scope: honest source-state reading | every relation shows its ratified status | nothing-field-active',
      `unblock authority: ${IV_B_UNBLOCK_AUTHORITY}`,
    ],
  };
}

function buildRelationRow(args: {
  relationId: HonestRelationId;
  siteId: HonestReadingSiteId;
  capsule: HubLayerSourceStateCapsuleV0Report;
  siteFlags: HubLayerFlagStateV0[];
  axis: HubLayerAntipodalFlagAxisV0 | undefined;
  closureRelations: HubLayerSourceStateCapsuleV0Report['triangleClosureRelations'];
  holonomyRelations: HubLayerSourceStateCapsuleV0Report['squareHolonomyRelations'];
  pushIssue: (code: string, message: string) => void;
}): HonestRelationRowV0 {
  const {
    relationId,
    siteId,
    capsule,
    siteFlags,
    axis,
    closureRelations,
    holonomyRelations,
  } = args;
  const statusToken = IV_B_HONESTY_CONTRACT_STATUSES[relationId];
  const relationLabel = HONEST_RELATION_LABELS[relationId];
  const emptyRow = (emptyMarker: string): HonestRelationRowV0 => ({
    relationId,
    relationLabel,
    structureSummary: '',
    statusToken,
    warningLines: [],
    renderedEmpty: true,
    emptyMarker,
  });

  switch (relationId) {
    case 'ordered-flag-identity': {
      const summary = siteFlags
        .map((state) => `${state.flagId} (${state.orderedIdentityStatus})`)
        .join('; ');

      return {
        relationId,
        relationLabel,
        structureSummary: `two distinct ordered flag states: ${summary}`,
        statusToken,
        warningLines: [],
        renderedEmpty: false,
        emptyMarker: null,
      };
    }

    case 'signed-fano-lift': {
      const summary = siteFlags
        .map(
          (state) =>
            `${state.flagId} = ${state.recomputedSignedLiftLabel} (${state.transportedSignIdentityStatus})`,
        )
        .join('; ');

      return {
        relationId,
        relationLabel,
        structureSummary: `recomputed signed lifts: ${summary}`,
        statusToken,
        warningLines: [],
        renderedEmpty: false,
        emptyMarker: null,
      };
    }

    case 'carrier-ray-antipodal-axis': {
      const rayGroup = axis
        ? capsule.rayGroups.find((group) => group.carrierRay === axis.carrierRay)
        : undefined;
      const partnerSites = rayGroup
        ? uniqueSorted(
            rayGroup.flagIds
              .map((flagId) => siteIdForFlag(flagId))
              .filter((candidate) => candidate !== siteId),
          )
        : [];
      const partnerNote = partnerSites.length
        ? `; ray shared with ${partnerSites.join(', ')}`
        : '';
      const summary = axis
        ? `${axis.flagIds[0]} <-> ${axis.flagIds[1]} on ${axis.carrierRay}: ${axis.recomputedOppositionStatus}, ${axis.rootNegationStatus}; signed lift pair ${axis.signedLiftPair.join(' / ')}${partnerNote}`
        : 'axis unavailable';

      return {
        relationId,
        relationLabel,
        structureSummary: summary,
        statusToken,
        warningLines: [`WARNING (binding): ${IV_B_BINDING_RAW_FIELD_WARNING}`],
        renderedEmpty: false,
        emptyMarker: null,
      };
    }

    case 'triangle-closure': {
      const ids = closureRelations.map((relation) => relation.relationId);
      const agreementCount = closureRelations.reduce(
        (sum, relation) => sum + relation.agreementCount,
        0,
      );
      const rowCount = closureRelations.reduce(
        (sum, relation) => sum + relation.rowCount,
        0,
      );

      return {
        relationId,
        relationLabel,
        structureSummary: `member of ${closureRelations.length} closure relations (${formatList(ids, 'none')}); recomputed ordered products agree ${agreementCount}/${rowCount}`,
        statusToken,
        warningLines: [],
        renderedEmpty: false,
        emptyMarker: null,
      };
    }

    case 'square-holonomy': {
      const ids = holonomyRelations.map((relation) => relation.relationId);
      const agreementCount = holonomyRelations.reduce(
        (sum, relation) => sum + relation.agreementCount,
        0,
      );
      const rowCount = holonomyRelations.reduce(
        (sum, relation) => sum + relation.rowCount,
        0,
      );

      return {
        relationId,
        relationLabel,
        structureSummary: `member of ${holonomyRelations.length} holonomy relations (${formatList(ids, 'none')}); recomputed left-associated products agree ${agreementCount}/${rowCount}`,
        statusToken,
        warningLines: [],
        renderedEmpty: false,
        emptyMarker: null,
      };
    }

    case 'orientation-sign': {
      const siteFlagIds = new Set(siteFlags.map((state) => state.flagId));
      let orientedRowCount = 0;
      let orientedAgreementCount = 0;

      for (const relation of closureRelations) {
        for (const row of relation.orderedProductRows) {
          const touchesSite =
            siteFlagIds.has(row.leftFlagId) ||
            siteFlagIds.has(row.rightFlagId) ||
            siteFlagIds.has(row.targetFlagId);

          if (touchesSite) {
            orientedRowCount += 1;

            if (row.productAgreementStatus === 'agrees-with-upstream') {
              orientedAgreementCount += 1;
            }
          }
        }
      }

      const liftSigns = siteFlags
        .map((state) => `${state.flagId}: ${state.recomputedSignedLift.sign}`)
        .join('; ');

      return {
        relationId,
        relationLabel,
        structureSummary: `lift signs ${liftSigns}; ordered-product rows touching this site ${orientedRowCount} (agree ${orientedAgreementCount}/${orientedRowCount})`,
        statusToken,
        warningLines: [],
        renderedEmpty: false,
        emptyMarker: null,
      };
    }

    case 'provenance-tetra-g2-core':
      return emptyRow('(empty)');

    case 'provenance-octa-g1':
      return emptyRow('(empty)');

    case 'provenance-cube-g1-dual':
      return emptyRow(`(empty; ${CUBE_DUAL_PROVENANCE_ONLY_WORDING})`);

    case 'cube-primal-sourcehood-boundary':
      return emptyRow(`(empty; ${CUBE_DUAL_PROVENANCE_ONLY_WORDING})`);

    default: {
      args.pushIssue('unknown-relation-id', String(relationId));

      return emptyRow('(empty)');
    }
  }
}

// ---------------------------------------------------------------------------
// Revised card body (same line discipline as the baseline card)
// ---------------------------------------------------------------------------

export function buildRevisedCardBodyLines(
  reading: HonestSourceStateReadingV0,
): string[] {
  const lines: string[] = [
    reading.scopeLines[0],
    reading.geometryLine,
    reading.geometryRoleLine,
    reading.birthLawLine,
    reading.birthLawSummaryLine,
  ];

  for (const row of reading.relationRows) {
    if (row.renderedEmpty) {
      lines.push(`${row.relationLabel}: [status: ${row.statusToken}] ${row.emptyMarker}`);
    } else {
      lines.push(`${row.relationLabel}: ${row.structureSummary} [status: ${row.statusToken}]`);
    }

    for (const warningLine of row.warningLines) {
      lines.push(warningLine);
    }
  }

  lines.push(reading.sovereigntyLine);
  lines.push(...reading.namingLines);
  lines.push(reading.scopeLines[1]);

  return lines;
}

// ---------------------------------------------------------------------------
// Integrity (well-formedness; the honesty contract is asserted mechanically by
// the display-assertion diagnostic over the RENDERED text)
// ---------------------------------------------------------------------------

function runIntegrityChecks(
  readings: HonestSourceStateReadingV0[],
  pushIssue: (code: string, message: string) => void,
): void {
  if (readings.length !== 6) {
    pushIssue('reading-count-mismatch', `Expected 6 readings, got ${readings.length}.`);
  }

  for (const reading of readings) {
    if (reading.relationRows.length !== HONEST_RELATION_DISPLAY_ORDER.length) {
      pushIssue(
        'relation-row-count-mismatch',
        `${reading.siteId}: expected ${HONEST_RELATION_DISPLAY_ORDER.length} relation rows, got ${reading.relationRows.length}.`,
      );
    }

    for (const row of reading.relationRows) {
      if (IV_B_HONESTY_CONTRACT_STATUSES[row.relationId] !== row.statusToken) {
        pushIssue(
          'status-token-contract-mismatch',
          `${reading.siteId}/${row.relationId}: status ${row.statusToken} does not match the contract.`,
        );
      }

      if (row.relationId === 'carrier-ray-antipodal-axis') {
        if (
          row.warningLines.length !== 1 ||
          !row.warningLines[0].includes(IV_B_BINDING_RAW_FIELD_WARNING)
        ) {
          pushIssue(
            'binding-warning-missing',
            `${reading.siteId}: the binding raw-field warning is missing from the axis row.`,
          );
        }
      } else if (row.warningLines.length !== 0) {
        pushIssue(
          'unexpected-warning-line',
          `${reading.siteId}/${row.relationId}: unexpected warning lines.`,
        );
      }

      if (row.renderedEmpty) {
        if (row.structureSummary !== '' || row.emptyMarker === null) {
          pushIssue(
            'null-row-not-empty',
            `${reading.siteId}/${row.relationId}: unsupported row must render visibly empty.`,
          );
        }
      } else if (row.emptyMarker !== null) {
        pushIssue(
          'non-null-row-has-empty-marker',
          `${reading.siteId}/${row.relationId}: non-null row carries an empty marker.`,
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function sitePairKey(siteId: HonestReadingSiteId): string {
  return siteId.replace('M_', '').split('').sort().join('');
}

function flagPairKey(flagId: string): string {
  return flagId.split('->').sort().join('');
}

function forwardFlagId(siteId: HonestReadingSiteId): string {
  const pair = siteId.replace('M_', '');

  return `${pair[0]}->${pair[1]}`;
}

function siteIdForFlag(flagId: string): string {
  return `M_${flagId.split('->').sort().join('')}`;
}

function buildGeometryLine(reading: GeneratedSiteReadingV0): string {
  const geometry = reading.geometryWitness;

  return `geometry witness: ${geometry.birthOperation} depth ${geometry.generationDepth} | edge ${
    geometry.sourceEdgeId ?? 'n/a'
  } | parents ${formatList(geometry.parentVertexIds)} | complement ${
    geometry.complementEdgeId ?? 'n/a'
  } | complement vertices ${formatList(geometry.complementEdgeVertexIds)} | antipode ${
    geometry.antipodalChildSiteId ?? 'n/a'
  } | status ${geometry.geometryWitnessStatus}`;
}

function buildBirthLawLine(reading: GeneratedSiteReadingV0): string {
  const birthLaw = reading.atomicWitness;

  return `birth-law witness: ${birthLaw.atomicWitnessStatus} | role ${
    birthLaw.childRole ?? 'n/a'
  } | grammar ${birthLaw.inheritanceGrammarId ?? 'n/a'} | merge ${
    birthLaw.mergeKind ?? 'n/a'
  } | projections ${formatList(birthLaw.projectionVertexIds)}`;
}

function formatList(values: string[], emptyLabel = 'n/a'): string {
  return values && values.length ? values.join(', ') : emptyLabel;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}
