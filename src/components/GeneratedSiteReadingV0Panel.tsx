import { useMemo, useState } from 'react';
import {
  buildGeneratedSiteReadingV0Report,
  type GeneratedSiteReadingV0,
  type GeneratedSiteReadingV0AmbiguityStatus,
  type GeneratedSiteReadingV0UsefulnessStatus,
} from '../lib/generatedSiteReadingV0';
import type { Shape } from '../types/geometry';

type GeneratedSiteReadingV0ShapeSupportStatus = 'supported' | 'unsupported';
type GeneratedSiteReadingV0WitnessKind = 'geometry' | 'birth-law' | 'field';

interface GeneratedSiteReadingV0PanelProps {
  shape: Shape;
}

const WITNESS_KINDS: GeneratedSiteReadingV0WitnessKind[] = [
  'geometry',
  'birth-law',
  'field',
];

export function GeneratedSiteReadingV0Panel({
  shape,
}: GeneratedSiteReadingV0PanelProps) {
  const supportStatus = getGeneratedSiteReadingV0ShapeSupportStatus(shape);

  if (supportStatus === 'unsupported') {
    return <GeneratedSiteReadingV0UnsupportedPanel shape={shape} />;
  }

  return <SupportedGeneratedSiteReadingV0Panel />;
}

function SupportedGeneratedSiteReadingV0Panel() {
  const report = useMemo(() => buildGeneratedSiteReadingV0Report(), []);
  const [selectedSiteId, setSelectedSiteId] = useState(
    report.readings[0]?.siteId ?? '',
  );
  const selectedReading =
    report.readings.find((reading) => reading.siteId === selectedSiteId) ??
    report.readings[0];

  return (
    <section className="rounded border border-emerald-400/25 bg-emerald-950/15 px-3 py-2 text-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">
            GeneratedSiteReadingV0: generated site reading
          </h3>
          <p className="mt-1 leading-5 text-stone-400">
            Geometry, birth-law, and field witness the generated site; human
            names; question only.
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

      <div className="mt-3 grid gap-2">
        {report.readings.map((reading) => (
          <button
            key={reading.siteId}
            type="button"
            aria-pressed={reading.siteId === selectedReading?.siteId}
            onClick={() => setSelectedSiteId(reading.siteId)}
            className={`rounded border px-3 py-2 text-left transition-colors ${
              reading.siteId === selectedReading?.siteId
                ? 'border-emerald-300/70 bg-emerald-950/35'
                : 'border-stone-800 bg-stone-950 hover:border-emerald-400/40 hover:bg-emerald-950/20'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-sm font-semibold text-stone-100">
                {reading.siteId}
              </span>
              <span className="flex flex-wrap gap-1">
                <span className="rounded bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300">
                  {getUsefulnessLabel(
                    reading.readingUsefulness.readingUsefulnessStatus,
                  )}
                </span>
                <span className="rounded bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300">
                  {getAmbiguityLabel(
                    reading.ambiguityWitness.ambiguityStatus,
                  )}
                </span>
              </span>
            </div>
            <p className="mt-1 leading-5 text-stone-400">
              {buildStructuralLine(reading)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              {WITNESS_KINDS.map((kind) => (
                <span
                  key={kind}
                  className="rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300"
                >
                  {getWitnessChipLabel(kind)}
                </span>
              ))}
            </div>
            <p className="mt-2 leading-5 text-emerald-100">
              {getNamingQuestion(reading)}
            </p>
          </button>
        ))}
      </div>

      {selectedReading ? (
        <GeneratedSiteReadingV0Detail reading={selectedReading} />
      ) : null}
    </section>
  );
}

function GeneratedSiteReadingV0UnsupportedPanel({ shape }: { shape: Shape }) {
  return (
    <section className="rounded border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-100">
            GeneratedSiteReadingV0 unavailable for current shape
          </h3>
          <p className="mt-1 leading-5 text-stone-300">
            one-Ambo tetrahedron only; not general; not semantic naming; not
            topology; not packet writing
          </p>
        </div>
        <span className="shrink-0 rounded border border-amber-300/40 bg-amber-300/10 px-2 py-0.5 font-mono text-[11px] text-amber-100">
          unavailable
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-3 gap-2">
        <GeneratedSiteReadingV0Metric
          label="Seed"
          value={shape.seedKey ?? 'unknown'}
        />
        <GeneratedSiteReadingV0Metric
          label="Operation"
          value={shape.genealogy.operation}
        />
        <GeneratedSiteReadingV0Metric
          label="Generation"
          value={shape.genealogy.generationDepth}
        />
      </dl>
    </section>
  );
}

function GeneratedSiteReadingV0Detail({
  reading,
}: {
  reading: GeneratedSiteReadingV0;
}) {
  const geometry = reading.geometryWitness;
  const birthLaw = reading.atomicWitness;
  const field = reading.fieldWitness;
  const ambiguityWarnings = getAmbiguityWarningSummaries(reading);
  const fieldWarnings = getFieldWarningLabels(reading);

  return (
    <div className="mt-3 grid gap-3 rounded border border-stone-800 bg-stone-950 px-3 py-3">
      <div className="grid gap-3 lg:grid-cols-3">
        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Geometry witness
          </h4>
          <p className="mt-1 leading-5 text-stone-300">
            Source edge {geometry.sourceEdgeId ?? 'unknown'} from parents{' '}
            {formatList(geometry.parentVertexIds)}; complement{' '}
            {geometry.complementEdgeId ?? 'unknown'}; antipodal child{' '}
            {geometry.antipodalChildSiteId ?? 'unknown'}.
          </p>
          <p className="mt-1 leading-5 text-stone-500">
            {geometry.structuralRoleSummary}
          </p>
        </section>

        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Birth-law witness
          </h4>
          <p className="mt-1 leading-5 text-stone-300">
            event-bound birth-law; child role {birthLaw.childRole ?? 'unknown'};
            grammar {birthLaw.inheritanceGrammarId ?? 'unavailable'}; merge{' '}
            {birthLaw.mergeKind ?? 'unavailable'}.
          </p>
          <p className="mt-1 leading-5 text-stone-400">
            Projections {formatList(birthLaw.projectionVertexIds)}.{' '}
            {birthLaw.birthLawSummary}
          </p>
        </section>

        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Field witness
          </h4>
          <p className="mt-1 leading-5 text-stone-300">
            {getFieldWitnessSentence(reading)}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <GeneratedSiteReadingV0Metric
              label="feature"
              value={field.fieldCandidateReferenceCounts.feature}
            />
            <GeneratedSiteReadingV0Metric
              label="candidate route/gate"
              value={field.fieldCandidateReferenceCounts.routeGate}
            />
            <GeneratedSiteReadingV0Metric
              label="candidate support/region"
              value={field.fieldCandidateReferenceCounts.supportRegion}
            />
          </div>
        </section>
      </div>

      <section>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          Field pressure
        </h4>
        <p className="mt-1 leading-5 text-stone-300">
          {field.fieldPressureSummary ?? 'No field pressure summary available.'}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {fieldWarnings.length ? (
            fieldWarnings.map((warning) => (
              <span
                key={warning}
                className="rounded bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300"
              >
                {warning}
              </span>
            ))
          ) : (
            <span className="rounded bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300">
              no extra field warning
            </span>
          )}
        </div>
      </section>

      <section>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          Ambiguity / warning
        </h4>
        <p className="mt-1 leading-5 text-stone-300">
          {getAmbiguityLabel(reading.ambiguityWitness.ambiguityStatus)}
        </p>
        <ul className="mt-1 grid gap-1 leading-5 text-stone-400">
          {ambiguityWarnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </section>

      <section>
        <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
          Naming prompt
        </h4>
        <p className="mt-1 leading-5 text-emerald-100">
          {getNamingQuestion(reading)}
        </p>
        <ul className="mt-1 grid gap-1 leading-5 text-stone-400">
          {reading.humanNamingPrompt.secondaryNamingQuestions
            .slice(0, 2)
            .map((question) => (
              <li key={question}>{question}</li>
            ))}
        </ul>
        <p className="mt-2 font-mono text-[11px] text-stone-500">
          question only | human names | no packet write | not topology
        </p>
      </section>
    </div>
  );
}

function getGeneratedSiteReadingV0ShapeSupportStatus(
  shape: Shape,
): GeneratedSiteReadingV0ShapeSupportStatus {
  return shape.seedKey === 'tetrahedron' &&
    shape.genealogy.operation === 'ambo-dissection' &&
    shape.genealogy.generationDepth === 1
    ? 'supported'
    : 'unsupported';
}

function getUsefulnessLabel(
  status: GeneratedSiteReadingV0UsefulnessStatus,
): string {
  switch (status) {
    case 'useful-for-human-inspection':
      return 'inspectable';
    case 'weak-field-pressure':
      return 'weak field help';
    case 'candidate-only':
      return 'candidate pressure';
    case 'degenerate-warning':
      return 'collapsed distinction';
    case 'unsupported':
      return 'unsupported';
    case 'misleading-risk':
      return 'read cautiously';
  }
}

function getAmbiguityLabel(status: GeneratedSiteReadingV0AmbiguityStatus): string {
  switch (status) {
    case 'clear-enough-for-inspection':
      return 'clear enough to inspect';
    case 'candidate-only':
      return 'candidate-only';
    case 'degenerate':
      return 'collapsed distinction';
    case 'sensitive':
      return 'unstable evidence';
    case 'saturated':
      return 'crowded candidate set';
    case 'weak':
      return 'weak pressure';
    case 'unsupported':
      return 'unsupported';
    case 'misleading-risk':
      return 'read cautiously';
  }
}

function getWitnessChipLabel(kind: GeneratedSiteReadingV0WitnessKind): string {
  switch (kind) {
    case 'geometry':
      return 'geometry';
    case 'birth-law':
      return 'birth-law';
    case 'field':
      return 'field';
  }
}

function getFieldWitnessSentence(reading: GeneratedSiteReadingV0): string {
  const field = reading.fieldWitness;
  const cueStatus = getFieldCueStatusLabel(field.fieldCueStatus);
  const participation = getParticipationLabel(field.fieldParticipationStatus);
  const inheritance = getInheritanceLabel(field.fieldInheritanceStatus);

  return `${cueStatus}; ${participation}; ${inheritance}.`;
}

function getNamingQuestion(reading: GeneratedSiteReadingV0): string {
  return (
    reading.humanNamingPrompt.primaryNamingQuestion ||
    reading.fieldWitness.fieldNamingQuestions[0] ||
    'What, if anything, can dwell at this generated site?'
  );
}

function buildStructuralLine(reading: GeneratedSiteReadingV0): string {
  const geometry = reading.geometryWitness;

  return `born on ${geometry.sourceEdgeId ?? 'unknown'}; complement ${
    geometry.complementEdgeId ?? 'unknown'
  }; antipode ${geometry.antipodalChildSiteId ?? 'unknown'}`;
}

function getFieldCueStatusLabel(status: string): string {
  switch (status) {
    case 'available':
      return 'field cue available';
    case 'unavailable':
      return 'field cue unavailable';
    case 'issue':
      return 'field cue needs review';
    default:
      return formatStatusLabel(status);
  }
}

function getParticipationLabel(status: string | undefined): string {
  switch (status) {
    case 'available':
      return 'field pressure available';
    case 'candidate-only':
      return 'candidate pressure only';
    case 'weak':
      return 'weak field pressure';
    case 'saturated':
      return 'crowded candidate set';
    case 'sensitive':
      return 'unstable evidence';
    case 'degenerate':
      return 'collapsed source distinction';
    case 'unsupported':
      return 'field witness unsupported';
    case 'misleading-risk':
      return 'read field evidence cautiously';
    case 'not-yet-computed':
      return 'field witness not computed';
    case 'not-applicable':
      return 'field witness not applicable';
    case undefined:
      return 'field participation unavailable';
    default:
      return formatStatusLabel(status);
  }
}

function getInheritanceLabel(status: string | undefined): string {
  switch (status) {
    case 'complete':
      return 'derived source signature';
    case 'fallback':
      return 'fallback source signature';
    case 'unresolved':
      return 'unresolved source signature';
    case 'degenerate':
      return 'collapsed source signature';
    case 'unsupported':
      return 'source signature unavailable';
    case undefined:
      return 'source signature unavailable';
    default:
      return formatStatusLabel(status);
  }
}

function getFieldWarningLabels(reading: GeneratedSiteReadingV0): string[] {
  return uniqueStrings(
    reading.fieldWitness.fieldWarningStatuses.map((status) =>
      getParticipationLabel(status),
    ),
  ).slice(0, 3);
}

function getAmbiguityWarningSummaries(
  reading: GeneratedSiteReadingV0,
): string[] {
  const summaries = [
    summarizeAmbiguityStatus(reading.ambiguityWitness.ambiguityStatus),
    ...reading.ambiguityWitness.ambiguityWarnings
      .map(rewriteAmbiguityWarning)
      .filter((warning): warning is string => Boolean(warning)),
    ...reading.ambiguityWitness.unsupportedCaveats
      .map(rewriteUnsupportedCaveat)
      .filter((warning): warning is string => Boolean(warning)),
  ];

  return uniqueStrings(summaries).slice(0, 2);
}

function summarizeAmbiguityStatus(
  status: GeneratedSiteReadingV0AmbiguityStatus,
): string {
  switch (status) {
    case 'clear-enough-for-inspection':
      return 'clear enough for a naming attempt';
    case 'candidate-only':
      return 'candidate pressure only';
    case 'degenerate':
      return 'source distinction collapsed';
    case 'sensitive':
      return 'unstable field evidence';
    case 'saturated':
      return 'crowded candidate set';
    case 'weak':
      return 'weak field pressure';
    case 'unsupported':
      return 'reading unsupported in this V0 event';
    case 'misleading-risk':
      return 'field cue should be read cautiously';
  }
}

function rewriteAmbiguityWarning(warning: string): string | null {
  const lowerWarning = warning.toLowerCase();

  if (lowerWarning.includes('degenerate')) {
    return 'source distinction collapsed';
  }

  if (lowerWarning.includes('misleading-risk')) {
    return 'field cue should be read cautiously';
  }

  if (lowerWarning.includes('sensitive')) {
    return 'unstable field evidence';
  }

  if (lowerWarning.includes('saturated')) {
    return 'crowded candidate set';
  }

  if (lowerWarning.includes('weak')) {
    return 'weak field pressure';
  }

  if (lowerWarning.includes('unsupported') || lowerWarning.includes('unavailable')) {
    return 'reading unsupported in this V0 event';
  }

  return warning.length <= 96 && !lowerWarning.includes('-status:')
    ? warning
    : null;
}

function rewriteUnsupportedCaveat(caveat: string): string | null {
  const lowerCaveat = caveat.toLowerCase();

  if (lowerCaveat.includes('unsupported')) {
    return 'unsupported field evidence remains visible';
  }

  if (lowerCaveat.includes('weak')) {
    return 'weak field pressure';
  }

  if (lowerCaveat.includes('unavailable')) {
    return 'reading unavailable for this witness';
  }

  return caveat.length <= 96 ? caveat : null;
}

function GeneratedSiteReadingV0Metric({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded border border-stone-800 bg-stone-950/70 px-2 py-1">
      <dt className="text-[10px] uppercase tracking-[0.14em] text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 font-mono text-[11px] text-stone-200">{value}</dd>
    </div>
  );
}

function formatList(values: string[], emptyLabel = 'unknown'): string {
  return values.length ? values.join(', ') : emptyLabel;
}

function formatStatusLabel(status: string): string {
  return status.split('-').join(' ');
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
