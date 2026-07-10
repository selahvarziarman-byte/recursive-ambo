// AppShell — P1a: the production shell (ADR 0010 — the two REAL modules leave
// the dev-only `?`-flags and become the app itself), P1a-craft: one REAL
// header instead of two dev prompt-headers.
//
// One app, one bar, one toggle: `Platonic Engine` + [ Ambo Universe ⇄ Manuscript ].
// The bar is the only title anywhere — both modules ship header-less (their
// old dev headers were prompt scaffolding, removed under the P1a-craft
// authorization); the section is named ONLY by the toggle. Switching
// CROSS-FADES the two wrappers.
//
// THE MECHANISM (load-bearing, unchanged from P1a): both modules stay MOUNTED
// and the shell toggles visibility — never a conditional unmount. The
// Manuscript's working set (written/born forms, the sources shelf, the
// selection/specimen) lives in LOCAL component state inside ManuscriptView,
// not in a store; an unmount would erase it on every toggle. Keep-both-mounted
// preserves each module's full state (local useState + the live R3F canvas and
// camera) with zero changes to module logic. The Ambo Universe's domain state
// lives in the geometryStore Zustand singleton and rides the same mechanism.
// The crossfade is pure opacity over the kept-mounted wrappers; after it
// settles, the hidden wrapper goes visibility:hidden (not painted, still
// mounted, no resize churn).
//
// Costs, accepted for P1a (mothership-ratified): once the Manuscript is first
// visited, TWO live R3F contexts exist; pausing the hidden module's frameloop
// would touch a module prop — a later perf refinement, out of scope here.
//
// The Manuscript is lazy-loaded (React.lazy — the manuscript/leva chunk stays
// split off the entry) and LATCHED once first shown, so the return trip is
// instant and state-preserving.

import React, { Suspense, useCallback, useEffect, useState } from 'react';
import App from './App';

const ManuscriptView = React.lazy(() => import('./manuscript/ManuscriptView'));

type ShellModule = 'ambo' | 'manuscript';

const MODULES: Array<{ key: ShellModule; label: string }> = [
  { key: 'ambo', label: 'Ambo Universe' },
  { key: 'manuscript', label: 'Manuscript' },
];

// ---------------------------------------------------------------------------
// the craft surface — every dialable value of the shell's look, in one place
// (paper idiom: the bar reads like the manuscript's sheet, the active segment
// is a raised paper card with an indigo underline)
// ---------------------------------------------------------------------------
const SHELL_CRAFT = {
  barHeight: 52, // px — the shared header bar
  paperBackground: '#efe7d6', // the bar's paper tone (the manuscript sheet family)
  paperEdge: 'rgba(58, 51, 38, 0.30)', // the bar's bottom rule + card borders
  ink: '#2b2620', // the title / active-segment ink
  faintInk: 'rgba(43, 38, 32, 0.55)', // inactive segments, the ⇄, the hint
  raisedCard: '#f8f2e4', // the active segment's raised paper card
  indigo: '#3949ab', // the active underline
  crossfadeMs: 260, // the switch crossfade duration
  crossfadeEase: 'ease', // its easing
  serif: 'Georgia, "Times New Roman", serif',
};

export default function AppShell() {
  // default = Ambo Universe (preserves today's actual production default)
  const [activeModule, setActiveModule] = useState<ShellModule>('ambo');
  // the keep-mounted latch: once the Manuscript has been shown, it stays mounted
  const [hasVisitedManuscript, setHasVisitedManuscript] = useState(false);
  // the settled module: tracks activeModule AFTER the crossfade completes, so
  // the outgoing wrapper keeps painting while it fades and only then hides
  const [settledModule, setSettledModule] = useState<ShellModule>('ambo');

  useEffect(() => {
    if (settledModule === activeModule) return undefined;
    const timer = setTimeout(() => setSettledModule(activeModule), SHELL_CRAFT.crossfadeMs);
    return () => clearTimeout(timer);
  }, [activeModule, settledModule]);

  const switchTo = useCallback((next: ShellModule) => {
    setActiveModule(next);
    if (next === 'manuscript') setHasVisitedManuscript(true);
  }, []);

  // a module wrapper: absolute over the content area, crossfaded by opacity;
  // once fully faded out (settled elsewhere) it stops painting — still mounted.
  const wrapperStyle = (module: ShellModule): React.CSSProperties => {
    const isActive = activeModule === module;
    const fullyHidden = !isActive && settledModule !== module;
    return {
      position: 'absolute',
      inset: 0,
      opacity: isActive ? 1 : 0,
      transition: `opacity ${SHELL_CRAFT.crossfadeMs}ms ${SHELL_CRAFT.crossfadeEase}`,
      visibility: fullyHidden ? 'hidden' : 'visible',
      pointerEvents: isActive ? 'auto' : 'none',
      zIndex: isActive ? 1 : 0,
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <ShellBar active={activeModule} onSwitch={switchTo} />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <div style={wrapperStyle('ambo')}>
          <App />
        </div>
        {hasVisitedManuscript ? (
          <div style={wrapperStyle('manuscript')}>
            <Suspense fallback={<ManuscriptOpening />}>
              <ManuscriptView />
            </Suspense>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// the ONE header: `Platonic Engine` in serif ink · the segmented toggle
// (active = raised paper card + indigo underline; inactive = faint, flat;
// a small ⇄ between) · a faint `state persists` hint. Native buttons with
// aria-pressed carry the active state (keyboard-focusable).
function ShellBar({
  active,
  onSwitch,
}: {
  active: ShellModule;
  onSwitch: (next: ShellModule) => void;
}) {
  const c = SHELL_CRAFT;
  return (
    <header
      style={{
        position: 'relative',
        height: c.barHeight,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '0 18px',
        background: c.paperBackground,
        borderBottom: `1px solid ${c.paperEdge}`,
        fontFamily: c.serif,
        zIndex: 5,
      }}
    >
      <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: 0.3, color: c.ink }}>
        Platonic Engine
      </div>

      <nav
        aria-label="Module switcher"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        {MODULES.map(({ key, label }, index) => {
          const isActive = key === active;
          return (
            <React.Fragment key={key}>
              {index > 0 ? (
                <span aria-hidden="true" style={{ color: c.faintInk, fontSize: 13 }}>
                  ⇄
                </span>
              ) : null}
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onSwitch(key)}
                style={{
                  appearance: 'none',
                  fontFamily: c.serif,
                  fontSize: 13.5,
                  padding: '5px 13px 4px',
                  borderRadius: 3,
                  cursor: isActive ? 'default' : 'pointer',
                  color: isActive ? c.ink : c.faintInk,
                  fontWeight: isActive ? 700 : 400,
                  background: isActive ? c.raisedCard : 'transparent',
                  border: isActive ? `1px solid ${c.paperEdge}` : '1px solid transparent',
                  borderBottom: isActive
                    ? `2px solid ${c.indigo}`
                    : '2px solid transparent',
                  boxShadow: isActive ? '0 1px 4px rgba(58, 51, 38, 0.18)' : 'none',
                }}
              >
                {label}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      <div
        style={{
          marginLeft: 'auto',
          fontSize: 11.5,
          fontStyle: 'italic',
          color: c.faintInk,
        }}
      >
        state persists
      </div>
    </header>
  );
}

// shown only while the manuscript chunk itself is in flight (first visit);
// the manuscript then builds its world synchronously on first render.
function ManuscriptOpening() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        background: SHELL_CRAFT.paperBackground,
        color: SHELL_CRAFT.ink,
        fontFamily: SHELL_CRAFT.serif,
        fontSize: 14,
      }}
    >
      opening the manuscript…
    </div>
  );
}
