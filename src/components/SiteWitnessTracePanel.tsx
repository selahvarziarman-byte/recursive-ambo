// ═══ THE SITE'S TRACE — the per-site structural trace in COPY-1 §5.4's words (STAMP LAYOUT-1, the cut's stage 4b): `residual` ·
// `root kept: A` (`none yet`) · `shed: C, D` (`none`) · `no residual at this site` · `abstraction` · `generation 1 · 0 kept · 2 shed` ·
// `named neighbours` · `no faces meet here` · `objects (were corners)` · `relations (were faces)` · `mixed (residue faces)` · `symmetry`
// · `no symmetry here` · `in its octahedron: antipodality` · `opposite: CD` · `on 2 triangle-face axes`. The three captions that
// explained the lines are gone (rule 11). Read-only; the naming write stays in the editor.
import type { SiteWitnesses } from '../lib/siteWitnessCatalogueV0';
import { shapeWords } from './copyWords';

const ADJACENCY_GROUPS = [
  { type: 'object', heading: 'objects (were corners)' },
  { type: 'relation', heading: 'relations (were faces)' },
  { type: 'unclassified', heading: 'mixed (residue faces)' },
] as const;

export function SiteWitnessTracePanel({ witness }: { witness: SiteWitnesses }) {
  return (
    <div className="grid gap-3 text-sm text-stone-300">
      {/* RESIDUAL */}
      <div className="grid gap-1">
        <span className="text-xs text-stone-500">residual</span>
        {witness.residual ? (
          <>
            <p className="text-stone-300">
              <span className="text-stone-500">root kept: </span>
              <span className="text-stone-100">
                {witness.residual.preserved.length > 0 ? witness.residual.preserved.join(', ') : 'none yet'}
              </span>
            </p>
            <p className="text-stone-300">
              <span className="text-stone-500">shed: </span>
              <span className="text-stone-100">
                {witness.residual.shed.length > 0 ? witness.residual.shed.join(', ') : 'none'}
              </span>
            </p>
          </>
        ) : (
          <p className="text-stone-500">no residual at this site</p>
        )}
      </div>

      {/* ABSTRACTION */}
      <div className="grid gap-1">
        <span className="text-xs text-stone-500">abstraction</span>
        <p className="text-stone-200">
          generation {witness.abstraction.generationDepth} · {witness.abstraction.preservedCount} kept ·{' '}
          {witness.abstraction.shedCount} shed
        </p>
      </div>

      {/* NAMED NEIGHBOURS */}
      <div className="grid gap-2">
        <span className="text-xs text-stone-500">named neighbours</span>
        {witness.adjacency.length === 0 ? (
          <p className="text-stone-500">no faces meet here</p>
        ) : (
          ADJACENCY_GROUPS.map(({ type, heading }) => {
            const faces = witness.adjacency.filter((face) => face.type === type);
            if (faces.length === 0) {
              return null;
            }
            return (
              <div key={type} className="grid gap-1">
                <span className="text-xs text-stone-500">{heading}</span>
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

      {/* SYMMETRY — the gem role, the merge */}
      <div className="grid gap-1">
        <span className="text-xs text-stone-500">symmetry</span>
        {witness.gemRoles.length === 0 ? (
          <p className="text-stone-500">no symmetry here</p>
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
                  in its {shapeWords(role.topology) ?? 'cell'}: {role.gemName.replace(/-/g, ' ')}
                </p>
                <ul className="grid gap-1">
                  {antipodal.map((axis, axisIndex) => {
                    const partner =
                      axis.members.filter((member) => member !== witness.label).join(', ') || 'none';
                    return (
                      <li key={`anti-${axisIndex}`} className="text-stone-200">
                        opposite: {partner}
                      </li>
                    );
                  })}
                  {[...otherCounts.entries()].map(([kind, count]) => (
                    <li key={`count-${kind}`} className="text-stone-200">
                      on {count} {kind} {count === 1 ? 'axis' : 'axes'}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
