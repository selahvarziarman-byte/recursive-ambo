import type { Shape, Vec3, Vertex, VertexId } from '../types/geometry';
import { buildProfileAwareRuntimeSupportPolicyReport } from './fieldSourceProfileAwareRuntimeSupportPolicy';

export type ProfileAwareShapePositionResolverIssueCode =
  | 'unsupported-shape-context'
  | 'missing-primal-label'
  | 'duplicate-primal-label'
  | 'non-finite-position'
  | 'missing-child-midpoint'
  | 'duplicate-child-midpoint';

export interface ProfileAwareShapePositionResolverIssue {
  code: ProfileAwareShapePositionResolverIssueCode;
  message: string;
  symbolId?: string;
  shapeVertexId?: string;
  details?: Record<string, boolean | number | string | null>;
}

export interface ProfileAwareShapePositionResolvedBinding {
  symbolId: string;
  shapeVertexId: string;
  sourceKind: 'primal-seed-label' | 'ambo-midpoint';
  position: Vec3;
  endpointSymbolIds?: [string, string];
  endpointShapeVertexIds?: [string, string];
}

export interface ProfileAwareSymbolicTetrahedronChildContext {
  childSymbolId: string;
  endpointSymbolIds: [string, string];
}

export interface ProfileAwareSymbolicTetrahedronContext {
  primalSymbolIds: [string, string, string, string];
  childContexts: ProfileAwareSymbolicTetrahedronChildContext[];
}

export interface ProfileAwareShapePositionResolverReport {
  reportId: string;
  method: 'profile-aware-shape-position-resolver-diagnostic-v0';
  diagnosticScope: 'tetrahedron-seed-one-ambo-dissection-position-resolution-only';
  shapeId: string;
  shapeContextStatus: 'supported' | 'unsupported';
  shapeSeedKey?: string;
  shapeOperation?: string;
  shapeGenerationDepth?: number;
  resolvedPrimalCount: number;
  resolvedChildCount: number;
  totalResolvedPositionCount: number;
  missingPrimalCount: number;
  missingChildCount: number;
  duplicatePrimalLabelCount: number;
  nonFinitePositionCount: number;
  shapeMutationStatus: 'not-shape-mutation';
  packetWriteStatus: 'not-packet-writing';
  issueCount: number;
  ok: boolean;
  issues: ProfileAwareShapePositionResolverIssue[];
  resolvedBindings: ProfileAwareShapePositionResolvedBinding[];
  positionByVertexId: Record<string, Vec3>;
}

const METHOD = 'profile-aware-shape-position-resolver-diagnostic-v0';
const DIAGNOSTIC_SCOPE =
  'tetrahedron-seed-one-ambo-dissection-position-resolution-only';

export const PROFILE_AWARE_TETRAHEDRON_SYMBOLIC_CONTEXT: ProfileAwareSymbolicTetrahedronContext =
  {
    primalSymbolIds: ['A', 'B', 'C', 'D'],
    childContexts: [
      { childSymbolId: 'M_AB', endpointSymbolIds: ['A', 'B'] },
      { childSymbolId: 'M_AC', endpointSymbolIds: ['A', 'C'] },
      { childSymbolId: 'M_AD', endpointSymbolIds: ['A', 'D'] },
      { childSymbolId: 'M_BC', endpointSymbolIds: ['B', 'C'] },
      { childSymbolId: 'M_BD', endpointSymbolIds: ['B', 'D'] },
      { childSymbolId: 'M_CD', endpointSymbolIds: ['C', 'D'] },
    ],
  };

export function buildProfileAwareShapePositionResolverReport(
  shape: Shape,
  context: ProfileAwareSymbolicTetrahedronContext =
    PROFILE_AWARE_TETRAHEDRON_SYMBOLIC_CONTEXT,
): ProfileAwareShapePositionResolverReport {
  const issues: ProfileAwareShapePositionResolverIssue[] = [];
  const resolvedBindings: ProfileAwareShapePositionResolvedBinding[] = [];
  const positionByVertexId: Record<string, Vec3> = {};
  const primalShapeVertexIdBySymbolId = new Map<string, VertexId>();
  const shapeContextStatus = appendShapeContextIssues(shape, issues);

  if (shapeContextStatus === 'unsupported') {
    return buildResolverReport({
      shape,
      shapeContextStatus,
      issues,
      resolvedBindings,
      positionByVertexId,
    });
  }

  for (const symbolId of context.primalSymbolIds) {
    const candidates = findPrimalSeedVerticesByLabel(shape, symbolId);

    if (candidates.length === 0) {
      issues.push({
        code: 'missing-primal-label',
        message: `Missing seed vertex with profile-aware label ${symbolId}.`,
        symbolId,
      });
      continue;
    }

    if (candidates.length > 1) {
      issues.push({
        code: 'duplicate-primal-label',
        message: `Profile-aware primal label ${symbolId} matched more than one seed vertex.`,
        symbolId,
        details: {
          matchCount: candidates.length,
        },
      });
      continue;
    }

    const vertex = candidates[0];

    if (!isFiniteVec3(vertex.position)) {
      issues.push({
        code: 'non-finite-position',
        message: `Resolved primal ${symbolId} has a non-finite Shape position.`,
        symbolId,
        shapeVertexId: vertex.id,
      });
      continue;
    }

    primalShapeVertexIdBySymbolId.set(symbolId, vertex.id);
    appendResolvedBinding({
      binding: {
        symbolId,
        shapeVertexId: vertex.id,
        sourceKind: 'primal-seed-label',
        position: copyVec3(vertex.position),
      },
      positionByVertexId,
      resolvedBindings,
    });
  }

  for (const childContext of context.childContexts) {
    const [firstEndpointSymbolId, secondEndpointSymbolId] =
      childContext.endpointSymbolIds;
    const firstEndpointShapeVertexId = primalShapeVertexIdBySymbolId.get(
      firstEndpointSymbolId,
    );
    const secondEndpointShapeVertexId = primalShapeVertexIdBySymbolId.get(
      secondEndpointSymbolId,
    );

    if (!firstEndpointShapeVertexId || !secondEndpointShapeVertexId) {
      issues.push({
        code: 'missing-child-midpoint',
        message: `Cannot resolve child ${childContext.childSymbolId} because one or both endpoint primals are unresolved.`,
        symbolId: childContext.childSymbolId,
        details: {
          firstEndpointResolved: Boolean(firstEndpointShapeVertexId),
          secondEndpointResolved: Boolean(secondEndpointShapeVertexId),
        },
      });
      continue;
    }

    const candidates = findAmboMidpointVerticesByEndpoints(
      shape,
      firstEndpointShapeVertexId,
      secondEndpointShapeVertexId,
    );

    if (candidates.length === 0) {
      issues.push({
        code: 'missing-child-midpoint',
        message: `Missing Ambo midpoint vertex for child ${childContext.childSymbolId}.`,
        symbolId: childContext.childSymbolId,
        details: {
          firstEndpointShapeVertexId,
          secondEndpointShapeVertexId,
        },
      });
      continue;
    }

    if (candidates.length > 1) {
      issues.push({
        code: 'duplicate-child-midpoint',
        message: `Child ${childContext.childSymbolId} matched more than one Ambo midpoint vertex.`,
        symbolId: childContext.childSymbolId,
        details: {
          matchCount: candidates.length,
        },
      });
      continue;
    }

    const vertex = candidates[0];

    if (!isFiniteVec3(vertex.position)) {
      issues.push({
        code: 'non-finite-position',
        message: `Resolved child ${childContext.childSymbolId} has a non-finite Shape position.`,
        symbolId: childContext.childSymbolId,
        shapeVertexId: vertex.id,
      });
      continue;
    }

    appendResolvedBinding({
      binding: {
        symbolId: childContext.childSymbolId,
        shapeVertexId: vertex.id,
        sourceKind: 'ambo-midpoint',
        position: copyVec3(vertex.position),
        endpointSymbolIds: [...childContext.endpointSymbolIds],
        endpointShapeVertexIds: [
          firstEndpointShapeVertexId,
          secondEndpointShapeVertexId,
        ],
      },
      positionByVertexId,
      resolvedBindings,
    });
  }

  return buildResolverReport({
    shape,
    shapeContextStatus,
    issues,
    resolvedBindings,
    positionByVertexId,
  });
}

function appendShapeContextIssues(
  shape: Shape,
  issues: ProfileAwareShapePositionResolverIssue[],
): ProfileAwareShapePositionResolverReport['shapeContextStatus'] {
  const policyReport = buildProfileAwareRuntimeSupportPolicyReport(shape);
  const seedKeySupported = getRuntimeSupportCriterionPassed(
    policyReport,
    'tetrahedron-seed',
  );
  const operationSupported = getRuntimeSupportCriterionPassed(
    policyReport,
    'ambo-dissection-operation',
  );
  const generationDepthSupported = getRuntimeSupportCriterionPassed(
    policyReport,
    'minimum-generation-depth',
  );
  const createdVerticesSupported = getRuntimeSupportCriterionPassed(
    policyReport,
    'created-vertices-present',
  );

  if (policyReport.supportStatus === 'supported') {
    return 'supported';
  }

  issues.push({
    code: policyReport.unsupportedIssueCode ?? 'unsupported-shape-context',
    message:
      policyReport.unsupportedReason ??
      'Profile-aware Shape position resolution currently supports only a tetrahedron seed-derived Shape after at least one Ambo dissection.',
    details: {
      seedKey: policyReport.seedKey ?? null,
      operation: policyReport.operation,
      generationDepth: policyReport.generationDepth,
      createdVertexCount: policyReport.createdVertexCount,
      seedKeySupported,
      operationSupported,
      generationDepthSupported,
      createdVerticesSupported,
    },
  });

  return 'unsupported';
}

function getRuntimeSupportCriterionPassed(
  policyReport: ReturnType<typeof buildProfileAwareRuntimeSupportPolicyReport>,
  criterionId:
    | 'tetrahedron-seed'
    | 'ambo-dissection-operation'
    | 'minimum-generation-depth'
    | 'created-vertices-present',
): boolean {
  return Boolean(
    policyReport.criteria.find((criterion) => criterion.id === criterionId)?.passed,
  );
}

function buildResolverReport(args: {
  shape: Shape;
  shapeContextStatus: ProfileAwareShapePositionResolverReport['shapeContextStatus'];
  issues: ProfileAwareShapePositionResolverIssue[];
  resolvedBindings: ProfileAwareShapePositionResolvedBinding[];
  positionByVertexId: Record<string, Vec3>;
}): ProfileAwareShapePositionResolverReport {
  const resolvedPrimalCount = args.resolvedBindings.filter(
    (binding) => binding.sourceKind === 'primal-seed-label',
  ).length;
  const resolvedChildCount = args.resolvedBindings.filter(
    (binding) => binding.sourceKind === 'ambo-midpoint',
  ).length;
  const issueCount = args.issues.length;

  return {
    reportId: `${METHOD}:${args.shape.id}`,
    method: METHOD,
    diagnosticScope: DIAGNOSTIC_SCOPE,
    shapeId: args.shape.id,
    shapeContextStatus: args.shapeContextStatus,
    ...(args.shape.seedKey ? { shapeSeedKey: args.shape.seedKey } : {}),
    shapeOperation: args.shape.genealogy.operation,
    shapeGenerationDepth: args.shape.genealogy.generationDepth,
    resolvedPrimalCount,
    resolvedChildCount,
    totalResolvedPositionCount: Object.keys(args.positionByVertexId).length,
    missingPrimalCount: args.issues.filter(
      (issue) => issue.code === 'missing-primal-label',
    ).length,
    missingChildCount: args.issues.filter(
      (issue) => issue.code === 'missing-child-midpoint',
    ).length,
    duplicatePrimalLabelCount: args.issues.filter(
      (issue) => issue.code === 'duplicate-primal-label',
    ).length,
    nonFinitePositionCount: args.issues.filter(
      (issue) => issue.code === 'non-finite-position',
    ).length,
    shapeMutationStatus: 'not-shape-mutation',
    packetWriteStatus: 'not-packet-writing',
    issueCount,
    ok: issueCount === 0,
    issues: args.issues,
    resolvedBindings: args.resolvedBindings,
    positionByVertexId: args.positionByVertexId,
  };
}

function appendResolvedBinding(args: {
  binding: ProfileAwareShapePositionResolvedBinding;
  positionByVertexId: Record<string, Vec3>;
  resolvedBindings: ProfileAwareShapePositionResolvedBinding[];
}): void {
  args.positionByVertexId[args.binding.symbolId] = copyVec3(args.binding.position);
  args.resolvedBindings.push({
    ...args.binding,
    position: copyVec3(args.binding.position),
    ...(args.binding.endpointSymbolIds
      ? { endpointSymbolIds: [...args.binding.endpointSymbolIds] }
      : {}),
    ...(args.binding.endpointShapeVertexIds
      ? { endpointShapeVertexIds: [...args.binding.endpointShapeVertexIds] }
      : {}),
  });
}

function findPrimalSeedVerticesByLabel(shape: Shape, label: string): Vertex[] {
  return Object.values(shape.vertices).filter(
    (vertex) => vertex.createdBy.operation === 'seed' && vertex.data.label === label,
  );
}

function findAmboMidpointVerticesByEndpoints(
  shape: Shape,
  firstEndpointShapeVertexId: VertexId,
  secondEndpointShapeVertexId: VertexId,
): Vertex[] {
  const endpointKey = buildEndpointKey([
    firstEndpointShapeVertexId,
    secondEndpointShapeVertexId,
  ]);

  return Object.values(shape.vertices).filter(
    (vertex) =>
      vertex.createdBy.operation === 'ambo-dissection' &&
      vertex.createdBy.sourceVertexIds.length === 2 &&
      buildEndpointKey(vertex.createdBy.sourceVertexIds) === endpointKey,
  );
}

function buildEndpointKey(vertexIds: VertexId[]): string {
  return [...vertexIds].sort().join('|');
}

function copyVec3(position: Vec3): Vec3 {
  return [position[0], position[1], position[2]];
}

function isFiniteVec3(position: Vec3): boolean {
  return (
    Number.isFinite(position[0]) &&
    Number.isFinite(position[1]) &&
    Number.isFinite(position[2])
  );
}
