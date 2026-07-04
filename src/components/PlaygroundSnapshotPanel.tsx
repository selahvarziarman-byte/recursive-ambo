// PlaygroundSnapshotPanel — E1 (mothership G2): save/load self-contained snapshots.
//
// Save: the selected form → a self-contained `.json` snapshot (downloaded AND
// kept in the in-app list). Load: import a `.json` file or pick from the list —
// optionally under a NEW source name — and the form joins the playground
// source-namespaced (`origin:'loaded'`), distinct from every other universe's
// copy (co-location ≠ identity; the pure `snapshot` module owns the mechanics).
// Errors surface inline (a bad file never throws at the UI).

import { useRef, useState } from 'react';
import { usePlaygroundStore } from '../store/playgroundStore';
import { SNAPSHOT_VERSION, type PlaygroundSnapshotFile } from '../playground/snapshot';

export function PlaygroundSnapshotPanel() {
  const currentFormId = usePlaygroundStore((state) => state.currentFormId);
  const forms = usePlaygroundStore((state) => state.forms);
  const snapshots = usePlaygroundStore((state) => state.snapshots);
  const saveFormAsSnapshot = usePlaygroundStore((state) => state.saveFormAsSnapshot);
  const loadSnapshot = usePlaygroundStore((state) => state.loadSnapshot);
  const selectForm = usePlaygroundStore((state) => state.selectForm);
  const [loadAs, setLoadAs] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentForm = currentFormId ? forms[currentFormId] ?? null : null;

  const handleSave = () => {
    if (!currentFormId) return;
    try {
      const file = saveFormAsSnapshot(currentFormId);
      const blob = new Blob([JSON.stringify(file, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `snapshot-${file.sourceId}-${file.shape.name}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage(`saved "${file.shape.name}" (source ${file.sourceId})`);
    } catch (error) {
      setMessage(`save failed: ${(error as Error).message}`);
    }
  };

  const handleLoad = (file: PlaygroundSnapshotFile) => {
    try {
      const shape = loadSnapshot(file, loadAs.trim() || undefined);
      selectForm(shape.id);
      setMessage(`loaded "${shape.name}" as source ${loadAs.trim() || file.sourceId}`);
    } catch (error) {
      setMessage(`load failed: ${(error as Error).message}`);
    }
  };

  const handleFile = (input: HTMLInputElement) => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        handleLoad(JSON.parse(String(reader.result)) as PlaygroundSnapshotFile);
      } catch (error) {
        setMessage(`load failed: ${(error as Error).message}`);
      }
    };
    reader.onerror = () => setMessage('load failed: the file could not be read');
    reader.readAsText(file);
    input.value = ''; // allow re-importing the same file
  };

  return (
    <div className="border-b border-stone-800">
      <div className="border-b border-stone-800 px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          Snapshots
        </h2>
        <p className="mt-1 text-[11px] text-stone-600">
          self-contained · the source is a name, not a doorway (v{SNAPSHOT_VERSION})
        </p>
      </div>
      <div className="grid gap-2 p-3">
        <button
          type="button"
          disabled={!currentForm}
          onClick={handleSave}
          className={`w-full rounded border px-3 py-2 text-left text-sm transition focus:outline-none focus:ring-2 focus:ring-teal-400 ${
            currentForm
              ? 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-600 hover:bg-stone-800'
              : 'cursor-not-allowed border-stone-900 bg-stone-950 text-stone-600'
          }`}
        >
          Save selected form (.json + list)
        </button>
        <label className="grid gap-1">
          <span className="text-[11px] uppercase tracking-wide text-stone-500">
            Load as source (optional)
          </span>
          <input
            value={loadAs}
            onChange={(event) => setLoadAs(event.target.value)}
            placeholder="e.g. u2 — empty = the snapshot's own"
            className="w-full rounded border border-stone-800 bg-stone-900 px-2 py-1.5 font-mono text-xs text-stone-200 placeholder:text-stone-600 focus:border-teal-400 focus:outline-none"
          />
        </label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full rounded border border-stone-800 bg-stone-900 px-3 py-2 text-left text-sm text-stone-300 transition hover:border-stone-600 hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Load snapshot file (.json)…
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => handleFile(event.currentTarget)}
        />
        {message ? (
          <p className="px-1 font-mono text-[11px] leading-snug text-stone-500">{message}</p>
        ) : null}
        {snapshots.length > 0 ? (
          <div className="grid gap-1 border-t border-stone-900 pt-2">
            <span className="text-[11px] uppercase tracking-wide text-stone-500">In-app list</span>
            {snapshots.map((file, index) => (
              <div key={`${file.savedAt}-${index}`} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-stone-400">
                  {file.shape.name} · {file.sourceId}
                </span>
                <button
                  type="button"
                  onClick={() => handleLoad(file)}
                  className="rounded border border-stone-800 bg-stone-900 px-2 py-1 text-[11px] text-stone-300 hover:border-teal-700 hover:text-teal-200"
                >
                  load
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
