#!/usr/bin/env python3
# THE WINDING ROUTE DRIVER — the four acceptance readings on the RUNNING app,
# each read off the explore window's own return line (the seal's surface).
# THE STANDING WINDING-ROUTE DRIVER (engineer 1230/1300 charter): the
# DETERMINISTIC sessions only —
#   cone: the positive control (2 doors - turned) + the retrace (2 doors -
#         the same way up, with a half-circle head-turn between: the deck
#         falsifier), both on the throttled walk that reproduced twice;
#   fan2: the pillar CIRCUIT on the 5-cell chamber (the interior-transport
#         gap read on the person's own surface).
# The exploratory T3 sessions (jitter-dice under the software renderer) are
# deliberately NOT standing - they live in the arc's report.
# seam.paceOverride is THIS driver's throttle (its one user): the software
# renderer's setTimeout starvation makes pulse lengths jitter 0.65-2.8u at
# the default pace; a person's 60fps hand samples every ~0.07u for free.
import argparse
import json
import math

from playwright.sync_api import sync_playwright

RESULTS = {}


import sys


def record(name, ok, detail=""):
    RESULTS[name] = {"ok": bool(ok), "detail": str(detail)[:340]}
    print(f"[{name}] {'ok' if ok else 'FAIL'} {detail}"[:200], file=sys.stderr, flush=True)


def seam(page):
    return page.evaluate("() => window.__exploreWindow ? JSON.parse(JSON.stringify(window.__exploreWindow)) : null")


def paper_point(page, box, fx, fy):
    for dfy in (0.0, 0.06, -0.06, 0.12, -0.12):
        for dfx in (0.0, 0.04, -0.04, 0.08, -0.08):
            x = box["x"] + box["width"] * (fx + dfx)
            y = box["y"] + box["height"] * (fy + dfy)
            tag = page.evaluate(
                "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }", [x, y]
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
    dt = page.evaluate_handle("() => new DataTransfer()")
    pool.first.dispatch_event("dragstart", {"dataTransfer": dt})
    canvas.dispatch_event("drop", {"clientX": pt["x"], "clientY": pt["y"], "bubbles": True, "dataTransfer": dt})
    page.wait_for_timeout(700)
    return pt


def press(page, locator):
    if locator.count() == 0:
        return False
    locator.first.dispatch_event("mousedown", {"bubbles": True})
    page.wait_for_timeout(400)
    return True


def project_group(page, prefix):
    return page.evaluate(
        """(prefix) => {
      const scene = window.__manuscriptScene, camera = window.__manuscriptCamera;
      if (!scene || !camera) return null;
      const canvas = document.querySelector('canvas');
      const rect = canvas.getBoundingClientRect();
      let best = null;
      scene.traverse((o) => {
        if (best || !o.isMesh || !o.geometry) return;
        let g = o, name = '';
        while (g) { if ((g.name || '').startsWith(prefix)) { name = g.name; break; } g = g.parent; }
        if (!name) return;
        if (o.geometry.computeBoundingSphere) o.geometry.computeBoundingSphere();
        const bs = o.geometry.boundingSphere;
        if (!bs) return;
        const c = bs.center.clone();
        o.localToWorld(c);
        const p = c.project(camera);
        best = { sx: rect.left + ((p.x + 1) / 2) * rect.width, sy: rect.top + ((1 - (p.y + 1) / 2)) * rect.height };
      });
      return best;
    }""",
        prefix,
    )


def summon(page, prefix):
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    page.evaluate("() => window.scrollTo(0, 0)")
    pt = project_group(page, prefix)
    if pt is None:
        return False
    page.mouse.dblclick(pt["sx"], pt["sy"])
    page.wait_for_timeout(1200)
    return page.get_by_text("Fit Selected", exact=True).count() > 0


def open_window(page):
    chip = page.locator('button[aria-label="explore inside"]')
    if chip.count() == 0:
        return False
    chip.first.click()
    page.wait_for_timeout(500)
    try:
        page.wait_for_function(
            "() => window.__exploreWindow && window.__exploreWindow.gpu && window.__exploreWindow.renderFrames > 3",
            timeout=20000,
        )
    except Exception:
        return False
    return True


def close_window(page):
    page.keyboard.press("Escape")
    page.wait_for_timeout(400)


def window_center(page):
    box = page.locator("[data-explore-window] canvas").first.bounding_box()
    return box, box["x"] + box["width"] / 2, box["y"] + box["height"] / 2


def drag_px(page, dx, dy=0):
    # the committed drive's own cure (deficit_app_driver:1381-1388): a drag
    # must be DOM-dispatched in ONE task through the app's real handler chain
    # (pointerdown -> 12 moves -> pointerup). CDP mouse injection serializes
    # per-frame under the software renderer and the app lawfully reads the
    # stretched press as a HOLD (it walks instead of turning) - measured
    # here too before this cure was copied.
    page.evaluate(
        """([dx, dy]) => {
      const c = document.querySelector('[data-explore-canvas]');
      const r = c.getBoundingClientRect();
      const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      const fire = (type, x, y) => c.dispatchEvent(new PointerEvent(type, {
        pointerId: 7, bubbles: true, cancelable: true, clientX: x, clientY: y, isPrimary: true,
      }));
      fire('pointerdown', cx, cy);
      const steps = 12;
      for (let i = 1; i <= steps; i += 1) fire('pointermove', cx + (dx * i) / steps, cy + (dy * i) / steps);
      fire('pointerup', cx + dx, cy + dy);
    }""",
        [dx, dy],
    )
    page.wait_for_timeout(280)


def turn_to(page, heading, tries=16, tol=0.10):
    # pure-yaw closed loop over same-task DOM drags, measured off seam.forward
    px_per_rad = 220.0
    sign = None
    for _ in range(tries):
        s = seam(page)
        f = s["forward"]
        e = s["eye"]
        cur = math.atan2(f[1], f[0])
        want = math.atan2(heading[1], heading[0])
        err = (want - cur + math.pi) % (2 * math.pi) - math.pi
        print(f"[turn] err={err:.2f} fwd=({f[0]:.2f},{f[1]:.2f},{f[2]:.2f}) eye=({e[0]:.2f},{e[1]:.2f}) doors={s['doors']}", file=sys.stderr, flush=True)
        if abs(err) < tol:
            return True
        if sign is None:
            drag_px(page, 30)
            f2 = seam(page)["forward"]
            cur2 = math.atan2(f2[1], f2[0])
            delta = (cur2 - cur + math.pi) % (2 * math.pi) - math.pi
            if abs(delta) < 1e-4:
                continue
            sign = 1 if delta > 0 else -1
            px_per_rad = min(600.0, abs(30 / delta))
            continue
        dx = max(-300, min(300, sign * err * px_per_rad))
        drag_px(page, dx)
    s = seam(page)
    f = s["forward"]
    err = (math.atan2(heading[1], heading[0]) - math.atan2(f[1], f[0]) + math.pi) % (2 * math.pi) - math.pi
    print(f"[turn] gave up err={err:.2f}", file=sys.stderr, flush=True)
    return abs(err) < tol * 2


def pulse(page, ms):
    # a timed in-page press: down -> setTimeout(ms) -> up, all in the page's
    # own clock (the input-clock integral the app walks by). Between pulses a
    # frame lands, so the position-return test samples at least once per
    # pulse - the leg's software renderer needs that; a person at 60fps gets
    # a sample every ~0.07u for free.
    page.evaluate(
        """(ms) => new Promise((resolve) => {
      const c = document.querySelector('[data-explore-canvas]');
      const r = c.getBoundingClientRect();
      const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      const fire = (type) => c.dispatchEvent(new PointerEvent(type, {
        pointerId: 9, bubbles: true, cancelable: true, clientX: cx, clientY: cy, isPrimary: true,
      }));
      fire('pointerdown');
      setTimeout(() => { fire('pointerup'); resolve(null); }, ms);
    })""",
        ms,
    )
    page.wait_for_timeout(160)


def walk_until(page, pred, bail=None, pulse_ms=420, max_pulses=70):
    for _ in range(max_pulses):
        pulse(page, pulse_ms)
        sm = seam(page)
        e = sm["eye"]
        print(f"[walk] eye=({e[0]:.2f},{e[1]:.2f},{e[2]:.2f}) doors={sm['doors']} ret={bool(sm['returnLine'])}", file=sys.stderr, flush=True)
        if pred(sm):
            return True
        if bail and bail(sm):
            return False
    return False


def advance_until(page, pred, max_ms=20000):
    # press-and-hold with the committed engage fence; slice + re-check
    box, cx, cy = window_center(page)
    s0 = seam(page)
    page.mouse.move(cx, cy)
    page.mouse.down()
    try:
        page.wait_for_function(
            f"() => window.__exploreWindow && window.__exploreWindow.advances > {s0['advances']}", timeout=8000
        )
    except Exception:
        page.mouse.up()
        return False
    held = 0
    ok = False
    while held < max_ms:
        page.wait_for_timeout(220)
        held += 220
        sm = seam(page)
        if held % 1100 < 220:
            e = sm["eye"]
            print(f"[adv] t={held} eye=({e[0]:.2f},{e[1]:.2f},{e[2]:.2f}) doors={sm['doors']} ret={sm['returnLine']}", file=sys.stderr, flush=True)
        if pred(sm):
            ok = True
            break
    page.mouse.up()
    page.wait_for_timeout(300)
    return ok


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])


def goto(page, target, eps=0.16, legs=10):
    for _ in range(legs):
        s = seam(page)
        eye = s["eye"]
        if dist(eye, target) <= eps:
            return True
        h = [target[0] - eye[0], target[1] - eye[1], 0.0]
        n = math.hypot(h[0], h[1])
        if n < 1e-6:
            return True
        h = [h[0] / n, h[1] / n]
        if not turn_to(page, h):
            return False
        d0 = s["doors"]

        def arrived(sm, start=eye, target=target, eps=eps, d0=d0):
            return dist(sm["eye"], target) <= eps or sm["doors"] > d0 or dist(sm["eye"], start) > n + 0.4

        walk_until(page, arrived, pulse_ms=340, max_pulses=10)
    return dist(seam(page)["eye"], target) <= eps * 1.8


def read_return(page):
    s = seam(page)
    dom = page.evaluate(
        "() => { const el = document.querySelector('[data-explore-return]'); return el ? el.textContent : null; }"
    )
    return s["returnLine"], dom


def run_cone(page, args, arc):
    page.set_input_files('input[type="file"]', [args.cube])
    page.wait_for_timeout(800)
    placed = place_parcel(page, 0.78, 0.30) is not None
    record("C.cubePlaced", placed, "the cube parcel placed (auto-points)")
    built = False
    if placed:
        press(page, page.locator('button:has-text("aperture — build a 3-manifold")'))
        page.wait_for_timeout(400)
        sels = page.locator("[data-aperture-rows] select")
        n = sels.count()
        record("C.panel", n >= 9, f"{n} selects (3 rows expected)")
        if n >= 9:
            pair_names = [["left", "right"], ["top", "bottom"], ["front", "back"]]
            okp = True
            for row in range(3):
                a_sel, b_sel, m_sel = sels.nth(row * 3), sels.nth(row * 3 + 1), sels.nth(row * 3 + 2)
                va = a_sel.locator("option").evaluate_all("els => els.map((e) => e.value).filter((v) => v)")
                fa = next((v for v in va if v.endswith(f":face:cube:{pair_names[row][0]}")), None)
                if fa is None:
                    okp = False
                    break
                a_sel.select_option(fa)
                page.wait_for_timeout(250)
                vb = b_sel.locator("option").evaluate_all("els => els.map((e) => e.value).filter((v) => v)")
                fb = next((v for v in vb if v.endswith(f":face:cube:{pair_names[row][1]}")), None)
                if fb is None:
                    okp = False
                    break
                b_sel.select_option(fb)
                page.wait_for_timeout(350)
                m_sel.select_option("d+0")
                page.wait_for_timeout(250)
            record("C.picks", okp, "three pairs picked; maps d+0 x3 (the sound 2x180deg cone word)")
            if okp:
                press(page, page.locator('button:has-text("glue — the S² gate judges")'))
                page.wait_for_timeout(1500)
                built = summon(page, "written:dim3:built-") and open_window(page)
                record("C.window", built, "the cone room summons; the window opens")
    got = False
    line = dom = None
    want = "return 1 · back where you started · after 2 doors · the room came back turned"
    if built:
        heading = [math.cos(math.radians(50)), math.sin(math.radians(50))]
        for attempt in range(6):
            if attempt > 0:
                close_window(page)
                if not open_window(page):
                    break
            # the leg's throttle (the seam's paceOverride — nothing in-app
            # sets it): pulses drop to ~0.2u so the return ball is sampled
            # the way a person's 60fps hand samples it for free
            page.evaluate("() => { window.__exploreWindow.paceOverride = 0.15; }")
            po = page.evaluate("() => window.__exploreWindow.paceOverride")
            print(f"[C] paceOverride readback: {po}", file=sys.stderr, flush=True)
            turn_to(page, heading)
            walk_until(page, lambda s: s["returnLine"] is not None, bail=lambda s: s["doors"] > 2, pulse_ms=420, max_pulses=70)
            line, dom = read_return(page)
            if line == want and dom == want:
                got = True
                break
            print(f"[C] attempt {attempt}: {line} doors={seam(page)['doors']}", file=sys.stderr, flush=True)
        record("C.turned", got, f"seam: {line} · dom: {dom}")
    close_window(page)
    # B' — THE RETRACE, on the same cone room (its doors are involutions:
    # out and back through one door composes to the identity), with the
    # deterministic throttle. The camera turns ~180 degrees between the two
    # crossings; the deck does not — the falsifier the mandate names.
    gotB = False
    lineB = domB = None
    wantB = "return 1 · back where you started · after 2 doors · the room came back the same way up"
    if built:
        for attempt in range(4):
            if not open_window(page):
                break
            page.evaluate("() => { window.__exploreWindow.paceOverride = 0.15; }")
            turn_to(page, [1.0, 0.0])
            crossed = walk_until(page, lambda s: s["doors"] >= 1, bail=lambda s: s["doors"] > 1, pulse_ms=420, max_pulses=60)
            turned = turn_to(page, [-1.0, 0.0])
            fired = walk_until(page, lambda s: s["returnLine"] is not None, bail=lambda s: s["doors"] > 2, pulse_ms=420, max_pulses=60)
            lineB, domB = read_return(page)
            close_window(page)
            if crossed and turned and fired and lineB == wantB and domB == wantB:
                gotB = True
                break
            print(f"[B2] attempt {attempt}: {lineB}", file=sys.stderr, flush=True)
        record("B2.retrace", gotB, f"seam: {lineB} · dom agrees: {domB == lineB}")


def run_fan2(page, args, arc):
    # acceptance #2, INTERIOR TRANSPORT LANDED (2026-08-21): the pillar
    # ENCIRCLED in the DEVELOPED cone room — the circuit crosses the seam
    # once and the room comes home EARLY. The ratified reading is pinned:
    # `return 1 · back where you started · after 1 door · the room came back turned`.
    page.set_input_files('input[type="file"]', [args.fanlift])
    page.wait_for_timeout(800)
    lift_ok = place_parcel(page, 0.44, 0.30) is not None
    page.set_input_files('input[type="file"]', [args.segment])
    page.wait_for_timeout(800)
    seg_ok = place_parcel(page, 0.30, 0.62) is not None
    record("E.parcels", lift_ok and seg_ok, "fan lift + segment placed")
    fan_done = False
    if lift_ok and seg_ok:
        band_btn = page.locator('button:has-text("thicken — the band")')
        rc = page.locator('button:has-text("Reset Camera")')
        armed = False
        for attempt in range(2):
            if attempt == 1 and rc.count() > 0:
                rc.first.click()
                page.wait_for_timeout(600)
            pt = project_group(page, "written:w:")
            if pt is None:
                continue
            canvas = page.locator("canvas").first
            box = canvas.bounding_box()
            for dy in (0, 5, -5, 10, -10):
                x, y = pt["sx"], pt["sy"] + dy
                if not (0 <= x < 1270 and 0 <= y < 890):
                    continue
                tag = page.evaluate(
                    "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                    [x, y],
                )
                if tag != "CANVAS":
                    continue
                canvas.click(position={"x": x - box["x"], "y": y - box["y"]}, modifiers=["Shift"])
                page.wait_for_timeout(400)
                press(page, page.locator('button[title="thicken"]'))
                if band_btn.count() > 0:
                    armed = True
                    break
            if armed:
                break
        record("E.armed", armed, "the thicken pair armed")
        if armed:
            press(page, band_btn)
            page.wait_for_timeout(1000)
            band_placed = place_parcel(page, 0.64, 0.60) is not None
            press(page, page.locator('button:has-text("aperture — build a 3-manifold")'))
            page.wait_for_timeout(400)
            left = press(page, page.locator("[data-aperture-leave-bounded]"))
            page.wait_for_timeout(1200)
            fan_done = band_placed and left and summon(page, "written:dim3:built-") and open_window(page)
            record("E.window", fan_done, "the fan chamber window opens")
    if fan_done:
        page.evaluate("() => { window.__exploreWindow.paceOverride = 0.06; }")
        walked = True
        for i, wp in enumerate(arc[1:], start=1):
            if not goto(page, wp, eps=0.16, legs=10):
                walked = False
                print(f"[E] waypoint {i} unreached", file=sys.stderr, flush=True)
                break
            cur = seam(page)
            if cur["returnLine"] is not None and i < len(arc) - 2:
                # an early fire (the loop passes nowhere near the entry until
                # the last leg per the simulation) — report it as-is
                print(f"[E] early fire at waypoint {i}: {cur['returnLine']}", file=sys.stderr, flush=True)
        if walked and seam(page)["returnLine"] is None:
            walk_until(page, lambda s: s["returnLine"] is not None, pulse_ms=380, max_pulses=20)
        line, dom = read_return(page)
        # the ratified reading, pinned (a witness that accepts any line pins
        # nothing): one seam crossing, home early, turned
        wantE = "return 1 · back where you started · after 1 door · the room came back turned"
        record("E.circuit", line == wantE and dom == line, f"THE LINE, VERBATIM: {line} · doors {seam(page)['doors']}")
    close_window(page)



def run_mirror(page, args):
    # THE FOURTH STRING, live (the sweep's corrected fact): the sound word
    # d+0,d+1,d+2 returns the entry on a straight +y walk in ONE door with a
    # reflection deck - the app must announce `the room came back mirrored`.
    page.set_input_files('input[type="file"]', [args.cube])
    page.wait_for_timeout(800)
    placed = place_parcel(page, 0.78, 0.30) is not None
    record("M.cubePlaced", placed, "the cube parcel placed")
    built = False
    if placed:
        press(page, page.locator('button:has-text("aperture — build a 3-manifold")'))
        page.wait_for_timeout(400)
        sels = page.locator("[data-aperture-rows] select")
        if sels.count() >= 9:
            pair_names = [["left", "right"], ["top", "bottom"], ["front", "back"]]
            maps = ["d+0", "d+1", "d+2"]
            okp = True
            for row in range(3):
                a_sel, b_sel, m_sel = sels.nth(row * 3), sels.nth(row * 3 + 1), sels.nth(row * 3 + 2)
                va = a_sel.locator("option").evaluate_all("els => els.map((e) => e.value).filter((v) => v)")
                fa = next((v for v in va if v.endswith(f":face:cube:{pair_names[row][0]}")), None)
                if fa is None:
                    okp = False
                    break
                a_sel.select_option(fa)
                page.wait_for_timeout(250)
                vb = b_sel.locator("option").evaluate_all("els => els.map((e) => e.value).filter((v) => v)")
                fb = next((v for v in vb if v.endswith(f":face:cube:{pair_names[row][1]}")), None)
                if fb is None:
                    okp = False
                    break
                b_sel.select_option(fb)
                page.wait_for_timeout(350)
                m_sel.select_option(maps[row])
                page.wait_for_timeout(250)
            record("M.picks", okp, "picks (left,right)(top,bottom)(front,back) - maps d+0,d+1,d+2")
            if okp:
                press(page, page.locator('button:has-text("glue — the S² gate judges")'))
                page.wait_for_timeout(1500)
                built = summon(page, "written:dim3:built-") and open_window(page)
                record("M.window", built, "the room summons; the window opens")
    if built:
        got = False
        line = dom = None
        # W.7 recut: the ratified final strings read `1 door` singular
        want = "return 1 · back where you started · after 1 door · the room came back mirrored"
        for attempt in range(5):
            if attempt > 0:
                close_window(page)
                if not open_window(page):
                    break
            page.evaluate("() => { window.__exploreWindow.paceOverride = 0.12; }")
            # the mirrored re-entry sits at 0.2 u (the z-flip) — heading
            # drift must stay under ~0.1 u over the 2 u walk, so the turn is
            # held to 0.04 rad here
            turn_to(page, [0.0, 1.0], tries=30, tol=0.04)
            walk_until(page, lambda s: s["returnLine"] is not None, bail=lambda s: s["doors"] > 1, pulse_ms=420, max_pulses=70)
            line, dom = read_return(page)
            if line == want and dom == want:
                got = True
                break
            print(f"[M] attempt {attempt}: {line}", file=sys.stderr, flush=True)
        record("M.mirrored", got, f"seam: {line} · dom agrees: {dom == line}")
    close_window(page)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--cube", required=False, default="")
    ap.add_argument("--fanlift", required=False, default="")
    ap.add_argument("--segment", required=False, default="")
    ap.add_argument("--arc", required=False, default="[]")
    ap.add_argument("--session", required=True, choices=["cone", "fan2", "mirror"])
    args = ap.parse_args()
    arc = json.loads(args.arc)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 1280, "height": 900})
        errors = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.goto(args.url)
        page.wait_for_timeout(2600)
        if args.session == "cone":
            run_cone(page, args, arc)
        elif args.session == "mirror":
            run_mirror(page, args)
        else:
            run_fan2(page, args, arc)
        record("hygiene.console", len(errors) == 0, "; ".join(errors[:3]))
        print(json.dumps({"results": RESULTS}))
        browser.close()


if __name__ == "__main__":
    main()
