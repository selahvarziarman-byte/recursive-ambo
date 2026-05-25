import {
  GenealogyViewer,
  ObjectInspector,
  OperationControls,
  SeedSelector,
  VertexDataPacketEditor,
} from './components/Panels';
import { Workspace3D } from './components/Workspace3D';

export default function App() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      <header className="flex h-14 items-center justify-between border-b border-stone-800 bg-neutral-950 px-4">
        <div>
          <h1 className="text-sm font-semibold tracking-wide text-stone-100">Platonic Engine</h1>
          <p className="text-xs text-stone-500">Recursive ambo-dissection prototype</p>
        </div>
      </header>

      <main className="grid min-h-[calc(100vh-3.5rem)] grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
        <aside className="border-b border-stone-800 bg-stone-950 lg:border-b-0 lg:border-r">
          <SeedSelector />
          <OperationControls />
        </aside>

        <section className="min-h-[440px]">
          <Workspace3D />
        </section>

        <aside className="border-t border-stone-800 bg-stone-950 lg:border-l lg:border-t-0">
          <ObjectInspector />
          <GenealogyViewer />
          <VertexDataPacketEditor />
        </aside>
      </main>
    </div>
  );
}
