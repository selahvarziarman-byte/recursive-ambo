import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DirectorFieldRenderV0 } from './components/DirectorFieldRenderV0';
import { WitnessRenderV0 } from './components/WitnessRenderV0';
import './styles.css';

// dev-only mount (ADR 0017, M1b). `import.meta.env.DEV` makes these branches DEAD in a production
// build (Vite folds it to `false`), so the default path always renders the unchanged App —
// Workspace3D's render path is untouched. Routes:
//   ?field   or   ?witness       → the living director-field render (n = R(α)·n₀) — the product visual
//   ?witness&debug               → the WitnessRenderV0 glyph, DEMOTED to an off-by-default debug overlay
const params =
  typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const dev = import.meta.env.DEV;
const showGlyphDebug = dev && params.has('witness') && params.has('debug');
const showField = dev && !showGlyphDebug && (params.has('field') || params.has('witness'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {showGlyphDebug ? <WitnessRenderV0 /> : showField ? <DirectorFieldRenderV0 /> : <App />}
  </React.StrictMode>,
);
