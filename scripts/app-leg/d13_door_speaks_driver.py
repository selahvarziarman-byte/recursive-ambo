#!/usr/bin/env python3
# THE D13 DRIVER — the person's own crash gestures on the RUNNING app:
#   1. the MIXED PICK (a 3-corner face with a 4-corner face) — the refusal
#      speaks BY NAME and the app stays alive (the old tree black-screened);
#   2. the planted PANEL throw (?d13throw=panel) — the TIGHT boundary speaks
#      and the page STANDS;
#   3. the planted PAGE throw (?d13throw=page) — the LAST-RESORT boundary
#      speaks instead of a blank void, honest about the page state's cost.
import argparse
import json

from playwright.sync_api import sync_playwright

RESULTS = {}


def record(name, ok, detail=""):
    RESULTS[name] = {"ok": bool(ok), "detail": str(detail)[:300]}


def paper_point(page, box, fx, fy):
    for dfy in (0.0, 0.06, -0.06, 0.12):
        for dfx in (0.0, 0.04, -0.04, 0.08):
            x = box["x"] + box["width"] * (fx + dfx)
            y = box["y"] + box["height"] * (fy + dfy)
            tag = page.evaluate(
                "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                [x, y],
            )
            if tag == "CANVAS":
                return {"x": x, "y": y}
    return None


def press(page, locator):
    if locator.count() == 0:
        return False
    locator.first.dispatch_event("mousedown", {"bubbles": True})
    page.wait_for_timeout(450)
    return True


def open_aperture(page):
    return press(page, page.locator('button:has-text("aperture — build a 3-manifold")'))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--band", required=True)
    args = ap.parse_args()
    with sync_playwright() as p:
        browser = p.chromium.launch()

        # ---- 1 · the MIXED PICK: refusal by name, app alive ----------------
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.goto(args.url)
        page.wait_for_timeout(2500)
        # I-1 clause 2(a): the universe door is the only MULTIPLE file input —
        # the page door landed first in the DOM and the bare selector fed it.
        page.locator('input[type="file"][multiple]').set_input_files([args.band])
        page.wait_for_timeout(800)
        canvas = page.locator("canvas").first
        box = canvas.bounding_box()
        pt = paper_point(page, box, 0.6, 0.45)
        placed = False
        if pt is not None:
            data_transfer = page.evaluate_handle("() => new DataTransfer()")
            page.locator('div[draggable="true"]').first.dispatch_event("dragstart", {"dataTransfer": data_transfer})
            canvas.dispatch_event(
                "drop", {"clientX": pt["x"], "clientY": pt["y"], "bubbles": True, "dataTransfer": data_transfer}
            )
            page.wait_for_timeout(700)
            placed = True
        record("mix.place", placed, "the band parcel placed (drop auto-points)")
        open_aperture(page)
        sels = page.locator("[data-aperture-rows] select")
        # pick a 3-corner option in face A and a 4-corner option in face B —
        # by the menu's own person-facing labels
        a_sel, b_sel = sels.nth(0), sels.nth(1)
        picked = False
        try:
            a_opts = a_sel.locator("option").evaluate_all("els => els.map((e) => ({ v: e.value, t: e.textContent ?? '' }))")
            b_opts = b_sel.locator("option").evaluate_all("els => els.map((e) => ({ v: e.value, t: e.textContent ?? '' }))")
            a3 = next((o for o in a_opts if o["v"] and "3 corners" in o["t"]), None)
            b4 = next((o for o in b_opts if o["v"] and "4 corners" in o["t"]), None)
            if a3 and b4:
                a_sel.select_option(a3["v"])
                b_sel.select_option(b4["v"])
                page.wait_for_timeout(600)
                picked = True
        except Exception as e:  # noqa: BLE001 — the drive must report, not die
            record("mix.refusal", False, f"pick failed: {e}")
        if picked:
            refusal = page.get_by_text("a face meets only a face with the same corners").count()
            record("mix.refusal", refusal > 0, f"the ratified sentence on screen x{refusal}")
        panel_alive = page.locator("[data-aperture-panel]").count() > 0
        canvas_alive = page.locator("canvas").count() > 0
        body_len = page.evaluate("() => document.body.innerText.length")
        record(
            "mix.alive",
            picked and panel_alive and canvas_alive and body_len > 200,
            f"panel {panel_alive} · canvas {canvas_alive} · body text {body_len} chars (the old tree: a black void)",
        )
        uncaught = [e for e in errors if "planted" not in e]
        record("mix.console", len(uncaught) == 0, "; ".join(uncaught[:2]))
        page.close()

        # ---- 2 · the planted PANEL throw: tight catch, page stands ---------
        page2 = browser.new_page(viewport={"width": 1280, "height": 900})
        page2.goto(args.url + "&d13throw=panel")
        page2.wait_for_timeout(2500)
        open_aperture(page2)
        page2.wait_for_timeout(600)
        sentence2 = page2.get_by_text("this could not be drawn, and the page has stopped rather than go blank").count()
        scope2 = page2.get_by_text("the aperture panel (tight").count()
        record("tight.speaks", sentence2 > 0 and scope2 > 0, f"sentence x{sentence2} · tight scope x{scope2}")
        canvas2 = page2.locator("canvas").count() > 0
        dock2 = page2.locator('button[title="thicken"]').count() > 0
        record("tight.pageStands", canvas2 and dock2, f"canvas {canvas2} · dock chip {dock2} — the page's work survives")
        page2.close()

        # ---- 3 · the planted PAGE throw: last resort speaks, honestly ------
        page3 = browser.new_page(viewport={"width": 1280, "height": 900})
        page3.goto(args.url + "&d13throw=page")
        page3.wait_for_timeout(2500)
        sentence3 = page3.get_by_text("this could not be drawn, and the page has stopped rather than go blank").count()
        record("last.speaks", sentence3 > 0, f"sentence x{sentence3} (the old tree: a blank void)")
        honest3 = page3.get_by_text("the manuscript page (last resort").count()
        record("last.honest", honest3 > 0, f"the last-resort scope (state's cost admitted) x{honest3}")
        page3.close()

        print(json.dumps({"results": RESULTS}))
        browser.close()


if __name__ == "__main__":
    main()
