# PROBE — NOT A WITNESS (not in the sweep, not in the drive family): run by hand against a served build, `python probe-vl-38-typed-keys.py http://localhost:<port>/`. The record of the
# measurement of 2026-10-19 for Virgin Land's finding 38 (the mothership's 14:35); its output rode the coder's report of that day.
# VL 38 — MEASURE FIRST (the mothership's 14:35): does a light's box keep its word while the next box of the batch is filled?
# Four arms on one light, each on two fresh boxes of the same batch: (1) TYPED KEYS, the way a person fills two boxes; (2) Virgin Land's way as it
# described it — the value set and an input event sent — for BOTH boxes in ONE script tick (the native setter, so React sees the change);
# (3) the same, one box per tick; (4) the value set PLAINLY (no native setter) with an input event. The record button's count and the inputs' values
# are read after each; a positive control for "not reproduced" is an arm that DOES lose the word (LAW 24). Every arm is independent; the record
# is printed whatever happens.
import json, os, sys, traceback
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import concept_layer_eye_driver as D
from playwright.sync_api import sync_playwright

url = sys.argv[1]
label = sys.argv[2] if len(sys.argv) > 2 else 'Culture'
fixture = os.path.join(REPO, 'scripts/fixtures/altitude/virgin-land_2026-10-09_1904_Value-Fact_named-Culture.workspace.json')
out = {'url': url, 'label': label}
VALUES = "() => [...document.querySelectorAll('input[data-altitude-word]')].map((i) => [i.getAttribute('data-altitude-word'), i.value])"
RECORD = "() => { const r = document.querySelector('[data-altitude-record]'); return r ? { count: r.getAttribute('data-altitude-record'), label: r.textContent.trim(), disabled: r.disabled } : null; }"
RECORDED = "() => [...document.querySelectorAll('[data-altitude-recorded]')].map((e) => ({ key: e.getAttribute('data-altitude-recorded'), text: e.textContent.replace(/\\s+/g, ' ').trim() }))"
SET_NATIVE = """([pairs]) => { const d = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value'); for (const [k, w] of pairs) { const i = document.querySelector(`input[data-altitude-word="${k}"]`); d.set.call(i, w); i.dispatchEvent(new Event('input', { bubbles: true })); } return pairs.length; }"""
SET_PLAIN = """([pairs]) => { for (const [k, w] of pairs) { const i = document.querySelector(`input[data-altitude-word="${k}"]`); i.value = w; i.dispatchEvent(new Event('input', { bubbles: true })); } return pairs.length; }"""

def vals(page):
    return dict(page.evaluate(VALUES))

def sign(page, k, s='+'):
    page.locator(f'[data-altitude-cell="{k}"] [data-altitude-sign="{s}"]').first.click(); page.wait_for_timeout(200)

def state(page, k1, k2):
    v = vals(page)
    return {'box1': v.get(k1), 'box2': v.get(k2), 'record': page.evaluate(RECORD)}

def record_and_read(page, w1, w2):
    rec = page.evaluate(RECORD)
    if rec is None or rec['disabled']:
        return {'recordNotPressed': rec, 'firstRecorded': False, 'secondRecorded': False}
    before = len(page.evaluate(RECORDED))
    page.locator('[data-altitude-record]').first.click(); page.wait_for_timeout(500)
    recd = page.evaluate(RECORDED)
    new = recd[before:]
    return {'recordPressed': rec, 'newRecorded': [r['text'][:120] for r in new], 'firstRecorded': any(w1 in r['text'] for r in new), 'secondRecorded': any(w2 in r['text'] for r in new)}

def signs(page, arm, keys):
    for k in keys:
        try: sign(page, k)
        except Exception as e: arm[f'signError:{k}'] = str(e).splitlines()[0][:200]

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1689, 'height': 897})
    errs = []
    page.on('pageerror', lambda e: errs.append(f'pageerror: {str(e)[:300]}'))
    page.on('console', lambda m: errs.append(f'console.{m.type}: {m.text[:300]}') if m.type in ('error',) else None)
    out['pageErrors'] = errs
    try:
        page.goto(url); page.wait_for_timeout(3000)
        out['whereami'] = page.evaluate(D.WHEREAMI)
        D.click_canvas_center(page)
        D.tab(page, 'history')
        page.locator('[data-workspace-import-input]').first.set_input_files(fixture); page.wait_for_timeout(1500)
        out['status'] = page.evaluate("() => { const p = document.querySelector('[data-workspace-status]'); return p ? p.textContent.replace(/\\s+/g, ' ').trim() : null; }")
        out['select'] = [D.select_core(page), D.select_vertex_labelled(page, label)]
        D.pane(page, 'point'); page.wait_for_timeout(300)
        opens = page.locator('[data-altitude-open]')
        out['opens'] = [opens.nth(i).inner_text() for i in range(opens.count())]
        opens.first.click(); page.wait_for_timeout(900)
        box = page.evaluate(D.ALTITUDE_BOX) or {}
        out['batch'] = {'head': box.get('head'), 'batch': box.get('batch'), 'groups': box.get('groups'), 'cells': len(box.get('cells') or []), 'record': page.evaluate(RECORD)}
        cells = [c['key'] for c in (box.get('cells') or [])]
        if len(cells) < 8:
            raise RuntimeError(f'only {len(cells)} boxes in the batch — the four arms need eight')
        # ── ARM 1 — TYPED KEYS: box 1 typed and signed, box 2 typed and signed; then record ──
        arm = {}; out['typed'] = arm
        try:
            k1, k2 = cells[0], cells[1]; arm['keys'] = [k1, k2]
            page.locator(f'[data-altitude-word="{k1}"]').click(); page.keyboard.type('the need', delay=35); page.wait_for_timeout(250)
            arm['afterBox1'] = state(page, k1, k2)
            sign(page, k1); arm['afterSign1'] = state(page, k1, k2)
            page.locator(f'[data-altitude-word="{k2}"]').click(); page.keyboard.type('the enjoyment', delay=35); page.wait_for_timeout(250)
            arm['afterBox2'] = state(page, k1, k2)
            sign(page, k2); arm['afterSign2'] = state(page, k1, k2)
            arm['firstKept'] = arm['afterSign2']['box1'] == 'the need' and arm['afterSign2']['record']['count'] == '2'
            arm.update(record_and_read(page, 'the need', 'the enjoyment'))
        except Exception as e:
            arm['error'] = traceback.format_exc()[-600:]
        # ── ARM 2 — VL's way in ONE TICK: both values set (native setter) + input events in one script, then the signs; then record ──
        arm = {}; out['scriptOneTick'] = arm
        try:
            k3, k4 = cells[2], cells[3]; arm['keys'] = [k3, k4]
            page.evaluate(SET_NATIVE, [[[k3, 'the need'], [k4, 'the enjoyment']]]); page.wait_for_timeout(400)
            arm['afterBoth'] = state(page, k3, k4)
            signs(page, arm, (k3, k4))
            arm['afterSigns'] = state(page, k3, k4)
            arm['firstKept'] = arm['afterSigns']['box1'] == 'the need' and arm['afterSigns']['record']['count'] == '2'
            arm.update(record_and_read(page, 'the need', 'the enjoyment'))
        except Exception as e:
            arm['error'] = traceback.format_exc()[-600:]
        # ── ARM 3 — VL's way, ONE BOX PER TICK (a wait between the two scripts) ──
        arm = {}; out['scriptTwoTicks'] = arm
        try:
            k5, k6 = cells[4], cells[5]; arm['keys'] = [k5, k6]
            page.evaluate(SET_NATIVE, [[[k5, 'the need']]]); page.wait_for_timeout(300)
            page.evaluate(SET_NATIVE, [[[k6, 'the enjoyment']]]); page.wait_for_timeout(400)
            arm['afterBoth'] = state(page, k5, k6)
            signs(page, arm, (k5, k6))
            arm['afterSigns'] = state(page, k5, k6)
            arm['firstKept'] = arm['afterSigns']['box1'] == 'the need' and arm['afterSigns']['record']['count'] == '2'
            arm.update(record_and_read(page, 'the need', 'the enjoyment'))
        except Exception as e:
            arm['error'] = traceback.format_exc()[-600:]
        # ── ARM 4 — the value set PLAINLY (i.value = w) + an input event, one tick for both ──
        arm = {}; out['scriptPlainValue'] = arm
        try:
            k7, k8 = cells[6], cells[7]; arm['keys'] = [k7, k8]
            page.evaluate(SET_PLAIN, [[[k7, 'the need'], [k8, 'the enjoyment']]]); page.wait_for_timeout(400)
            arm['afterBoth'] = state(page, k7, k8)
            signs(page, arm, (k7, k8))
            arm['afterSigns'] = state(page, k7, k8)
            arm['firstKept'] = arm['afterSigns']['box1'] == 'the need' and arm['afterSigns']['record']['count'] == '2'
            arm.update(record_and_read(page, 'the need', 'the enjoyment'))
        except Exception as e:
            arm['error'] = traceback.format_exc()[-600:]
        out['recordedAtEnd'] = [r['text'][:120] for r in page.evaluate(RECORDED)]
        page.screenshot(path=os.path.join(REPO, 'scripts/app-leg/_frames/probe-vl-38-end.png'))
    except Exception:
        out['error'] = traceback.format_exc()[-1200:]
    finally:
        browser.close()
print(json.dumps(out, ensure_ascii=False, indent=1))
