#!/usr/bin/env python3
# THE D12-B DRIVER — the Sovereign's route on the RUNNING app: the labeled
# lift parcel through the file door → a Segment INVOKED at the palette → the
# real thicken chip → the band through the shelf → placed → pointed at → the
# door's menu speaks the carried names with their level marks. The shelf
# namespacing itself exercises the resolver's suffix layer.
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


def place_parcel(page, fx, fy):
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    pool = page.locator('div[draggable="true"]')
    if pool.count() == 0:
        return None
    pt = paper_point(page, box, fx, fy)
    if pt is None:
        return None
    data_transfer = page.evaluate_handle("() => new DataTransfer()")
    pool.first.dispatch_event("dragstart", {"dataTransfer": data_transfer})
    canvas.dispatch_event("drop", {"clientX": pt["x"], "clientY": pt["y"], "bubbles": True, "dataTransfer": data_transfer})
    page.wait_for_timeout(700)
    return pt


def press(page, locator):
    if locator.count() == 0:
        return False
    locator.first.dispatch_event("mousedown", {"bubbles": True})
    page.wait_for_timeout(450)
    return True


def screen_point_of_nearest_body(page, client_pt, max_px=220):
    return page.evaluate(
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


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--lift", required=True)
    args = ap.parse_args()
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        console_errors = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.goto(args.url)
        page.wait_for_timeout(2600)

        # 1 · the labeled LIFT parcel FIRST (bodies render at their OWN
        # coordinates — placement cannot separate them; measured twice)
        # I-1 clause 2(a): the universe door is the only MULTIPLE file input —
        # the page door landed first in the DOM and the bare selector fed it.
        page.locator('input[type="file"][multiple]').set_input_files([args.lift])
        page.wait_for_timeout(800)
        pt_lift = place_parcel(page, 0.82, 0.24)
        record("route.liftPlace", pt_lift is not None, "the ambo-corner-triangle lift placed")
        if pt_lift is None:
            print(json.dumps({"results": RESULTS}))
            browser.close()
            return

        # 2 · INVOKE the Segment LAST — handleInvoke AUTO-SELECTS it, so the
        # ONE shift-click goes to the LIFT'S BIG FACE (a 500px target),
        # never the buried segment line
        canvas = page.locator("canvas").first
        box = canvas.bounding_box()
        invoked = False
        detail = ""
        for fx, fy in ((0.24, 0.66), (0.30, 0.62), (0.56, 0.72)):
            inv_pt = paper_point(page, box, fx, fy)
            if inv_pt is None:
                continue
            canvas.click(button="right", position={"x": inv_pt["x"] - box["x"], "y": inv_pt["y"] - box["y"]})
            page.wait_for_timeout(400)
            if page.locator("text=invoke — real material").count() == 0:
                detail = f"palette did not open at ({fx},{fy})"
                continue
            seg_item = page.locator('text="Segment"')
            if seg_item.count() == 0:
                detail = "palette open but no Segment row"
                break
            seg_item.first.click()
            page.wait_for_timeout(600)
            invoked = True
            detail = f"invoked at ({fx},{fy})"
            break
        record("route.invoke", invoked, detail)
        # DEBUG DUMP — every mesh's projected center + the nearby DOM labels
        dump = page.evaluate(
            """() => {
          const scene = window.__manuscriptScene, camera = window.__manuscriptCamera;
          if (!scene || !camera) return 'no seam';
          const canvas = document.querySelector('canvas');
          const rect = canvas.getBoundingClientRect();
          const out = [];
          scene.traverse((o) => {
            if (!o.isMesh || !o.geometry) return;
            if (o.geometry.computeBoundingSphere) o.geometry.computeBoundingSphere();
            const bs = o.geometry.boundingSphere;
            if (!bs) return;
            const c = bs.center.clone();
            o.localToWorld(c);
            const p = c.project(camera);
            const sx = rect.left + ((p.x + 1) / 2) * rect.width;
            const sy = rect.top + ((1 - (p.y + 1) / 2)) * rect.height;
            let g = o;
            let name = '';
            while (g && !name) { name = g.name || ''; g = g.parent; }
            out.push(`${name || o.type}@(${sx.toFixed(0)},${sy.toFixed(0)}) r${bs.radius.toFixed(2)}`);
          });
          return out.slice(0, 40).join(' | ');
        }"""
        )
        record("debug.meshes", True, dump[:290])

        # 3 · SHIFT-click the LIFT'S BIG FACE (the segment is auto-selected by
        # its own invoke; the lift's face spans ~500px — the one honest large
        # target). The forms overlap near the origin zone (bodies render at
        # their own coordinates — measured), so the click points avoid the
        # SEGMENT's projected center (read camera-free from its NAMED scene
        # group `written:w:*` — the skeleton body carries the name; the
        # plain-mode lift does not). The thicken PANEL is the arm oracle.
        def written_groups():
            # ALL named written groups, projected — {name: {sx, sy}} (the row
            # layout re-homes forms per count; nothing is at a fixed pixel)
            return page.evaluate(
                """() => {
              const scene = window.__manuscriptScene, camera = window.__manuscriptCamera;
              if (!scene || !camera) return {};
              const canvas = document.querySelector('canvas');
              const rect = canvas.getBoundingClientRect();
              const byForm = {};
              scene.traverse((o) => {
                if (!o.isMesh || !o.geometry) return;
                let g = o, name = '';
                while (g) { if ((g.name || '').startsWith('written:w:')) { name = g.name; break; } g = g.parent; }
                if (!name || byForm[name]) return;
                if (o.geometry.computeBoundingSphere) o.geometry.computeBoundingSphere();
                const bs = o.geometry.boundingSphere;
                if (!bs) return;
                const c = bs.center.clone();
                o.localToWorld(c);
                const p = c.project(camera);
                byForm[name] = {
                  sx: rect.left + ((p.x + 1) / 2) * rect.width,
                  sy: rect.top + ((1 - (p.y + 1) / 2)) * rect.height,
                };
              });
              return byForm;
            }"""
            )

        band_btn = page.locator('button:has-text("thicken — the band")')
        armed = False
        arm_note = ""
        for attempt in range(2):
            if attempt == 1:
                # bring the row into frame — the person's own camera buttons
                rc = page.locator('button:has-text("Reset Camera")')
                if rc.count() > 0:
                    rc.first.click()
                    page.wait_for_timeout(600)
            groups = written_groups()
            names = sorted(groups.keys(), key=lambda n: int("".join(ch for ch in n if ch.isdigit()) or 0))
            arm_note = f"groups: {[(n, round(groups[n]['sx']), round(groups[n]['sy'])) for n in names]}"
            if not names:
                continue
            lift_pt = groups[names[0]]  # the lift = the FIRST-placed (lowest seq)
            cx, cy = lift_pt["sx"], lift_pt["sy"]
            if not (0 <= cx < 1270 and 0 <= cy < 890):
                continue  # off-frame — retry after the camera reset
            # the body draws as a near-edge-on SLIVER at the default tilt —
            # one center click can miss the ink; sample a small grid
            tries = 0
            for dy in (0, 4, -4, 8, -8, 14, -14):
                for dx in (0, 18, -18, 36, -36):
                    if tries >= 12 or armed:
                        break
                    x, y = cx + dx, cy + dy
                    tag = page.evaluate(
                        "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                        [x, y],
                    )
                    if tag != "CANVAS":
                        continue
                    tries += 1
                    canvas.click(position={"x": x - box["x"], "y": y - box["y"]}, modifiers=["Shift"])
                    page.wait_for_timeout(400)
                    press(page, page.locator('button[title="thicken"]'))
                    if band_btn.count() > 0:
                        armed = True
                        arm_note = f"armed at the lift group ({x:.0f},{y:.0f}) after {tries} tries"
                if armed:
                    break
            if armed:
                break
        if armed:
            press(page, band_btn)
            page.wait_for_timeout(1000)
        else:
            page.screenshot(path=_frame_path("d12b_debug_arm.png"))
        record("route.thicken", armed, arm_note)

        # 4 · the band parcel rides the shelf; place it (the drop auto-points)
        pt_band = place_parcel(page, 0.64, 0.60)
        record("route.bandPlace", pt_band is not None, "the band placed")
        opened = False
        chip = page.locator('button:has-text("aperture — build a 3-manifold")')
        if press(page, chip):
            opened = page.locator("[data-aperture-panel]").count() > 0
        record("route.door", opened, "the aperture panel opens on the pointed-at band")

        # 5 · the menu speaks: read the FIRST face select's option texts
        opts = []
        sels = page.locator("[data-aperture-rows] select")
        if sels.count() > 0:
            opts = [t for t in sels.nth(0).locator("option").evaluate_all("els => els.map((e) => e.textContent ?? '')") if t and "— face —" not in t]
        caps_ok = any("AB₀·AD₀·AE₀" in t for t in opts) and any("AB₁·AD₁·AE₁" in t for t in opts)
        record("route.caps", caps_ok, f"options: {' | '.join(opts)[:220]}")
        five_named = (
            len(opts) == 5
            and len(set(opts)) == 5
            and all("unnamed" not in t for t in opts)
            and all("VERTEX:" not in t.upper() or "·" in t for t in opts)
            and all(":" not in t.replace(" corners", "").replace("·", "") for t in opts)
        )
        record("route.fiveNamed", five_named, f"{len(opts)} options, distinct {len(set(opts))}, no unnamed/id-leak")
        record("hygiene.console", len(console_errors) == 0, "; ".join(console_errors[:3]))

        print(json.dumps({"results": RESULTS}))
        browser.close()


if __name__ == "__main__":
    main()
