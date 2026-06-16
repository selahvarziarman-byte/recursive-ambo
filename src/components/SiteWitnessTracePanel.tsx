import type { SiteWitnesses } from '../lib/siteWitnessCatalogueV0';

// The per-site structural TRACE: the walled, read-only reading of a site's fused
// witness record — residual / abstraction / named adjacency + its gem role (the
// merge). Same palette/voice as GeneralSiteFacePanel; structural vocabulary is
// correct here (this is the trace, not the naming face). Labels only, no coded ids.
const ADJACENCY_GROUPS = [
  { type: 'object', heading: 'Objects (former vertices)' },
  { type: 'relation', heading: 'Relations (former faces)' },
  { type: 'unclassified', heading: 'Unclassified (hybrid residue faces)' },
] as const;

export function SiteWitnessTracePanel({ witness }: { witness: SiteWitnesses }) {
  return (
    <div className="grid gap-3 text-sm text-stone-300">
      {/* RESIDUAL */}
      <div className="grid gap-1">
        <span className="text-xs uppercase tracking-wide text-stone-500">Residual</span>
        {witness.residual ? (
          <>
            <p className="text-stone-300">
              <span className="text-stone-500">Preserved root: </span>
              <span className="text-stone-100">
                {witness.residual.preserved.length > 0
                  ? witness.residual.preserved.join(', ')
                  : '— (nothing distilled yet)'}
              </span>
            </p>
            <p className="text-stone-300">
              <span className="text-stone-500">Shed: </span>
              <span className="text-stone-100">
                {witness.residual.shed.length > 0 ? witness.residual.shed.join(', ') : '—'}
              </span>
            </p>
          </>
        ) : (
          <p className="text-stone-500">Residual — not defined for this site.</p>
        )}
        <p className="text-xs text-stone-500">
          {"the distilled root carried through this site's birth, and what each parent shed."}
        </p>
      </div>

      {/* ABSTRACTION */}
      <div className="grid gap-1">
        <span className="text-xs uppercase tracking-wide text-stone-500">Abstraction</span>
        <p className="text-stone-200">
          Generation depth {witness.abstraction.generationDepth} ·{' '}
          {witness.abstraction.preservedCount} preserved · {witness.abstraction.shedCount} shed
        </p>
        <p className="text-xs text-stone-500">
          a gradient — there is no fixed essence (deeper + smaller preserved = more distilled).
        </p>
      </div>

      {/* NAMED ADJACENCY */}
      <div className="grid gap-2">
        <span className="text-xs uppercase tracking-wide text-stone-500">Named adjacency</span>
        {witness.adjacency.length === 0 ? (
          <p className="text-stone-500">No incident faces.</p>
        ) : (
          ADJACENCY_GROUPS.map(({ type, heading }) => {
            const faces = witness.adjacency.filter((face) => face.type === type);
            if (faces.length === 0) {
              return null;
            }
            return (
              <div key={type} className="grid gap-1">
                <span className="text-xs uppercase tracking-wide text-stone-500">{heading}</span>
                <ul className="grid gap-1">
                  {faces.map((face, index) => (
                    <li key={`${type}-${index}`} className="text-stone-200">
                      {face.members.join(', ')}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </div>

      {/* GEM ROLE — THE MERGE */}
      <div className="grid gap-1">
        <span className="text-xs uppercase tracking-wide text-stone-500">Gem role — the merge</span>
        {witness.gemRoles.length === 0 ? (
          <p className="text-stone-500">No symmetry gem at this site.</p>
        ) : (
          witness.gemRoles.map((role, roleIndex) => {
            const antipodal = role.incidentAxes.filter((axis) => axis.kind === 'antipodal-pair');
            const otherCounts = new Map<string, number>();
            for (const axis of role.incidentAxes) {
              if (axis.kind === 'antipodal-pair') {
                continue;
              }
              otherCounts.set(axis.kind, (otherCounts.get(axis.kind) ?? 0) + 1);
            }
            return (
              <div key={`role-${roleIndex}`} className="grid gap-1">
                <p className="text-stone-200">
                  In its {role.topology} — {role.gemName}
                </p>
                <ul className="grid gap-1">
                  {antipodal.map((axis, axisIndex) => {
                    const partner =
                      axis.members.filter((member) => member !== witness.label).join(', ') || '—';
                    return (
                      <li key={`anti-${axisIndex}`} className="text-stone-200">
                        Antipodal partner: {partner}
                      </li>
                    );
                  })}
                  {[...otherCounts.entries()].map(([kind, count]) => (
                    <li key={`count-${kind}`} className="text-stone-200">
                      On {count} {kind} {count === 1 ? 'axis' : 'axes'}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-stone-500">
                  {"the cell's symmetry, expressed through this site."}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
