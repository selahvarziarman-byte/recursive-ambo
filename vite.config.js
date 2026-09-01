import { spawnSync } from 'node:child_process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// /__whereami — the 1829/1849 cut's detection half: the server ANNOUNCES
// which checkout it serves, FRESH per request (a cached SHA is a stamp that
// drifts from the tree that made it). ONE producer: scripts/dev-advance.cjs
// carries the payload (and the witness drives it directly); this middleware
// only TRANSPORTS — the ESM config bundle cannot require a CJS module
// (measured: esbuild inlines the require and refuses at boot), so the
// producer is spawned per request instead. @types/node stays uninstalled;
// node-minimal.d.ts declares the one signature this file uses.
var spawnProducer = function (root, arm) {
    var out = spawnSync('node', ['scripts/dev-advance.cjs', arm], { cwd: root, encoding: 'utf8' });
    return out.status === 0 ? out.stdout : null;
};
var whereami = {
    name: 'whereami',
    configureServer: function (server) {
        server.middlewares.use('/__whereami', function (_req, res) {
            var body = spawnProducer(server.config.root, '--whereami-json');
            res.setHeader('content-type', 'application/json');
            res.end(body !== null && body !== void 0 ? body : JSON.stringify({ error: 'whereami producer failed' }));
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
var LAG_POLL_MS = 20000;
var goStaleMark = {
    name: 'go-stale-mark',
    apply: 'serve',
    configureServer: function (server) {
        var _a;
        var timer = null;
        var lastSentTip = null;
        var poll = function () {
            var _a, _b, _c, _d, _e, _f, _g;
            var body = spawnProducer(server.config.root, '--lag-json');
            if (!body)
                return;
            var lag = {};
            try {
                lag = JSON.parse(body);
            }
            catch (_h) {
                return;
            }
            if (!lag.behind) {
                lastSentTip = null;
                return;
            }
            var tip = (_b = (_a = lag.target) === null || _a === void 0 ? void 0 : _a.tip) !== null && _b !== void 0 ? _b : ((_c = lag.branches) !== null && _c !== void 0 ? _c : []).join(',');
            if (tip === lastSentTip)
                return; // one mark per new state — the walk is not nagged
            lastSentTip = tip;
            server.ws.send({ type: 'custom', event: 'serve-lag', data: lag });
            server.config.logger.warn("[go-stale] the served tree is behind: ".concat(lag.kind === 'behind' ? "".concat((_d = lag.target) === null || _d === void 0 ? void 0 : _d.branch, " at ").concat(((_f = (_e = lag.target) === null || _e === void 0 ? void 0 : _e.tip) !== null && _f !== void 0 ? _f : '').slice(0, 7)) : "".concat(lag.kind, ": ").concat(((_g = lag.branches) !== null && _g !== void 0 ? _g : []).join(', ')), " \u2014 finish the walk, then restart npm run dev"));
        };
        timer = setInterval(poll, LAG_POLL_MS);
        (_a = server.httpServer) === null || _a === void 0 ? void 0 : _a.on('close', function () {
            if (timer)
                clearInterval(timer);
        });
    },
    transformIndexHtml: function () {
        // the listener + the strip — injected dev-chrome, zero app-code changes
        return [
            {
                tag: 'script',
                attrs: { type: 'module' },
                injectTo: 'body',
                children: "\nif (import.meta.hot) {\n  import.meta.hot.on('serve-lag', (lag) => {\n    const tip = (lag && lag.target && lag.target.tip) || (lag && lag.branches && lag.branches.join(',')) || 'unknown';\n    try { if (sessionStorage.getItem('serve-lag-dismissed') === tip) return; } catch {}\n    let strip = document.getElementById('serve-lag-strip');\n    if (!strip) {\n      strip = document.createElement('div');\n      strip.id = 'serve-lag-strip';\n      strip.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483646;background:#3b2f1e;color:#f5e9d0;font:12px/1.5 ui-monospace,monospace;padding:6px 12px;display:flex;gap:12px;align-items:center;border-bottom:1px solid #8a6d3b;';\n      document.body.appendChild(strip);\n    }\n    const what = lag.kind === 'behind'\n      ? 'the served tree is behind \u2014 ' + lag.target.branch + ' is at ' + lag.target.tip.slice(0, 7) + ', this serve is at ' + ((lag.head || '').slice(0, 7) || '?')\n      : 'the wt line and this serve have ' + lag.kind + ' \u2014 ' + tip;\n    strip.innerHTML = '';\n    const text = document.createElement('span');\n    text.textContent = what + ' \u00B7 finish what you are doing, then restart npm run dev (the walk is never reloaded from here)';\n    const dismiss = document.createElement('button');\n    dismiss.textContent = 'seen';\n    dismiss.style.cssText = 'margin-left:auto;background:none;border:1px solid #8a6d3b;color:inherit;font:inherit;padding:1px 8px;cursor:pointer;';\n    dismiss.onclick = () => { try { sessionStorage.setItem('serve-lag-dismissed', tip); } catch {}; strip.remove(); };\n    strip.appendChild(text);\n    strip.appendChild(dismiss);\n  });\n}\n",
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
