import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WitnessRenderV0 } from './components/WitnessRenderV0';
import './styles.css';

// dev-only mount: under `npm run dev`, the `?witness` query renders the standalone Engine→UI
// witness view (the known w₁=1 seam) instead of the app shell, so it can be viewed/
// screenshotted in isolation. `import.meta.env.DEV` makes the branch DEAD in a production
// build (Vite folds it to `false`), so the default path always renders the unchanged App —
// Workspace3D's render path is untouched.
const showWitness =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).has('witness');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>{showWitness ? <WitnessRenderV0 /> : <App />}</React.StrictMode>,
);
