import type { GeneratedSiteReadingV0FieldCueDisplayAdapterReport } from '../lib/generatedSiteReadingV0FieldCueDisplayAdapter';

interface GeneratedSiteReadingV0FieldCueDisplayProps {
  report: GeneratedSiteReadingV0FieldCueDisplayAdapterReport;
}

export function GeneratedSiteReadingV0FieldCueDisplay({
  report,
}: GeneratedSiteReadingV0FieldCueDisplayProps) {
  return (
    <section className="generated-site-fieldcue-display" aria-label={report.headerModel.title}>
      <header className="generated-site-fieldcue-display__header">
        <h2>{report.headerModel.title}</h2>
        <p>{report.headerModel.subtitle}</p>
        <p>
          This is not site meaning. No auto-name is produced. Raw field
          visibility is not proven.
        </p>
        <p>
          This is event-bound prototype, candidate field-feature evidence only:
          one-Ambo tetrahedron only, not general field layer, not semantic
          naming, not site meaning, no auto-name, and not final generated-site
          meaning.
        </p>
        <p>
          route/gate/support/region counts are candidates, not confirmed topology.
        </p>
        <ul className="generated-site-fieldcue-display__badges">
          {report.headerModel.statusBadges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
          <li>one-Ambo tetrahedron only</li>
          <li>not general field layer</li>
          <li>raw field visibility is not proven</li>
          <li>emitted tuple is not full source signature</li>
          <li>structural witness is under declared basis</li>
          <li>not semantic naming</li>
          <li>not final generated-site meaning</li>
          <li>no auto-name</li>
        </ul>
      </header>

      <section
        className="generated-site-fieldcue-display__summary"
        aria-label="Display summary"
      >
        <h3>Display Summary</h3>
        <dl>
          <div>
            <dt>Sites</dt>
            <dd>{report.displaySummary.siteDisplayRowCount}</dd>
          </div>
          <div>
            <dt>Relations</dt>
            <dd>{report.displaySummary.relationDisplayRowCount}</dd>
          </div>
          <div>
            <dt>Raw field visible claims</dt>
            <dd>{report.displaySummary.rawFieldVisibleClaimCount}</dd>
          </div>
          <div>
            <dt>Misleading-risk relations</dt>
            <dd>{report.displaySummary.misleadingRiskRelationCount}</dd>
          </div>
          <div>
            <dt>Tuple warnings</dt>
            <dd>{report.displaySummary.tupleLossWarningCount}</dd>
          </div>
          <div>
            <dt>Mounted in app</dt>
            <dd>{String(report.displaySummary.mountedInApp)}</dd>
          </div>
        </dl>
      </section>

      <section
        className="generated-site-fieldcue-display__sites"
        aria-label="Generated site FieldCue evidence"
      >
        <h3>Generated Site Evidence</h3>
        {report.siteDisplayRows.map((row) => (
          <article
            className={`generated-site-fieldcue-display__site generated-site-fieldcue-display__site--${row.uiWarningLevel}`}
            key={row.siteId}
          >
            <header>
              <h4>{row.siteId}</h4>
              <p>{row.displayWarningText}</p>
              <p>{row.humanWarningText}</p>
            </header>

            <dl>
              <div>
                <dt>Event scope</dt>
                <dd>{row.eventBoundPrototypeStatus}</dd>
              </div>
              <div>
                <dt>Field layer</dt>
                <dd>{row.fieldLayerGeneralityStatus}</dd>
              </div>
              <div>
                <dt>Evidence scope</dt>
                <dd>{row.fieldFeatureEvidenceScope}</dd>
              </div>
              <div>
                <dt>Feature observations</dt>
                <dd>{row.fieldCandidateReferenceCounts.feature}</dd>
              </div>
              <div>
                <dt>Route/gate candidates</dt>
                <dd>{row.fieldCandidateReferenceCounts.routeGate}</dd>
              </div>
              <div>
                <dt>Support/region candidates</dt>
                <dd>{row.fieldCandidateReferenceCounts.supportRegion}</dd>
              </div>
            </dl>
            <p>
              Field candidate counts are candidate counts only: feature,
              route-gate, and support-region counts are not confirmed topology.
            </p>

            <div className="generated-site-fieldcue-display__evidence-grid">
              <section aria-label={`${row.siteId} propagation evidence`}>
                <h5>Propagation</h5>
                <p>{row.propagationDisplay.warningText}</p>
                <p>Raw field visibility is not proven.</p>
                <dl>
                  <div>
                    <dt>Carrier wave number</dt>
                    <dd>{row.propagationDisplay.carrierWaveNumber}</dd>
                  </div>
                  <div>
                    <dt>Carrier phase</dt>
                    <dd>{row.propagationDisplay.carrierPhase}</dd>
                  </div>
                  <div>
                    <dt>Attenuation</dt>
                    <dd>{row.propagationDisplay.attenuation}</dd>
                  </div>
                  <div>
                    <dt>Raw propagation</dt>
                    <dd>{row.propagationDisplay.rawPropagationStatus}</dd>
                  </div>
                </dl>
              </section>

              <section aria-label={`${row.siteId} structural evidence`}>
                <h5>Structural Witness</h5>
                <p>{row.structuralDisplay.warningText}</p>
                <p>
                  Structural evidence is under declared basis, not semantic
                  truth.
                </p>
                <dl>
                  <div>
                    <dt>Projection</dt>
                    <dd>{row.structuralDisplay.structuralProjectionStatus}</dd>
                  </div>
                  <div>
                    <dt>Relation carrier</dt>
                    <dd>{row.structuralDisplay.relationCarrierStatus}</dd>
                  </div>
                </dl>
              </section>

              <section aria-label={`${row.siteId} reduction warning`}>
                <h5>Reduction Warning</h5>
                <p>{row.reductionDisplay.warningText}</p>
                <p>Emitted tuple is not full source signature.</p>
                <dl>
                  <div>
                    <dt>Emitted tuple</dt>
                    <dd>{row.reductionDisplay.emittedTupleStatus}</dd>
                  </div>
                  <div>
                    <dt>Source signature</dt>
                    <dd>{row.reductionDisplay.sourceSignatureStatus}</dd>
                  </div>
                </dl>
              </section>
            </div>

            <section aria-label={`${row.siteId} cautions`}>
              <h5>Warnings</h5>
              <ul>
                {row.requiredWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
              <h5>Forbidden Interpretations</h5>
              <ul>
                {row.forbiddenInterpretations.map((interpretation) => (
                  <li key={interpretation}>{interpretation}</li>
                ))}
              </ul>
            </section>
          </article>
        ))}
      </section>

      <section
        className="generated-site-fieldcue-display__relations"
        aria-label="Generated site FieldCue relations"
      >
        <h3>Relation Evidence</h3>
        {report.relationDisplayRows.map((row) => (
          <article
            className="generated-site-fieldcue-display__relation"
            key={row.relationId}
          >
            <header>
              <h4>
                {row.leftChildSiteId} / {row.rightChildSiteId}
              </h4>
              <p>{row.displayWarningText}</p>
              <p>{row.warningText}</p>
              <p>
                Relation evidence is warning-bearing; misleading-risk is
                preserved. Do not read as raw field proof. Do not read as
                semantic name. Do not read as final generated-site meaning.
              </p>
            </header>
            <dl>
              <div>
                <dt>Relation</dt>
                <dd>{row.sourceStateRelation}</dd>
              </div>
              <div>
                <dt>Raw field cue</dt>
                <dd>{row.rawFieldCueStatus}</dd>
              </div>
              <div>
                <dt>Structural channel</dt>
                <dd>{row.structuralChannelCueStatus}</dd>
              </div>
              <div>
                <dt>Depropagation</dt>
                <dd>{row.depropagationCueStatus}</dd>
              </div>
              <div>
                <dt>Misleading risk</dt>
                <dd>{String(row.misleadingRisk)}</dd>
              </div>
            </dl>
            <p>{row.fieldCueWarning}</p>
            <p>{row.generatedSiteReadingWarning}</p>
            <ul>
              {row.forbiddenInterpretations.map((interpretation) => (
                <li key={interpretation}>{interpretation}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </section>
  );
}
