import { type KeyboardEvent, type MouseEvent, useMemo } from 'react';
import {
  buildFieldCueV0Report,
  type FieldCueV0,
  type FieldCueV0CandidateRelation,
  type FieldCueV0ParticipationStatus,
} from '../lib/fieldCueV0';
import { buildFieldCueV0MultiProjectionDisplayAdapterReport } from '../lib/fieldCueV0MultiProjectionDisplayAdapter';
import type { Shape } from '../types/geometry';
import { FieldCueV0MultiProjectionDisplay } from './FieldCueV0MultiProjectionDisplay';

type FieldCueV0ShapeSupportStatus = 'supported' | 'unsupported';

interface FieldCueV0PanelProps {
  shape: Shape;
  hoveredProbeRef: string | null;
  pinnedProbeRef: string | null;
  onHoverStart: (probeRef: string) => void;
  onHoverEnd: (probeRef: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
}

interface FieldCueV0ProbeInteractionProps {
  hoveredProbeRef: string | null;
  pinnedProbeRef: string | null;
  onHoverStart: (probeRef: string) => void;
  onHoverEnd: (probeRef: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
}

export function FieldCueV0Panel({
  shape,
  hoveredProbeRef,
  pinnedProbeRef,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
}: FieldCueV0PanelProps) {
  const supportStatus = getFieldCueV0ShapeSupportStatus(shape);

  if (supportStatus === 'unsupported') {
    return <FieldCueV0UnsupportedPanel shape={shape} />;
  }

  return (
    <SupportedFieldCueV0Panel
      hoveredProbeRef={hoveredProbeRef}
      pinnedProbeRef={pinnedProbeRef}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      onTogglePinnedProbe={onTogglePinnedProbe}
    />
  );
}

function SupportedFieldCueV0Panel({
  hoveredProbeRef,
  pinnedProbeRef,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
}: FieldCueV0ProbeInteractionProps) {
  const report = useMemo(() => buildFieldCueV0Report(), []);
  const multiProjectionDisplayReport = useMemo(
    () => buildFieldCueV0MultiProjectionDisplayAdapterReport(),
    [],
  );

  return (
    <section className="rounded border border-cyan-400/25 bg-cyan-950/15 px-3 py-2 text-xs">
      <FieldCueV0MultiProjectionDisplay report={multiProjectionDisplayReport} />

      <details className="mt-3 rounded border border-stone-800 bg-stone-950/70 px-3 py-2">
        <summary className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-300">
          Legacy FieldCueV0 diagnostic details - not authoritative for the
          multi-projection source-state regime.
        </summary>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
              FieldCueV0: field witness for generated sites
            </h3>
            <p className="mt-1 leading-5 text-stone-400">
              {
                'Candidate evidence only; no auto-name; not topology; not semantic naming; not packet writing; not general field layer.'
              }
            </p>
          </div>
          <span
            className={`shrink-0 rounded border px-2 py-0.5 font-mono text-[11px] ${
              report.ok
                ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-100'
                : 'border-amber-400/40 bg-amber-400/10 text-amber-100'
            }`}
          >
            {report.ok ? 'ready' : 'issue'}
          </span>
        </div>

        <div className="mt-3 grid max-h-[36rem] gap-2 overflow-y-auto pr-1">
          {report.cues.map((cue) => (
            <FieldCueV0Card
              key={cue.siteId}
              cue={cue}
              hoveredProbeRef={hoveredProbeRef}
              pinnedProbeRef={pinnedProbeRef}
              onHoverStart={onHoverStart}
              onHoverEnd={onHoverEnd}
              onTogglePinnedProbe={onTogglePinnedProbe}
            />
          ))}
        </div>
      </details>
    </section>
  );
}

function FieldCueV0UnsupportedPanel({ shape }: { shape: Shape }) {
  return (
    <section className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-100">
            FieldCueV0 unavailable for current shape
          </h3>
          <p className="mt-1 leading-5 text-stone-300">
            {
              'one-Ambo tetrahedron only; not general field layer; not semantic naming; not topology; not packet writing'
            }
          </p>
        </div>
        <span className="shrink-0 rounded border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 font-mono text-[11px] text-amber-100">
          unavailable
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2">
        <FieldCueV0Metric label="Seed" value={shape.seedKey ?? 'unknown'} />
        <FieldCueV0Metric label="Operation" value={shape.genealogy.operation} />
        <FieldCueV0Metric
          label="Generation"
          value={shape.genealogy.generationDepth}
        />
      </dl>
    </section>
  );
}

function getFieldCueV0ShapeSupportStatus(
  shape: Shape,
): FieldCueV0ShapeSupportStatus {
  return shape.seedKey === 'tetrahedron' &&
    shape.genealogy.operation === 'ambo-dissection' &&
    shape.genealogy.generationDepth === 1
    ? 'supported'
    : 'unsupported';
}

function FieldCueV0Card({
  cue,
  hoveredProbeRef,
  pinnedProbeRef,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
}: {
  cue: FieldCueV0;
} & FieldCueV0ProbeInteractionProps) {
  const axis = cue.inheritanceAxis;
  const candidateAxis = cue.candidateFieldWorldAxis;
  const topRelations = [...candidateAxis.candidateRelations]
    .sort(compareCandidateRelations)
    .slice(0, 2);
  const sourceProbeRef = cue.emittedSourceSignature.sourceProbeRef;
  const sourceProbeState = getProbeInteractionState({
    probeRef: sourceProbeRef,
    hoveredProbeRef,
    pinnedProbeRef,
  });
  const sourceProbeHandlers = buildProbeInteractionHandlers({
    probeRef: sourceProbeRef,
    onHoverStart,
    onHoverEnd,
    onTogglePinnedProbe,
  });
  const primaryWarningStatus = pickPrimaryHumanWarningStatus(cue);
  const candidateCount = candidateAxis.candidateReferenceCount;

  return (
    <article
      className={`rounded border px-3 py-2 transition-colors ${
        sourceProbeState.isPinned
          ? 'border-cyan-300/70 bg-cyan-950/35'
          : sourceProbeState.isHovered
            ? 'border-cyan-400/45 bg-cyan-950/25'
            : 'border-stone-800 bg-stone-950'
      } ${sourceProbeRef ? 'cursor-pointer' : ''}`}
      {...sourceProbeHandlers}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-mono text-sm font-semibold text-stone-100">
            {cue.siteId}
          </h4>
          <p className="mt-1 leading-5 text-stone-500">
            {shortStatus(cue.eventScopeStatus)} / {shortStatus(cue.generalityStatus)}
          </p>
        </div>
        <span className="rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300">
          {getHumanWarningLabel(primaryWarningStatus)}
        </span>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-2">
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
              Source signature
            </h5>
            <p className="mt-1 font-mono text-sm text-stone-100">
              {formatSourceSignature(cue)}
            </p>
            <p className="mt-1 leading-5 text-stone-400">
              {cue.emittedSourceSignature.emissionTuple
                ? "This is the child's emitted wave signature in the field."
                : 'V0 did not resolve numeric signature values for this child; read the warning below before naming.'}
            </p>
          </div>

          <details
            className="text-stone-500"
            onClick={(event) => event.stopPropagation()}
          >
            <summary className="cursor-pointer select-none text-[11px] uppercase tracking-[0.14em]">
              what these numbers mean
            </summary>
            <dl className="mt-2 grid gap-1 leading-5 text-stone-400">
              <div>
                <dt className="inline font-medium text-stone-300">strength:</dt>{' '}
                <dd className="inline">how strongly this source contributes before interference</dd>
              </div>
              <div>
                <dt className="inline font-medium text-stone-300">frequency:</dt>{' '}
                <dd className="inline">how quickly its wave oscillates over distance</dd>
              </div>
              <div>
                <dt className="inline font-medium text-stone-300">phase:</dt>{' '}
                <dd className="inline">where the wave starts in its cycle</dd>
              </div>
              <div>
                <dt className="inline font-medium text-stone-300">decay:</dt>{' '}
                <dd className="inline">how quickly it weakens with distance</dd>
              </div>
            </dl>
          </details>
        </div>

        <div>
          <h5 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Signature birth
          </h5>
          <p className="mt-1 leading-5 text-stone-300">
            {buildSignatureBirthSentence(cue)}
          </p>
          <p className="mt-1 font-mono text-[11px] text-stone-500">
            Quark channels: {formatQuarkPairs(cue)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-stone-400">
        <span className="rounded bg-stone-900 px-2 py-0.5">
          feature candidates {candidateAxis.featureObservationReferenceCount}
        </span>
        <span className="rounded bg-stone-900 px-2 py-0.5">
          candidate route/gate {candidateAxis.routeGateCandidateReferenceCount}
        </span>
        <span className="rounded bg-stone-900 px-2 py-0.5">
          candidate support/region {candidateAxis.supportRegionCandidateReferenceCount}
        </span>
        <span className="rounded bg-stone-900 px-2 py-0.5">
          field links {candidateCount}
        </span>
      </div>

      <div className="mt-3 grid gap-2">
        <HumanWarnings cue={cue} />

        {topRelations.length ? (
          <div className="grid gap-1.5">
            {topRelations.map((relation) => (
              <FieldCueV0RelationRow
                key={`${relation.targetKind}:${relation.targetId}:${relation.relationKind}`}
                relation={relation}
                hoveredProbeRef={hoveredProbeRef}
                pinnedProbeRef={pinnedProbeRef}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
                onTogglePinnedProbe={onTogglePinnedProbe}
              />
            ))}
          </div>
        ) : (
          <p className="rounded bg-stone-900/70 px-2 py-1.5 leading-5 text-stone-500">
            No measured candidate field relation is available for this child in V0.
          </p>
        )}
      </div>

      <p className="mt-3 leading-5 text-stone-300">{cue.fieldPressureSummary}</p>

      <p className="mt-2 leading-5 text-stone-400">
        <span className="font-medium text-stone-300">Question for naming:</span>{' '}
        {getHumanNamingQuestion(cue)}
      </p>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-600">
        <span>cue only | no auto-name | not topology</span>
        <DiagnosticRefs sourceProbeRef={sourceProbeRef} />
      </div>
    </article>
  );
}

function HumanWarnings({ cue }: { cue: FieldCueV0 }) {
  const statuses = getHumanWarningStatuses(cue).slice(0, 3);

  if (!statuses.length) {
    return null;
  }

  return (
    <div className="grid gap-1.5">
      {statuses.map((status) => (
        <div
          key={status}
          className="rounded bg-stone-900/70 px-2 py-1.5 leading-5 text-stone-400"
        >
          <span className="font-medium text-stone-200">
            {getHumanWarningLabel(status)}
          </span>
          <span className="text-stone-500"> - {getHumanWarningSentence(status)}</span>
        </div>
      ))}
    </div>
  );
}

function FieldCueV0RelationRow({
  relation,
  hoveredProbeRef,
  pinnedProbeRef,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
}: {
  relation: FieldCueV0CandidateRelation;
} & FieldCueV0ProbeInteractionProps) {
  const probeTarget = getRelationProbeTarget(relation);
  const probeState = getProbeInteractionState({
    probeRef: probeTarget?.probeRef,
    hoveredProbeRef,
    pinnedProbeRef,
  });
  const probeHandlers = buildProbeInteractionHandlers({
    probeRef: probeTarget?.probeRef,
    onHoverStart,
    onHoverEnd,
    onTogglePinnedProbe,
    stopClickPropagation: true,
  });

  return (
    <div
      className={`rounded px-2 py-1.5 transition-colors ${
        probeState.isPinned
          ? 'bg-cyan-950/45 ring-1 ring-cyan-300/60'
          : probeState.isHovered
            ? 'bg-cyan-950/25 ring-1 ring-cyan-400/35'
            : 'bg-stone-900/70'
      } ${probeTarget ? 'cursor-pointer' : ''}`}
      {...probeHandlers}
    >
      <p className="leading-5 text-stone-300">{describeCandidateRelation(relation)}</p>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-stone-500">
        <span>share {formatPercent(relation.sourceContributionRatio)}</span>
        <span>rank {relation.sourceContributionRank ?? 'n/a'}</span>
        <span>evidence {getEvidenceLabel(relation.meaningfulContributionRule)}</span>
        <span>stability {getHumanWarningLabel(relation.participationStatus)}</span>
      </div>
      <details
        className="mt-1 text-[11px] text-stone-600"
        onClick={(event) => event.stopPropagation()}
      >
        <summary className="cursor-pointer select-none">diagnostic refs</summary>
        <div className="mt-1 grid gap-1 font-mono">
          <span>target {shortenId(relation.targetId)}</span>
          {probeTarget ? <span>marker {shortenId(probeTarget.probeRef)}</span> : null}
        </div>
      </details>
    </div>
  );
}

function DiagnosticRefs({ sourceProbeRef }: { sourceProbeRef?: string }) {
  if (!sourceProbeRef) {
    return null;
  }

  return (
    <details
      className="text-stone-600"
      onClick={(event) => event.stopPropagation()}
    >
      <summary className="cursor-pointer select-none">diagnostic refs</summary>
      <span className="mt-1 block font-mono">source {shortenId(sourceProbeRef)}</span>
    </details>
  );
}

function FieldCueV0Metric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-3 py-2">
      <dt className="text-[11px] uppercase tracking-[0.14em] text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm text-stone-200">{value}</dd>
    </div>
  );
}

function getRelationProbeTarget(
  relation: FieldCueV0CandidateRelation,
): { probeRef: string; label: string } | null {
  if (relation.probeRef) {
    return { probeRef: relation.probeRef, label: 'marker ref' };
  }

  const sampleProbeRef = relation.sampleProbeRefs?.[0];

  return sampleProbeRef
    ? { probeRef: sampleProbeRef, label: 'sample marker fallback' }
    : null;
}

function getProbeInteractionState({
  probeRef,
  hoveredProbeRef,
  pinnedProbeRef,
}: {
  probeRef: string | undefined;
  hoveredProbeRef: string | null;
  pinnedProbeRef: string | null;
}) {
  return {
    isHovered: Boolean(probeRef && hoveredProbeRef === probeRef),
    isPinned: Boolean(probeRef && pinnedProbeRef === probeRef),
  };
}

function buildProbeInteractionHandlers({
  probeRef,
  onHoverStart,
  onHoverEnd,
  onTogglePinnedProbe,
  stopClickPropagation = false,
}: {
  probeRef: string | undefined;
  onHoverStart: (probeRef: string) => void;
  onHoverEnd: (probeRef: string) => void;
  onTogglePinnedProbe: (probeRef: string) => void;
  stopClickPropagation?: boolean;
}) {
  if (!probeRef) {
    return {};
  }

  return {
    role: 'button',
    tabIndex: 0,
    onPointerEnter: () => onHoverStart(probeRef),
    onPointerLeave: () => onHoverEnd(probeRef),
    onFocus: () => onHoverStart(probeRef),
    onBlur: () => onHoverEnd(probeRef),
    onClick: (event: MouseEvent<HTMLElement>) => {
      if (stopClickPropagation) {
        event.stopPropagation();
      }

      onTogglePinnedProbe(probeRef);
    },
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') {
        return;
      }

      if (stopClickPropagation) {
        event.stopPropagation();
      }

      event.preventDefault();
      onTogglePinnedProbe(probeRef);
    },
  };
}

function compareCandidateRelations(
  left: FieldCueV0CandidateRelation,
  right: FieldCueV0CandidateRelation,
): number {
  const ratioDelta =
    (right.sourceContributionRatio ?? 0) - (left.sourceContributionRatio ?? 0);

  if (ratioDelta !== 0) {
    return ratioDelta;
  }

  return (left.sourceContributionRank ?? 999) - (right.sourceContributionRank ?? 999);
}

function formatSourceSignature(cue: FieldCueV0): string {
  const tuple = cue.emittedSourceSignature.emissionTuple;

  return [
    `strength ${formatSignatureNumber(tuple?.amplitude)}`,
    `frequency ${formatSignatureNumber(tuple?.waveNumber)}`,
    `phase ${formatSignatureNumber(tuple?.phase)}`,
    `decay ${formatSignatureNumber(tuple?.attenuation)}`,
  ].join(' | ');
}

function buildSignatureBirthSentence(cue: FieldCueV0): string {
  const axis = cue.inheritanceAxis;
  const edge = axis.sourceEdgeId ?? 'this edge';
  const projections = formatList(axis.projectionVertexIds, 'its projection sources');
  const channelCount = axis.quarkChannelSummaries.length;
  const mergeText = axis.mergeKind ? `${axis.mergeKind} ` : '';

  return `Born on ${edge}; projected by ${projections}; ${channelCount} Quark channels merged through ${mergeText}into this source signature.`;
}

function describeCandidateRelation(relation: FieldCueV0CandidateRelation): string {
  const targetText = getTargetDescription(relation.targetKind);
  const evidenceText = getEvidenceDescription(relation.meaningfulContributionRule);

  return `${targetText} ${evidenceText}`;
}

function getTargetDescription(kind: FieldCueV0CandidateRelation['targetKind']): string {
  switch (kind) {
    case 'route-gate-candidate':
      return 'Touches a route/gate candidate.';
    case 'support-region-candidate':
      return 'Touches a support/region candidate.';
    default:
      return 'Touches a feature candidate.';
  }
}

function getEvidenceDescription(rule: string): string {
  switch (rule) {
    case 'dominant-source-contribution':
      return 'This child is the strongest contributor there.';
    case 'source-ratio-at-least-baseline-times-1.25':
      return 'Its share rises above the local baseline.';
    case 'source-rank-top-3':
      return 'It appears among the top contributors nearby.';
    default:
      return 'V0 has measured source contribution evidence.';
  }
}

function getEvidenceLabel(rule: string): string {
  switch (rule) {
    case 'dominant-source-contribution':
      return 'strongest';
    case 'source-ratio-at-least-baseline-times-1.25':
      return 'above baseline';
    case 'source-rank-top-3':
      return 'top-3';
    default:
      return 'measured';
  }
}

function getHumanWarningStatuses(cue: FieldCueV0): FieldCueV0ParticipationStatus[] {
  const statuses = [...cue.warningStatuses];

  if (cue.candidateFieldWorldAxis.candidateReferenceCount > 0) {
    statuses.push('candidate-only');
  }

  if (!statuses.length) {
    statuses.push(cue.participationStatus);
  }

  return uniqueStatuses(statuses);
}

function pickPrimaryHumanWarningStatus(cue: FieldCueV0): FieldCueV0ParticipationStatus {
  const statuses = getHumanWarningStatuses(cue);
  const priority: FieldCueV0ParticipationStatus[] = [
    'degenerate',
    'misleading-risk',
    'sensitive',
    'saturated',
    'weak',
    'unsupported',
    'not-applicable',
    'candidate-only',
    'not-yet-computed',
  ];

  return priority.find((status) => statuses.includes(status)) ?? cue.participationStatus;
}

function getHumanWarningLabel(status: FieldCueV0ParticipationStatus): string {
  switch (status) {
    case 'candidate-only':
      return 'unconfirmed cue';
    case 'sensitive':
      return 'unstable evidence';
    case 'saturated':
      return 'crowded candidate set';
    case 'degenerate':
      return 'collapsed distinction';
    case 'misleading-risk':
      return 'read cautiously';
    case 'weak':
      return 'weak field pressure';
    case 'unsupported':
      return 'unavailable';
    case 'not-applicable':
      return 'not applicable';
    case 'not-yet-computed':
      return 'not computed';
    default:
      return 'available cue';
  }
}

function getHumanWarningSentence(status: FieldCueV0ParticipationStatus): string {
  switch (status) {
    case 'candidate-only':
      return 'measured relation only; not a stable field feature';
    case 'sensitive':
      return 'this cue changes across sampling/profile checks';
    case 'saturated':
      return 'candidate buckets are full, so counts are not very informative';
    case 'degenerate':
      return "this child's signature overlaps another child, often its antipode";
    case 'misleading-risk':
      return 'there is field evidence, but warning flags make it unsafe to overread';
    case 'weak':
      return 'the child has a source signature, but little useful field participation';
    case 'unsupported':
      return 'this cue is outside the supported V0 event';
    case 'not-applicable':
      return 'V0 cannot use this field relation here';
    case 'not-yet-computed':
      return 'the relation has not been computed in V0';
    default:
      return 'field evidence is available for inspection';
  }
}

function getHumanNamingQuestion(cue: FieldCueV0): string {
  const statuses = getHumanWarningStatuses(cue);

  if (statuses.includes('degenerate')) {
    return 'Does this site really differ from its antipode, or should naming be suspended?';
  }

  if (statuses.includes('weak')) {
    return 'Does geometry carry the site without help from the field?';
  }

  if (
    statuses.includes('sensitive') ||
    statuses.includes('saturated') ||
    statuses.includes('misleading-risk')
  ) {
    return 'Is the field cue stable enough to matter for naming?';
  }

  if (statuses.includes('candidate-only')) {
    return 'Does this measured field pressure sharpen the site enough to name?';
  }

  return 'What, if anything, can dwell here?';
}

function formatList(values: readonly string[] | undefined, emptyLabel = 'n/a'): string {
  return values && values.length ? values.join('/') : emptyLabel;
}

function formatQuarkPairs(cue: FieldCueV0): string {
  const pairs = cue.inheritanceAxis.quarkChannelSummaries
    .map((channel) => `${channel.parent60}/${channel.projection30}`)
    .slice(0, 4);

  return pairs.length ? pairs.join(' | ') : 'none';
}

function formatSignatureNumber(value: number | undefined): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(2)
    : 'n/a';
}

function formatPercent(value: number | undefined): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? `${(value * 100).toFixed(1)}%`
    : 'n/a';
}

function shortenId(id: string): string {
  if (id.length <= 28) {
    return id;
  }

  return `${id.slice(0, 14)}...${id.slice(-10)}`;
}

function shortStatus(status: string): string {
  return status
    .replace('one-ambo-tetrahedron-proving-event', 'event-bound')
    .replace('not-general-field-layer', 'not-general')
    .replace('event-bound-profile-aware-prototype', 'event-bound');
}

function uniqueStatuses(
  statuses: FieldCueV0ParticipationStatus[],
): FieldCueV0ParticipationStatus[] {
  return Array.from(new Set(statuses));
}
