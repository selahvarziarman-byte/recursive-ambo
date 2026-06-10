import {
  buildFanoOctonionicCarrierGraphFieldV0Report,
  type FanoCarrierGraphActivationStatus,
  type FanoCarrierGraphEdgeFamily,
  type FanoCarrierGraphEdgeRow,
  type FanoCarrierGraphNodeRole,
  type FanoCarrierGraphNodeRow,
  type FanoCarrierGraphSetRow,
} from './fanoOctonionicCarrierGraphFieldV0';
import {
  buildFanoOctonionicSpatialSupportProjectionV0Report,
  type FanoFieldContributionSampleRow,
  type FanoSpatialSamplePointRow,
  type FanoSpatialSupportSampleRow,
} from './fanoOctonionicSpatialSupportProjectionV0';

export type FanoGenerationIndex = 0 | 1;
export type FanoGenerationSourceMembershipStatus =
  | 'persistent-primal-source'
  | 'born-child-source';
export type FanoGenerationResponseEdgeFamily = Exclude<
  FanoCarrierGraphEdgeFamily,
  'birth-edge'
>;

export interface FanoGenerationSnapshotRow {
  snapshotId: string;
  graphId: string;
  profileSetId: string;
  generationIndex: FanoGenerationIndex;
  generationLabel:
    | 'generation-0-primal-only'
    | 'generation-1-primal-plus-born-children';
  activeSourceCount: number;
  activePrimalSourceCount: number;
  activeChildSourceCount: number;
  activeGraphEdgeCount: number;
  baselineContributionCount: number;
  responseProbeContributionAvailabilityCount: number;
  structuralBirthSupportAvailabilityCount: number;
  samplePointCount: number;
  sourcePopulationStatus:
    | 'primal-root-sources-only'
    | 'primal-root-sources-plus-born-children';
  fieldRecomputationStatus: 'baseline-field-recomputed-from-generation-active-sources';
}

export interface FanoGenerationTransitionRow {
  transitionId: string;
  graphId: string;
  profileSetId: string;
  fromGenerationIndex: 0;
  toGenerationIndex: 1;
  persistentSourceCount: 4;
  bornSourceCount: 6;
  retiredSourceCount: 0;
  newEdgeCount: 36;
  activeSourceUpdateLaw: 'active-sources-g1-equals-g0-plus-born-sources';
  carrierGraphUpdateStatus: 'first-birth-carrier-graph-added-without-g2-carrier-invention';
  spatialProjectionUpdateStatus: 'f2-spatial-support-reused-for-generation-snapshots';
  fieldUpdateStatus: 'baseline-field-recomputed-after-source-population-update';
}

export interface FanoActiveSourceMembershipRow {
  membershipId: string;
  snapshotId: string;
  graphId: string;
  generationIndex: FanoGenerationIndex;
  nodeId: string;
  sourceToken: string;
  nodeRole: FanoCarrierGraphNodeRole;
  sourceMembershipStatus: FanoGenerationSourceMembershipStatus;
  activationStatus: 'active-in-generation-snapshot';
}

export interface FanoGenerationEdgeAvailabilityRow {
  edgeAvailabilityId: string;
  snapshotId: string;
  graphId: string;
  generationIndex: 1;
  edgeId: string;
  edgeFamily: FanoCarrierGraphEdgeFamily;
  activationStatus: FanoCarrierGraphActivationStatus;
  baselineInclusionStatus:
    | 'structural-birth-edge-not-field-emission'
    | 'available-response-excluded-from-baseline';
  edgeAvailabilityStatus: 'available-in-generation-1-carrier-graph';
}

export interface FanoBaselineContributionSelectionRow {
  selectionId: string;
  snapshotId: string;
  graphId: string;
  generationIndex: FanoGenerationIndex;
  samplePointId: string;
  contributionId: string;
  ownerId: string;
  ownerKind: 'node';
  sourceMembershipStatus: FanoGenerationSourceMembershipStatus;
  baselineSelectionStatus: 'included-in-generation-baseline-field';
}

export interface FanoResponseProbeContributionAvailabilityRow {
  responseProbeAvailabilityId: string;
  snapshotId: string;
  graphId: string;
  generationIndex: 1;
  samplePointId: string;
  contributionId: string;
  edgeId: string;
  edgeFamily: FanoGenerationResponseEdgeFamily;
  baselineInclusionStatus: 'excluded-from-generation-baseline-field';
  responseProbeStatus: 'available-response-probe-not-baseline';
}

export interface FanoStructuralBirthSupportAvailabilityRow {
  structuralBirthAvailabilityId: string;
  snapshotId: string;
  graphId: string;
  generationIndex: 1;
  samplePointId: string;
  supportSampleId: string;
  edgeId: string;
  baselineInclusionStatus: 'structural-birth-support-not-field-emission';
  structuralSupportStatus: 'birth-support-available-without-free-emission';
}

export interface FanoBaselineFieldAggregateRow {
  aggregateId: string;
  snapshotId: string;
  graphId: string;
  generationIndex: FanoGenerationIndex;
  samplePointId: string;
  includedContributionCount: number;
  activeSourceCount: number;
  realSum: number;
  imagSum: number;
  magnitude: number;
  phaseRadians: number;
  aggregateStatus: 'generation-baseline-free-field-aggregate';
  responseProbeExclusionStatus: 'response-probes-excluded-from-baseline-aggregate';
  carrierProjectionStatus: 'carrier-retained-upstream-on-contribution-rows';
}

export interface FanoBaselineFieldDeltaRow {
  deltaId: string;
  transitionId: string;
  graphId: string;
  samplePointId: string;
  fromAggregateId: string;
  toAggregateId: string;
  realDelta: number;
  imagDelta: number;
  magnitudeDelta: number;
  bornSourceContributionRealSum: number;
  bornSourceContributionImagSum: number;
  deltaConsistencyStatus: 'generation-delta-equals-born-source-contribution-sum';
}

export interface FanoGenerationRecompositionSummaryRow {
  recompositionId: string;
  graphId: string;
  profileSetId: string;
  g0ActiveSourceCount: 4;
  g1ActiveSourceCount: 10;
  bornSourceCount: 6;
  g0AggregateCount: 11;
  g1AggregateCount: 11;
  deltaAggregateCount: 11;
  recompositionStatus: 'g1-baseline-field-recomposed-from-g0-plus-born-child-contributions';
  noG2CarrierStatus: 'no-second-generation-carriers-invented';
}

export interface FanoOctonionicGenerationalFieldUpdateV0Summary {
  method: 'fano-octonionic-generational-field-update-v0';
  graphSetCount: number;
  generationSnapshotRowCount: number;
  generationTransitionRowCount: number;
  activeSourceMembershipRowCount: number;
  persistentSourceMembershipRowCount: number;
  bornSourceMembershipRowCount: number;
  edgeAvailabilityRowCount: number;
  baselineContributionSelectionRowCount: number;
  responseProbeContributionAvailabilityRowCount: number;
  structuralBirthSupportAvailabilityRowCount: number;
  baselineFieldAggregateRowCount: number;
  baselineFieldDeltaRowCount: number;
  recompositionSummaryRowCount: number;
  g0TotalActiveSourceCount: number;
  g1TotalActiveSourceCount: number;
  totalBornSourceCount: number;
  totalNewEdgeCount: number;
  sourcePopulationUpdateStatus: 'active-sources-g1-equals-g0-plus-born-sources';
  carrierGraphUpdateStatus: 'first-birth-carrier-graph-added-without-g2-carrier-invention';
  spatialProjectionUpdateStatus: 'f2-spatial-support-reused-for-generation-snapshots';
  fieldRecompositionStatus: 'g1-baseline-field-recomposed-from-g0-plus-born-child-contributions';
  baselineDeltaConsistencyStatus: 'generation-delta-equals-born-source-contribution-sum';
  responseProbeStatus: 'response-probes-available-excluded-from-baseline';
  structuralBirthStatus: 'birth-edges-structural-support-not-field-emission';
  noG2CarrierStatus: 'no-second-generation-carriers-invented';
  uiStatus: 'no-ui';
  semanticLabelStatus: 'not-attached-placeholders-only';
  trisonSemanticStatus: 'not-computed-in-g0';
  recommendedNextGate: 'S0 - Fano-Trison Semantic Residual Model Card';
}

export interface FanoOctonionicGenerationalFieldUpdateV0Issue {
  code: string;
  message: string;
}

export interface FanoOctonionicGenerationalFieldUpdateV0Report {
  method: 'fano-octonionic-generational-field-update-v0';
  f1DependencyStatus: 'derived-from-f1-carrier-graph-field';
  f2DependencyStatus: 'derived-from-f2-spatial-support-projection';
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  generationTransitionRows: FanoGenerationTransitionRow[];
  activeSourceMembershipRows: FanoActiveSourceMembershipRow[];
  edgeAvailabilityRows: FanoGenerationEdgeAvailabilityRow[];
  baselineContributionSelectionRows: FanoBaselineContributionSelectionRow[];
  responseProbeContributionAvailabilityRows: FanoResponseProbeContributionAvailabilityRow[];
  structuralBirthSupportAvailabilityRows: FanoStructuralBirthSupportAvailabilityRow[];
  baselineFieldAggregateRows: FanoBaselineFieldAggregateRow[];
  baselineFieldDeltaRows: FanoBaselineFieldDeltaRow[];
  recompositionSummaryRows: FanoGenerationRecompositionSummaryRow[];
  summary: FanoOctonionicGenerationalFieldUpdateV0Summary;
  issues: FanoOctonionicGenerationalFieldUpdateV0Issue[];
  ok: boolean;
}

const DELTA_TOLERANCE = 1e-9;

export function buildFanoOctonionicGenerationalFieldUpdateV0Report(): FanoOctonionicGenerationalFieldUpdateV0Report {
  const f1Report = buildFanoOctonionicCarrierGraphFieldV0Report();
  const f2Report = buildFanoOctonionicSpatialSupportProjectionV0Report();
  const generationSnapshotRows = buildGenerationSnapshotRows({
    graphSetRows: f1Report.graphSetRows,
    nodeRows: f1Report.nodeRows,
    edgeRows: f1Report.edgeRows,
    samplePointRows: f2Report.samplePointRows,
    fieldContributionRows: f2Report.fieldContributionSampleRows,
    supportSampleRows: f2Report.supportSampleRows,
  });
  const generationTransitionRows = buildGenerationTransitionRows(
    f1Report.graphSetRows,
  );
  const activeSourceMembershipRows = buildActiveSourceMembershipRows({
    generationSnapshotRows,
    nodeRows: f1Report.nodeRows,
  });
  const edgeAvailabilityRows = buildEdgeAvailabilityRows({
    generationSnapshotRows,
    edgeRows: f1Report.edgeRows,
  });
  const baselineContributionSelectionRows =
    buildBaselineContributionSelectionRows({
      generationSnapshotRows,
      nodeRows: f1Report.nodeRows,
      fieldContributionRows: f2Report.fieldContributionSampleRows,
    });
  const responseProbeContributionAvailabilityRows =
    buildResponseProbeContributionAvailabilityRows({
      generationSnapshotRows,
      edgeRows: f1Report.edgeRows,
      fieldContributionRows: f2Report.fieldContributionSampleRows,
    });
  const structuralBirthSupportAvailabilityRows =
    buildStructuralBirthSupportAvailabilityRows({
      generationSnapshotRows,
      edgeRows: f1Report.edgeRows,
      supportSampleRows: f2Report.supportSampleRows,
    });
  const baselineFieldAggregateRows = buildBaselineFieldAggregateRows({
    generationSnapshotRows,
    baselineContributionSelectionRows,
    fieldContributionRows: f2Report.fieldContributionSampleRows,
    samplePointRows: f2Report.samplePointRows,
  });
  const baselineFieldDeltaRows = buildBaselineFieldDeltaRows({
    generationTransitionRows,
    baselineFieldAggregateRows,
    baselineContributionSelectionRows,
    fieldContributionRows: f2Report.fieldContributionSampleRows,
    samplePointRows: f2Report.samplePointRows,
  });
  const recompositionSummaryRows = buildRecompositionSummaryRows({
    graphSetRows: f1Report.graphSetRows,
    baselineFieldAggregateRows,
    baselineFieldDeltaRows,
  });
  const summary = buildSummary({
    graphSetRows: f1Report.graphSetRows,
    generationSnapshotRows,
    generationTransitionRows,
    activeSourceMembershipRows,
    edgeAvailabilityRows,
    baselineContributionSelectionRows,
    responseProbeContributionAvailabilityRows,
    structuralBirthSupportAvailabilityRows,
    baselineFieldAggregateRows,
    baselineFieldDeltaRows,
    recompositionSummaryRows,
  });
  const issues = buildIssues({
    f1Ok: f1Report.ok,
    f2Ok: f2Report.ok,
    generationSnapshotRows,
    generationTransitionRows,
    activeSourceMembershipRows,
    edgeAvailabilityRows,
    baselineContributionSelectionRows,
    responseProbeContributionAvailabilityRows,
    structuralBirthSupportAvailabilityRows,
    baselineFieldAggregateRows,
    baselineFieldDeltaRows,
    recompositionSummaryRows,
    fieldContributionRows: f2Report.fieldContributionSampleRows,
    edgeRows: f1Report.edgeRows,
    summary,
  });

  return {
    method: 'fano-octonionic-generational-field-update-v0',
    f1DependencyStatus: 'derived-from-f1-carrier-graph-field',
    f2DependencyStatus: 'derived-from-f2-spatial-support-projection',
    generationSnapshotRows,
    generationTransitionRows,
    activeSourceMembershipRows,
    edgeAvailabilityRows,
    baselineContributionSelectionRows,
    responseProbeContributionAvailabilityRows,
    structuralBirthSupportAvailabilityRows,
    baselineFieldAggregateRows,
    baselineFieldDeltaRows,
    recompositionSummaryRows,
    summary,
    issues,
    ok: issues.length === 0,
  };
}

function buildGenerationSnapshotRows(args: {
  graphSetRows: FanoCarrierGraphSetRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  samplePointRows: FanoSpatialSamplePointRow[];
  fieldContributionRows: FanoFieldContributionSampleRow[];
  supportSampleRows: FanoSpatialSupportSampleRow[];
}): FanoGenerationSnapshotRow[] {
  return args.graphSetRows.flatMap((graphSetRow) => {
    const graphNodeRows = args.nodeRows.filter(
      (row) => row.graphId === graphSetRow.graphId,
    );
    const graphEdgeRows = args.edgeRows.filter(
      (row) => row.graphId === graphSetRow.graphId,
    );
    const samplePointCount = args.samplePointRows.filter(
      (row) => row.graphId === graphSetRow.graphId,
    ).length;
    const g0BaselineCount = countBaselineContributions({
      graphId: graphSetRow.graphId,
      activeNodeIds: graphNodeRows
        .filter((row) => row.nodeRole === 'primal-source-node')
        .map((row) => row.nodeId),
      fieldContributionRows: args.fieldContributionRows,
    });
    const g1BaselineCount = countBaselineContributions({
      graphId: graphSetRow.graphId,
      activeNodeIds: graphNodeRows.map((row) => row.nodeId),
      fieldContributionRows: args.fieldContributionRows,
    });
    const responseProbeContributionAvailabilityCount =
      args.fieldContributionRows.filter(
        (row) =>
          row.graphId === graphSetRow.graphId &&
          row.contributionFamily === 'unit-response-probe-edge',
      ).length;
    const structuralBirthSupportAvailabilityCount = args.supportSampleRows.filter(
      (row) =>
        row.graphId === graphSetRow.graphId &&
        row.ownerKind === 'edge' &&
        graphEdgeRows.some(
          (edgeRow) =>
            edgeRow.edgeId === row.ownerId && edgeRow.edgeFamily === 'birth-edge',
        ),
    ).length;

    return [
      {
        snapshotId: snapshotId(graphSetRow.graphId, 0),
        graphId: graphSetRow.graphId,
        profileSetId: graphSetRow.profileSetId,
        generationIndex: 0,
        generationLabel: 'generation-0-primal-only',
        activeSourceCount: 4,
        activePrimalSourceCount: 4,
        activeChildSourceCount: 0,
        activeGraphEdgeCount: 0,
        baselineContributionCount: g0BaselineCount,
        responseProbeContributionAvailabilityCount: 0,
        structuralBirthSupportAvailabilityCount: 0,
        samplePointCount,
        sourcePopulationStatus: 'primal-root-sources-only',
        fieldRecomputationStatus:
          'baseline-field-recomputed-from-generation-active-sources',
      },
      {
        snapshotId: snapshotId(graphSetRow.graphId, 1),
        graphId: graphSetRow.graphId,
        profileSetId: graphSetRow.profileSetId,
        generationIndex: 1,
        generationLabel: 'generation-1-primal-plus-born-children',
        activeSourceCount: 10,
        activePrimalSourceCount: 4,
        activeChildSourceCount: 6,
        activeGraphEdgeCount: graphEdgeRows.length,
        baselineContributionCount: g1BaselineCount,
        responseProbeContributionAvailabilityCount,
        structuralBirthSupportAvailabilityCount,
        samplePointCount,
        sourcePopulationStatus: 'primal-root-sources-plus-born-children',
        fieldRecomputationStatus:
          'baseline-field-recomputed-from-generation-active-sources',
      },
    ];
  });
}

function buildGenerationTransitionRows(
  graphSetRows: FanoCarrierGraphSetRow[],
): FanoGenerationTransitionRow[] {
  return graphSetRows.map((graphSetRow) => ({
    transitionId: `${graphSetRow.graphId}:transition:g0-to-g1`,
    graphId: graphSetRow.graphId,
    profileSetId: graphSetRow.profileSetId,
    fromGenerationIndex: 0,
    toGenerationIndex: 1,
    persistentSourceCount: 4,
    bornSourceCount: 6,
    retiredSourceCount: 0,
    newEdgeCount: 36,
    activeSourceUpdateLaw: 'active-sources-g1-equals-g0-plus-born-sources',
    carrierGraphUpdateStatus:
      'first-birth-carrier-graph-added-without-g2-carrier-invention',
    spatialProjectionUpdateStatus:
      'f2-spatial-support-reused-for-generation-snapshots',
    fieldUpdateStatus:
      'baseline-field-recomputed-after-source-population-update',
  }));
}

function buildActiveSourceMembershipRows(args: {
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
}): FanoActiveSourceMembershipRow[] {
  return args.generationSnapshotRows.flatMap((snapshotRow) => {
    const graphNodeRows = args.nodeRows.filter(
      (row) => row.graphId === snapshotRow.graphId,
    );
    const activeNodeRows =
      snapshotRow.generationIndex === 0
        ? graphNodeRows.filter((row) => row.nodeRole === 'primal-source-node')
        : graphNodeRows;

    return activeNodeRows.map((nodeRow) => {
      const sourceMembershipStatus =
        nodeRow.nodeRole === 'primal-source-node'
          ? 'persistent-primal-source'
          : 'born-child-source';

      return {
        membershipId: `${snapshotRow.snapshotId}:member:${nodeSourceToken(nodeRow)}`,
        snapshotId: snapshotRow.snapshotId,
        graphId: snapshotRow.graphId,
        generationIndex: snapshotRow.generationIndex,
        nodeId: nodeRow.nodeId,
        sourceToken: nodeSourceToken(nodeRow),
        nodeRole: nodeRow.nodeRole,
        sourceMembershipStatus,
        activationStatus: 'active-in-generation-snapshot',
      };
    });
  });
}

function buildEdgeAvailabilityRows(args: {
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
}): FanoGenerationEdgeAvailabilityRow[] {
  return args.generationSnapshotRows
    .filter((snapshotRow) => snapshotRow.generationIndex === 1)
    .flatMap((snapshotRow) =>
      args.edgeRows
        .filter((edgeRow) => edgeRow.graphId === snapshotRow.graphId)
        .map((edgeRow) => ({
          edgeAvailabilityId: `${snapshotRow.snapshotId}:edge:${edgeRow.edgeId}`,
          snapshotId: snapshotRow.snapshotId,
          graphId: snapshotRow.graphId,
          generationIndex: 1 as const,
          edgeId: edgeRow.edgeId,
          edgeFamily: edgeRow.edgeFamily,
          activationStatus: edgeRow.activationStatus,
          baselineInclusionStatus:
            edgeRow.edgeFamily === 'birth-edge'
              ? 'structural-birth-edge-not-field-emission'
              : 'available-response-excluded-from-baseline',
          edgeAvailabilityStatus: 'available-in-generation-1-carrier-graph',
        })),
    );
}

function buildBaselineContributionSelectionRows(args: {
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  nodeRows: FanoCarrierGraphNodeRow[];
  fieldContributionRows: FanoFieldContributionSampleRow[];
}): FanoBaselineContributionSelectionRow[] {
  return args.generationSnapshotRows.flatMap((snapshotRow) => {
    const activeNodeRows =
      snapshotRow.generationIndex === 0
        ? args.nodeRows.filter(
            (row) =>
              row.graphId === snapshotRow.graphId &&
              row.nodeRole === 'primal-source-node',
          )
        : args.nodeRows.filter((row) => row.graphId === snapshotRow.graphId);
    const activeNodeIds = new Set(activeNodeRows.map((row) => row.nodeId));

    return args.fieldContributionRows
      .filter(
        (row) =>
          row.graphId === snapshotRow.graphId &&
          row.ownerKind === 'node' &&
          row.contributionFamily === 'baseline-intrinsic-node' &&
          activeNodeIds.has(row.ownerId),
      )
      .map((contributionRow) => {
        const nodeRow = getNode(args.nodeRows, contributionRow.ownerId);

        return {
          selectionId: `${snapshotRow.snapshotId}:baseline:${contributionRow.contributionId}`,
          snapshotId: snapshotRow.snapshotId,
          graphId: snapshotRow.graphId,
          generationIndex: snapshotRow.generationIndex,
          samplePointId: contributionRow.samplePointId,
          contributionId: contributionRow.contributionId,
          ownerId: contributionRow.ownerId,
          ownerKind: 'node',
          sourceMembershipStatus:
            nodeRow.nodeRole === 'primal-source-node'
              ? 'persistent-primal-source'
              : 'born-child-source',
          baselineSelectionStatus: 'included-in-generation-baseline-field',
        };
      });
  });
}

function buildResponseProbeContributionAvailabilityRows(args: {
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  fieldContributionRows: FanoFieldContributionSampleRow[];
}): FanoResponseProbeContributionAvailabilityRow[] {
  return args.generationSnapshotRows
    .filter((snapshotRow) => snapshotRow.generationIndex === 1)
    .flatMap((snapshotRow) =>
      args.fieldContributionRows
        .filter(
          (row) =>
            row.graphId === snapshotRow.graphId &&
            row.ownerKind === 'edge' &&
            row.contributionFamily === 'unit-response-probe-edge',
        )
        .map((contributionRow) => {
          const edgeRow = getEdge(args.edgeRows, contributionRow.ownerId);

          if (edgeRow.edgeFamily === 'birth-edge') {
            throw new Error(
              `Birth edge cannot be a response probe ${edgeRow.edgeId}`,
            );
          }

          return {
            responseProbeAvailabilityId: `${snapshotRow.snapshotId}:response-probe:${contributionRow.contributionId}`,
            snapshotId: snapshotRow.snapshotId,
            graphId: snapshotRow.graphId,
            generationIndex: 1 as const,
            samplePointId: contributionRow.samplePointId,
            contributionId: contributionRow.contributionId,
            edgeId: edgeRow.edgeId,
            edgeFamily: edgeRow.edgeFamily,
            baselineInclusionStatus:
              'excluded-from-generation-baseline-field',
            responseProbeStatus: 'available-response-probe-not-baseline',
          };
        }),
    );
}

function buildStructuralBirthSupportAvailabilityRows(args: {
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  supportSampleRows: FanoSpatialSupportSampleRow[];
}): FanoStructuralBirthSupportAvailabilityRow[] {
  return args.generationSnapshotRows
    .filter((snapshotRow) => snapshotRow.generationIndex === 1)
    .flatMap((snapshotRow) =>
      args.supportSampleRows
        .filter((supportSampleRow) => {
          if (
            supportSampleRow.graphId !== snapshotRow.graphId ||
            supportSampleRow.ownerKind !== 'edge'
          ) {
            return false;
          }

          return (
            getEdge(args.edgeRows, supportSampleRow.ownerId).edgeFamily ===
            'birth-edge'
          );
        })
        .map((supportSampleRow) => ({
          structuralBirthAvailabilityId: `${snapshotRow.snapshotId}:birth-support:${supportSampleRow.supportSampleId}`,
          snapshotId: snapshotRow.snapshotId,
          graphId: snapshotRow.graphId,
          generationIndex: 1 as const,
          samplePointId: supportSampleRow.samplePointId,
          supportSampleId: supportSampleRow.supportSampleId,
          edgeId: supportSampleRow.ownerId,
          baselineInclusionStatus: 'structural-birth-support-not-field-emission',
          structuralSupportStatus: 'birth-support-available-without-free-emission',
        })),
    );
}

function buildBaselineFieldAggregateRows(args: {
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  baselineContributionSelectionRows: FanoBaselineContributionSelectionRow[];
  fieldContributionRows: FanoFieldContributionSampleRow[];
  samplePointRows: FanoSpatialSamplePointRow[];
}): FanoBaselineFieldAggregateRow[] {
  return args.generationSnapshotRows.flatMap((snapshotRow) =>
    args.samplePointRows
      .filter((samplePointRow) => samplePointRow.graphId === snapshotRow.graphId)
      .map((samplePointRow) => {
        const selectedContributionRows =
          args.baselineContributionSelectionRows
            .filter(
              (selectionRow) =>
                selectionRow.snapshotId === snapshotRow.snapshotId &&
                selectionRow.samplePointId === samplePointRow.samplePointId,
            )
            .map((selectionRow) =>
              getContribution(
                args.fieldContributionRows,
                selectionRow.contributionId,
              ),
            );
        const realSum = selectedContributionRows.reduce(
          (sum, contributionRow) => sum + contributionRow.realCoefficient,
          0,
        );
        const imagSum = selectedContributionRows.reduce(
          (sum, contributionRow) => sum + contributionRow.imagCoefficient,
          0,
        );

        return {
          aggregateId: `${snapshotRow.snapshotId}:aggregate:${lastIdSegment(samplePointRow.samplePointId)}`,
          snapshotId: snapshotRow.snapshotId,
          graphId: snapshotRow.graphId,
          generationIndex: snapshotRow.generationIndex,
          samplePointId: samplePointRow.samplePointId,
          includedContributionCount: selectedContributionRows.length,
          activeSourceCount: snapshotRow.activeSourceCount,
          realSum,
          imagSum,
          magnitude: magnitude(realSum, imagSum),
          phaseRadians: Math.atan2(imagSum, realSum),
          aggregateStatus: 'generation-baseline-free-field-aggregate',
          responseProbeExclusionStatus:
            'response-probes-excluded-from-baseline-aggregate',
          carrierProjectionStatus:
            'carrier-retained-upstream-on-contribution-rows',
        };
      }),
  );
}

function buildBaselineFieldDeltaRows(args: {
  generationTransitionRows: FanoGenerationTransitionRow[];
  baselineFieldAggregateRows: FanoBaselineFieldAggregateRow[];
  baselineContributionSelectionRows: FanoBaselineContributionSelectionRow[];
  fieldContributionRows: FanoFieldContributionSampleRow[];
  samplePointRows: FanoSpatialSamplePointRow[];
}): FanoBaselineFieldDeltaRow[] {
  return args.generationTransitionRows.flatMap((transitionRow) =>
    args.samplePointRows
      .filter((samplePointRow) => samplePointRow.graphId === transitionRow.graphId)
      .map((samplePointRow) => {
        const fromAggregate = getAggregate({
          baselineFieldAggregateRows: args.baselineFieldAggregateRows,
          graphId: transitionRow.graphId,
          generationIndex: 0,
          samplePointId: samplePointRow.samplePointId,
        });
        const toAggregate = getAggregate({
          baselineFieldAggregateRows: args.baselineFieldAggregateRows,
          graphId: transitionRow.graphId,
          generationIndex: 1,
          samplePointId: samplePointRow.samplePointId,
        });
        const bornContributionRows = args.baselineContributionSelectionRows
          .filter(
            (selectionRow) =>
              selectionRow.graphId === transitionRow.graphId &&
              selectionRow.generationIndex === 1 &&
              selectionRow.samplePointId === samplePointRow.samplePointId &&
              selectionRow.sourceMembershipStatus === 'born-child-source',
          )
          .map((selectionRow) =>
            getContribution(args.fieldContributionRows, selectionRow.contributionId),
          );
        const realDelta = toAggregate.realSum - fromAggregate.realSum;
        const imagDelta = toAggregate.imagSum - fromAggregate.imagSum;
        const bornSourceContributionRealSum = bornContributionRows.reduce(
          (sum, contributionRow) => sum + contributionRow.realCoefficient,
          0,
        );
        const bornSourceContributionImagSum = bornContributionRows.reduce(
          (sum, contributionRow) => sum + contributionRow.imagCoefficient,
          0,
        );

        return {
          deltaId: `${transitionRow.transitionId}:delta:${lastIdSegment(samplePointRow.samplePointId)}`,
          transitionId: transitionRow.transitionId,
          graphId: transitionRow.graphId,
          samplePointId: samplePointRow.samplePointId,
          fromAggregateId: fromAggregate.aggregateId,
          toAggregateId: toAggregate.aggregateId,
          realDelta,
          imagDelta,
          magnitudeDelta: magnitude(realDelta, imagDelta),
          bornSourceContributionRealSum,
          bornSourceContributionImagSum,
          deltaConsistencyStatus:
            'generation-delta-equals-born-source-contribution-sum',
        };
      }),
  );
}

function buildRecompositionSummaryRows(args: {
  graphSetRows: FanoCarrierGraphSetRow[];
  baselineFieldAggregateRows: FanoBaselineFieldAggregateRow[];
  baselineFieldDeltaRows: FanoBaselineFieldDeltaRow[];
}): FanoGenerationRecompositionSummaryRow[] {
  return args.graphSetRows.map((graphSetRow) => ({
    recompositionId: `${graphSetRow.graphId}:recomposition:g0-g1`,
    graphId: graphSetRow.graphId,
    profileSetId: graphSetRow.profileSetId,
    g0ActiveSourceCount: 4,
    g1ActiveSourceCount: 10,
    bornSourceCount: 6,
    g0AggregateCount: args.baselineFieldAggregateRows.filter(
      (row) => row.graphId === graphSetRow.graphId && row.generationIndex === 0,
    ).length as 11,
    g1AggregateCount: args.baselineFieldAggregateRows.filter(
      (row) => row.graphId === graphSetRow.graphId && row.generationIndex === 1,
    ).length as 11,
    deltaAggregateCount: args.baselineFieldDeltaRows.filter(
      (row) => row.graphId === graphSetRow.graphId,
    ).length as 11,
    recompositionStatus:
      'g1-baseline-field-recomposed-from-g0-plus-born-child-contributions',
    noG2CarrierStatus: 'no-second-generation-carriers-invented',
  }));
}

function buildSummary(args: {
  graphSetRows: FanoCarrierGraphSetRow[];
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  generationTransitionRows: FanoGenerationTransitionRow[];
  activeSourceMembershipRows: FanoActiveSourceMembershipRow[];
  edgeAvailabilityRows: FanoGenerationEdgeAvailabilityRow[];
  baselineContributionSelectionRows: FanoBaselineContributionSelectionRow[];
  responseProbeContributionAvailabilityRows: FanoResponseProbeContributionAvailabilityRow[];
  structuralBirthSupportAvailabilityRows: FanoStructuralBirthSupportAvailabilityRow[];
  baselineFieldAggregateRows: FanoBaselineFieldAggregateRow[];
  baselineFieldDeltaRows: FanoBaselineFieldDeltaRow[];
  recompositionSummaryRows: FanoGenerationRecompositionSummaryRow[];
}): FanoOctonionicGenerationalFieldUpdateV0Summary {
  return {
    method: 'fano-octonionic-generational-field-update-v0',
    graphSetCount: args.graphSetRows.length,
    generationSnapshotRowCount: args.generationSnapshotRows.length,
    generationTransitionRowCount: args.generationTransitionRows.length,
    activeSourceMembershipRowCount: args.activeSourceMembershipRows.length,
    persistentSourceMembershipRowCount:
      args.activeSourceMembershipRows.filter(
        (row) =>
          row.generationIndex === 0 &&
          row.sourceMembershipStatus === 'persistent-primal-source',
      ).length,
    bornSourceMembershipRowCount: args.activeSourceMembershipRows.filter(
      (row) =>
        row.generationIndex === 1 &&
        row.sourceMembershipStatus === 'born-child-source',
    ).length,
    edgeAvailabilityRowCount: args.edgeAvailabilityRows.length,
    baselineContributionSelectionRowCount:
      args.baselineContributionSelectionRows.length,
    responseProbeContributionAvailabilityRowCount:
      args.responseProbeContributionAvailabilityRows.length,
    structuralBirthSupportAvailabilityRowCount:
      args.structuralBirthSupportAvailabilityRows.length,
    baselineFieldAggregateRowCount: args.baselineFieldAggregateRows.length,
    baselineFieldDeltaRowCount: args.baselineFieldDeltaRows.length,
    recompositionSummaryRowCount: args.recompositionSummaryRows.length,
    g0TotalActiveSourceCount: args.generationSnapshotRows
      .filter((row) => row.generationIndex === 0)
      .reduce((sum, row) => sum + row.activeSourceCount, 0),
    g1TotalActiveSourceCount: args.generationSnapshotRows
      .filter((row) => row.generationIndex === 1)
      .reduce((sum, row) => sum + row.activeSourceCount, 0),
    totalBornSourceCount: args.generationTransitionRows.reduce(
      (sum, row) => sum + row.bornSourceCount,
      0,
    ),
    totalNewEdgeCount: args.generationTransitionRows.reduce(
      (sum, row) => sum + row.newEdgeCount,
      0,
    ),
    sourcePopulationUpdateStatus:
      'active-sources-g1-equals-g0-plus-born-sources',
    carrierGraphUpdateStatus:
      'first-birth-carrier-graph-added-without-g2-carrier-invention',
    spatialProjectionUpdateStatus:
      'f2-spatial-support-reused-for-generation-snapshots',
    fieldRecompositionStatus:
      'g1-baseline-field-recomposed-from-g0-plus-born-child-contributions',
    baselineDeltaConsistencyStatus:
      'generation-delta-equals-born-source-contribution-sum',
    responseProbeStatus: 'response-probes-available-excluded-from-baseline',
    structuralBirthStatus:
      'birth-edges-structural-support-not-field-emission',
    noG2CarrierStatus: 'no-second-generation-carriers-invented',
    uiStatus: 'no-ui',
    semanticLabelStatus: 'not-attached-placeholders-only',
    trisonSemanticStatus: 'not-computed-in-g0',
    recommendedNextGate: 'S0 - Fano-Trison Semantic Residual Model Card',
  };
}

function buildIssues(args: {
  f1Ok: boolean;
  f2Ok: boolean;
  generationSnapshotRows: FanoGenerationSnapshotRow[];
  generationTransitionRows: FanoGenerationTransitionRow[];
  activeSourceMembershipRows: FanoActiveSourceMembershipRow[];
  edgeAvailabilityRows: FanoGenerationEdgeAvailabilityRow[];
  baselineContributionSelectionRows: FanoBaselineContributionSelectionRow[];
  responseProbeContributionAvailabilityRows: FanoResponseProbeContributionAvailabilityRow[];
  structuralBirthSupportAvailabilityRows: FanoStructuralBirthSupportAvailabilityRow[];
  baselineFieldAggregateRows: FanoBaselineFieldAggregateRow[];
  baselineFieldDeltaRows: FanoBaselineFieldDeltaRow[];
  recompositionSummaryRows: FanoGenerationRecompositionSummaryRow[];
  fieldContributionRows: FanoFieldContributionSampleRow[];
  edgeRows: FanoCarrierGraphEdgeRow[];
  summary: FanoOctonionicGenerationalFieldUpdateV0Summary;
}): FanoOctonionicGenerationalFieldUpdateV0Issue[] {
  const issues: FanoOctonionicGenerationalFieldUpdateV0Issue[] = [];

  if (!args.f1Ok) {
    issues.push(issue('f1-report-not-ok', 'F1 carrier graph field report is not ok'));
  }

  if (!args.f2Ok) {
    issues.push(
      issue('f2-report-not-ok', 'F2 spatial support projection report is not ok'),
    );
  }

  expectCount(issues, args.summary.graphSetCount, 3, 'graph-set-count');
  expectCount(
    issues,
    args.summary.generationSnapshotRowCount,
    6,
    'generation-snapshot-row-count',
  );
  expectCount(
    issues,
    args.summary.generationTransitionRowCount,
    3,
    'generation-transition-row-count',
  );
  expectCount(
    issues,
    args.summary.activeSourceMembershipRowCount,
    42,
    'active-source-membership-row-count',
  );
  expectCount(
    issues,
    args.summary.persistentSourceMembershipRowCount,
    12,
    'persistent-source-membership-row-count',
  );
  expectCount(
    issues,
    args.summary.bornSourceMembershipRowCount,
    18,
    'born-source-membership-row-count',
  );
  expectCount(
    issues,
    args.summary.edgeAvailabilityRowCount,
    108,
    'edge-availability-row-count',
  );
  expectCount(
    issues,
    args.summary.baselineContributionSelectionRowCount,
    462,
    'baseline-contribution-selection-row-count',
  );
  expectCount(
    issues,
    args.summary.responseProbeContributionAvailabilityRowCount,
    990,
    'response-probe-contribution-availability-row-count',
  );
  expectCount(
    issues,
    args.summary.structuralBirthSupportAvailabilityRowCount,
    198,
    'structural-birth-support-availability-row-count',
  );
  expectCount(
    issues,
    args.summary.baselineFieldAggregateRowCount,
    66,
    'baseline-field-aggregate-row-count',
  );
  expectCount(
    issues,
    args.summary.baselineFieldDeltaRowCount,
    33,
    'baseline-field-delta-row-count',
  );
  expectCount(
    issues,
    args.summary.recompositionSummaryRowCount,
    3,
    'recomposition-summary-row-count',
  );

  for (const snapshotRow of args.generationSnapshotRows) {
    if (snapshotRow.generationIndex === 0) {
      if (snapshotRow.activeChildSourceCount !== 0) {
        issues.push(issue('g0-snapshot-has-child-sources', snapshotRow.snapshotId));
      }

      if (snapshotRow.activeGraphEdgeCount !== 0) {
        issues.push(issue('g0-snapshot-has-graph-edges', snapshotRow.snapshotId));
      }
    }

    if (snapshotRow.generationIndex === 1) {
      if (snapshotRow.activeChildSourceCount !== 6) {
        issues.push(
          issue('g1-snapshot-missing-born-child-sources', snapshotRow.snapshotId),
        );
      }

      if (snapshotRow.activeGraphEdgeCount !== 36) {
        issues.push(
          issue('g1-snapshot-missing-first-birth-edges', snapshotRow.snapshotId),
        );
      }
    }
  }

  for (const selectionRow of args.baselineContributionSelectionRows) {
    if (selectionRow.ownerKind !== 'node') {
      issues.push(issue('edge-contribution-in-baseline-selection', selectionRow.selectionId));
    }

    if (
      selectionRow.generationIndex === 0 &&
      selectionRow.sourceMembershipStatus === 'born-child-source'
    ) {
      issues.push(issue('g0-baseline-includes-child-contribution', selectionRow.selectionId));
    }
  }

  const baselineContributionIds = new Set(
    args.baselineContributionSelectionRows.map((row) => row.contributionId),
  );

  for (const row of args.responseProbeContributionAvailabilityRows) {
    if (baselineContributionIds.has(row.contributionId)) {
      issues.push(issue('response-probe-included-in-baseline', row.responseProbeAvailabilityId));
    }
  }

  const birthEdgeIds = new Set(
    args.edgeRows
      .filter((row) => row.edgeFamily === 'birth-edge')
      .map((row) => row.edgeId),
  );

  for (const contributionRow of args.fieldContributionRows) {
    if (
      contributionRow.ownerKind === 'edge' &&
      birthEdgeIds.has(contributionRow.ownerId)
    ) {
      issues.push(issue('birth-edge-has-field-contribution', contributionRow.contributionId));
    }
  }

  for (const deltaRow of args.baselineFieldDeltaRows) {
    if (
      Math.abs(deltaRow.realDelta - deltaRow.bornSourceContributionRealSum) >
        DELTA_TOLERANCE ||
      Math.abs(deltaRow.imagDelta - deltaRow.bornSourceContributionImagSum) >
        DELTA_TOLERANCE
    ) {
      issues.push(issue('baseline-delta-mismatch', deltaRow.deltaId));
    }
  }

  for (const membershipRow of args.activeSourceMembershipRows) {
    if (
      membershipRow.sourceToken.includes('G2') ||
      membershipRow.sourceToken.includes('generation-2')
    ) {
      issues.push(issue('unexpected-later-generation-source-token', membershipRow.membershipId));
    }
  }

  if (args.summary.noG2CarrierStatus !== 'no-second-generation-carriers-invented') {
    issues.push(issue('later-generation-carrier-invented', args.summary.noG2CarrierStatus));
  }

  if (args.summary.semanticLabelStatus !== 'not-attached-placeholders-only') {
    issues.push(issue('semantic-label-attached', args.summary.semanticLabelStatus));
  }

  if (args.summary.trisonSemanticStatus !== 'not-computed-in-g0') {
    issues.push(issue('trison-semantic-computed', args.summary.trisonSemanticStatus));
  }

  if (args.summary.uiStatus !== 'no-ui') {
    issues.push(issue('ui-attached', args.summary.uiStatus));
  }

  return issues;
}

function countBaselineContributions(args: {
  graphId: string;
  activeNodeIds: string[];
  fieldContributionRows: FanoFieldContributionSampleRow[];
}): number {
  const activeNodeIds = new Set(args.activeNodeIds);

  return args.fieldContributionRows.filter(
    (row) =>
      row.graphId === args.graphId &&
      row.ownerKind === 'node' &&
      row.contributionFamily === 'baseline-intrinsic-node' &&
      activeNodeIds.has(row.ownerId),
  ).length;
}

function nodeSourceToken(nodeRow: FanoCarrierGraphNodeRow): string {
  return nodeRow.nodeRole === 'primal-source-node'
    ? nodeRow.sourceSlotId
    : nodeRow.childTokenId;
}

function getNode(
  nodeRows: FanoCarrierGraphNodeRow[],
  nodeId: string,
): FanoCarrierGraphNodeRow {
  const nodeRow = nodeRows.find((row) => row.nodeId === nodeId);

  if (!nodeRow) {
    throw new Error(`No node row found for ${nodeId}`);
  }

  return nodeRow;
}

function getEdge(
  edgeRows: FanoCarrierGraphEdgeRow[],
  edgeId: string,
): FanoCarrierGraphEdgeRow {
  const edgeRow = edgeRows.find((row) => row.edgeId === edgeId);

  if (!edgeRow) {
    throw new Error(`No edge row found for ${edgeId}`);
  }

  return edgeRow;
}

function getContribution(
  fieldContributionRows: FanoFieldContributionSampleRow[],
  contributionId: string,
): FanoFieldContributionSampleRow {
  const contributionRow = fieldContributionRows.find(
    (row) => row.contributionId === contributionId,
  );

  if (!contributionRow) {
    throw new Error(`No field contribution row found for ${contributionId}`);
  }

  return contributionRow;
}

function getAggregate(args: {
  baselineFieldAggregateRows: FanoBaselineFieldAggregateRow[];
  graphId: string;
  generationIndex: FanoGenerationIndex;
  samplePointId: string;
}): FanoBaselineFieldAggregateRow {
  const aggregateRow = args.baselineFieldAggregateRows.find(
    (row) =>
      row.graphId === args.graphId &&
      row.generationIndex === args.generationIndex &&
      row.samplePointId === args.samplePointId,
  );

  if (!aggregateRow) {
    throw new Error(
      `No aggregate found for ${args.graphId}:g${args.generationIndex}:${args.samplePointId}`,
    );
  }

  return aggregateRow;
}

function snapshotId(graphId: string, generationIndex: FanoGenerationIndex): string {
  return `${graphId}:snapshot:g${generationIndex}`;
}

function lastIdSegment(value: string): string {
  const segments = value.split(':');

  return segments[segments.length - 1] ?? value;
}

function magnitude(real: number, imag: number): number {
  return Math.sqrt(real * real + imag * imag);
}

function expectCount(
  issues: FanoOctonionicGenerationalFieldUpdateV0Issue[],
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
): FanoOctonionicGenerationalFieldUpdateV0Issue {
  return { code, message };
}
