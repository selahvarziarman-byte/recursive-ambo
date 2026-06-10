import { useMemo, useState } from 'react';
import {
  buildFieldCueV0Report,
  type FieldCueV0,
  type FieldCueV0EmissionTuple,
} from '../lib/fieldCueV0';
import {
  buildGeneratedSiteReadingV0Report,
  type GeneratedSiteReadingV0,
  type GeneratedSiteReadingV0UsefulnessStatus,
} from '../lib/generatedSiteReadingV0';
import { GeneratedSiteReadingV0FieldCueDisplay } from './GeneratedSiteReadingV0FieldCueDisplay';
import { buildGeneratedSiteReadingV0FieldCueDisplayAdapterReport } from '../lib/generatedSiteReadingV0FieldCueDisplayAdapter';
import type { Shape } from '../types/geometry';

type GeneratedSiteReadingV0ShapeSupportStatus = 'supported' | 'unsupported';

interface GeneratedSiteReadingV0PanelProps {
  shape: Shape;
}

const FALLBACK_NAMING_QUESTION =
  'What, if anything, can dwell at this generated site?';

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
  const fieldCueDisplayReport = useMemo(
    () => buildGeneratedSiteReadingV0FieldCueDisplayAdapterReport(),
    [],
  );
  const fieldCueBySiteId = useMemo(
    () =>
      new Map(
        buildFieldCueV0Report().cues.map((cue) => [cue.siteId, cue] as const),
      ),
    [],
  );
  const [selectedSiteId, setSelectedSiteId] = useState(
    report.readings[0]?.siteId ?? '',
  );
  const selectedReading =
    report.readings.find((reading) => reading.siteId === selectedSiteId) ??
    report.readings[0];
  const selectedCue = selectedReading
    ? fieldCueBySiteId.get(selectedReading.siteId)
    : undefined;

  return (
    <section className="grid gap-3">
      <GeneratedSiteReadingV0FieldCueDisplay report={fieldCueDisplayReport} />

      <details className="rounded border border-stone-800 bg-stone-950/75 px-3 py-3 text-xs">
        <summary className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-400">
          Legacy GeneratedSiteReadingV0 diagnostic details - not authoritative
          for the FieldCue evidence regime.
        </summary>

        <section className="mt-3 rounded border border-emerald-400/20 bg-emerald-950/10 px-3 py-3">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-100">
                Generated-site reading
              </h3>
              <p className="mt-1 leading-5 text-stone-400">
                Choose a generated midpoint, read its source signature, then
                decide whether naming pressure is strong enough for human
                judgment.
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
          </header>

          <div className="mt-3 grid grid-cols-2 gap-1 sm:grid-cols-3">
            {report.readings.map((reading) => {
              const cue = fieldCueBySiteId.get(reading.siteId);
              const selected = reading.siteId === selectedReading?.siteId;

              return (
                <button
                  key={reading.siteId}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedSiteId(reading.siteId)}
                  className={`rounded border px-2 py-2 text-left transition-colors ${
                    selected
                      ? 'border-emerald-300/70 bg-emerald-950/35'
                      : 'border-stone-800 bg-stone-950 hover:border-emerald-400/40 hover:bg-emerald-950/20'
                  }`}
                >
                  <span className="block font-mono text-sm font-semibold text-stone-100">
                    {reading.siteId}
                  </span>
                  <span className="mt-1 block leading-4 text-stone-400">
                    {getCompactSiteLabel(reading, cue)}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedReading ? (
            <GeneratedSiteReadingV0Detail
              reading={selectedReading}
              fieldCue={selectedCue}
            />
          ) : null}
        </section>
      </details>
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
  fieldCue,
}: {
  reading: GeneratedSiteReadingV0;
  fieldCue: FieldCueV0 | undefined;
}) {
  const signature = getUsableSignature(fieldCue);
  const signatureStatus = getSignatureStatusLabel(reading, fieldCue);
  const fieldContactLabel = getFieldContactLabel(reading, fieldCue);
  const secondaryQuestions = buildSecondaryQuestions(reading);

  return (
    <article className="mt-3 rounded border border-stone-800 bg-stone-950 px-3 py-3">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="font-mono text-base font-semibold text-stone-100">
            {reading.siteId}
          </h4>
          <p className="mt-1 leading-5 text-stone-300">
            {buildSiteStructuralPhrase(reading)}
          </p>
        </div>
        <div className="flex max-w-full flex-wrap gap-1">
          <span className="rounded bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300">
            {signatureStatus}
          </span>
          <span className="rounded bg-stone-900 px-2 py-0.5 text-[11px] text-stone-300">
            {fieldContactLabel}
          </span>
        </div>
      </header>

      <div className="mt-4 grid gap-4">
        <section>
          <h5 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Source signature
          </h5>
          {signature ? (
            <>
              <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <GeneratedSiteReadingV0Metric
                  label="strength"
                  value={formatSignatureValue(signature.amplitude)}
                />
                <GeneratedSiteReadingV0Metric
                  label="frequency"
                  value={formatSignatureValue(signature.waveNumber)}
                />
                <GeneratedSiteReadingV0Metric
                  label="phase"
                  value={formatSignatureValue(signature.phase)}
                />
                <GeneratedSiteReadingV0Metric
                  label="decay"
                  value={formatSignatureValue(signature.attenuation)}
                />
              </dl>
              <p className="mt-2 leading-5 text-stone-400">
                These are the wave parameters this child emits into the field.
              </p>
            </>
          ) : (
            <div className="mt-2 rounded border border-amber-400/25 bg-amber-400/10 px-3 py-2">
              <p className="font-semibold text-amber-100">
                No emitted wave signature in V0.
              </p>
              <p className="mt-1 leading-5 text-stone-300">
                {describeMissingSignatureReason(reading, fieldCue)}
              </p>
            </div>
          )}
        </section>

        <section>
          <h5 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            How the signature was derived
          </h5>
          <p className="mt-1 leading-5 text-stone-300">
            {buildSignatureDerivationSentence(reading, fieldCue, Boolean(signature))}
          </p>
          <p className="mt-1 leading-5 text-stone-500">
            Each channel weights the parent side more strongly than the
            projection side; phase is merged circularly.
          </p>
          <details className="mt-2 rounded border border-stone-800 bg-stone-950/80 px-3 py-2">
            <summary className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
              derivation details
            </summary>
            <dl className="mt-2 grid gap-2 leading-5 text-stone-400">
              <GeneratedSiteReadingV0InlineMetric
                label="channel pairs"
                value={formatQuarkChannelPairs(fieldCue)}
              />
              <GeneratedSiteReadingV0InlineMetric
                label="merge kind"
                value={fieldCue?.inheritanceAxis.mergeKind ?? 'unavailable'}
              />
              <GeneratedSiteReadingV0InlineMetric
                label="grammar"
                value={
                  fieldCue?.inheritanceAxis.inheritanceGrammarId ??
                  'unavailable'
                }
              />
            </dl>
          </details>
        </section>

        <section>
          <h5 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Field contact
          </h5>
          <p className="mt-1 leading-5 text-stone-300">
            {describeFieldContact(reading, fieldCue)}
          </p>
          <p className="mt-1 leading-5 text-stone-500">
            {describeFieldCandidateCounts(reading)}
          </p>
        </section>

        <section>
          <h5 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Naming pressure
          </h5>
          <p className="mt-1 leading-5 text-emerald-100">
            {buildSiteSpecificNamingPrompt(reading, fieldCue)}
          </p>
          {secondaryQuestions.length ? (
            <details className="mt-2 text-stone-400">
              <summary className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
                more questions
              </summary>
              <ul className="mt-2 grid gap-1 leading-5">
                {secondaryQuestions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </details>
          ) : null}
          <p className="mt-2 font-mono text-[11px] text-stone-500">
            question only | human names | no packet write | not topology
          </p>
        </section>
      </div>
    </article>
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

function getUsableSignature(
  fieldCue: FieldCueV0 | undefined,
): FieldCueV0EmissionTuple | undefined {
  if (
    fieldCue?.inheritanceAxis.inheritanceStatus !== 'complete' ||
    !fieldCue.emittedSourceSignature.fieldReady
  ) {
    return undefined;
  }

  return fieldCue.emittedSourceSignature.emissionTuple;
}

function getCompactSiteLabel(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): string {
  return `${getUsefulnessLabel(
    reading.readingUsefulness.readingUsefulnessStatus,
  )}; ${getFieldContactLabel(reading, fieldCue)}`;
}

function getSignatureStatusLabel(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): string {
  return getInheritanceLabel(
    fieldCue?.inheritanceAxis.inheritanceStatus ??
      reading.fieldWitness.fieldInheritanceStatus,
  );
}

function getUsefulnessLabel(
  status: GeneratedSiteReadingV0UsefulnessStatus,
): string {
  if (status === 'useful-for-human-inspection') {
    return 'inspectable';
  }

  if (status === 'weak-field-pressure') {
    return 'weak field help';
  }

  if (status === 'candidate-only') {
    return 'candidate pressure';
  }

  if (status === 'degenerate-warning') {
    return 'collapsed distinction';
  }

  if (status === 'unsupported') {
    return 'unsupported';
  }

  if (status.includes('misleading')) {
    return 'read cautiously';
  }

  return formatStatusLabel(status);
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

function getFieldContactLabel(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): string {
  if (isCollapsedReading(reading, fieldCue)) {
    return 'source distinction collapsed';
  }

  if (hasUnstableEvidence(reading, fieldCue)) {
    return 'unstable field evidence';
  }

  if (hasCrowdedCandidateSet(reading, fieldCue)) {
    return 'crowded candidate set';
  }

  if (reading.fieldWitness.fieldCandidateReferenceCounts.total === 0) {
    return 'weak field help';
  }

  return 'measured field contact';
}

function buildSiteStructuralPhrase(reading: GeneratedSiteReadingV0): string {
  return `${reading.geometryWitness.sourceEdgeId ?? 'unknown'} child under ${formatProjectionVertices(
    reading,
  )} projection; antipode ${
    reading.geometryWitness.antipodalChildSiteId ?? 'unknown'
  }`;
}

function buildSignatureDerivationSentence(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
  hasUsableSignature: boolean,
): string {
  const siteId = reading.siteId;
  const sourceEdge = reading.geometryWitness.sourceEdgeId ?? 'unknown edge';
  const projections = formatProjectionVertices(reading);
  const channelPairs = formatQuarkChannelPairs(fieldCue);

  if (!fieldCue || channelPairs === 'unavailable') {
    return `${siteId} is born on ${sourceEdge}. ${projections} act as projection sources. V0 does not expose channel-level derivation details for this site.`;
  }

  const action = hasUsableSignature
    ? 'The child signature is derived'
    : 'V0 tests the child-source derivation';

  return `${siteId} is born on ${sourceEdge}. ${projections} act as projection sources. ${action} from four Quark channels - ${channelPairs} - then merged into one emitted wave signature.`;
}

function describeMissingSignatureReason(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): string {
  const status =
    fieldCue?.inheritanceAxis.inheritanceStatus ??
    reading.fieldWitness.fieldInheritanceStatus;

  if (status === 'fallback') {
    const fallbackReason = fieldCue?.inheritanceAxis.fallbackReason;

    return fallbackReason
      ? `The child-source derivation fell back before a usable numeric signature was produced: ${formatStatusLabel(
          fallbackReason,
        )}.`
      : 'The child-source derivation fell back before a usable numeric signature was produced.';
  }

  if (status === 'unresolved') {
    return 'The child-source derivation remained unresolved, so no usable numeric signature was produced.';
  }

  if (status === 'degenerate') {
    return 'The child-source derivation collapsed against another child, so its signature should not be read separately.';
  }

  if (status === 'unsupported') {
    return 'The field witness does not support a source signature for this site in V0.';
  }

  return 'The child-source derivation did not produce a usable numeric signature.';
}

function describeFieldContact(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): string {
  const contactCount = reading.fieldWitness.fieldCandidateReferenceCounts.total;

  if (isCollapsedReading(reading, fieldCue)) {
    return 'The source distinction collapsed, so field contact should be read as an antipodal ambiguity rather than a separate structure.';
  }

  if (contactCount === 0) {
    return 'The field finds little useful contact for this child.';
  }

  if (hasUnstableEvidence(reading, fieldCue)) {
    return 'This child touches several measured field candidates, but the evidence is unstable across checks.';
  }

  if (hasDominantFieldContact(fieldCue)) {
    return 'This child is the strongest contributor at some measured field touchpoints.';
  }

  if (hasCrowdedCandidateSet(reading, fieldCue)) {
    return 'Candidate sets are crowded; counts should not be read as structure.';
  }

  return 'This child has measured field contact that can pressure a naming attempt.';
}

function describeFieldCandidateCounts(reading: GeneratedSiteReadingV0): string {
  const counts = reading.fieldWitness.fieldCandidateReferenceCounts;

  if (counts.total === 0) {
    return 'field touchpoints: none found in V0.';
  }

  const countSummary = `field touchpoints: ${counts.feature} feature | ${counts.routeGate} route/gate candidates | ${counts.supportRegion} support/region candidates`;

  if (
    reading.fieldWitness.fieldWarningStatuses.includes('saturated') ||
    reading.ambiguityWitness.ambiguityStatus === 'saturated'
  ) {
    return `${countSummary}. crowded candidate set; count is not itself meaningful.`;
  }

  if (hasUnstableEvidence(reading, undefined)) {
    return `${countSummary}. unstable evidence; count is only a contact clue.`;
  }

  return `${countSummary}. count is a contact clue, not a mature structure.`;
}

function buildSiteSpecificNamingPrompt(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): string {
  const siteId = reading.siteId;
  const sourceEdge = reading.geometryWitness.sourceEdgeId;
  const complementEdge = reading.geometryWitness.complementEdgeId;
  const antipode = reading.geometryWitness.antipodalChildSiteId;
  const under = sourceEdge && complementEdge ? `${sourceEdge}-under-${complementEdge}` : '';
  const hasSignature = Boolean(getUsableSignature(fieldCue));
  const contactCount = reading.fieldWitness.fieldCandidateReferenceCounts.total;

  if (isCollapsedReading(reading, fieldCue) && antipode) {
    return `${siteId} may not separate cleanly from ${antipode}. Should these sites be named separately, or held as an antipodal ambiguity?`;
  }

  if (!hasSignature && sourceEdge && complementEdge) {
    return `${siteId} is structurally readable as ${sourceEdge} under ${complementEdge}, but V0 has no emitted wave signature. Should naming rely on geometry alone, or remain suspended?`;
  }

  if (contactCount === 0 && sourceEdge && complementEdge) {
    return `${siteId} is structurally readable as ${sourceEdge} under ${complementEdge}, but the field adds little pressure. Should naming rely on geometry alone?`;
  }

  if (hasSignature && hasUnstableEvidence(reading, fieldCue) && under) {
    return `${siteId} has a derived ${under} wave signature, but field contact is unstable. Is there enough pressure to name it now, or should it remain suspended?`;
  }

  if (hasSignature && contactCount > 0 && under) {
    return `${siteId} carries a derived source signature and measurable field contact. What concept could inhabit this ${under} position?`;
  }

  return FALLBACK_NAMING_QUESTION;
}

function buildSecondaryQuestions(reading: GeneratedSiteReadingV0): string[] {
  return uniqueStrings([
    ...reading.humanNamingPrompt.secondaryNamingQuestions,
    ...reading.fieldWitness.fieldNamingQuestions,
  ]).slice(0, 3);
}

function isCollapsedReading(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): boolean {
  return (
    reading.ambiguityWitness.ambiguityStatus === 'degenerate' ||
    fieldCue?.inheritanceAxis.inheritanceStatus === 'degenerate' ||
    fieldCue?.warningStatuses.includes('degenerate') === true
  );
}

function hasUnstableEvidence(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): boolean {
  return (
    reading.ambiguityWitness.ambiguityStatus === 'sensitive' ||
    reading.ambiguityWitness.ambiguityStatus.includes('misleading') ||
    reading.fieldWitness.fieldWarningStatuses.includes('sensitive') ||
    fieldCue?.warningStatuses.includes('sensitive') === true ||
    fieldCue?.warningStatuses.some((status) => status.includes('misleading')) ===
      true
  );
}

function hasCrowdedCandidateSet(
  reading: GeneratedSiteReadingV0,
  fieldCue: FieldCueV0 | undefined,
): boolean {
  return (
    reading.ambiguityWitness.ambiguityStatus === 'saturated' ||
    reading.fieldWitness.fieldWarningStatuses.includes('saturated') ||
    fieldCue?.warningStatuses.includes('saturated') === true
  );
}

function hasDominantFieldContact(fieldCue: FieldCueV0 | undefined): boolean {
  return (
    fieldCue?.candidateFieldWorldAxis.candidateRelations.some((relation) =>
      relation.relationKind.includes('dominant'),
    ) === true
  );
}

function formatProjectionVertices(reading: GeneratedSiteReadingV0): string {
  const projections = reading.atomicWitness.projectionVertexIds.length
    ? reading.atomicWitness.projectionVertexIds
    : reading.geometryWitness.complementEdgeVertexIds;

  return projections.length ? projections.join('/') : 'unknown';
}

function formatQuarkChannelPairs(fieldCue: FieldCueV0 | undefined): string {
  const channels = fieldCue?.inheritanceAxis.quarkChannelSummaries ?? [];

  if (!channels.length) {
    return 'unavailable';
  }

  return channels
    .map((channel) => `${channel.parent60}/${channel.projection30}`)
    .join(', ');
}

function formatSignatureValue(value: number): string {
  return Number.isFinite(value) ? value.toFixed(3) : 'n/a';
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

function GeneratedSiteReadingV0InlineMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="inline font-medium text-stone-300">{label}:</dt>{' '}
      <dd className="inline">{value}</dd>
    </div>
  );
}

function formatStatusLabel(status: string): string {
  return status.split('-').join(' ');
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}
