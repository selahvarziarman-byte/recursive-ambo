// AppShell — P1a: the production shell (ADR 0010 — the two REAL modules leave
// the dev-only `?`-flags and become the app itself).
//
// One app, one switcher: [ Ambo Universe ] ⇄ [ Manuscript ].
//
// THE MECHANISM (load-bearing): both modules stay MOUNTED and the shell toggles
// VISIBILITY (display:none on the inactive wrapper) — never a conditional
// unmount. The Manuscript's working set (written/born forms, the sources shelf,
// the selection/specimen) lives in LOCAL component state inside ManuscriptView,
// not in a store; an unmount would erase it on every toggle. Keep-both-mounted
// preserves each module's full state (local useState + the live R3F canvas and
// camera) with ZERO changes to module internals. The Ambo Universe's domain
// state lives in the geometryStore Zustand singleton and would survive a
// remount anyway; it rides the same mechanism for symmetry (and keeps its
// camera/view intact too).
//
// Costs, accepted for P1a (mothership-ratified): once the Manuscript is first
// visited, TWO live R3F contexts exist. The hidden module's wrapper is
// display:none, so its canvas is not composited (and collapses to a 0-size
// drawing buffer via the resize observer), but its frameloop still ticks;
// pausing it is a later perf refinement that would touch a module prop — out
// of scope here.
//
// The Manuscript is lazy-loaded (React.lazy — the manuscript/leva chunk stays
// split off the entry) and LATCHED once first shown: hasVisitedManuscript
// flips true on the first switch and never back, so the return trip is
// instant and state-preserving.
//
// ADDITIVE: the committed engine, App.tsx, ManuscriptView.tsx, both stores and
// all module internals are byte-unchanged — this file + the main.tsx default
// branch are the entire change set.

import React, { Suspense, useCallback, useState } from 'react';
import App from './App';

const ManuscriptView = React.lazy(() => import('./manuscript/ManuscriptView'));

type ShellModule = 'ambo' | 'manuscript';

const MODULES: Array<{ key: ShellModule; label: string }> = [
  { key: 'ambo', label: 'Ambo Universe' },
  { key: 'manuscript', label: 'Manuscript' },
];

// the modules keep their existing full-viewport layouts untouched: the shell
// contributes NO layout of its own — a visible wrapper is a plain block (the
// module inside owns the viewport), a hidden one is display:none.
const hiddenStyle: React.CSSProperties = { display: 'none' };

export default function AppShell() {
  // default = Ambo Universe (preserves today's actual production default)
  const [activeModule, setActiveModule] = useState<ShellModule>('ambo');
  // the keep-mounted latch: once the Manuscript has been shown, it stays mounted
  const [hasVisitedManuscript, setHasVisitedManuscript] = useState(false);

  const switchTo = useCallback((next: ShellModule) => {
    setActiveModule(next);
    if (next === 'manuscript') setHasVisitedManuscript(true);
  }, []);

  return (
    <>
      <div style={activeModule === 'ambo' ? undefined : hiddenStyle}>
        <App />
      </div>
      {hasVisitedManuscript ? (
        <div style={activeModule === 'manuscript' ? undefined : hiddenStyle}>
          <Suspense fallback={<ManuscriptOpening />}>
            <ManuscriptView />
          </Suspense>
        </div>
      ) : null}
      <ModuleSwitcher active={activeModule} onSwitch={switchTo} />
    </>
  );
}

// the switcher: a floating overlay (fixed, top-center, above both modules'
// chrome — manuscript menus sit at z 60, Leva near 999) so neither module's
// layout reflows. Buttons are native (keyboard-focusable) with aria-pressed
// carrying the active state.
function ModuleSwitcher({
  active,
  onSwitch,
}: {
  active: ShellModule;
  onSwitch: (next: ShellModule) => void;
}) {
  return (
    <nav
      aria-label="Module switcher"
      style={{
        position: 'fixed',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1200,
        display: 'flex',
        gap: 2,
        padding: 3,
        borderRadius: 999,
        background: 'rgba(15, 13, 12, 0.82)',
        border: '1px solid rgba(120, 113, 108, 0.45)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.35)',
        backdropFilter: 'blur(6px)',
      }}
    >
      {MODULES.map(({ key, label }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSwitch(key)}
            style={{
              appearance: 'none',
              border: 'none',
              borderRadius: 999,
              padding: '6px 14px',
              fontSize: 12,
              letterSpacing: '0.06em',
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              fontWeight: isActive ? 600 : 400,
              background: isActive ? 'rgba(231, 229, 228, 0.92)' : 'transparent',
              color: isActive ? '#1c1917' : 'rgba(231, 229, 228, 0.78)',
              cursor: isActive ? 'default' : 'pointer',
            }}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}

// shown only while the manuscript chunk itself is in flight (first visit);
// the manuscript then builds its world synchronously on first render.
function ManuscriptOpening() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: '#efe7d6',
        color: '#3a3326',
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: 14,
      }}
    >
      opening the manuscript…
    </div>
  );
}
