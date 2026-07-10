import React from 'react';
import ReactDOM from 'react-dom/client';
import AppShell from './AppShell';
import { DirectorFieldRenderV0 } from './components/DirectorFieldRenderV0';
import { Playground } from './components/Playground';
import { WitnessRenderV0 } from './components/WitnessRenderV0';
import './styles.css';

// dev-only mount (ADR 0017, M1b). `import.meta.env.DEV` makes these branches DEAD in a production
// build (Vite folds it to `false`), so the default path always renders the production shell —
// P1a (ADR 0010): AppShell = the two REAL modules behind one [ Ambo Universe ] ⇄ [ Manuscript ]
// switcher (keep-both-mounted visibility toggle; default = Ambo Universe, the prior prod default).
// Workspace3D's render path is untouched. Routes:
//   (default, no flag)          → AppShell: Ambo Universe ⇄ Manuscript (production)
//   ?playground                 → the standalone playground shell (dev)
//   ?design                     → the designer instrument workbench (Leva/perf; lazy-loaded, dev-tooling)
//   ?manuscript                 → the standalone inked-manuscript view (dev; lazy-loaded)
//   ?field   or   ?witness       → the living director-field render (n = R(α)·n₀) — P-FIELD folds it into the specimen
//   ?witness&debug               → the WitnessRenderV0 glyph, DEMOTED to an off-by-default debug overlay
const params =
  typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const dev = import.meta.env.DEV;
const showPlayground = dev && params.has('playground');
const showDesign = dev && params.has('design');
const showManuscript = dev && params.has('manuscript');
const showGlyphDebug = dev && params.has('witness') && params.has('debug');
const showField = dev && !showGlyphDebug && (params.has('field') || params.has('witness'));

// lazy AND dev-gated at the import expression: with `dev` folded to false in a
// production build the dynamic import is unreachable, so the workbench chunk
// (leva / r3f-perf) is not even emitted — strictly dead in prod.
const DesignWorkbench = dev ? React.lazy(() => import('./design/DesignWorkbench')) : null;
const ManuscriptView = dev ? React.lazy(() => import('./manuscript/ManuscriptView')) : null;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {showDesign && DesignWorkbench ? (
      <React.Suspense fallback={null}>
        <DesignWorkbench />
      </React.Suspense>
    ) : showManuscript && ManuscriptView ? (
      <React.Suspense fallback={null}>
        <ManuscriptView />
      </React.Suspense>
    ) : showPlayground ? (
      <Playground />
    ) : showGlyphDebug ? (
      <WitnessRenderV0 />
    ) : showField ? (
      <DirectorFieldRenderV0 />
    ) : (
      <AppShell />
    )}
  </React.StrictMode>,
);
