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
// reproduces her five worst numbers to the hundredth). C-5 (1705): THE FACE at
// the eye — the empty-core guard in words, the face REFUSED with its three hands
// as controls, one hand withdrawn and the face READ with its direction stated;
// and ITEM 0 — a pair at a gen-2 midpoint between two BORN corners, walked and
// PRINTED as a measurement ahead of the mothership's ruling, never blessed —
// RETIRED by C-8: that arm loaded casts onto AB and AC, an act Arman named as
// not his (Δ86: "no cast loading is only for the seed"), so it measured the
// shortcut, not the chain. C-8 (Δ85 · Δ86): THE DRIVE FAMILY RUNS ON THE LAWFUL
// PATH ONLY — a cast is loaded on the seed's corners and nowhere else; the born
// room at ABAC reached by pointing at AB and AC and dissecting: the shared
// corner's roles marked composed on both sides and never a pair, a composed
// point unpickable, a born pair by two clicks, the record's home and the site
// in words, the dependency refusal with its two hands and the act taken after
// the far hand, the loader absent at a midpoint.
// C-7g (the designer's second cut — 1008 §3 and 1110 §3): the label lane is
// arity-1's (no binary word left of its point at the eye, none end-anchored);
// the width bounded by the wrap (the drawing against the panel and the widest
// positioned line, printed; the fit pinned at her viewport); the card's
// term-order rows grouped by reading, its height at the T cell and at Φ
// (printed); the face block's clauses each on their own line, the verdict
// never orphaned, the direction the face's own, the hands leading with WHERE.

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
        check(`§1 [${w}×${h}] ★★ ONE REFUSAL GRAMMAR AT THE ACT (C-7h item 6, the designer's §125.1): the box reads \`not taken — F1 ↦ Φ9: the two records contradict under it\`, its one hand \`here, on A–B: withdraw this attempt\`; \`refused\`, \`(the act just made)\` and \`nothing glued\` nowhere on the surface`,
          /^not taken — F1 ↦ Φ9: the two records contradict under it/.test(out.refused.refusalText || '') && (out.refused.refusalHands || []).length === 1 && /^here, on [A-D]–[A-D]: withdraw this attempt$/.test(out.refused.refusalHands[0]) && out.refused.oldGrammar === false,
          J({ text: out.refused.refusalText, hands: out.refused.refusalHands, old: out.refused.oldGrammar }));
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
        const own = f.ownership || [];
        const single = (side) => own.filter((b) => b.side === side && b.own !== null && b.lines === 1);
        const mean = (xs) => (xs.length ? Math.round((xs.reduce((sum, b) => sum + b.own, 0) / xs.length) * 10) / 10 : null);
        const tightest = own.reduce((m, b) => (b.nearestOther !== null && b.nearestOther - b.own < m.margin ? { margin: Math.round((b.nearestOther - b.own) * 10) / 10, id: b.id, side: b.side, lines: b.lines } : m), { margin: Infinity });
        note(`C-7h foot ownership at AB: ${own.length} blocks · nearest row its own ${own.filter((b) => b.ownIsNearest).length} of ${own.length} · centre distance to the own row (one-line blocks): up ${mean(single('up'))} px · down ${mean(single('down'))} px · loops ${mean(single('loops'))} px · the tightest margin ${J(tightest)}`);
        check(`§3 [${w}×${h}] ★★ EVERY FOOT BLOCK IS OWNED BY ITS ROW (C-7h items 3–4, the designer's live drive: the down blocks sat 22 px from their row against 23 from the next, a 1 px margin; Φ1's block 31 px from another row): at AB every up, down and loops block's centre is nearer its own row line than any other, the one-line down blocks within 2 px of the up blocks' distance, and the tightest margin more than 4 px`,
          own.length > 0 && own.every((b) => b.ownIsNearest) && single('up').length > 0 && single('down').length > 0 && Math.abs(mean(single('up')) - mean(single('down'))) <= 2 && tightest.margin > 4,
          J(own.filter((b) => !b.ownIsNearest || (b.nearestOther !== null && b.nearestOther - b.own <= 4))));
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
        // ─── C-7g — the designer's second cut at the eye ───
        check(`§4 [${w}×${h}] ★★ THE LABEL LANE IS ARITY-1'S (C-7g item 1): in both unfolded columns and in the midpoint's own drawing no arc word and no loop word has its box left of its column's points, and no end-anchored text holds one — every binary word stands right of its point, in the block on its arc's side of the row line`,
          Array.isArray(f.laneWords) && f.laneWords.length === 2 && f.laneWords.every((c) => c.words > 0 && c.inLane === 0 && c.endAnchored === 0) && Array.isArray(f.ownLane) && f.ownLane.length === 1 && f.ownLane.every((c) => c.words > 0 && c.inLane === 0 && c.endAnchored === 0), J({ lane: f.laneWords, own: f.ownLane }));
        note(`C-7g the width: the AB drawing ${f.drawing ? f.drawing.w : '?'} px wide in a ${f.panel ? f.panel.w : '?'} px panel (the C-7f run read 1618 in 1025 at 1689 × 897) · the widest positioned line ${f.widestLine} px against WRAP 200 by the geometry's estimate · ${f.wrappedBlocks} of its blocks wrapped · the own drawing: widest line ${f.ownWidestLine} px, ${f.ownWrappedBlocks} blocks wrapped`);
        check(`§4 [${w}×${h}] ★★ THE WIDTH TAKES THE NEXT LINE (C-7g item 2): the AB drawing fits the panel's width at the designer's viewport, 1689 × 897 (she measured an overflow ≈ 593 there); at 1400 × 900 the width is printed against the panel; the wrap happened (blocks of more than one line)`,
          (w !== 1689 || (f.drawing && f.panel && f.drawing.w <= f.panel.w)) && f.wrappedBlocks > 0 && f.widestLine > 0, J({ drawing: f.drawing, panel: f.panel, wrapped: f.wrappedBlocks }));
        const cp = out.cardPhi || { present: false };
        check(`§4 [${w}×${h}] ★★ THE CARD'S TERM ORDER GROUPS BY READING (C-7g item 3): at C (the T cell) and at B (Φ, 15 relation-types) the term-order row holds at most three rows, each stating its reading once — never a row per relation-type; the cards' boxes printed for her eye`,
          card.present && cp.present && Array.isArray(card.orderings) && card.orderings.length >= 1 && card.orderings.length <= 3 && cp.orderings.length >= 1 && cp.orderings.length <= 3 && [...card.orderings, ...cp.orderings].every((r) => (r.text.match(/read as/g) || []).length === (r.key === 'nothing-listed' ? 0 : 1)), J({ c: card.orderings, phi: cp.orderings }));
        if (card.present && cp.present) note(`the card at C (the T cell): ${card.card.w} × ${card.card.h} px, its term-order rows ${J(card.orderings.map((r) => `${r.key} ${r.h} px`))}, the cast's rows ${card.castHeight} px · at B (Φ): ${cp.card.w} × ${cp.card.h} px, ${J(cp.orderings.map((r) => `${r.key} ${r.h} px`))}, the cast's rows ${cp.castHeight} px`);
        // ─── C-5 — THE FACE at the eye ───
        const blk = (m, face) => (((m || {}).blocks || []).find((x) => x.face === face) || {});
        const fa = blk(out.faceAbsent, 'A·B·C'); const fr = blk(out.faceRefused, 'A·B·C'); const fd = blk(out.faceRead, 'A·B·C');
        check(`§5 [${w}×${h}] ★★ THE FACE'S EMPTY-CORE GUARD IN WORDS (C-5): at AB, the source C's face A·B·C reads absent — "no reading yet … none on B–C" — while A–B and C–A hold records`,
          fa.state === 'absent' && /no reading yet/.test(fa.text || '') && /none on B–C/.test(fa.text || ''), J(fa));
        check(`§5 [${w}×${h}] ★★ THE FACE REFUSED, at the eye (the researcher's guard): with (i) on A–B, S1 on C–A and Q on B–C — each accepted at its own edge — the face A·B·C reads NO FACE: C's own record's two tuples with their values, the merged pair, the three edges, and THREE hands as controls`,
          fr.state === 'refused' && /NO FACE/.test(fr.text || '') && /sustains\(r8, r0\) does-not-hold against sustains\(r1, r0\) holds/.test(fr.text || '') && /r8 and r1 made one/.test(fr.text || '') && (fr.hands || []).length === 3, J(fr));
        check(`§5 [${w}×${h}] ★★ ONE HAND WITHDRAWN AT THE EYE, THE FACE READS, THE DIRECTION STATED: the block reads at each of A, B, C — returned to itself · returned elsewhere · did not return, with the edge it broke at — walked A → B → C → A; "has not said" nowhere`,
          fd.state === 'read' && fd.walk === 'A → B → C → A' && (fd.corners || []).length === 3 && /did not return/.test(fd.text || '') && !/has not said/.test(fd.text || '') && /walked in the face's own direction, A → B → C → A/.test(fd.text || '') && !/reads differently|the other way/.test(fd.text || ''), J(fd));
        check(`§5 [${w}×${h}] ★★ THE FACE'S CLAUSES EACH ON THEIR OWN LINE, THE VERDICT NEVER ORPHANED (C-7g items 6–9, the designer's): at each of A, B, C the four lines fix · mov · und · core stand one under the other (their tops ascending), the und line LEADS with its counts (\`N did not return — n broke at …\`), the core CLOSES the block; the head says walked in the face's own direction and nothing about the other way (item 7 — D14: a reversed cycle is a flipped face); in the refusal the three hands lead with WHERE and exactly one says here (item 8); "composed" nowhere in either block (item 9)`,
          (() => {
            const L = fd.lines || []; const C = fd.corners || [];
            if (C.length !== 3) return false;
            let at = 0;
            for (const c of C) {
              const kinds = (Number(c.fix) + Number(c.mov) > 0 ? ['fix', 'mov'] : ['none']).concat(['und', 'core']);
              const q = L.slice(at, at + kinds.length); at += kinds.length;
              if (q.map((l) => l.kind).join() !== kinds.join() || !q.every((l, k) => k === 0 || l.y > q[k - 1].y) || !/^\d+ did not return/.test(q[q.length - 2].text) || !/^the face's core at [A-C], derived: \d+ of its \d+ roles$/.test(q[q.length - 1].text)) return false;
            }
            if (at !== L.length) return false;
            return /walked in the face's own direction, A → B → C → A/.test(fd.text || '') && !/reads differently|the other way|composed/.test((fd.text || '') + (fr.text || '')) &&
              (fr.handTexts || []).length === 3 && fr.handTexts.every((t) => /^(here, )?on [A-D]–[A-D]: withdraw .+ ↦ .+$/.test(t)) && fr.here === 1 && fr.handTexts.filter((t) => /^here, /.test(t)).length === 1;
          })(), J({ lines: fd.lines, hands: fr.handTexts, here: fr.here }));
        check(`§5 [${w}×${h}] ★★ A CORNER WHERE NOTHING RETURNED SAYS SO ONCE (C-7h item 5, the designer's): in the read face block every corner with 0 returned to itself and 0 elsewhere carries ONE line \`nothing returned\` — never \`returned to itself: none\` + \`returned elsewhere: none\`; where something returned the full split stays`,
          (() => { const L = fd.lines || []; const C = fd.corners || []; const none = L.filter((l) => l.kind === 'none'); const expectNone = C.filter((c) => Number(c.fix) + Number(c.mov) === 0).length; return C.length === 3 && none.length === expectNone && none.every((l) => l.text === 'nothing returned') && !/returned to itself: none returned elsewhere: none/.test(fd.text || ''); })(),
          J({ lines: (fd.lines || []).map((l) => `${l.kind}: ${l.text}`), corners: fd.corners }));
        note(`the face's reading at the eye (fix · mov · und · core per corner): ${J((fd.corners || []).map((c) => `${c.corner} ${c.fix}·${c.mov}·${c.und}·${c.core}`))} · the block ${J(fd.box)} · the word half beneath it ${J((out.faceRead || {}).wordHalf)} at scroll ${(out.faceRead || {}).scrollTop} · the refusal's hands ${J(fr.hands)}`);
        // ─── C-8 — THE BORN ROOM at the eye, on the lawful path ───
        const lm = out.loaderAtMidpoint || {}; const lc = out.loaderAtCorner || {};
        check(`§6 [${w}×${h}] ★★ THE LOADER IS ABSENT AT A MIDPOINT AND PRESENT AT A CORNER (C-8 item 2, Δ86): the packets tab with AB selected offers no \`load cast…\` and holds no file input, and adds no word about it; with the seed corner A selected it offers both`,
          lm.inputs === 0 && lm.offer === 0 && lm.words === false && lc.inputs === 1 && lc.offer === 1, J({ midpoint: lm, corner: lc }));
        const br = out.bornRoom || { present: false };
        note(`C-8 the born room: ABAC selected from the cuboctahedron (${J(out.selectABAC)}) — ${br.present ? `PRESENT — ${br.sentence || ''} · ${br.home || ''} · composed points ${(br.composedPoints || []).length} (${J([...new Set(br.composedPoints || [])])}) · lines ${J(br.lines)} · free points ${(br.freeA || []).length} / ${(br.freeB || []).length} · own column composed ${br.ownComposed}` : 'ABSENT'}`);
        check(`§6 [${w}×${h}] ★★ THE BORN ROOM IS REACHED LAWFULLY (C-8 item 0 at the eye — nothing loaded on a midpoint; AB and AC mapped by pointing): the surface at ABAC is PRESENT with the shared corner A's 14 roles composed on BOTH sides (28 composed points), NO line across the fold, the sentence naming the born room in the designer's words (C-7h item 2), the record's home a medial edge (generation 1) and the site generation 2, every composed role in the own column marked composed`,
          br.present && (br.composedPoints || []).length === 28 && (br.composedPoints || []).every((c) => c === 'A') && (br.lines || []).length === 0 && /^corner A's 14 roles and 11 words stand on both sides as one — composed, not yours \(their points hollow\) · the born room: \d+ roles of A[BC] and \d+ of A[BC] stand apart · no pair of yours yet$/.test(br.sentence || '') && /a medial edge \(generation 1\) · this site: ABAC, generation 2/.test(br.home || '') && br.ownComposed === 14 && br.composedClickable === 0,
          J({ present: br.present, composed: (br.composedPoints || []).length, lines: br.lines, sentence: br.sentence, home: br.home, ownComposed: br.ownComposed }));
        check(`§6 [${w}×${h}] ★★ \`≡\` IS THE PERSON'S ACT AND ONLY THAT (C-7h item 1, the designer's live drive — nine composed words wore \`≡\` at ABAC; \`r0 ≡ F1 ≡ F1\` joined a role to itself): at ABAC before any born pair no arc or loop word wears \`≡\` (0 person's cross-fold marks; the composed tuples, nine or more, in the solid's grey), no label joins a name to itself, a composed role of AC's \`r ≡ F\` chain and AB's \`F\` reads \`r ≡ F\` with the F once (on this leg's path AC holds S1 — \`r2 ≡ F1\`; the designer's drive read \`r0 ≡ F1 ≡ F1\`), and the word chain through C's, A's and B's spellings reads \`sustains [C] ≡ sustains [A] ≡ descends-from [B]\` (or A's first) in the own column — each with its corner`,
          br.present && br.glyphedWords === 0 && br.bothMarks === 0 && br.composedTuples >= 9 && !(br.labelsAll || []).some((l) => /(^|≡ )(\S+) ≡ \2(?= ≡|$)/.test(l)) && (br.labelsAll || []).some((l) => /^(r\d+ ≡ F\d+|F\d+ ≡ r\d+)$/.test(l)) && !(br.labelsAll || []).some((l) => /(F\d+) ≡ \1/.test(l)) && (br.ownWords || []).some((n) => /^sustains \[[AC]\] ≡ sustains \[[AC]\] ≡ descends-from \[B\]$/.test(n)),
          J({ glyphed: br.glyphedWords, both: br.bothMarks, composedTuples: br.composedTuples, chains: (br.labelsAll || []).filter((l) => / ≡ /.test(l)).slice(0, 8), ownChains: (br.ownWords || []).filter((n) => / ≡ /.test(n)).slice(0, 8), chips: (br.wordNames || []).filter((n) => / ≡ /.test(n)) }));
        check(`§6 [${w}×${h}] ★★ THE COMPOSED IDENTITY STATED ONCE, THE MARK THE LEAST (C-7h item 2): the word \`composed\` ONCE on the surface at ABAC, the 28 composed points hollow rings carrying no origin words`,
          br.present && br.composedWordCount === 1 && br.composedOriginWords === 0 && br.composedHollow === 28, J({ composedWord: br.composedWordCount, originWords: br.composedOriginWords, hollow: br.composedHollow }));
        const cab = out.cardAB || {};
        check(`§6 [${w}×${h}] ★★ THE CARD AT A BORN VERTEX SAYS ITS SPACE (C-7h item 10): with AB selected the card carries ONE row \`Space · derived from A and B — 20 roles · 22 words · 52 tuples\` and no Cast row; and NO FACE IS NAMED BY ITS ID anywhere on the page, at AB or at C (item 11 — the designer saw \`face face:wpx1fn\` in the card's Face opposites row; the Face opposites rows now read the corners' names; the demoted mono address sub-lines of the Cell Faces list are counted and printed, not names)`,
          Array.isArray(cab.spaceRows) && cab.spaceRows.length === 1 && cab.spaceRows[0].row === 'derived' && /^derived from [A-D] and [A-D] — 20 roles · 22 words · 52 tuples$/.test(cab.spaceRows[0].text) && cab.castRows === 0 && cab.faceIdsAsNames === 0 && card.faceIdsAsNames === 0 && (cab.faceLines || []).length > 0 && cab.faceLines.every((l) => /^face [A-Z][A-Z·]*$/.test(l)),
          J({ card: cab, faceIdsAtC: card.faceIdsAsNames, idSubLinesAtAB: cab.faceIdsOnPage, idSubLinesAtC: card.faceIdsOnPage }));
        // ─── C-9 — THE BORN FACE at the eye, where C-10b places it: NAMED at the site, READ at the face's home ───
        const homeI = out.faceHomeInterior || {}; const homeO = out.faceHomeOneCell || {}; const homeA = out.faceHomeAfter || {};
        const siteLines = (homeI.site || {}).lines || []; const hI = homeI.home || {}; const hO = homeO.home || {}; const hA = homeA.home || {};
        note(`C-9/C-10b the site's lines at ABAC: ${J(siteLines)} · blocks at the site ${(homeI.site || {}).blocks} · the interior face's home ${J({ name: hI.name, kind: hI.kind, head: hI.head, blocks: (hI.blocks || []).map((b) => ({ cells: b.cells, alike: b.alike, states: b.states, ground: b.ground, noNews: b.noNews, hands: b.hands, alikeLine: b.alikeLine, withdraws: b.withdraws })), box: hI.box })} · the one-cell face's home ${J({ name: hO.name, kind: hO.kind, head: hO.head, blocks: (hO.blocks || []).map((b) => ({ cells: b.cells, states: b.states, ground: b.ground, noNews: b.noNews, hands: b.hands })) })} · after the born pair ${J({ name: hA.name, blocks: (hA.blocks || []).map((b) => ({ states: b.states, ground: b.ground, news: b.news, noNews: b.noNews })) })}`);
        check(`§7 [${w}×${h}] ★★ THE BORN FACES NAMED AT THE SITE, READ AT THEIR HOMES (C-9 as C-10b §131 item 2 places it — the designer's blocker, the interior face 3,900 px down): at ABAC the site's TOP carries one line per born face through it — the medial face (one cell) and the interior face (two cells), each with \`select it to read it\` — and NO block; the interior face's line taken, its HOME in the selection tab reads it walked as the parent octahedron's, alike (one block and the alike line), the ground once per corner, \`nothing added by a pair of yours yet\` before any born pair, Und's hands as acts leading with WHERE — \`at ABAC, on AC–AB: a pair of yours · or at AC, on A–C: …\` — never \`here\` (no site is local to the home); the one-cell face's home reads its block walked in the face's own direction`,
          siteLines.length === 2 && siteLines.some((l) => l.kind === 'one-cell' && l.button) && siteLines.some((l) => l.kind === 'interior' && l.button) && (homeI.site || {}).blocks === 0 &&
            hI.present && hI.kind === 'interior' && /^the face [A-Z·]+ — interior, between the parent octahedron and the residue tetrahedron at A$/.test(hI.head || '') && (hI.blocks || []).length === 1 && hI.blocks[0].cells === '2' && hI.blocks[0].alike === 'true' && hI.blocks[0].alikeLine === 1 && hI.blocks[0].states.length === 1 && hI.blocks[0].states[0] === 'read' && hI.blocks[0].ground === 3 && hI.blocks[0].noNews === 3 && hI.blocks[0].hands.length === 3 && hI.blocks[0].hands.every((x) => /^at [A-Z]+, on [A-Z]+–[A-Z]+: a pair of yours · or at [A-Z]+, on [A-Z]–[A-Z]: an act on the edge it descends from$/.test(x)) && ((homeI.homeScrolled || {}).inViewport === true) &&
            hO.present && hO.kind === 'one-cell' && (hO.blocks || []).length === 1 && hO.blocks[0].cells === '1' && hO.blocks[0].states[0] === 'read' && /walked in the face's own direction/.test(hO.blocks[0].head || ''),
          J({ site: homeI.site, interior: hI, oneCell: hO }));
        check(`§7 [${w}×${h}] ★★ THE EXTENSION MARKED AND ATTRIBUTED after the born pair, at the face's home (the news is the person's own): the medial face's home keeps its ground lines; where the pair closed a route a news line reads \`+ … returns … — through your pair x ↦ y at ABAC\` naming the pair through the spaces' labels, never a key; where it closed none the block still says \`nothing added by a pair of yours yet\` (the bound printed, not the case)`,
          hA.present && (hA.blocks || []).length >= 1 && hA.blocks.every((b) => b.states.length >= 1 && b.ground === 3 * b.states.length) && hA.blocks.every((b) => b.news.every((n) => /^\+ .+ returns (to itself|as .+) — through your pairs? .+ ↦ .+ at ABAC/.test(n) && !/[AB]:[A-Za-zΦ]/.test(n))) && (hA.blocks.some((b) => b.news.length > 0) || (note('⚠ the leg\'s born pair closed no route on the medial face — the extension is empty here; the witness closes one on the same path'), true)),
          J(hA));
        // ─── C-10b — the four blockers at the eye (§131) ───
        const canvasF = out.canvasFace || {};
        check(`§9 [${w}×${h}] ★★ THE FACE IS SELECTED WHERE HE POINTS (Arman's route — explode, point at the face, click) AND THE NOTE NAMES IT (C-10b item 3): with the explode view at 60 a face under the pointer is named \`face <its D14 name>\` — no kind, no id — and the click mounts that face's reading at its home`,
          canvasF.explode === '60' && canvasF.hover && /^face [A-Z][A-Z·]*( |$)/.test(canvasF.hover) && !/id:|-face/.test(canvasF.hover) && canvasF.home && canvasF.home.present && /^[A-Z][A-Z·]+$/.test(canvasF.home.name || ''), J(canvasF));
        check(`§9 [${w}×${h}] ★★ THE NOTE ON A FACE ROW names the face (item 3: \`face AB·…\`, no \`id:\`); THE LINEAGE LINE names the dissected source (item 4): in the Cell Faces list 0 rows read \`a face this shape no longer holds\` and the derived rows read \`face derived from the (seed )face …, dissected\``,
          /^face [A-Z]/.test(homeI.readoutOnRow || '') && !/id:|-face/.test(homeI.readoutOnRow || '') && (homeI.rows || []).length > 0 && homeI.rows.every((r) => !/no longer holds/.test(r.lineage || '')) && homeI.rows.some((r) => /face derived from the (seed )?face [A-Z·]+, dissected/.test(r.lineage || '')),
          J({ readout: homeI.readoutOnRow, rows: (homeI.rows || []).slice(0, 8) }));
        // ─── C-10 — THE LIFT CARRIES at the eye ───
        const lf = out.lift || {};
        const placed = lf.placed || {}; const pab = lf.pickedAB || {}; const pf = lf.pickedFace || {}; const sc = lf.scrolled || {}; const sci = lf.scrolledInside || {}; const scf = lf.scrolledFace || {};
        note(`C-10 the lift at the eye: cell ${J(lf.cellRow)} · notice ${J(lf.liftNotice)} · shelf ${lf.shelfEntries} (${J(lf.shelfTitle)}) · placed ${J({ state: placed.state, held: placed.held, resolved: placed.resolved, rows: (placed.rows || []).map((x) => x.text), record: placed.recordLine, sectionInside: placed.sectionInside, box: placed.sectionBox, scrollBox: placed.scrollBox })}`);
        note(`C-10 AB picked: ${J(pab.insidePanel ? { id: pab.insidePanel.id, origin: pab.insidePanel.origin, placement: pab.insidePanel.placement, points: pab.insidePanel.points, glyphed: pab.insidePanel.glyphed, inside: pab.insidePanel.inside, box: pab.insidePanel.box, head: pab.insidePanel.head } : null)} · the face options ${J(pf.faceOptions)} · the face picked ${J(pf.face ? { kind: pf.face.kind, states: pf.face.states, ground: pf.face.ground, news: pf.face.news, noNews: pf.face.noNews, hands: pf.face.hands, buttons: pf.face.buttons, withdraws: pf.face.withdraws, handWords: pf.face.handWords, inside: pf.face.inside, box: pf.face.box } : null)} · after scrolling the section to the top of the card: section ${J(sc.sectionBox)} against the card's box ${J(sc.scrollBox)} · the inside panel scrolled to: top inside ${sci.insidePanel ? sci.insidePanel.topInside : null} (${sci.insidePanel ? sci.insidePanel.box.h : '?'} px tall, ${sci.insidePanel ? sci.insidePanel.box.w : '?'} wide in the ${sc.scrollBox ? sc.scrollBox.w : '?'} px column) · the face block scrolled to: top inside ${scf.face ? scf.face.topInside : null} (${scf.face ? scf.face.box.h : '?'} px tall)`);
        const nRows = (placed.rows || []).length;
        check(`§8 [${w}×${h}] ★★ THE LIFT CARRIES (C-10, step 2 — the person's sentence): the gen-1 residue at A, whose edge AB–AC holds the born pair, is lifted by the Lift button with its notice, sits on the Manuscript's shelf and is placed on the sheet by a drag; the card's section reads \`read from the record the lift carried — …: N of N corners hold a space\` with every corner as a row — A · AB · AC · AD and, lifted at gen 2, the three midpoints of its shared face (the grain law; N printed: ${nRows}) — every one holding a space`,
          lf.liftButton >= 1 && /lifted/.test(lf.liftNotice || '') && lf.shelfEntries >= 1 && placed.present && placed.state === 'read' && nRows >= 4 && placed.held === String(nRows) && placed.resolved === String(nRows) && placed.rows.every((x) => x.space !== 'none') && new RegExp(`read from the record the lift carried — .*: ${nRows} of ${nRows} corners hold a space`).test(placed.recordLine || '') && ['A', 'AB', 'AC', 'AD'].every((l) => placed.rows.some((x) => x.text.startsWith(`${l} ·`))),
          J({ button: lf.liftButton, notice: lf.liftNotice, shelf: lf.shelfEntries, placed: { present: placed.present, state: placed.state, held: placed.held, resolved: placed.resolved, rows: (placed.rows || []).map((x) => x.text), record: placed.recordLine } }));
        const drawingOnSheet = pab.drawing || null;
        note(`C-10b the card's rows: ${J((placed.rows || []).map((x) => x.text))} · the drawing on the sheet: ${J(drawingOnSheet)}`);
        check(`§8 [${w}×${h}] ★★ THE LIFTED INSIDE IS WHOLE OR WORDS (C-10b item 1, the designer's blocker — the inside CLIPPED in the card's column): on the card each corner is ONE LINE OF WORDS \`AB · holds a space of N roles · M words · K tuples · open the drawing\` and no drawing mounts in the column; \`open the drawing\` on AB mounts the Ambo's own inside panel on the SHEET, outside the card, inside the viewport, ${w === 1689 ? 'UNCLIPPED — its box holds its whole width' : 'its width against the viewport printed (the 1689 viewport is the acceptance)'}, with AB's points and the person's \`≡\``,
          placed.present && (placed.rows || []).every((x) => x.space === 'none' || /holds a space of \d+ roles · \d+ words · \d+ tuples · open the drawing$/.test(x.text)) && placed.insidePanel === null && placed.openButtons >= 4 && pab.openState === 1 && drawingOnSheet && drawingOnSheet.points >= 20 && drawingOnSheet.glyphed >= 1 && drawingOnSheet.outsideCard === true && drawingOnSheet.inViewport === true && (w !== 1689 || drawingOnSheet.clipped === false),
          J({ rows: (placed.rows || []).map((x) => x.text), drawing: drawingOnSheet, openButtons: placed.openButtons, openState: pab.openState }));
        check(`§8 [${w}×${h}] ★★ THE LIFTED FACE'S READING at the eye: the medial face AB·AC·AD picked from the D14-named list mounts the Ambo's own born-face block on the record — read, the ground once per corner, the hands as WORDS (\`at ABAC, on AB–AC: a pair of yours …\`), no withdraw button; where the born pair closed a route the news line names it (\`… through your pair … at ABAC\`) — printed`,
          lf.medialOption && pf.face && pf.face.kind === 'born' && (pf.face.states || []).length >= 1 && pf.face.states.every((s) => s === 'read') && pf.face.ground === 3 * pf.face.states.length && pf.face.withdraws === 0 && pf.face.buttons === 0 && (pf.face.hands || []).length >= 1 && pf.face.hands.every((x) => /^at [A-Z]+, on [A-Z]+–[A-Z]+: a pair of yours/.test(x)) && (pf.face.news || []).every((n) => /through your pairs? .* at ABAC/.test(n)) && scf.face && scf.face.topInside === true,
          J({ option: lf.medialOption, face: pf.face ? { kind: pf.face.kind, states: pf.face.states, ground: pf.face.ground, news: pf.face.news, hands: pf.face.hands, buttons: pf.face.buttons, withdraws: pf.face.withdraws, text: (pf.face.text || '').slice(0, 300) } : null, scrolledTopInside: scf.face ? scf.face.topInside : null, box: scf.face ? scf.face.box : null }));
        // ─── C-11a — THE DOOR's ACT at the eye (§133, Option R — the room's door, the aperture's pairing row) ───
        const lg = out.liftGen1 || {};
        const dr = out.door || {};
        const dPlaced = dr.placed || {};
        const dEmpty = (dr.empty || {}).door || null; const dScrolled = (dr.scrolled || {}).door || null; const dPicked = (dr.picked || {}).door || null;
        const dTaken = (dr.taken || {}).door || null; const dRefL = (dr.refusedLines || {}).door || null; const dAfter = (dr.afterHand || {}).door || null;
        const dRefR = (dr.refusedRecord || {}).door || null; const dWith = (dr.withdrawn || {}).door || null; const dAgain = (dr.givenAgain || {}).door || null; const dGlued = dr.glued || {};
        note(`C-11a the door at the eye: the gen-1 lift ${J({ cell: lg.cellRow, button: lg.liftButton, notice: lg.liftNotice })} · shelf ${J(dr.shelfTitles)} · placed rows ${J((dPlaced.rows || []).map((x) => x.text))} · aperture ${J(dr.apertureButton)} · faces ${J(dr.faces)} · hinge ${J(dr.hinge)}`);
        note(`C-11a the empty door: ${J(dEmpty ? { id: dEmpty.id, state: dEmpty.state, empty: dEmpty.empty, corners: dEmpty.corners, chipStyles: dEmpty.chipStyles, chipCrossing: dEmpty.chipCrossing, box: dEmpty.box, rowsBox: dEmpty.rowsBox, rowsScrollHeight: dEmpty.rowsScrollHeight, topInsideRows: dEmpty.topInsideRows, inViewport: dEmpty.inViewport } : null)} · scrolled ${J(dScrolled ? { topInsideRows: dScrolled.topInsideRows, inViewport: dScrolled.inViewport, box: dScrolled.box, rowsScrollTop: dScrolled.rowsScrollTop } : null)}`);
        note(`C-11a taken: ${J(dTaken ? { head: dTaken.head, taken: dTaken.taken, lines: dTaken.lineBlocks, takenChips: dTaken.takenChips } : null)} · refused by the lines: ${J(dRefL ? { refusal: dRefL.refusal, hands: dRefL.refusalHands, lines: dRefL.lines } : null)} · after the hand: ${J(dAfter ? dAfter.refusal : null)} · refused by the record: ${J(dRefR ? dRefR.refusal : null)} · withdrawn: ${J(dWith ? { lines: dWith.lines, empty: dWith.empty } : null)} · given again: ${J(dAgain ? dAgain.lines : null)} · glued: ${J({ door: dGlued.door, notice: dGlued.notice })}`);
        check(`§10 [${w}×${h}] ★★ A ROOM FROM A LIFTED FORM (C-11a): the gen-1 residue at A is lifted BEFORE the second dissection (the Ambo mounts no way back to an earlier shape; the finer-grained gen-2 residue cannot be glued today), sits on the shelf beside the C-10 form, is placed on the sheet by a drag and reads its four corners on the record (A · AB · AC · AD); the aperture opens ON it (\`aperture — build a 3-manifold (on …)\`)`,
          lg.liftButton >= 1 && /lifted/.test(lg.liftNotice || '') && (dr.shelfTitles || []).length >= 1 && dPlaced.present && dPlaced.state === 'read' && (dPlaced.rows || []).length === 4 && ['A', 'AB', 'AC', 'AD'].every((l) => dPlaced.rows.some((x) => x.text.startsWith(`${l} ·`))) && /^aperture — build a 3-manifold \(on /.test(dr.apertureButton || ''),
          J({ lg, shelf: dr.shelfTitles, rows: (dPlaced.rows || []).map((x) => x.text), button: dr.apertureButton }));
        check(`§10 [${w}×${h}] ★★ THE DOOR GIVEN AT THE ROW (faces + map picked from the row's three selects): A·AC·AB ~ A·AB·AD on the hinge map \`A→A · AC→AD · AB→AB — preserving (derived)\`; under the row the door's act mounts in the EMPTY STATE — the designer's words verbatim, \`the door A·AC·AB → A·AB·AD — glued by you · carries no concept yet: a cargo crossing it arrives did not return\` — with the three corner pairs (A→A · AC→AD · AB→AB) and both sides' roles as chips (14 · 19 · 20 on one side, 14 · 23 · 20 on the other — the record as this run's earlier acts left it), no line, no refusal, no cannot-cross line`,
          dr.faces && dr.faces[0] === 'A·AC·AB · 3 corners' && dr.faces[1] === 'A·AB·AD · 3 corners' && /^A→A · AC→AD · AB→AB — preserving \(derived\)/.test(dr.hinge || '') && dEmpty && dEmpty.state === 'read' && dEmpty.id === 'A·AC·AB→A·AB·AD' && dEmpty.empty === 'the door A·AC·AB → A·AB·AD — glued by you · carries no concept yet: a cargo crossing it arrives did not return' && J((dEmpty.corners || []).map((c) => c.pair)) === J(['A→A', 'AC→AD', 'AB→AB']) && J(dEmpty.corners.map((c) => [c.a, c.b])) === J([[14, 14], [19, 23], [20, 20]]) && dEmpty.lines === '0' && dEmpty.refusal === null && dEmpty.cannotCross === null,
          J({ faces: dr.faces, hinge: dr.hinge, door: dEmpty }));
        check(`§10 [${w}×${h}] ★★ NOTHING OFFERED, NOTHING LIT (the caster's order): every untaken chip of the door wears ONE computed style whether or not its role can cross (chipStyles 1); a first pick outlines exactly one chip; the door block is reached inside the rows region's bounded scroll (its top inside the region once scrolled to — the region's box, the door's box and the scroll height printed for the designer's plate)`,
          dEmpty && dEmpty.chipStyles === 1 && dPicked && dPicked.pickedChips === 1 && dScrolled && dScrolled.topInsideRows === true && dScrolled.inViewport === true,
          J({ chipStyles: dEmpty && dEmpty.chipStyles, picked: dPicked && dPicked.pickedChips, scrolled: dScrolled && { topInsideRows: dScrolled.topInsideRows, inViewport: dScrolled.inViewport, box: dScrolled.box, rowsBox: dScrolled.rowsBox } }));
        check(`§10 [${w}×${h}] ★★ TAKEN — THE WHOLE LINE, ONE HAND: F1 at A pointed, then F1 at A on the other side — the sentence \`taken — F1 ↦ F1 at A, and with it the whole line along A→AC→AB→A: at A F1 ↦ F1 · at AC r2 ≡ F1 ↦ F1 · at AB F1 ↦ F1\` (C-12a item 1 — each pair at its corner) (F1's class at AC named by this run's own pair on C–A); the line stands marked \`yours · a whole line along A→AC→AB→A: …\` with exactly ONE hand \`withdraw the line F1 ↦ F1\` (never a hand per pair); 6 chips marked yours (both sides); the head reads \`carries 3 role pairs on 1 whole line\``,
          dTaken && dTaken.lines === '1' && dTaken.pairs === '3' && /^taken — F1 ↦ F1 at A, and with it the whole line along A→AC→AB→A: at A F1 ↦ F1 · at AC [^·]+ ≡ [^·]+ ↦ F1 · at AB F1 ↦ F1$/.test(dTaken.taken || '') && (dTaken.lineBlocks || []).length === 1 && /^yours · a whole line along A→AC→AB→A: at A F1 ↦ F1 · at AC [^·]+ ≡ [^·]+ ↦ F1 · at AB F1 ↦ F1$/.test(dTaken.lineBlocks[0].words || '') && J(dTaken.lineBlocks[0].hands) === J(['withdraw the line F1 ↦ F1']) && dTaken.takenChips === 6 && /carries 3 role pairs on 1 whole line$/.test(dTaken.head || ''),
          J(dTaken));
        check(`§10 [${w}×${h}] ★★ REFUSED BY THE LINES at the edge where they part, in the one grammar with its LOCAL hand: F2 at AC (an A-role — every A-role rides the cycle A→AC→AB→A through the corner edges) pointed at Φ1 at AD (D's own, a line of one) — \`not taken — along AC→AB, F2's line runs on and Φ1's stops\` · \`here, at the door: withdraw this attempt\` (one hand); the standing line keeps its own; the hand clears the attempt`,
          dRefL && dRefL.refusal === "not taken — along AC→AB, F2's line runs on and Φ1's stops" && J(dRefL.refusalHands) === J(['here, at the door: withdraw this attempt']) && dRefL.lines === '1' && dAfter && dAfter.refusal === null && dAfter.lines === '1',
          J({ refused: dRefL && { refusal: dRefL.refusal, hands: dRefL.refusalHands, lines: dRefL.lines }, after: dAfter && { refusal: dAfter.refusal, lines: dAfter.lines } }));
        check(`§10 [${w}×${h}] ★★ REFUSED BY THE RECORD at a corner, the tuple named: at the hinge corner AB the two faces share, Φ4 pointed at Φ9 (two of B's Φ roles, lines of one, equal in shape) — \`not taken — at AB, the record would say two things about member_status(Φ4): has here, none-by-nature there\` with the same local hand`,
          dRefR && dRefR.refusal === 'not taken — at AB, the record would say two things about member_status(Φ4): has here, none-by-nature there' && J(dRefR.refusalHands) === J(['here, at the door: withdraw this attempt']),
          J(dRefR && { refusal: dRefR.refusal, hands: dRefR.refusalHands }));
        check(`§10 [${w}×${h}] ★ THE WHOLE-LINE WITHDRAWAL, then the line given again: the one hand removes the three pairs at once — the empty state returns (its words again, 0 lines) — and F1 ↦ F1 pointed again is taken again (1 line)`,
          dr.lineHands === 1 && dWith && dWith.lines === '0' && dWith.empty === 'the door A·AC·AB → A·AB·AD — glued by you · carries no concept yet: a cargo crossing it arrives did not return' && dAgain && dAgain.lines === '1',
          J({ hands: dr.lineHands, withdrawn: dWith && { lines: dWith.lines, empty: dWith.empty }, again: dAgain && dAgain.lines }));
        check(`§10 [${w}×${h}] ★★ THE DOOR GLUED INTO A ROOM with its transport riding the row into the built record: \`glue — the S² gate judges\` → \`glued — H₁ 0 · the aperture opens in the dim-3 band\`; the rows reset (no door block stands) — the record persists what he gave (pinned under node by diagnose-the-doors-act §3)`,
          dr.glueButton >= 1 && dGlued.present && dGlued.door === null && /^glued — H₁ 0 · the aperture opens in the dim-3 band$/.test(dGlued.notice || ''),
          J({ glue: dr.glueButton, glued: { door: dGlued.door, notice: dGlued.notice } }));
        // ─── C-11b — THE CARGO ON THE WALK at the eye (§135) ───
        const cg = out.cargo || {};
        const cOpen = cg.opened || {}; const cPick = cg.picked || {}; const cRod = cg.afterRod || {}; const cDoor = cg.afterDoor || {}; const cHome = cg.home || {}; const cLost = cg.lost || {};
        note(`C-11b the cargo at the eye: room ${J(cg.room && cg.room.name)} · summon ${J({ candidates: cg.candidates, tries: (cg.summonTries || []).length, last: (cg.summonTries || []).slice(-1)[0] })} · chip ${cg.exploreChip} · opened ${J({ present: cOpen.present, state: cOpen.state, picks: (cOpen.picks || []).length, text: cOpen.text, legend: cOpen.legend, box: cOpen.box })} · picked ${J({ state: cPick.state, words: cPick.words, rods: cPick.rods })} · rod ${J({ state: cRod.state, words: cRod.words, route: cRod.route })} · door ${J({ state: cDoor.state, words: cDoor.words, route: cDoor.route, doors: cDoor.seam && cDoor.seam.doors, trace: cDoor.seam && cDoor.seam.trace })} · home ${J({ state: cHome.state, words: cHome.words, route: cHome.route })} · lost ${J({ state: cLost.state, words: cLost.words, route: cLost.route, picks: (cLost.picks || []).length })}`);
        check(`§11 [${w}×${h}] ★★ THE ROOM WALKED WITH A CARGO (C-11b): the room built from the lifted gen-1 residue is summoned on the sheet, its walk window opens, and the cargo line stands beside trace · tally · sentence in the PICK state — \`carry from the corner A:\` with A's 14 roles as buttons; the legend states the rod act`,
          cg.room && cg.exploreChip >= 1 && cOpen.present && cOpen.state === 'pick' && /^carry from the corner A:/.test(cOpen.text || '') && (cOpen.picks || []).length === 14 && cOpen.legend === true && cOpen.inViewport === true,
          J({ room: cg.room, chip: cg.exploreChip, opened: cOpen }));
        check(`§11 [${w}×${h}] ★★ PICKED AND CARRIED BY HIS HAND: F1 picked — \`carrying F1 — at the corner A\` with the rods A–AC · A–AB · A–AD as buttons (nothing lit); the rod A–AC pressed — \`carrying F1 — at the corner AC, came along A–AC as r2 ≡ F1\` (the class this run's own pair on C–A names)`,
          cPick.state === 'carrying' && cPick.words === 'carrying F1 — at the corner A' && J((cPick.rods || []).slice().sort()) === J(['A–AB', 'A–AC', 'A–AD']) && cg.rodAC >= 1 && cRod.state === 'away' && cRod.words === 'carrying F1 — at the corner AC, came along A–AC as r2 ≡ F1' && cRod.route === 'A–AC',
          J({ picked: cPick, rod: cRod }));
        check(`§11 [${w}×${h}] ★★ THROUGH THE DOOR by its letter: one press of \`a\` walks one period — the trace writes \`a\`, doors 1 — and the door's transport at AC carries the cargo to AD: \`carrying F1 — at the corner AD as F1, by A–AC · a\``,
          cDoor.seam && cDoor.seam.doors === 1 && cDoor.seam.trace === 'a' && cDoor.state === 'away' && cDoor.words === 'carrying F1 — at the corner AD as F1, by A–AC · a' && cDoor.route === 'A–AC · a',
          J({ door: cDoor }));
        check(`§11 [${w}×${h}] ★★ HOME: the rod AD–A pressed — \`carrying F1 — returned to itself by A–AC · a · AD–A\` (Fix, the reduced route printed)`,
          cg.rodA >= 1 && cHome.state === 'home-fix' && cHome.words === 'carrying F1 — returned to itself by A–AC · a · AD–A' && cHome.route === 'A–AC · a · AD–A',
          J({ home: cHome }));
        check(`§11 [${w}×${h}] ★★ A CARGO THE DOOR DOES NOT CARRY: the window reopened (a room opened is a walk begun — nothing carried), F2 picked, carried along A–AC, the door \`a\` pressed — \`carrying F2 — not here by A–AC · a: lost at the door a, which does not carry it\` and the picks return (\`carry again from the corner A:\`)`,
          cLost.state === 'lost-door' && cLost.words === 'carrying F2 — not here by A–AC · a: lost at the door a, which does not carry it' && /carry again from the corner A:/.test(cLost.text || '') && (cLost.picks || []).length === 14,
          J({ reopened: cg.reopened && { state: cg.reopened.state, doors: cg.reopened.seam && cg.reopened.seam.doors }, lost: cLost }));
        // ─── C-12a — THE FOUND BUGS at the eye (§144, Δ95): items 2 · 3 · 5 · 6 · 8 (item 1 in §10 above; 4 stopped; 7 in its own witness) ───
        const bc = out.badgeClick || {};
        check(`§12 [${w}×${h}] ★★ THE BADGE PICKS (item 5 — measured; the premise did not reproduce): a click on the \`· has\` badge beside F1 at the AB drawing — on the box's top edge (whitespace between glyphs) and at its centre — picks F1; the label click unpicks (the pick toggles); the state restored before the acts`,
          bc.box && /member_status=has/.test(bc.box.badge || '') && J(bc.afterTopEdge) === J(['A|F1']) && J(bc.afterLabel) === J([]) && J(bc.afterCentre) === J(['A|F1']) && J(bc.afterCentreAgain) === J([]), J(bc));
        const aw = out.abWords || {};
        const ownDraw = aw.own || '';
        const liftWords = ((((out.lift || {}).pickedAB || {}).drawing || {}).words) || [];
        const liftJoined = liftWords.join(' | ');
        check(`§12 [${w}×${h}] ★★ THE LONE WORD WEARS ITS CORNER at the eye (item 6): in the LIFTED drawing at AB (C-10's \`open the drawing\` — no origin is written there) the words read \`presupposes ≡ specifies\` (A's, chained by his pair) and \`presupposes [B]\` (B's, lone) and no bare \`presupposes\`; in the midpoint's own drawing the bracket is stripped BY DESIGN and the origin written instead (C-7f item 4) — every bare \`presupposes\` there reads \`presupposes from B\`; the sources' chips keep their plain names`,
          /presupposes ≡ specifies/.test(liftJoined) && /presupposes \[B\]/.test(liftJoined) && !/presupposes/.test(liftJoined.replace(/presupposes ≡ specifies|presupposes \[B\]/g, '')) && /presupposes ≡ specifies/.test(ownDraw) && !/presupposes/.test(ownDraw.replace(/presupposes ≡ specifies|presupposes from B/g, '')) && (aw.chips || []).includes('A|presupposes') && (aw.chips || []).includes('B|presupposes'),
          J({ lifted: liftWords.filter((t) => /presupposes/.test(t)), liftedCount: liftWords.length, ownBare: (ownDraw.replace(/presupposes ≡ specifies|presupposes from B/g, '').match(/presupposes/g) || []).length, chips: (aw.chips || []).filter((c) => /presupposes/.test(c)) }));
        const gn = out.genealogy || {};
        const rowText = (rows, i) => ((rows || [])[i] || {}).text || '';
        note(`C-12a the genealogy at the eye: ${J(gn)}`);
        check(`§12 [${w}×${h}] ★★ THE WAY BACK (item 3): the workspace tab's Genealogy panel lists the session's shapes — \`Tetrahedron g0\` · \`Ambo Dissection Tetrahedron g1\` · \`Ambo Dissection Tetrahedron g2\` (the name ONCE at gen 2, item 2) — the current marked; g1 chosen is current — its row marked, reading gen 1's own census \`core:1 residue:4\` (and the arms that follow select gen 2's cuboctahedron, the store's own word); gen 1's core dissected AGAIN returns the EXISTING gen 2 (§148 ruling 3 at the eye: still three rows, g2 current, no fourth shape) — then g2 chosen again (\`parent:2 core:1 residue:10\`)`,
          (gn.rows || []).length === 3 && /^Tetrahedron g0\b/.test(rowText(gn.rows, 0)) && /^Ambo Dissection Tetrahedron g1\b/.test(rowText(gn.rows, 1)) && /^Ambo Dissection Tetrahedron g2\b/.test(rowText(gn.rows, 2)) && gn.rows[2].current === true && gn.g1Buttons === 1 && (gn.rowsAtG1 || [])[1] && gn.rowsAtG1[1].current === true && /core:1 residue:4$/.test(rowText(gn.rowsAtG1, 1)) && gn.rowsAtG1.filter((r) => r.current).length === 1 && (gn.rowsAfterRedissect || []).length === 3 && gn.rowsAfterRedissect[2].current === true && /parent:2 core:1 residue:10$/.test(rowText(gn.rowsAfterRedissect, 2)) && (gn.rowsAtG2 || [])[2] && gn.rowsAtG2[2].current === true && /parent:2 core:1 residue:10$/.test(rowText(gn.rowsAtG2, 2)) && gn.rowsAtG2.filter((r) => r.current).length === 1,
          J(gn));
        const lg2 = out.liftGen1 || {}; const lf2 = out.lift || {};
        const NOTICE = 'lifted “the tetrahedron A·AB·AC·AD of Ambo Dissection Tetrahedron” → the Manuscript shelf';
        check(`§12 [${w}×${h}] ★★ A CELL NAMED BY ITS KIND AND CORNERS, THE UNIVERSE ONCE (item 2): the gen-1 lift's notice reads \`${NOTICE}\`; the gen-2 lift's notice the same words (the finer grain rides the shape; the name says the dissection once); every shelf title carries the words and no \`cell:\`, no doubled name`,
          lg2.liftNotice === NOTICE && lf2.liftNotice === NOTICE && (lf2.shelfTitles || []).length >= 1 && lf2.shelfTitles.every((t) => /the tetrahedron A·AB·AC·AD of Ambo Dissection Tetrahedron/.test(t) && !/cell:/.test(t) && !/Ambo Dissection Ambo Dissection/.test(t)),
          J({ g1: lg2.liftNotice, g2: lf2.liftNotice, shelf: lf2.shelfTitles }));
        const di = cg.domainInterior || {};
        const groupClick = (log) => (log || []).some((e) => e.on === 'onClick' && e.obj === 'Group' && e.detail === 2);
        const rootClick = (log) => (log || []).some((e) => e.on === 'onClick' && /^ROOT/.test(e.obj));
        check(`§12 [${w}×${h}] ★★ THE ROOM TAKEN WHERE ITS BODY IS HIT (item 8): the summon's FIRST candidate — the plaque's centre projected through the Manuscript's own canvas — takes the room (the driver once projected through the Ambo's hidden canvas and needed up to 13 tries); and with the room selected a double-click inside its drawn domain reaches the ROOM's group (its click handler fires, the paper's does not — the hit hull), toggling it off (\`pick\`'s law; its domain then leaves the sheet) — and the plaque takes it back`,
          cg.summonTakenAt === 1 && di.hull === true && di.hullTriangles >= 4 && groupClick(cg.domainInteriorClicks) && !rootClick(cg.domainInteriorClicks) && cg.chipAfterInterior && cg.chipAfterInterior.opacity === '0.38' && cg.chipAfterReselect && cg.chipAfterReselect.opacity === '1',
          J({ before: cg.chipBeforeSummon, tries: cg.summonTries, takenAt: cg.summonTakenAt, interior: di, clicks: cg.domainInteriorClicks, chip: cg.chipAfterInterior, reselect: cg.chipAfterReselect }));
        const cc = out.composedClick || {};
        check(`§6 [${w}×${h}] ★ A COMPOSED POINT CLICKED PICKS NOTHING (item 3 — never a pair, never a control): no pick, no line, no refusal`, br.present && cc.pick === null && (cc.lines || []).length === 0 && !cc.refusal, J(cc));
        const bp = out.bornPair || {};
        check(`§6 [${w}×${h}] ★★ A BORN PAIR BY TWO CLICKS in the born room: one line across the fold marked yours, born here — the record on the medial edge holds the born pair alone`, bp.lines && bp.lines.length === 1 && bp.lines[0] === `${bp.x}↦${bp.y}` && /1 role pair · 0 word pairs — yours, born here/.test(bp.sentence || '') && !bp.refusal, J(bp));
        const dp = out.dependency || {}; const da = out.dependencyAfter || {};
        note(`the dependency at AB (gen 2): the attempt ${J(dp.attempt)} → ${dp.refusalText || 'no refusal'} · hands ${J(dp.dependencyHands)} · after the far hand: ${J(da)}`);
        check(`§6 [${w}×${h}] ★★ THE DEPENDENCY REFUSAL AT THE EYE (item 4, the designer's grammar): back at AB, a gen-0 pair that re-glues the role the born pair named is NOT TAKEN in TWO sentences (C-7h item 8, the designer's) — \`not taken — F1 ↦ Φ3 would make Φ3 one with F1.\` then \`your pair at ABAC, one generation up, needs Φ3 as its own role: r3 ↦ Φ3.\` — with two hands, \`here, on A–B: withdraw this attempt\` and \`at ABAC (one generation up): withdraw … first\`; the far hand clicked and the attempt withdrawn, the same pair made again is TAKEN`,
          dp.dependency && /^[^|]+\|[^|]+\|[^|]+\|1$/.test(dp.dependency) && /^not taken — .+ ↦ .+ would make .+ one with .+\.$/.test(dp.refusalAct || '') && /^your pair at ABAC, one generation up, needs .+ as its own role: .+ ↦ .+\.$/.test(dp.refusalCollision || '') && dp.oldGrammar === false && (dp.dependencyHands || []).length === 2 && /^here, on A–B: withdraw this attempt$/.test(dp.dependencyHands[0]) && /^at ABAC \(one generation up\): withdraw .+ ↦ .+ first$/.test(dp.dependencyHands[1]) &&
            da.refusal === null && Array.isArray(da.lines) && da.lines.includes(`${dp.attempt[0]}↦${dp.attempt[1]}`),
          J({ dp, da }));
        // C-7e — THE SECOND DISSECTION AT THE EYE
        const g2 = out.gen2 || { present: false, lines: [], wordPairs: [], sourceActs: [] };
        note(`gen 2 — selected ${J(out.selectGen2Parent)} then ${J(out.selectAB3)} · panel ${J(g2.panel)} · word half ${J(g2.wordHalf)} · drawing top ${g2.drawing ? g2.drawing.y : '?'} · ${g2.counts || 'no counts'}`);
        const ab0 = out.abBefore || {}; const ac0 = out.acBefore || {};
        check(`§2 [${w}×${h}] ★★ THE ACTS SURVIVE THE SECOND DISSECTION (C-7e, Δ84 "pay the price"): the core dissected again with the records as they stood — at gen 2 the AB midpoint reads THE SAME role pairs and word pairs it read just before (3 + 3, yours), draws its own diagram (20 points, 4 both) and its trace (20 roles), its source C still carries the C–A acts, and the AC midpoint reads the same pairs it read before (after C-5's arm: S1's five and one word pair)`,
          g2.present && J(g2.lines) === J(ab0.lines) && J(g2.wordPairs) === J(ab0.wordPairs) && g2.lines.length === 3 && g2.wordPairs.length === 3 && g2.own === 'glued' && g2.ownPoints === 20 && g2.ownBoth === 4 && /20 roles/.test(g2.counts || '') && /3 role pairs · 3 word pairs — yours/.test(g2.sentence || '') &&
            g2.sourceActs.some((s) => /^on [A-D]–[A-D]: .+ ↦ .+ · sustains ↦ sustains/.test(s)) && Boolean(out.gen2AC && out.gen2AC.present) && J(out.gen2AC.lines) === J(ac0.lines) && J(out.gen2AC.wordPairs) === J(ac0.wordPairs) && (ac0.lines || []).length > 0,
          J({ present: g2.present, lines: g2.lines, before: ab0.lines, wordPairs: g2.wordPairs, own: g2.own, ownPoints: g2.ownPoints, ownBoth: g2.ownBoth, counts: g2.counts, sentence: g2.sentence, sourceActs: g2.sourceActs, ac: out.gen2AC, acBefore: ac0 }));
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
  console.log(`\n${failures === 0 ? 'DIAGNOSE-THE-CONCEPT-LAYER-EYE: ALL PASS — both halves of the midpoint\'s act are in the person\'s visible box and made by clicks; the midpoint draws its own space; the sources carry the person\'s neighbouring acts; the acts survive a second dissection; the designer\'s eight read at the eye; the face refuses and reads with its direction stated; her second cut read at the eye — the lane, the width, the card, the face\'s lines; the born room reached lawfully, a born pair taken, a later act that would break it refused with two hands' : `DIAGNOSE-THE-CONCEPT-LAYER-EYE: ${failures} FAILURE(S)`}`);
  process.exit(failures === 0 ? 0 : 1);
})();
