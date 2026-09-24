"""THE CONCEPT LAYER AT THE EYE — the driven half of scripts/app-leg/diagnose-the-concept-layer-eye.cjs (DRIVE FAMILY).

Drives the RUNNING Ambo (the url given) at the person's viewport (1689 × 897 by default — Arman's, from his own plate; and
1400 × 900) with casts on all four corners of the seed tetrahedron (Flow on A, Φ on B, the T cell on C, Φ on D), applies
the ambo, selects the midpoint AB, and captures WHAT A PERSON SEES — never what a hook proves exists (Δ83's law: a
witness that locates a control by its data attribute proves it exists; only an eye proves it can be found):
  · REACHABILITY: are both halves of the act (the role columns, the word rows) inside the panel's visible box at scroll
    0, and does the sentence at the top name both halves;
  · the acts themselves: a role pair by two clicks in the drawing, a word pair by two clicks in the rows, each drawn as
    the person's (`yours · withdraw`);
  · the midpoint's OWN diagram after mapping; the projection sources carrying the acts on A–C once given;
  · the refusal at the act with its hands; the covering (halo rects) and the arc-word collisions, counted;
  · C-7e (Δ84): the core dissected AGAIN with the pairs given — at gen 2 the AB midpoint's pairs, own diagram, trace and
    its source's neighbouring act, read as a person would (the octahedron — the gen-1 core, now the parent — selected in
    the workspace tree, AB selected from its corners);
  · C-5 (1705): the FACE at the eye — the empty-core guard in words, the face REFUSED with three hands, one hand withdrawn
    and the face READ with its direction stated;
  · C-8 (Δ85 · Δ86 — THE DRIVE FAMILY RUNS ON THE LAWFUL PATH ONLY: a cast is loaded on the seed's corners and NOWHERE
    else; the C-5 item-0 arm that loaded casts onto AB and AC — the shortcut — is retired): THE BORN ROOM at the gen-2
    midpoint ABAC reached by pointing at AB and AC and dissecting — the shared corner's roles marked composed on both
    sides and never a pair, a composed point unpickable, a born pair by two clicks in the born room, the record's home
    and the site in words; the DEPENDENCY REFUSAL at the eye — back at AB, a gen-0 pair that re-glues the role the born
    pair named refused with two hands, the far hand taken and the act then taken; the loader ABSENT at a midpoint;
  · C-7g (the designer's second cut): the label lane is arity-1's — no binary word left of its point, none end-anchored;
    the width bounded by the wrap (the widest positioned line and the drawing's width against the panel, printed); the
    card's term-order rows grouped by reading, its height at the T cell (C) and at Φ (B); the face block's clauses each on
    its own line with the verdict never orphaned, the hands leading with WHERE;
  · plates into scripts/app-leg/_frames/ (the ignored dir — a witness never writes into the tracked tree).
Prints ONE JSON line at the end; the .cjs leg asserts on it.
"""
import argparse
import json
import re
import sys

from playwright.sync_api import sync_playwright

FIX = 'scripts/fixtures/casts/'

MEASURE = """() => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right) }; };
  const panel = document.querySelector('[data-midpoint-surface]');
  if (!panel) return { present: false };
  const P = r(panel);
  const inside = (b) => b && b.y >= P.y && b.bottom <= P.bottom && b.x >= P.x && b.right <= P.right;
  const t = (sel) => [...panel.querySelectorAll(sel)].map((e) => e.textContent.replace(/\\s+/g, ' ').trim());
  const a = (sel, name) => [...panel.querySelectorAll(sel)].map((e) => e.getAttribute(name));
  const box = (el) => { const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, r: b.right, b: b.bottom }; };
  // C-7g: an overlap is MORE THAN HALF A PIXEL — measured: two lines on the column's 15 px grid have 15 px boxes that meet
  // at the same y to a few millionths of a pixel, and the strict test counted that touch as an overlap
  const inter = (p, q) => p.x < q.r - 0.5 && q.x < p.r - 0.5 && p.y < q.b - 0.5 && q.y < p.b - 0.5;
  const drawing = panel.querySelector('[data-midpoint-drawing]');
  const perColumn = drawing ? [...drawing.querySelectorAll('[data-inside-column]')].map((col) => {
    const words = [...col.querySelectorAll('[data-inside-arc-word]')].map((e) => box(e));
    const labels = [...col.querySelectorAll('[data-inside-label]')].map((e) => box(e.closest('text')));
    let ww = 0; let wl = 0;
    for (let i = 0; i < words.length; i += 1) for (let j = i + 1; j < words.length; j += 1) if (inter(words[i], words[j])) ww += 1;
    for (const w of words) for (const l of labels) if (inter(w, l)) wl += 1;
    return { arcWords: words.length, wordWordOverlaps: ww, wordLabelOverlaps: wl };
  }) : [];
  // C-7g item 1 — THE LABEL LANE IS ARITY-1'S: per column, arc/loop words whose box lies left of the column's point x, and
  // end-anchored texts holding one (both must be 0); item 2 — the positioned lines' widths and the blocks that wrapped
  const laneOf = (root) => (root ? [...root.querySelectorAll('[data-inside-column]')].map((col) => {
    const c = col.querySelector('[data-inside-point] circle');
    const cx = c ? c.getBoundingClientRect().x + c.getBoundingClientRect().width / 2 : null;
    const words = [...col.querySelectorAll('[data-inside-arc-word], [data-inside-loop-word]')];
    return { cx: cx === null ? null : Math.round(cx), words: words.length, inLane: cx === null ? null : words.filter((e) => e.getBoundingClientRect().right <= cx).length, endAnchored: [...col.querySelectorAll('text[text-anchor="end"]')].filter((t) => t.querySelector('[data-inside-arc-word], [data-inside-loop-word]')).length };
  }) : []);
  const linesOf = (root) => (root ? [...root.querySelectorAll('[data-inside-line]')].map((e) => e.getBoundingClientRect().width) : []);
  const wrappedOf = (root) => (root ? [...root.querySelectorAll('text')].filter((t) => t.querySelectorAll('[data-inside-line]').length > 1).length : 0);
  const ownDrawing = panel.querySelector('[data-midpoint-own-drawing]');
  const gesture = document.querySelector('[data-ambo-gesture-line]');
  return {
    laneWords: laneOf(drawing), ownLane: laneOf(ownDrawing), widestLine: linesOf(drawing).length ? Math.round(Math.max(...linesOf(drawing))) : 0, lines: linesOf(drawing).length, wrappedBlocks: wrappedOf(drawing), ownWidestLine: linesOf(ownDrawing).length ? Math.round(Math.max(...linesOf(ownDrawing))) : 0, ownWrappedBlocks: wrappedOf(ownDrawing),
    present: true, state: panel.getAttribute('data-midpoint-state'), scrollTop: panel.scrollTop, scrollHeight: panel.scrollHeight, clientHeight: panel.clientHeight, panel: P,
    gestureSentence: t('[data-midpoint-gesture]')[0] || null, gestureVisible: inside(r(panel.querySelector('[data-midpoint-gesture]'))),
    wordHalf: r(panel.querySelector('[data-midpoint-word-half]')), wordHalfVisible: inside(r(panel.querySelector('[data-midpoint-word-half]'))),
    wordsA: r(panel.querySelector('[data-midpoint-words="A"]')), wordsB: r(panel.querySelector('[data-midpoint-words="B"]')),
    wordsVisible: inside(r(panel.querySelector('[data-midpoint-words="A"]'))) && inside(r(panel.querySelector('[data-midpoint-words="B"]'))),
    drawing: r(drawing), drawingTopVisible: drawing ? r(drawing).y < P.bottom - 80 : false,
    wordChipsAreButtons: [...panel.querySelectorAll('[data-midpoint-word]')].every((e) => e.tagName === 'BUTTON'),
    sentence: t('[data-midpoint-sentence]')[0] || null, lines: a('[data-midpoint-line]', 'data-midpoint-line'), wordPairs: a('[data-midpoint-word-pair]', 'data-midpoint-word-pair'),
    counts: t('[data-midpoint-counts]')[0] || null, core: t('[data-midpoint-core]')[0] || null,
    residuals: t('[data-midpoint-residuals]')[0] || null,
    ownOrigins: a('[data-midpoint-own-drawing] [data-inside-origin]', 'data-inside-origin'), ownText: (panel.querySelector('[data-midpoint-own-drawing]') || { textContent: '' }).textContent,
    remade: a('[data-midpoint-remade]', 'data-midpoint-remade'),
    sourceWords: t('[data-midpoint-source-words]'), sourceOpen: a('[data-midpoint-source-open]', 'data-midpoint-source-open'), sourcePoints: panel.querySelectorAll('[data-midpoint-source] [data-inside-point]').length,
    sourceFonts: [...panel.querySelectorAll('[data-midpoint-source-drawing] text')].map((e) => Number(e.getAttribute('font-size'))),
    footRows: drawing ? drawing.querySelectorAll('[data-inside-foot-words]').length : 0, textPaths: drawing ? drawing.querySelectorAll('textPath').length : 0,
    drawingFonts: drawing ? [...drawing.querySelectorAll('text')].map((e) => Number(e.getAttribute('font-size'))) : [],
    own: a('[data-midpoint-own]', 'data-midpoint-own')[0] || null, ownPoints: panel.querySelectorAll('[data-midpoint-own-drawing] [data-inside-point]').length, ownBoth: a('[data-midpoint-own-drawing] [data-midpoint-own-origin]', 'data-midpoint-own-origin').filter((o) => o === 'both').length,
    sourceActs: t('[data-midpoint-source-acts]'), faces: a('[data-midpoint-face]', 'data-midpoint-face'),
    refusal: a('[data-midpoint-refusal]', 'data-midpoint-refusal')[0] || null, conflicts: a('[data-midpoint-conflict]', 'data-midpoint-conflict'), hands: a('[data-midpoint-refusal] [data-midpoint-withdraw]', 'data-midpoint-withdraw'),
    haloRects: drawing ? drawing.querySelectorAll('[data-inside-point] rect').length : null, perColumn,
    gestureLineHasMidpointClause: gesture ? /at a midpoint, two halves/.test(gesture.textContent) : false, gestureLineBox: r(gesture),
    forbidden: /offer|weight|candidate|propos|tied|orbit|rank|support/i.test(panel.textContent),
    // C-8 — the born room at the eye
    composedPoints: a('[data-midpoint-drawing] [data-midpoint-composed]', 'data-midpoint-composed'),
    freeA: [...panel.querySelectorAll('[data-midpoint-drawing] [data-midpoint-side=A]:not([data-midpoint-composed])')].map((e) => e.getAttribute('data-inside-point')),
    freeB: [...panel.querySelectorAll('[data-midpoint-drawing] [data-midpoint-side=B]:not([data-midpoint-composed])')].map((e) => e.getAttribute('data-inside-point')),
    composedClickable: [...panel.querySelectorAll('[data-midpoint-drawing] [data-midpoint-composed]')].filter((e) => e.classList.contains('cursor-pointer')).length,
    ownComposed: a('[data-midpoint-own-drawing] [data-midpoint-own-role]', 'data-midpoint-own-role').filter((o) => o === 'composed').length,
    // C-7h — the designer's third cut at the eye: the glyph census, the names, the composed mark, foot ownership, the one grammar
    glyphedWords: drawing ? [...drawing.querySelectorAll('[data-inside-arc-word], [data-inside-loop-word]')].filter((e) => /^≡ /.test(e.textContent)).length : 0,
    bothMarks: drawing ? drawing.querySelectorAll('[data-midpoint-both]').length : 0,
    composedTuples: drawing ? drawing.querySelectorAll('[data-midpoint-composed-tuple]').length : 0,
    labelsAll: [...panel.querySelectorAll('[data-inside-label]')].map((e) => e.textContent),
    wordNames: [...panel.querySelectorAll('[data-midpoint-word]')].map((e) => e.textContent.replace(/\\s+/g, ' ').trim()),
    ownWords: [...panel.querySelectorAll('[data-midpoint-own-drawing] [data-inside-arc-word], [data-midpoint-own-drawing] [data-inside-loop-word]')].map((e) => e.textContent.replace(/^≡ /, '')),
    composedOriginWords: panel.querySelectorAll('[data-midpoint-composed] [data-inside-origin]').length,
    composedHollow: panel.querySelectorAll('[data-midpoint-composed] circle[data-inside-solid]').length,
    composedWordCount: (panel.textContent.match(/composed/g) || []).length,
    ownership: [...panel.querySelectorAll('[data-midpoint-drawing] [data-inside-column]')].flatMap((col) => {
      const rows = [...col.querySelectorAll('[data-inside-point]')].map((p) => { const b = p.querySelector('circle').getBoundingClientRect(); return { id: p.getAttribute('data-inside-point'), cy: b.y + b.height / 2 }; });
      return [...col.querySelectorAll('[data-inside-foot-words], [data-inside-loop-words]')].map((tx) => {
        const b = tx.getBoundingClientRect(); const attr = tx.getAttribute('data-inside-foot-words') || (tx.getAttribute('data-inside-loop-words') + '|loops'); const [id, side] = attr.split('|');
        const own = rows.find((rw) => rw.id === id); const cy = b.y + b.height / 2; const dOwn = own ? Math.abs(cy - own.cy) : null; const others = rows.filter((rw) => rw.id !== id).map((rw) => Math.abs(cy - rw.cy)); const dOther = others.length ? Math.min(...others) : null;
        return { id, side, lines: tx.querySelectorAll('[data-inside-line]').length, own: dOwn === null ? null : Math.round(dOwn * 10) / 10, nearestOther: dOther === null ? null : Math.round(dOther * 10) / 10, ownIsNearest: dOwn !== null && (dOther === null || dOwn < dOther) };
      });
    }),
    refusalAct: t('[data-midpoint-refusal-act]')[0] || null, refusalCollision: t('[data-midpoint-refusal-collision]')[0] || null, refusalHands: t('[data-midpoint-refusal] [data-midpoint-withdraw]'),
    oldGrammar: /refused —|the act just made|nothing glued/.test(panel.textContent),
    faceIdsInPanel: (panel.textContent.match(/\\bface:[a-z0-9]{3,}/g) || []).length,
    // C-9 — the born faces read at this site, in the sources
    bornFaces: [...panel.querySelectorAll('[data-midpoint-born-face]')].map((b) => ({ face: b.getAttribute('data-midpoint-born-face'), cells: b.getAttribute('data-midpoint-born-face-cells'), alike: b.getAttribute('data-midpoint-born-face-alike'),
      states: [...b.querySelectorAll('[data-midpoint-born-face-state]')].map((e) => e.getAttribute('data-midpoint-born-face-state')), ground: b.querySelectorAll('[data-midpoint-born-face-line="ground"]').length, noNews: b.querySelectorAll('[data-midpoint-born-face-line="no-news"]').length,
      news: [...b.querySelectorAll('[data-midpoint-born-face-news]')].map((e) => e.textContent.replace(/\\s+/g, ' ').trim()), hands: [...b.querySelectorAll('[data-midpoint-born-face-hands]')].map((e) => e.textContent.replace(/\\s+/g, ' ').trim()), alikeLine: b.querySelectorAll('[data-midpoint-born-face-alike-line]').length,
      box: r(b), inPanel: (() => { const q = b.getBoundingClientRect(); return q.y >= P.y && q.bottom <= P.bottom; })(), head: (b.textContent.match(/^\\s*the face [^,]+, [^,]+, [A-Z]+ → [A-Z]+ → [A-Z]+ → [A-Z]+/) || [''])[0].trim() })),
    home: t('[data-midpoint-home]')[0] || null, pick: a('[data-midpoint-pick]', 'data-midpoint-pick')[0] || null,
    loadedIgnored: t('[data-midpoint-loaded-ignored]'),
    refusalText: t('[data-midpoint-refusal]')[0] || null, dependency: a('[data-midpoint-refusal-dependency]', 'data-midpoint-refusal-dependency')[0] || null,
    dependencyHands: t('[data-midpoint-withdraw-attempt], [data-midpoint-dependency-withdraw]'),
  };
}"""
LOAD_LINE = "() => { const p = document.querySelector('[data-cast-load-result]'); return p ? p.innerText : null; }"
WHEREAMI = "() => fetch('/__whereami').then((r) => r.json()).catch(() => null)"
# C-7f item 7 — THE TEXT CENSUS, both readings per text node: `composited` (the text's colour against its ground, every
# ancestor's translucent background composited down onto the app's ground #0c0a09 — what the pixels show) and `blind`
# (against the nearest ancestor's background colour with its alpha IGNORED — a tinted badge read as its opaque colour;
# this reproduces the designer's five worst numbers). SVG text reads `fill`, not `color`.
CONTRAST = """(rootSel) => {
  const lum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const parse = (s) => { const m = (s || '').match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(/[\\s,\\/]+/).filter(Boolean).map((x) => parseFloat(x)); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const GROUND = { r: 12, g: 10, b: 9, a: 1 };
  const ratio = (fg, bg) => { const l1 = lum(fg); const l2 = lum(bg); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const over = (top, under) => ({ r: top.r * top.a + under.r * (1 - top.a), g: top.g * top.a + under.g * (1 - top.a), b: top.b * top.a + under.b * (1 - top.a), a: 1 });
  const layersOf = (el) => { const layers = []; for (let e = el; e; e = e.parentElement) { const bg = parse(getComputedStyle(e).backgroundColor); if (bg && bg.a > 0) layers.push(bg); } return layers; };
  const composited = (layers) => layers.reduceRight((acc, l) => over(l, acc), GROUND);
  const blind = (layers) => (layers.length ? { ...layers[0], a: 1 } : GROUND);
  const roots = rootSel === '@controls'
    ? [...document.querySelectorAll('button')].filter((b) => /^(Fit Selected|workspace)$/i.test(b.textContent.trim()))
    : rootSel === '@packets' ? [document.querySelector('[data-cast-file-input]')].filter(Boolean).map((e) => e.closest('.grid') || e.parentElement) : [...document.querySelectorAll(rootSel)];
  const out = [];
  for (const root of roots) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const text = n.textContent.replace(/\\s+/g, ' ').trim();
      if (!text) continue;
      const el = n.parentElement;
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const svg = el.namespaceURI === 'http://www.w3.org/2000/svg';
      const fg = parse(svg ? cs.fill : cs.color);
      if (!fg) continue;
      const layers = layersOf(el);
      const ground = composited(layers);
      const fgFlat = fg.a < 1 ? over(fg, ground) : fg;
      out.push({ text: text.slice(0, 40), size: parseFloat(cs.fontSize), composited: Math.round(ratio(fgFlat, ground) * 100) / 100, blind: Math.round(ratio({ ...fg, a: 1 }, blind(layers)) * 100) / 100, disabled: !!el.closest('[disabled]') });
    }
  }
  return out;
}"""
FACE = """() => {
  const panel = document.querySelector('[data-midpoint-surface]');
  if (!panel) return { present: false };
  const P = panel.getBoundingClientRect();
  const blocks = [...panel.querySelectorAll('[data-midpoint-face-reading]')].map((b) => {
    const r = b.getBoundingClientRect();
    return {
      face: b.getAttribute('data-midpoint-face-reading'), state: b.getAttribute('data-midpoint-face-state'), walk: b.getAttribute('data-midpoint-face-walk'),
      text: b.textContent.replace(/\\s+/g, ' ').trim().slice(0, 2400),
      hands: [...b.querySelectorAll('[data-midpoint-face-withdraw]')].map((e) => e.getAttribute('data-midpoint-face-withdraw')),
      corners: [...b.querySelectorAll('[data-midpoint-face-corner]')].map((e) => ({ corner: e.getAttribute('data-midpoint-face-corner'), fix: e.getAttribute('data-midpoint-face-fix'), mov: e.getAttribute('data-midpoint-face-mov'), und: e.getAttribute('data-midpoint-face-und'), core: e.getAttribute('data-midpoint-face-core') })),
      lines: [...b.querySelectorAll('[data-midpoint-face-line]')].map((e) => { const q = e.getBoundingClientRect(); return { kind: e.getAttribute('data-midpoint-face-line'), y: Math.round(q.y), h: Math.round(q.height), text: e.textContent.replace(/\\s+/g, ' ').trim().slice(0, 90) }; }),
      handTexts: [...b.querySelectorAll('[data-midpoint-face-withdraw]')].map((e) => e.textContent.replace(/\\s+/g, ' ').trim()), here: b.querySelectorAll('[data-midpoint-face-here]').length,
      box: { y: Math.round(r.y), h: Math.round(r.height), insidePanel: r.y >= P.y && r.bottom <= P.bottom },
    };
  });
  // C-7g — the word half's box while the face block stands above it (the block grew by its lines; is the act still in the box?)
  const wh = panel.querySelector('[data-midpoint-word-half]');
  const whq = wh ? wh.getBoundingClientRect() : null;
  return { present: true, blocks, wordHalf: whq ? { y: Math.round(whq.y), bottom: Math.round(whq.bottom), insidePanel: whq.y >= P.y && whq.bottom <= P.bottom } : null, scrollTop: panel.scrollTop };
}"""
CARD = """() => {
  const row = document.querySelector('[data-cast-card-row="summary"]');
  if (!row) return { present: false };
  const dl = row.closest('dl');
  const R = (el) => { const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }; };
  const cs = getComputedStyle(dl);
  const inner = dl.getBoundingClientRect().width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
  const castRows = [...dl.querySelectorAll('[data-cast-card-row]')];
  const castHeight = castRows.length ? Math.round(castRows[castRows.length - 1].getBoundingClientRect().bottom - castRows[0].getBoundingClientRect().top) : 0;
  return { present: true, card: R(dl), inner: Math.round(inner), castHeight, viewport: window.innerHeight, ratio: Math.round((dl.getBoundingClientRect().width / dl.getBoundingClientRect().height) * 100) / 100,
    rows: [...dl.querySelectorAll('[data-cast-card-row]')].map((e) => ({ row: e.getAttribute('data-cast-card-row'), ...R(e), spans: e.getBoundingClientRect().width >= inner - 1 })),
    orderings: [...dl.querySelectorAll('[data-cast-orderings-row]')].map((e) => ({ key: e.getAttribute('data-cast-orderings-row'), h: Math.round(e.getBoundingClientRect().height), text: e.textContent.replace(/\\s+/g, ' ').trim() })),
    faceIdsOnPage: (document.body.textContent.match(/\\bface:[a-z0-9]{3,}/g) || []).length, faceIdsAsNames: (document.body.textContent.match(/face face:[a-z0-9]+/g) || []).length };
}"""
# C-7h item 10 — the card at a BORN vertex: one `Space` row, no cast rows; item 11 — no face named by its id on the page
CARD_BORN = """() => {
  const rows = [...document.querySelectorAll('[data-space-card-row]')].map((e) => ({ row: e.getAttribute('data-space-card-row'), text: e.textContent.replace(/\\s+/g, ' ').trim() }));
  const dl = rows.length ? document.querySelector('[data-space-card-row]').closest('dl') : null;
  return { spaceRows: rows, castRows: document.querySelectorAll('[data-cast-card-row]').length, faceIdsOnPage: (document.body.textContent.match(/\\bface:[a-z0-9]{3,}/g) || []).length, faceIdsAsNames: (document.body.textContent.match(/face face:[a-z0-9]+/g) || []).length,
    faceLines: dl ? [...dl.querySelectorAll('span')].map((e) => e.textContent.replace(/\\s+/g, ' ').trim()).filter((x) => /^face /.test(x)).slice(0, 6) : [], cardText: dl ? dl.textContent.replace(/\\s+/g, ' ').trim().slice(0, 500) : null };
}"""


def tab(page, name):
    page.get_by_role("button", name=re.compile(f"^{name}$", re.I)).first.click(); page.wait_for_timeout(400)


def click_canvas_center(page):
    box = page.locator("canvas").first.bounding_box()
    page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
    page.mouse.down(); page.wait_for_timeout(50); page.mouse.up(); page.wait_for_timeout(600)


def vertex_rows(page):
    tab(page, "selection")
    return page.locator('[title="click: select · shift-click: toggle in the lift region"]')


def select_vertex_labelled(page, label):
    rows = vertex_rows(page)
    for i in range(rows.count()):
        text = rows.nth(i).inner_text().replace('\n', ' ')
        if re.search(rf'(^|\s){re.escape(label)}(\s|$)', text):
            rows.nth(i).click(); page.wait_for_timeout(600); return text
    return None


def load_cast(page, index, filename):
    vertex_rows(page).nth(index).click(); page.wait_for_timeout(400)
    tab(page, "packets")
    page.locator('[data-cast-file-input]').first.set_input_files(FIX + filename); page.wait_for_timeout(700)
    return page.evaluate(LOAD_LINE)


def point(page, side, role):
    page.locator(f'[data-midpoint-drawing] [data-midpoint-side="{side}"][data-inside-point="{role}"] text').first.click(); page.wait_for_timeout(350)


def word(page, side, w):
    page.locator(f'[data-midpoint-word="{side}|{w}"]').first.click(); page.wait_for_timeout(350)


def pair(page, x, y):
    """give the role pair x ↦ y at the open midpoint, whichever side holds x (the record's orientation is the edge's own)"""
    a_side = page.evaluate("() => [...document.querySelectorAll('[data-midpoint-drawing] [data-midpoint-side=A]')].map((e) => e.getAttribute('data-inside-point'))")
    if x in a_side:
        point(page, "A", x); point(page, "B", y)
    else:
        point(page, "A", y); point(page, "B", x)


def x_is_flow(role):
    return re.match(r'^F\d+$', role or '') is not None


def give_map(page, m):
    for x, y in m.items():
        pair(page, x, y)


def select_core(page):
    tab(page, "workspace")
    rows = page.get_by_role("button", name=re.compile("core", re.I))
    rows.first.click(); page.wait_for_timeout(600)


def census(page, sel):
    """the text census over a root: every text node with both readings; the summary the leg prints and pins"""
    rows = page.evaluate(CONTRAST, sel)
    below = [r for r in rows if r['composited'] < 4.5]
    blind_below = [r for r in rows if r['blind'] < 4.5]
    worst = sorted(rows, key=lambda r: r['composited'])[:8]
    return {'nodes': len(rows), 'belowComposited': len(below), 'belowBlind': len(blind_below), 'worst': worst, 'below': below[:24]}


def select_cell(page, pattern):
    """select a cell in the workspace tree by its row's accessible name (the topology word comes first)"""
    tab(page, "workspace")
    rows = page.get_by_role("button", name=re.compile(pattern, re.I))
    if rows.count() == 0:
        return None
    text = rows.first.inner_text().replace('\n', ' ')
    rows.first.click(); page.wait_for_timeout(600)
    return text



# ─── C-10 — THE LIFT CARRIES at the eye: the Manuscript's card section for the placed lifted form ───
MEASURE_LIFT = """() => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right) }; };
  const txt = (el) => (el ? el.textContent.replace(/\\s+/g, ' ').trim() : null);
  const scroll = document.querySelector('[data-specimen-scroll]');
  const sec = document.querySelector('[data-lifted-concept]');
  if (!sec) return { present: false, cardPresent: Boolean(scroll), shelfCount: document.querySelectorAll('[title="drag onto the sheet"], [title="already on the sheet"]').length };
  const S = r(scroll); const B = r(sec);
  const inside = (b) => b && S && b.y >= S.y - 0.5 && b.bottom <= S.bottom + 0.5;
  const topInside = (b) => b && S && b.y >= S.y - 0.5 && b.y < S.bottom - 20;
  const insidePanel = sec.querySelector('[data-inside-panel]');
  const face = sec.querySelector('[data-lifted-face]');
  return {
    present: true, state: sec.getAttribute('data-lifted-concept'), held: sec.getAttribute('data-lifted-concept-held'), resolved: sec.getAttribute('data-lifted-concept-resolved'),
    door: sec.querySelector('[data-lifted-concept-door]')?.getAttribute('data-compartment-state') ?? null,
    recordLine: txt(sec.querySelector('[data-lifted-concept-record]')),
    rows: [...sec.querySelectorAll('[data-lifted-vertex-row]')].map((e) => ({ id: e.getAttribute('data-lifted-vertex-row'), space: e.getAttribute('data-lifted-vertex-space'), picked: e.getAttribute('data-lifted-vertex-picked') === 'true', text: txt(e), inside: inside(r(e)) })),
    scrollBox: S, sectionBox: B, sectionInside: inside(B), scrollTop: scroll ? scroll.scrollTop : null, scrollHeight: scroll ? scroll.scrollHeight : null,
    insidePanel: insidePanel ? { id: insidePanel.getAttribute('data-inside-panel'), origin: insidePanel.getAttribute('data-inside-origin-of-space'), placement: insidePanel.getAttribute('data-inside-placement'), points: insidePanel.querySelectorAll('[data-inside-point]').length, glyphed: [...insidePanel.querySelectorAll('[data-inside-label]')].filter((l) => /≡/.test(l.textContent)).length, labels: [...insidePanel.querySelectorAll('[data-inside-label]')].map((l) => txt(l)).slice(0, 40), box: r(insidePanel), inside: inside(r(insidePanel)), topInside: topInside(r(insidePanel)), head: txt(insidePanel.firstElementChild) } : null,
    absence: txt(sec.querySelector('[data-lifted-vertex-absence]')),
    faceOptions: [...(sec.querySelector('[data-lifted-face-pick]')?.options ?? [])].map((o) => ({ value: o.value, label: o.textContent })),
    face: face ? { id: face.getAttribute('data-lifted-face'), kind: face.getAttribute('data-lifted-face-kind'), states: [...face.querySelectorAll('[data-midpoint-born-face-state], [data-midpoint-face-state]')].map((e) => e.getAttribute('data-midpoint-born-face-state') || e.getAttribute('data-midpoint-face-state')), head: txt(face.querySelector('[data-midpoint-born-face-state="read"] > span, [data-midpoint-face-state="read"] > span')), ground: face.querySelectorAll('[data-midpoint-born-face-line="ground"]').length, news: [...face.querySelectorAll('[data-midpoint-born-face-news]')].map((e) => txt(e)), noNews: face.querySelectorAll('[data-midpoint-born-face-line="no-news"]').length, hands: [...face.querySelectorAll('[data-midpoint-born-face-hands]')].map((e) => txt(e)), buttons: face.querySelectorAll('button').length, withdraws: face.querySelectorAll('[data-midpoint-born-face-withdraw], [data-midpoint-face-withdraw]').length, handWords: face.querySelectorAll('[data-midpoint-born-face-hand-words], [data-midpoint-face-hand-words]').length, box: r(face), inside: inside(r(face)), topInside: topInside(r(face)), text: txt(face).slice(0, 600) } : null,
    cornerCell: txt(sec.querySelector('[data-lifted-face-corner-cell]')),
    openButtons: sec.querySelectorAll('[data-lifted-open-drawing]').length, openState: [...sec.querySelectorAll('[data-lifted-drawing-state="open"]')].length,
    drawing: (() => { const ov = document.querySelector('[data-lifted-drawing]'); if (!ov) return null; const p = ov.querySelector('[data-inside-panel]'); const svg = ov.querySelector('svg'); const b = r(ov); const sb = svg ? r(svg) : null; return { box: b, scrollWidth: ov.scrollWidth, clientWidth: ov.clientWidth, scrollHeight: ov.scrollHeight, clientHeight: ov.clientHeight, svg: sb, points: p ? p.querySelectorAll('[data-inside-point]').length : 0, words: p ? [...p.querySelectorAll('[data-inside-arc-word], [data-inside-loop-word]')].map((t) => txt(t)) : [], glyphed: p ? [...p.querySelectorAll('[data-inside-label]')].filter((l) => /≡/.test(l.textContent)).length : 0, head: p ? txt(p.firstElementChild) : null, inViewport: b.x >= 0 && b.y >= 0 && b.right <= window.innerWidth && b.bottom <= window.innerHeight, clipped: ov.scrollWidth > ov.clientWidth + 1, outsideCard: S ? (b.right <= S.x || b.x >= S.right) : null }; })(),
  };
}"""


def select_residue_at(page, corner):
    """the gen-1 residue tetrahedron holding the seed corner: each `tetrahedron … residue … g1` row selected in turn until the selection tab lists the corner"""
    tab(page, "workspace")
    rows = page.get_by_role("button", name=re.compile(r"^tetrahedron .*residue.* g1", re.I))
    n = rows.count()
    for i in range(n):
        tab(page, "workspace")
        rows = page.get_by_role("button", name=re.compile(r"^tetrahedron .*residue.* g1", re.I))
        text = rows.nth(i).inner_text().replace('\n', ' ')
        rows.nth(i).click(); page.wait_for_timeout(500)
        vr = vertex_rows(page)
        labels = [vr.nth(k).inner_text().replace('\n', ' ').split(' ')[0] for k in range(vr.count())]
        if corner in labels:
            return {'row': text, 'labels': labels, 'candidates': n}
    return {'row': None, 'labels': [], 'candidates': n}


def lift_arm(page, args):
    """C-10: lift the gen-1 residue at A (its edge AB–AC holds the born pair), place it on the sheet, read a corner and a face on the record"""
    res = {}
    res['cellRow'] = select_residue_at(page, 'A')
    # the lift takes the MOST SPECIFIC selection: a vertex row clicked in the selection tab would be lifted instead of the cell —
    # select_residue_at ends on the selection tab with the cell selected and no vertex row clicked
    lift = page.get_by_role("button", name=re.compile(r"^Lift selection → Manuscript$"))
    res['liftButton'] = lift.count()
    if not lift.count():
        return res
    lift.first.click(); page.wait_for_timeout(600)
    res['liftNotice'] = page.evaluate("() => { const p = [...document.querySelectorAll('p')].find((e) => /lifted|Manuscript shelf/i.test(e.textContent)); return p ? p.textContent : null; }")
    page.get_by_role("button", name=re.compile(r"^Manuscript$")).first.click()
    try:
        page.wait_for_selector('[title="drag onto the sheet"]', timeout=30000)
    except Exception as e:
        res['shelfWait'] = str(e)[:200]
    res['manuscript'] = page.evaluate("() => ({ canvases: document.querySelectorAll('canvas').length, shelf: document.querySelectorAll('[title=\"drag onto the sheet\"]').length, placedTitles: [...document.querySelectorAll('[title=\"already on the sheet\"]')].map((e) => e.textContent), boundary: (document.body.innerText.match(/manuscript page[^\\n]{0,200}/) || [null])[0] })")
    shelf = page.locator('[title="drag onto the sheet"]')
    res['shelfEntries'] = shelf.count()
    res['shelfTitles'] = [shelf.nth(k).inner_text().replace('\n', ' ') for k in range(shelf.count())]
    if shelf.count():
        # C-11a: the shelf holds two lifts now (the gen-1 residue lifted before the second dissection, then this one) — the
        # C-10 arm places the MOST RECENT (the gen-2 residue with the finer grain); the door arm places the other
        entry = shelf.nth(shelf.count() - 1)
        res['shelfTitle'] = entry.inner_text()
        canvases = page.locator('canvas')
        res['canvases'] = canvases.count()
        target = canvases.nth(canvases.count() - 1)
        entry.drag_to(target); page.wait_for_timeout(1500)
    res['placed'] = page.evaluate(MEASURE_LIFT)
    # C-10b: the corner's line is WORDS; `open the drawing` mounts the drawing on the sheet at its own size
    row = page.locator('[data-lifted-vertex-row]').filter(has_text=re.compile(r'^AB '))
    res['abRows'] = row.count()
    if row.count():
        row.first.locator('[data-lifted-open-drawing]').first.click(); page.wait_for_timeout(700)
    res['pickedAB'] = page.evaluate(MEASURE_LIFT)
    page.screenshot(path=f"{args.frames}/concept-layer-lift-drawing-{args.width}x{args.height}.png")
    sel = page.locator('[data-lifted-face-pick]')
    if sel.count():
        opts = sel.first.evaluate("(el) => [...el.options].map((o) => ({ value: o.value, label: o.textContent }))")
        medial = next((o for o in opts if re.match(r'^AB·A[CD]·A[CD]', o['label'])), None)
        res['medialOption'] = medial
        if medial:
            sel.first.select_option(medial['value']); page.wait_for_timeout(600)
    res['pickedFace'] = page.evaluate(MEASURE_LIFT)
    # the section scrolled into the card's box (the reading scrolls; the acts do not) — its position printed
    page.evaluate("() => { const s = document.querySelector('[data-lifted-concept]'); if (s) s.scrollIntoView({ block: 'start' }); }"); page.wait_for_timeout(300)
    res['scrolled'] = page.evaluate(MEASURE_LIFT)
    # the reading SCROLLS (B-130 A.3): each block reached by the card's own scroll — its top inside the box, its height printed
    page.evaluate("() => { const s = document.querySelector('[data-lifted-inside]'); if (s) s.scrollIntoView({ block: 'start' }); }"); page.wait_for_timeout(300)
    res['scrolledInside'] = page.evaluate(MEASURE_LIFT)
    page.screenshot(path=f"{args.frames}/concept-layer-lift-inside-{args.width}x{args.height}.png")
    page.evaluate("() => { const s = document.querySelector('[data-lifted-face]'); if (s) s.scrollIntoView({ block: 'start' }); }"); page.wait_for_timeout(300)
    res['scrolledFace'] = page.evaluate(MEASURE_LIFT)
    page.screenshot(path=f"{args.frames}/concept-layer-lift-carries-{args.width}x{args.height}.png")
    page.get_by_role("button", name=re.compile(r"^Ambo Universe$")).first.click(); page.wait_for_timeout(800)
    return res


# ─── C-11a — THE DOOR's ACT at the aperture's pairing row (§133, Option R; the designer's 1500 §1 placed at the room's door) ───
MEASURE_DOOR = """() => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right) }; };
  const txt = (el) => (el ? el.textContent.replace(/\\s+/g, ' ').trim() : null);
  const panel = document.querySelector('[data-aperture-panel]');
  if (!panel) return { present: false };
  const rows = panel.querySelector('[data-aperture-rows]');
  const door = panel.querySelector('[data-door]');
  const notice = [...panel.querySelectorAll('div')].map((e) => txt(e)).find((t) => t && /^(glued|left bounded|the engine refused|subdivided)/.test(t)) || null;
  if (!door) return { present: true, door: null, rowsBox: r(rows), rowsScrollTop: rows ? rows.scrollTop : null, notice, glueButton: [...panel.querySelectorAll('button')].some((b) => /^glue — the S² gate judges$/.test(txt(b))) };
  const chips = [...door.querySelectorAll('[data-door-role]')].filter((c) => !c.hasAttribute('data-door-role-taken') && !c.hasAttribute('data-door-role-picked'));
  const styleOf = (c) => { const cs = getComputedStyle(c); return `${cs.borderStyle}|${cs.borderColor}|${cs.backgroundColor}|${cs.color}|${cs.fontWeight}|${cs.outlineStyle}`; };
  const styles = new Set(chips.map(styleOf));
  const crossing = new Set(chips.map((c) => c.getAttribute('data-door-role-crosses')));
  const D = r(door); const RB = r(rows);
  return {
    present: true, notice, glueButton: [...panel.querySelectorAll('button')].some((b) => /^glue — the S² gate judges$/.test(txt(b))),
    door: {
      id: door.getAttribute('data-door'), state: door.getAttribute('data-door-state'), pairs: door.getAttribute('data-door-pairs'), lines: door.getAttribute('data-door-lines'),
      empty: txt(door.querySelector('[data-door-empty]')), head: txt(door.querySelector('[data-door-head]')),
      lineBlocks: [...door.querySelectorAll('[data-door-line]')].map((l) => ({ key: l.getAttribute('data-door-line'), kind: l.getAttribute('data-door-line-kind'), pairs: l.getAttribute('data-door-line-pairs'), words: txt(l.querySelector('[data-door-line-words]')), hands: [...l.querySelectorAll('[data-door-withdraw-line]')].map((b) => txt(b)) })),
      taken: txt(door.querySelector('[data-door-taken]')),
      refusal: txt(door.querySelector('[data-door-refusal-words]')), refusalHands: [...door.querySelectorAll('[data-door-withdraw-attempt]')].map((b) => txt(b)),
      corners: [...door.querySelectorAll('[data-door-corner]')].map((c) => ({ pair: c.getAttribute('data-door-corner-pair'), a: c.querySelectorAll('[data-door-side="A"] [data-door-role]').length, b: c.querySelectorAll('[data-door-side="B"] [data-door-role]').length })),
      chipStyles: styles.size, chipCrossing: [...crossing].sort(), takenChips: door.querySelectorAll('[data-door-role-taken]').length, pickedChips: door.querySelectorAll('[data-door-role-picked]').length,
      cannotCross: txt(door.querySelector('[data-door-cannot-cross]')), unlawful: txt(door.querySelector('[data-door-unlawful]')),
      box: D, rowsBox: RB, rowsScrollTop: rows ? rows.scrollTop : null, rowsScrollHeight: rows ? rows.scrollHeight : null, topInsideRows: D && RB ? D.y >= RB.y - 0.5 && D.y < RB.bottom - 20 : null, inViewport: D ? D.y >= 0 && D.y < window.innerHeight : null,
    },
  };
}"""


def lift_gen1_arm(page, args):
    """C-11a: the gen-1 residue at A lifted BEFORE the second dissection — the form the door arm builds a room from (the Ambo
    mounts no way back to an earlier shape, and the gen-2 residue's finer grain cannot be glued today)"""
    res = {}
    res['cellRow'] = select_residue_at(page, 'A')
    lift = page.get_by_role("button", name=re.compile(r"^Lift selection → Manuscript$"))
    res['liftButton'] = lift.count()
    if lift.count():
        lift.first.click(); page.wait_for_timeout(600)
        res['liftNotice'] = page.evaluate("() => { const p = [...document.querySelectorAll('p')].find((e) => /lifted|Manuscript shelf/i.test(e.textContent)); return p ? p.textContent : null; }")
    return res


def door_chip(page, corner, side, name):
    return page.locator(f'[data-door-corner="{corner}"] [data-door-side="{side}"] [data-door-role-name="{name}"]')


def door_arm(page, args):
    """C-11a: the door's act at the eye — the gen-1 residue placed, the aperture opened on it, the hinge door A·AC·AB ~ A·AB·AD
    given, F1 ↦ F1 taken with its whole line, a pair refused by the lines, a pair refused by the record, the line withdrawn
    and given again, the door glued into a room"""
    res = {}
    page.get_by_role("button", name=re.compile(r"^Manuscript$")).first.click()
    try:
        page.wait_for_selector('[title="drag onto the sheet"]', timeout=30000)
    except Exception as e:
        res['shelfWait'] = str(e)[:200]
    shelf = page.locator('[title="drag onto the sheet"]')
    res['shelfDraggable'] = shelf.count()
    res['shelfTitles'] = [shelf.nth(k).inner_text().replace('\n', ' ') for k in range(shelf.count())]
    if not shelf.count():
        return res
    # the C-10b arm leaves the lifted drawing open on the sheet — its overlay intercepts a drag onto the canvas; close it first
    closer = page.locator('[data-lifted-drawing-state="open"]')
    res['drawingClosed'] = closer.count()
    if closer.count():
        closer.first.click(); page.wait_for_timeout(400)
    canvases = page.locator('canvas')
    shelf.first.drag_to(canvases.nth(canvases.count() - 1)); page.wait_for_timeout(1500)
    res['placed'] = page.evaluate(MEASURE_LIFT)
    # the aperture on the placed form
    ap = page.get_by_role("button", name=re.compile(r"^aperture — build a 3-manifold"))
    res['apertureButton'] = ap.first.inner_text() if ap.count() else None
    if not ap.count():
        return res
    ap.first.click(); page.wait_for_timeout(600)
    try:
        page.wait_for_selector('[data-aperture-panel]', timeout=10000)
    except Exception as e:
        res['panelWait'] = str(e)[:200]
        return res
    row = page.locator('[data-aperture-rows]').first
    sel_a = row.locator('[data-aperture-select="faceA"]').first
    sel_b = row.locator('[data-aperture-select="faceB"]').first
    sel_m = row.locator('[data-aperture-select="map"]').first
    opts = sel_a.evaluate("(el) => [...el.options].map((o) => ({ value: o.value, label: o.textContent }))")
    res['faceOptions'] = [o['label'] for o in opts]
    def face_with(corners):
        for o in opts:
            t = o['label'].split(' · ')[0].split('·')
            if len(t) == len(corners) and all(c in t for c in corners):
                return o
        return None
    fa = face_with(['A', 'AB', 'AC']); fb = face_with(['A', 'AB', 'AD'])
    res['faces'] = [fa and fa['label'], fb and fb['label']]
    if not fa or not fb:
        return res
    sel_a.select_option(fa['value']); page.wait_for_timeout(300)
    sel_b.select_option(fb['value']); page.wait_for_timeout(300)
    mopts = sel_m.evaluate("(el) => [...el.options].map((o) => ({ value: o.value, label: o.textContent }))")
    res['mapOptions'] = [o['label'] for o in mopts]
    hinge = next((o for o in mopts if re.match(r'^A→A · AC→AD · AB→AB', o['label'])), None)
    res['hinge'] = hinge and hinge['label']
    if not hinge:
        return res
    sel_m.select_option(hinge['value']); page.wait_for_timeout(700)
    res['empty'] = page.evaluate(MEASURE_DOOR)
    page.screenshot(path=f"{args.frames}/concept-layer-door-empty-{args.width}x{args.height}.png")
    # the door scrolled into the rows region's view (the rows region owns a bounded scroll — D10)
    page.evaluate("() => { const d = document.querySelector('[data-door]'); if (d) d.scrollIntoView({ block: 'start' }); }"); page.wait_for_timeout(300)
    res['scrolled'] = page.evaluate(MEASURE_DOOR)
    # TAKEN — F1 ↦ F1 at A, the whole line with it
    door_chip(page, 0, 'A', 'F1').first.click(); page.wait_for_timeout(200)
    res['picked'] = page.evaluate(MEASURE_DOOR)
    door_chip(page, 0, 'B', 'F1').first.click(); page.wait_for_timeout(500)
    res['taken'] = page.evaluate(MEASURE_DOOR)
    page.screenshot(path=f"{args.frames}/concept-layer-door-taken-{args.width}x{args.height}.png")
    # REFUSED BY THE LINES — at AC → AD, an A-role (on a cycle: A's roles ride A→AC→AB→A through the corner edges) pointed at a
    # D-role (a line of one): one continues and the other stops. At the eye C holds the T cell and D holds Φ; F2 is glued
    # nowhere on the path, Φ1 is D's own.
    door_chip(page, 1, 'A', 'F2').first.click(); page.wait_for_timeout(200)
    door_chip(page, 1, 'B', 'Φ1').first.click(); page.wait_for_timeout(500)
    res['refusedLines'] = page.evaluate(MEASURE_DOOR)
    page.screenshot(path=f"{args.frames}/concept-layer-door-refused-{args.width}x{args.height}.png")
    hand = page.locator('[data-door-withdraw-attempt]')
    if hand.count():
        hand.first.click(); page.wait_for_timeout(300)
    res['afterHand'] = page.evaluate(MEASURE_DOOR)
    # REFUSED BY THE RECORD — at AB → AB (the hinge corner the two faces share; B holds Φ), Φ4 ↦ Φ9: two lines of one, equal in
    # shape, and the record refuses — the mold's member_status said two ways on the glued tuple (Φ4 has · Φ9 none-by-nature)
    door_chip(page, 2, 'A', 'Φ4').first.click(); page.wait_for_timeout(200)
    door_chip(page, 2, 'B', 'Φ9').first.click(); page.wait_for_timeout(500)
    res['refusedRecord'] = page.evaluate(MEASURE_DOOR)
    page.screenshot(path=f"{args.frames}/concept-layer-door-record-{args.width}x{args.height}.png")
    hand = page.locator('[data-door-withdraw-attempt]')
    if hand.count():
        hand.first.click(); page.wait_for_timeout(300)
    # the ONE hand: the whole line withdrawn — the empty state again; then given again for the room
    wl = page.locator('[data-door-withdraw-line]')
    res['lineHands'] = wl.count()
    if wl.count():
        wl.first.click(); page.wait_for_timeout(400)
    res['withdrawn'] = page.evaluate(MEASURE_DOOR)
    door_chip(page, 0, 'A', 'F1').first.click(); page.wait_for_timeout(200)
    door_chip(page, 0, 'B', 'F1').first.click(); page.wait_for_timeout(500)
    res['givenAgain'] = page.evaluate(MEASURE_DOOR)
    # the GLUE — the S² gate judges; the room joins the dim-3 band; the rows reset
    glue = page.get_by_role("button", name=re.compile(r"^glue — the S² gate judges$"))
    res['glueButton'] = glue.count()
    if glue.count():
        glue.first.click(); page.wait_for_timeout(1500)
    res['glued'] = page.evaluate(MEASURE_DOOR)
    page.screenshot(path=f"{args.frames}/concept-layer-door-glued-{args.width}x{args.height}.png")
    # the panel's own × (the bottom toggle can sit under the selected form's acts bar — measured, intercepted)
    try:
        page.locator('[data-aperture-panel] button', has_text=re.compile(r'^×$')).first.click(timeout=5000); page.wait_for_timeout(300)
        res['closed'] = True
    except Exception as e:
        res['closed'] = str(e)[:120]
    page.get_by_role("button", name=re.compile(r"^Ambo Universe$")).first.click(); page.wait_for_timeout(800)
    return res


# ─── C-11b — THE CARGO ON THE WALK (§135): the built room walked with a role in hand ───
MEASURE_CARGO = """() => {
  const txt = (el) => (el ? el.textContent.replace(/\\s+/g, ' ').trim() : null);
  const line = document.querySelector('[data-explore-cargo]');
  const seam = window.__exploreWindow ? JSON.parse(JSON.stringify({ doors: window.__exploreWindow.doors, trace: window.__exploreWindow.trace, cargo: window.__exploreWindow.cargo })) : null;
  if (!line) return { present: false, seam };
  const b = line.getBoundingClientRect();
  return {
    present: true, seam,
    state: line.getAttribute('data-explore-cargo-state'), route: line.getAttribute('data-explore-cargo-route'),
    words: txt(line.querySelector('[data-explore-cargo-words]')), text: txt(line),
    rods: [...line.querySelectorAll('[data-explore-cargo-rod]')].map((e) => txt(e)),
    picks: [...line.querySelectorAll('[data-explore-cargo-pick]')].map((e) => txt(e)),
    hand: txt(line.querySelector('[data-explore-cargo-withdraw]')),
    box: { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) }, inViewport: b.y >= 0 && b.bottom <= window.innerHeight,
    legend: (document.querySelector('[data-explore-window]') || document.body).textContent.includes('carry it along — move the cargo corner to corner, one rod per press'),
    tallyLine: txt(document.querySelector('[data-explore-tally]')), sentence: txt(document.querySelector('[data-explore-sentence-text]')),
  };
}"""


def project_group(page, prefix):
    return page.evaluate("""(prefix) => {
      const scene = window.__manuscriptScene, camera = window.__manuscriptCamera;
      if (!scene || !camera) return null;
      // C-12a item 8 — the Manuscript's canvas is the LAST on the page; the first is the Ambo's (hidden, 760 px wide at x=280):
      // projecting through it put every point off the room, and the summon needed up to 13 tries
      const cs = document.querySelectorAll('canvas'); const canvas = cs[cs.length - 1];
      const rect = canvas.getBoundingClientRect();
      let best = null;
      scene.traverse((o) => {
        if (best || !o.isMesh || !o.geometry) return;
        let g = o, name = '';
        while (g) { if ((g.name || '').startsWith(prefix)) { name = g.name; break; } g = g.parent; }
        if (!name) return;
        if (o.geometry.computeBoundingSphere) o.geometry.computeBoundingSphere();
        const bs = o.geometry.boundingSphere;
        if (!bs) return;
        const c = bs.center.clone();
        o.localToWorld(c);
        const p = c.project(camera);
        best = { name, sx: rect.left + ((p.x + 1) / 2) * rect.width, sy: rect.top + ((1 - (p.y + 1) / 2)) * rect.height };
      });
      return best;
    }""", prefix)


def cargo_rod(page, words):
    return page.locator('[data-explore-cargo-rod]').filter(has_text=re.compile('^' + re.escape(words) + '$'))


def cargo_arm(page, args):
    """C-11b: the built room (the gen-1 residue with the hinge door carrying F1's line) summoned on the sheet, the walk window
    opened; F1 picked at A, carried along A–AC, through the door a, home along AD–A; then F2 the same way — lost at the door.
    Whatever happens inside, the arm ends back in the Ambo (the later arms need its tabs) and reports what it saw."""
    res = {}
    try:
        cargo_arm_body(page, args, res)
    except Exception as e:
        res['error'] = str(e)[:400]
    try:
        page.keyboard.press("Escape"); page.wait_for_timeout(300)
        page.get_by_role("button", name=re.compile(r"^Ambo Universe$")).first.click(); page.wait_for_timeout(800)
    except Exception as e:
        res['returnError'] = str(e)[:200]
    return res


# C-12a item 8 — the drawn domain's interior, projected through the Manuscript's canvas: the hit hull's centroid when the hull
# stands (the cure), else the wireframe's (the defect's own geometry — the point that met only the paper)
DOMAIN_INTERIOR = """(prefix) => {
  const scene = window.__manuscriptScene, camera = window.__manuscriptCamera; if (!scene || !camera) return null;
  const cs = document.querySelectorAll('canvas'); const canvas = cs[cs.length - 1]; const rect = canvas.getBoundingClientRect();
  const P = (v) => { const q = v.clone().project(camera); return [rect.left + ((q.x + 1) / 2) * rect.width, rect.top + ((1 - (q.y + 1) / 2)) * rect.height]; };
  let hull = null, wire = null;
  scene.traverse((o) => {
    let g = o, name = ''; while (g) { if ((g.name || '').startsWith(prefix)) { name = g.name; break; } g = g.parent; }
    if (!name || !o.isMesh || !o.geometry) return;
    if (o.name === 'hit-hull' && !hull) hull = o;
    if (o.geometry.type === 'LineSegmentsGeometry' && !wire) wire = o;
  });
  const centroidOf = (o, attr) => { const a = o.geometry.getAttribute(attr); if (!a) return null; const V = o.position.constructor; const c = new V(); for (let i = 0; i < a.count; i++) { const v = new V(a.getX(i), a.getY(i), a.getZ(i)); o.localToWorld(v); c.add(v); } return c.multiplyScalar(1 / a.count); };
  const src = hull || wire; if (!src) return { hull: Boolean(hull), wire: Boolean(wire), centre: null };
  const c = centroidOf(src, hull ? 'position' : 'instanceStart');
  return { hull: Boolean(hull), wire: Boolean(wire), centre: c ? P(c) : null, hullTriangles: hull ? hull.geometry.getAttribute('position').count / 3 : 0 };
}"""
# the handlers of the room's group and of the paper (a handler-bearing mesh under the scene root) wrapped to log what fires
INSTRUMENT_CLICKS = """(prefix) => {
  const scene = window.__manuscriptScene; const log = []; window.__c12aLog = log;
  const wrap = (o, tag) => { const h = o.__r3f && o.__r3f.handlers; if (!h) return; for (const k of Object.keys(h)) { if (k !== 'onClick' && k !== 'onPointerDown') continue; const orig = h[k]; h[k] = (e) => { log.push({ on: k, obj: tag, detail: e && e.nativeEvent ? e.nativeEvent.detail : null, hit: e && e.object ? (e.object.name || e.object.type) : null }); return orig(e); }; } };
  scene.traverse((o) => { let g = o, name = ''; while (g) { if ((g.name || '').startsWith(prefix)) { name = g.name; break; } g = g.parent; } if (name) wrap(o, 'Group'); });
  scene.children.forEach((o) => wrap(o, 'ROOT:' + (o.name || o.type)));
  return true;
}"""


def badge_click(page):
    """C-12a item 5 — measured, the premise did not reproduce: a click on the `· has` badge beside F1 picks F1 — on the box's
    top edge (the whitespace between glyphs) and at its centre; the label click unpicks (the pick toggles); the state restored"""
    PICKED = "() => [...document.querySelectorAll('[data-midpoint-drawing] [data-midpoint-picked]')].map((e) => e.getAttribute('data-midpoint-side') + '|' + e.getAttribute('data-inside-point'))"
    box = page.evaluate("() => { const g = document.querySelector('[data-midpoint-drawing] [data-midpoint-side=\"A\"][data-inside-point=\"F1\"]'); if (!g) return null; const b = g.querySelector('[data-inside-badge]'); if (!b) return null; const r = b.getBoundingClientRect(); return { badge: b.getAttribute('data-inside-badge'), x: r.x, y: r.y, w: r.width, h: r.height }; }")
    res = {'box': box}
    if not box:
        return res
    page.mouse.click(box['x'] + box['w'] * 0.7, box['y'] + 1.5); page.wait_for_timeout(300)
    res['afterTopEdge'] = page.evaluate(PICKED)
    page.locator('[data-midpoint-drawing] [data-midpoint-side="A"][data-inside-point="F1"] [data-inside-label]').first.click(); page.wait_for_timeout(300)
    res['afterLabel'] = page.evaluate(PICKED)
    page.mouse.click(box['x'] + box['w'] / 2, box['y'] + box['h'] / 2); page.wait_for_timeout(300)
    res['afterCentre'] = page.evaluate(PICKED)
    page.mouse.click(box['x'] + box['w'] / 2, box['y'] + box['h'] / 2); page.wait_for_timeout(300)
    res['afterCentreAgain'] = page.evaluate(PICKED)
    return res


# C-12a item 6 — the words AB reads after the pairs: the own drawing's text and the own block's, and the sources' word chips
WORDS_AT_AB = """() => {
  const s = document.querySelector('[data-midpoint-surface]'); if (!s) return null;
  const txt = (el) => (el ? el.textContent.replace(/\\s+/g, ' ') : '');
  return { own: txt(s.querySelector('[data-midpoint-own-drawing]')), ownBlock: txt(s.querySelector('[data-midpoint-own]')), chips: [...s.querySelectorAll('[data-midpoint-word]')].map((e) => e.getAttribute('data-midpoint-word')) };
}"""


def cell_rows(page):
    """the workspace tree's cell rows — buttons named by their topology word first; the Genealogy rows (their `shape:`/`seed seed` tails) excluded; PRINTED by the leg, not pinned"""
    return page.get_by_role("button", name=re.compile(r"^(?!.*(shape:|seed seed))(tetrahedron|octahedron|cuboctahedron|square-pyramid|cube)\b", re.I))


def genealogy_arm(page, args):
    """C-12a item 3 — THE WAY BACK: the Genealogy panel in the workspace tab lists the session's shapes (the current marked);
    gen 1 chosen becomes current (the selection tab lists gen 1's vertices), then gen 2 chosen again (the arm ends on gen 2)"""
    ROWS = "() => [...document.querySelectorAll('button')].map((b) => ({ t: b.innerText.replace(/\\s+/g, ' ').trim(), b })).filter(({ t, b }) => /\\bg\\d+\\b/.test(t) && /(seed|ambo-dissection|patch-lift)/.test(t) && b.querySelector('span')).map(({ t, b }) => ({ text: t, current: /border-teal-400/.test(b.className) }))"
    res = {}
    tab(page, "workspace")
    res['rows'] = page.evaluate(ROWS)
    page.screenshot(path=f"{args.frames}/concept-layer-genealogy-{args.width}x{args.height}.png")
    g1 = page.get_by_role("button", name=re.compile(r"^Ambo Dissection Tetrahedron\s*g1\b"))
    res['g1Buttons'] = g1.count()
    if not g1.count():
        return res
    g1.first.click(); page.wait_for_timeout(500)
    res['rowsAtG1'] = page.evaluate(ROWS)
    res['cellRowsAtG1'] = cell_rows(page).count()  # the workspace tree lists the CURRENT shape's cells: gen 1 = 4 residues + 1 core
    # §148 ruling 3 at the eye: gen 1's core dissected AGAIN returns the EXISTING gen 2 (no fourth row; its acts intact — the
    # arms that follow read them)
    select_core(page)
    page.get_by_role("button", name=re.compile("^Apply Ambo Dissection$")).first.click(); page.wait_for_timeout(1200)
    tab(page, "workspace")
    res['rowsAfterRedissect'] = page.evaluate(ROWS)
    g2 = page.get_by_role("button", name=re.compile(r"^Ambo Dissection Tetrahedron\s*g2\b"))
    res['g2Buttons'] = g2.count()
    if g2.count():
        g2.first.click(); page.wait_for_timeout(500)
    res['rowsAtG2'] = page.evaluate(ROWS)
    res['cellRowsAtG2'] = cell_rows(page).count()  # gen 2 = 4 + 6 + 1
    return res


def cargo_arm_body(page, args, res):
    page.get_by_role("button", name=re.compile(r"^Manuscript$")).first.click(); page.wait_for_timeout(800)
    page.keyboard.press("Escape"); page.wait_for_timeout(300)
    res['dim3Groups'] = page.evaluate("() => { const out = []; const scene = window.__manuscriptScene; if (!scene) return null; scene.traverse((o) => { if ((o.name || '').startsWith('written:dim3')) out.push(o.name); }); return out; }")
    res['canvasRect'] = page.evaluate("() => { const cs = document.querySelectorAll('canvas'); const c = cs[cs.length - 1]; const r = c.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; }")
    pt = project_group(page, 'written:dim3:built-')
    res['room'] = pt
    if not pt:
        return
    # what stands at the projected point — the double-click must reach the canvas (an overlay there takes the pointer)
    res['atPoint'] = page.evaluate("([x, y]) => { const e = document.elementFromPoint(x, y); if (!e) return null; const chain = []; let n = e; while (n && chain.length < 5) { chain.push(n.tagName + ([...n.attributes].filter((a) => a.name.startsWith('data-')).map((a) => `[${a.name}=${a.value.slice(0, 40)}]`).join('') || '')); n = n.parentElement; } return chain; }", [pt['sx'], pt['sy']])
    # the selection itself: the chip is ENABLED (opacity 1) only for a selected room; 'Fit Selected' stands for any selection
    CHIP_STATE = "() => { const c = document.querySelector('button[aria-label=\"explore inside\"]'); return c ? { opacity: getComputedStyle(c).opacity, cursor: getComputedStyle(c).cursor } : null; }"
    # the summon is a real double-click ON the room's surface (Arman's law): the first mesh's sphere centre may project onto
    # empty space inside the outline, so the candidates are every mesh's projected VERTICES under the group, in order, each
    # tried until the chip enables
    candidates = page.evaluate("""(prefix) => {
      const scene = window.__manuscriptScene, camera = window.__manuscriptCamera;
      if (!scene || !camera) return [];
      const cs = document.querySelectorAll('canvas'); const canvas = cs[cs.length - 1]; const rect = canvas.getBoundingClientRect();
      const out = [];
      scene.traverse((o) => {
        if (!o.isMesh || !o.geometry || out.length > 40) return;
        let g = o, name = ''; while (g) { if ((g.name || '').startsWith(prefix)) { name = g.name; break; } g = g.parent; }
        if (!name) return;
        const pos = o.geometry.getAttribute('position'); if (!pos) return;
        // points on the segment from the mesh's projected centre toward its projected vertices: on a rod they lie on the
        // rod itself, on a shell inside its silhouette — where a real double-click meets the surface
        const V = o.position.constructor;
        if (o.geometry.computeBoundingSphere) o.geometry.computeBoundingSphere();
        const bs = o.geometry.boundingSphere; if (!bs) return;
        const cw = bs.center.clone(); o.localToWorld(cw); const pc = cw.project(camera);
        const cx = rect.left + ((pc.x + 1) / 2) * rect.width, cy = rect.top + ((1 - (pc.y + 1) / 2)) * rect.height;
        const step = Math.max(1, Math.floor(pos.count / 6));
        for (let i = 0; i < pos.count && out.length <= 60; i += step) {
          const v = new V(pos.getX(i), pos.getY(i), pos.getZ(i));
          o.localToWorld(v); const p = v.clone().project(camera);
          const vx = rect.left + ((p.x + 1) / 2) * rect.width, vy = rect.top + ((1 - (p.y + 1) / 2)) * rect.height;
          for (const f of [0.55, 0.8, 1.0]) {
            const sx = cx + (vx - cx) * f, sy = cy + (vy - cy) * f;
            if (sx > rect.left + 2 && sx < rect.right - 2 && sy > rect.top + 2 && sy < rect.bottom - 2) out.push({ mesh: o.name || o.type, sx, sy });
          }
        }
      });
      return out;
    }""", 'written:dim3:built-')
    res['candidates'] = len(candidates)
    # C-12a item 8 — a room already selected (the glue can leave it so) would be TOGGLED OFF by a double-click (`pick`
    # toggles; Arman's law); the paper is double-clicked first (dismiss) so the summon is measured from an unselected room
    res['chipBeforeSummon'] = page.evaluate(CHIP_STATE)
    if res['chipBeforeSummon'] and res['chipBeforeSummon']['opacity'] == '1':
        cr = res['canvasRect']; page.mouse.dblclick(cr['x'] + 14, cr['y'] + cr['h'] * 0.5); page.wait_for_timeout(700)
        res['chipAfterDismiss'] = page.evaluate(CHIP_STATE)
    tried = []
    for cand in [pt] + candidates[:60]:
        page.mouse.dblclick(cand['sx'], cand['sy']); page.wait_for_timeout(900)
        state = page.evaluate(CHIP_STATE)
        tried.append([round(cand['sx']), round(cand['sy']), state and state['opacity']])
        if state and state['opacity'] == '1':
            break
    res['summonTries'] = tried
    res['summonTakenAt'] = len(tried) if tried and tried[-1][2] == '1' else None
    res['chipAfterDblclick'] = page.evaluate(CHIP_STATE)
    # C-12a item 8 — THE HIT HULL: the room selected, its domain is drawn above the plaque; a double-click in the domain's
    # interior must reach the ROOM's group (its own click handler, detail 2) and never the paper's (whose double-click
    # dismisses) — the group's toggle turns the room off, and the same point turns it on again
    res['domainInterior'] = page.evaluate(DOMAIN_INTERIOR, 'written:dim3:built-')
    di = res['domainInterior']
    if di and di.get('centre'):
        page.evaluate(INSTRUMENT_CLICKS, 'written:dim3:built-')
        page.mouse.dblclick(di['centre'][0], di['centre'][1]); page.wait_for_timeout(700)
        res['domainInteriorClicks'] = page.evaluate("() => window.__c12aLog.splice(0)")
        res['chipAfterInterior'] = page.evaluate(CHIP_STATE)
        # the room's own handler TOGGLED it off (`pick`'s law) and its domain is no longer drawn — the plaque takes it back
        page.mouse.dblclick(pt['sx'], pt['sy']); page.wait_for_timeout(900)
        res['chipAfterReselect'] = page.evaluate(CHIP_STATE)
    chip = page.locator('button[aria-label="explore inside"]')
    res['exploreChip'] = chip.count()
    if not chip.count():
        return
    # the room's caption under its title (the aperture gate's own words) and the chip's box, before the press
    res['roomCaption'] = page.evaluate("() => { const t = document.body.innerText; const i = t.indexOf('built 3-manifold 1'); const ap = window.__manuscriptApertures || null; return { text: i >= 0 ? t.slice(i, i + 300) : null, apertureSeam: ap ? ap['built-1'] || null : 'no seam', apertureKeys: ap ? Object.keys(ap) : null }; }")
    box = chip.first.bounding_box()
    res['chipBox'] = box
    chip.first.click(); page.wait_for_timeout(600)
    res['afterFirstPress'] = page.evaluate("() => ({ seam: Boolean(window.__exploreWindow), windows: document.querySelectorAll('[data-explore-window]').length, refusal: (document.querySelector('[data-explore-refusal]') || {}).textContent || null })")
    if not res['afterFirstPress']['windows'] and box:
        # a second way: the pointer pressed on the chip's own centre (the chip opens on mousedown)
        page.mouse.move(box['x'] + box['width'] / 2, box['y'] + box['height'] / 2); page.wait_for_timeout(150)
        page.mouse.down(); page.wait_for_timeout(80); page.mouse.up(); page.wait_for_timeout(600)
        res['afterSecondPress'] = page.evaluate("() => ({ seam: Boolean(window.__exploreWindow), windows: document.querySelectorAll('[data-explore-window]').length, refusal: (document.querySelector('[data-explore-refusal]') || {}).textContent || null })")
    try:
        page.wait_for_function("() => window.__exploreWindow && window.__exploreWindow.gpu && window.__exploreWindow.renderFrames > 3", timeout=30000)
    except Exception as e:
        res['windowWait'] = str(e)[:200]
    # what the door said: the refusal at the threshold (by name), the window's presence, the seam's shape
    res['threshold'] = page.evaluate("() => ({ seam: Boolean(window.__exploreWindow), seamOpen: window.__exploreWindow ? window.__exploreWindow.open : null, gpu: window.__exploreWindow ? window.__exploreWindow.gpu : null, frames: window.__exploreWindow ? window.__exploreWindow.renderFrames : null, windows: document.querySelectorAll('[data-explore-window]').length, refusals: [...document.querySelectorAll('div, p, span')].map((e) => e.textContent.trim()).filter((t) => /refus|no walk|nothing recurs|does not open|there is no/i.test(t) && t.length < 400).slice(0, 4) })")
    res['opened'] = page.evaluate(MEASURE_CARGO)
    page.screenshot(path=f"{args.frames}/concept-layer-cargo-pick-{args.width}x{args.height}.png")
    pick = page.locator('[data-explore-cargo-pick]').filter(has_text=re.compile(r'^F1$'))
    if not pick.count():
        return
    pick.first.click(); page.wait_for_timeout(400)
    res['picked'] = page.evaluate(MEASURE_CARGO)
    r = cargo_rod(page, 'A–AC')
    res['rodAC'] = r.count()
    if r.count():
        r.first.click(); page.wait_for_timeout(400)
    res['afterRod'] = page.evaluate(MEASURE_CARGO)
    page.screenshot(path=f"{args.frames}/concept-layer-cargo-rod-{args.width}x{args.height}.png")
    # the door by its letter — one press, one period (K-1e); the crossing carries the cargo at AC across to AD
    page.evaluate("() => { window.__exploreWindow.paceOverride = 0.6; }")
    page.locator('[data-explore-window] canvas').first.hover(); page.wait_for_timeout(200)
    page.keyboard.press('a')
    try:
        page.wait_for_function("() => window.__exploreWindow.doors >= 1", timeout=60000)
    except Exception as e:
        res['doorWait'] = str(e)[:200]
    page.wait_for_timeout(800)
    res['afterDoor'] = page.evaluate(MEASURE_CARGO)
    page.screenshot(path=f"{args.frames}/concept-layer-cargo-door-{args.width}x{args.height}.png")
    r = cargo_rod(page, 'AD–A')
    res['rodA'] = r.count()
    if r.count():
        r.first.click(); page.wait_for_timeout(400)
    res['home'] = page.evaluate(MEASURE_CARGO)
    page.screenshot(path=f"{args.frames}/concept-layer-cargo-home-{args.width}x{args.height}.png")
    # a second cargo the door does not carry: the window closed and reopened (a room opened is a walk begun), F2 picked
    page.keyboard.press("Escape"); page.wait_for_timeout(500)
    chip = page.locator('button[aria-label="explore inside"]')
    if chip.count():
        chip.first.click(); page.wait_for_timeout(600)
        try:
            page.wait_for_function("() => window.__exploreWindow && window.__exploreWindow.gpu && window.__exploreWindow.renderFrames > 3 && window.__exploreWindow.doors === 0", timeout=30000)
        except Exception as e:
            res['reopenWait'] = str(e)[:200]
        res['reopened'] = page.evaluate(MEASURE_CARGO)
        pick = page.locator('[data-explore-cargo-pick]').filter(has_text=re.compile(r'^F2$'))
        if pick.count():
            pick.first.click(); page.wait_for_timeout(300)
            r = cargo_rod(page, 'A–AC')
            if r.count():
                r.first.click(); page.wait_for_timeout(300)
            page.evaluate("() => { window.__exploreWindow.paceOverride = 0.6; }")
            page.locator('[data-explore-window] canvas').first.hover(); page.wait_for_timeout(200)
            page.keyboard.press('a')
            try:
                page.wait_for_function("() => window.__exploreWindow.doors >= 1", timeout=60000)
            except Exception as e:
                res['doorWait2'] = str(e)[:200]
            page.wait_for_timeout(800)
            res['lost'] = page.evaluate(MEASURE_CARGO)
            page.screenshot(path=f"{args.frames}/concept-layer-cargo-lost-{args.width}x{args.height}.png")


# ─── C-10b — the face's HOME, the site's lines, the canvas note, the lineage line (§131, the designer's four blockers) ───
SITE_FACES = """() => {
  const panel = document.querySelector('[data-midpoint-surface]');
  const txt = (el) => (el ? el.textContent.replace(/\\s+/g, ' ').trim() : null);
  if (!panel) return { present: false };
  return { present: true, lines: [...panel.querySelectorAll('[data-midpoint-born-face-at-site]')].map((e) => ({ face: e.getAttribute('data-midpoint-born-face-at-site'), kind: e.getAttribute('data-midpoint-born-face-kind'), text: txt(e), button: Boolean(e.querySelector('[data-midpoint-select-face]')) })), blocks: panel.querySelectorAll('[data-midpoint-born-face]').length };
}"""
FACE_HOME = """() => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height), bottom: Math.round(b.bottom), right: Math.round(b.right) }; };
  const txt = (el) => (el ? el.textContent.replace(/\\s+/g, ' ').trim() : null);
  const h = document.querySelector('[data-face-home]');
  const readout = document.querySelector('[data-ambo-hover-readout="true"]');
  if (!h) return { present: false, readout: txt(readout) };
  const blocks = [...h.querySelectorAll('[data-midpoint-born-face]')].map((b) => ({ face: b.getAttribute('data-midpoint-born-face'), cells: b.getAttribute('data-midpoint-born-face-cells'), alike: b.getAttribute('data-midpoint-born-face-alike'), states: [...b.querySelectorAll('[data-midpoint-born-face-state]')].map((e) => e.getAttribute('data-midpoint-born-face-state')), ground: b.querySelectorAll('[data-midpoint-born-face-line="ground"]').length, noNews: b.querySelectorAll('[data-midpoint-born-face-line="no-news"]').length, news: [...b.querySelectorAll('[data-midpoint-born-face-news]')].map((e) => txt(e)), hands: [...b.querySelectorAll('[data-midpoint-born-face-hands]')].map((e) => txt(e)), alikeLine: b.querySelectorAll('[data-midpoint-born-face-alike-line]').length, withdraws: b.querySelectorAll('[data-midpoint-born-face-withdraw]').length, head: txt(b.querySelector('[data-midpoint-born-face-state="read"] > span')) }));
  const seed = h.querySelector('[data-midpoint-face-reading]');
  const b = r(h);
  return { present: true, name: h.getAttribute('data-face-home'), kind: h.getAttribute('data-face-home-kind'), head: txt(h.querySelector('[data-face-home-head]')), blocks, seedState: seed ? seed.getAttribute('data-midpoint-face-state') : null, cornerCell: Boolean(h.querySelector('[data-face-home-state="corner-cell"]')), box: b, inViewport: b.y >= 0 && b.y < window.innerHeight, readout: txt(readout) };
}"""
FACE_ROWS = """() => { const txt = (el) => (el ? el.textContent.replace(/\\s+/g, ' ').trim() : null); return [...document.querySelectorAll('[data-face-row]')].map((e) => ({ id: e.getAttribute('data-face-row'), name: txt(e.querySelector('span span')), lineage: txt(e.querySelector('[data-face-row-lineage]')), selected: e.getAttribute('aria-selected') === 'true' })); }"""
READOUT = """() => { const e = document.querySelector('[data-ambo-hover-readout="true"]'); return e ? e.textContent.replace(/\\s+/g, ' ').trim() : null; }"""
EXPLODE = """() => { const lab = [...document.querySelectorAll('label')].find((e) => /^Explode View/.test(e.textContent.trim())); if (!lab) return null; const input = lab.querySelector('input[type="range"]'); if (!input) return null; const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(input, '60'); input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new Event('change', { bubbles: true })); return input.value; }"""


def face_home_arm(page, args, kind):
    """C-10b: at the site (ABAC selected), the line for the born face of the given kind → `select it to read it` → the face's home in the selection tab; the face rows' lineage lines and the note while hovering a row"""
    res = {'site': page.evaluate(SITE_FACES)}
    lines = res['site'].get('lines') or []
    buttons = [l for l in lines if l['button']]
    target = next((l for l in buttons if l['kind'] == kind), None)
    res['target'] = target
    if target:
        page.locator('[data-midpoint-select-face]').nth(buttons.index(target)).click(); page.wait_for_timeout(500)
        tab(page, "selection")
        res['home'] = page.evaluate(FACE_HOME)
        page.evaluate("() => { const s = document.querySelector('[data-face-home]'); if (s) s.scrollIntoView({ block: 'start' }); }"); page.wait_for_timeout(200)
        res['homeScrolled'] = page.evaluate(FACE_HOME)
        page.screenshot(path=f"{args.frames}/concept-layer-face-home-{kind}-{args.width}x{args.height}.png")
    rows = page.locator('[data-face-row]')
    res['rowCount'] = rows.count()
    if rows.count():
        rows.first.hover(); page.wait_for_timeout(300)
        res['readoutOnRow'] = page.evaluate(READOUT)
    res['rows'] = page.evaluate(FACE_ROWS)
    return res


def canvas_face_arm(page, args):
    """C-10b: Arman's route — the explode view, point at a face on the solid (the note names it), click (its reading mounts at its home)"""
    res = {}
    # a selected VERTEX mounts the midpoint panel over the solid — select the cell alone, so the solid is under the pointer
    res['cellRow'] = select_cell(page, r"^octahedron")
    tab(page, "workspace")
    res['explode'] = page.evaluate(EXPLODE); page.wait_for_timeout(500)
    box = page.locator("canvas").first.bounding_box()
    hits = []
    for dx, dy in ((0, 0), (-90, -40), (90, 40), (-60, 70), (60, -70)):
        x = box["x"] + box["width"] / 2 + dx; y = box["y"] + box["height"] / 2 + dy
        page.mouse.move(x, y); page.wait_for_timeout(250)
        hover = page.evaluate(READOUT)
        hits.append({'dx': dx, 'dy': dy, 'hover': hover})
        if hover and hover.startswith('face '):
            page.mouse.down(); page.wait_for_timeout(40); page.mouse.up(); page.wait_for_timeout(600)
            tab(page, "selection")
            res['home'] = page.evaluate(FACE_HOME)
            res['hover'] = hover
            page.screenshot(path=f"{args.frames}/concept-layer-canvas-face-{args.width}x{args.height}.png")
            break
    res['hits'] = hits
    return res


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--url', required=True)
    ap.add_argument('--frames', required=True)
    ap.add_argument('--width', type=int, default=1689)
    ap.add_argument('--height', type=int, default=897)
    args = ap.parse_args()
    out = {'viewport': [args.width, args.height]}
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": args.width, "height": args.height})
        page_errors = []
        page.on('pageerror', lambda e: page_errors.append(f'pageerror: {str(e)[:400]}'))
        page.on('console', lambda m: page_errors.append(f'console.{m.type}: {m.text[:400]}') if m.type in ('error', 'warning') else None)
        out['pageErrors'] = page_errors
        page.goto(args.url); page.wait_for_timeout(3000)
        out['whereami'] = page.evaluate(WHEREAMI)
        out['census'] = {'controlsAtStart': census(page, '@controls')}  # Fit Selected disabled, the workspace tab active
        click_canvas_center(page)
        for index, fixture in ((0, "flow.cast.json"), (1, "phi.cast.json"), (2, "t-cell.cast.json"), (3, "phi.cast.json")):
            out[f'load{index}'] = load_cast(page, index, fixture)
        page.get_by_role("button", name=re.compile("^Apply Ambo Dissection$")).first.click(); page.wait_for_timeout(1200)
        tab(page, "selection"); select_core(page)
        out['selectAB'] = select_vertex_labelled(page, "AB")
        out['unglued'] = page.evaluate(MEASURE)
        page.screenshot(path=f"{args.frames}/concept-layer-ab-unglued-{args.width}x{args.height}.png")
        out['badgeClick'] = badge_click(page)  # C-12a item 5
        # the two halves, as a person makes them: a role pair in the drawing, a word pair in the rows
        point(page, "A", "F5"); point(page, "B", "Φ7")
        word(page, "A", "sustains"); word(page, "B", "descends-from")
        out['oneEach'] = page.evaluate(MEASURE)
        point(page, "A", "F7"); point(page, "B", "Φ1"); point(page, "A", "F8"); point(page, "B", "Φ2")
        word(page, "A", "presupposes"); word(page, "B", "specifies"); word(page, "A", "exceeds-in-size"); word(page, "B", "lodges-in")
        out['glued'] = page.evaluate(MEASURE)
        out['abWords'] = page.evaluate(WORDS_AT_AB)  # C-12a item 6
        page.screenshot(path=f"{args.frames}/concept-layer-ab-glued-{args.width}x{args.height}.png")
        # C-7f item 1 — the foot-anchored plate: the drawing scrolled into view (the plate the designer rules)
        page.locator('[data-midpoint-surface]').first.evaluate("(el) => { const d = el.querySelector('[data-midpoint-drawing]'); if (d) d.scrollIntoView(); }"); page.wait_for_timeout(300)
        page.screenshot(path=f"{args.frames}/concept-layer-ab-foot-words-{args.width}x{args.height}.png")
        page.locator('[data-midpoint-surface]').first.evaluate("(el) => { const own = el.querySelector('[data-midpoint-own]'); if (own) own.scrollIntoView(); }"); page.wait_for_timeout(300)
        page.screenshot(path=f"{args.frames}/concept-layer-ab-own-diagram-{args.width}x{args.height}.png")
        # the refusal at the act, with its hands
        point(page, "A", "F1"); point(page, "B", "Φ9")
        out['refused'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('refusal', 'conflicts', 'hands', 'lines', 'refusalText', 'refusalHands', 'oldGrammar')}
        page.locator('[data-midpoint-withdraw-attempt]').first.click(); page.wait_for_timeout(400)
        # the neighbouring act on A–C, then AB's source C carries it
        out['selectAC'] = select_vertex_labelled(page, "AC")
        ac = page.evaluate(MEASURE)
        # the AC edge's orientation decides which side holds Flow
        a_side_points = page.evaluate("() => [...document.querySelectorAll('[data-midpoint-drawing] [data-midpoint-side=A]')].map((e) => e.getAttribute('data-inside-point'))")
        if 'F1' in a_side_points:
            point(page, "A", "F1"); point(page, "B", "r0"); word(page, "A", "sustains"); word(page, "B", "sustains")
        else:
            point(page, "A", "r0"); point(page, "B", "F1"); word(page, "A", "sustains"); word(page, "B", "sustains")
        out['acGiven'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('lines', 'wordPairs', 'state')}
        out['selectAB2'] = select_vertex_labelled(page, "AB")
        out['abWithNeighbour'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('sourceActs', 'faces', 'lines')}
        page.locator('[data-midpoint-surface]').first.evaluate("(el) => el.scrollTo(0, 0)"); page.wait_for_timeout(200)
        page.screenshot(path=f"{args.frames}/concept-layer-ab-sources-carry-acts-{args.width}x{args.height}.png")
        # ─── C-7f — the designer's eight at the eye ───
        # item 6 — the source above says what it holds; its drawing opens on request, WHOLE
        page.locator('[data-midpoint-source-open]').first.click(); page.wait_for_timeout(500)
        out['sourceOpened'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('sourceOpen', 'sourcePoints', 'sourceFonts', 'sourceWords')}
        page.screenshot(path=f"{args.frames}/concept-layer-source-open-{args.width}x{args.height}.png")
        page.locator('[data-midpoint-source-open]').first.click(); page.wait_for_timeout(300)
        # item 3 — the re-made pair attributed, at CD (C holds the T cell, D holds Φ; the edge's orientation decides the sides)
        out['selectCD'] = select_vertex_labelled(page, "CD")
        cd_a = page.evaluate("() => [...document.querySelectorAll('[data-midpoint-drawing] [data-midpoint-side=A]')].map((e) => e.getAttribute('data-inside-point'))")
        if 'r8' in cd_a:
            point(page, "A", "r8"); point(page, "B", "Φ6"); word(page, "A", "sustains"); word(page, "B", "descends-from"); point(page, "A", "r0"); point(page, "B", "Φ1")
            prior = '[data-midpoint-withdraw="role|r8|Φ6"]'
        else:
            point(page, "A", "Φ6"); point(page, "B", "r8"); word(page, "A", "descends-from"); word(page, "B", "sustains"); point(page, "A", "Φ1"); point(page, "B", "r0")
            prior = '[data-midpoint-withdraw="role|Φ6|r8"]'
        out['cdRefused'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('refusal', 'conflicts', 'hands')}
        page.locator(prior).first.click(); page.wait_for_timeout(500)
        out['cdRemade'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('lines', 'wordPairs', 'remade', 'sentence')}
        page.screenshot(path=f"{args.frames}/concept-layer-cd-remade-{args.width}x{args.height}.png")
        # item 7 — the census of the panel's text, both readings
        out['census']['panel'] = census(page, '[data-midpoint-surface]')
        # item 5 — the card at C (the T cell): the parent cell's corners in the selection tab
        out['selectParent'] = select_cell(page, r"^tetrahedron")
        out['selectC'] = select_vertex_labelled(page, "C")
        out['card'] = page.evaluate(CARD)
        out['census']['card'] = census(page, 'dl:has([data-cast-card-row])')
        page.evaluate("() => { const r = document.querySelector('[data-cast-card-row=\"summary\"]'); if (r) r.closest('dl').scrollIntoView(); }"); page.wait_for_timeout(300)
        page.screenshot(path=f"{args.frames}/concept-layer-card-{args.width}x{args.height}.png")
        tab(page, "packets")
        out['census']['packets'] = census(page, '@packets')
        out['census']['controlsWithSelection'] = census(page, '@controls')
        # C-7g item 3 — the card at B (Φ, 15 relation-types): its height beside the T cell's
        out['selectB'] = select_vertex_labelled(page, "B")
        out['cardPhi'] = page.evaluate(CARD)
        page.evaluate("() => { const r = document.querySelector('[data-cast-card-row=\"summary\"]'); if (r) r.closest('dl').scrollIntoView(); }"); page.wait_for_timeout(300)
        page.screenshot(path=f"{args.frames}/concept-layer-card-phi-{args.width}x{args.height}.png")
        # ─── C-5 — THE FACE at the eye: the face A·B·C through the source C, read at the AB midpoint ───
        select_core(page)
        out['selectAB4'] = select_vertex_labelled(page, "AB")
        out['faceAbsent'] = page.evaluate(FACE)   # A–B holds (i), C–A holds F1 ↦ r0; B–C holds nothing → the guard in words
        # the records of (i)+S1+Q: (i) stands on A–B; S1 on C–A replaces the earlier F1 ↦ r0 (S1 pairs F1 with r2); Q on B–C
        out['selectAC3'] = select_vertex_labelled(page, "AC")
        page.locator('[data-midpoint-withdraw="role|F1|r0"], [data-midpoint-withdraw="role|r0|F1"]').first.click(); page.wait_for_timeout(400)
        give_map(page, {"r0": "F13", "r1": "F9", "r2": "F1", "r4": "F12", "r6": "F3", "r8": "F7"})
        out['selectBC'] = select_vertex_labelled(page, "BC")
        give_map(page, {"r9": "Φ6", "r1": "Φ1", "r0": "Φ8", "r7": "Φ5", "r6": "Φ2"})
        out['selectAB5'] = select_vertex_labelled(page, "AB")
        out['faceRefused'] = page.evaluate(FACE)
        page.locator('[data-midpoint-surface]').first.evaluate("(el) => { const f = el.querySelector('[data-midpoint-face-reading]'); if (f) f.scrollIntoView(); }"); page.wait_for_timeout(300)
        page.screenshot(path=f"{args.frames}/concept-layer-face-refused-{args.width}x{args.height}.png")
        page.locator('[data-midpoint-face-withdraw]').first.click(); page.wait_for_timeout(500)
        out['faceRead'] = page.evaluate(FACE)
        page.screenshot(path=f"{args.frames}/concept-layer-face-read-{args.width}x{args.height}.png")
        # C-8 item 2 at the eye — the loader ABSENT at a midpoint (the packets tab with AB selected shows no file input, no word), PRESENT at a corner
        select_core(page)
        select_vertex_labelled(page, "AB"); out['cardAB'] = page.evaluate(CARD_BORN); tab(page, "packets")
        out['loaderAtMidpoint'] = page.evaluate("() => ({ inputs: document.querySelectorAll('[data-cast-file-input]').length, offer: [...document.querySelectorAll('button')].filter((b) => /load cast/.test(b.textContent)).length, words: /only the seed|seed alone|cannot load/i.test(document.body.innerText) })")
        select_cell(page, r"^tetrahedron"); select_vertex_labelled(page, "A"); tab(page, "packets")
        out['loaderAtCorner'] = page.evaluate("() => ({ inputs: document.querySelectorAll('[data-cast-file-input]').length, offer: [...document.querySelectorAll('button')].filter((b) => /load cast/.test(b.textContent)).length })")
        select_core(page)
        # the records as they stand just before the dissection — the carry is compared against THESE at gen 2
        out['selectAB6'] = select_vertex_labelled(page, "AB")
        out['abBefore'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('lines', 'wordPairs', 'own', 'ownPoints', 'ownBoth')}
        out['selectAC4'] = select_vertex_labelled(page, "AC")
        out['acBefore'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('lines', 'wordPairs')}
        # C-11a — the gen-1 residue at A lifted NOW, before the second dissection (the door arm builds a room from it)
        out['liftGen1'] = lift_gen1_arm(page, args)
        # C-7e (Δ84 "pay the price") — THE SECOND DISSECTION AT THE EYE: with the pairs given at AB (3 + τ₃) and at AC
        # (1 + 1), the core dissected again; at gen 2 the octahedron (the gen-1 core, now the parent) holds the gen-1
        # midpoints as its corners — AB selected from it, and what the person sees read: the pairs, the own diagram, the
        # trace, C's act on A–C; then AC.
        select_core(page)
        page.get_by_role("button", name=re.compile("^Apply Ambo Dissection$")).first.click(); page.wait_for_timeout(1500)
        out['selectGen2Parent'] = select_cell(page, r"^octahedron")
        out['selectAB3'] = select_vertex_labelled(page, "AB")
        out['gen2'] = page.evaluate(MEASURE)
        page.screenshot(path=f"{args.frames}/concept-layer-ab-gen2-carried-{args.width}x{args.height}.png")
        out['selectAC2'] = select_vertex_labelled(page, "AC")
        out['gen2AC'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('present', 'lines', 'wordPairs', 'state')}
        out['genealogy'] = genealogy_arm(page, args)  # C-12a item 3 — ends back on gen 2
        # C-8 — THE BORN ROOM at the gen-2 midpoint ABAC, reached lawfully (AB and AC mapped by pointing above; nothing loaded on a midpoint)
        out['selectGen2Core'] = select_cell(page, r"^cuboctahedron")
        out['selectABAC'] = select_vertex_labelled(page, "ABAC")
        out['bornRoom'] = page.evaluate(MEASURE)
        # C-10b: the born faces named at the site, read at their homes — the interior face, then the one-cell (medial) face
        out['faceHomeInterior'] = face_home_arm(page, args, 'interior')
        out['selectABAC2'] = select_vertex_labelled(page, "ABAC")
        out['faceHomeOneCell'] = face_home_arm(page, args, 'one-cell')
        out['selectABAC3'] = select_vertex_labelled(page, "ABAC")
        out['bornRoom'] = page.evaluate(MEASURE)
        page.locator('[data-midpoint-surface]').first.evaluate("(el) => el.scrollTo(0, 0)"); page.wait_for_timeout(200)
        page.screenshot(path=f"{args.frames}/concept-layer-born-room-{args.width}x{args.height}.png")
        br = out['bornRoom']
        if br.get('present') and br.get('composedPoints'):
            # a composed point clicked: nothing picked (never a pair, never a control)
            page.locator('[data-midpoint-drawing] [data-midpoint-side="A"][data-midpoint-composed] text').first.click(); page.wait_for_timeout(300)
            out['composedClick'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('pick', 'lines', 'refusal')}
            # a born pair by two clicks: a role of AB's own part and a role of AC's own part
            if br.get('freeA') and br.get('freeB'):
                xb, yb = br['freeA'][0], br['freeB'][0]
                point(page, "A", xb); point(page, "B", yb)
                out['bornPair'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('lines', 'sentence', 'state', 'refusal', 'home', 'bornFaces')}
                out['bornPair']['x'] = xb; out['bornPair']['y'] = yb
                page.locator('[data-midpoint-surface]').first.evaluate("(el) => { const l = el.querySelector('[data-midpoint-line]'); if (l) l.scrollIntoView(); }"); page.wait_for_timeout(200)
                page.screenshot(path=f"{args.frames}/concept-layer-born-pair-{args.width}x{args.height}.png")
                # C-10b: after the born pair, the one-cell (medial) face's home — where a closed route is the news
                out['faceHomeAfter'] = face_home_arm(page, args, 'one-cell')
                out['selectABAC4'] = select_vertex_labelled(page, "ABAC")
                # C-10b: Arman's route — the explode view, point at a face on the solid, click
                out['canvasFace'] = canvas_face_arm(page, args)
                out['selectABAC5'] = select_vertex_labelled(page, "ABAC")
                # C-10 — THE LIFT CARRIES: with the born pair standing on AB–AC, lift the gen-1 residue at A and read it on the Manuscript
                out['lift'] = lift_arm(page, args)
                # C-11a — THE DOOR's ACT at the aperture's pairing row, on the gen-1 residue placed beside the C-10 form
                out['door'] = door_arm(page, args)
                # C-11b — THE CARGO ON THE WALK: the room just built, walked with F1 in hand
                out['cargo'] = cargo_arm(page, args)
                # THE DEPENDENCY REFUSAL: back at AB (gen 2), a gen-0 pair that re-glues the role the born pair named (the Φ-side role of AB's own part)
                # the born pair's role on AB's own part is a Φ role (B holds Φ); its key carries the edge's side prefix, stripped here
                phi_role = next((k[2:] for k in (xb, yb) if k[2:].startswith('Φ')), None)
                if phi_role:
                    out['selectGen2Parent2'] = select_cell(page, r"^octahedron")
                    out['selectAB7'] = select_vertex_labelled(page, "AB")
                    a_side = page.evaluate("() => [...document.querySelectorAll('[data-midpoint-drawing] [data-midpoint-side=A]:not([data-midpoint-paired])')].map((e) => e.getAttribute('data-inside-point'))")
                    b_side = page.evaluate("() => [...document.querySelectorAll('[data-midpoint-drawing] [data-midpoint-side=B]:not([data-midpoint-paired])')].map((e) => e.getAttribute('data-inside-point'))")
                    free_flow = [r for r in (a_side if 'F1' in a_side or any(x.startswith('F') for x in a_side) else b_side) if x_is_flow(r)][0]
                    pair(page, free_flow, phi_role)
                    out['dependency'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('refusal', 'refusalText', 'dependency', 'dependencyHands', 'lines', 'refusalAct', 'refusalCollision', 'oldGrammar')}
                    out['dependency']['attempt'] = [free_flow, phi_role]
                    page.locator('[data-midpoint-surface]').first.evaluate("(el) => { const r = el.querySelector('[data-midpoint-refusal]'); if (r) r.scrollIntoView(); }"); page.wait_for_timeout(200)
                    page.screenshot(path=f"{args.frames}/concept-layer-dependency-refusal-{args.width}x{args.height}.png")
                    # the far hand: the born pair withdrawn at ABAC — then the same act made again is TAKEN
                    far = page.locator('[data-midpoint-dependency-withdraw]')
                    if far.count():
                        far.first.click(); page.wait_for_timeout(400)
                        page.locator('[data-midpoint-withdraw-attempt]').first.click(); page.wait_for_timeout(300)
                        pair(page, free_flow, phi_role)
                        out['dependencyAfter'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('refusal', 'lines')}
        browser.close()
    print(json.dumps(out, ensure_ascii=False))


if __name__ == '__main__':
    main()
