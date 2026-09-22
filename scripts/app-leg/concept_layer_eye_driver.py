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
    const words = [...col.querySelectorAll('[data-inside-arc-word]')].map((e) => box(e.closest('text')));
    const labels = [...col.querySelectorAll('[data-inside-point] text')].map((e) => box(e));
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


def select_core(page):
    tab(page, "workspace")
    rows = page.get_by_role("button", name=re.compile("core", re.I))
    rows.first.click(); page.wait_for_timeout(600)


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
        browser.close()
    print(json.dumps(out, ensure_ascii=False))


if __name__ == '__main__':
    main()
