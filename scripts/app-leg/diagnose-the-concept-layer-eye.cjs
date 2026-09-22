#!/usr/bin/env node

// ⛔ DRIVE FAMILY — NOT A SWEEP WITNESS (B-111 §2, ruled; classified here BY
// THIS DECLARATION). This leg SPAWNS the committed dev app (`npm run dev --
// --port 5199 --strictPort`), fingerprints it, and DRIVES it through
// python/playwright at the PERSON'S viewport. A sweep that launches dev
// servers is not a headless sweep: it takes minutes, it needs python +
// playwright + a free port, and it owns 5199 while it runs.
// ⇒ ITS TRIGGER IS THE FIFTH WITNESS, never a calendar and never anyone's
// memory: THE DRIVE FAMILY RUNS AS PART OF ANY BUILD WHOSE READING TOUCHES
// ITS SUBJECT — and its subject is THE CONCEPT LAYER ON THE CANVAS (the
// corner's inside, the midpoint's unfolding, its word half, its own diagram,
// its projection sources, the refusal at the act). Δ83's law, which chartered
// this leg: a witness that locates a control by its data attribute proves the
// control EXISTS; only a person's eye proves it can be FOUND — so this leg
// measures what is INSIDE THE PANEL'S VISIBLE BOX at scroll 0, at 1689 × 897
// (Arman's viewport, from his own plate) and at 1400 × 900, before it clicks
// anything. A build that adds or moves a control on the canvas overlay runs
// this leg, or says why not in words that survive Arman's eye.
// ⇒ AND THE §114.2 HOLE IS CLOSED BY CONSTRUCTION FOR THIS SURFACE (the
// mothership's 1442 ratification, §4): THIS LEG CANNOT PASS BY FINDING A HOOK,
// BECAUSE IT READS THE BOX BEFORE IT TOUCHES ONE — reachability is measured on
// the freshly selected midpoint, before any click, and the served tree is
// fingerprinted (`/__whereami` against `git rev-parse HEAD`) before anything
// is believed.
// ⇒ The sweep classifies BY THIS DECLARATION: the sweep set is
// `grep -L "DRIVE FAMILY"` over scripts/app-leg/diagnose-*.cjs. The plates
// land in the ignored scripts/app-leg/_frames/ — a witness never writes into
// the tracked tree.

// DIAGNOSTIC — THE CONCEPT LAYER AT THE EYE (STAMP C-7d, 2026-09-22): the
// midpoint AB with casts on all four corners of the seed tetrahedron — both
// halves of the act reachable without scrolling and named in one sentence; a
// role pair and a word pair made by a person's clicks; the midpoint's own
// diagram after mapping; the projection sources carrying the acts on A–C once
// given; the refusal at the act with its hands; the covering and the arc-word
// collisions counted. C-7e (Δ84 "pay the price"): the core dissected AGAIN with
// the pairs given — the acts, the own diagram, the trace and the neighbouring act
// read at the eye at gen 2 (a person's acts surviving a dissection is a
// person-facing fact, and only the eye can say so). C-7f (the designer's eight):
// the word at the arc's FOOT (the plate is hers — the collision count is printed,
// not judged), the empty map's lines bare, the re-made pair attributed, the glued
// column's origins written, the card one grid, the source in words with its
// drawing on request, and the TEXT CENSUS with BOTH readings — composited over
// the ground, and alpha-blind (a tinted badge read as its opaque colour, which
// reproduces her five worst numbers to the hundredth).

const { spawn, execFileSync } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..', '..');
const PORT = 5199;
const URL = `http://localhost:${PORT}/`;
const FRAMES = path.join(__dirname, '_frames');
fs.mkdirSync(FRAMES, { recursive: true });

let failures = 0;
const check = (name, cond, detail) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} - ${name}${detail !== undefined && !cond ? ` — ${detail}` : ''}`);
  if (!cond) failures += 1;
};
const note = (line) => console.log(`      ${line}`);
const J = (x) => JSON.stringify(x);

console.log('THE CONCEPT LAYER AT THE EYE — the midpoint\'s two halves reachable, made, drawn; the sources carrying the person\'s acts (C-7d, DRIVE FAMILY)\n');

const waitUp = () =>
  new Promise((resolve) => {
    const started = Date.now();
    const poll = () => {
      const r = http.get(URL, (res) => {
        res.resume();
        if (res.statusCode === 200) resolve(true);
        else next();
      });
      r.on('error', next);
      r.setTimeout(2000, () => {
        r.destroy();
        next();
      });
    };
    const next = () => (Date.now() - started > 90000 ? resolve(false) : setTimeout(poll, 600));
    poll();
  });

(async () => {
  const server = spawn(`npm run dev -- --port ${PORT} --strictPort`, { cwd: repoRoot, stdio: 'ignore', shell: true });
  try {
    const up = await waitUp();
    check('§0 the committed dev app boots on 5199', up);
    if (up) {
      const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim();
      for (const [w, h] of [[1689, 897], [1400, 900]]) {
        let raw = '';
        try {
          raw = execFileSync('python', [path.join(__dirname, 'concept_layer_eye_driver.py'), '--url', URL, '--frames', FRAMES, '--width', String(w), '--height', String(h)], {
            cwd: repoRoot,
            encoding: 'utf8',
            env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
            maxBuffer: 64 * 1024 * 1024,
          });
        } catch (e) {
          check(`§1 the driver ran at ${w} × ${h}`, false, String(e.stderr || e.message).slice(-600));
          continue;
        }
        const lines = raw.trim().split('\n');
        const out = JSON.parse(lines[lines.length - 1]);
        const u = out.unglued;
        const g = out.glued;
        note(`${w} × ${h} — served ${out.whereami ? out.whereami.head.slice(0, 7) : '?'} (HEAD ${head.slice(0, 7)}; dirty paths ${out.whereami ? out.whereami.dirtyPaths : '?'}) · panel ${J(u.panel)} · word half ${J(u.wordHalf)} · drawing top ${u.drawing ? u.drawing.y : '?'}`);
        check(`§1 [${w}×${h}] THE SERVED TREE IS THIS HEAD (the eye-run fingerprints before believing): /__whereami answers the commit the leg was started from`, out.whereami && out.whereami.head === head, J(out.whereami));
        check(`§1 [${w}×${h}] ★★ BOTH HALVES REACHABLE WITHOUT SCROLLING (Δ83, item 0): at scroll 0 the sentence naming both halves, the WORD HALF (both rows) and the top of the drawing are inside the panel's visible box; the chips are buttons`,
          u.present && u.scrollTop === 0 && u.gestureVisible && u.wordHalfVisible && u.wordsVisible && u.drawingTopVisible && u.wordChipsAreButtons && /two halves, both yours/.test(u.gestureSentence || ''),
          J({ gestureVisible: u.gestureVisible, wordHalfVisible: u.wordHalfVisible, wordsVisible: u.wordsVisible, drawingTopVisible: u.drawingTopVisible, wordsA: u.wordsA, panel: u.panel }));
        check(`§1 [${w}×${h}] the gesture line under the canvas names the midpoint's two halves, and the unglued state says so in words`, u.gestureLineHasMidpointClause && /^no pair given yet/.test(u.sentence || '') && u.own === 'unglued');
        check(`§1 [${w}×${h}] ★★ A PERSON MAKES BOTH HALVES: a role pair by two clicks in the drawing (F5 ↦ Φ7, drawn yours), a word pair by two clicks in the rows (sustains ↦ descends-from)`,
          J(out.oneEach.lines) === J(['F5↦Φ7']) && J(out.oneEach.wordPairs) === J(['sustains↦descends-from']) && out.oneEach.state === 'glued', J({ lines: out.oneEach.lines, wordPairs: out.oneEach.wordPairs }));
        check(`§1 [${w}×${h}] ★★ THE MAPPED MIDPOINT'S OWN DIAGRAM after the three pairs and τ₃: one column of 20 points with 4 tuples marked both`,
          g.own === 'glued' && g.ownPoints === 20 && g.ownBoth === 4 && g.lines.length === 3 && g.wordPairs.length === 3, J({ own: g.own, ownPoints: g.ownPoints, ownBoth: g.ownBoth }));
        check(`§1 [${w}×${h}] ★ THE COVERING is gone (no halo rect in the drawing) and the arc-word collisions are COUNTED (printed, not blessed)`,
          g.haloRects === 0 && Array.isArray(g.perColumn) && g.perColumn.length === 2, J({ haloRects: g.haloRects }));
        note(`arc-word box overlaps per column: ${J(g.perColumn)}`);
        check(`§1 [${w}×${h}] ★ THE REFUSAL AT THE ACT: F1 ↦ Φ9 refused by the mold's name with its one hand`,
          out.refused.refusal === 'role|F1|Φ9' && out.refused.conflicts.length === 1 && /member_status: F1 has in .+ · Φ9 none-by-nature in/.test(out.refused.conflicts[0]) && out.refused.hands.length === 1);
        check(`§1 [${w}×${h}] ★★ THE PROJECTION SOURCES CARRY THE PERSON'S ACTS: before, both sources read raw material; after a role pair and a word pair on A–C at the AC midpoint, AB's source C reads them and B–C reads no identification given yet`,
          u.sourceActs.length === 2 && u.sourceActs.every((s) => /^raw material — nothing given yet/.test(s)) && out.acGiven.lines.length === 1 && out.acGiven.wordPairs.length === 1 &&
            out.abWithNeighbour.sourceActs.some((s) => /^on [A-D]–[A-D]: .+ ↦ .+ · sustains ↦ sustains · no identification given yet on/.test(s) || /^on [A-D]–[A-D]: .+ ↦ .+ · sustains ↦ sustains/.test(s)),
          J(out.abWithNeighbour.sourceActs));
        check(`§1 [${w}×${h}] the words of the retired offering are absent from the surface`, !u.forbidden && !g.forbidden);
        // ─── C-7f — the designer's eight at the eye ───
        const f = g;
        const uniq = (xs) => [...new Set(xs)];
        check(`§3 [${w}×${h}] ★★ THE WORD AT THE FOOT (C-7f item 1): no textPath in the drawing; the words stand in foot rows at their points; the box-overlap count is PRINTED, not judged — the plate is the designer's`, f.present && f.textPaths === 0 && f.footRows > 0 && Array.isArray(f.perColumn) && f.perColumn.length === 2, J({ textPaths: f.textPaths, footRows: f.footRows }));
        note(`foot rows ${f.footRows} · arc-word box overlaps per column (the blind metric, printed): ${J(f.perColumn)}`);
        note(`the drawing ${f.drawing ? f.drawing.w : '?'} px wide in a ${f.panel ? f.panel.w : '?'} px panel — the feet widen the columns; the right column's own right side is ${f.drawing && f.panel && f.drawing.w > f.panel.w ? 'beyond a horizontal scroll' : 'inside the panel'} at this viewport`);
        check(`§3 [${w}×${h}] ★ THE SIZES (item 7): the drawing's text at 12 px (labels) and 11 px (dense data) only — no 10 px, no 9 px`, f.present && f.drawingFonts.length > 0 && f.drawingFonts.every((s) => s === 12 || s === 11), J(uniq(f.drawingFonts)));
        check(`§3 [${w}×${h}] ★★ THE EMPTY MAP'S LINES GO BARE (item 2): no residual sentence before a pair; the residuals present once glued`, u.residuals === null && typeof f.residuals === 'string' && /met no partner/.test(f.residuals), J({ before: u.residuals, after: f.residuals }));
        check(`§3 [${w}×${h}] ★★ THE GLUED COLUMN WRITES ITS ORIGINS (item 4): 72 origin words (20 roles + 52 tuples), 7 both; no [A]/[B] in the column's text`, f.ownOrigins.length === 72 && f.ownOrigins.filter((o) => o === 'both').length === 7 && !/ \[[AB]\]/.test(f.ownText || ''), J({ n: f.ownOrigins.length, both: f.ownOrigins.filter((o) => o === 'both').length }));
        const so = out.sourceOpened || {};
        check(`§3 [${w}×${h}] ★★ THE SOURCE IN WORDS, THE DRAWING ON REQUEST (item 6): both sources read \`holds a concept-space of …\` with \`open the drawing\` and no points; opened, the source above draws WHOLE — its points at the one size (smallest text 11 px)`,
          f.sourceWords.length === 2 && f.sourceWords.every((s) => /holds a concept-space of \d+ roles · \d+ relations · \d+ words/.test(s)) && f.sourceOpen.length === 2 && f.sourceOpen.every((o) => o === 'closed') && f.sourcePoints === 0 &&
            so.sourceOpen && so.sourceOpen[0] === 'open' && (so.sourcePoints === 10 || so.sourcePoints === 9) && Array.isArray(so.sourceFonts) && so.sourceFonts.length > 0 && Math.min(...so.sourceFonts) >= 11,
          J({ words: f.sourceWords, opened: so }));
        const cr = out.cdRefused || {}; const cm = out.cdRemade || {};
        check(`§3 [${w}×${h}] ★★ THE RE-MADE PAIR IS ATTRIBUTED (item 3): at CD, r0 ↦ Φ1 refused after r8 ↦ Φ6 under sustains ↦ descends-from (three hands); r8 ↦ Φ6 withdrawn → the one line reads yours · re-made when you withdrew r8 ↦ Φ6`,
          cr.hands && cr.hands.length === 3 && cm.lines && cm.lines.length === 1 && cm.remade && cm.remade.length === 1 && /^re-made when you withdrew (r8 ↦ Φ6|Φ6 ↦ r8)$/.test(cm.remade[0]), J({ refused: cr, remade: cm }));
        const card = out.card || { present: false };
        check(`§3 [${w}×${h}] ★★ THE CARD IS ONE GRID (item 5): at C (the T cell) every cast row spans the card's full width; the card's box printed (the designer measured 312 × 1119 before)`, card.present && card.rows.length >= 4 && card.rows.every((r) => r.spans), J(card));
        if (card.present) note(`the card at C: ${card.card.w} × ${card.card.h} px (ratio ${card.ratio}) at a viewport ${card.viewport} px tall — of which the cast's rows ${card.castHeight} px · rows ${J(card.rows.map((r) => `${r.row} ${r.w}×${r.h}`))} · content width ${card.inner}`);
        const c = out.census || {};
        const line = (k) => (c[k] ? `${c[k].nodes} nodes · below 4.5 composited ${c[k].belowComposited} · alpha-blind ${c[k].belowBlind}` : 'not measured');
        note(`contrast census — the midpoint's panel: ${line('panel')} · the card: ${line('card')} · the packets tab: ${line('packets')}`);
        note(`the two named controls at the start (Fit Selected disabled, the workspace tab active): ${J((c.controlsAtStart || {}).worst)}`);
        note(`the two named controls with a selection: ${J((c.controlsWithSelection || {}).worst)}`);
        note(`the panel's five faintest by the composited reading: ${J(((c.panel || {}).worst || []).slice(0, 5))}`);
        check(`§3 [${w}×${h}] ★★ THE FLOOR (item 7c): every text node in the midpoint's panel reads at ≥ 4.5:1 against its composited ground`, c.panel && c.panel.nodes > 100 && c.panel.belowComposited === 0, J((c.panel || {}).below));
        const fit = (k) => ((c[k] || {}).worst || []).filter((r) => /Fit Selected/.test(r.text));
        check(`§3 [${w}×${h}] ★ Fit Selected reads at ≥ 4.5:1 disabled and enabled (composited); the workspace tab's active label is printed with both readings, not cut — composited it stands above the floor`, fit('controlsAtStart').length === 1 && fit('controlsAtStart')[0].disabled && fit('controlsAtStart')[0].composited >= 4.5 && fit('controlsWithSelection').length === 1 && fit('controlsWithSelection')[0].composited >= 4.5, J({ start: fit('controlsAtStart'), later: fit('controlsWithSelection') }));
        // C-7e — THE SECOND DISSECTION AT THE EYE
        const g2 = out.gen2 || { present: false, lines: [], wordPairs: [], sourceActs: [] };
        note(`gen 2 — selected ${J(out.selectGen2Parent)} then ${J(out.selectAB3)} · panel ${J(g2.panel)} · word half ${J(g2.wordHalf)} · drawing top ${g2.drawing ? g2.drawing.y : '?'} · ${g2.counts || 'no counts'}`);
        check(`§2 [${w}×${h}] ★★ THE ACTS SURVIVE THE SECOND DISSECTION (C-7e, Δ84 "pay the price"): the core dissected again with the pairs given at gen 1 — at gen 2 the AB midpoint reads the same 3 role pairs and 3 word pairs (yours), draws its own diagram (20 points, 4 both) and its trace (20 roles), its source C still carries the A–C act, and the AC midpoint still reads its one pair of each`,
          g2.present && g2.lines.length === 3 && g2.wordPairs.length === 3 && g2.own === 'glued' && g2.ownPoints === 20 && g2.ownBoth === 4 && /20 roles/.test(g2.counts || '') && /3 role pairs · 3 word pairs — yours/.test(g2.sentence || '') &&
            g2.sourceActs.some((s) => /^on [A-D]–[A-D]: .+ ↦ .+ · sustains ↦ sustains/.test(s)) && Boolean(out.gen2AC && out.gen2AC.present) && out.gen2AC.lines.length === 1 && out.gen2AC.wordPairs.length === 1,
          J({ present: g2.present, lines: g2.lines, wordPairs: g2.wordPairs, own: g2.own, ownPoints: g2.ownPoints, ownBoth: g2.ownBoth, counts: g2.counts, sentence: g2.sentence, sourceActs: g2.sourceActs, ac: out.gen2AC }));
        check(`§2 [${w}×${h}] ★ at gen 2 both halves are still inside the visible box at scroll 0 — the same reading as gen 1, on the carried record`,
          g2.present && g2.scrollTop === 0 && g2.gestureVisible && g2.wordHalfVisible && g2.wordsVisible && g2.drawingTopVisible,
          J({ gestureVisible: g2.gestureVisible, wordHalfVisible: g2.wordHalfVisible, wordsVisible: g2.wordsVisible, drawingTopVisible: g2.drawingTopVisible, panel: g2.panel }));
      }
    }
  } finally {
    try {
      if (process.platform === 'win32') execFileSync('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
      else server.kill('SIGTERM');
    } catch {
      /* the server may have gone already */
    }
  }
  console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CONCEPT-LAYER-EYE: ALL PASS — both halves of the midpoint\'s act are in the person\'s visible box and made by clicks; the midpoint draws its own space; the sources carry the person\'s neighbouring acts; the acts survive a second dissection; the designer\'s eight read at the eye' : `DIAGNOSE-THE-CONCEPT-LAYER-EYE: ${failures} FAILURE(S)`}`);
  process.exit(failures === 0 ? 0 : 1);
})();
