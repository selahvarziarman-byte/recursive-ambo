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
        # the two halves, as a person makes them: a role pair in the drawing, a word pair in the rows
        point(page, "A", "F5"); point(page, "B", "Φ7")
        word(page, "A", "sustains"); word(page, "B", "descends-from")
        out['oneEach'] = page.evaluate(MEASURE)
        point(page, "A", "F7"); point(page, "B", "Φ1"); point(page, "A", "F8"); point(page, "B", "Φ2")
        word(page, "A", "presupposes"); word(page, "B", "specifies"); word(page, "A", "exceeds-in-size"); word(page, "B", "lodges-in")
        out['glued'] = page.evaluate(MEASURE)
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
        # C-8 — THE BORN ROOM at the gen-2 midpoint ABAC, reached lawfully (AB and AC mapped by pointing above; nothing loaded on a midpoint)
        out['selectGen2Core'] = select_cell(page, r"^cuboctahedron")
        out['selectABAC'] = select_vertex_labelled(page, "ABAC")
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
