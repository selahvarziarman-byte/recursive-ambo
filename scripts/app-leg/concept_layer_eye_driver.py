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
    and the face READ with its direction stated; ITEM 0 — casts onto two born corners, the core dissected again, the gen-2
    midpoint between them selected and its surface read (a measurement, printed);
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
  const inter = (p, q) => p.x < q.r && q.x < p.r && p.y < q.b && q.y < p.b;
  const drawing = panel.querySelector('[data-midpoint-drawing]');
  const perColumn = drawing ? [...drawing.querySelectorAll('[data-inside-column]')].map((col) => {
    const words = [...col.querySelectorAll('[data-inside-arc-word]')].map((e) => box(e));
    const labels = [...col.querySelectorAll('[data-inside-label]')].map((e) => box(e.closest('text')));
    let ww = 0; let wl = 0;
    for (let i = 0; i < words.length; i += 1) for (let j = i + 1; j < words.length; j += 1) if (inter(words[i], words[j])) ww += 1;
    for (const w of words) for (const l of labels) if (inter(w, l)) wl += 1;
    return { arcWords: words.length, wordWordOverlaps: ww, wordLabelOverlaps: wl };
  }) : [];
  const gesture = document.querySelector('[data-ambo-gesture-line]');
  return {
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
      text: b.textContent.replace(/\\s+/g, ' ').trim().slice(0, 700),
      hands: [...b.querySelectorAll('[data-midpoint-face-withdraw]')].map((e) => e.getAttribute('data-midpoint-face-withdraw')),
      corners: [...b.querySelectorAll('[data-midpoint-face-corner]')].map((e) => ({ corner: e.getAttribute('data-midpoint-face-corner'), fix: e.getAttribute('data-midpoint-face-fix'), mov: e.getAttribute('data-midpoint-face-mov'), und: e.getAttribute('data-midpoint-face-und'), core: e.getAttribute('data-midpoint-face-core') })),
      box: { y: Math.round(r.y), h: Math.round(r.height), insidePanel: r.y >= P.y && r.bottom <= P.bottom },
    };
  });
  return { present: true, blocks };
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
    rows: [...dl.querySelectorAll('[data-cast-card-row]')].map((e) => ({ row: e.getAttribute('data-cast-card-row'), ...R(e), spans: e.getBoundingClientRect().width >= inner - 1 })) };
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
        out['refused'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('refusal', 'conflicts', 'hands', 'lines')}
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
        # ITEM 0 (1705 §4) — casts onto two BORN corners (the gen-1 midpoints AB and AC) before the dissection below
        select_core(page)
        out['loadAB'] = load_cast(page, 0, "flow.cast.json")
        out['loadAC'] = load_cast(page, 1, "phi.cast.json")
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
        # ITEM 0 — the gen-2 midpoint between the two born corners: its surface, and a pair by two clicks (a measurement, printed)
        out['selectGen2Core'] = select_cell(page, r"^cuboctahedron")
        out['selectABAC'] = select_vertex_labelled(page, "ABAC")
        out['item0'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('present', 'sentence', 'state', 'lines')}
        if out['item0'].get('present'):
            pair(page, "F1", "Φ1")
            out['item0After'] = {k: v for k, v in page.evaluate(MEASURE).items() if k in ('lines', 'sentence', 'state')}
            page.screenshot(path=f"{args.frames}/concept-layer-item0-born-parents-{args.width}x{args.height}.png")
        browser.close()
    print(json.dumps(out, ensure_ascii=False))


if __name__ == '__main__':
    main()
