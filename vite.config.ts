import { spawnSync } from 'node:child_process';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// /__whereami — the 1829/1849 cut's detection half: the server ANNOUNCES
// which checkout it serves, FRESH per request (a cached SHA is a stamp that
// drifts from the tree that made it). ONE producer: scripts/dev-advance.cjs
// carries the payload (and the witness drives it directly); this middleware
// only TRANSPORTS — the ESM config bundle cannot require a CJS module
// (measured: esbuild inlines the require and refuses at boot), so the
// producer is spawned per request instead. @types/node stays uninstalled;
// node-minimal.d.ts declares the one signature this file uses.
const spawnProducer = (root: string, arm: string): string | null => {
  const out = spawnSync('node', ['scripts/dev-advance.cjs', arm], { cwd: root, encoding: 'utf8' });
  return out.status === 0 ? out.stdout : null;
};

const whereami: Plugin = {
  name: 'whereami',
  configureServer(server) {
    server.middlewares.use('/__whereami', (_req, res) => {
      const body = spawnProducer(server.config.root, '--whereami-json');
      res.setHeader('content-type', 'application/json');
      res.end(body ?? JSON.stringify({ error: 'whereami producer failed' }));
    });
  },
};

// STAMP P-1 — THE GO-STALE MARK: the 1849 cut closed *never START stale*;
// this closes *never GO stale*. While the server runs, a watcher polls the
// ONE lag producer; when the served tree falls behind the wt/* line (or the
// lines diverge) the fact is PUSHED to the open page over vite's own HMR
// channel and drawn as DEV-SERVER CHROME — the same register as vite's
// "server connection lost" strip, never the app's page (if the mark is ever
// ruled to belong on the page's own design surface, the event below is the
// one producer her surface would consume). ⛔ MARK, NEVER MOVE (the P-1
// meaning ruling): no auto-advance — a fast-forward under a running session
// hot-reloads the page out from under a walk whose whole content is carried
// state (LAW 22). The strip is dismissible PER TIP: a click hides that tip's
// notice; a further commit re-marks — the person learns of every new state
// exactly once and a long deliberate walk is not nagged.
const LAG_POLL_MS = 20000;
const goStaleMark: Plugin = {
  name: 'go-stale-mark',
  apply: 'serve',
  configureServer(server) {
    let timer: ReturnType<typeof setInterval> | null = null;
    let lastSentTip: string | null = null;
    const poll = () => {
      const body = spawnProducer(server.config.root, '--lag-json');
      if (!body) return;
      let lag: { behind?: boolean; kind?: string; target?: { branch: string; tip: string }; branches?: string[]; head?: string } = {};
      try {
        lag = JSON.parse(body);
      } catch {
        return;
      }
      if (!lag.behind) {
        lastSentTip = null;
        return;
      }
      const tip = lag.target?.tip ?? (lag.branches ?? []).join(',');
      if (tip === lastSentTip) return; // one mark per new state — the walk is not nagged
      lastSentTip = tip;
      server.ws.send({ type: 'custom', event: 'serve-lag', data: lag });
      server.config.logger.warn(
        `[go-stale] the served tree is behind: ${lag.kind === 'behind' ? `${lag.target?.branch} at ${(lag.target?.tip ?? '').slice(0, 7)}` : `${lag.kind}: ${(lag.branches ?? []).join(', ')}`} — finish the walk, then restart npm run dev`,
      );
    };
    timer = setInterval(poll, LAG_POLL_MS);
    server.httpServer?.on('close', () => {
      if (timer) clearInterval(timer);
    });
  },
  transformIndexHtml() {
    // the listener + the strip — injected dev-chrome, zero app-code changes
    return [
      {
        tag: 'script',
        attrs: { type: 'module' },
        injectTo: 'body' as const,
        children: `
if (import.meta.hot) {
  import.meta.hot.on('serve-lag', (lag) => {
    const tip = (lag && lag.target && lag.target.tip) || (lag && lag.branches && lag.branches.join(',')) || 'unknown';
    try { if (sessionStorage.getItem('serve-lag-dismissed') === tip) return; } catch {}
    let strip = document.getElementById('serve-lag-strip');
    if (!strip) {
      strip = document.createElement('div');
      strip.id = 'serve-lag-strip';
      strip.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483646;background:#3b2f1e;color:#f5e9d0;font:12px/1.5 ui-monospace,monospace;padding:6px 12px;display:flex;gap:12px;align-items:center;border-bottom:1px solid #8a6d3b;';
      document.body.appendChild(strip);
    }
    const what = lag.kind === 'behind'
      ? 'the served tree is behind — ' + lag.target.branch + ' is at ' + lag.target.tip.slice(0, 7) + ', this serve is at ' + ((lag.head || '').slice(0, 7) || '?')
      : 'the wt line and this serve have ' + lag.kind + ' — ' + tip;
    strip.innerHTML = '';
    const text = document.createElement('span');
    text.textContent = what + ' · finish what you are doing, then restart npm run dev (the walk is never reloaded from here)';
    const dismiss = document.createElement('button');
    dismiss.textContent = 'seen';
    dismiss.style.cssText = 'margin-left:auto;background:none;border:1px solid #8a6d3b;color:inherit;font:inherit;padding:1px 8px;cursor:pointer;';
    dismiss.onclick = () => { try { sessionStorage.setItem('serve-lag-dismissed', tip); } catch {}; strip.remove(); };
    strip.appendChild(text);
    strip.appendChild(dismiss);
  });
}
`,
      },
    ];
  },
};

export default defineConfig({
  plugins: [react(), whereami, goStaleMark],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
