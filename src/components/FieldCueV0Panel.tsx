import { useMemo } from 'react';
import {
  buildFieldCueV0Report,
  type FieldCueV0,
  type FieldCueV0CandidateRelation,
  type FieldCueV0RelationMaturity,
  type FieldCueV0TargetKind,
} from '../lib/fieldCueV0';
import type { Shape } from '../types/geometry';

type FieldCueV0ShapeSupportStatus = 'supported' | 'unsupported';

export function FieldCueV0Panel({ shape }: { shape: Shape }) {
  const supportStatus = getFieldCueV0ShapeSupportStatus(shape);

  if (supportStatus === 'unsupported') {
    return <FieldCueV0UnsupportedPanel shape={shape} />;
  }

  return <SupportedFieldCueV0Panel />;
}

function SupportedFieldCueV0Panel() {
  const report = useMemo(() => buildFieldCueV0Report(), []);

  return (
    <section className="rounded border border-cyan-400/30 bg-cyan-950/20 px-3 py-2 text-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-100">
            FieldCueV0 Generated-Site Cues
          </h3>
          <p className="mt-1 leading-5 text-stone-400">
            {
              'event-bound field witness; not semantic naming; not topology; not packet writing; not general field layer; candidate evidence only'
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
          {report.ok ? 'report ok' : 'report issue'}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <FieldCueV0Metric label="Cues" value={report.cueCount} />
        <FieldCueV0Metric label="Issues" value={report.issueCount} />
        <FieldCueV0Metric
          label="Candidate refs"
          value={sumCandidateReferenceCounts(report.summary.candidateReferenceCountsByKind)}
        />
        <FieldCueV0Metric
          label="Sensitive"
          value={report.summary.sensitiveCueCount}
        />
      </dl>

      {!report.ok ? (
        <p className="mt-3 rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2 leading-5 text-amber-100">
          FieldCueV0 report has boundary issues; this panel remains read-only
          and candidate-scoped.
        </p>
      ) : null}

      <div className="mt-3 grid max-h-[34rem] gap-2 overflow-y-auto pr-1">
        {report.cues.map((cue) => (
          <FieldCueV0Card key={cue.siteId} cue={cue} />
        ))}
      </div>
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
          unsupported
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

function FieldCueV0Card({ cue }: { cue: FieldCueV0 }) {
  const axis = cue.inheritanceAxis;
  const candidateAxis = cue.candidateFieldWorldAxis;
  const topRelations = [...candidateAxis.candidateRelations]
    .sort(compareCandidateRelations)
    .slice(0, 2);

  return (
    <article className="rounded border border-stone-800 bg-stone-950 px-3 py-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h4 className="font-mono text-sm font-semibold text-stone-100">
            {cue.siteId}
          </h4>
          <p className="mt-1 leading-5 text-stone-500">
            {cue.participationStatus} | inheritance {axis.inheritanceStatus} |{' '}
            {shortStatus(cue.eventScopeStatus)} / {shortStatus(cue.generalityStatus)}
          </p>
        </div>
        <span className="rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[11px] text-cyan-100">
          generated-site cue
        </span>
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-stone-400">
          <dt>source edge</dt>
          <dd className="text-right font-mono text-stone-300">
            {axis.sourceEdgeId ?? 'n/a'}
          </dd>
          <dt>parents</dt>
          <dd className="text-right font-mono text-stone-300">
            {formatList(axis.parentVertexIds)}
          </dd>
          <dt>projections</dt>
          <dd className="text-right font-mono text-stone-300">
            {formatList(axis.projectionVertexIds)}
          </dd>
          <dt>complement</dt>
          <dd className="text-right font-mono text-stone-300">
            {axis.complementEdgeId ?? 'n/a'}
          </dd>
          <dt>antipodal child</dt>
          <dd className="text-right font-mono text-stone-300">
            {axis.antipodalChildSiteId ?? 'n/a'}
          </dd>
          <dt>child role</dt>
          <dd className="text-right text-stone-300">{axis.childRole ?? 'n/a'}</dd>
        </dl>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-1 text-stone-400">
          <dt>Quark channels</dt>
          <dd className="text-right font-mono text-stone-300">
            {axis.quarkChannelSummaries.length}
          </dd>
          <dt>pairs</dt>
          <dd className="text-right font-mono text-stone-300">
            {formatQuarkPairs(cue)}
          </dd>
          <dt>tuple</dt>
          <dd className="text-right text-stone-300">
            {cue.emittedSourceSignature.tupleSummary}
          </dd>
          <dt>degeneracy</dt>
          <dd className="text-right text-stone-300">
            {formatList(axis.degeneracyStatuses, 'none')}
          </dd>
        </dl>
      </div>

      <div className="mt-3 rounded border border-stone-800 bg-stone-900/60 px-3 py-2">
        <div className="grid gap-1 text-stone-400 sm:grid-cols-2">
          <span>
            feature refs{' '}
            <span className="font-mono text-stone-200">
              {candidateAxis.featureObservationReferenceCount}
            </span>
          </span>
          <span>
            candidate route/gate refs{' '}
            <span className="font-mono text-stone-200">
              {candidateAxis.routeGateCandidateReferenceCount}
            </span>
          </span>
          <span>
            candidate support/region refs{' '}
            <span className="font-mono text-stone-200">
              {candidateAxis.supportRegionCandidateReferenceCount}
            </span>
          </span>
          <span>
            warnings{' '}
            <span className="text-stone-200">
              {formatList(cue.warningStatuses, 'none')}
            </span>
          </span>
        </div>

        {topRelations.length ? (
          <div className="mt-2 grid gap-2">
            {topRelations.map((relation) => (
              <FieldCueV0RelationRow
                key={`${relation.targetKind}:${relation.targetId}:${relation.relationKind}`}
                relation={relation}
              />
            ))}
          </div>
        ) : (
          <p className="mt-2 leading-5 text-stone-500">
            Missing candidate relations:{' '}
            {formatList(candidateAxis.unsupportedCaveats, 'none')}
          </p>
        )}
      </div>

      <p className="mt-2 leading-5 text-stone-300">{cue.fieldPressureSummary}</p>

      <div className="mt-2 grid gap-1 text-stone-400">
        {cue.namingQuestions.slice(0, 2).map((question, index) => (
          <p key={`${cue.siteId}:question:${index}`} className="leading-5">
            <span className="text-stone-500">Q{index + 1}.</span> {question}
          </p>
        ))}
        <p className="leading-5">
          <span className="text-stone-500">warnings:</span>{' '}
          {formatList(cue.warnings, 'none')}
        </p>
        <p className="font-medium text-stone-500">
          no auto-name; candidate-only; no topology; no packet write; not general
        </p>
      </div>
    </article>
  );
}

function FieldCueV0RelationRow({
  relation,
}: {
  relation: FieldCueV0CandidateRelation;
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-950 px-2 py-1.5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span className="font-medium text-stone-200">
          {formatTargetKind(relation.targetKind)}
        </span>
        <span className="font-mono text-stone-500">
          {shortenId(relation.targetId)}
        </span>
        <span className="text-stone-500">{relation.relationMaturity}</span>
        <span className="text-stone-500">{relation.participationStatus}</span>
      </div>
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-stone-500">
        <span>ratio {formatNumber(relation.sourceContributionRatio)}</span>
        <span>rank {relation.sourceContributionRank ?? 'n/a'}</span>
        <span>rule {relation.meaningfulContributionRule}</span>
        <span>reliability {relation.reliability}</span>
      </div>
    </div>
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

function compareCandidateRelations(
  left: FieldCueV0CandidateRelation,
  right: FieldCueV0CandidateRelation,
): number {
  const maturityDelta =
    relationMaturityRank(right.relationMaturity) -
    relationMaturityRank(left.relationMaturity);

  if (maturityDelta !== 0) {
    return maturityDelta;
  }

  const ratioDelta =
    (right.sourceContributionRatio ?? 0) - (left.sourceContributionRatio ?? 0);

  if (ratioDelta !== 0) {
    return ratioDelta;
  }

  return (left.sourceContributionRank ?? 999) - (right.sourceContributionRank ?? 999);
}

function relationMaturityRank(maturity: FieldCueV0RelationMaturity): number {
  return maturity === 'candidate-relation' ? 2 : 1;
}

function formatList(values: readonly string[] | undefined, emptyLabel = 'n/a'): string {
  return values && values.length ? values.join(', ') : emptyLabel;
}

function formatQuarkPairs(cue: FieldCueV0): string {
  const pairs = cue.inheritanceAxis.quarkChannelSummaries
    .map((channel) => `${channel.parent60}/${channel.projection30}`)
    .slice(0, 4);

  return formatList(pairs, 'none');
}

function sumCandidateReferenceCounts(
  counts: Record<FieldCueV0TargetKind, number>,
): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

function formatTargetKind(kind: FieldCueV0CandidateRelation['targetKind']): string {
  switch (kind) {
    case 'route-gate-candidate':
      return 'candidate route/gate';
    case 'support-region-candidate':
      return 'candidate support/region';
    default:
      return 'feature observation';
  }
}

function formatNumber(value: number | undefined): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? Number.parseFloat(value.toFixed(4)).toString()
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
