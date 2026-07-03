// PlaygroundOperationsPanel — G5.1: apply an operation to the selected form.
//
// Pure UI over the G5.1 registry + the committed store API: a FACE PICKER for
// the current form and the applicable operations (gated by each op's canApply —
// disabled with its reason, never thrown). Apply → the born form joins the
// Forms list (store `applyOperationToSelection`) and is selected. The born
// form's PROPER render (immersion + identification + field) is G5.2 — here it
// appears and selects.

import { useState } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import {
  PLAYGROUND_OPERATIONS,
  canAssemblePair,
  getAssemblePairDisabledReason,
  type PlaygroundOperationContext,
} from '../playground/playgroundOperations';

export function PlaygroundOperationsPanel() {
  const forms = usePlaygroundStore((state) => state.forms);
  const formOrder = usePlaygroundStore((state) => state.formOrder);
  const currentFormId = usePlaygroundStore((state) => state.currentFormId);
  const selectedFaceId = usePlaygroundStore((state) => state.selectedFaceId);
  const selectFace = usePlaygroundStore((state) => state.selectFace);
  const applyOperationToSelection = usePlaygroundStore((state) => state.applyOperationToSelection);
  const applyAssembleToSelection = usePlaygroundStore((state) => state.applyAssembleToSelection);
  const selectForm = usePlaygroundStore((state) => state.selectForm);
  const [assembleWithId, setAssembleWithId] = useState<string>('');

  const currentForm = currentFormId ? forms[currentFormId] ?? null : null;
  if (!currentForm) return null;

  const shape = currentForm.shape;
  const selectedFace = shape.faces.find((face) => face.id === selectedFaceId) ?? null;
  const context: PlaygroundOperationContext = {
    form: shape,
    selectedFaceId: selectedFace ? selectedFace.id : null,
    selectedFace,
  };

  const handleApply = (operationId: string) => {
    const born = applyOperationToSelection(operationId);
    selectForm(born.id);
  };

  // G3 — the arity-2 birth: current form (A) + a picked second form (B).
  const assembleWith = assembleWithId ? forms[assembleWithId]?.shape ?? null : null;
  const assembleApplicable = canAssemblePair(shape, assembleWith);
  const assembleReason = assembleApplicable ? null : getAssemblePairDisabledReason(shape, assembleWith);
  const handleAssemble = () => {
    const child = applyAssembleToSelection(assembleWithId);
    selectForm(child.id);
  };

  return (
    <div className="border-b border-stone-800">
      <div className="border-b border-stone-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Operations
        </h2>
      </div>
      <div className="grid gap-2 p-3">
        <label className="grid gap-1">
          <span className="text-[11px] uppercase tracking-wide text-stone-500">Target face</span>
          <select
            value={selectedFaceId ?? ''}
            onChange={(event) => selectFace(event.target.value || null)}
            className="w-full rounded border border-stone-800 bg-stone-900 px-2 py-1.5 font-mono text-xs text-stone-200 focus:border-teal-400 focus:outline-none"
          >
            <option value="">— none —</option>
            {shape.faces.map((face) => (
              <option key={face.id} value={face.id}>
                {face.id} ({face.vertexIds.length}-gon)
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 border-t border-stone-900 pt-2">
          <span className="text-[11px] uppercase tracking-wide text-stone-500">
            Assemble with (form B)
          </span>
          <select
            value={assembleWithId}
            onChange={(event) => setAssembleWithId(event.target.value)}
            className="w-full rounded border border-stone-800 bg-stone-900 px-2 py-1.5 font-mono text-xs text-stone-200 focus:border-teal-400 focus:outline-none"
          >
            <option value="">— none —</option>
            {formOrder
              .filter((id) => id !== currentFormId)
              .map((id) => (
                <option key={id} value={id}>
                  {forms[id]?.shape.name} ({id})
                </option>
              ))}
          </select>
        </label>
        <div className="grid gap-1">
          <button
            type="button"
            disabled={!assembleApplicable}
            onClick={handleAssemble}
            className={`w-full rounded border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
              assembleApplicable
                ? 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-600 hover:bg-stone-800'
                : 'cursor-not-allowed border-stone-900 bg-stone-950 text-stone-600'
            }`}
          >
            Assemble (arity-2 birth)
          </button>
          {assembleReason ? (
            <span className="px-1 text-[11px] leading-snug text-stone-600">{assembleReason}</span>
          ) : null}
        </div>
        {PLAYGROUND_OPERATIONS.map((operation) => {
          const applicable = operation.canApply(context);
          const reason = applicable ? null : operation.getDisabledReason(context);

          return (
            <div key={operation.id} className="grid gap-1">
              <button
                type="button"
                disabled={!applicable}
                onClick={() => handleApply(operation.id)}
                className={`w-full rounded border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  applicable
                    ? 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-600 hover:bg-stone-800'
                    : 'cursor-not-allowed border-stone-900 bg-stone-950 text-stone-600'
                }`}
              >
                {operation.label}
              </button>
              {reason ? (
                <span className="px-1 text-[11px] leading-snug text-stone-600">{reason}</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
