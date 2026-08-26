#!/usr/bin/env python3
# THE D8 SHELF-ROUTE DRIVER (engineer 1629 ★★) — the person's own route,
# driven on the RUNNING app: thicken (the real chip on two placed forms) →
# the band parcel rides the shelf → dragged onto paper → POINTED AT → EXIT B
# → the caption reads `cone edges (measured)` — THE POSITIVE FACT (the
# acceptance fence: "no room reads UNRESOLVED" is D9's shadow, not this).
# Plus: (a) EXIT A measured too · (b) NO room exists at thicken · (c) the
# D10 panel measurements at 3 / 7 / synthetic-25 rows (never eyeballed).
import argparse
import json

from playwright.sync_api import sync_playwright

RESULTS = {}


# B-111 §2: captures land in the IGNORED _frames/ sibling — a witness may
# never write into the tracked tree (see deficit_app_driver._frame_path).
def _frame_path(name: str) -> str:
    import pathlib
    frames = pathlib.Path(__file__).parent / "_frames"
    frames.mkdir(exist_ok=True)
    return str(frames / name)

def record(name, ok, detail=""):
    RESULTS[name] = {"ok": bool(ok), "detail": str(detail)[:300]}


def paper_point(page, box, fx, fy):
    # a point where the CANVAS is the top element (a real paper gesture)
    for dfy in (0.0, 0.06, -0.06, 0.12, -0.12):
        for dfx in (0.0, 0.04, -0.04, 0.08, -0.08):
            x = box["x"] + box["width"] * (fx + dfx)
            y = box["y"] + box["height"] * (fy + dfy)
            tag = page.evaluate(
                "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                [x, y],
            )
            if tag == "CANVAS":
                return {"x": x, "y": y}
    return None


def load_files(page, files):
    page.set_input_files('input[type="file"]', files)
    page.wait_for_timeout(800)


def place_parcel(page, has_text, fx, fy):
    # the committed drop gesture (deficit_app_driver verbatim): a REAL
    # DataTransfer; the drop AUTO-SELECTS the placed form (the view's contract)
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    pool = page.locator('div[draggable="true"]')
    item = pool.filter(has_text=has_text) if has_text else pool
    if item.count() == 0:
        return None
    pt = paper_point(page, box, fx, fy)
    if pt is None:
        return None
    data_transfer = page.evaluate_handle("() => new DataTransfer()")
    item.first.dispatch_event("dragstart", {"dataTransfer": data_transfer})
    canvas.dispatch_event(
        "drop",
        {"clientX": pt["x"], "clientY": pt["y"], "bubbles": True, "dataTransfer": data_transfer},
    )
    page.wait_for_timeout(700)
    return pt


def canvas_click(page, pt, shift=False):
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    pos = {"x": pt["x"] - box["x"], "y": pt["y"] - box["y"]}
    canvas.click(position=pos, modifiers=(["Shift"] if shift else []))
    page.wait_for_timeout(500)


def screen_point_of_nearest_body(page, client_pt, max_px=220):
    # aim through the committed test seams (__manuscriptScene/__manuscriptCamera,
    # the app-path leg's own handles): project every mesh's bounding-sphere
    # center to the screen and take the one nearest the drop point — the drop
    # anchors the form's HOME, but the drawn body's center is what a person
    # actually clicks (a blind click at the home missed and, per the
    # committed onPointerMissed, DESELECTED — the arm killer).
    hit = page.evaluate(
        """([cx, cy, maxPx]) => {
      const scene = window.__manuscriptScene, camera = window.__manuscriptCamera;
      if (!scene || !camera) return null;
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const cands = [];
      scene.traverse((o) => {
        if (!o.isMesh || !o.geometry) return;
        if (o.geometry.computeBoundingSphere) o.geometry.computeBoundingSphere();
        const bs = o.geometry.boundingSphere;
        if (!bs) return;
        const c = bs.center.clone();
        o.localToWorld(c);
        const p = c.project(camera);
        if (p.z > 1) return;
        const sx = rect.left + ((p.x + 1) / 2) * rect.width;
        const sy = rect.top + ((1 - (p.y + 1) / 2)) * rect.height;
        cands.push({ sx, sy, d: Math.hypot(sx - cx, sy - cy) });
      });
      cands.sort((a, b) => a.d - b.d);
      const best = cands[0] ?? null;
      return best && best.d <= maxPx ? best : null;
    }""",
        [client_pt["x"], client_pt["y"], max_px],
    )
    return hit


def press(page, locator):
    # every chrome button listens on MOUSEDOWN (the dock/panel idiom, with
    # stopPropagation) — dispatch that exact event (the committed driver's
    # own pattern for drops). Hit-testing is bypassed on purpose: the
    # auto-selected form's floating card can tent over a chip at this
    # viewport; whether that occlusion is acceptable is the designer's plate
    # (the D10 measurements below judge the PANEL's own geometry).
    if locator.count() == 0:
        return False
    locator.first.dispatch_event("mousedown", {"bubbles": True})
    page.wait_for_timeout(450)
    return True


def open_aperture(page):
    chip = page.locator('button:has-text("aperture — build a 3-manifold")')
    if not press(page, chip):
        return False
    return page.locator("[data-aperture-panel]").count() > 0


def measure_panel(page, key, expect_rows):
    # D10 — MEASUREMENT, never eyeball: the panel's box vs the sources
    # shelf's top; the exits inside the viewport; the more-indicator honest
    # both ways (present IFF the rows region actually overflows).
    panel = page.locator("[data-aperture-panel]")
    if panel.count() == 0:
        record(f"d10.{key}.panel", False, "no [data-aperture-panel] in the DOM")
        return
    pb = panel.bounding_box()
    n_selects = page.locator("[data-aperture-rows] select").count()
    rows_n = n_selects // 3  # face A + face B + map per row
    record(f"d10.{key}.rows", rows_n == expect_rows, f"{rows_n} rows rendered (expected {expect_rows})")
    vh = page.viewport_size["height"]
    panel_bottom = pb["y"] + pb["height"]
    shelf_title = page.get_by_text("sources — loaded universes")
    if shelf_title.count() > 0:
        sb = shelf_title.bounding_box()
        shelf_top = sb["y"] - 10  # the title sits 9px padding + 1px border inside the shelf
        record(
            f"d10.{key}.noOverlap",
            panel_bottom <= shelf_top + 0.5,
            f"panel bottom {panel_bottom:.1f} vs shelf top {shelf_top:.1f} (viewport h {vh})",
        )
    else:
        # nothing loaded yet — the obstacle is absent; record the measured box
        record(f"d10.{key}.noOverlap", True, f"no shelf on screen; panel bottom {panel_bottom:.1f} (viewport h {vh})")
    leave = page.locator("[data-aperture-leave-bounded]")
    lb = leave.bounding_box() if leave.count() > 0 else None
    record(
        f"d10.{key}.exitsReachable",
        lb is not None and lb["y"] >= 0 and (lb["y"] + lb["height"]) <= vh,
        "no leave-bounded button" if lb is None else f"leave-bounded y {lb['y']:.1f}..{lb['y'] + lb['height']:.1f} within 0..{vh}",
    )
    more = page.locator("[data-aperture-more]").count()
    overflow = page.evaluate(
        "() => { const el = document.querySelector('[data-aperture-rows]'); return el ? el.scrollHeight > el.clientHeight + 1 : null; }"
    )
    record(
        f"d10.{key}.moreIndicator",
        (more > 0) == bool(overflow),
        f"indicator x{more} · rows region overflows: {overflow}",
    )


def exit_a_pick(page, max_tries=40):
    # find a pair offering a PRESERVING map: the row's own menu decides
    sels = page.locator("[data-aperture-rows] select")
    if sels.count() < 3:
        return False
    a_sel, b_sel, m_sel = sels.nth(0), sels.nth(1), sels.nth(2)
    a_vals = [v for v in a_sel.locator("option").evaluate_all("els => els.map((e) => e.value)") if v]
    tried = 0
    for va in a_vals:
        for vb in a_vals:
            if vb == va:
                continue
            tried += 1
            if tried > max_tries:
                return False
            try:
                a_sel.select_option(va)
                b_sel.select_option(vb)
            except Exception:
                continue
            page.wait_for_timeout(350)
            opts = m_sel.locator("option").evaluate_all(
                "els => els.map((e) => ({ v: e.value, t: e.textContent ?? '' }))"
            )
            pres = [o for o in opts if o["v"] and "preserving" in o["t"]]
            if pres:
                m_sel.select_option(pres[0]["v"])
                page.wait_for_timeout(300)
                return True
    return False


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--cube", required=True)
    ap.add_argument("--fanlift", required=True)
    ap.add_argument("--segment", required=True)
    args = ap.parse_args()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        console_errors = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.goto(args.url)
        page.wait_for_timeout(2600)

        # ---- PHASE 1 · the cube — the 3-row degenerate case, measured ------
        load_files(page, [args.cube])
        pt_cube = place_parcel(page, None, 0.74, 0.36)
        record("cube.place", pt_cube is not None, "the cube parcel placed through the person's file door + drag")
        record("cube.door", open_aperture(page), "the door opens on the pointed-at cube")
        measure_panel(page, "rows3", 3)
        press(page, page.locator('button:has-text("close the aperture gate")'))

        # ---- PHASE 2 · the band, born in-app, through the shelf ------------
        # placement ORDER is the drive's own contract: the LIFT first, the
        # SEGMENT last — the last drop AUTO-SELECTS (the view's contract), so
        # the segment is selected and ONE SHIFT-click on the big fan mesh
        # arms the combine pair (the thin segment line is never a click
        # target; the fan's 5-triangle footprint is)
        load_files(page, [args.fanlift])  # loaded ALONE — the pool's only parcel, no title guessing
        pt_lift = place_parcel(page, None, 0.44, 0.30)
        record("fan.liftPlace", pt_lift is not None, "the terrain-fan open-lift parcel placed")
        load_files(page, [args.segment])
        pt_seg = place_parcel(page, None, 0.30, 0.62)
        record("fan.segmentPlace", pt_seg is not None, "the segment (edge-lift) parcel placed LAST (auto-selected)")
        if pt_lift is None or pt_seg is None:
            print(json.dumps({"results": RESULTS}))
            browser.close()
            return
        chip = page.locator('button[title="thicken"]')  # the dock chip (mousedown, R4(e))
        record("fan.thickenChip", chip.count() > 0, "the dock thicken chip is present")
        band_btn = page.locator('button:has-text("thicken — the band")')
        # ONE shift-click on the fan's PROJECTED body (the segment stays
        # auto-selected from its own drop; a miss would deselect it — so the
        # click is aimed, not guessed)
        target = screen_point_of_nearest_body(page, pt_lift)
        record(
            "fan.liftMesh",
            target is not None,
            "no mesh within 220px of the lift's drop point"
            if target is None
            else f"the fan body projects at ({target['sx']:.0f},{target['sy']:.0f}), {target['d']:.0f}px from the drop anchor",
        )
        armed = False
        if target is not None:
            canvas_click(page, {"x": target["sx"], "y": target["sy"]}, shift=True)
            press(page, chip)
            armed = band_btn.count() > 0
        panel_txt = page.evaluate(
            "() => { const d = [...document.querySelectorAll('div')].find((el) => el.textContent.includes('thicken — form × segment') && el.textContent.length < 700); return d ? d.innerText.replace(/\\s+/g, ' ').slice(0, 220) : null; }"
        )
        record("fan.thickenPanel", panel_txt is not None, f"panel: {panel_txt}")
        if not armed:
            page.screenshot(path=_frame_path("d8_debug_arm.png"))
        pre_rooms = page.get_by_text("built 3-manifold").count()
        shelf_before = page.locator('div[draggable="true"]').count()
        record("fan.thickenRun", armed, "the thicken action is offered on the armed pair")
        if armed:
            press(page, band_btn)
            page.wait_for_timeout(900)
        # (b) ⛔ NO ROOM AT THICKEN — the Sovereign's bar
        post_rooms = page.get_by_text("built 3-manifold").count()
        record("d9.noRoomAtThicken", post_rooms == pre_rooms, f"'built 3-manifold' texts {pre_rooms} → {post_rooms} across the thicken")
        record(
            "d9.doorNotice",
            page.get_by_text("rides the shelf — point at it").count() > 0,
            "the door-open notice (flagged copy) is spoken instead of a room",
        )
        shelf_after = page.locator('div[draggable="true"]').count()
        record("d9.bandParcel", shelf_after == shelf_before + 1, f"shelf draggables {shelf_before} → {shelf_after} (the band arrived)")

        # the person places the band and POINTS AT it (the drop auto-selects)
        pt_band = place_parcel(page, None, 0.62, 0.62)
        record("d8.bandPlace", pt_band is not None, "the band parcel placed on paper")
        record("d8.door", open_aperture(page), "the door opens on the pointed-at band")
        measure_panel(page, "rows7", 7)

        # ---- EXIT B — the acceptance: the room reads MEASURED --------------
        # two surfaces, both the app's own: (1) the gate's resolved FACT via
        # the dev aperture seam (`metricSource === 'measured'` — the
        # `(measured)` word itself rides the explore window's CANVAS caption,
        # out of DOM reach); (2) the plate caption's VALUE — the sealed
        # 1 × 300° (the k×90° heuristic would print 450°; unresolved prints
        # no number at all).
        leave = page.locator("[data-aperture-leave-bounded]")
        if press(page, leave):
            page.wait_for_timeout(900)
        seam1 = page.evaluate("() => (window.__manuscriptApertures ?? {})['built-1'] ?? null")
        plate_300 = page.get_by_text("1 × 300°").count()
        heur_450 = page.get_by_text("450°").count()
        record(
            "d8.exitB.measured",
            seam1 is not None and seam1.get("metricSource") == "measured" and plate_300 >= 1 and heur_450 == 0,
            f"seam built-1: {json.dumps(seam1)} · plate '1 × 300°' x{plate_300} · heuristic '450°' x{heur_450} · room title present: {page.get_by_text('built 3-manifold 1').count() > 0}",
        )
        record(
            "d8.info.unresolved",
            True,
            f"(info, NOT the acceptance) 'sealed metric UNRESOLVED' texts on screen: {page.get_by_text('sealed metric UNRESOLVED').count()}",
        )

        # ---- EXIT A — clause (a): the glued room reads MEASURED too --------
        picked = exit_a_pick(page)
        record("d8.exitA.pair", picked, "a boundary pair with a PRESERVING map found via the row's own menu")
        if picked:
            glue = page.locator('button:has-text("glue — the S² gate judges")')
            record("d8.exitA.glueOffered", glue.count() > 0, "the glue exit is offered on the completed pair")
            if press(page, glue):
                page.wait_for_timeout(900)
        seam2 = page.evaluate("() => (window.__manuscriptApertures ?? {})['built-2'] ?? null")
        record(
            "d8.exitA.measured",
            picked and seam2 is not None and seam2.get("metricSource") == "measured",
            f"seam built-2: {json.dumps(seam2)} · room 2 title present: {page.get_by_text('built 3-manifold 2').count() > 0}",
        )
        record("hygiene.console", len(console_errors) == 0, "; ".join(console_errors[:3]))

        # ---- PHASE 3 · the synthetic larger row count (?d10rows=25) --------
        page2 = browser.new_page(viewport={"width": 1280, "height": 900})
        page2.goto(args.url + "&d10rows=25")
        page2.wait_for_timeout(2600)
        load_files(page2, [args.cube])
        pt2 = place_parcel(page2, None, 0.74, 0.36)
        record("synthetic.place", pt2 is not None, "the cube placed on the seamed page")
        record("synthetic.door", open_aperture(page2), "the door opens (seam pads the ROWS, not the menu)")
        measure_panel(page2, "rows25", 25)

        print(json.dumps({"results": RESULTS}))
        browser.close()


if __name__ == "__main__":
    main()
