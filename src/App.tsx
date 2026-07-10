import {
  OperationControls,
  RightSidebar,
  SeedSelector,
} from './components/Panels';
import { Workspace3D } from './components/Workspace3D';

export default function App() {
  return (
    // P1a-craft: header-less module — the shared shell bar carries the title;
    // App fills its container (the shell's content area).
    <div className="h-full overflow-hidden bg-stone-950 text-stone-100">
      <main className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(10rem,auto)_minmax(20rem,1fr)_minmax(12rem,auto)] overflow-hidden lg:grid-cols-[minmax(240px,280px)_minmax(520px,1fr)_minmax(320px,360px)] lg:grid-rows-1">
        <aside className="min-h-0 overflow-y-auto border-b border-stone-800 bg-stone-950 lg:border-b-0 lg:border-r">
          <SeedSelector />
          <OperationControls />
        </aside>

        <section className="min-h-0 overflow-hidden">
          <Workspace3D />
        </section>

        <aside className="min-h-0 overflow-hidden border-t border-stone-800 bg-stone-950 lg:border-l lg:border-t-0">
          <RightSidebar />
        </aside>
      </main>
    </div>
  );
}
