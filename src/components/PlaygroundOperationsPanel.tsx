// PlaygroundOperationsPanel — G5.1: apply an operation to the selected form.
//
// Pure UI over the G5.1 registry + the committed store API: a FACE PICKER for
// the current form and the applicable operations (gated by each op's canApply —
// disabled with its reason, never thrown). Apply → the born form joins the
// Forms list (store `applyOperationToSelection`) and is selected. The born
// form's PROPER render (immersion + identification + field) is G5.2 — here it
// appears and selects.
//
// C4 — the interactive gluing-picker rides below the named presets: build an
// ARBITRARY edge pairing (pairs + preserve/reverse; unpaired edges stay free)
// with an HONEST dry-run preview (the committed trace's own χ/w₁ + the routed
// class), and pick WHICH boundary edges an assemble merges (canonical stays
// one-click). Pure UI over `customGluing` + the store — no engine.

import { useEffect, useState } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import {
  PLAYGROUND_OPERATIONS,
  canAssemblePair,
  getAssemblePairDisabledReason,
  type PlaygroundOperationContext,
} from '../playground/playgroundOperations';
import {
  describeFaceEdges,
  previewCustomGlue,
  validateAssembleEdges,
} from '../playground/customGluing';
import type { BoundaryPairing } from '../lib/surfaceOperations';

interface PairingRow {
  edgeA: string; // select values ('' = unset)
  edgeB: string;
  mode: 'preserving' | 'reversing';
}

export function PlaygroundOperationsPanel() {
  const forms = usePlaygroundStore((state) => state.forms);
  const formOrder = usePlaygroundStore((state) => state.formOrder);
  const currentFormId = usePlaygroundStore((state) => state.currentFormId);
  const selectedFaceId = usePlaygroundStore((state) => state.selectedFaceId);
  const selectFace = usePlaygroundStore((state) => state.selectFace);
  const applyOperationToSelection = usePlaygroundStore((state) => state.applyOperationToSelection);
  const applyCustomGlueToSelection = usePlaygroundStore((state) => state.applyCustomGlueToSelection);
  const applyAssembleToSelection = usePlaygroundStore((state) => state.applyAssembleToSelection);
  const selectForm = usePlaygroundStore((state) => state.selectForm);
  const [assembleWithId, setAssembleWithId] = useState<string>('');
  // C4 — the pairing editor's rows + the assemble edge choice (local UI state).
  const [pairingRows, setPairingRows] = useState<PairingRow[]>([]);
  const [assembleEdgeA, setAssembleEdgeA] = useState<string>('0');
  const [assembleEdgeB, setAssembleEdgeB] = useState<string>('0');
  const [assembleReversed, setAssembleReversed] = useState<boolean>(false);
  useEffect(() => {
    setPairingRows([]); // the editor speaks about ONE face — reset when it changes
  }, [selectedFaceId]);

  const currentForm = currentFormId ? forms[currentFormId] ?? null : null;
  if (!currentForm) return null;

  const shape = currentForm.shape;
  const selectedFace = shape.faces.find((face) => face.id === selectedFaceId) ?? null;
  const context: PlaygroundOperationContext = {
    form: shape,
    selectedFaceId: selectedFace ? selectedFace.id : null,
    selectedFace,
    // Q6 — whole-form ops (dual) may need the parent for quotient recovery
    parentShape: shape.genealogy.parentShapeId
      ? forms[shape.genealogy.parentShapeId]?.shape ?? null
      : null,
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

  // C4 — the custom pairing editor (the selected face's edge vocabulary + the
  // HONEST dry-run preview: the committed trace's own χ/w₁ + the routed class).
  const edgeLabels = selectedFace ? describeFaceEdges(selectedFace) : [];
  const maxPairs = Math.floor(edgeLabels.length / 2);
  const rowsComplete =
    pairingRows.length > 0 && pairingRows.every((row) => row.edgeA !== '' && row.edgeB !== '');
  const chosenPairings: BoundaryPairing[] = rowsComplete
    ? pairingRows.map((row) => ({ edgeA: Number(row.edgeA), edgeB: Number(row.edgeB), mode: row.mode }))
    : [];
  const gluePreview = !selectedFace
    ? { ok: false as const, reason: 'Select a face to glue.' }
    : !rowsComplete
      ? {
          ok: false as const,
          reason: pairingRows.length === 0 ? 'Add an edge pair to begin.' : 'Complete every pair row.',
        }
      : previewCustomGlue(shape, selectedFace, chosenPairings);
  const handleCustomGlue = () => {
    const born = applyCustomGlueToSelection(chosenPairings);
    selectForm(born.id);
  };
  const setRow = (index: number, patch: Partial<PairingRow>) => {
    setPairingRows((rows) => rows.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  // C4 — the assemble edge choice (which boundary edge of A ↔ which of B).
  const assembleChoice = {
    edgeA: Number(assembleEdgeA),
    edgeB: Number(assembleEdgeB),
    reversed: assembleReversed,
  };
  const assembleEdgeReason = assembleWith
    ? validateAssembleEdges(shape, assembleWith, assembleChoice)
    : 'Pick a second form to assemble with.';
  const handleCustomAssemble = () => {
    const child = applyAssembleToSelection(assembleWithId, assembleChoice);
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
          {/* C4 — pick WHICH boundary edges the merge identifies (canonical above stays one-click) */}
          {assembleWith && shape.faces[0] && assembleWith.faces[0] ? (
            <div className="mt-1 grid gap-1 border-t border-stone-900 pt-2">
              <span className="text-[11px] uppercase tracking-wide text-stone-500">
                Custom merge (edge of A ↔ edge of B)
              </span>
              <div className="flex items-center gap-1">
                <select
                  value={assembleEdgeA}
                  onChange={(event) => setAssembleEdgeA(event.target.value)}
                  className="min-w-0 flex-1 rounded border border-stone-800 bg-stone-900 px-1 py-1 font-mono text-[11px] text-stone-200 focus:border-teal-400 focus:outline-none"
                  aria-label="edge of A"
                >
                  {describeFaceEdges(shape.faces[0]).map((edge) => (
                    <option key={edge.index} value={edge.index}>
                      A e{edge.index}: {edge.from}→{edge.to}
                    </option>
                  ))}
                </select>
                <select
                  value={assembleEdgeB}
                  onChange={(event) => setAssembleEdgeB(event.target.value)}
                  className="min-w-0 flex-1 rounded border border-stone-800 bg-stone-900 px-1 py-1 font-mono text-[11px] text-stone-200 focus:border-teal-400 focus:outline-none"
                  aria-label="edge of B"
                >
                  {describeFaceEdges(assembleWith.faces[0]).map((edge) => (
                    <option key={edge.index} value={edge.index}>
                      B e{edge.index}: {edge.from}→{edge.to}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setAssembleReversed((r) => !r)}
                  className="rounded border border-stone-800 bg-stone-900 px-2 py-1 font-mono text-[11px] text-stone-300 hover:border-stone-600"
                  title="how the two edges' endpoints identify"
                >
                  {assembleReversed ? 'reversed' : 'parallel'}
                </button>
              </div>
              <button
                type="button"
                disabled={Boolean(assembleEdgeReason)}
                onClick={handleCustomAssemble}
                className={`w-full rounded border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  !assembleEdgeReason
                    ? 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-600 hover:bg-stone-800'
                    : 'cursor-not-allowed border-stone-900 bg-stone-950 text-stone-600'
                }`}
              >
                Assemble (custom merge)
              </button>
              {assembleEdgeReason ? (
                <span className="px-1 text-[11px] leading-snug text-stone-600">{assembleEdgeReason}</span>
              ) : null}
            </div>
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
        {/* C4 — the interactive gluing-picker: an ARBITRARY pairing on the selected
            face (the presets above stay as one-click shortcuts) */}
        <div className="grid gap-1 border-t border-stone-900 pt-2">
          <span className="text-[11px] uppercase tracking-wide text-stone-500">
            Glue (custom pairing)
          </span>
          {!selectedFace ? (
            <span className="px-1 text-[11px] leading-snug text-stone-600">
              Select a face (click it in the viewport) to build a pairing.
            </span>
          ) : (
            <>
              {pairingRows.map((row, index) => (
                <div key={index} className="flex items-center gap-1">
                  <select
                    value={row.edgeA}
                    onChange={(event) => setRow(index, { edgeA: event.target.value })}
                    className="min-w-0 flex-1 rounded border border-stone-800 bg-stone-900 px-1 py-1 font-mono text-[11px] text-stone-200 focus:border-teal-400 focus:outline-none"
                    aria-label={`pair ${index + 1} edge A`}
                  >
                    <option value="">edge A…</option>
                    {edgeLabels.map((edge) => (
                      <option key={edge.index} value={edge.index}>
                        e{edge.index}: {edge.from}→{edge.to}
                      </option>
                    ))}
                  </select>
                  <select
                    value={row.edgeB}
                    onChange={(event) => setRow(index, { edgeB: event.target.value })}
                    className="min-w-0 flex-1 rounded border border-stone-800 bg-stone-900 px-1 py-1 font-mono text-[11px] text-stone-200 focus:border-teal-400 focus:outline-none"
                    aria-label={`pair ${index + 1} edge B`}
                  >
                    <option value="">edge B…</option>
                    {edgeLabels.map((edge) => (
                      <option key={edge.index} value={edge.index}>
                        e{edge.index}: {edge.from}→{edge.to}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() =>
                      setRow(index, { mode: row.mode === 'preserving' ? 'reversing' : 'preserving' })
                    }
                    className="rounded border border-stone-800 bg-stone-900 px-2 py-1 font-mono text-[11px] text-stone-300 hover:border-stone-600"
                    title="preserve or reverse the seam orientation"
                  >
                    {row.mode === 'preserving' ? 'pres' : 'rev'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPairingRows((rows) => rows.filter((_r, i) => i !== index))}
                    className="rounded border border-stone-800 bg-stone-900 px-2 py-1 text-[11px] text-stone-400 hover:border-red-900 hover:text-red-300"
                    aria-label={`remove pair ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                disabled={pairingRows.length >= maxPairs}
                onClick={() =>
                  setPairingRows((rows) => [...rows, { edgeA: '', edgeB: '', mode: 'preserving' }])
                }
                className={`w-full rounded border px-2 py-1 text-left text-[11px] transition ${
                  pairingRows.length < maxPairs
                    ? 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-600'
                    : 'cursor-not-allowed border-stone-900 bg-stone-950 text-stone-700'
                }`}
              >
                + add edge pair ({pairingRows.length}/{maxPairs})
              </button>
              <span
                className={`px-1 font-mono text-[11px] leading-snug ${
                  gluePreview.ok ? 'text-teal-300' : 'text-stone-600'
                }`}
              >
                {gluePreview.ok
                  ? `χ=${gluePreview.preview.chi} w₁=${gluePreview.preview.w1} via ${gluePreview.preview.operation} → ${
                      gluePreview.preview.surface ?? 'unclassified (patch render)'
                    }${
                      gluePreview.preview.freeEdges > 0
                        ? ` · ${gluePreview.preview.freeEdges} free edge(s) — open`
                        : ''
                    }`
                  : gluePreview.reason}
              </span>
              <button
                type="button"
                disabled={!gluePreview.ok}
                onClick={handleCustomGlue}
                className={`w-full rounded border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
                  gluePreview.ok
                    ? 'border-teal-900 bg-stone-900 text-teal-200 hover:border-teal-600 hover:bg-stone-800'
                    : 'cursor-not-allowed border-stone-900 bg-stone-950 text-stone-600'
                }`}
              >
                Glue (custom)
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
