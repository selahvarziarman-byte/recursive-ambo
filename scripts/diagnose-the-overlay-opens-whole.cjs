#!/usr/bin/env node
'use strict';
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
// THE LIFTED INSIDE'S OVERLAY OPENS WHOLE — STAMP THE-RIDERS-AFTER-2.1 · rider 3 (the mothership's 10-20 11:09 (3); the designer's 10-19 19:16: "whole is a state
// there too", on the coder's MARKER 4 sighting at 0e4491d — AB's inside, five points, drew 866 tall in an overlay 681 tall and scrolled).
//
// The overlay's box is MEASURED by its owner (the view) and handed to the panel as `fitHeight`; the panel measures its own chrome — head, padding, border — and hands
// the frame what is left as its cap (STAMP ZOOM's `frameMaxHeight`: the bar and the box together); the frame's live fit does the rest. Nothing here is a number from
// the viewport. WHAT THIS FILE CAN AND CANNOT SEE: under node no box is measured, so the cap is the EYE's to see (its §54); this file pins the construction, the
// fit's arithmetic on the sighting's numbers, and that the Ambo's own panel is byte-as-before.
// ════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const TRANSPILE_OPTIONS = { compilerOptions: { esModuleInterop: true, module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX } };
require.extensions['.ts'] = (m, f) => { m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { ...TRANSPILE_OPTIONS, fileName: f }).outputText, f); };
require.extensions['.tsx'] = require.extensions['.ts'];
require.extensions['.css'] = () => {};

const repoRoot = path.resolve(__dirname, '..');
const req = (p) => require(path.join(repoRoot, p));
const React = require('react');
const { renderToString } = require('react-dom/server');
const { useGeometryStore } = req('src/store/geometryStore.ts');
const { CastInsidePanel } = req('src/components/CastInsideDiagram.tsx');
const { wholeScaleOf } = req('src/components/ZoomFrame.tsx');

const J = (x) => JSON.stringify(x);
let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined ? ` — ${typeof detail === 'string' ? detail : J(detail)}` : ''}`);
  if (!cond) failures += 1;
};
const src = (p) => fs.readFileSync(path.join(repoRoot, p), 'utf8').replace(/\r\n/g, '\n');
const count = (s, needle) => s.split(needle).length - 1;
const openTag = (html, re) => (html.match(re) || [''])[0];

console.log("THE LIFTED INSIDE'S OVERLAY OPENS WHOLE — the overlay's measured height goes down to the panel, the panel's measured chrome comes off, the frame fits the drawing (rider 3 after 2.1)\n");

// ═══ §1 BY CONSTRUCTION ═══
const panel = src('src/components/CastInsideDiagram.tsx'); const view = src('src/manuscript/ManuscriptView.tsx'); const frame = src('src/components/ZoomFrame.tsx'); const surface = src('src/components/MidpointSurface.tsx');
check('§1 ★★ THE PANEL takes `fitHeight` (undefined: no fit asked; null: asked, not yet measured; a number: the height the mount leaves it), MEASURES its own chrome where it stands — the head\'s height with its margin, the root\'s padding and border, by getComputedStyle, never a stamp — and hands the frame what is left as `frameMaxHeight`; the diagram passes it to the frame\'s mount',
  /fitHeight\?: number \| null \}\) \{/.test(panel) && /const around = parseFloat\(rs\.paddingTop\) \+ parseFloat\(rs\.paddingBottom\) \+ parseFloat\(rs\.borderTopWidth\) \+ parseFloat\(rs\.borderBottomWidth\);/.test(panel) && /const above = head\.offsetHeight \+ parseFloat\(hs\.marginBottom\);/.test(panel)
    && /const frameMaxHeight = fitHeight === undefined \? undefined : fitHeight === null \? null : Math\.max\(0, fitHeight - chrome\);/.test(panel) && count(panel, 'frameMaxHeight={frameMaxHeight}') === 2
    && /<ZoomFrame name="inside" id=\{id \?\? 'cast'\} width=\{width\} height=\{height\} maxHeight=\{maxHeight\} frameMaxHeight=\{frameMaxHeight\} fixedWidth>/.test(panel) && !/fitHeight - \d|chrome \+ \d/.test(panel),
  { mounts: count(panel, 'frameMaxHeight={frameMaxHeight}') });
check('§1 ★★ THE FRAME caps the box by it, the bar taken off (STAMP ZOOM\'s second cap mode, unchanged): the box takes what the bar leaves',
  frame.includes("if (frameMaxHeight !== undefined) el.style.maxHeight = frameMaxHeight === null ? '' : `${Math.max(0, frameMaxHeight - (barRef.current ? barRef.current.offsetHeight : 0) - GAP)}px`;"));
check('§1 ★★ THE VIEW measures the overlay\'s box where it stands — a ref callback (mount and unmount, never a stale box), a ResizeObserver, the padding read by getComputedStyle — and hands the fit to BOTH overlays\' mounts (the lifted corner\'s record; D19\'s merged corner on the image); nothing from the viewport',
  /const liftedDrawingRef = useCallback\(\(el: HTMLDivElement \| null\): void => \{/.test(view) && /const fit = Math\.max\(0, Math\.round\(el\.clientHeight - parseFloat\(cs\.paddingTop\) - parseFloat\(cs\.paddingBottom\)\)\);/.test(view)
    && /const ro = new ResizeObserver\(measure\); ro\.observe\(el\); liftedDrawingObserver\.current = ro;/.test(view) && count(view, 'ref={liftedDrawingRef}') === 2 && count(view, 'inline fitHeight={liftedDrawingFit} />') === 2 && !/liftedDrawingFit[^\n]*innerHeight|innerHeight[^\n]*liftedDrawingFit/.test(view),
  { refs: count(view, 'ref={liftedDrawingRef}'), mounts: count(view, 'inline fitHeight={liftedDrawingFit} />') });
check('§1 ★ THE AMBO\'S OWN MOUNT passes no fit (byte-as-before): over the solid the box keeps its own cap (`calc(100vh - 14rem)`)',
  surface.includes('<CastInsidePanel shape={shape} vertexId={vertexId} records={childRecords} />') && count(surface, 'fitHeight') === 0 && panel.includes("maxHeight={inline ? undefined : 'calc(100vh - 14rem)'}"));

// ═══ §2 THE FIT'S ARITHMETIC ON THE SIGHTING'S NUMBERS ═══
// MARKER 4's eye at 0e4491d: the overlay 1105 wide and 681 tall (padding 6), AB's drawing 432 × 866 at five points. Whatever the panel's chrome and the bar measure,
// the frame's box is some height under 669; for EVERY such height the fit puts the whole drawing in the box, never above natural size, the width under the panel's
const fits = []; let allFit = true;
for (let boxH = 60; boxH <= 669; boxH += 1) {
  const scale = wholeScaleOf(1105 - 2, boxH, 432, 866);
  const h = Math.round(866 * scale); const w = Math.round(432 * scale);
  if (!(h <= boxH - 2 && w <= 1105 - 2 && scale <= 1 && scale > 0)) { allFit = false; fits.push({ boxH, scale, h, w }); }
}
check('§2 ★★ FOR EVERY BOX HEIGHT the frame could be left (60 … 669 px), the fit puts AB\'s 866-tall drawing whole in the box, never above natural size, its width under the panel\'s; at the sighting\'s box less the overlay\'s padding and a typical chrome (618 px) the drawing stands at about 0.71',
  allFit && Math.abs(wholeScaleOf(1103, 618, 432, 866) - 616 / 866) < 0.01, { failures: fits.slice(0, 3), atSighting: wholeScaleOf(1103, 618, 432, 866) });

// ═══ §3 UNDER NODE THE TWO RENDERS ARE ONE — the cap is a browser measurement; the eye is the instrument of the fit ═══
const FIX = path.join(repoRoot, 'scripts/fixtures/altitude');
const save = JSON.parse(fs.readFileSync(path.join(FIX, 'virgin-land_2026-10-09_1934_Value-Fact_all-passages-decided.workspace.json'), 'utf8'));
const S = () => useGeometryStore.getState();
S().importWorkspace(save);
const cur = () => S().shapes[S().currentShapeId];
const value = Object.values(cur().vertices).find((v) => v.data.label === 'Value');
const render = (props) => renderToString(React.createElement(CastInsidePanel, props));
const withFit = render({ shape: cur(), vertexId: value.id, inline: true, fitHeight: 600 });
const withoutFit = render({ shape: cur(), vertexId: value.id, inline: true });
const pendingFit = render({ shape: cur(), vertexId: value.id, inline: true, fitHeight: null });
check('§3 ★★ UNDER NODE a fit asked changes no byte of the inline panel\'s markup (the cap is set by the frame\'s own measure in a browser, on the box it has): with `fitHeight` 600, with none, and with a fit asked but not yet measured (null), the three renders are one — in the flow, the frame named `inside`, `whole` marked, the box at the drawing\'s own height — so the fit is the EYE\'s to see (its §54), named here, not claimed here',
  withFit === withoutFit && pendingFit === withoutFit && /data-inside-placement="inline"/.test(withFit) && new RegExp(`data-zoom-frame="inside" data-zoom-frame-id="${value.id}"`).test(withFit) && /data-inside-zoom="whole" data-inside-zoom-on="true"/.test(withFit) && /<div data-inside-box="true" style="height:\d+px;width:\d+px;max-width:100%"/.test(withFit),
  { box: openTag(withFit, /<div data-inside-box="true"[^>]*>/), same: withFit === withoutFit });
const ambo = render({ shape: cur(), vertexId: value.id });
check('§3 ★ THE AMBO\'S PANEL (overlay, no fit) renders as before: its box capped at what the panel leaves (`calc(100vh - 14rem)`), stating its own width',
  /data-inside-placement="overlay"/.test(ambo) && /<div data-inside-box="true" style="height:\d+px;max-height:calc\(100vh - 14rem\);width:\d+px;max-width:100%"/.test(ambo), openTag(ambo, /<div data-inside-box="true"[^>]*>/));

console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-OVERLAY-OPENS-WHOLE: ALL PASS — the overlay\'s measured height goes down, the panel\'s measured chrome comes off, the frame fits the drawing whole; the fit itself is the eye\'s §54' : `DIAGNOSE-THE-OVERLAY-OPENS-WHOLE: ${failures} FAILURE(S)`}`);
process.exit(failures === 0 ? 0 : 1);
