# PROBE — NOT A WITNESS (not in the sweep, not in the drive family): run by hand against a served build, `python probe-vl-41-the-way-recorded.py http://localhost:<port>/`. The record of the
# measurement of 2026-10-19 for Virgin Land's finding 41 (the mothership's 14:54); its output rode the coder's report of that day.
# VL 41 — MEASURE FIRST (the mothership's 14:54): is the chosen way of a named relation RECORDED — what the fifth field holds, whether choosing the other sentence
# changes it, and whether a re-import shows each relation reading the way it was chosen. On Virgin Land's own 14:46 export (Livelihood, 8 named relations, all "2").
import json, sys, traceback, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
REPO = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import concept_layer_eye_driver as D
from playwright.sync_api import sync_playwright

url = sys.argv[1]
S = os.path.join(REPO, 'scripts/app-leg/_frames/') + os.sep  # the export the page writes and the frame land in the ignored frames dir
fixture = os.path.join(REPO, 'scripts/fixtures/altitude/virgin-land_2026-10-19_1446_Production-Consumption_Livelihood-named_8-relations-named.workspace.json')
out = {'url': url}
ROWS = "() => [...document.querySelectorAll('[data-midpoint-child-row]')].map((r) => r.getAttribute('data-midpoint-child-row'))"
RELS = """() => [...document.querySelectorAll('[data-child-relation-reads]')].map((e) => { const card = e.closest('[data-child-loop]') || e.parentElement; const nm = card ? card.querySelector('[data-child-relation-name]') : null; const btns = [...e.querySelectorAll('[data-child-relation-from]')]; return { name: nm ? nm.getAttribute('data-child-relation-name') : null, reads: e.getAttribute('data-child-relation-reads'), text: e.textContent.replace(/\\s+/g, ' ').trim(), buttons: btns.map((b) => [b.getAttribute('data-child-relation-from'), b.textContent.trim(), /decoration-2/.test(b.className)]) }; })"""

def rows_of_file(p):
    d = json.load(open(p, encoding='utf-8'))
    return d.get('relationNames')

def status(page):
    return page.evaluate("() => { const p = document.querySelector('[data-workspace-status]'); return p ? p.textContent.replace(/\\s+/g, ' ').trim() : null; }")

def import_file(page, p):
    D.tab(page, 'history')
    page.locator('[data-workspace-import-input]').first.set_input_files(p); page.wait_for_timeout(1500)
    st = status(page)
    sel = [D.select_core(page), D.select_vertex_labelled(page, 'Livelihood')]
    page.wait_for_timeout(600)
    page.locator('[data-midpoint-tab="point"]').first.click(); page.wait_for_timeout(600)
    return {'status': st, 'select': sel}

def sweep_relations(page):
    """every child row opened in turn; the named relations' lines collected (name, the side read from, the chosen button)"""
    found = {}
    rows = page.evaluate(ROWS)
    pages = {}
    for r in rows:
        try:
            page.locator(f'[data-midpoint-child-row="{r}"] text').first.click(); page.wait_for_timeout(350)
        except Exception as e:
            found.setdefault('_errors', []).append(f'{r}: {str(e).splitlines()[0][:120]}'); continue
        # the card pages a role's loops one at a time (`previous · next · k of N`): every page read
        n = 0
        while True:
            n += 1
            for rel in page.evaluate(RELS):
                if rel['name']:
                    found[f"{rel['name']} @ {r} :: {' · '.join(b[0] for b in rel['buttons'])}"] = rel  # one name may stand for several loops on one row: keyed by the two roles too
            nx = page.locator('[data-child-loops-next]').first
            if n > 40 or not nx.count() or nx.is_disabled():
                break
            nx.click(); page.wait_for_timeout(250)
        pages[r] = n
    return {'rows': len(rows), 'pages': pages, 'relations': found}

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 1689, 'height': 897}, accept_downloads=True)
    errs = []
    page.on('pageerror', lambda e: errs.append(f'pageerror: {str(e)[:300]}'))
    out['pageErrors'] = errs
    try:
        page.goto(url); page.wait_for_timeout(3000)
        out['whereami'] = page.evaluate(D.WHEREAMI)
        D.click_canvas_center(page)
        out['fileRows'] = rows_of_file(fixture)
        out['import1'] = import_file(page, fixture)
        sw1 = sweep_relations(page)
        out['afterImport'] = sw1
        # the measure's first clause: press the OTHER sentence on one named relation; the attribute and the export's fifth field
        target = next((k for k, v in sw1['relations'].items() if v['reads'] not in (None, 'none') and len(v['buttons']) == 2), None)
        out['target'] = target
        if target:
            name, rest = target.split(' @ ', 1); row = rest.split(' :: ')[0]; roles = rest.split(' :: ')[1]
            page.locator(f'[data-midpoint-child-row="{row}"] text').first.click(); page.wait_for_timeout(350)
            before = None
            for _ in range(40):  # the page of this row that shows the target loop
                before = next((x for x in page.evaluate(RELS) if x['name'] == name and ' · '.join(b[0] for b in x['buttons']) == roles), None)
                nx = page.locator('[data-child-loops-next]').first
                if before or not nx.count() or nx.is_disabled():
                    break
                nx.click(); page.wait_for_timeout(250)
            other = next((b for b in (before or {}).get('buttons', []) if not b[2]), None)
            out['before'] = before
            if other:
                page.locator(f'[data-child-relation-from="{other[0]}"]').first.click(); page.wait_for_timeout(400)
                after = next((x for x in page.evaluate(RELS) if x['name'] == name), None)
                out['afterOtherSentence'] = after
                out['refusal'] = page.evaluate("() => { const e = document.querySelector('[data-child-relation-refusal]'); return e ? e.textContent.trim() : null; }")
                # export: the download captured, its rows read
                D.tab(page, 'history')
                with page.expect_download() as dl:
                    page.locator('[data-workspace-export]').first.click()
                exp = S + 'probe-41-export.workspace.json'
                dl.value.save_as(exp); page.wait_for_timeout(300)
                rows2 = rows_of_file(exp)
                out['exportRows'] = rows2
                mine = [r for r in rows2 if r[3] == name]
                out['exportedRowForTarget'] = mine
                # the measure's second clause: re-import the export; every relation reads as it was chosen
                out['import2'] = import_file(page, exp)
                sw2 = sweep_relations(page)
                out['afterReimport'] = sw2
                b1 = {k: v['reads'] for k, v in sw1['relations'].items() if not k.startswith('_')}
                b2 = {k: v['reads'] for k, v in sw2['relations'].items() if not k.startswith('_')}
                out['readsBefore'] = b1; out['readsAfterReimport'] = b2
                changed_keys = [k for k in b1 if k.split(' @ ')[0] == name]
                out['keptAcrossReimport'] = all(b2.get(k) == (after['reads'] if k in changed_keys else b1[k]) for k in b1) and len(b2) == len(b1)
        page.screenshot(path=S + 'probe-41-end.png')
    except Exception:
        out['error'] = traceback.format_exc()[-1500:]
    finally:
        browser.close()
print(json.dumps(out, ensure_ascii=False, indent=1))
