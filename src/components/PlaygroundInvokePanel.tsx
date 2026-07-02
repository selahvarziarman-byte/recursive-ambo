// PlaygroundInvokePanel — G1: invoke a bare primitive from the catalogue into the
// standalone playground. Pure UI over the COMMITTED G0 store API (`invokeForm` +
// `selectForm`) and the G1 catalogue; no engine math, no store changes.

import { useState } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { PRIMITIVE_CATALOGUE, type PrimitiveCatalogueEntry } from '../playground/primitiveCatalogue';

export function PlaygroundInvokePanel() {
  const invokeForm = usePlaygroundStore((state) => state.invokeForm);
  const selectForm = usePlaygroundStore((state) => state.selectForm);
  const [source, setSource] = useState('');

  const handleInvoke = (entry: PrimitiveCatalogueEntry) => {
    const shape = invokeForm(entry.build, source.trim() || null);
    selectForm(shape.id);
  };

  return (
    <div className="border-b border-stone-800">
      <div className="border-b border-stone-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Invoke
        </h2>
      </div>
      <div className="grid gap-2 p-3">
        <label className="grid gap-1">
          <span className="text-[11px] uppercase tracking-wide text-stone-500">
            Source (optional)
          </span>
          <input
            type="text"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder="e.g. u1"
            className="w-full rounded border border-stone-800 bg-stone-900 px-2 py-1.5 font-mono text-xs text-stone-200 placeholder:text-stone-600 focus:border-teal-400 focus:outline-none"
          />
        </label>
        {PRIMITIVE_CATALOGUE.map((entry) => (
          <button
            key={entry.key}
            type="button"
            onClick={() => handleInvoke(entry)}
            className="w-full rounded border border-stone-800 bg-stone-900 px-3 py-2 text-left text-sm text-stone-300 transition hover:border-stone-600 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {entry.label}
          </button>
        ))}
      </div>
    </div>
  );
}
