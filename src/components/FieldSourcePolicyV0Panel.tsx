import type { Shape } from '../types/geometry';

const STRUCTURAL_COMPLEMENT_AXES = ['AB ↔ CD', 'AC ↔ BD', 'AD ↔ BC'] as const;

interface FieldSourcePolicyV0PanelProps {
  shape: Shape;
}

export function FieldSourcePolicyV0Panel({
  shape,
}: FieldSourcePolicyV0PanelProps) {
  const outsideProvingEvent = !isFieldSourcePolicyV0ProvingEvent(shape);

  return (
    <section
      className="rounded border border-stone-800 bg-stone-950/80 px-3 py-3 text-xs text-stone-300"
      aria-label="Field / Source Policy V0"
    >
      <header>
        <h2 className="text-sm font-semibold text-stone-100">
          Field / Source Policy V0
        </h2>
      </header>

      <div className="mt-3 grid gap-3">
        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Current proving event
          </h3>
          <dl className="mt-2 grid grid-cols-3 gap-2">
            <div className="rounded border border-stone-800 bg-stone-950 px-2 py-1">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-stone-500">
                Current seed key
              </dt>
              <dd className="mt-1 font-mono text-[11px] text-stone-200">
                {shape.seedKey ?? 'unknown'}
              </dd>
            </div>
            <div className="rounded border border-stone-800 bg-stone-950 px-2 py-1">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-stone-500">
                Current operation
              </dt>
              <dd className="mt-1 font-mono text-[11px] text-stone-200">
                {shape.genealogy.operation}
              </dd>
            </div>
            <div className="rounded border border-stone-800 bg-stone-950 px-2 py-1">
              <dt className="text-[10px] uppercase tracking-[0.14em] text-stone-500">
                Current generation depth
              </dt>
              <dd className="mt-1 font-mono text-[11px] text-stone-200">
                {shape.genealogy.generationDepth}
              </dd>
            </div>
          </dl>
          {outsideProvingEvent ? (
            <p className="mt-2 leading-5 text-amber-100">
              Current workspace is outside the Field / Source Policy V0 proving
              event.
            </p>
          ) : null}
          <ul className="mt-1 grid gap-1 leading-5">
            <li>Tetrahedron seed</li>
            <li>One Ambo dissection</li>
            <li>Generation depth 1</li>
            <li>Six generated midpoint children</li>
          </ul>
          <p className="mt-2 leading-5 text-stone-400">
            Three complement axes:
          </p>
          <ul className="mt-1 grid gap-1 font-mono text-[11px] leading-5 text-stone-200">
            {STRUCTURAL_COMPLEMENT_AXES.map((axis) => (
              <li key={axis}>{axis}</li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Source policy
          </h3>
          <ul className="mt-1 grid gap-1 leading-5">
            <li>Structured source state uses two projections.</li>
            <li>
              Propagation projection: amplitude, wave number, phase,
              attenuation.
            </li>
            <li>
              Structural projection: edge state, complement edge, antipodal
              child, axis pair, relation visibility.
            </li>
            <li>
              The emitted tuple is only the propagation-facing projection, not
              the full source state.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Field policy
          </h3>
          <ul className="mt-1 grid gap-1 leading-5">
            <li>The current field layer is diagnostic/prototype-only.</li>
            <li>
              Raw field behavior did not recover structural relations by
              itself.
            </li>
            <li>
              Structural relations are available only through the declared
              structural source-state projection.
            </li>
            <li>
              Route/gate/support/region data remains internal candidate
              diagnostics.
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500">
            Product boundary
          </h3>
          <ul className="mt-1 grid gap-1 leading-5">
            <li>This panel states the current field/source configuration.</li>
            <li>It does not assign generated-site interpretations.</li>
            <li>Manual labels and packets remain user-authored.</li>
            <li>Field topology is not being displayed as product structure.</li>
            <li>Next product task: First-Stone Field Statement.</li>
          </ul>
        </section>
      </div>
    </section>
  );
}

function isFieldSourcePolicyV0ProvingEvent(shape: Shape): boolean {
  return (
    shape.seedKey === 'tetrahedron' &&
    shape.genealogy.operation === 'ambo-dissection' &&
    shape.genealogy.generationDepth === 1
  );
}
