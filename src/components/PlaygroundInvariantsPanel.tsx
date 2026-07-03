// PlaygroundInvariantsPanel — E2: the selected form's topology at a glance.
//
// A compact READ-ONLY readout over the pure `readFormInvariants` selector —
// every number is the committed certifiers' own (explicit cells; `globalW1Class`
// via `analyzeGlobalW1`; the replay-verified recovery for quotient born forms).
// Where the closed classification does not apply (open surfaces, un-certified
// forms) it says so — "open / n-a" — rather than faking a genus.

import { useMemo } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { readFormInvariants } from '../playground/formInvariants';

export function PlaygroundInvariantsPanel() {
  const forms = usePlaygroundStore((state) => state.forms);
  const currentFormId = usePlaygroundStore((state) => state.currentFormId);
  const currentForm = currentFormId ? forms[currentFormId] ?? null : null;
  const parentShape = currentForm?.shape.genealogy.parentShapeId
    ? forms[currentForm.shape.genealogy.parentShapeId]?.shape ?? null
    : null;

  const readout = useMemo(
    () => (currentForm ? readFormInvariants(currentForm.shape, parentShape) : null),
    [currentForm, parentShape],
  );

  return (
    <div className="border-b border-stone-800">
      <div className="border-b border-stone-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Invariants
        </h2>
        <p className="mt-1 text-[11px] text-stone-600">read from the committed certifiers</p>
      </div>
      {!currentForm || !readout ? (
        <p className="px-4 py-3 text-xs text-stone-600">No form selected.</p>
      ) : (
        <dl className="grid gap-1.5 p-3 font-mono text-xs">
          <Row label="cells" value={`V ${readout.cells.v} · E ${readout.cells.e} · F ${readout.cells.f}`} />
          <Row
            label="χ"
            value={`${readout.chi}${
              readout.chiCertified !== null
                ? readout.chiCertified === readout.chi
                  ? ' (certified)'
                  : ` — CERTIFIER DISAGREES (${readout.chiCertified})`
                : ' (explicit cells only)'
            }`}
            accent={readout.chiCertified !== null && readout.chiCertified !== readout.chi ? 'alert' : undefined}
          />
          <Row
            label="w₁"
            value={
              readout.cert
                ? `${readout.cert.nonOrientable ? 'non-orientable' : 'orientable'} · class ${JSON.stringify(readout.cert.w1Class)}`
                : 'n-a'
            }
          />
          <Row label="b₁" value={readout.cert ? String(readout.cert.b1) : 'n-a'} />
          <Row label="boundary" value={readout.boundary ?? 'n-a'} />
          <Row
            label="class"
            value={readout.classification}
            accent={readout.classification.startsWith('genus') || readout.classification.startsWith('cross-caps') ? 'good' : undefined}
          />
          <Row
            label="source"
            value={
              readout.complexSource === 'direct'
                ? 'direct (bridge-translated cells)'
                : readout.complexSource === 'recovered'
                  ? 'recovered (replay-verified vs parent)'
                  : 'no faithful complex'
            }
          />
        </dl>
      )}
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: 'good' | 'alert' }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="shrink-0 text-stone-500">{label}</dt>
      <dd
        className={`min-w-0 break-words text-right ${
          accent === 'good' ? 'text-teal-300' : accent === 'alert' ? 'text-red-400' : 'text-stone-300'
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
