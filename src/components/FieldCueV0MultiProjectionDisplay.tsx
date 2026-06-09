import type { FieldCueV0MultiProjectionDisplayAdapterReport } from '../lib/fieldCueV0MultiProjectionDisplayAdapter';

interface FieldCueV0MultiProjectionDisplayProps {
  report: FieldCueV0MultiProjectionDisplayAdapterReport;
}

export function FieldCueV0MultiProjectionDisplay({
  report,
}: FieldCueV0MultiProjectionDisplayProps) {
  return (
    <section className="field-cue-v0-multi-projection-display">
      <header className="field-cue-v0-multi-projection-display__header">
        <h2>{report.headerModel.title}</h2>
        <p>{report.headerModel.subtitle}</p>
        <ul>
          {report.headerModel.statusBadges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
      </header>

      <section aria-labelledby="field-cue-v0-multi-projection-child-heading">
        <h3 id="field-cue-v0-multi-projection-child-heading">
          Generated child witnesses
        </h3>
        <div>
          {report.childDisplayRows.map((row) => (
            <article key={row.childSiteId}>
              <h4>{row.childSiteId}</h4>
              <p>Source state: {row.sourceStateId}</p>

              <section>
                <h5>{row.propagationLabel}</h5>
                <dl>
                  <div>
                    <dt>Carrier wave number</dt>
                    <dd>{formatNumber(row.propagationSummary.carrierWaveNumber)}</dd>
                  </div>
                  <div>
                    <dt>Carrier phase</dt>
                    <dd>{formatNumber(row.propagationSummary.carrierPhase)}</dd>
                  </div>
                  <div>
                    <dt>Attenuation</dt>
                    <dd>{formatNumber(row.propagationSummary.attenuation)}</dd>
                  </div>
                  <div>
                    <dt>Raw propagation status</dt>
                    <dd>{row.propagationSummary.rawPropagationStatus}</dd>
                  </div>
                </dl>
                <p>{row.propagationSummary.interpretation}</p>
              </section>

              <section>
                <h5>{row.structuralLabel}</h5>
                <dl>
                  <div>
                    <dt>Projection status</dt>
                    <dd>{row.structuralSummary.structuralProjectionStatus}</dd>
                  </div>
                  <div>
                    <dt>Carrier status</dt>
                    <dd>{row.structuralSummary.relationCarrierStatus}</dd>
                  </div>
                </dl>
                <p>{row.structuralSummary.interpretation}</p>
              </section>

              <aside>
                <p>{row.reductionWarning.displayWarningText}</p>
                <dl>
                  <div>
                    <dt>Emitted tuple</dt>
                    <dd>{row.reductionWarning.emittedTupleStatus}</dd>
                  </div>
                  <div>
                    <dt>Source signature</dt>
                    <dd>{row.reductionWarning.sourceSignatureStatus}</dd>
                  </div>
                </dl>
              </aside>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="field-cue-v0-multi-projection-relation-heading">
        <h3 id="field-cue-v0-multi-projection-relation-heading">
          Relation witnesses
        </h3>
        <div>
          {report.relationDisplayRows.map((row) => (
            <article key={row.relationId}>
              <h4>
                {row.leftChildSiteId} / {row.rightChildSiteId}
              </h4>
              <p>{row.sourceStateRelation}</p>
              <dl>
                <div>
                  <dt>Raw field cue</dt>
                  <dd>{row.rawFieldCueStatus}</dd>
                </div>
                <div>
                  <dt>Structural channel cue</dt>
                  <dd>{row.structuralChannelCueStatus}</dd>
                </div>
                <div>
                  <dt>Depropagation cue</dt>
                  <dd>{row.depropagationCueStatus}</dd>
                </div>
                <div>
                  <dt>Display eligibility</dt>
                  <dd>{row.displayEligibility}</dd>
                </div>
              </dl>
              <p>{row.warningText}</p>
              <p>{row.interpretationText}</p>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <dl>
          <div>
            <dt>Child rows</dt>
            <dd>{report.displaySummary.childDisplayRowCount}</dd>
          </div>
          <div>
            <dt>Relation rows</dt>
            <dd>{report.displaySummary.relationDisplayRowCount}</dd>
          </div>
          <div>
            <dt>Raw field visible claims</dt>
            <dd>{report.displaySummary.rawFieldVisibleClaimCount}</dd>
          </div>
          <div>
            <dt>Misleading risk rows</dt>
            <dd>{report.displaySummary.misleadingRiskRowCount}</dd>
          </div>
          <div>
            <dt>Generated-site reading</dt>
            <dd>{report.generatedSiteReadingV0Status}</dd>
          </div>
        </dl>
        <p>Raw field visibility is not proven.</p>
        <p>The emitted tuple is not the full source signature.</p>
        <p>Structural witness is under declared basis.</p>
        <p>Generated-site reading remains blocked.</p>
      </footer>
    </section>
  );
}

function formatNumber(value: number): string {
  return Number.isFinite(value) ? value.toFixed(6) : String(value);
}
