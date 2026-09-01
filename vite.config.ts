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
const whereami: Plugin = {
  name: 'whereami',
  configureServer(server) {
    server.middlewares.use('/__whereami', (_req, res) => {
      const out = spawnSync('node', ['scripts/dev-advance.cjs', '--whereami-json'], {
        cwd: server.config.root,
        encoding: 'utf8',
      });
      res.setHeader('content-type', 'application/json');
      res.end(out.status === 0 ? out.stdout : JSON.stringify({ error: (out.stderr || 'whereami producer failed').slice(0, 300) }));
    });
  },
};

export default defineConfig({
  plugins: [react(), whereami],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
});
