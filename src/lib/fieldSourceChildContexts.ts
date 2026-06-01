export type TetrahedralChildRole = 'shared-90-pole';
export type TetrahedralChildGrammarTarget =
  'tetrahedral-edge-complement-quark-inheritance-v0';
export type TetrahedralChildMergeTarget = 'four-channel-merge';

export interface TetrahedralAmboChildContext {
  childKey: string;
  childVertexId: string;
  childRole: TetrahedralChildRole;
  sourceEdgeId: string;
  sourceEdgeVertexIds: [string, string];
  complementEdgeId: string;
  complementEdgeVertexIds: [string, string];
  antipodalChildVertexId: string;
  projectionVertexIds: [string, string];
  grammarTargetId: TetrahedralChildGrammarTarget;
  mergeTarget: TetrahedralChildMergeTarget;
}

export type TetrahedralAmboChildContextDiagnosticIssueCode =
  | 'invalid-tetrahedron-vertex-count'
  | 'duplicate-tetrahedron-vertex-id'
  | 'invalid-child-context-count'
  | 'duplicate-child-context'
  | 'missing-complement-edge'
  | 'missing-antipodal-child'
  | 'source-edge-id-vertex-mismatch'
  | 'complement-edge-id-vertex-mismatch'
  | 'antipodal-child-not-complement-edge'
  | 'antipodal-source-edge-mismatch'
  | 'child-context-uses-non-primal-vertex'
  | 'source-edge-not-in-active-tetrahedron'
  | 'source-edge-set-mismatch'
  | 'non-canonical-complement-edge'
  | 'non-canonical-child-vertex-id'
  | 'non-bidirectional-antipodal-child'
  | 'projection-vertices-not-complement-edge'
  | 'source-edge-overlaps-complement-edge'
  | 'invalid-child-role'
  | 'invalid-grammar-target'
  | 'invalid-merge-target';

export interface TetrahedralAmboChildContextDiagnosticIssue {
  code: TetrahedralAmboChildContextDiagnosticIssueCode;
  message: string;
  childVertexId?: string;
  childKey?: string;
  sourceEdgeId?: string;
  complementEdgeId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface TetrahedralAmboAntipodalPair {
  pairId: string;
  childVertexIds: [string, string];
  sourceEdgeIds: [string, string];
}

export interface BuildTetrahedralAmboChildContextDiagnosticReportArgs {
  vertexIds?: string[];
  contexts?: TetrahedralAmboChildContext[];
}

export interface TetrahedralAmboChildContextDiagnosticReport {
  reportId: string;
  method: 'tetrahedral-ambo-child-context-diagnostic-v0';
  contextScope: 'field-source-child-context-diagnostic-only';
  shapeMutationStatus: 'not-shape-mutation';
  primalVertexIds: string[];
  uniquePrimalVertexCount: number;
  childContextCount: number;
  uniqueChildCount: number;
  sourceEdgeCount: number;
  complementPairCount: number;
  antipodalPairCount: number;
  invalidContextCount: number;
  issueCount: number;
  ok: boolean;
  childContexts: TetrahedralAmboChildContext[];
  antipodalPairs: TetrahedralAmboAntipodalPair[];
  issues: TetrahedralAmboChildContextDiagnosticIssue[];
}

const CHILD_ROLE: TetrahedralChildRole = 'shared-90-pole';
const GRAMMAR_TARGET_ID: TetrahedralChildGrammarTarget =
  'tetrahedral-edge-complement-quark-inheritance-v0';
const MERGE_TARGET: TetrahedralChildMergeTarget = 'four-channel-merge';
const EXPECTED_TETRAHEDRAL_CHILD_CONTEXT_COUNT = 6;

export function createTetrahedralVertexFixture(): [string, string, string, string] {
  return ['A', 'B', 'C', 'D'];
}

export function buildTetrahedralAmboChildContexts(
  vertexIds: string[],
): TetrahedralAmboChildContext[] {
  if (vertexIds.length !== 4 || uniquePreservingOrder(vertexIds).length !== 4) {
    throw new Error('Tetrahedral Ambo child contexts require four unique vertices.');
  }

  const [a, b, c, d] = vertexIds;
  const contextSpecs: Array<[[string, string], [string, string]]> = [
    [
      [a, b],
      [c, d],
    ],
    [
      [a, c],
      [b, d],
    ],
    [
      [a, d],
      [b, c],
    ],
    [
      [b, c],
      [a, d],
    ],
    [
      [b, d],
      [a, c],
    ],
    [
      [c, d],
      [a, b],
    ],
  ];

  return contextSpecs.map(([sourceEdgeVertexIds, complementEdgeVertexIds]) =>
    buildChildContext(sourceEdgeVertexIds, complementEdgeVertexIds),
  );
}

export function buildTetrahedralAmboChildContextDiagnosticReport(
  args: BuildTetrahedralAmboChildContextDiagnosticReportArgs = {},
): TetrahedralAmboChildContextDiagnosticReport {
  const vertexIds = args.vertexIds ? [...args.vertexIds] : createTetrahedralVertexFixture();
  const issues: TetrahedralAmboChildContextDiagnosticIssue[] = [];
  const invalidChildVertexIds = new Set<string>();
  const uniquePrimalVertexIds = uniquePreservingOrder(vertexIds);
  const activePrimalVertexIdSet = new Set(uniquePrimalVertexIds);
  const canonicalContexts =
    vertexIds.length === 4 && uniquePrimalVertexIds.length === 4
      ? buildTetrahedralAmboChildContexts(vertexIds)
      : [];
  const canonicalSourceEdgeIds = canonicalContexts.map((context) => context.sourceEdgeId);
  const canonicalSourceEdgeIdSet = new Set(canonicalSourceEdgeIds);
  const canonicalComplementEdgeIdBySourceEdgeId = new Map(
    canonicalContexts.map((context) => [context.sourceEdgeId, context.complementEdgeId]),
  );

  if (vertexIds.length !== 4) {
    issues.push({
      code: 'invalid-tetrahedron-vertex-count',
      message: `Tetrahedral child-context diagnostics require four vertices, got ${vertexIds.length}.`,
      details: {
        vertexCount: vertexIds.length,
      },
    });
  }

  for (const vertexId of collectDuplicateIds(vertexIds)) {
    issues.push({
      code: 'duplicate-tetrahedron-vertex-id',
      message: `Tetrahedral vertex id ${vertexId} appears more than once.`,
      details: {
        vertexId,
        occurrenceCount: vertexIds.filter((candidate) => candidate === vertexId).length,
      },
    });
  }

  const contexts = args.contexts
    ? args.contexts.map(cloneChildContext)
    : buildDefaultContextsIfPossible(vertexIds);

  if (contexts.length !== EXPECTED_TETRAHEDRAL_CHILD_CONTEXT_COUNT) {
    issues.push({
      code: 'invalid-child-context-count',
      message: `Tetrahedral Ambo child-context diagnostics require six contexts, got ${contexts.length}.`,
      details: {
        childContextCount: contexts.length,
      },
    });
  }

  const childContextByVertexId = new Map<string, TetrahedralAmboChildContext>();
  const sourceEdgeIdCounts = countBy(contexts.map((context) => context.sourceEdgeId));
  const duplicateChildVertexIds = collectDuplicateIds(
    contexts.map((context) => context.childVertexId),
  );
  const duplicateChildKeys = collectDuplicateIds(contexts.map((context) => context.childKey));

  for (const context of contexts) {
    if (!childContextByVertexId.has(context.childVertexId)) {
      childContextByVertexId.set(context.childVertexId, context);
    }
  }

  if (canonicalContexts.length === EXPECTED_TETRAHEDRAL_CHILD_CONTEXT_COUNT) {
    const sourceEdgeSetReport = compareSets(
      new Set(contexts.map((context) => context.sourceEdgeId)),
      canonicalSourceEdgeIdSet,
    );

    if (!sourceEdgeSetReport.matches) {
      issues.push({
        code: 'source-edge-set-mismatch',
        message: 'Child context source edge set does not match the active tetrahedron edge set.',
        details: {
          missingSourceEdgeIds: sourceEdgeSetReport.missing.join(',') || null,
          extraSourceEdgeIds: sourceEdgeSetReport.extra.join(',') || null,
        },
      });
    }
  }

  for (const childVertexId of duplicateChildVertexIds) {
    markInvalid(invalidChildVertexIds, childVertexId);
    issues.push({
      code: 'duplicate-child-context',
      message: `Child context ${childVertexId} appears more than once.`,
      childVertexId,
      details: {
        duplicateKind: 'childVertexId',
      },
    });
  }

  for (const childKey of duplicateChildKeys) {
    const context = contexts.find((candidate) => candidate.childKey === childKey);

    if (context) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
    }

    issues.push({
      code: 'duplicate-child-context',
      message: `Child context key ${childKey} appears more than once.`,
      childVertexId: context?.childVertexId,
      childKey,
      details: {
        duplicateKind: 'childKey',
      },
    });
  }

  for (const context of contexts) {
    const expectedSourceEdgeId = buildEdgeId(context.sourceEdgeVertexIds);
    const expectedComplementEdgeId = buildEdgeId(context.complementEdgeVertexIds);
    const expectedAntipodalChildVertexId = buildChildVertexId(context.complementEdgeId);
    const nonPrimalVertexIds = collectContextVertexIds(context).filter(
      (vertexId) => !activePrimalVertexIdSet.has(vertexId),
    );
    const canonicalComplementEdgeId = canonicalComplementEdgeIdBySourceEdgeId.get(
      context.sourceEdgeId,
    );

    if (nonPrimalVertexIds.length > 0) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'child-context-uses-non-primal-vertex',
        message: `Child ${context.childVertexId} references vertices outside the active tetrahedron.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          nonPrimalVertexIds: uniquePreservingOrder(nonPrimalVertexIds).join(','),
          activePrimalVertexIds: uniquePrimalVertexIds.join(','),
        },
      });
    }

    if (
      canonicalContexts.length === EXPECTED_TETRAHEDRAL_CHILD_CONTEXT_COUNT &&
      !canonicalSourceEdgeIdSet.has(context.sourceEdgeId)
    ) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'source-edge-not-in-active-tetrahedron',
        message: `Child ${context.childVertexId} source edge ${context.sourceEdgeId} is not in the active tetrahedron.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        details: {
          canonicalSourceEdgeIds: canonicalSourceEdgeIds.join(','),
        },
      });
    }

    if (canonicalComplementEdgeId && context.complementEdgeId !== canonicalComplementEdgeId) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'non-canonical-complement-edge',
        message: `Child ${context.childVertexId} complement edge is not canonical for its active tetrahedron source edge.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          expectedComplementEdgeId: canonicalComplementEdgeId,
        },
      });
    }

    if (
      canonicalSourceEdgeIdSet.has(context.sourceEdgeId) &&
      context.childVertexId !== buildChildVertexId(context.sourceEdgeId)
    ) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'non-canonical-child-vertex-id',
        message: `Child vertex id ${context.childVertexId} is not canonical for source edge ${context.sourceEdgeId}.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        details: {
          expectedChildVertexId: buildChildVertexId(context.sourceEdgeId),
        },
      });
    }

    if (
      canonicalComplementEdgeId &&
      context.antipodalChildVertexId !== buildChildVertexId(canonicalComplementEdgeId)
    ) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'non-canonical-child-vertex-id',
        message: `Child ${context.childVertexId} antipodal child id is not canonical for source edge ${context.sourceEdgeId}.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          expectedAntipodalChildVertexId: buildChildVertexId(canonicalComplementEdgeId),
          antipodalChildVertexId: context.antipodalChildVertexId || null,
        },
      });
    }

    if (context.sourceEdgeId !== expectedSourceEdgeId) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'source-edge-id-vertex-mismatch',
        message: `Child ${context.childVertexId} source edge id does not match its source edge vertices.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        details: {
          expectedSourceEdgeId,
          sourceEdgeVertexIds: context.sourceEdgeVertexIds.join(','),
        },
      });
    }

    if (context.complementEdgeId !== expectedComplementEdgeId) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'complement-edge-id-vertex-mismatch',
        message: `Child ${context.childVertexId} complement edge id does not match its complement edge vertices.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          expectedComplementEdgeId,
          complementEdgeVertexIds: context.complementEdgeVertexIds.join(','),
        },
      });
    }

    if (context.antipodalChildVertexId !== expectedAntipodalChildVertexId) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'antipodal-child-not-complement-edge',
        message: `Child ${context.childVertexId} antipodal child is not the child implied by its complement edge.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          expectedAntipodalChildVertexId,
          antipodalChildVertexId: context.antipodalChildVertexId || null,
        },
      });
    }

    const complementEdgeMissing =
      context.complementEdgeId.length === 0 ||
      !sourceEdgeIdCounts.has(context.complementEdgeId);

    if (complementEdgeMissing) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'missing-complement-edge',
        message: `Child ${context.childVertexId} references missing complement edge ${context.complementEdgeId || 'none'}.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId || undefined,
      });
    }

    const antipodalChild = childContextByVertexId.get(context.antipodalChildVertexId);

    if (!antipodalChild) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'missing-antipodal-child',
        message: `Child ${context.childVertexId} references missing antipodal child ${context.antipodalChildVertexId || 'none'}.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          antipodalChildVertexId: context.antipodalChildVertexId || null,
        },
      });
    } else {
      const antipodalSourceEdgeMatches =
        antipodalChild.sourceEdgeId === context.complementEdgeId &&
        sameUnorderedPair(
          antipodalChild.sourceEdgeVertexIds,
          context.complementEdgeVertexIds,
        );

      if (!antipodalSourceEdgeMatches) {
        markInvalid(invalidChildVertexIds, context.childVertexId);
        issues.push({
          code: 'antipodal-source-edge-mismatch',
          message: `Child ${context.childVertexId} antipodal child does not use the complement edge as its source edge.`,
          childVertexId: context.childVertexId,
          childKey: context.childKey,
          sourceEdgeId: context.sourceEdgeId,
          complementEdgeId: context.complementEdgeId,
          details: {
            antipodalChildVertexId: context.antipodalChildVertexId,
            antipodalSourceEdgeId: antipodalChild.sourceEdgeId,
            antipodalSourceEdgeVertexIds: antipodalChild.sourceEdgeVertexIds.join(','),
            complementEdgeVertexIds: context.complementEdgeVertexIds.join(','),
          },
        });
      }
    }

    if (antipodalChild && antipodalChild.antipodalChildVertexId !== context.childVertexId) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'non-bidirectional-antipodal-child',
        message: `Child ${context.childVertexId} antipodal relation is not bidirectional.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          antipodalChildVertexId: context.antipodalChildVertexId,
          antipodalPointsBackTo: antipodalChild.antipodalChildVertexId,
        },
      });
    }

    if (!sameUnorderedPair(context.projectionVertexIds, context.complementEdgeVertexIds)) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'projection-vertices-not-complement-edge',
        message: `Child ${context.childVertexId} projection vertices do not match the complement edge.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          projectionVertexIds: context.projectionVertexIds.join(','),
          complementEdgeVertexIds: context.complementEdgeVertexIds.join(','),
        },
      });
    }

    if (pairsOverlap(context.sourceEdgeVertexIds, context.complementEdgeVertexIds)) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'source-edge-overlaps-complement-edge',
        message: `Child ${context.childVertexId} source edge overlaps its complement edge.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          sourceEdgeVertexIds: context.sourceEdgeVertexIds.join(','),
          complementEdgeVertexIds: context.complementEdgeVertexIds.join(','),
        },
      });
    }

    if (
      antipodalChild &&
      !sameUnorderedPair(antipodalChild.complementEdgeVertexIds, context.sourceEdgeVertexIds)
    ) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'non-bidirectional-antipodal-child',
        message: `Child ${context.childVertexId} complement relation is not bidirectional.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        sourceEdgeId: context.sourceEdgeId,
        complementEdgeId: context.complementEdgeId,
        details: {
          antipodalChildVertexId: context.antipodalChildVertexId,
          antipodalComplementEdgeVertexIds: antipodalChild.complementEdgeVertexIds.join(','),
          sourceEdgeVertexIds: context.sourceEdgeVertexIds.join(','),
        },
      });
    }

    if (context.childRole !== CHILD_ROLE) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'invalid-child-role',
        message: `Child ${context.childVertexId} has invalid role ${context.childRole}.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        details: {
          expectedChildRole: CHILD_ROLE,
          actualChildRole: context.childRole,
        },
      });
    }

    if (context.grammarTargetId !== GRAMMAR_TARGET_ID) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'invalid-grammar-target',
        message: `Child ${context.childVertexId} has invalid grammar target ${context.grammarTargetId}.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        details: {
          expectedGrammarTargetId: GRAMMAR_TARGET_ID,
          actualGrammarTargetId: context.grammarTargetId,
        },
      });
    }

    if (context.mergeTarget !== MERGE_TARGET) {
      markInvalid(invalidChildVertexIds, context.childVertexId);
      issues.push({
        code: 'invalid-merge-target',
        message: `Child ${context.childVertexId} has invalid merge target ${context.mergeTarget}.`,
        childVertexId: context.childVertexId,
        childKey: context.childKey,
        details: {
          expectedMergeTarget: MERGE_TARGET,
          actualMergeTarget: context.mergeTarget,
        },
      });
    }
  }

  const sourceEdgeIds = contexts.map((context) => context.sourceEdgeId);
  const antipodalPairs = buildAntipodalPairs(contexts);
  const issueCount = issues.length;

  return {
    reportId: `tetrahedral-ambo-child-context-diagnostic-v0:${vertexIds.join('|') || 'empty'}`,
    method: 'tetrahedral-ambo-child-context-diagnostic-v0',
    contextScope: 'field-source-child-context-diagnostic-only',
    shapeMutationStatus: 'not-shape-mutation',
    primalVertexIds: vertexIds,
    uniquePrimalVertexCount: uniquePrimalVertexIds.length,
    childContextCount: contexts.length,
    uniqueChildCount: new Set(contexts.map((context) => context.childVertexId)).size,
    sourceEdgeCount: new Set(sourceEdgeIds).size,
    complementPairCount: buildComplementPairIds(contexts).length,
    antipodalPairCount: antipodalPairs.length,
    invalidContextCount: invalidChildVertexIds.size,
    issueCount,
    ok: issueCount === 0,
    childContexts: contexts,
    antipodalPairs,
    issues,
  };
}

function buildChildContext(
  sourceEdgeVertexIds: [string, string],
  complementEdgeVertexIds: [string, string],
): TetrahedralAmboChildContext {
  const sourceEdgeId = buildEdgeId(sourceEdgeVertexIds);
  const complementEdgeId = buildEdgeId(complementEdgeVertexIds);
  const childVertexId = buildChildVertexId(sourceEdgeId);

  return {
    childKey: childVertexId,
    childVertexId,
    childRole: CHILD_ROLE,
    sourceEdgeId,
    sourceEdgeVertexIds: copyPair(sourceEdgeVertexIds),
    complementEdgeId,
    complementEdgeVertexIds: copyPair(complementEdgeVertexIds),
    antipodalChildVertexId: buildChildVertexId(complementEdgeId),
    projectionVertexIds: copyPair(complementEdgeVertexIds),
    grammarTargetId: GRAMMAR_TARGET_ID,
    mergeTarget: MERGE_TARGET,
  };
}

function buildDefaultContextsIfPossible(vertexIds: string[]): TetrahedralAmboChildContext[] {
  if (vertexIds.length !== 4 || uniquePreservingOrder(vertexIds).length !== 4) {
    return [];
  }

  return buildTetrahedralAmboChildContexts(vertexIds);
}

function buildAntipodalPairs(
  contexts: TetrahedralAmboChildContext[],
): TetrahedralAmboAntipodalPair[] {
  const contextByChildVertexId = new Map(
    contexts.map((context) => [context.childVertexId, context]),
  );
  const pairIds = new Set<string>();
  const pairs: TetrahedralAmboAntipodalPair[] = [];

  for (const context of contexts) {
    const antipodalContext = contextByChildVertexId.get(context.antipodalChildVertexId);

    if (!antipodalContext) {
      continue;
    }

    const childVertexIds = sortPair([
      context.childVertexId,
      antipodalContext.childVertexId,
    ]);
    const sourceEdgeIds = sortPair([context.sourceEdgeId, antipodalContext.sourceEdgeId]);
    const pairId = childVertexIds.join('<->');

    if (pairIds.has(pairId)) {
      continue;
    }

    pairIds.add(pairId);
    pairs.push({
      pairId,
      childVertexIds,
      sourceEdgeIds,
    });
  }

  return pairs;
}

function buildComplementPairIds(contexts: TetrahedralAmboChildContext[]): string[] {
  return Array.from(
    new Set(
      contexts.map((context) =>
        sortPair([context.sourceEdgeId, context.complementEdgeId]).join('<->'),
      ),
    ),
  );
}

function collectContextVertexIds(context: TetrahedralAmboChildContext): string[] {
  return [
    ...context.sourceEdgeVertexIds,
    ...context.complementEdgeVertexIds,
    ...context.projectionVertexIds,
  ];
}

function buildEdgeId(vertexIds: [string, string]): string {
  return `${vertexIds[0]}${vertexIds[1]}`;
}

function buildChildVertexId(edgeId: string): string {
  return `M_${edgeId}`;
}

function cloneChildContext(
  context: TetrahedralAmboChildContext,
): TetrahedralAmboChildContext {
  return {
    ...context,
    sourceEdgeVertexIds: copyPair(context.sourceEdgeVertexIds),
    complementEdgeVertexIds: copyPair(context.complementEdgeVertexIds),
    projectionVertexIds: copyPair(context.projectionVertexIds),
  };
}

function copyPair(pair: [string, string]): [string, string] {
  return [pair[0], pair[1]];
}

function sameUnorderedPair(left: [string, string], right: [string, string]): boolean {
  const sortedLeft = sortPair(left);
  const sortedRight = sortPair(right);

  return sortedLeft[0] === sortedRight[0] && sortedLeft[1] === sortedRight[1];
}

function pairsOverlap(left: [string, string], right: [string, string]): boolean {
  return left.some((value) => right.includes(value));
}

function sortPair(pair: [string, string]): [string, string] {
  return pair[0] <= pair[1] ? [pair[0], pair[1]] : [pair[1], pair[0]];
}

function uniquePreservingOrder(values: string[]): string[] {
  const seen = new Set<string>();
  const uniqueValues: string[] = [];

  for (const value of values) {
    if (!seen.has(value)) {
      seen.add(value);
      uniqueValues.push(value);
    }
  }

  return uniqueValues;
}

function collectDuplicateIds(ids: string[]): string[] {
  const counts = countBy(ids);

  return Array.from(counts)
    .filter(([, count]) => count > 1)
    .map(([id]) => id);
}

function countBy(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

function compareSets(
  actual: Set<string>,
  expected: Set<string>,
): { matches: boolean; missing: string[]; extra: string[] } {
  const missing = Array.from(expected).filter((value) => !actual.has(value));
  const extra = Array.from(actual).filter((value) => !expected.has(value));

  return {
    matches: missing.length === 0 && extra.length === 0,
    missing,
    extra,
  };
}

function markInvalid(invalidChildVertexIds: Set<string>, childVertexId: string): void {
  if (childVertexId.length > 0) {
    invalidChildVertexIds.add(childVertexId);
  }
}
