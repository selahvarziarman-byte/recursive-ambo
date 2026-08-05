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
      if (!scene) return { hooked: false, faithful: 0, deficitUnderFaithful: 0, markChildren: 0, litMeshes: 0, hatchShaders: 0 };
      let faithful = 0, deficitUnderFaithful = 0, markChildren = 0, litMeshes = 0, hatchShaders = 0;
      scene.traverse((o) => {
        if (o.name === 'faithful-body') {
          faithful += 1;
          o.traverse((c) => {
            if (c.name === 'deficit-register') {
              deficitUnderFaithful += 1;
              markChildren += c.children.length;
            }
            // THE UNIFICATION (E6) — the crafted stack's live fingerprint,
            // measured on InkedForm's own bytes: the LIT body is the ONE
            // MeshStandardMaterial (prepass + hull are basic BY DESIGN) and
            // the key-light hatching is a ShaderMaterial. The old wash had
            // NEITHER (one unlit basic fill).
            if (c.isMesh && c.material && c.material.type === 'MeshStandardMaterial') litMeshes += 1;
            if (c.isMesh && c.material && c.material.type === 'ShaderMaterial') hatchShaders += 1;
          });
        }
      });
      return { hooked: true, faithful, deficitUnderFaithful, markChildren, litMeshes, hatchShaders };
    }"""
    )


def argument_card_checks(page):
    # THE ARGUMENT CARD (Phase 1) on the LIVE card of the selected fold-born:
    # the MAP spine + the demoted certificate receipt, plus the sign-hand
    # GLYPH COVERAGE probe — a sign that draws like the notdef box is a
    # BLANK CLAIM, not a degraded card.
    record(
        "card.mapSection",
        page.get_by_text("map — the spine", exact=True).count() > 0,
        "the MAP spine label on the live card",
    )
    # PHASE 2 — the reading's sections ride the live card too
    record(
        "card.incidence",
        page.get_by_text("incidence — carried", exact=True).count() > 0,
        "the incidence section on the live card",
    )
    record(
        "card.stance",
        page.get_by_text("stance — through the map", exact=True).count() > 0,
        "the stance section on the live card",
    )
    record(
        "card.verdict",
        page.get_by_text("verdict — consequence", exact=True).count() > 0,
        "the verdict section on the live card",
    )
    record("card.certificate", page.locator("text=certificate").count() > 0, "the demoted receipt present")
    # THE RIM-TURN SPLIT: the boundary local's truthful phrase on the live card
    record(
        "card.rimTurn",
        page.get_by_text("a rim turn", exact=False).count() > 0,
        "the rim-turn local phrase (never 'a cone' for the boundary)",
    )
    tofu = page.evaluate(
        """() => {
      const hand = '13px "DejaVu Sans", "Segoe UI Symbol", "Noto Sans Symbols 2", "Noto Sans Symbols", sans-serif';
      const draw = (ch) => {
        const c = document.createElement('canvas'); c.width = 30; c.height = 24;
        const g = c.getContext('2d'); g.font = hand; g.fillText(ch, 2, 18);
        return c.toDataURL();
      };
      const notdef = draw('\\u0378');
      return ['⟶', '←', '•', '⊕', '⊾', '⌐', '⇄', '○', 'Σδ', '⚠'].map((ch) => ({ ch, tofu: draw(ch) === notdef }));
    }"""
    )
    bad = [t["ch"] for t in tofu if t["tofu"]]
    record("card.glyphs", len(bad) == 0, f"tofu: {bad}" if bad else "every sign renders in the sign hand")


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


def drive_lift(page, lift_files):
    # THE LIFT (SEAL_THE_LIFT_IDENTITY_AND_GRAIN) on the RUNNING app: three
    # real lift parcels (two DIFFERENT edges + the coarse face; minted by the
    # orchestrator through the committed doors) enter through the person's own
    # file door, ALL place (the dedup admits both edges — the dead collision),
    # and the LIVE card reads the REAL identity + the honest grain mark.
    files = [f for f in lift_files.split(",") if f.strip()]
    page.set_input_files('input[type="file"]', files)
    page.wait_for_timeout(700)
    parcels = page.locator('div[draggable="true"]').count()
    record("lift.load", parcels >= 3, f"{parcels} placeable parcels on the shelf")
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    spots = [(0.46, 0.3), (0.6, 0.3), (0.53, 0.66)]
    placed_pts = []
    for k in range(3):
        item = page.locator('div[draggable="true"]')
        if item.count() == 0:
            break
        fx, fy = spots[k]
        pt = None
        for dfy in (0.0, 0.06, -0.06):
            for dfx in (0.0, 0.04, -0.04):
                x = box["x"] + box["width"] * (fx + dfx)
                y = box["y"] + box["height"] * (fy + dfy)
                tag = page.evaluate(
                    "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                    [x, y],
                )
                if tag == "CANVAS":
                    pt = {"x": x, "y": y}
                    break
            if pt:
                break
        if pt is None:
            record(f"lift.place{k}", False, "no uncovered paper point for the drop")
            return
        # the person's own gesture: drag the parcel off the shelf, drop on
        # paper — with a REAL DataTransfer (a bare dispatched DragEvent
        # carries dataTransfer:null and the shelf's own setData throws)
        data_transfer = page.evaluate_handle("() => new DataTransfer()")
        item.first.dispatch_event("dragstart", {"dataTransfer": data_transfer})
        canvas.dispatch_event(
            "drop",
            {"clientX": pt["x"], "clientY": pt["y"], "bubbles": True, "dataTransfer": data_transfer},
        )
        page.wait_for_timeout(500)
        placed_pts.append(pt)
        # the drop AUTO-SELECTS the placed form (the view's own contract) —
        # the card is up NOW; a paper click would only clear the selection
        if k == 0:
            # the A-C EDGE lift's card (3 concepts — the life-lines render
            # individually): the real identity + the read-through
            record(
                "lift.cardIdentity",
                page.get_by_text("lifted from Ambo Dissection Tetrahedron", exact=False).count() > 0
                and page.get_by_text("seed corner of the tetrahedron, lifted", exact=False).count() > 0
                and page.get_by_text("ambo-dissection corner of", exact=False).count() > 0
                and page.get_by_text("lifted whole", exact=False).count() > 0,
                "the real identity + the read-through life-lines on the LIVE A-C card",
            )
        if k == 2:
            # the FACE lift's card (auto-selected on its drop): SLICE2 — the
            # interior grain is CARRIED, so NO mark rides (a mark here would
            # be a false claim); the words read lifted-whole unflagged
            record(
                "lift.cardFaceCarry",
                page.get_by_text("coarse face; finer structure not carried", exact=False).count() == 0
                and page.get_by_text("lifted whole", exact=False).count() > 0,
                "the carried-grain face card: lifted whole, NO mark",
            )
    remaining = page.locator('div[draggable="true"]').count()
    refused = page.locator("text=already on the sheet").count()
    record(
        "lift.bothEdgesPlaced",
        len(placed_pts) == 3 and remaining == 0 and refused == 0,
        f"3 lifts placed (2 distinct edges + the face), {remaining} left on the shelf, dedup refusals: {refused}",
    )


def camera_state(page):
    # the PHASE A projection seam: the composed camera, read mechanically
    return page.evaluate(
        """() => {
      const camera = window.__manuscriptCamera;
      if (!camera) return null;
      return { position: camera.position.toArray(), quaternion: camera.quaternion.toArray() };
    }"""
    )


def max_written_fraction(page):
    # project every placed specimen's REAL drawn bounds (Box3 over the named
    # wrappers) to screen; the plate-fitted one is the max fraction of the
    # viewport height. PRESENCE-side math only — never a pixel read.
    return page.evaluate(
        """() => {
      const scene = window.__manuscriptScene, camera = window.__manuscriptCamera;
      if (!scene || !camera) return null;
      const groups = [];
      scene.traverse((o) => { if (o.name && o.name.startsWith('written:')) groups.push(o); });
      let best = 0;
      for (const g of groups) {
        // three does not ride on window — the bbox is built by traversal,
        // minting vectors through an instance's own constructor
        let minY = Infinity, maxY = -Infinity, any = false;
        g.updateWorldMatrix(true, true);
        g.traverse((c) => {
          const geom = c.geometry;
          if (!geom) return;
          if (!geom.boundingBox) geom.computeBoundingBox();
          const bb = geom.boundingBox;
          if (!bb) return;
          for (const px of [bb.min.x, bb.max.x]) for (const py of [bb.min.y, bb.max.y]) for (const pz of [bb.min.z, bb.max.z]) {
            const p = c.localToWorld(new c.position.constructor(px, py, pz));
            p.project(camera);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
            any = true;
          }
        });
        if (!any) continue;
        const fraction = (maxY - minY) / 2; // NDC height 2 = full viewport
        best = Math.max(best, fraction);
      }
      return best;
    }"""
    )


def drive_camera(page):
    # PHASE A (SEAL_PHASE_A_CAMERA) — the plate, judged on the RUNNING app.
    # Runs LAST: every drive above exercised the sheet at the default framing
    # (the no-regression half); the camera moves come after.
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    cx = box["x"] + box["width"] * 0.5
    cy = box["y"] + box["height"] * 0.5
    # E-PLATE: the last lift drop AUTO-SELECTED the face specimen and C1 flew
    # the plate (the settle beat + flight already passed in drive_lift's waits)
    page.wait_for_timeout(1400)
    fraction = max_written_fraction(page)
    record(
        "camera.plate",
        fraction is not None and fraction >= 0.22,
        f"selected specimen projected height fraction {fraction if fraction is None else round(fraction, 3)} (the designer measured ~50px ≈ 0.055 pre-cure)",
    )
    # E-FIT/RESET: Reset returns the composed default exactly; Fit re-flies
    reset_button = page.get_by_text("Reset Camera", exact=True)
    fit_button = page.get_by_text("Fit Selected", exact=True)
    record("camera.controlsPresent", reset_button.count() > 0 and fit_button.count() > 0, "Fit Selected + Reset Camera in the chrome")
    reset_button.first.click()
    page.wait_for_timeout(600)
    after_reset = camera_state(page)
    default_cam = DEFAULT_CAMERA["state"]
    reset_ok = (
        after_reset is not None
        and default_cam is not None
        and all(abs(a - b) < 0.05 for a, b in zip(after_reset["position"], default_cam["position"]))
    )
    fit_button.first.click()
    page.wait_for_timeout(700)
    after_fit = camera_state(page)
    fit_moved = after_fit is not None and any(
        abs(a - b) > 0.2 for a, b in zip(after_fit["position"], after_reset["position"])
    )
    frac_after_fit = max_written_fraction(page)
    record(
        "camera.fitReset",
        reset_ok and fit_moved and frac_after_fit is not None and frac_after_fit >= 0.22,
        f"reset≈default {reset_ok} · fit moved {fit_moved} · refit fraction {frac_after_fit if frac_after_fit is None else round(frac_after_fit, 3)}",
    )
    # E-ZOOM-TO-CURSOR: reset, wheel-in with the cursor RIGHT of center — the
    # framing moves TOWARD the cursor (+x) and a few ticks change it materially
    reset_button.first.click()
    page.wait_for_timeout(600)
    before_zoom = camera_state(page)
    zx = box["x"] + box["width"] * 0.74
    zy = box["y"] + box["height"] * 0.5
    page.mouse.move(zx, zy)
    for _ in range(4):
        page.mouse.wheel(0, -120)
        page.wait_for_timeout(90)
    page.wait_for_timeout(500)
    after_zoom = camera_state(page)
    def dist(p):
        return (p[0] ** 2 + p[1] ** 2 + p[2] ** 2) ** 0.5
    zoom_ok = False
    zoom_detail = "no camera state"
    if before_zoom and after_zoom:
        d0 = dist(before_zoom["position"])
        d1 = dist(after_zoom["position"])
        dx = after_zoom["position"][0] - before_zoom["position"][0]
        zoom_ok = d1 < d0 * 0.88 and dx > 0.03
        zoom_detail = f"distance {round(d0, 2)}→{round(d1, 2)} · Δx {round(dx, 3)} toward the cursor (4 ticks)"
    record("camera.zoomToCursor", zoom_ok, zoom_detail)
    # E-PAN: middle-drag translates WITHOUT rotating (quaternion stable) and
    # never opens the invoke palette
    reset_button.first.click()
    page.wait_for_timeout(600)
    before_pan = camera_state(page)
    page.mouse.move(cx, cy)
    page.mouse.down(button="middle")
    page.mouse.move(cx + 180, cy + 60, steps=8)
    page.mouse.up(button="middle")
    page.wait_for_timeout(500)
    after_pan = camera_state(page)
    pan_ok = False
    pan_detail = "no camera state"
    if before_pan and after_pan:
        lateral = abs(after_pan["position"][0] - before_pan["position"][0]) + abs(
            after_pan["position"][1] - before_pan["position"][1]
        )
        qdot = abs(sum(a * b for a, b in zip(before_pan["quaternion"], after_pan["quaternion"])))
        pan_ok = lateral > 0.15 and qdot > 0.9995 and page.locator("text=invoke — real material").count() == 0
        pan_detail = f"lateral {round(lateral, 3)} · |q·q| {round(qdot, 6)} (1 = no rotation) · palette closed"
    record("camera.pan", pan_ok, pan_detail)
    # no-regression: left-drag still ORBITS (rotation happens), and the
    # right-click invoke palette still opens on empty paper. The drag must
    # START on the CANVAS (a drei Html card intercepts pointer events — the
    # measured miss), so the point is discovered, never assumed.
    before_orbit = camera_state(page)
    orbit_pt = None
    for fy in (0.5, 0.4, 0.62, 0.3):
        for fx in (0.5, 0.36, 0.64, 0.25):
            x = box["x"] + box["width"] * fx
            y = box["y"] + box["height"] * fy
            tag = page.evaluate(
                "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                [x, y],
            )
            if tag == "CANVAS":
                orbit_pt = {"x": x, "y": y}
                break
        if orbit_pt:
            break
    if orbit_pt is None:
        orbit_pt = {"x": cx, "y": cy}
    page.mouse.move(orbit_pt["x"], orbit_pt["y"])
    page.mouse.down(button="left")
    page.mouse.move(orbit_pt["x"] + 220, orbit_pt["y"] + 70, steps=12)
    page.wait_for_timeout(450)
    # measure MID-DRAG: the release clicks empty paper → deselect → the C1
    # reset flies the camera back to default — measuring after the release
    # races the view's own recovery and reads "no rotation" (the found race)
    after_orbit = camera_state(page)
    page.mouse.up(button="left")
    page.wait_for_timeout(400)
    orbit_ok = False
    if before_orbit and after_orbit:
        qdot = abs(sum(a * b for a, b in zip(before_orbit["quaternion"], after_orbit["quaternion"])))
        orbit_ok = qdot < 0.9995  # it rotated
    reset_button.first.click()
    page.wait_for_timeout(400)
    pt = None
    for fx in (0.3, 0.24, 0.4):
        x = box["x"] + box["width"] * fx
        y = box["y"] + box["height"] * 0.5
        tag = page.evaluate(
            "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
            [x, y],
        )
        if tag == "CANVAS":
            pt = {"x": x, "y": y}
            break
    invoke_ok = False
    if pt:
        canvas.click(button="right", position={"x": pt["x"] - box["x"], "y": pt["y"] - box["y"]})
        page.wait_for_timeout(400)
        invoke_ok = page.locator("text=invoke — real material").count() > 0
        page.keyboard.press("Escape")
        page.mouse.click(box["x"] + box["width"] * 0.9, box["y"] + box["height"] * 0.12)
        page.wait_for_timeout(300)
    record(
        "camera.noRegression",
        orbit_ok and invoke_ok,
        f"left-drag orbits {orbit_ok} · right-click invoke opens {invoke_ok}",
    )


DEFAULT_CAMERA = {"state": None}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--url", required=True)
    parser.add_argument("--lift-files", default="")
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
        # PHASE A: the composed default camera, captured at boot (the Reset
        # falsifier compares against it — never a guessed literal)
        DEFAULT_CAMERA["state"] = camera_state(page)
        record("boot", True, "app up, scene handle hooked")

        # E1/E2 the triangle specimen (left paper), then the square (right
        # paper); after the square TWO faithful fans exist. A step exception
        # records RED — the leg always emits its verdict, never a bare trace.
        try:
            drive_fold(page, "triangle", "Triangle", "left", "cone point · deficit 300°", "rim turn · 60°", 1)
            argument_card_checks(page)
        except Exception as error:  # noqa: BLE001
            record("triangle.drive", False, repr(error))
        try:
            drive_fold(page, "square", "Square", "right", "cone point · deficit 270°", "rim turn · 90°", 2)
        except Exception as error:  # noqa: BLE001
            record("square.drive", False, repr(error))
        if args.lift_files:
            try:
                drive_lift(page, args.lift_files)
            except Exception as error:  # noqa: BLE001
                record("lift.drive", False, repr(error))
        # PHASE A — the camera plate, judged LAST (everything above already
        # exercised the sheet at the default framing)
        try:
            drive_camera(page)
        except Exception as error:  # noqa: BLE001
            record("camera.drive", False, repr(error))

        record("console", len(console_errors) == 0, "; ".join(console_errors[:4]))
        browser.close()

    print(json.dumps({"results": results, "consoleErrors": console_errors}))
    sys.exit(0 if all(r["ok"] for r in results.values()) else 1)


main()
