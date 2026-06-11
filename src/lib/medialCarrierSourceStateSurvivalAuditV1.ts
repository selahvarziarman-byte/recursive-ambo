import {
  buildHubLayerSourceStateCapsuleV0Report,
  type HubLayerSourceStateCapsuleV0Report,
} from './hubLayerSourceStateCapsuleV0';
import {
  buildMedialCarrierSourceStateSurvivalAuditV0Report,
  type MedialCarrierSourceStateSurvivalAuditV0Report,
} from './medialCarrierSourceStateSurvivalAuditV0';
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

export type MedialCarrierSurvivalBucketV1 =
  | 'field-active-now'
  | 'structured-source-state'
  | 'metadata-only'
  | 'provenance-only'
  | 'lost-in-tuple-reduction'
  | 'blocked-unresolved';

export type MedialCarrierProjectionChannelV1 =
  | 'scalar-emitted-tuple'
  | 'structural-channel'
  | 'propagation-behavior'
  | 'provenance-channel'
  | 'unresolved';

export type MedialCarrierPolicyObjectIdV1 =
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

export type MedialCarrierLocatorTierV1 =
  | 'live-projected'
  | 'instantiated-structural'
  | 'record-only-metadata'
  | 'record-only-provenance'
  | 'named-as-lost'
  | 'not-locatable';

export type MedialCarrierProjectionMembershipV1 =
  | 'emitted-tuple'
  | 'propagation-projection'
  | 'structural-projection'
  | 'provenance-record'
  | 'none';

export type MedialCarrierRegionIdV1 = 'sss' | 'mp' | 'hub';

export interface MedialCarrierSourceStateSurvivalAuditV1Row {
  objectId: MedialCarrierPolicyObjectIdV1;
  objectLabel: string;
  v0SurvivalBucket: MedialCarrierSurvivalBucketV1;
  v0ProjectionChannel: MedialCarrierProjectionChannelV1;
  survivalBucket: MedialCarrierSurvivalBucketV1;
  projectionChannel: MedialCarrierProjectionChannelV1;
  locatorTier: MedialCarrierLocatorTierV1;
  changed: boolean;
  reachabilityAnnotation: string;
  derivationBasis: string[];
  caveats: string[];
}

export interface MedialCarrierSourceStateSurvivalAuditV1Issue {
  code: string;
  message: string;
}

export interface MedialCarrierSourceStateSurvivalAuditV1Report {
  method: 'medial-carrier-source-state-survival-audit-v1';
  diagnosticScope: 'station-i-d1-lift-survival-re-audit-extended-region-set-only';
  regionSetIds: MedialCarrierRegionIdV1[];
  regionSetDescription: string;
  consumedReports: Record<
    | 'discriminator'
    | 'modelCard'
    | 'structuredSourceState'
    | 'multiProjection'
    | 'hubCapsule'
    | 'survivalAuditV0',
    { method: string; ok: boolean; issueCount: number }
  >;
  ratifiedBaseline: ReadonlyArray<{
    objectId: MedialCarrierPolicyObjectIdV1;
    survivalBucket: MedialCarrierSurvivalBucketV1;
    projectionChannel: MedialCarrierProjectionChannelV1;
  }>;
  baselineIdentityStatus: 'baseline-identity-verified' | 'baseline-identity-violated';
  rows: MedialCarrierSourceStateSurvivalAuditV1Row[];
  bucketCounts: Record<MedialCarrierSurvivalBucketV1, number>;
  channelCounts: Record<MedialCarrierProjectionChannelV1, number>;
  sourceStateRealCount: number;
  sideTableCount: number;
  orphanCount: number;
  baseSurvives: boolean;
  fiberSurvives: boolean;
  decisionD1Rule: typeof DECISION_D1_RULE;
  decisionD1Triggered: boolean;
  sourceStateRealVerdict: string;
  deltaSummary: string;
  tetraG1RegimeStatus: 'tetra-g1-structured-source-state-regime-not-amended';
  v0FrozenStatus: 'v0-audit-frozen-station-i-evidence-not-edited';
  fieldCueUnblockStatus: 'not-authorized';
  s0Status: 'not-authorized';
  uiStatus: 'no-ui';
  shapeMutationStatus: 'no-shape-mutation';
  packetWriteStatus: 'no-packet-write';
  operationRegistryStatus: 'not-operation-registry-work';
  topologyStatus: 'not-topology-workspace';
  integrityIssueCount: number;
  integrityIssues: MedialCarrierSourceStateSurvivalAuditV1Issue[];
  ok: boolean;
}

interface CarrierReports {
  disc: OctonionVsA3MedialCarrierDiscriminatorV0Report;
  card: MedialDualEquivariantCarrierPolicyModelCardV0Report;
}

interface SourceStateRegions {
  sss: StructuredSourceStateDiagnosticV0Report;
  mp: StructuredSourceStateMultiProjectionStructuralChannelV0Report;
  hub: HubLayerSourceStateCapsuleV0Report;
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
  tier: Exclude<MedialCarrierLocatorTierV1, 'not-locatable'>;
  membership: MedialCarrierProjectionMembershipV1;
  citation: string;
  region: MedialCarrierRegionIdV1;
  navigated?: boolean;
}

interface LocatorResult {
  outcomes: LocatorOutcome[];
  basisNotes: string[];
  caveats: string[];
}

interface CarrierPolicyObjectDefinition {
  objectId: MedialCarrierPolicyObjectIdV1;
  objectLabel: string;
  extract: (carrier: CarrierReports) => ExtractorResult;
  locate: (regions: SourceStateRegions, evidence: ExtractorResult) => LocatorResult;
}

const METHOD = 'medial-carrier-source-state-survival-audit-v1' as const;
const DIAGNOSTIC_SCOPE =
  'station-i-d1-lift-survival-re-audit-extended-region-set-only' as const;
const DECISION_D1_RULE =
  'medial-dual-not-instantiated-source-state-real: base AND Fano fiber must both reach field-active-now/structured-source-state' as const;
const REGION_SET_IDS: MedialCarrierRegionIdV1[] = ['sss', 'mp', 'hub'];
const REGION_SET_DESCRIPTION =
  'sss=tetra-g1 structured source state (unchanged), mp=multi-projection structural channel (unchanged), hub=hub-layer source-state capsule (new region added by the D1 lift)';

const SURVIVAL_BUCKETS: readonly MedialCarrierSurvivalBucketV1[] = [
  'field-active-now',
  'structured-source-state',
  'metadata-only',
  'provenance-only',
  'lost-in-tuple-reduction',
  'blocked-unresolved',
];

const PROJECTION_CHANNELS: readonly MedialCarrierProjectionChannelV1[] = [
  'scalar-emitted-tuple',
  'structural-channel',
  'propagation-behavior',
  'provenance-channel',
  'unresolved',
];

const SOURCE_STATE_REAL_BUCKETS: readonly MedialCarrierSurvivalBucketV1[] = [
  'field-active-now',
  'structured-source-state',
];

const SIDE_TABLE_BUCKETS: readonly MedialCarrierSurvivalBucketV1[] = [
  'metadata-only',
  'provenance-only',
];

const ORPHAN_BUCKETS: readonly MedialCarrierSurvivalBucketV1[] = [
  'lost-in-tuple-reduction',
  'blocked-unresolved',
];

const TIER_RANK: Record<MedialCarrierLocatorTierV1, number> = {
  'live-projected': 5,
  'instantiated-structural': 4,
  'record-only-metadata': 3,
  'record-only-provenance': 2,
  'named-as-lost': 1,
  'not-locatable': 0,
};

const TIER_TO_BUCKET: Record<
  Exclude<MedialCarrierLocatorTierV1, 'not-locatable'>,
  MedialCarrierSurvivalBucketV1
> = {
  'live-projected': 'field-active-now',
  'instantiated-structural': 'structured-source-state',
  'record-only-metadata': 'metadata-only',
  'record-only-provenance': 'provenance-only',
  'named-as-lost': 'lost-in-tuple-reduction',
};

const MEMBERSHIP_TO_CHANNEL: Record<
  MedialCarrierProjectionMembershipV1,
  MedialCarrierProjectionChannelV1
> = {
  'emitted-tuple': 'scalar-emitted-tuple',
  'propagation-projection': 'propagation-behavior',
  'structural-projection': 'structural-channel',
  'provenance-record': 'provenance-channel',
  none: 'unresolved',
};

const MEMBERSHIP_PRIORITY: readonly MedialCarrierProjectionMembershipV1[] = [
  'emitted-tuple',
  'propagation-projection',
  'structural-projection',
  'provenance-record',
  'none',
];

const NOT_LOCATABLE_CAVEAT =
  'no representative locatable in the extended region set {sss, mp, hub}; placement remains blocked';
const GATE_C5_CAVEAT =
  'Gate C5: structural-channel visibility is a field-facing witness only under the declared multi-projection basis (multi-projection-source-state-v0), not raw-field-visible; capped at structured-source-state';
const UNCHANGED_ANNOTATION = 'cell-unchanged-from-ratified-v0-baseline';
const MAX_CITED_MATCHES = 4;

// Ratified Station I baseline (sharpening 2): the public v0 result exactly as
// the committed v0 diagnostic and the Station I closing memo section 3 report
// it. v1 identity-checks its live-captured v0 baseline against these constants;
// any mismatch is an integrity failure, never a delta.
const RATIFIED_STATION_I_BASELINE: ReadonlyArray<{
  objectId: MedialCarrierPolicyObjectIdV1;
  survivalBucket: MedialCarrierSurvivalBucketV1;
  projectionChannel: MedialCarrierProjectionChannelV1;
}> = [
  { objectId: 'a3-medial-flag-token', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
  { objectId: 'ordered-flag-identity', survivalBucket: 'metadata-only', projectionChannel: 'unresolved' },
  { objectId: 'signed-fano-lift', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
  { objectId: 'carrier-ray', survivalBucket: 'structured-source-state', projectionChannel: 'structural-channel' },
  { objectId: 'orientation-sign', survivalBucket: 'metadata-only', projectionChannel: 'unresolved' },
  { objectId: 'triangle-closure-relation', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
  { objectId: 'square-holonomy-relation', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
  { objectId: 'complete-quadrangle-gauge-robustness', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
  { objectId: 'tetra-g2-core-provenance', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
  { objectId: 'octa-g1-provenance', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
  { objectId: 'cube-g1-provenance', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
  { objectId: 'cube-primal-sourcehood-boundary', survivalBucket: 'blocked-unresolved', projectionChannel: 'unresolved' },
];

const RATIFIED_STATION_I_AGGREGATES = {
  sourceStateRealCount: 1,
  sideTableCount: 2,
  orphanCount: 9,
  baseSurvives: true,
  fiberSurvives: false,
  decisionD1Triggered: true,
} as const;

// Region classification over the EXTENDED region set. The sss/mp rules are
// duplicated from the frozen v0 audit (tetra-G1 regime unchanged). The hub
// rules classify the capsule's structures consistently with the capsule's own
// Gate C.5 statuses: nothing in the hub region is live-projected (the capsule
// is source-state-only; nothing field-active), structural content caps at
// instantiated-structural with no projection membership, genealogy records are
// record-only-provenance, declared meta/declarations are record-only-metadata,
// and the capsule's loss-declaration list is named-as-lost.
const REGION_RULES: ReadonlyArray<{
  pathFragment: string;
  tier: Exclude<MedialCarrierLocatorTierV1, 'not-locatable'>;
  membership: MedialCarrierProjectionMembershipV1;
}> = [
  { pathFragment: '.lostUnderScalarTupleReduction', tier: 'named-as-lost', membership: 'none' },
  { pathFragment: '.flagStates', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.antipodalAxes', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.rayGroups', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.triangleClosureRelations', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.squareHolonomyRelations', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.gaugeRobustnessMeta', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.provenanceRoutes', tier: 'record-only-provenance', membership: 'provenance-record' },
  { pathFragment: '.openBoundaries', tier: 'record-only-provenance', membership: 'provenance-record' },
  { pathFragment: '.tupleReductionDeclaration', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.primalCarrierAssignment', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.lostStructure', tier: 'named-as-lost', membership: 'none' },
  { pathFragment: '.lostByScalarTupleProjection', tier: 'named-as-lost', membership: 'none' },
  { pathFragment: '.metadataOnlyStructure', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.metadataOnlyFacts', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.reducedStructure', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.neutralAxes', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.structuralFactsBeforeReduction', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.derivationComponent', tier: 'record-only-provenance', membership: 'provenance-record' },
  { pathFragment: '.fieldActiveStructure', tier: 'live-projected', membership: 'emitted-tuple' },
  { pathFragment: '.fieldActiveFacts', tier: 'live-projected', membership: 'emitted-tuple' },
  { pathFragment: '.emittedTuple', tier: 'live-projected', membership: 'emitted-tuple' },
  { pathFragment: '.orientationConvention', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.polarityConvention', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.baselineComparison', tier: 'record-only-metadata', membership: 'none' },
  { pathFragment: '.propagationProjection', tier: 'live-projected', membership: 'propagation-projection' },
  { pathFragment: '.structuralProjection', tier: 'instantiated-structural', membership: 'structural-projection' },
  { pathFragment: '.structuralOperations', tier: 'instantiated-structural', membership: 'structural-projection' },
  { pathFragment: '.antipodalRelationVisibilityRows', tier: 'instantiated-structural', membership: 'structural-projection' },
  { pathFragment: '.complementAxes', tier: 'instantiated-structural', membership: 'structural-projection' },
  { pathFragment: '.antipodalCovarianceAudit', tier: 'instantiated-structural', membership: 'structural-projection' },
  { pathFragment: '.complementInvolutionAudit', tier: 'instantiated-structural', membership: 'structural-projection' },
  { pathFragment: '.structuralCovarianceAudit', tier: 'instantiated-structural', membership: 'structural-projection' },
  { pathFragment: '.incidenceProjectionRelations', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.primalStates', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.generatedChildStates', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.generatedChildProjections', tier: 'instantiated-structural', membership: 'none' },
  { pathFragment: '.unknownFeatureRetentionAudit', tier: 'instantiated-structural', membership: 'none' },
];

const STATE_REFERENCE_PATTERN =
  /^(?:[A-D]{2}|M_[A-D]{2}|edge-state:[A-D]{2}|primal-state:[A-D]|axis:[A-D]{2}-[A-D]{2}|[A-D]->[A-D]|hub-flag-state:[A-D]->[A-D]|hub-antipodal-axis:[A-D]->[A-D]\|[A-D]->[A-D])$/;

export function buildMedialCarrierSourceStateSurvivalAuditV1Report(): MedialCarrierSourceStateSurvivalAuditV1Report {
  const disc = buildOctonionVsA3MedialCarrierDiscriminatorV0Report();
  const card = buildMedialDualEquivariantCarrierPolicyModelCardV0Report();
  const sss = buildStructuredSourceStateDiagnosticV0Report();
  const mp = buildStructuredSourceStateMultiProjectionStructuralChannelV0Report();
  const hub = buildHubLayerSourceStateCapsuleV0Report();
  const v0 = buildMedialCarrierSourceStateSurvivalAuditV0Report();
  const carrier: CarrierReports = { disc, card };
  const regions: SourceStateRegions = { sss, mp, hub };
  const integrityIssues: MedialCarrierSourceStateSurvivalAuditV1Issue[] = [];
  const baselineIssues = checkBaselineIdentity(v0);

  integrityIssues.push(...baselineIssues);

  const baselineByObjectId = new Map(
    RATIFIED_STATION_I_BASELINE.map((cell) => [cell.objectId, cell]),
  );
  const rows: MedialCarrierSourceStateSurvivalAuditV1Row[] = [];

  for (const definition of buildRegistry()) {
    const evidence = definition.extract(carrier);

    if (evidence.evidenceRowCount <= 0) {
      integrityIssues.push({
        code: `extractor-evidence-missing:${definition.objectId}`,
        message: `Upstream carrier evidence for ${definition.objectId} is empty; classification is not derivable (mock-solution tripwire).`,
      });
    }

    const locator = definition.locate(regions, evidence);
    const baseline = baselineByObjectId.get(definition.objectId);

    rows.push(classifyObject(definition, evidence, locator, baseline));
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
  const deltaSummary = buildDeltaSummary({
    rows,
    bucketCounts,
    decisionD1Triggered,
  });

  integrityIssues.push(
    ...buildIntegrityIssues({
      consumed: { disc, card, sss, mp, hub, v0 },
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
      deltaSummary,
    }),
  );

  const dedupedIssues = dedupeIssues(integrityIssues);

  return {
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    regionSetIds: [...REGION_SET_IDS],
    regionSetDescription: REGION_SET_DESCRIPTION,
    consumedReports: {
      discriminator: { method: disc.method, ok: disc.ok, issueCount: disc.issues.length },
      modelCard: { method: card.method, ok: card.ok, issueCount: card.issues.length },
      structuredSourceState: { method: sss.method, ok: sss.ok, issueCount: sss.issues.length },
      multiProjection: { method: mp.method, ok: mp.ok, issueCount: mp.integrityIssueCount },
      hubCapsule: { method: hub.method, ok: hub.ok, issueCount: hub.integrityIssueCount },
      survivalAuditV0: { method: v0.method, ok: v0.ok, issueCount: v0.integrityIssueCount },
    },
    ratifiedBaseline: RATIFIED_STATION_I_BASELINE,
    baselineIdentityStatus:
      baselineIssues.length === 0 ? 'baseline-identity-verified' : 'baseline-identity-violated',
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
    deltaSummary,
    tetraG1RegimeStatus: 'tetra-g1-structured-source-state-regime-not-amended',
    v0FrozenStatus: 'v0-audit-frozen-station-i-evidence-not-edited',
    fieldCueUnblockStatus: 'not-authorized',
    s0Status: 'not-authorized',
    uiStatus: 'no-ui',
    shapeMutationStatus: 'no-shape-mutation',
    packetWriteStatus: 'no-packet-write',
    operationRegistryStatus: 'not-operation-registry-work',
    topologyStatus: 'not-topology-workspace',
    integrityIssueCount: dedupedIssues.length,
    integrityIssues: dedupedIssues,
    ok: dedupedIssues.length === 0,
  };
}

function checkBaselineIdentity(
  v0: MedialCarrierSourceStateSurvivalAuditV0Report,
): MedialCarrierSourceStateSurvivalAuditV1Issue[] {
  const issues: MedialCarrierSourceStateSurvivalAuditV1Issue[] = [];
  const liveByObjectId = new Map(v0.rows.map((row) => [row.objectId as string, row]));

  for (const cell of RATIFIED_STATION_I_BASELINE) {
    const live = liveByObjectId.get(cell.objectId);

    if (
      !live ||
      live.survivalBucket !== cell.survivalBucket ||
      live.projectionChannel !== cell.projectionChannel
    ) {
      issues.push({
        code: `baseline-identity-violation:${cell.objectId}`,
        message: `Live v0 cell for ${cell.objectId} is '${live?.survivalBucket ?? 'missing'}/${live?.projectionChannel ?? 'missing'}', ratified exhibit requires '${cell.survivalBucket}/${cell.projectionChannel}'; comparison base is no longer the ratified Station I exhibit.`,
      });
    }
  }

  if (
    v0.sourceStateRealCount !== RATIFIED_STATION_I_AGGREGATES.sourceStateRealCount ||
    v0.sideTableCount !== RATIFIED_STATION_I_AGGREGATES.sideTableCount ||
    v0.orphanCount !== RATIFIED_STATION_I_AGGREGATES.orphanCount ||
    v0.baseSurvives !== RATIFIED_STATION_I_AGGREGATES.baseSurvives ||
    v0.fiberSurvives !== RATIFIED_STATION_I_AGGREGATES.fiberSurvives ||
    v0.decisionD1Triggered !== RATIFIED_STATION_I_AGGREGATES.decisionD1Triggered
  ) {
    issues.push({
      code: 'baseline-aggregate-violation',
      message: `Live v0 aggregates ${v0.sourceStateRealCount}/${v0.sideTableCount}/${v0.orphanCount}, base=${v0.baseSurvives}, fiber=${v0.fiberSurvives}, d1=${v0.decisionD1Triggered} differ from the ratified 1/2/9, base=true, fiber=false, d1=true.`,
    });
  }

  return issues;
}

function classifyObject(
  definition: CarrierPolicyObjectDefinition,
  evidence: ExtractorResult,
  locator: LocatorResult,
  baseline:
    | { survivalBucket: MedialCarrierSurvivalBucketV1; projectionChannel: MedialCarrierProjectionChannelV1 }
    | undefined,
): MedialCarrierSourceStateSurvivalAuditV1Row {
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
  let survivalBucket: MedialCarrierSurvivalBucketV1;
  let locatorTier: MedialCarrierLocatorTierV1;
  let membership: MedialCarrierProjectionMembershipV1;
  let winnerRegion: MedialCarrierRegionIdV1 | null = null;

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
    winnerRegion = winner.region;
    basis.push(
      `locate: ${rankedOutcomes.length} match(es) over regions {sss, mp, hub}; winning [${winner.tier}] in region ${winner.region}: ${winner.citation}`,
    );

    for (const outcome of rankedOutcomes.slice(1, MAX_CITED_MATCHES)) {
      if (TIER_RANK[outcome.tier] === winnerRank) {
        basis.push(
          `locate: also at winning tier [${outcome.tier}] in region ${outcome.region}: ${outcome.citation}`,
        );
      }
    }

    for (const outcome of rankedOutcomes) {
      if (TIER_RANK[outcome.tier] < winnerRank) {
        lawCaveats.push(
          `lower-tier match not flattened: [${outcome.tier}] (${outcome.region}) ${outcome.citation}`,
        );
      }
    }

    if (membership === 'structural-projection') {
      lawCaveats.push(GATE_C5_CAVEAT);
    }

    if (membership === 'none') {
      lawCaveats.push(
        'no projection membership: the located representative is carried by no projection (channel=unresolved; hub capsule structures are source-state-only by their own Gate C.5 declaration)',
      );
    }

    if (evidence.upstreamDeclaredUnresolved !== undefined) {
      lawCaveats.push(
        `declared boundary retained: upstream declares "${evidence.upstreamDeclaredUnresolved}" - located representative wins per law; the boundary itself remains open, not absorbed`,
      );
    }
  } else {
    survivalBucket = 'blocked-unresolved';
    locatorTier = 'not-locatable';
    membership = 'none';
    basis.push(
      'locate: no representative matched any predicate over declared source-state regions {sss, mp, hub} (not-locatable)',
    );
    lawCaveats.push(NOT_LOCATABLE_CAVEAT);
  }

  basis.push(`projection-membership: ${membership}`);

  if (winnerRegion) {
    basis.push(`winning-region: ${winnerRegion}`);
  }

  basis.push(...locator.basisNotes);

  const projectionChannel = MEMBERSHIP_TO_CHANNEL[membership];
  const v0SurvivalBucket = baseline?.survivalBucket ?? 'blocked-unresolved';
  const v0ProjectionChannel = baseline?.projectionChannel ?? 'unresolved';
  const changed =
    survivalBucket !== v0SurvivalBucket || projectionChannel !== v0ProjectionChannel;
  const reachabilityAnnotation = changed
    ? `reachable-via-hub-capsule-region: winning representative located in region ${winnerRegion ?? 'none'} (${truncate(winner?.citation ?? 'no-winner', 160)}); this cell became reachable by the hub-layer capsule region being added, NOT by any change to the tetra-G1 regime - v0 still reports its frozen cell ${v0SurvivalBucket}/${v0ProjectionChannel}`
    : UNCHANGED_ANNOTATION;

  return {
    objectId: definition.objectId,
    objectLabel: definition.objectLabel,
    v0SurvivalBucket,
    v0ProjectionChannel,
    survivalBucket,
    projectionChannel,
    locatorTier,
    changed,
    reachabilityAnnotation,
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

  // At equal tier and membership, status-gated navigation records are preferred
  // over incidental scan leaves as the cited winner (same bucket/channel either
  // way; this is citation precision, not classification).
  const navigatedDelta = Number(right.navigated ?? false) - Number(left.navigated ?? false);

  if (navigatedDelta !== 0) {
    return navigatedDelta;
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
      locate: (regions, evidence) => {
        const scan = scanRegions(regions, (value) => /^[A-D]->[A-D]$/.test(value));
        const signature = findObjectsWithKeyPair(regions, [
          'sharedPrimalVertex',
          'omittedPrimalVertex',
        ]);
        const mentions = scanRegions(regions, (value) => /\bflag\b|medial flag/i.test(value));
        const verifiedFlagStates = regions.hub.flagStates.filter(
          (state) => state.transportedSignIdentityStatus === 'transported-and-identity-verified',
        );
        const navOutcomes: LocatorOutcome[] = [];

        if (verifiedFlagStates.length > 0) {
          navOutcomes.push(
            buildNavigationOutcome(
              'hub.flagStates',
              `${verifiedFlagStates.length}/${regions.hub.flagStates.length} ordered flag-token states verified (transported-and-identity-verified), ${distinctCount(
                regions.hub.flagStates.map((state) => state.flagId),
              )} distinct flagIds, orderedIdentityStatus='${regions.hub.flagStates[0]?.orderedIdentityStatus ?? 'missing'}', sample=${verifiedFlagStates[0]?.flagStateId ?? 'none'}`,
            ),
          );
        }

        const shadow = computeFlagIngredientShadow(regions, evidence);
        const caveats: string[] = [];

        if (shadow.allFlagsHaveIngredientShadow) {
          caveats.push(
            `ingredient shadow present for all ${shadow.flagCount} flags in sss: the two G1 edge states sharing the flag's shared vertex and omitting its omitted vertex exist (e.g. ${shadow.example}) - ingredients are not the token; not a representative`,
          );
        }

        return {
          outcomes: [
            ...toOutcomes(scan, caveats),
            ...toOutcomes(signature, caveats),
            ...toOutcomes(mentions, caveats),
            ...navOutcomes,
          ],
          basisNotes: [
            `locator-predicate: full-string /^[A-D]->[A-D]$/ over {sss, mp, hub}: ${scan.length} match(es); ordered-pair signature objects: ${signature.length}; flag-token prose mentions: ${mentions.length}; hub navigation: ${verifiedFlagStates.length}/${regions.hub.flagStates.length} verified flag states`,
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
      locate: (regions) => {
        const canonicalEdgeIds = new Set(
          regions.sss.generatedChildStates.map((state) => state.edgeStateId),
        );
        const twoLetter = scanRegions(regions, (value) => /^[A-D]{2}$/.test(value));
        const reversedSpellings = twoLetter.filter((match) => {
          const reversed = match.value.split('').reverse().join('');

          return !canonicalEdgeIds.has(match.value) && canonicalEdgeIds.has(reversed);
        });
        const orderedTokens = scanRegions(regions, (value) => /^[A-D]->[A-D]$/.test(value));
        const conventionOutcome: LocatorOutcome = {
          tier: 'record-only-metadata',
          membership: 'none',
          region: 'sss',
          citation: `sss.orientationConvention: id='${regions.sss.orientationConvention.orientationConventionId}', orientationActive=${regions.sss.orientationConvention.orientationActive}, summary="${regions.sss.orientationConvention.conventionSummary}"`,
        };
        const verifiedStates = regions.hub.flagStates.filter(
          (state) => state.transportedSignIdentityStatus === 'transported-and-identity-verified',
        );
        const verifiedIds = new Set(verifiedStates.map((state) => state.flagId));
        const bothSpellingPairs = verifiedStates.filter(
          (state) => verifiedIds.has(state.reverseFlagId) && state.flagId < state.reverseFlagId,
        );
        const navOutcomes: LocatorOutcome[] = [];

        if (bothSpellingPairs.length > 0) {
          navOutcomes.push(
            buildNavigationOutcome(
              'hub.flagStates',
              `${bothSpellingPairs.length} unordered pairs instantiate BOTH ordered spellings as distinct verified states (e.g. ${bothSpellingPairs[0]?.flagId} and ${bothSpellingPairs[0]?.reverseFlagId}); reverse map is a fixed-point-free involution; orderedIdentityStatus='${regions.hub.flagStates[0]?.orderedIdentityStatus ?? 'missing'}'`,
            ),
          );
        }

        const polaritySample = regions.mp.structuralProjections[0];
        const caveats = [
          `conflation guard: mp.structuralProjections polarity/starSign (e.g. ${polaritySample ? `${polaritySample.edgeStateId}: ${polaritySample.polarity}, starSign=${polaritySample.starSign}` : 'none present'}) distinguishes the two edges of a complement axis, not the two orders of one flag - analogous-but-distinct, not a representative`,
        ];

        return {
          outcomes: [
            ...toOutcomes(reversedSpellings, caveats),
            ...toOutcomes(orderedTokens, caveats),
            conventionOutcome,
            ...navOutcomes,
          ],
          basisNotes: [
            `locator-predicate: reversed two-letter spellings: ${reversedSpellings.length} among ${twoLetter.length}; ordered tokens over {sss, mp, hub}: ${orderedTokens.length}; sss orientation-convention by navigation; hub navigation: ${bothSpellingPairs.length} both-spelling pairs among verified states`,
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
      locate: (regions) => {
        const signedUnits = scanRegions(regions, (value) => /^[+-]e[1-7]$/.test(value));
        const mentions = scanRegions(regions, (value) =>
          /\bfano\b|signed lift|\boctonion/i.test(value),
        );
        const summary = regions.hub.recomputationSummary;
        const verifiedLiftStates = regions.hub.flagStates.filter(
          (state) => state.transportedSignIdentityStatus === 'transported-and-identity-verified',
        );
        const navOutcomes: LocatorOutcome[] = [];

        if (verifiedLiftStates.length > 0) {
          navOutcomes.push(
            buildNavigationOutcome(
              'hub.flagStates',
              `signed Fano lifts instantiated as transported facts: ${summary.liftIdentityVerifiedCount}/${summary.flagStateCount} transported-and-identity-verified (unit AND sign), ${summary.distinctRecomputedSignedLiftCount} distinct lifts over ${summary.flagStateCount} ordered states, sample ${verifiedLiftStates[0]?.flagId}=${verifiedLiftStates[0]?.recomputedSignedLiftLabel}`,
            ),
          );
        }

        const starSignBearingRows = regions.mp.structuralProjections.filter((projection) =>
          Number.isFinite(projection.starSign),
        );
        const caveats = [
          `sign-without-unit: mp.structuralProjections carry starSign on ${starSignBearingRows.length} rows with no algebraic unit attached - not a lift representative (count-vs-structure guard)`,
        ];

        return {
          outcomes: [...toOutcomes(signedUnits, caveats), ...toOutcomes(mentions, caveats), ...navOutcomes],
          basisNotes: [
            `locator-predicate: full-string /^[+-]e[1-7]$/ over {sss, mp, hub}: ${signedUnits.length} match(es); Fano/octonion/signed-lift prose mentions: ${mentions.length}; hub navigation: ${summary.liftIdentityVerifiedCount}/${summary.flagStateCount} verified lifts`,
          ],
          caveats,
        };
      },
    },
    {
      objectId: 'carrier-ray',
      objectLabel: 'carrier ray',
      extract: ({ disc }) => {
        const rayGroups = buildRayGroupsFromDisc(disc);

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
      locate: (regions, evidence) => {
        const rayGroups = (evidence.payload as RayGroup[] | undefined) ?? [];
        const outcomes: LocatorOutcome[] = [];
        const caveats: string[] = [];
        const basisNotes: string[] = [];

        for (const group of rayGroups) {
          const pairSet = new Set(group.pairKeys);
          const axis = regions.sss.complementAxes.find(
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

          const covarianceRow = regions.sss.antipodalCovarianceAudit.rows.find(
            (row) => pairSet.has(row.edgeStateId) && pairSet.has(row.complementEdgeStateId),
          );
          const involutionRowsPass = axis.edgeStateIds.every((edgeId) =>
            regions.sss.complementInvolutionAudit.rows.some(
              (row) => row.edgeStateId === edgeId && row.involutionStatus === 'pass',
            ),
          );

          if (covarianceRow?.covarianceStatus === 'pass' && involutionRowsPass) {
            outcomes.push({
              tier: 'instantiated-structural',
              membership: 'structural-projection',
              region: 'sss',
              citation: `${group.carrierRay} <-> ${axis.axisPairId} (pair-set {${group.pairKeys.join(',')}}) verified through sss.antipodalCovarianceAudit.covarianceStatus=pass and sss.complementInvolutionAudit.involutionStatus=pass`,
            });
          } else {
            caveats.push(
              `ray ${group.carrierRay} matched ${axis.axisPairId} but audit verification failed (covariance=${covarianceRow?.covarianceStatus ?? 'missing'}, involutionAllPass=${involutionRowsPass}) - correspondence downgraded to caveat, not a representative`,
            );
          }
        }

        const verifiedAxisIds = new Set(
          regions.hub.antipodalAxes
            .filter(
              (axis) =>
                axis.recomputedOppositionStatus === 'same-ray-opposite-sign' &&
                axis.rootNegationStatus === 'root-negation-verified' &&
                axis.upstreamAgreementStatus === 'agrees-with-upstream',
            )
            .map((axis) => axis.axisId),
        );
        const verifiedRayGroups = regions.hub.rayGroups.filter((group) =>
          group.axisIds.every((axisId) => verifiedAxisIds.has(axisId)),
        );

        if (verifiedRayGroups.length > 0) {
          outcomes.push(
            buildNavigationOutcome(
              'hub.rayGroups',
              `${verifiedRayGroups.length}/${regions.hub.rayGroups.length} ray groups with all member axes verified (e.g. ${verifiedRayGroups[0]?.carrierRay}: ${verifiedRayGroups[0]?.flagIds.length} flags over ${verifiedRayGroups[0]?.axisIds.length} antipodal flag axes)`,
            ),
          );
        }

        const rayLabelMatches = scanRegions(regions, (value) => /^ray:e[1-7]$/.test(value));

        basisNotes.push(
          `algebraicRayLabelLocated: ${rayLabelMatches.length > 0} (${
            rayLabelMatches.length > 0
              ? rayLabelMatches
                  .slice(0, MAX_CITED_MATCHES)
                  .map((match) => `${match.path}="${match.value}"`)
                  .join('; ') + `; ${rayLabelMatches.length} total`
              : 'ray:e_k label not found among declared source-state regions'
          }) - recorded separately from the axis-label correspondence`,
        );
        caveats.push(
          'label distinctness: the algebraic ray label (ray:e_k) and the edge-complement axis label (axis:XY-ZW) are distinct vocabularies; located representatives are structural correspondences, never a merged label',
        );
        outcomes.push(...toOutcomes(rayLabelMatches, caveats));

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
      locate: (regions, evidence) => {
        const transport = runOrientationSignTransportTest(regions, evidence);
        const outcomes: LocatorOutcome[] = [];
        const caveats: string[] = [];
        const basisNotes = [
          `transportVerdict (mp starSign): ${transport.verdict} (${transport.detail})`,
          `sss.polarityConvention: id='${regions.sss.polarityConvention.polarityConventionId}', polarityActive=${regions.sss.polarityConvention.polarityActive}`,
        ];

        if (transport.verdict === 'transported-from-fano-lift') {
          outcomes.push({
            tier: 'instantiated-structural',
            membership: 'structural-projection',
            region: 'mp',
            citation: `mp.structuralProjections starSign assignment is forced by upstream Fano signs (${transport.detail})`,
          });
        } else {
          caveats.push(
            `starSign/polarity on mp.structuralProjections is not a transport of the Fano lift sign (${transport.verdict}); located mp sign structure is caveat-only, not a representative (count-vs-structure guard / F1 precedent)`,
          );

          if (!regions.sss.polarityConvention.polarityActive) {
            caveats.push(
              `sss.polarityConvention.polarityActive=false ('${regions.sss.polarityConvention.polarityConventionId}') corroborates reconstruction on the mp side`,
            );
          }
        }

        const summary = regions.hub.recomputationSummary;
        const verifiedLiftCount = summary.liftIdentityVerifiedCount;
        const verifiedAxisCount = summary.antipodalAxisVerifiedCount;

        if (verifiedLiftCount > 0 && verifiedAxisCount > 0) {
          outcomes.push(
            buildNavigationOutcome(
              'hub.flagStates',
              `orientation sign carried as a TRANSPORTED fact: ${verifiedLiftCount}/${summary.flagStateCount} lifts transported-and-identity-verified including their sign component; ${verifiedAxisCount}/${summary.antipodalAxisCount} antipodal flag axes verified same-ray-opposite-sign with root-negation-verified`,
            ),
          );
        }

        const mentions = scanRegions(regions, (value) =>
          /\borientation\b|\bpolarity\b|\bsign\b/i.test(value),
        );

        outcomes.push(...toOutcomes(mentions, caveats));
        basisNotes.push(
          `locator-predicate: orientation/polarity/sign prose mentions over {sss, mp, hub}: ${mentions.length} match(es); hub navigation gated on lift identity + axis opposition verification`,
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
      locate: (regions) => {
        const mentions = scanRegions(regions, (value) => /\btriangle\b|\bclosure\b/i.test(value));
        const relationRecords = collectRelationRecords(regions, 3, /closure/i);
        const verifiedRelations = regions.hub.triangleClosureRelations.filter(
          (relation) => relation.relationAgreementStatus === 'agrees-with-upstream',
        );
        const navOutcomes: LocatorOutcome[] = [];

        if (verifiedRelations.length > 0) {
          const totalRows = verifiedRelations.reduce((sum, relation) => sum + relation.rowCount, 0);
          const agreeRows = verifiedRelations.reduce(
            (sum, relation) => sum + relation.agreementCount,
            0,
          );

          navOutcomes.push(
            buildNavigationOutcome(
              'hub.triangleClosureRelations',
              `${verifiedRelations.length}/${regions.hub.triangleClosureRelations.length} triangle closure relations recomputed-and-agree (${agreeRows}/${totalRows} ordered products), sample ${verifiedRelations[0]?.relationId}`,
            ),
          );
        }

        const caveats = [buildLowArityCaveat(regions, 'three-term triangle closure')];

        return {
          outcomes: [...toOutcomes(mentions, caveats), ...toOutcomes(relationRecords, caveats), ...navOutcomes],
          basisNotes: [
            `locator-predicate: triangle/closure prose mentions over {sss, mp, hub}: ${mentions.length}; relation-record search (>=3 distinct state references + /closure/i keys; closure-specific so holonomy records are not cross-matched): ${relationRecords.length} record(s); hub navigation: ${verifiedRelations.length} recomputed-agree relations`,
          ],
          caveats,
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
      locate: (regions) => {
        const mentions = scanRegions(regions, (value) => /\bsquare\b|\bholonomy\b/i.test(value));
        const relationRecords = collectRelationRecords(regions, 4, /holonomy|cycle/i);
        const verifiedRelations = regions.hub.squareHolonomyRelations.filter(
          (relation) => relation.relationAgreementStatus === 'agrees-with-upstream',
        );
        const navOutcomes: LocatorOutcome[] = [];

        if (verifiedRelations.length > 0) {
          const totalRows = verifiedRelations.reduce((sum, relation) => sum + relation.rowCount, 0);
          const agreeRows = verifiedRelations.reduce(
            (sum, relation) => sum + relation.agreementCount,
            0,
          );

          navOutcomes.push(
            buildNavigationOutcome(
              'hub.squareHolonomyRelations',
              `${verifiedRelations.length}/${regions.hub.squareHolonomyRelations.length} square holonomy relations recomputed-and-agree (${agreeRows}/${totalRows} orientation variants), sample ${verifiedRelations[0]?.relationId}`,
            ),
          );
        }

        const caveats = [buildLowArityCaveat(regions, 'four-term square holonomy')];

        return {
          outcomes: [...toOutcomes(mentions, caveats), ...toOutcomes(relationRecords, caveats), ...navOutcomes],
          basisNotes: [
            `locator-predicate: square/holonomy prose mentions over {sss, mp, hub}: ${mentions.length}; relation-record search (>=4 distinct state references + /holonomy|cycle/i keys; holonomy-specific so closure records are not cross-matched): ${relationRecords.length} record(s); hub navigation: ${verifiedRelations.length} recomputed-agree relations`,
          ],
          caveats,
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
      locate: (regions) => {
        const mentions = scanRegions(regions, (value) =>
          /\bquadrangle\b|\bgauge\b/i.test(value),
        ).filter((match) => !match.path.includes('.structuralCovarianceAudit'));
        const allUnitLeaves = scanRegions(regions, (value) => /^e[1-7]$/.test(value));
        const unitSets = allUnitLeaves.filter((match) =>
          /gauge|quadrangle/i.test(match.path),
        );
        const unitLeavesOutsideGaugeRecords = allUnitLeaves.length - unitSets.length;
        const meta = regions.hub.gaugeRobustnessMeta;
        const navOutcomes: LocatorOutcome[] = [];

        if (meta.upstreamGaugeRobustnessStatus) {
          navOutcomes.push(
            buildNavigationOutcome(
              'hub.gaugeRobustnessMeta',
              `declared meta-property record: ${meta.quadrangleCount} quadrangles x ${meta.labelingCount} labelings, upstream status='${meta.upstreamGaugeRobustnessStatus}', invarianceKind='${meta.invarianceKind}', invarianceDistinction='${meta.invarianceDistinction}', recomputationStatus='${meta.recomputationStatus}'`,
            ),
          );
        }

        const relabelingIds = regions.sss.structuralCovarianceAudit.rows.map(
          (row) => row.relabelingId,
        );
        const caveats = [
          `distinctness guard: sss.structuralCovarianceAudit enumerates S4 vertex relabelings [${relabelingIds.join(', ')}] - vertex relabeling is not Fano carrier gauge; analogous-but-distinct, not a representative (the hub capsule itself records invarianceDistinction='distinct-from-s4-vertex-relabeling')`,
        ];

        if (unitLeavesOutsideGaugeRecords > 0) {
          caveats.push(
            `count-vs-structure guard: ${unitLeavesOutsideGaugeRecords} algebra-unit leaves outside gauge/quadrangle records (lift and primal-assignment fields) are single carrier units, not enumerations of alternative labelings - not gauge-robustness representatives`,
          );
        }

        return {
          outcomes: [...toOutcomes(mentions, caveats), ...toOutcomes(unitSets, caveats), ...navOutcomes],
          basisNotes: [
            `locator-predicate: quadrangle/gauge mentions over {sss, mp, hub} (structuralCovarianceAudit paths excluded by guard): ${mentions.length}; algebra-unit enumeration leaves within gauge/quadrangle records: ${unitSets.length} (of ${allUnitLeaves.length} unit leaves total); hub navigation: declared meta record ${meta.upstreamGaugeRobustnessStatus ? 'present' : 'absent'}`,
          ],
          caveats,
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
      locate: (regions) => buildProvenanceRouteLocator(regions, 'tetra-g2-core', (value) =>
        /\bg2\b|second-ambo|\bcuboctahedron\b/i.test(value),
      ),
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
      locate: (regions) => buildProvenanceRouteLocator(regions, 'octa-g1', (value) =>
        /\bocta/i.test(value),
      ),
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
      locate: (regions) => buildProvenanceRouteLocator(regions, 'cube-g1', (value) =>
        /\bcube\b/i.test(value),
      ),
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
      locate: (regions) => {
        const primalVertexIds = regions.sss.primalStates.map((state) => state.vertexId);
        const mentions = scanRegions(regions, (value) =>
          /cube[- ]primal|eight[- ]vertex|8[- ]vertex/i.test(value),
        );
        const boundary = regions.hub.openBoundaries.find(
          (candidate) => candidate.boundaryId === 'cube-primal-sourcehood',
        );
        const navOutcomes: LocatorOutcome[] = [];

        if (boundary && boundary.upstreamStatus) {
          navOutcomes.push(
            buildNavigationOutcome(
              'hub.openBoundaries',
              `declared open boundary record: boundaryId='${boundary.boundaryId}', upstreamStatus='${boundary.upstreamStatus}' (verbatim), boundaryStatus='${boundary.boundaryStatus}', corroboration entries=${boundary.corroboration.length}`,
            ),
          );
        }

        const caveats: string[] = [];

        return {
          outcomes: [...toOutcomes(mentions, caveats), ...navOutcomes],
          basisNotes: [
            `locator-predicate: cube-primal/eight-vertex mentions over {sss, mp, hub}: ${mentions.length} match(es); hub navigation: open-boundary record ${boundary ? 'present' : 'absent'}`,
            `locator-context: sss.primalStates count=${primalVertexIds.length}, vertexIds=[${primalVertexIds.join(', ')}] (no primal vertex beyond A-D instantiated in the tetra-G1 regime)`,
          ],
          caveats,
        };
      },
    },
  ];
}

function buildProvenanceRouteLocator(
  regions: SourceStateRegions,
  routeKind: 'tetra-g2-core' | 'octa-g1' | 'cube-g1',
  mentionPredicate: (value: string) => boolean,
): LocatorResult {
  const mentions = scanRegions(regions, mentionPredicate);
  const route = regions.hub.provenanceRoutes.find(
    (candidate) => candidate.routeKind === routeKind,
  );
  const navOutcomes: LocatorOutcome[] = [];
  const caveats: string[] = [];

  if (route && route.upstreamBridgeStatus) {
    const medialHub = route.medialHubStatus
      ? `, medialHubStatus='${route.medialHubStatus}' (verbatim)`
      : '';

    navOutcomes.push(
      buildNavigationOutcome(
        'hub.provenanceRoutes',
        `provenance route '${route.routeKind}': upstreamBridgeStatus='${route.upstreamBridgeStatus}' (verbatim), topologies=[${route.coreTopologies.join(',')}]${medialHub}`,
      ),
    );
  }

  const derivationKinds = collectDerivationKinds(regions);

  return {
    outcomes: [...toOutcomes(mentions, caveats), ...navOutcomes],
    basisNotes: [
      `locator-predicate: ${routeKind} mentions over {sss, mp, hub}: ${mentions.length} match(es); hub navigation: route record ${route ? 'present' : 'absent'} (status-gated)`,
      `locator-context: sss.diagnosticScope='${regions.sss.diagnosticScope}', derivationKind set=[${derivationKinds.join(', ')}] (tetra-G1 regime unchanged)`,
    ],
    caveats,
  };
}

interface RegionMatch {
  tier: Exclude<MedialCarrierLocatorTierV1, 'not-locatable'>;
  membership: MedialCarrierProjectionMembershipV1;
  path: string;
  value: string;
  region: MedialCarrierRegionIdV1;
  verified: boolean;
}

function buildNavigationOutcome(path: string, detail: string): LocatorOutcome {
  const classified = classifyScanPath(path);

  if (!classified) {
    throw new Error(`navigation outcome path '${path}' has no region rule`);
  }

  return {
    tier: classified.tier,
    membership: classified.membership,
    region: regionOfPath(path),
    citation: `${path}: ${detail}`,
    navigated: true,
  };
}

function toOutcomes(matches: RegionMatch[], caveatSink: string[]): LocatorOutcome[] {
  const unverified = matches.filter((match) => !match.verified);

  if (unverified.length > 0) {
    caveatSink.push(
      `unverified hub record matches demoted (capsule record status not verified): ${unverified
        .slice(0, 2)
        .map((match) => `${match.path}="${truncate(match.value, 60)}"`)
        .join('; ')}${unverified.length > 2 ? ` (+${unverified.length - 2} more)` : ''}`,
    );
  }

  return matches
    .filter((match) => match.verified)
    .map((match) => ({
      tier: match.tier,
      membership: match.membership,
      region: match.region,
      citation: `${match.path} = "${match.value}"`,
    }));
}

function scanRegions(
  regions: SourceStateRegions,
  predicate: (value: string) => boolean,
): RegionMatch[] {
  const matches: RegionMatch[] = [];

  for (const [label, root] of [
    ['sss', regions.sss],
    ['mp', regions.mp],
    ['hub', regions.hub],
  ] as const) {
    walkStringLeaves(root, label, (path, value) => {
      if (!predicate(value)) {
        return;
      }

      const region = classifyScanPath(path);

      if (region) {
        matches.push({
          tier: region.tier,
          membership: region.membership,
          path,
          value,
          region: label,
          verified: label === 'hub' ? hubRecordIsVerified(path, regions.hub) : true,
        });
      }
    });
  }

  return matches;
}

// Verification gating (binding rule): a hub capsule record whose own status is
// unverified is not a representative. Applies uniformly to scan and navigation
// matches at the law level, not per object.
function hubRecordIsVerified(path: string, hub: HubLayerSourceStateCapsuleV0Report): boolean {
  if (!hub.ok) {
    return false;
  }

  const match = /^hub\.([A-Za-z]+)(?:\[(\d+)\])?/.exec(path);

  if (!match) {
    return false;
  }

  const region = match[1];
  const index = match[2] === undefined ? -1 : Number(match[2]);

  switch (region) {
    case 'flagStates':
      return (
        hub.flagStates[index]?.transportedSignIdentityStatus ===
        'transported-and-identity-verified'
      );
    case 'antipodalAxes':
      return hubAxisIsVerified(hub, hub.antipodalAxes[index]?.axisId);
    case 'rayGroups':
      return (
        hub.rayGroups[index]?.axisIds.every((axisId) => hubAxisIsVerified(hub, axisId)) ?? false
      );
    case 'triangleClosureRelations':
      return (
        hub.triangleClosureRelations[index]?.relationAgreementStatus === 'agrees-with-upstream'
      );
    case 'squareHolonomyRelations':
      return (
        hub.squareHolonomyRelations[index]?.relationAgreementStatus === 'agrees-with-upstream'
      );
    case 'gaugeRobustnessMeta':
      return Boolean(hub.gaugeRobustnessMeta.upstreamGaugeRobustnessStatus);
    case 'provenanceRoutes':
      return Boolean(hub.provenanceRoutes[index]?.upstreamBridgeStatus);
    case 'openBoundaries':
      return Boolean(hub.openBoundaries[index]?.upstreamStatus);
    case 'tupleReductionDeclaration':
      return hub.tupleReductionDeclaration.lostUnderScalarTupleReduction.length > 0;
    case 'primalCarrierAssignment':
      return true;
    default:
      return false;
  }
}

function hubAxisIsVerified(
  hub: HubLayerSourceStateCapsuleV0Report,
  axisId: string | undefined,
): boolean {
  if (!axisId) {
    return false;
  }

  const axis = hub.antipodalAxes.find((candidate) => candidate.axisId === axisId);

  return (
    axis !== undefined &&
    axis.recomputedOppositionStatus === 'same-ray-opposite-sign' &&
    axis.rootNegationStatus === 'root-negation-verified' &&
    axis.upstreamAgreementStatus === 'agrees-with-upstream'
  );
}

function classifyScanPath(path: string): {
  tier: Exclude<MedialCarrierLocatorTierV1, 'not-locatable'>;
  membership: MedialCarrierProjectionMembershipV1;
} | null {
  for (const rule of REGION_RULES) {
    if (path.includes(rule.pathFragment)) {
      return { tier: rule.tier, membership: rule.membership };
    }
  }

  return null;
}

function regionOfPath(path: string): MedialCarrierRegionIdV1 {
  if (path.startsWith('hub')) {
    return 'hub';
  }

  if (path.startsWith('mp')) {
    return 'mp';
  }

  return 'sss';
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
  regions: SourceStateRegions,
  requiredKeys: string[],
): RegionMatch[] {
  const matches: RegionMatch[] = [];

  for (const [label, root] of [
    ['sss', regions.sss],
    ['mp', regions.mp],
    ['hub', regions.hub],
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
          region: label,
          verified: label === 'hub' ? hubRecordIsVerified(path, regions.hub) : true,
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
  regions: SourceStateRegions,
  minimumDistinctStateReferenceCount: number,
  relationKeyPattern: RegExp,
): RegionMatch[] {
  const candidates: Array<RegionMatch & { refCount: number }> = [];

  for (const [label, root] of [
    ['sss', regions.sss],
    ['mp', regions.mp],
    ['hub', regions.hub],
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
          value: `relation record: refs=[${[...stateReferences].slice(0, 6).join(', ')}${stateReferences.size > 6 ? ', ...' : ''}], keys=[${matchedKeys.join(', ')}]`,
          region: label,
          verified: label === 'hub' ? hubRecordIsVerified(path, regions.hub) : true,
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

function buildLowArityCaveat(regions: SourceStateRegions, requiredRelation: string): string {
  const quarkChannelCount = regions.sss.generatedChildStates.reduce(
    (sum, state) => sum + (state.derivationComponent.quarkChannels?.length ?? 0),
    0,
  );
  const complementPairCount = regions.mp.structuralOperations.complementPairs.length;

  return `arity guard: two-term records exist in sss/mp (${quarkChannelCount} quark channel parent/projection records, ${complementPairCount} complement pairs) - arity below ${requiredRelation}; lower-arity neighbors, not representatives`;
}

function buildRayGroupsFromDisc(
  disc: OctonionVsA3MedialCarrierDiscriminatorV0Report,
): RayGroup[] {
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

function buildPairSignSets(
  disc: OctonionVsA3MedialCarrierDiscriminatorV0Report,
): PairSignSet[] {
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
  regions: SourceStateRegions,
  evidence: ExtractorResult,
): { verdict: string; detail: string } {
  const pairSignSets = (evidence.payload as PairSignSet[] | undefined) ?? [];
  const starSignByEdge = new Map(
    regions.mp.structuralProjections.map((projection) => [
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
  regions: SourceStateRegions,
  evidence: ExtractorResult,
): { allFlagsHaveIngredientShadow: boolean; flagCount: number; example: string } {
  const flagCount = evidence.evidenceRowCount;
  const edgeStates = regions.sss.generatedChildStates;
  const primalLabels = ['A', 'B', 'C', 'D'];
  let allHaveShadow = flagCount > 0;
  let example = 'none';

  for (const shared of primalLabels) {
    for (const omitted of primalLabels) {
      if (shared === omitted) {
        continue;
      }

      const ingredientEdges = edgeStates.filter(
        (state) => state.endpoints.includes(shared) && !state.endpoints.includes(omitted),
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

function collectDerivationKinds(regions: SourceStateRegions): string[] {
  const kinds = new Set<string>();

  for (const state of regions.sss.primalStates) {
    kinds.add(state.derivationComponent.derivationKind);
  }

  for (const state of regions.sss.generatedChildStates) {
    kinds.add(state.derivationComponent.derivationKind);
  }

  return [...kinds].sort();
}

function buildSourceStateRealVerdict(args: {
  rows: MedialCarrierSourceStateSurvivalAuditV1Row[];
  sourceStateRealCount: number;
  sideTableCount: number;
  orphanCount: number;
  baseSurvives: boolean;
  fiberSurvives: boolean;
  decisionD1Triggered: boolean;
}): string {
  const listFor = (buckets: readonly MedialCarrierSurvivalBucketV1[]): string =>
    args.rows
      .filter((row) => buckets.includes(row.survivalBucket))
      .map((row) => `${row.objectId}=${row.survivalBucket}`)
      .join(', ') || 'none';

  return [
    `post-lift source-state-real (${args.sourceStateRealCount}/12): ${listFor(SOURCE_STATE_REAL_BUCKETS)}`,
    `inert side-table (${args.sideTableCount}/12): ${listFor(SIDE_TABLE_BUCKETS)}`,
    `orphaned (${args.orphanCount}/12): ${listFor(ORPHAN_BUCKETS)}`,
    `baseSurvives(carrier-ray)=${args.baseSurvives}`,
    `fiberSurvives(signed-fano-lift AND triangle-closure-relation AND square-holonomy-relation)=${args.fiberSurvives}`,
    `decisionD1Triggered=${args.decisionD1Triggered} under rule '${DECISION_D1_RULE}'`,
  ].join('; ');
}

function buildDeltaSummary(args: {
  rows: MedialCarrierSourceStateSurvivalAuditV1Row[];
  bucketCounts: Record<MedialCarrierSurvivalBucketV1, number>;
  decisionD1Triggered: boolean;
}): string {
  const v0BucketCounts = countByKey(
    SURVIVAL_BUCKETS,
    RATIFIED_STATION_I_BASELINE.map((cell) => cell.survivalBucket),
  );
  const changedRows = args.rows.filter((row) => row.changed);
  const changedList = changedRows.length
    ? changedRows
        .map(
          (row) =>
            `${row.objectId}: ${row.v0SurvivalBucket}/${row.v0ProjectionChannel} -> ${row.survivalBucket}/${row.projectionChannel}`,
        )
        .join('; ')
    : 'none';
  const bucketDeltas = SURVIVAL_BUCKETS.map(
    (bucket) => `${bucket}: ${v0BucketCounts[bucket]} -> ${args.bucketCounts[bucket]}`,
  ).join('; ');
  const newlyPopulated = SURVIVAL_BUCKETS.filter(
    (bucket) => v0BucketCounts[bucket] === 0 && args.bucketCounts[bucket] > 0,
  );
  const newlyPopulatedNote = newlyPopulated.length
    ? ` previously-empty bucket(s) gained members: ${newlyPopulated
        .map((bucket) => `${bucket} (+${args.bucketCounts[bucket]})`)
        .join(', ')} - reachable only because the hub-layer capsule region was added; the tetra-G1 regime is unchanged (v0 still reports its frozen result).`
    : ' no previously-empty bucket gained members.';

  return `v0->v1 delta: ${changedRows.length}/12 cells changed [${changedList}]; bucket counts: ${bucketDeltas};${newlyPopulatedNote} decisionD1Triggered: ${RATIFIED_STATION_I_AGGREGATES.decisionD1Triggered} -> ${args.decisionD1Triggered}.`;
}

function buildIntegrityIssues(args: {
  consumed: {
    disc: OctonionVsA3MedialCarrierDiscriminatorV0Report;
    card: MedialDualEquivariantCarrierPolicyModelCardV0Report;
    sss: StructuredSourceStateDiagnosticV0Report;
    mp: StructuredSourceStateMultiProjectionStructuralChannelV0Report;
    hub: HubLayerSourceStateCapsuleV0Report;
    v0: MedialCarrierSourceStateSurvivalAuditV0Report;
  };
  rows: MedialCarrierSourceStateSurvivalAuditV1Row[];
  bucketCounts: Record<MedialCarrierSurvivalBucketV1, number>;
  channelCounts: Record<MedialCarrierProjectionChannelV1, number>;
  sourceStateRealCount: number;
  sideTableCount: number;
  orphanCount: number;
  baseSurvives: boolean;
  fiberSurvives: boolean;
  decisionD1Triggered: boolean;
  sourceStateRealVerdict: string;
  deltaSummary: string;
}): MedialCarrierSourceStateSurvivalAuditV1Issue[] {
  const issues: MedialCarrierSourceStateSurvivalAuditV1Issue[] = [];
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
    {
      label: 'hubCapsule',
      method: args.consumed.hub.method,
      expected: 'hub-layer-source-state-capsule-v0',
      ok: args.consumed.hub.ok,
    },
    {
      label: 'survivalAuditV0',
      method: args.consumed.v0.method,
      expected: 'medial-carrier-source-state-survival-audit-v0',
      ok: args.consumed.v0.ok,
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
        message: `${consumed.label} report is not ok; v1 preconditions fail.`,
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
    const locateNamesRegion = row.derivationBasis.some(
      (entry) =>
        entry.startsWith('locate') &&
        (entry.includes('sss.') ||
          entry.includes('mp.') ||
          entry.includes('hub.') ||
          entry.includes('region sss') ||
          entry.includes('region mp') ||
          entry.includes('region hub') ||
          entry.includes('(not-locatable)') ||
          entry.startsWith('locate-override:')),
    );

    if (
      row.derivationBasis.length === 0 ||
      !hasExtractCitation ||
      !hasLocateCitation ||
      !locateNamesRegion
    ) {
      issues.push({
        code: 'derivation-basis-missing-citation',
        message: `${row.objectId} derivationBasis must carry at least one extractor citation and one region-naming locator citation.`,
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

    if (row.changed) {
      const winnerInHub = row.derivationBasis.includes('winning-region: hub');
      const annotated = row.reachabilityAnnotation.includes('reachable-via-hub-capsule-region');

      if (!winnerInHub || !annotated) {
        issues.push({
          code: 'changed-cell-without-hub-reachability',
          message: `${row.objectId} changed from its v0 cell but the change is not attributed to a hub-region winner (winnerInHub=${winnerInHub}, annotated=${annotated}); the tetra-G1 regime is unchanged, so only the added capsule region may explain a change.`,
        });
      }
    } else if (row.reachabilityAnnotation !== UNCHANGED_ANNOTATION) {
      issues.push({
        code: 'unchanged-cell-with-reachability-annotation',
        message: `${row.objectId} is unchanged but carries a non-baseline annotation.`,
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
    issues.push({ code: 'non-finite-aggregate', message: 'One or more aggregate counts is non-finite.' });
  }

  if (sumValues(SURVIVAL_BUCKETS.map((bucket) => args.bucketCounts[bucket])) !== 12) {
    issues.push({ code: 'bucket-count-sum-mismatch', message: 'bucketCounts do not sum to 12.' });
  }

  if (sumValues(PROJECTION_CHANNELS.map((channel) => args.channelCounts[channel])) !== 12) {
    issues.push({ code: 'channel-count-sum-mismatch', message: 'channelCounts do not sum to 12.' });
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

  if (!args.deltaSummary || !args.deltaSummary.includes('v0->v1 delta')) {
    issues.push({ code: 'delta-summary-missing', message: 'deltaSummary must be assembled and labeled.' });
  }

  return issues;
}

function rowIsSourceStateReal(
  rows: MedialCarrierSourceStateSurvivalAuditV1Row[],
  objectId: MedialCarrierPolicyObjectIdV1,
): boolean {
  const row = rows.find((candidate) => candidate.objectId === objectId);

  return row !== undefined && SOURCE_STATE_REAL_BUCKETS.includes(row.survivalBucket);
}

function countByKey<TKey extends string>(
  keys: readonly TKey[],
  values: TKey[] | readonly TKey[],
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

function truncate(value: string, maximumLength: number): string {
  return value.length <= maximumLength ? value : `${value.slice(0, maximumLength)}...`;
}

function dedupeIssues(
  issues: MedialCarrierSourceStateSurvivalAuditV1Issue[],
): MedialCarrierSourceStateSurvivalAuditV1Issue[] {
  const seen = new Set<string>();

  return issues.filter((issue) => {
    const key = `${issue.code}:${issue.message}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
