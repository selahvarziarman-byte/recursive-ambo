import {
  buildMedialDualEquivariantCarrierPolicyModelCardV0Report,
  type MedialDualEquivariantCarrierPolicyModelCardV0Report,
} from './medialDualEquivariantCarrierPolicyModelCardV0';
import {
  buildOctonionVsA3MedialCarrierDiscriminatorV0Report,
  type OctonionVsA3MedialCarrierDiscriminatorV0Report,
} from './octonionVsA3MedialCarrierDiscriminatorV0';
import {
  buildStructuredSourceStateDiagnosticV0Report,
  type StructuredSourceStateDiagnosticV0Report,
} from './structuredSourceStateDiagnosticV0';
import {
  buildStructuredSourceStateMultiProjectionStructuralChannelV0Report,
  type StructuredSourceStateMultiProjectionStructuralChannelV0Report,
} from './structuredSourceStateMultiProjectionStructuralChannelV0';

export type MedialCarrierSurvivalBucket =
  | 'field-active-now'
  | 'structured-source-state'
  | 'metadata-only'
  | 'provenance-only'
  | 'lost-in-tuple-reduction'
  | 'blocked-unresolved';

export type MedialCarrierProjectionChannel =
  | 'scalar-emitted-tuple'
  | 'structural-channel'
  | 'propagation-behavior'
  | 'provenance-channel'
  | 'unresolved';

export type MedialCarrierPolicyObjectId =
  | 'a3-medial-flag-token'
  | 'ordered-flag-identity'
  | 'signed-fano-lift'
  | 'carrier-ray'
  | 'orientation-sign'
  | 'triangle-closure-relation'
  | 'square-holonomy-relation'
  | 'complete-quadrangle-gauge-robustness'
  | 'tetra-g2-core-provenance'
  | 'octa-g1-provenance'
  | 'cube-g1-provenance'
  | 'cube-primal-sourcehood-boundary';

export type MedialCarrierLocatorTier =
  | 'live-projected'
  | 'instantiated-structural'
  | 'record-only-metadata'
  | 'record-only-provenance'
  | 'named-as-lost'
  | 'not-locatable';

export type MedialCarrierProjectionMembership =
  | 'emitted-tuple'
  | 'propagation-projection'
  | 'structural-projection'
  | 'provenance-record'
  | 'none';

export interface MedialCarrierSourceStateSurvivalAuditV0Row {
  objectId: MedialCarrierPolicyObjectId;
  objectLabel: string;
  survivalBucket: MedialCarrierSurvivalBucket;
  projectionChannel: MedialCarrierProjectionChannel;
  locatorTier: MedialCarrierLocatorTier;
  derivationBasis: string[];
  caveats: string[];
}

export interface MedialCarrierSourceStateSurvivalAuditV0Issue {
  code: string;
  message: string;
}

export interface MedialCarrierSourceStateSurvivalAuditV0Report {
  method: 'medial-carrier-source-state-survival-audit-v0';
  diagnosticScope: 'station-i-carrier-policy-source-state-survival-classification-only';
  consumedReports: {
    discriminator: { method: string; ok: boolean; issueCount: number };
    modelCard: { method: string; ok: boolean; issueCount: number };
    structuredSourceState: { method: string; ok: boolean; issueCount: number };
    multiProjection: { method: string; ok: boolean; issueCount: number };
  };
  regimeAmendmentStatus: 'structured-source-state-regime-not-amended';
  fieldCueUnblockStatus: 'not-authorized';
  s0Status: 'not-authorized';
  uiStatus: 'no-ui';
  shapeMutationStatus: 'no-shape-mutation';
  packetWriteStatus: 'no-packet-write';
  operationRegistryStatus: 'not-operation-registry-work';
  topologyStatus: 'not-topology-workspace';
  rows: MedialCarrierSourceStateSurvivalAuditV0Row[];
  bucketCounts: Record<MedialCarrierSurvivalBucket, number>;
  channelCounts: Record<MedialCarrierProjectionChannel, number>;
  sourceStateRealCount: number;
  sideTableCount: number;
  orphanCount: number;
  baseSurvives: boolean;
  fiberSurvives: boolean;
  decisionD1Rule: typeof DECISION_D1_RULE;
  decisionD1Triggered: boolean;
  sourceStateRealVerdict: string;
  integrityIssueCount: number;
  integrityIssues: MedialCarrierSourceStateSurvivalAuditV0Issue[];
  ok: boolean;
}

interface CarrierReports {
  disc: OctonionVsA3MedialCarrierDiscriminatorV0Report;
  card: MedialDualEquivariantCarrierPolicyModelCardV0Report;
}

interface SourceStateReports {
  sss: StructuredSourceStateDiagnosticV0Report;
  mp: StructuredSourceStateMultiProjectionStructuralChannelV0Report;
}

interface ExtractorResult {
  citations: string[];
  evidenceRowCount: number;
  upstreamDeclaredUnresolved?: string;
  payload?: unknown;
  caveats: string[];
}

interface RayGroup {
  carrierRay: string;
  pairKeys: string[];
}

interface PairSignSet {
  pairKey: string;
  carrierRay: string;
  signs: string[];
}

interface LocatorOutcome {
  tier: Exclude<MedialCarrierLocatorTier, 'not-locatable'>;
  membership: MedialCarrierProjectionMembership;
  citation: string;
}

interface LocatorResult {
  outcomes: LocatorOutcome[];
  basisNotes: string[];
  caveats: string[];
}

interface CarrierPolicyObjectDefinition {
  objectId: MedialCarrierPolicyObjectId;
  objectLabel: string;
  extract: (carrier: CarrierReports) => ExtractorResult;
  locate: (sourceState: SourceStateReports, evidence: ExtractorResult) => LocatorResult;
}

const METHOD = 'medial-carrier-source-state-survival-audit-v0' as const;
const DIAGNOSTIC_SCOPE =
  'station-i-carrier-policy-source-state-survival-classification-only' as const;
const DECISION_D1_RULE =
  'medial-dual-not-instantiated-source-state-real: base AND Fano fiber must both reach field-active-now/structured-source-state' as const;

const SURVIVAL_BUCKETS: readonly MedialCarrierSurvivalBucket[] = [
  'field-active-now',
  'structured-source-state',
  'metadata-only',
  'provenance-only',
  'lost-in-tuple-reduction',
  'blocked-unresolved',
];

const PROJECTION_CHANNELS: readonly MedialCarrierProjectionChannel[] = [
  'scalar-emitted-tuple',
  'structural-channel',
  'propagation-behavior',
  'provenance-channel',
  'unresolved',
];

const SOURCE_STATE_REAL_BUCKETS: readonly MedialCarrierSurvivalBucket[] = [
  'field-active-now',
  'structured-source-state',
];

const SIDE_TABLE_BUCKETS: readonly MedialCarrierSurvivalBucket[] = [
  'metadata-only',
  'provenance-only',
];

const ORPHAN_BUCKETS: readonly MedialCarrierSurvivalBucket[] = [
  'lost-in-tuple-reduction',
  'blocked-unresolved',
];

const TIER_RANK: Record<MedialCarrierLocatorTier, number> = {
  'live-projected': 5,
  'instantiated-structural': 4,
  'record-only-metadata': 3,
  'record-only-provenance': 2,
  'named-as-lost': 1,
  'not-locatable': 0,
};

const TIER_TO_BUCKET: Record<
  Exclude<MedialCarrierLocatorTier, 'not-locatable'>,
  MedialCarrierSurvivalBucket
> = {
  'live-projected': 'field-active-now',
  'instantiated-structural': 'structured-source-state',
  'record-only-metadata': 'metadata-only',
  'record-only-provenance': 'provenance-only',
  'named-as-lost': 'lost-in-tuple-reduction',
};

const MEMBERSHIP_TO_CHANNEL: Record<
  MedialCarrierProjectionMembership,
  MedialCarrierProjectionChannel
> = {
  'emitted-tuple': 'scalar-emitted-tuple',
  'propagation-projection': 'propagation-behavior',
  'structural-projection': 'structural-channel',
  'provenance-record': 'provenance-channel',
  none: 'unresolved',
};

const MEMBERSHIP_PRIORITY: readonly MedialCarrierProjectionMembership[] = [
  'emitted-tuple',
  'propagation-projection',
  'structural-projection',
  'provenance-record',
  'none',
];

const NOT_LOCATABLE_CAVEAT =
  'no representative locatable in the existing structured-source-state regime; regime amendment is forbidden at Station I - placement blocked, not fixable here (Decision D1 input)';
const GATE_C5_CAVEAT =
  'Gate C5: structural-channel visibility is a field-facing witness only under the declared multi-projection basis (multi-projection-source-state-v0), not raw-field-visible; capped at structured-source-state';
const MAX_CITED_MATCHES = 4;

// Region classification: maps a scan path inside the source-state reports to the
// fidelity tier and projection membership its content carries. First match wins;
// sub-region rules precede state-body defaults. Paths not matching any rule are
// bookkeeping (statuses, anonymized detector input, scores) and yield no outcome.
const REGION_RULES: ReadonlyArray<{
  pathFragment: string;
  tier: Exclude<MedialCarrierLocatorTier, 'not-locatable'>;
  membership: MedialCarrierProjectionMembership;
}> = [
  { pathFragment: '.lostStructure', tier: 'named-as-lost', membership: 'none' },
  { pathFragment: '.lostByScalarTupleProjection', tier: 'named-as-lost', membership: 'none' },
  { pathFragment: '.metadataOnlyStructure', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.metadataOnlyFacts', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.reducedStructure', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.neutralAxes', tier: 'record-only-metadata', membership: 'none' },
  {
    pathFragment: '.structuralFactsBeforeReduction',
    tier: 'record-only-metadata',
    membership: 'none',
  },
  { pathFragment: '.derivationComponent', tier: 'record-only-provenance', membership: 'provenance-record' },
  { pathFragment: '.fieldActiveStructure', tier: 'live-projected', membership: 'emitted-tuple' },
  { pathFragment: '.fieldActiveFacts', tier: 'live-projected', membership: 'emitted-tuple' },
  { pathFragment: '.emittedTuple', tier: 'live-projected', membership: 'emitted-tuple' },
  { pathFragment: '.orientationConvention', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.polarityConvention', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.baselineComparison', tier: 'record-only-metadata', membership: 'none' },
  {
    pathFragment: '.propagationProjection',
    tier: 'live-projected',
    membership: 'propagation-projection',
  },
  {
    pathFragment: '.structuralProjection',
    tier: 'instantiated-structural',
    membership: 'structural-projection',
  },
  {
    pathFragment: '.structuralOperations',
    tier: 'instantiated-structural',
    membership: 'structural-projection',
  },
  {
    pathFragment: '.antipodalRelationVisibilityRows',
    tier: 'instantiated-structural',
    membership: 'structural-projection',
  },
  { pathFragment: '.complementAxes', tier: 'instantiated-structural', membership: 'structural-projection' },
  {
    pathFragment: '.antipodalCovarianceAudit',
    tier: 'instantiated-structural',
    membership: 'structural-projection',
  },
  {
    pathFragment: '.complementInvolutionAudit',
    tier: 'instantiated-structural',
    membership: 'structural-projection',
  },
  {
    pathFragment: '.structuralCovarianceAudit',
    tier: 'instantiated-structural',
    membership: 'structural-projection',
  },
  {
    pathFragment: '.incidenceProjectionRelations',
    tier: 'instantiated-structural',
    membership: 'none',
  },
  { pathFragment: '.primalStates', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.generatedChildStates', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.generatedChildProjections', tier: 'instantiated-structural', membership: 'none' },
  {
    pathFragment: '.unknownFeatureRetentionAudit',
    tier: 'instantiated-structural',
    membership: 'none',
  },
];

const STATE_REFERENCE_PATTERN =
  /^(?:[A-D]{2}|M_[A-D]{2}|edge-state:[A-D]{2}|primal-state:[A-D]|axis:[A-D]{2}-[A-D]{2})$/;

export function buildMedialCarrierSourceStateSurvivalAuditV0Report(): MedialCarrierSourceStateSurvivalAuditV0Report {
  const disc = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();
  const card = buildMedialDualEquivariantCarrierPolicyModelCardV0Report();
  const sss = buildStructuredSourceStateDiagnosticV0Report();
  const mp = buildStructuredSourceStateMultiProjectionStructuralChannelV0Report();
  const carrier: CarrierReports = { disc, card };
  const sourceState: SourceStateReports = { sss, mp };
  const integrityIssues: MedialCarrierSourceStateSurvivalAuditV0Issue[] = [];
  const rows: MedialCarrierSourceStateSurvivalAuditV0Row[] = [];

  for (const definition of buildRegistry()) {
    const evidence = definition.extract(carrier);

    if (evidence.evidenceRowCount <= 0) {
      integrityIssues.push({
        code: `extractor-evidence-missing:${definition.objectId}`,
        message: `Upstream carrier evidence for ${definition.objectId} is empty; classification is not derivable (mock-solution tripwire).`,
      });
    }

    const locator = definition.locate(sourceState, evidence);

    rows.push(classifyObject(definition, evidence, locator));
  }

  const bucketCounts = countByKey(SURVIVAL_BUCKETS, rows.map((row) => row.survivalBucket));
  const channelCounts = countByKey(
    PROJECTION_CHANNELS,
    rows.map((row) => row.projectionChannel),
  );
  const sourceStateRealCount = sumCounts(bucketCounts, SOURCE_STATE_REAL_BUCKETS);
  const sideTableCount = sumCounts(bucketCounts, SIDE_TABLE_BUCKETS);
  const orphanCount = sumCounts(bucketCounts, ORPHAN_BUCKETS);
  const baseSurvives = rowIsSourceStateReal(rows, 'carrier-ray');
  const fiberSurvives =
    rowIsSourceStateReal(rows, 'signed-fano-lift') &&
    rowIsSourceStateReal(rows, 'triangle-closure-relation') &&
    rowIsSourceStateReal(rows, 'square-holonomy-relation');
  const decisionD1Triggered = !(baseSurvives && fiberSurvives);
  const sourceStateRealVerdict = buildSourceStateRealVerdict({
    rows,
    sourceStateRealCount,
    sideTableCount,
    orphanCount,
    baseSurvives,
    fiberSurvives,
    decisionD1Triggered,
  });

  integrityIssues.push(
    ...buildIntegrityIssues({
      consumed: { disc, card, sss, mp },
      rows,
      bucketCounts,
      channelCounts,
      sourceStateRealCount,
      sideTableCount,
      orphanCount,
      baseSurvives,
      fiberSurvives,
      decisionD1Triggered,
      sourceStateRealVerdict,
    }),
  );

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    consumedReports: {
      discriminator: { method: disc.method, ok: disc.ok, issueCount: disc.issues.length },
      modelCard: { method: card.method, ok: card.ok, issueCount: card.issues.length },
      structuredSourceState: { method: sss.method, ok: sss.ok, issueCount: sss.issues.length },
      multiProjection: { method: mp.method, ok: mp.ok, issueCount: mp.integrityIssueCount },
    },
    regimeAmendmentStatus: 'structured-source-state-regime-not-amended',
    fieldCueUnblockStatus: 'not-authorized',
    s0Status: 'not-authorized',
    uiStatus: 'no-ui',
    shapeMutationStatus: 'no-shape-mutation',
    packetWriteStatus: 'no-packet-write',
    operationRegistryStatus: 'not-operation-registry-work',
    topologyStatus: 'not-topology-workspace',
    rows,
    bucketCounts,
    channelCounts,
    sourceStateRealCount,
    sideTableCount,
    orphanCount,
    baseSurvives,
    fiberSurvives,
    decisionD1Rule: DECISION_D1_RULE,
    decisionD1Triggered,
    sourceStateRealVerdict,
    integrityIssueCount: integrityIssues.length,
    integrityIssues,
    ok: integrityIssues.length === 0,
  };
}

function classifyObject(
  definition: CarrierPolicyObjectDefinition,
  evidence: ExtractorResult,
  locator: LocatorResult,
): MedialCarrierSourceStateSurvivalAuditV0Row {
  const lawCaveats: string[] = [];
  const cappedOutcomes = locator.outcomes.map((outcome) => {
    if (outcome.tier === 'live-projected' && outcome.membership === 'structural-projection') {
      lawCaveats.push(GATE_C5_CAVEAT);

      return { ...outcome, tier: 'instantiated-structural' as const };
    }

    return outcome;
  });
  const rankedOutcomes = [...cappedOutcomes].sort(compareOutcomes);
  const winner = rankedOutcomes[0];
  const winnerRank = winner ? TIER_RANK[winner.tier] : 0;
  const basis: string[] = evidence.citations.map((citation) => `extract: ${citation}`);
  let survivalBucket: MedialCarrierSurvivalBucket;
  let locatorTier: MedialCarrierLocatorTier;
  let membership: MedialCarrierProjectionMembership;

  if (
    winnerRank <= TIER_RANK['named-as-lost'] &&
    evidence.upstreamDeclaredUnresolved !== undefined
  ) {
    survivalBucket = 'blocked-unresolved';
    locatorTier = winner ? winner.tier : 'not-locatable';
    membership = 'none';
    basis.push(
      `locate-override: upstream declares "${evidence.upstreamDeclaredUnresolved}" - blocked-unresolved by declared boundary`,
    );

    if (winner) {
      lawCaveats.push(
        `low-tier match superseded by declared boundary: [${winner.tier}] ${winner.citation}`,
      );
    }
  } else if (winner) {
    survivalBucket = TIER_TO_BUCKET[winner.tier];
    locatorTier = winner.tier;
    membership = winner.membership;
    basis.push(
      `locate: ${rankedOutcomes.length} match(es); winning [${winner.tier}] ${winner.citation}`,
    );

    for (const outcome of rankedOutcomes.slice(1, MAX_CITED_MATCHES)) {
      if (TIER_RANK[outcome.tier] === winnerRank) {
        basis.push(`locate: also at winning tier [${outcome.tier}] ${outcome.citation}`);
      }
    }

    for (const outcome of rankedOutcomes) {
      if (TIER_RANK[outcome.tier] < winnerRank) {
        lawCaveats.push(
          `lower-tier match not flattened: [${outcome.tier}] ${outcome.citation}`,
        );
      }
    }

    if (membership === 'structural-projection') {
      lawCaveats.push(GATE_C5_CAVEAT);
    }

    if (membership === 'none') {
      lawCaveats.push(
        'no projection membership: the located representative is carried by no projection (channel=unresolved)',
      );
    }
  } else {
    survivalBucket = 'blocked-unresolved';
    locatorTier = 'not-locatable';
    membership = 'none';
    basis.push(
      'locate: no representative matched any predicate over declared source-state regions (not-locatable)',
    );
    lawCaveats.push(NOT_LOCATABLE_CAVEAT);
  }

  basis.push(`projection-membership: ${membership}`);
  basis.push(...locator.basisNotes);

  return {
    objectId: definition.objectId,
    objectLabel: definition.objectLabel,
    survivalBucket,
    projectionChannel: MEMBERSHIP_TO_CHANNEL[membership],
    locatorTier,
    derivationBasis: basis,
    caveats: dedupeStrings([...evidence.caveats, ...locator.caveats, ...capCaveats(lawCaveats)]),
  };
}

function capCaveats(caveats: string[]): string[] {
  const lowerTier = caveats.filter((caveat) => caveat.startsWith('lower-tier match not flattened:'));
  const rest = caveats.filter((caveat) => !caveat.startsWith('lower-tier match not flattened:'));

  if (lowerTier.length <= 3) {
    return caveats;
  }

  return [
    ...rest,
    ...lowerTier.slice(0, 3),
    `lower-tier matches not flattened: ${lowerTier.length - 3} further match(es) omitted from caveat list`,
  ];
}

function compareOutcomes(left: LocatorOutcome, right: LocatorOutcome): number {
  const rankDelta = TIER_RANK[right.tier] - TIER_RANK[left.tier];

  if (rankDelta !== 0) {
    return rankDelta;
  }

  const membershipDelta =
    MEMBERSHIP_PRIORITY.indexOf(left.membership) - MEMBERSHIP_PRIORITY.indexOf(right.membership);

  if (membershipDelta !== 0) {
    return membershipDelta;
  }

  return left.citation < right.citation ? -1 : left.citation > right.citation ? 1 : 0;
}

function buildRegistry(): CarrierPolicyObjectDefinition[] {
  return [
    {
      objectId: 'a3-medial-flag-token',
      objectLabel: 'A3 medial flag token',
      extract: ({ disc, card }) => ({
        citations: [
          `disc.flagRows: ${disc.flagRows.length} rows, ${distinctCount(
            disc.flagRows.map((row) => row.flagId),
          )} distinct flagIds, status='${disc.flagRows[0]?.status ?? 'missing'}', sample=[${disc.flagRows
            .slice(0, 3)
            .map((row) => row.flagId)
            .join(', ')}]`,
          `card.evidenceSnapshot.flagCount=${card.evidenceSnapshot.flagCount}, distinctFlagCount=${card.evidenceSnapshot.distinctFlagCount}`,
        ],
        evidenceRowCount: disc.flagRows.length,
        caveats: [],
      }),
      locate: (sourceState, evidence) => {
        const orderedTokenMatches = scanSourceState(sourceState, (value) =>
          /^[A-D]->[A-D]$/.test(value),
        );
        const signatureMatches = findObjectsWithKeyPair(sourceState, [
          'sharedPrimalVertex',
          'omittedPrimalVertex',
        ]);
        const mentionMatches = scanSourceState(sourceState, (value) =>
          /\bflag\b|medial flag/i.test(value),
        );
        const outcomes = [
          ...toOutcomes(orderedTokenMatches),
          ...toOutcomes(signatureMatches),
          ...toOutcomes(mentionMatches),
        ];
        const caveats: string[] = [];
        const shadow = computeFlagIngredientShadow(sourceState, evidence);

        if (shadow.allFlagsHaveIngredientShadow) {
          caveats.push(
            `ingredient shadow present for all ${shadow.flagCount} flags: the two G1 edge states sharing the flag's shared vertex and omitting its omitted vertex exist (e.g. ${shadow.example}) - ingredients are not the token; not a representative`,
          );
        }

        return {
          outcomes,
          basisNotes: [
            `locator-predicate: full-string /^[A-D]->[A-D]$/ over declared regions: ${orderedTokenMatches.length} match(es); ordered-pair signature objects (sharedPrimalVertex+omittedPrimalVertex keys): ${signatureMatches.length}; flag-token prose mentions: ${mentionMatches.length}`,
          ],
          caveats,
        };
      },
    },
    {
      objectId: 'ordered-flag-identity',
      objectLabel: 'ordered flag identity',
      extract: ({ disc }) => ({
        citations: [
          `disc.summary.distinctFlagCount=${disc.summary.distinctFlagCount} vs distinctSignedLiftCount=${disc.summary.distinctSignedLiftCount} (ordered identity exceeds bare-lift quotient)`,
          `disc.signedLiftRows[*].quotientIdentityStatus='${
            disc.signedLiftRows[0]?.quotientIdentityStatus ?? 'missing'
          }' (${disc.signedLiftRows.length} rows)`,
        ],
        evidenceRowCount: disc.signedLiftRows.length,
        caveats: [],
      }),
      locate: (sourceState) => {
        const canonicalEdgeIds = new Set(
          sourceState.sss.generatedChildStates.map((state) => state.edgeStateId),
        );
        const twoLetterMatches = scanSourceState(sourceState, (value) =>
          /^[A-D]{2}$/.test(value),
        );
        const reversedSpellingMatches = twoLetterMatches.filter((match) => {
          const reversed = match.value.split('').reverse().join('');

          return !canonicalEdgeIds.has(match.value) && canonicalEdgeIds.has(reversed);
        });
        const orderedTokenMatches = scanSourceState(sourceState, (value) =>
          /^[A-D]->[A-D]$/.test(value),
        );
        const conventionOutcome: LocatorOutcome = {
          tier: 'record-only-metadata',
          membership: 'none',
          citation: `sss.orientationConvention: id='${sourceState.sss.orientationConvention.orientationConventionId}', orientationActive=${sourceState.sss.orientationConvention.orientationActive}, summary="${sourceState.sss.orientationConvention.conventionSummary}"`,
        };
        const outcomes = [
          ...toOutcomes(reversedSpellingMatches),
          ...toOutcomes(orderedTokenMatches),
          conventionOutcome,
        ];
        const polaritySample = sourceState.mp.structuralProjections[0];
        const caveats = [
          `conflation guard: mp.structuralProjections polarity/starSign (e.g. ${polaritySample ? `${polaritySample.edgeStateId}: ${polaritySample.polarity}, starSign=${polaritySample.starSign}` : 'none present'}) distinguishes the two edges of a complement axis, not the two orders of one flag - analogous-but-distinct, not a representative`,
        ];

        return {
          outcomes,
          basisNotes: [
            `locator-predicate: reversed two-letter spellings (value reversed-of-canonical, not canonical): ${reversedSpellingMatches.length} match(es) among ${twoLetterMatches.length} two-letter identities; ordered tokens: ${orderedTokenMatches.length}; orientation-convention record located by navigation`,
          ],
          caveats,
        };
      },
    },
    {
      objectId: 'signed-fano-lift',
      objectLabel: 'signed Fano lift',
      extract: ({ disc, card }) => ({
        citations: [
          `disc.signedLiftRows: ${disc.signedLiftRows.length} signed lifts, ${distinctCount(
            disc.signedLiftRows.map((row) => row.signedLift),
          )} distinct, sample=[${disc.signedLiftRows
            .slice(0, 4)
            .map((row) => `${row.flagId}=${row.signedLift}`)
            .join(', ')}]`,
          `card.evidenceSnapshot.signedLiftFlagCount=${card.evidenceSnapshot.signedLiftFlagCount}, distinctSignedLiftCount=${card.evidenceSnapshot.distinctSignedLiftCount}`,
        ],
        evidenceRowCount: disc.signedLiftRows.length,
        caveats: [],
      }),
      locate: (sourceState) => {
        const signedUnitMatches = scanSourceState(sourceState, (value) =>
          /^[+-]e[1-7]$/.test(value),
        );
        const mentionMatches = scanSourceState(sourceState, (value) =>
          /\bfano\b|signed lift|\boctonion/i.test(value),
        );
        const starSignBearingRows = sourceState.mp.structuralProjections.filter((projection) =>
          Number.isFinite(projection.starSign),
        );

        return {
          outcomes: [...toOutcomes(signedUnitMatches), ...toOutcomes(mentionMatches)],
          basisNotes: [
            `locator-predicate: full-string /^[+-]e[1-7]$/ over declared regions: ${signedUnitMatches.length} match(es); Fano/octonion/signed-lift prose mentions: ${mentionMatches.length}`,
          ],
          caveats: [
            `sign-without-unit: mp.structuralProjections carry starSign on ${starSignBearingRows.length} rows with no algebraic unit attached - not a lift representative (count-vs-structure guard)`,
          ],
        };
      },
    },
    {
      objectId: 'carrier-ray',
      objectLabel: 'carrier ray',
      extract: ({ disc }) => {
        const rayGroups = buildRayGroups(disc);

        return {
          citations: [
            `disc.signedLiftRows grouped by carrierRay: ${rayGroups
              .map((group) => `${group.carrierRay}<-{${group.pairKeys.join(',')}}`)
              .join('; ')} (pair-sets from orderedPrimalPair fields)`,
          ],
          evidenceRowCount: rayGroups.length,
          payload: rayGroups,
          caveats: [],
        };
      },
      locate: (sourceState, evidence) => {
        const rayGroups = (evidence.payload as RayGroup[] | undefined) ?? [];
        const outcomes: LocatorOutcome[] = [];
        const caveats: string[] = [];
        const basisNotes: string[] = [];

        for (const group of rayGroups) {
          const pairSet = new Set(group.pairKeys);
          const axis = sourceState.sss.complementAxes.find(
            (candidate) =>
              candidate.edgeStateIds.length === pairSet.size &&
              candidate.edgeStateIds.every((edgeId) => pairSet.has(edgeId)),
          );

          if (!axis) {
            caveats.push(
              `ray ${group.carrierRay} pair-set {${group.pairKeys.join(',')}} has no matching complement axis in sss.complementAxes`,
            );
            continue;
          }

          const covarianceRow = sourceState.sss.antipodalCovarianceAudit.rows.find(
            (row) => pairSet.has(row.edgeStateId) && pairSet.has(row.complementEdgeStateId),
          );
          const involutionRowsPass = axis.edgeStateIds.every((edgeId) =>
            sourceState.sss.complementInvolutionAudit.rows.some(
              (row) => row.edgeStateId === edgeId && row.involutionStatus === 'pass',
            ),
          );

          if (covarianceRow?.covarianceStatus === 'pass' && involutionRowsPass) {
            outcomes.push({
              tier: 'instantiated-structural',
              membership: 'structural-projection',
              citation: `${group.carrierRay} <-> ${axis.axisPairId} (pair-set {${group.pairKeys.join(',')}}) verified through sss.antipodalCovarianceAudit.covarianceStatus=pass and sss.complementInvolutionAudit.involutionStatus=pass`,
            });
          } else {
            caveats.push(
              `ray ${group.carrierRay} matched ${axis.axisPairId} but audit verification failed (covariance=${covarianceRow?.covarianceStatus ?? 'missing'}, involutionAllPass=${involutionRowsPass}) - correspondence downgraded to caveat, not a representative`,
            );
          }
        }

        const rayLabelMatches = scanSourceState(sourceState, (value) =>
          /^ray:e[1-7]$/.test(value),
        );

        basisNotes.push(
          `algebraicRayLabelLocated: ${rayLabelMatches.length > 0} (${
            rayLabelMatches.length > 0
              ? rayLabelMatches
                  .slice(0, MAX_CITED_MATCHES)
                  .map((match) => `${match.path}="${match.value}"`)
                  .join('; ')
              : 'ray:e_k label not found among declared source-state regions'
          }) - recorded separately from the axis-label correspondence`,
        );
        caveats.push(
          'label distinctness: the algebraic ray label (ray:e_k) and the edge-complement axis label (axis:XY-ZW) are distinct vocabularies; the located representative is the axis-pair structure, never a merged label',
        );
        outcomes.push(...toOutcomes(rayLabelMatches));

        return { outcomes, basisNotes, caveats };
      },
    },
    {
      objectId: 'orientation-sign',
      objectLabel: 'orientation sign',
      extract: ({ disc }) => {
        const pairSignSets = buildPairSignSets(disc);

        return {
          citations: [
            `disc.signedLiftRows per-unordered-pair sign-sets: ${pairSignSets
              .map((entry) => `${entry.pairKey}:{${entry.signs.join(',')}}`)
              .join('; ')} (both flag orders contribute)`,
          ],
          evidenceRowCount: pairSignSets.length,
          payload: pairSignSets,
          caveats: [],
        };
      },
      locate: (sourceState, evidence) => {
        const transport = runOrientationSignTransportTest(sourceState, evidence);
        const outcomes: LocatorOutcome[] = [];
        const caveats: string[] = [];
        const basisNotes = [
          `transportVerdict: ${transport.verdict} (${transport.detail})`,
          `sss.polarityConvention: id='${sourceState.sss.polarityConvention.polarityConventionId}', polarityActive=${sourceState.sss.polarityConvention.polarityActive}`,
        ];

        if (transport.verdict === 'transported-from-fano-lift') {
          outcomes.push({
            tier: 'instantiated-structural',
            membership: 'structural-projection',
            citation: `mp.structuralProjections starSign assignment is forced by upstream Fano signs (${transport.detail})`,
          });
        } else {
          caveats.push(
            `starSign/polarity on mp.structuralProjections is not a transport of the Fano lift sign (${transport.verdict}); located sign structure is caveat-only, not a representative (count-vs-structure guard / F1 precedent)`,
          );

          if (!sourceState.sss.polarityConvention.polarityActive) {
            caveats.push(
              `sss.polarityConvention.polarityActive=false ('${sourceState.sss.polarityConvention.polarityConventionId}') corroborates reconstruction`,
            );
          }
        }

        const mentionMatches = scanSourceState(sourceState, (value) =>
          /\borientation\b|\bpolarity\b|\bsign\b/i.test(value),
        );

        outcomes.push(...toOutcomes(mentionMatches));
        basisNotes.push(
          `locator-predicate: orientation/polarity/sign prose mentions over declared regions: ${mentionMatches.length} match(es)`,
        );

        return { outcomes, basisNotes, caveats };
      },
    },
    {
      objectId: 'triangle-closure-relation',
      objectLabel: 'triangle closure relation',
      extract: ({ disc, card }) => ({
        citations: [
          `disc.triangleClosureRows: ${disc.triangleClosureRows.length} ordered products over ${distinctCount(
            disc.triangleClosureRows.map((row) => row.triangleId),
          )} triangles, pass=${disc.triangleClosureRows.filter((row) => row.closureStatus === 'pass').length}, fail=${disc.triangleClosureRows.filter((row) => row.closureStatus === 'fail').length}`,
          `card.evidenceSnapshot.canonicalTriangleClosurePassCount=${card.evidenceSnapshot.canonicalTriangleClosurePassCount}`,
        ],
        evidenceRowCount: disc.triangleClosureRows.length,
        caveats: [],
      }),
      locate: (sourceState) => {
        const mentionMatches = scanSourceState(sourceState, (value) =>
          /\btriangle\b|\bclosure\b/i.test(value),
        );
        const relationRecords = collectRelationRecords(sourceState, 3, /product|closure/i);

        return {
          outcomes: [...toOutcomes(mentionMatches), ...toOutcomes(relationRecords)],
          basisNotes: [
            `locator-predicate: triangle/closure prose mentions: ${mentionMatches.length}; relation-record search (>=3 distinct state references + /product|closure/i keys) over declared regions: ${relationRecords.length} record(s)`,
          ],
          caveats: [
            buildLowArityCaveat(sourceState, 'three-term triangle closure'),
          ],
        };
      },
    },
    {
      objectId: 'square-holonomy-relation',
      objectLabel: 'square holonomy relation',
      extract: ({ disc, card }) => ({
        citations: [
          `disc.squareHolonomyRows: ${disc.squareHolonomyRows.length} orientation variants over ${distinctCount(
            disc.squareHolonomyRows.map((row) => row.squareCycleId),
          )} square cycles, pass=${disc.squareHolonomyRows.filter((row) => row.holonomyStatus === 'pass').length}, fail=${disc.squareHolonomyRows.filter((row) => row.holonomyStatus === 'fail').length}`,
          `card.evidenceSnapshot.squareHolonomyPassCount=${card.evidenceSnapshot.squareHolonomyPassCount}`,
        ],
        evidenceRowCount: disc.squareHolonomyRows.length,
        caveats: [],
      }),
      locate: (sourceState) => {
        const mentionMatches = scanSourceState(sourceState, (value) =>
          /\bsquare\b|\bholonomy\b/i.test(value),
        );
        const relationRecords = collectRelationRecords(sourceState, 4, /product|holonomy|cycle/i);

        return {
          outcomes: [...toOutcomes(mentionMatches), ...toOutcomes(relationRecords)],
          basisNotes: [
            `locator-predicate: square/holonomy prose mentions: ${mentionMatches.length}; relation-record search (>=4 distinct state references + /product|holonomy|cycle/i keys) over declared regions: ${relationRecords.length} record(s)`,
          ],
          caveats: [
            buildLowArityCaveat(sourceState, 'four-term square holonomy'),
          ],
        };
      },
    },
    {
      objectId: 'complete-quadrangle-gauge-robustness',
      objectLabel: 'complete quadrangle / gauge robustness',
      extract: ({ disc }) => ({
        citations: [
          `disc.fanoCompleteQuadrangleRows: ${disc.fanoCompleteQuadrangleRows.length} quadrangles x 24 labelings = ${disc.fanoCompleteQuadrangleRows.reduce(
            (sum, row) => sum + row.labelingCount,
            0,
          )}; failures: flagRecovery=${sumField(disc.fanoCompleteQuadrangleRows, 'flagRecoveryFailureCount')}, triangleClosure=${sumField(disc.fanoCompleteQuadrangleRows, 'triangleClosureFailureCount')}, squareHolonomy=${sumField(disc.fanoCompleteQuadrangleRows, 'squareHolonomyFailureCount')}, quotientLoss=${sumField(disc.fanoCompleteQuadrangleRows, 'quotientLossAnomalyCount')}`,
          `disc.summary.gaugeRobustnessStatus=${disc.summary.gaugeRobustnessStatus}`,
        ],
        evidenceRowCount: disc.fanoCompleteQuadrangleRows.length,
        caveats: [],
      }),
      locate: (sourceState) => {
        const mentionMatches = scanSourceState(sourceState, (value) =>
          /\bquadrangle\b|\bgauge\b/i.test(value),
        ).filter((match) => !match.path.includes('.structuralCovarianceAudit'));
        const unitSetMatches = scanSourceState(sourceState, (value) => /^e[1-7]$/.test(value));
        const relabelingIds = sourceState.sss.structuralCovarianceAudit.rows.map(
          (row) => row.relabelingId,
        );

        return {
          outcomes: [...toOutcomes(mentionMatches), ...toOutcomes(unitSetMatches)],
          basisNotes: [
            `locator-predicate: quadrangle/gauge mentions (structuralCovarianceAudit paths excluded by guard): ${mentionMatches.length}; algebra-unit enumeration leaves (/^e[1-7]$/): ${unitSetMatches.length}`,
          ],
          caveats: [
            `distinctness guard: sss.structuralCovarianceAudit enumerates S4 vertex relabelings [${relabelingIds.join(', ')}] - vertex relabeling is not Fano carrier gauge; analogous-but-distinct, not a representative`,
          ],
        };
      },
    },
    {
      objectId: 'tetra-g2-core-provenance',
      objectLabel: 'tetra G2-core provenance',
      extract: ({ disc, card }) => ({
        citations: [
          `disc.tetraG2CoreCuboctahedronBridge: status='${disc.tetraG2CoreCuboctahedronBridge.status}', g1CoreTopology=${disc.tetraG2CoreCuboctahedronBridge.g1CoreTopology}, g2CoreTopology=${disc.tetraG2CoreCuboctahedronBridge.g2CoreTopology}`,
          `card.evidenceSnapshot.tetraG2CoreCuboctahedronBridgeStatus=${card.evidenceSnapshot.tetraG2CoreCuboctahedronBridgeStatus}`,
        ],
        evidenceRowCount: disc.tetraG2CoreCuboctahedronBridge.status ? 1 : 0,
        caveats: [],
      }),
      locate: (sourceState) => {
        const mentionMatches = scanSourceState(sourceState, (value) =>
          /\bg2\b|second-ambo|\bcuboctahedron\b/i.test(value),
        );
        const derivationKinds = collectDerivationKinds(sourceState);

        return {
          outcomes: toOutcomes(mentionMatches),
          basisNotes: [
            `locator-predicate: G2/second-ambo/cuboctahedron mentions over declared regions: ${mentionMatches.length} match(es)`,
            `locator-context: sss.diagnosticScope='${sourceState.sss.diagnosticScope}', eventScopeStatus='${sourceState.sss.eventScopeStatus}', derivationKind set=[${derivationKinds.join(', ')}]`,
          ],
          caveats: [],
        };
      },
    },
    {
      objectId: 'octa-g1-provenance',
      objectLabel: 'octa G1 provenance',
      extract: ({ disc, card }) => ({
        citations: [
          `disc.cuboctahedronBridge: status='${disc.cuboctahedronBridge.status}', source='${disc.cuboctahedronBridge.source}', coreTopology=${disc.cuboctahedronBridge.coreTopology}, canApplyAmboToCuboctahedronCore=${disc.cuboctahedronBridge.canApplyAmboToCuboctahedronCore}`,
          `card.evidenceSnapshot.cuboctahedronBridgeStatus=${card.evidenceSnapshot.cuboctahedronBridgeStatus}`,
        ],
        evidenceRowCount: disc.cuboctahedronBridge.status ? 1 : 0,
        caveats: [],
      }),
      locate: (sourceState) => {
        const mentionMatches = scanSourceState(sourceState, (value) => /\bocta/i.test(value));

        return {
          outcomes: toOutcomes(mentionMatches),
          basisNotes: [
            `locator-predicate: octa/octahedron mentions over declared regions: ${mentionMatches.length} match(es)`,
            `locator-context: sss.sourceStateAlgebraId='${sourceState.sss.sourceStateAlgebraId}' (tetrahedral-scoped regime)`,
          ],
          caveats: [],
        };
      },
    },
    {
      objectId: 'cube-g1-provenance',
      objectLabel: 'cube G1 provenance',
      extract: ({ disc, card }) => ({
        citations: [
          `disc.cubeG1CuboctahedronBridge: status='${disc.cubeG1CuboctahedronBridge.status}', coreTopology=${disc.cubeG1CuboctahedronBridge.coreTopology}`,
          `disc.dualOctaCubeProvenance.cubeG1MedialHubStatus='${disc.dualOctaCubeProvenance.cubeG1MedialHubStatus}'`,
          `card.evidenceSnapshot.cubeG1CuboctahedronBridgeStatus=${card.evidenceSnapshot.cubeG1CuboctahedronBridgeStatus}`,
        ],
        evidenceRowCount: disc.cubeG1CuboctahedronBridge.status ? 1 : 0,
        caveats: [
          `upstream wording preserved: cube G1 reaches the medial hub via dual provenance only ('${disc.dualOctaCubeProvenance.cubeG1MedialHubStatus}')`,
        ],
      }),
      locate: (sourceState) => {
        const mentionMatches = scanSourceState(sourceState, (value) => /\bcube\b/i.test(value));

        return {
          outcomes: toOutcomes(mentionMatches),
          basisNotes: [
            `locator-predicate: cube mentions over declared regions: ${mentionMatches.length} match(es)`,
            `locator-context: sss.diagnosticScope='${sourceState.sss.diagnosticScope}' (one-ambo tetrahedron capsule)`,
          ],
          caveats: [],
        };
      },
    },
    {
      objectId: 'cube-primal-sourcehood-boundary',
      objectLabel: 'cube primal sourcehood boundary',
      extract: ({ disc, card }) => {
        const forbiddenPromotion = card.forbiddenPromotions.find(
          (row) => row.promotionId === 'no-independent-cube-primal-sourcehood',
        );
        const citations = [
          `disc.dualOctaCubeProvenance.cubePrimalCarrierAssignmentStatus='${disc.dualOctaCubeProvenance.cubePrimalCarrierAssignmentStatus}'`,
          `disc.summary.cubePrimalSourcehoodStatus='${disc.summary.cubePrimalSourcehoodStatus}'`,
          `card.cubePrimalSourcehoodStatus='${card.cubePrimalSourcehoodStatus}'; card.forbiddenPromotions['no-independent-cube-primal-sourcehood']='${forbiddenPromotion?.warning ?? 'missing'}'`,
        ];

        return {
          citations,
          evidenceRowCount: citations.length,
          upstreamDeclaredUnresolved:
            disc.dualOctaCubeProvenance.cubePrimalCarrierAssignmentStatus,
          caveats: [],
        };
      },
      locate: (sourceState) => {
        const primalVertexIds = sourceState.sss.primalStates.map((state) => state.vertexId);
        const cubePrimalMatches = scanSourceState(sourceState, (value) =>
          /cube[- ]primal|eight[- ]vertex|8[- ]vertex/i.test(value),
        );

        return {
          outcomes: toOutcomes(cubePrimalMatches),
          basisNotes: [
            `locator-predicate: cube-primal/eight-vertex mentions over declared regions: ${cubePrimalMatches.length} match(es)`,
            `locator-context: sss.primalStates count=${primalVertexIds.length}, vertexIds=[${primalVertexIds.join(', ')}] (no primal vertex beyond A-D instantiated)`,
          ],
          caveats: [],
        };
      },
    },
  ];
}

interface RegionMatch {
  tier: Exclude<MedialCarrierLocatorTier, 'not-locatable'>;
  membership: MedialCarrierProjectionMembership;
  path: string;
  value: string;
}

function toOutcomes(matches: RegionMatch[]): LocatorOutcome[] {
  return matches.map((match) => ({
    tier: match.tier,
    membership: match.membership,
    citation: `${match.path} = "${match.value}"`,
  }));
}

function scanSourceState(
  sourceState: SourceStateReports,
  predicate: (value: string) => boolean,
): RegionMatch[] {
  const matches: RegionMatch[] = [];

  for (const [label, root] of [
    ['sss', sourceState.sss],
    ['mp', sourceState.mp],
  ] as const) {
    walkStringLeaves(root, label, (path, value) => {
      if (!predicate(value)) {
        return;
      }

      const region = classifyScanPath(path);

      if (region) {
        matches.push({ tier: region.tier, membership: region.membership, path, value });
      }
    });
  }

  return matches;
}

function classifyScanPath(path: string): {
  tier: Exclude<MedialCarrierLocatorTier, 'not-locatable'>;
  membership: MedialCarrierProjectionMembership;
} | null {
  for (const rule of REGION_RULES) {
    if (path.includes(rule.pathFragment)) {
      return { tier: rule.tier, membership: rule.membership };
    }
  }

  return null;
}

function walkStringLeaves(
  node: unknown,
  path: string,
  visit: (path: string, value: string) => void,
): void {
  if (typeof node === 'string') {
    visit(path, node);
    return;
  }

  if (Array.isArray(node)) {
    node.forEach((child, index) => walkStringLeaves(child, `${path}[${index}]`, visit));
    return;
  }

  if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) {
      walkStringLeaves(child, `${path}.${key}`, visit);
    }
  }
}

function findObjectsWithKeyPair(
  sourceState: SourceStateReports,
  requiredKeys: string[],
): RegionMatch[] {
  const matches: RegionMatch[] = [];

  for (const [label, root] of [
    ['sss', sourceState.sss],
    ['mp', sourceState.mp],
  ] as const) {
    walkObjects(root, label, (path, value) => {
      if (!requiredKeys.every((key) => key in value)) {
        return;
      }

      const region = classifyScanPath(path);

      if (region) {
        matches.push({
          tier: region.tier,
          membership: region.membership,
          path,
          value: `object with keys [${requiredKeys.join(', ')}]`,
        });
      }
    });
  }

  return matches;
}

function walkObjects(
  node: unknown,
  path: string,
  visit: (path: string, value: Record<string, unknown>) => void,
): void {
  if (Array.isArray(node)) {
    node.forEach((child, index) => walkObjects(child, `${path}[${index}]`, visit));
    return;
  }

  if (node && typeof node === 'object') {
    visit(path, node as Record<string, unknown>);

    for (const [key, child] of Object.entries(node)) {
      walkObjects(child, `${path}.${key}`, visit);
    }
  }
}

function collectRelationRecords(
  sourceState: SourceStateReports,
  minimumDistinctStateReferenceCount: number,
  relationKeyPattern: RegExp,
): RegionMatch[] {
  const candidates: Array<RegionMatch & { refCount: number }> = [];

  for (const [label, root] of [
    ['sss', sourceState.sss],
    ['mp', sourceState.mp],
  ] as const) {
    walkObjects(root, label, (path, value) => {
      const region = classifyScanPath(path);

      if (!region) {
        return;
      }

      const stateReferences = new Set<string>();
      const matchedKeys: string[] = [];

      walkStringLeaves(value, path, (_leafPath, leafValue) => {
        if (STATE_REFERENCE_PATTERN.test(leafValue)) {
          stateReferences.add(leafValue);
        }
      });

      for (const key of Object.keys(value)) {
        if (relationKeyPattern.test(key)) {
          matchedKeys.push(key);
        }
      }

      if (stateReferences.size >= minimumDistinctStateReferenceCount && matchedKeys.length > 0) {
        candidates.push({
          tier: region.tier,
          membership: region.membership,
          path,
          value: `relation record: refs=[${[...stateReferences].join(', ')}], keys=[${matchedKeys.join(', ')}]`,
          refCount: stateReferences.size,
        });
      }
    });
  }

  return candidates
    .filter(
      (candidate) =>
        !candidates.some(
          (other) => other !== candidate && other.path.startsWith(`${candidate.path}.`),
        ),
    )
    .map(({ refCount: _refCount, ...match }) => match);
}

function buildLowArityCaveat(sourceState: SourceStateReports, requiredRelation: string): string {
  const quarkChannelCount = sourceState.sss.generatedChildStates.reduce(
    (sum, state) => sum + (state.derivationComponent.quarkChannels?.length ?? 0),
    0,
  );
  const complementPairCount = sourceState.mp.structuralOperations.complementPairs.length;

  return `arity guard: two-term records exist (${quarkChannelCount} quark channel parent/projection records, ${complementPairCount} complement pairs) - arity below ${requiredRelation}; lower-arity neighbors, not representatives`;
}

function buildRayGroups(disc: OctonionVsA3MedialCarrierDiscriminatorV0Report): RayGroup[] {
  const pairKeysByRay = new Map<string, Set<string>>();

  for (const row of disc.signedLiftRows) {
    const pairKey = [...row.orderedPrimalPair].sort().join('');
    const existing = pairKeysByRay.get(row.carrierRay) ?? new Set<string>();

    existing.add(pairKey);
    pairKeysByRay.set(row.carrierRay, existing);
  }

  return [...pairKeysByRay.entries()]
    .map(([carrierRay, pairKeys]) => ({ carrierRay, pairKeys: [...pairKeys].sort() }))
    .sort((left, right) => (left.carrierRay < right.carrierRay ? -1 : 1));
}

function buildPairSignSets(disc: OctonionVsA3MedialCarrierDiscriminatorV0Report): PairSignSet[] {
  const entries = new Map<string, { carrierRay: string; signs: Set<string> }>();

  for (const row of disc.signedLiftRows) {
    const pairKey = [...row.orderedPrimalPair].sort().join('');
    const existing = entries.get(pairKey) ?? { carrierRay: row.carrierRay, signs: new Set() };

    existing.signs.add(row.sign);
    entries.set(pairKey, existing);
  }

  return [...entries.entries()]
    .map(([pairKey, entry]) => ({
      pairKey,
      carrierRay: entry.carrierRay,
      signs: [...entry.signs].sort(),
    }))
    .sort((left, right) => (left.pairKey < right.pairKey ? -1 : 1));
}

function runOrientationSignTransportTest(
  sourceState: SourceStateReports,
  evidence: ExtractorResult,
): { verdict: string; detail: string } {
  const pairSignSets = (evidence.payload as PairSignSet[] | undefined) ?? [];
  const starSignByEdge = new Map(
    sourceState.mp.structuralProjections.map((projection) => [
      projection.edgeStateId,
      projection.starSign,
    ]),
  );

  if (pairSignSets.length === 0 || starSignByEdge.size === 0) {
    return {
      verdict: 'indeterminate',
      detail: `pair sign-sets=${pairSignSets.length}, located starSign rows=${starSignByEdge.size} - insufficient data on one side`,
    };
  }

  const nonUnique = pairSignSets.filter((entry) => entry.signs.length !== 1);

  if (nonUnique.length > 0) {
    return {
      verdict: 'independently-reconstructed-convention',
      detail: `upstream sign-sets are non-unique for ${nonUnique.length}/${pairSignSets.length} pairs (${nonUnique
        .map((entry) => `${entry.pairKey}:{${entry.signs.join(',')}}`)
        .join('; ')}) - no forced upstream->starSign map exists`,
    };
  }

  const epsilonCandidates = pairSignSets
    .map((entry) => {
      const starSign = starSignByEdge.get(entry.pairKey);
      const upstreamSign = entry.signs[0] === '+' ? 1 : -1;

      return starSign === undefined ? null : starSign * upstreamSign;
    })
    .filter((value): value is number => value !== null);
  const forced =
    epsilonCandidates.length === pairSignSets.length &&
    epsilonCandidates.every((value) => value === epsilonCandidates[0]);

  return forced
    ? {
        verdict: 'transported-from-fano-lift',
        detail: `unique upstream signs force starSign under global polarity ${epsilonCandidates[0]}`,
      }
    : {
        verdict: 'independently-reconstructed-convention',
        detail: 'unique upstream signs exist but no single global polarity maps them onto the located starSigns',
      };
}

function computeFlagIngredientShadow(
  sourceState: SourceStateReports,
  evidence: ExtractorResult,
): { allFlagsHaveIngredientShadow: boolean; flagCount: number; example: string } {
  const flagCount = evidence.evidenceRowCount;
  const edgeStates = sourceState.sss.generatedChildStates;
  const primalLabels = ['A', 'B', 'C', 'D'];
  let allHaveShadow = flagCount > 0;
  let example = 'none';

  for (const shared of primalLabels) {
    for (const omitted of primalLabels) {
      if (shared === omitted) {
        continue;
      }

      const ingredientEdges = edgeStates.filter(
        (state) =>
          state.endpoints.includes(shared) && !state.endpoints.includes(omitted),
      );

      if (ingredientEdges.length !== 2) {
        allHaveShadow = false;
      } else if (example === 'none') {
        example = `${shared}->${omitted} from {${ingredientEdges
          .map((state) => state.edgeStateId)
          .join(',')}}`;
      }
    }
  }

  return { allFlagsHaveIngredientShadow: allHaveShadow, flagCount, example };
}

function collectDerivationKinds(sourceState: SourceStateReports): string[] {
  const kinds = new Set<string>();

  for (const state of sourceState.sss.primalStates) {
    kinds.add(state.derivationComponent.derivationKind);
  }

  for (const state of sourceState.sss.generatedChildStates) {
    kinds.add(state.derivationComponent.derivationKind);
  }

  return [...kinds].sort();
}

function buildSourceStateRealVerdict(args: {
  rows: MedialCarrierSourceStateSurvivalAuditV0Row[];
  sourceStateRealCount: number;
  sideTableCount: number;
  orphanCount: number;
  baseSurvives: boolean;
  fiberSurvives: boolean;
  decisionD1Triggered: boolean;
}): string {
  const listFor = (buckets: readonly MedialCarrierSurvivalBucket[]): string =>
    args.rows
      .filter((row) => buckets.includes(row.survivalBucket))
      .map((row) => `${row.objectId}=${row.survivalBucket}`)
      .join(', ') || 'none';

  return [
    `source-state-real (${args.sourceStateRealCount}/12): ${listFor(SOURCE_STATE_REAL_BUCKETS)}`,
    `inert side-table (${args.sideTableCount}/12): ${listFor(SIDE_TABLE_BUCKETS)}`,
    `orphaned (${args.orphanCount}/12): ${listFor(ORPHAN_BUCKETS)}`,
    `baseSurvives(carrier-ray)=${args.baseSurvives}`,
    `fiberSurvives(signed-fano-lift AND triangle-closure-relation AND square-holonomy-relation)=${args.fiberSurvives}`,
    `decisionD1Triggered=${args.decisionD1Triggered} under rule '${DECISION_D1_RULE}'`,
  ].join('; ');
}

function buildIntegrityIssues(args: {
  consumed: {
    disc: OctonionVsA3MedialCarrierDiscriminatorV0Report;
    card: MedialDualEquivariantCarrierPolicyModelCardV0Report;
    sss: StructuredSourceStateDiagnosticV0Report;
    mp: StructuredSourceStateMultiProjectionStructuralChannelV0Report;
  };
  rows: MedialCarrierSourceStateSurvivalAuditV0Row[];
  bucketCounts: Record<MedialCarrierSurvivalBucket, number>;
  channelCounts: Record<MedialCarrierProjectionChannel, number>;
  sourceStateRealCount: number;
  sideTableCount: number;
  orphanCount: number;
  baseSurvives: boolean;
  fiberSurvives: boolean;
  decisionD1Triggered: boolean;
  sourceStateRealVerdict: string;
}): MedialCarrierSourceStateSurvivalAuditV0Issue[] {
  const issues: MedialCarrierSourceStateSurvivalAuditV0Issue[] = [];
  const expectedConsumed: Array<{ label: string; method: string; expected: string; ok: boolean }> = [
    {
      label: 'discriminator',
      method: args.consumed.disc.method,
      expected: 'octonion-vs-a3-medial-carrier-discriminator-v0',
      ok: args.consumed.disc.ok,
    },
    {
      label: 'modelCard',
      method: args.consumed.card.method,
      expected: 'medial-dual-equivariant-carrier-policy-model-card-v0',
      ok: args.consumed.card.ok,
    },
    {
      label: 'structuredSourceState',
      method: args.consumed.sss.method,
      expected: 'structured-source-state-diagnostic-v0',
      ok: args.consumed.sss.ok,
    },
    {
      label: 'multiProjection',
      method: args.consumed.mp.method,
      expected: 'structured-source-state-multi-projection-structural-channel-v0',
      ok: args.consumed.mp.ok,
    },
  ];

  for (const consumed of expectedConsumed) {
    if (consumed.method !== consumed.expected) {
      issues.push({
        code: 'consumed-report-method-mismatch',
        message: `${consumed.label} method is '${consumed.method}', expected '${consumed.expected}'.`,
      });
    }

    if (!consumed.ok) {
      issues.push({
        code: 'consumed-report-not-ok',
        message: `${consumed.label} report is not ok; survival classification preconditions fail.`,
      });
    }
  }

  const registryIds = buildRegistry().map((definition) => definition.objectId);
  const rowIds = args.rows.map((row) => row.objectId);

  if (args.rows.length !== 12 || registryIds.length !== 12) {
    issues.push({
      code: 'registry-row-count-mismatch',
      message: `Expected 12 classified rows over a 12-object registry, got rows=${args.rows.length}, registry=${registryIds.length}.`,
    });
  }

  if (
    new Set(rowIds).size !== rowIds.length ||
    !registryIds.every((objectId) => rowIds.includes(objectId))
  ) {
    issues.push({
      code: 'registry-bijection-violation',
      message: 'Classified rows are not bijective with the twelve-object registry.',
    });
  }

  for (const row of args.rows) {
    if (!SURVIVAL_BUCKETS.includes(row.survivalBucket)) {
      issues.push({
        code: 'invalid-survival-bucket',
        message: `${row.objectId} has invalid survivalBucket '${row.survivalBucket}'.`,
      });
    }

    if (!PROJECTION_CHANNELS.includes(row.projectionChannel)) {
      issues.push({
        code: 'invalid-projection-channel',
        message: `${row.objectId} has invalid projectionChannel '${row.projectionChannel}'.`,
      });
    }

    if (!(row.locatorTier in TIER_RANK)) {
      issues.push({
        code: 'invalid-locator-tier',
        message: `${row.objectId} has invalid locatorTier '${row.locatorTier}'.`,
      });
    }

    const hasExtractCitation = row.derivationBasis.some((entry) => entry.startsWith('extract:'));
    const hasLocateCitation = row.derivationBasis.some((entry) => entry.startsWith('locate'));

    if (row.derivationBasis.length === 0 || !hasExtractCitation || !hasLocateCitation) {
      issues.push({
        code: 'derivation-basis-missing-citation',
        message: `${row.objectId} derivationBasis must carry at least one extractor citation and one locator citation.`,
      });
    }

    if (row.survivalBucket === 'blocked-unresolved') {
      const citesDeclaredBoundary = row.derivationBasis.some((entry) =>
        entry.startsWith('locate-override: upstream declares'),
      );
      const citesNotLocatable = row.derivationBasis.some((entry) =>
        entry.includes('(not-locatable)'),
      );

      if (!citesDeclaredBoundary && !citesNotLocatable) {
        issues.push({
          code: 'blocked-unresolved-without-citation',
          message: `${row.objectId} is blocked-unresolved without citing a declared boundary or not-locatable result.`,
        });
      }
    }

    if (
      row.projectionChannel === 'unresolved' &&
      !row.derivationBasis.includes('projection-membership: none')
    ) {
      issues.push({
        code: 'unresolved-channel-with-projection-membership',
        message: `${row.objectId} has unresolved channel but records a projection membership.`,
      });
    }

    if (
      row.survivalBucket === 'field-active-now' &&
      row.projectionChannel !== 'scalar-emitted-tuple' &&
      row.projectionChannel !== 'propagation-behavior'
    ) {
      issues.push({
        code: 'field-active-channel-incoherent',
        message: `${row.objectId} is field-active-now but channel is '${row.projectionChannel}'.`,
      });
    }
  }

  const numericValues = [
    ...SURVIVAL_BUCKETS.map((bucket) => args.bucketCounts[bucket]),
    ...PROJECTION_CHANNELS.map((channel) => args.channelCounts[channel]),
    args.sourceStateRealCount,
    args.sideTableCount,
    args.orphanCount,
  ];

  if (numericValues.some((value) => !Number.isFinite(value))) {
    issues.push({
      code: 'non-finite-aggregate',
      message: 'One or more aggregate counts is non-finite.',
    });
  }

  if (sumValues(SURVIVAL_BUCKETS.map((bucket) => args.bucketCounts[bucket])) !== 12) {
    issues.push({
      code: 'bucket-count-sum-mismatch',
      message: 'bucketCounts do not sum to 12.',
    });
  }

  if (sumValues(PROJECTION_CHANNELS.map((channel) => args.channelCounts[channel])) !== 12) {
    issues.push({
      code: 'channel-count-sum-mismatch',
      message: 'channelCounts do not sum to 12.',
    });
  }

  if (args.sourceStateRealCount + args.sideTableCount + args.orphanCount !== 12) {
    issues.push({
      code: 'tier-sum-mismatch',
      message: 'sourceStateRealCount + sideTableCount + orphanCount must equal 12.',
    });
  }

  if (args.decisionD1Triggered !== !(args.baseSurvives && args.fiberSurvives)) {
    issues.push({
      code: 'decision-d1-mismatch',
      message: 'decisionD1Triggered must equal NOT(baseSurvives AND fiberSurvives).',
    });
  }

  if (
    !args.sourceStateRealVerdict ||
    !args.sourceStateRealVerdict.includes('source-state-real') ||
    !args.sourceStateRealVerdict.includes('side-table') ||
    !args.sourceStateRealVerdict.includes('orphaned')
  ) {
    issues.push({
      code: 'verdict-missing-tier-naming',
      message: 'sourceStateRealVerdict must name all three survival tiers.',
    });
  }

  return issues;
}

function rowIsSourceStateReal(
  rows: MedialCarrierSourceStateSurvivalAuditV0Row[],
  objectId: MedialCarrierPolicyObjectId,
): boolean {
  const row = rows.find((candidate) => candidate.objectId === objectId);

  return row !== undefined && SOURCE_STATE_REAL_BUCKETS.includes(row.survivalBucket);
}

function countByKey<TKey extends string>(
  keys: readonly TKey[],
  values: TKey[],
): Record<TKey, number> {
  const counts = Object.fromEntries(keys.map((key) => [key, 0])) as Record<TKey, number>;

  for (const value of values) {
    if (value in counts) {
      counts[value] += 1;
    }
  }

  return counts;
}

function sumCounts<TKey extends string>(
  counts: Record<TKey, number>,
  keys: readonly TKey[],
): number {
  return keys.reduce((sum, key) => sum + counts[key], 0);
}

function sumValues(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

function sumField<TRow, TField extends keyof TRow>(rows: TRow[], field: TField): number {
  return rows.reduce((sum, row) => {
    const value = row[field];

    return sum + (typeof value === 'number' ? value : 0);
  }, 0);
}

function distinctCount(values: string[]): number {
  return new Set(values).size;
}

function dedupeStrings(values: string[]): string[] {
  return [...new Set(values)];
}
