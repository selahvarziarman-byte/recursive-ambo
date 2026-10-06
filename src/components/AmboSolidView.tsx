// ═══ THE SOLID VIEW — LAYOUT-1 §3 (STAMP LAYOUT-1, 2026-09-29; the designer's spec, Arman's word 19:31/19:51; the words COPY-1 §5).
// Left, THE MAKING COLUMN (about 11% of the width): the seed, apply with its status line, the lifts, reset — no ?; a disabled button's
// hint says what it waits for. Middle, THE SOLID, as wide as the page allows (Workspace3D: fit view · fit selected · reset camera at its
// top right, its ? at its top left, the counts one line at its foot). Right, A RAIL OF ICONS: each opens a DRAWER over the right edge
// of the solid — cells · selection · casts & names · save & history · view — holding today's instruments WHOLE (rule 1: the layout cuts
// no reading; anything folded away opens whole with one click). One drawer is open at a time; clicking its icon again, pressing Esc or
// clicking the solid closes it; the hint on an icon is the drawer's name (§6's table), and nothing else on the rail says anything.
// MARKER LAYOUT-1 · M12 (2) (the designer's 10:59, §278): the drawer opens BELOW the camera buttons' row and is fully opaque — the
// buttons stay pressable while it is open, and nothing shows through it.
// Esc closes the smallest thing first (§2): a ? note takes the key in the capture phase (HelpNote) before this view's listener sees it.
// A selected corner's cast drawing still opens over the solid, on its left (ConceptSurface, mounted by Workspace3D).
// A midpoint's row — in the selection drawer's parts, in casts & names — selects the vertex, and the page (App) opens the midpoint view.

import { useEffect, useState, type ReactNode } from 'react';
import { Hint } from './HelpNote';
import { MakingColumn, PacketsPanel, SaveAndHistoryPanel, SelectionPanel, ViewPanel, WorkspacePanel } from './Panels';
import { Workspace3D } from './Workspace3D';

export type DrawerKey = 'cells' | 'selection' | 'casts' | 'history' | 'view';

/** the rail, top to bottom — LAYOUT-1 §3's five drawers, each by its name */
export const DRAWERS: ReadonlyArray<{ key: DrawerKey; name: string }> = [
  { key: 'cells', name: 'cells' },
  { key: 'selection', name: 'selection' },
  { key: 'casts', name: 'casts & names' },
  { key: 'history', name: 'save & history' },
  { key: 'view', name: 'view' },
];

function drawerContent(key: DrawerKey): ReactNode {
  switch (key) {
    case 'cells':
      return <WorkspacePanel />;
    case 'selection':
      return <SelectionPanel />;
    case 'casts':
      return <PacketsPanel />;
    case 'history':
      return <SaveAndHistoryPanel />;
    case 'view':
      return <ViewPanel />;
  }
}

/** the rail's icons: plain signs, 16px, the current ink — the hint carries the name */
function RailIcon({ drawer }: { drawer: DrawerKey }) {
  const common = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (drawer) {
    case 'cells':
      return (
        <svg {...common}>
          <path d="M8 1.6 13.8 4.9v6.2L8 14.4 2.2 11.1V4.9z" />
          <path d="M8 8.2 13.8 4.9M8 8.2 2.2 4.9M8 8.2v6.2" />
        </svg>
      );
    case 'selection':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="4.2" />
          <path d="M8 1.5v2.6M8 11.9v2.6M1.5 8h2.6M11.9 8h2.6" />
        </svg>
      );
    case 'casts':
      return (
        <svg {...common}>
          <path d="M2 2h5.6l6.4 6.4-5.6 5.6L2 7.6z" />
          <circle cx="5.1" cy="5.1" r="1" />
        </svg>
      );
    case 'history':
      return (
        <svg {...common}>
          <circle cx="8" cy="8" r="6.2" />
          <path d="M8 4.2V8l2.6 1.7" />
        </svg>
      );
    case 'view':
      return (
        <svg {...common}>
          <path d="M1.5 8s2.4-4.4 6.5-4.4S14.5 8 14.5 8 12.1 12.4 8 12.4 1.5 8 1.5 8z" />
          <circle cx="8" cy="8" r="2" />
        </svg>
      );
  }
}

export function AmboSolidView() {
  const [drawer, setDrawer] = useState<DrawerKey | null>(null);
  const open = DRAWERS.find((d) => d.key === drawer) ?? null;

  // Esc closes the open drawer — after a ? note (HelpNote stops the key in the capture phase), before anything else on the page
  useEffect(() => {
    if (!drawer) return undefined;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setDrawer(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawer]);

  return (
    <main
      data-ambo-solid-view="true"
      data-ambo-drawer-open={open?.key}
      className="grid h-full min-h-0 grid-cols-[minmax(11rem,11%)_minmax(0,1fr)_2.75rem] overflow-hidden"
    >
      <aside className="min-h-0 overflow-y-auto border-r border-stone-800 bg-stone-950">
        <MakingColumn />
      </aside>

      {/* the solid — the drawer opens OVER its right edge, so the solid keeps its width and nothing re-flows */}
      <section
        className="relative min-h-0 overflow-hidden"
        onPointerDownCapture={(event) => {
          // clicking the solid closes the drawer: a pointer-down on the canvas itself, never on the chrome over it or on the drawer
          if (drawer && (event.target as HTMLElement | null)?.tagName === 'CANVAS') setDrawer(null);
        }}
      >
        <Workspace3D />
        {open ? (
          <aside
            data-ambo-drawer={open.key}
            aria-label={open.name}
            className="absolute bottom-0 right-0 top-14 z-20 w-[min(26rem,60%)] overflow-y-auto border-l border-t border-stone-800 bg-stone-950 shadow-xl"
          >
            <p data-ambo-drawer-name="true" className="px-4 pt-3 text-xs text-stone-500">{open.name}</p>
            {drawerContent(open.key)}
          </aside>
        ) : null}
      </section>

      <nav data-ambo-rail="true" aria-label="drawers" className="flex min-h-0 flex-col items-center gap-1 border-l border-stone-800 bg-stone-950 py-2">
        {DRAWERS.map((d) => (
          <Hint key={d.key} text={d.name} placement="left">
            <button
              type="button"
              aria-label={d.name}
              aria-pressed={drawer === d.key}
              data-ambo-rail-icon={d.key}
              onClick={() => setDrawer((current) => (current === d.key ? null : d.key))}
              className={`grid h-8 w-8 place-items-center rounded border transition focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                drawer === d.key
                  ? 'border-teal-400/60 bg-teal-400/15 text-teal-100'
                  : 'border-transparent text-stone-400 hover:border-stone-700 hover:bg-stone-900 hover:text-stone-100'
              }`}
            >
              <RailIcon drawer={d.key} />
            </button>
          </Hint>
        ))}
      </nav>
    </main>
  );
}
