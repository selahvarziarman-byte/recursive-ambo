import {
  usePlaygroundStore,
  type PlaygroundForm,
} from '../store/playgroundStore';
import type { ShapeId } from '../types/geometry';
import { BornFormView } from './BornFormView';
import { PlaygroundInvokePanel } from './PlaygroundInvokePanel';
import { PlaygroundOperationsPanel } from './PlaygroundOperationsPanel';
import { PlaygroundViewport } from './PlaygroundViewport';

export function Playground() {
  const forms = usePlaygroundStore((state) => state.forms);
  const formOrder = usePlaygroundStore((state) => state.formOrder);
  const currentFormId = usePlaygroundStore((state) => state.currentFormId);
  const selectedVertexId = usePlaygroundStore((state) => state.selectedVertexId);
  const selectForm = usePlaygroundStore((state) => state.selectForm);
  const selectVertex = usePlaygroundStore((state) => state.selectVertex);
  const currentForm = currentFormId ? forms[currentFormId] ?? null : null;

  return (
    <main className="flex h-screen min-h-0 flex-col bg-neutral-950 text-stone-100">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-stone-800 px-4">
        <div>
          <h1 className="text-base font-semibold tracking-wide text-stone-100">Playground</h1>
          <p className="text-xs text-stone-500">Standalone multi-universe workspace</p>
        </div>
        <div className="font-mono text-xs text-stone-500">
          {formOrder.length} forms
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(0,1fr)_280px]">
        <aside className="min-h-0 overflow-y-auto border-r border-stone-800 bg-stone-950">
          <PlaygroundInvokePanel />
          <PlaygroundOperationsPanel />
          <div className="border-b border-stone-800 px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Forms
            </h2>
          </div>
          <div className="grid gap-2 p-3">
            {formOrder.map((formId) => {
              const form = forms[formId];

              return form ? (
                <FormListButton
                  key={formId}
                  formId={formId}
                  form={form}
                  isSelected={formId === currentFormId}
                  onSelect={selectForm}
                />
              ) : null;
            })}
          </div>
        </aside>

        <section className="relative min-h-0">
          {currentForm?.provenance.origin === 'operated' ? (
            // G5.2: a BORN form renders as the real surface its gluing word names
            // (immersion + identification + field), or the pre-quotient patch when
            // unclassified; the primitive viewport only if its parent left the store.
            <BornFormView
              born={currentForm.shape}
              parent={
                currentForm.shape.genealogy.parentShapeId
                  ? forms[currentForm.shape.genealogy.parentShapeId]?.shape ?? null
                  : null
              }
              fallback={
                <PlaygroundViewport
                  shape={currentForm.shape}
                  selectedVertexId={selectedVertexId}
                  onSelectVertex={selectVertex}
                />
              }
            />
          ) : (
            <PlaygroundViewport
              shape={currentForm?.shape ?? null}
              selectedVertexId={selectedVertexId}
              onSelectVertex={selectVertex}
            />
          )}
        </section>

        <aside className="min-h-0 border-l border-stone-800 bg-stone-950">
          <div className="border-b border-stone-800 px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              Inspector
            </h2>
          </div>
        </aside>
      </div>
    </main>
  );
}

function FormListButton({
  formId,
  form,
  isSelected,
  onSelect,
}: {
  formId: ShapeId;
  form: PlaygroundForm;
  isSelected: boolean;
  onSelect: (shapeId: ShapeId) => void;
}) {
  const { shape, provenance } = form;

  return (
    <button
      type="button"
      onClick={() => onSelect(formId)}
      className={`w-full rounded border px-3 py-2 text-left transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
        isSelected
          ? 'border-teal-300 bg-teal-400/10 text-teal-100'
          : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-600 hover:bg-stone-800'
      }`}
    >
      <span className="block truncate text-sm font-semibold">{shape.name}</span>
      <span className="mt-1 block truncate font-mono text-[11px] text-stone-500">
        {shape.id}
      </span>
      <span className="mt-2 flex items-center justify-between gap-2 text-xs text-stone-400">
        <span>{provenance.origin}</span>
        <span>{provenance.source ? `source ${provenance.source}` : 'source none'}</span>
      </span>
    </button>
  );
}
