#!/usr/bin/env python3
# THE APP-PATH WITNESS LEG — the Playwright driver half (SEAL_APP_PATH_WITNESS_LEG).
# Drives the person's own gestures on the RUNNING committed dev app and emits a
# JSON verdict on its LAST stdout line; the .cjs orchestrator judges the sealed
# clauses. PRESENCE + sealed TEXT only — never look (no screenshots-as-
# assertions, no pixel thresholds; the designer stays the eye).
#
# The dev tuning panel (Leva) is CSS-hidden for the session only — it floats
# over the fold panel's corner and intercepts pointer events; its knobs still
# mount with their committed defaults (chrome hidden, app logic untouched).

import argparse
import json
import sys

from playwright.sync_api import sync_playwright

results = {}
console_errors = []


def record(name, ok, detail=""):
    results[name] = {"ok": bool(ok), "detail": str(detail)[:300]}


def scene_presence(page):
    # PRESENCE — traverse the real scene graph via the dev test-seam handle:
    # `faithful-body` groups and the `deficit-register` groups UNDER them
    # (the layer's group exists only when real marks ride)
    return page.evaluate(
        """() => {
      const scene = window.__manuscriptScene;
      if (!scene) return { hooked: false, faithful: 0, deficitUnderFaithful: 0, markChildren: 0 };
      let faithful = 0, deficitUnderFaithful = 0, markChildren = 0;
      scene.traverse((o) => {
        if (o.name === 'faithful-body') {
          faithful += 1;
          o.traverse((c) => {
            if (c.name === 'deficit-register') {
              deficitUnderFaithful += 1;
              markChildren += c.children.length;
            }
          });
        }
      });
      return { hooked: true, faithful, deficitUnderFaithful, markChildren };
    }"""
    )


def find_fold_chip(page):
    # the dock chips are glyph-only 46x46 buttons; hover until the tooltip
    # reads exactly 'fold' (the committed hover label)
    for b in page.locator("button").all():
        try:
            box = b.bounding_box()
            if not box or abs(box["width"] - 46) > 3 or abs(box["height"] - 46) > 3:
                continue
            b.hover()
            page.wait_for_timeout(140)
            tip = page.locator('div:text-is("fold")')
            if tip.count() > 0 and tip.first.is_visible():
                return b
        except Exception:
            continue
    return None


def find_paper_point(page, box, side):
    # the chrome floats over the canvas (dock · shelf · marginalia · panels);
    # DISCOVER a point where the CANVAS is the top element (a real paper
    # click), scanning the preferred side between the band rows
    xs = [0.12, 0.2, 0.3, 0.42] if side == "left" else [0.88, 0.8, 0.7, 0.58]
    ys = [0.62, 0.68, 0.56, 0.74, 0.5, 0.44, 0.8, 0.36]
    for fy in ys:
        for fx in xs:
            x = box["x"] + box["width"] * fx
            y = box["y"] + box["height"] * fy
            tag = page.evaluate(
                "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                [x, y],
            )
            if tag == "CANVAS":
                return {"x": box["width"] * fx, "y": box["height"] * fy}
    return None


def drive_fold(page, key, invoke_label, side, cone_text, rim_text, min_presence):
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    pos = find_paper_point(page, box, side)
    record(f"{key}.paperPoint", pos is not None, f"an uncovered paper point on the {side}")
    if pos is None:
        return

    # 1. right-click EMPTY paper -> the invoke palette
    canvas.click(button="right", position=pos)
    page.wait_for_timeout(300)
    palette = page.locator("text=invoke — real material")
    record(f"{key}.palette", palette.count() > 0, "right-click on paper opens the invoke palette")
    # 2. invoke the primitive (handleInvoke stamps + AUTO-SELECTS)
    page.locator(f'text="{invoke_label}"').first.click()
    page.wait_for_timeout(500)
    # 3. the dock fold chip (enabled — the invoked 1-face form is selected)
    chip = find_fold_chip(page)
    record(f"{key}.chip", chip is not None, "the fold chip discovered by its hover label")
    if chip is None:
        return
    chip.click()
    page.wait_for_timeout(300)
    record(f"{key}.panel", page.locator("text=write the rim").count() > 0, "the fold panel opens")
    # 4. tap e0 then e1 -> ONE pair, default mode PRESERVING (the committed reducer)
    page.locator('button:has-text("e0")').first.click()
    page.wait_for_timeout(150)
    page.locator('button:has-text("e1")').first.click()
    page.wait_for_timeout(300)
    commit = page.locator('button:has-text("commit the fold")').first
    record(f"{key}.commitEnabled", commit.is_enabled(), "the committed preview accepts the word")
    # 5. commit -> the fold-born faithful form is AUTO-SELECTED; its card rises
    commit.click()
    page.wait_for_timeout(900)
    # 6. THE SEALED TEXT — off the LIVE card the person reads (drei Html DOM)
    record(f"{key}.cardCone", page.get_by_text(cone_text, exact=True).count() > 0, cone_text)
    record(f"{key}.cardRim", page.get_by_text(rim_text, exact=True).count() > 0, rim_text)
    # 7. THE PRESENCE — the scene graph holds the deficit register under the
    #    faithful frame, with real mark children
    p = scene_presence(page)
    record(
        f"{key}.presence",
        p["hooked"] and p["deficitUnderFaithful"] >= min_presence and p["markChildren"] > 0,
        json.dumps(p),
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    args = parser.parse_args()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1600, "height": 900})
        page.on(
            "console",
            lambda m: console_errors.append(m.text)
            if m.type == "error" and "favicon" not in m.text
            else None,
        )
        page.on("pageerror", lambda e: console_errors.append(str(e)))

        page.goto(args.url)
        page.wait_for_load_state("networkidle")
        # the dev view mounts lazily; wait for the canvas + the scene handle
        page.wait_for_selector("canvas", timeout=30000)
        page.wait_for_function("() => Boolean(window.__manuscriptScene)", timeout=30000)
        page.wait_for_timeout(800)
        # hide the floating dev tuning panel (pointer interception only)
        page.add_style_tag(content="#leva__root, [id^='leva'] { display: none !important; }")
        record("boot", True, "app up, scene handle hooked")

        # E1/E2 the triangle specimen (left paper), then the square (right
        # paper); after the square TWO faithful fans exist. A step exception
        # records RED — the leg always emits its verdict, never a bare trace.
        try:
            drive_fold(page, "triangle", "Triangle", "left", "cone point · deficit 300°", "rim turn · 60°", 1)
        except Exception as error:  # noqa: BLE001
            record("triangle.drive", False, repr(error))
        try:
            drive_fold(page, "square", "Square", "right", "cone point · deficit 270°", "rim turn · 90°", 2)
        except Exception as error:  # noqa: BLE001
            record("square.drive", False, repr(error))

        record("console", len(console_errors) == 0, "; ".join(console_errors[:4]))
        browser.close()

    print(json.dumps({"results": results, "consoleErrors": console_errors}))
    sys.exit(0 if all(r["ok"] for r in results.values()) else 1)


main()
