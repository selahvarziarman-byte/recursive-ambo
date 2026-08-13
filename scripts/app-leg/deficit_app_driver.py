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
      return ['⟶', '←', '•', '⊕', '⊾', '⌐', '⇄', '○', 'Σδ', '⚠', '∘'].map((ch) => ({ ch, tofu: draw(ch) === notdef }));
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
    # M3 E-GENERAL — the INVOKED plain shape rings from its own card (no lift
    # special-case), and its concept labels are the persistence baseline
    page.wait_for_timeout(300)
    pre_concepts = page.evaluate(
        "() => [...document.querySelectorAll('.corr-mark[data-mark-kind=\"concept\"]')].map((el) => (el.textContent ?? '').trim())"
    )
    record(
        f"{key}.ringGeneral",
        len(pre_concepts) > 0,
        f"{len(pre_concepts)} concept marks ring the INVOKED {key} (plain — generality, no lift special-case)",
    )
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
    # M3 ★ THE PERSISTENCE (SEAL_M3_PERSISTENCE) — the fold-born cone renders
    # in mode 'faithful': its ring must render FROM ITS OWN CARD (the cure —
    # the old plain/skeleton gate dropped exactly this), labels mapped BY NAME
    # from the pre-fold ring, the merged class wearing ONE `p ← {…}` label,
    # and NO false memorial (the fold absorbs — died must read 0).
    page.wait_for_timeout(400)
    persist = page.evaluate(
        """() => {
      const seam = window.__manuscriptCorrespondence ?? {};
      const rows = new Set([...(seam.rowResultIds ?? []), ...(seam.composedRowIds ?? [])]);
      const marks = [...document.querySelectorAll('.corr-mark')].map((el) => ({
        kind: el.getAttribute('data-mark-kind'),
        text: (el.textContent ?? '').trim(),
      }));
      const died = document.querySelectorAll('[data-died-row]').length;
      return { rows: rows.size, marks, died };
    }"""
    )
    post_concepts = [m["text"] for m in persist["marks"] if m["kind"] == "concept"]
    survivors = [t for t in post_concepts if t in set(pre_concepts)]
    merged = [t for t in post_concepts if "← {" in t]
    record(
        f"{key}.ringPersists",
        persist["rows"] > 0 and len(persist["marks"]) == persist["rows"] and len(survivors) >= 1,
        f"{len(persist['marks'])} ring marks === {persist['rows']} card rows on the FAITHFUL fold-born · "
        f"{len(survivors)} concept label(s) mapped by name from the pre-fold ring {survivors}",
    )
    record(
        f"{key}.ringMerged",
        len(merged) == 1 and "unnamed ← {" in merged[0],
        f"merged labels: {merged} (ONE `p ← {{…}}` — own name or 'unnamed', never an invented letter)",
    )
    record(
        f"{key}.diedRowAbsent",
        persist["died"] == 0,
        f"died rows: {persist['died']} (the fold absorbs — the memorial speaks only a TRUE death)",
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
        # DETERMINISTIC drop order (the shelf's own order is not contracted):
        # the two EDGE parcels first, the FACE parcel LAST — so k==0 asserts
        # the edge card, k==2 the face card, and the face stays selected for
        # the correspondence section (the measured order-flip cascade)
        pool = page.locator('div[draggable="true"]')
        item = pool.filter(has_text="edge:") if k < 2 else pool.filter(has_text="face:")
        if item.count() == 0:
            item = pool
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
            # interior grain is CARRIED, so NO mark rides; PHASE C — the
            # composed seed relations SURFACE with their drawn paths LIVE
            record(
                "lift.cardFaceCarry",
                page.get_by_text("coarse face; finer structure not carried", exact=False).count() == 0
                and page.get_by_text("lifted whole", exact=False).count() > 0
                and page.get_by_text("composed seed relation", exact=False).count() > 0,
                "the manifold face card: lifted whole, NO mark, the composed seed relations surfaced",
            )
            # D2-GROUND E-HATCH: the placed flat lift's PLAIN body carries the
            # hatch ShaderMaterial (grey from lines) — the material census on
            # the selected written group
            hatch = page.evaluate(
                """() => {
              const scene = window.__manuscriptScene;
              if (!scene) return null;
              let shaders = 0, standard = 0;
              scene.traverse((o) => {
                if (o.name && o.name.startsWith('written:')) {
                  o.traverse((c) => {
                    if (c.isMesh && c.material) {
                      if (c.material.type === 'ShaderMaterial') shaders += 1;
                      if (c.material.type === 'MeshStandardMaterial') standard += 1;
                    }
                  });
                }
              });
              return { shaders, standard };
            }"""
            )
            record(
                "hatch.plain",
                bool(hatch) and hatch["shaders"] >= 1,
                f"written bodies: {0 if not hatch else hatch['shaders']} hatch ShaderMaterial(s) · {0 if not hatch else hatch['standard']} standard fill(s)",
            )
    remaining = page.locator('div[draggable="true"]').count()
    refused = page.locator("text=already on the sheet").count()
    record(
        "lift.bothEdgesPlaced",
        len(placed_pts) == 3 and remaining == 0 and refused == 0,
        f"3 lifts placed (2 distinct edges + the face), {remaining} left on the shelf, dedup refusals: {refused}",
    )


def drive_correspondence(page):
    # PHASE D1 (SEAL_PHASE_D1_CORRESPONDENCE_ENGINE) — the engine on the
    # RUNNING app. The face lift is selected (the drop auto-selected it; the
    # plate settled), so the seam carries the projected positions + the card
    # row id-space. Ends with Fit Selected so the camera section that follows
    # measures from the plate.
    page.wait_for_timeout(600)
    seam = page.evaluate(
        """() => {
      const c = window.__manuscriptCorrespondence;
      if (!c) return null;
      return { keys: Object.keys(c.positions ?? {}), rowIds: c.rowResultIds ?? [] };
    }"""
    )
    record(
        "corr.seam",
        seam is not None and len(seam["keys"]) > 0 and len(seam["rowIds"]) > 0,
        f"{0 if not seam else len(seam['keys'])} projected entities · {0 if not seam else len(seam['rowIds'])} card row ids · subject tail: {('' if not seam or not seam['keys'] else seam['keys'][0].split(':')[-1])}",
    )
    if not seam or not seam["keys"]:
        return
    # E-ONE-ID-SPACE: every projected key is a card row resultId by === — and
    # the suffix-only plant (the bare hash tail) is REFUSED (D1 is ===, not
    # endsWith)
    idspace = page.evaluate(
        """() => {
      const c = window.__manuscriptCorrespondence;
      const keys = Object.keys(c.positions ?? {});
      const rowSet = new Set(c.rowResultIds ?? []);
      const inRows = keys.filter((k) => rowSet.has(k)).length;
      const suffixPlantAccepted = keys.map((k) => k.split(':').pop()).some((t) => rowSet.has(t));
      return { total: keys.length, inRows, suffixPlantAccepted, rowCount: (c.rowResultIds ?? []).length };
    }"""
    )
    record(
        "corr.idSpace",
        idspace["total"] > 0
        and idspace["inRows"] == idspace["total"]
        and idspace["suffixPlantAccepted"] is False
        and idspace["rowCount"] == idspace["total"],
        f"{idspace['inRows']}/{idspace['total']} projected ids === card row ids (rows {idspace['rowCount']}) · suffix-only plant accepted: {idspace['suffixPlantAccepted']}",
    )
    # E-PICK-RETURNS-ID: hover/click a corner VERTEX at its own projected
    # coords (the least-contested target), then hover an EDGE at its midpoint
    target = page.evaluate(
        """() => {
      const c = window.__manuscriptCorrespondence;
      const entries = Object.entries(c.positions ?? {});
      const vertices = entries.filter(([id, p]) => id.includes(':vertex:') && p.onScreen);
      const vertex = vertices.find(([id]) => id.includes(':tetrahedron:')) ?? vertices[0] ?? null;
      // edge CANDIDATES, least-contested first: midpoints ≥ 18px from every
      // vertex (the T-junction sphere contest); DEPTH contests (a nearer
      // edge's cylinder in front at this attitude) are resolved by trying
      // candidates in turn — the topmost edge always wins its own midpoint
      const edges = entries
        .filter(([id, p]) => id.includes(':edge:') && p.onScreen)
        .filter(([, p]) => vertices.every(([, vp]) => Math.hypot(vp.x - p.x, vp.y - p.y) >= 18))
        .slice(0, 5)
        .map(([id, p]) => ({ id, x: p.x, y: p.y }));
      return {
        vertex: vertex ? { id: vertex[0], x: vertex[1].x, y: vertex[1].y } : null,
        edges,
      };
    }"""
    )
    # (the pick GESTURES moved to drive_correspondence_pick — it runs AFTER
    # the ring census so the census reads a truly COLD emphasis: a pick is
    # STICKY by D1's design, and its ~3 neighborhood would wear the promoted
    # halo through every later section)
    # E-POSITIONS-TRACK-CAMERA: the projected coords MOVE on Reset, then Fit
    # Selected restores the plate
    before = (
        page.evaluate("(id) => window.__manuscriptCorrespondence.positions[id] ?? null", target["vertex"]["id"])
        if target["vertex"]
        else None
    )
    page.get_by_text("Reset Camera", exact=True).first.click(timeout=8000)
    page.wait_for_timeout(700)
    after = (
        page.evaluate("(id) => window.__manuscriptCorrespondence.positions[id] ?? null", target["vertex"]["id"])
        if target["vertex"]
        else None
    )
    moved = bool(before and after) and (abs(before["x"] - after["x"]) + abs(before["y"] - after["y"])) > 10
    fit_button = page.get_by_text("Fit Selected", exact=True).first
    if fit_button.is_enabled():
        fit_button.click(timeout=8000)
    else:
        record("corr.fitDisabled", False, "Fit Selected DISABLED at corr end — the selection was lost mid-section")
    page.wait_for_timeout(800)
    restored = (
        page.evaluate("(id) => window.__manuscriptCorrespondence.positions[id] ?? null", target["vertex"]["id"])
        if target["vertex"]
        else None
    )
    record(
        "corr.track",
        moved and bool(restored and restored["onScreen"]),
        f"Δ {0 if not (before and after) else round(abs(before['x'] - after['x']) + abs(before['y'] - after['y']), 1)}px on Reset · onScreen after Fit {bool(restored and restored['onScreen'])}",
    )
    # E-NO-MARKS: the pick layer is INVISIBLE — every mesh opacity-0
    marks = page.evaluate(
        """() => {
      const scene = window.__manuscriptScene;
      if (!scene) return null;
      let meshes = 0, invisible = 0;
      scene.traverse((o) => {
        if (o.name === 'correspondence-pick') {
          o.traverse((c) => {
            if (c.isMesh && c.material) {
              meshes += 1;
              if (c.material.transparent && c.material.opacity === 0) invisible += 1;
            }
          });
        }
      });
      return { meshes, invisible };
    }"""
    )
    record(
        "corr.noMarks",
        bool(marks) and marks["meshes"] > 0 and marks["invisible"] == marks["meshes"],
        f"{0 if not marks else marks['invisible']}/{0 if not marks else marks['meshes']} pick meshes invisible (opacity 0)",
    )


def drive_correspondence_pick(page):
    # E-PICK-RETURNS-ID (D1) — hover/click a corner VERTEX at its own
    # projected coords, then hover an EDGE at its midpoint. Runs AFTER the
    # ring census: the pick is STICKY (D1's design) and its emphasized ~3
    # would pollute a "cold" halo census run behind it.
    target = page.evaluate(
        """() => {
      const c = window.__manuscriptCorrespondence;
      const entries = Object.entries(c.positions ?? {});
      const vertices = entries.filter(([id, p]) => id.includes(':vertex:') && p.onScreen);
      const vertex = vertices.find(([id]) => id.includes(':tetrahedron:')) ?? vertices[0] ?? null;
      const edges = entries
        .filter(([id, p]) => id.includes(':edge:') && p.onScreen)
        .filter(([, p]) => vertices.every(([, vp]) => Math.hypot(vp.x - p.x, vp.y - p.y) >= 18))
        .slice(0, 5)
        .map(([id, p]) => ({ id, x: p.x, y: p.y }));
      return {
        vertex: vertex ? { id: vertex[0], x: vertex[1].x, y: vertex[1].y } : null,
        edges,
      };
    }"""
    )
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    ok_hover_v = ok_pick_v = ok_hover_e = False
    if target["vertex"]:
        page.mouse.move(box["x"] + target["vertex"]["x"], box["y"] + target["vertex"]["y"])
        page.wait_for_timeout(350)
        hov = page.evaluate("() => window.__manuscriptCorrespondence.hovered ?? null")
        ok_hover_v = bool(hov) and hov["id"] == target["vertex"]["id"] and hov["kind"] == "vertex"
        page.mouse.down(button="left")
        page.mouse.up(button="left")
        page.wait_for_timeout(250)
        pick = page.evaluate("() => window.__manuscriptCorrespondence.picked ?? null")
        ok_pick_v = bool(pick) and pick["id"] == target["vertex"]["id"]
    edges_tried = 0
    for candidate in target["edges"]:
        edges_tried += 1
        page.mouse.move(box["x"] + candidate["x"], box["y"] + candidate["y"])
        page.wait_for_timeout(350)
        hov = page.evaluate("() => window.__manuscriptCorrespondence.hovered ?? null")
        if bool(hov) and hov["id"] == candidate["id"] and hov["kind"] == "edge":
            ok_hover_e = True
            break
    record(
        "corr.pick",
        ok_hover_v and ok_pick_v and ok_hover_e,
        f"vertex hover {ok_hover_v} · vertex pick {ok_pick_v} · edge hover {ok_hover_e} ({edges_tried} candidate(s) tried — a depth-contested midpoint yields to the nearer edge honestly) — the projected coords HIT their own entities (the lands-on-drawn proof)",
    )


def drive_d2_marks(page):
    # M2 (SEAL_THE_MARKED_SPECIMEN — THE CARD'S CLOSE) — the CALLOUT RING on
    # the RUNNING app (supersedes the D2 heap census). The face lift is
    # SELECTED (no hover since the correspondence section cleared) — mark
    # presence HERE is the persistence's first half; the census equality
    # against the SELECTED card's rows is the two-register proof. The camera
    # sits at Fit Selected (drive_correspondence ends there) — the margin
    # measurements below read the FITTED framing.
    page.wait_for_timeout(400)
    census = page.evaluate(
        """() => {
      const seam = window.__manuscriptCorrespondence ?? {};
      const rows = new Set([...(seam.rowResultIds ?? []), ...(seam.composedRowIds ?? [])]);
      const marks = [...document.querySelectorAll('.corr-mark')].map((el) => el.getAttribute('data-mark-id'));
      const markSet = new Set(marks);
      const phantom = marks.filter((m) => !rows.has(m));
      const dropped = [...rows].filter((r) => !markSet.has(r));
      // E-HALO-EMPHASIS-ONLY, default half: NO mark wears the paper halo cold
      const haloed = [...document.querySelectorAll('.corr-mark .corr-halo')].filter((el) => {
        const bg = getComputedStyle(el).backgroundColor;
        return bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)';
      }).length;
      return { rows: rows.size, marks: marks.length, phantom: phantom.length, dropped: dropped.length, haloed };
    }"""
    )
    record(
        "ring.census",
        census["rows"] > 0
        and census["marks"] == census["rows"]
        and census["phantom"] == 0
        and census["dropped"] == 0,
        f"{census['marks']} ring marks === {census['rows']} card rows · phantom {census['phantom']} · dropped {census['dropped']}",
    )
    record(
        "ring.haloDefaultZero",
        census["marks"] > 0 and census["haloed"] == 0,
        f"halos on the recessed ring: {census['haloed']}/{census['marks']} (the emphasis state alone wears paper)",
    )
    # ★ E-FIGURE-VISIBLE — the census-overlap-miss cure, measured: every key
    # label BOX sits OUTSIDE the figure's projected disc (L1: the vertex hull
    # bounds the drawn silhouette), and NO two leaders properly cross (L2:
    # each lies on its own bearing ray by construction).
    fig = page.evaluate(
        """() => {
      const seam = window.__manuscriptCorrespondence ?? {};
      return { ring: seam.ring ?? [], figure: seam.figure ?? null };
    }"""
    )
    figure_ok = False
    detail_fig = "no ring/figure seam"
    if fig["figure"] and fig["ring"]:
        cx, cy, radius = fig["figure"]["cx"], fig["figure"]["cy"], fig["figure"]["radiusPx"]
        inside = []
        for m in fig["ring"]:
            dx = max(abs(m["labelX"] - cx) - m["labelW"] / 2, 0)
            dy = max(abs(m["labelY"] - cy) - m["labelH"] / 2, 0)
            if (dx * dx + dy * dy) ** 0.5 <= radius:
                inside.append(m["id"])

        def crosses(a, b):
            # proper segment intersection (shared endpoints don't count)
            def orient(px, py, qx, qy, rx, ry):
                v = (qx - px) * (ry - py) - (qy - py) * (rx - px)
                return 0 if abs(v) < 1e-9 else (1 if v > 0 else -1)

            o1 = orient(a[0], a[1], a[2], a[3], b[0], b[1])
            o2 = orient(a[0], a[1], a[2], a[3], b[2], b[3])
            o3 = orient(b[0], b[1], b[2], b[3], a[0], a[1])
            o4 = orient(b[0], b[1], b[2], b[3], a[2], a[3])
            return o1 != o2 and o3 != o4 and 0 not in (o1, o2, o3, o4)

        segs = [(m["anchorX"], m["anchorY"], m["labelX"], m["labelY"]) for m in fig["ring"]]
        crossings = sum(
            1 for i in range(len(segs)) for j in range(i + 1, len(segs)) if crosses(segs[i], segs[j])
        )
        figure_ok = len(fig["ring"]) == census["marks"] and len(inside) == 0 and crossings == 0
        detail_fig = (
            f"{len(fig['ring'])} labels · inside the silhouette disc: {len(inside)} · "
            f"crossing leaders: {crossings} (figure r={radius:.0f}px)"
        )
    record("ring.figureVisible", figure_ok, detail_fig)
    # E-MARGIN-RESERVED (L3) — at the FITTED framing the figure occupies the
    # non-margin area: projected radius ≤ halfMin/SPECIMEN_FIT_MARGIN (+slack)
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    half_min = min(box["width"], box["height"]) / 2
    margin_ok = False
    detail_margin = "no figure seam"
    if fig["figure"]:
        frac = fig["figure"]["radiusPx"] / half_min
        margin_ok = 0 < frac <= 0.62  # 1/1.8 = 0.556 + measurement slack
        detail_margin = f"figure radius {fig['figure']['radiusPx']:.0f}px = {frac:.2f}·halfMin (≤0.62 — the 1.8 fit reserves the band)"
    record("ring.marginReserved", margin_ok, detail_margin)
    # the ENTITY side of the emphasis: hover a corner vertex (the D1 gesture)
    # → ~3 lit on the seam + the matching CARD ROW bolds
    target = page.evaluate(
        """() => {
      const c = window.__manuscriptCorrespondence ?? {};
      const entries = Object.entries(c.positions ?? {});
      const vertex = entries.find(([id, p]) => id.includes(':vertex:') && id.includes(':tetrahedron:') && p.onScreen);
      return vertex ? { id: vertex[0], x: vertex[1].x, y: vertex[1].y } : null;
    }"""
    )
    emph_ok = False
    row_bold_ok = False
    halo_ok = False
    detail = "no on-screen vertex target"
    if target:
        page.mouse.move(box["x"] + target["x"], box["y"] + target["y"])
        page.wait_for_timeout(450)
        emph = page.evaluate("() => (window.__manuscriptCorrespondence.emphasizedIds ?? [])")
        emph_ok = 2 <= len(emph) <= 4 and target["id"] in emph
        weight = page.evaluate(
            '(id) => { const el = document.querySelector(`[data-row-id="${id}"]`); return el ? getComputedStyle(el).fontWeight : null; }',
            target["id"],
        )
        row_bold_ok = weight in ("700", "bold")
        # E-HALO-EMPHASIS-ONLY, promoted half: the paper halo appears on the
        # PROMOTED marks alone (count === the emphasized ids that own marks)
        halo_state = page.evaluate(
            """(emphIds) => {
      const haloed = [...document.querySelectorAll('.corr-mark')].filter((el) => {
        const glyph = el.querySelector('.corr-halo');
        if (!glyph) return false;
        const bg = getComputedStyle(glyph).backgroundColor;
        return bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)';
      }).map((el) => el.getAttribute('data-mark-id'));
      const markIds = new Set([...document.querySelectorAll('.corr-mark')].map((el) => el.getAttribute('data-mark-id')));
      const promotedWithMarks = emphIds.filter((id) => markIds.has(id));
      return { haloed, promoted: promotedWithMarks };
    }""",
            emph,
        )
        halo_ok = (
            len(halo_state["haloed"]) >= 1
            and sorted(halo_state["haloed"]) == sorted(halo_state["promoted"])
        )
        detail = (
            f"lit {len(emph)} (~3 neighborhood) · the card row fontWeight {weight} · "
            f"halos {len(halo_state['haloed'])} === promoted {len(halo_state['promoted'])}"
        )
        page.mouse.move(box["x"] + box["width"] * 0.06, box["y"] + box["height"] * 0.12)
        page.wait_for_timeout(300)
    record("d2.emphasisEntitySide", emph_ok and row_bold_ok and halo_ok, detail)
    # the ROW side: hover an ENTITY card row (the register rows are M1's —
    # drive_registers walks those) → the seam lights the neighborhood + the
    # MARK bolds (the bidirection's other half)
    row = page.evaluate(
        """() => {
      const el = [...document.querySelectorAll('[data-row-id]')].find(
        (e) => !(e.getAttribute('data-row-id') ?? '').startsWith('register:'),
      );
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { id: el.getAttribute('data-row-id'), x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }"""
    )
    row_ok = False
    mark_lit_ok = False
    detail2 = "no card row div"
    if row:
        page.mouse.move(row["x"], row["y"])
        page.wait_for_timeout(450)
        emph2 = page.evaluate("() => (window.__manuscriptCorrespondence.emphasizedIds ?? [])")
        row_ok = 2 <= len(emph2) <= 4 and row["id"] in emph2
        mark_weight = page.evaluate(
            '(id) => { const el = document.querySelector(`.corr-mark[data-mark-id="${id}"] .corr-halo`); return el ? getComputedStyle(el).fontWeight : null; }',
            row["id"],
        )
        mark_lit_ok = mark_weight in ("700", "bold")
        detail2 = f"lit {len(emph2)} · the mark fontWeight {mark_weight}"
        page.mouse.move(box["x"] + box["width"] * 0.06, box["y"] + box["height"] * 0.5)
        page.wait_for_timeout(300)
    record("d2.emphasisRowSide", row_ok and mark_lit_ok, detail2)


def drive_registers(page):
    # M1 (SEAL_THE_MARKED_SPECIMEN) — REGISTER SUBORDINATION on the RUNNING
    # app: the seam's registers member (the view's RESOLVED state — door, the
    # one full register, the deficit exception, the recessed styles), the
    # FIELD DOOR in the specimen panel, and the §7 card-row promotion.
    page.wait_for_timeout(200)
    regs = page.evaluate("() => (window.__manuscriptCorrespondence ?? {}).registers ?? null")
    # E-SUBORD-ONE-FULL, default half: door CLOSED, ZERO annotation registers
    # full (≤1 holds), the deficit a STATED exception (never receded)
    default_ok = (
        regs is not None
        and regs["door"] is False
        and regs["full"] is None
        and regs["deficit"] == "full-exception"
    )
    record(
        "regs.subordDefault",
        default_ok,
        "no seam.registers"
        if regs is None
        else f"door {regs['door']} · full {regs['full']} · deficit {regs['deficit']} (annotation registers recessed cold)",
    )
    # E-SUBORD-INJECTIVE: the two recessed styles differ on FORM + factor +
    # receded ink (no two registers collapse into one look when recessed)
    injective = False
    detail_inj = "no seam.registers"
    if regs is not None:
        g = regs["recessedStyles"]["generators"]
        f = regs["recessedStyles"]["field"]
        injective = g["form"] != f["form"] and g["widthFactor"] != f["widthFactor"] and g["ink"] != f["ink"]
        detail_inj = (
            f"generators {g['form']}×{g['widthFactor']} {g['ink']} ≠ field {f['form']}×{f['widthFactor']} {f['ink']}"
        )
    record("regs.injective", injective, detail_inj)
    # E-FIELD-DOOR: present in the specimen panel, CLOSED by default; opening
    # promotes the field + recedes the rest; closing returns the quiet band
    door = page.locator('[data-door="field"]')
    present = door.count() == 1
    pressed = door.get_attribute("aria-pressed") if present else None
    record(
        "regs.doorClosedDefault",
        present and pressed == "false",
        f"door present {present} · aria-pressed {pressed} (closed by default)",
    )
    # THE 3-STATE LAW (SEAL_THE_FIELD_DOOR): the door-gated field is ABSENT
    # when closed (a ZERO field-layer census — not drawn at all), FULL when
    # open; the always-present registers stay RECESSED (still drawn).
    field_census = "() => { const s = window.__manuscriptScene; let n = 0; if (s) s.traverse((o) => { if (o.name === 'field-layer') n += 1; }); return n; }"
    deficit_census = "() => { const s = window.__manuscriptScene; let n = 0; if (s) s.traverse((o) => { if (o.name === 'deficit-register') n += 1; }); return n; }"
    closed_field = page.evaluate(field_census)
    closed_deficit = page.evaluate(deficit_census)
    record(
        "regs.fieldAbsentClosed",
        closed_field == 0 and closed_deficit >= 1,
        f"door CLOSED: field-layer census {closed_field} (ABSENT — not drawn) · deficit-register census {closed_deficit} (the always-present registers stay RECESSED, still drawn)",
    )
    # the person-language copy (designer-ruled): mechanics OFF the page
    copy_closed = page.evaluate('() => { const el = document.querySelector(\'[data-door="field"]\'); return el ? (el.textContent ?? "").trim() : null; }')
    door_ok = False
    detail_door = "door missing"
    open_field = -1
    if present:
        door.click()
        page.wait_for_timeout(400)
        opened = page.evaluate("() => (window.__manuscriptCorrespondence ?? {}).registers ?? null")
        door_ok = opened is not None and opened["door"] is True and opened["full"] == "field"
        detail_door = (
            "no seam after open"
            if opened is None
            else f"open: door {opened['door']} · full {opened['full']} (the field promoted, the rest recede)"
        )
        # E-FIELD-SHOWN-OPEN (recut to the honest measurable): opening puts
        # the register in its FULL state; the LAYER draws iff the field
        # PLATES — and MEASURED (finding #3): no leg-reachable specimen's
        # field plates at HEAD (the flat lift/square read degenerate-band;
        # the plated bodies — genus-2, Klein — live behind unreachable
        # flows). The census is REPORTED; the drawn-when-plated law is
        # ratified by diagnose-the-field-in-the-specimen in the suite.
        for _ in range(6):
            open_field = page.evaluate(field_census)
            if open_field >= 1:
                break
            page.wait_for_timeout(300)
        copy_open = page.evaluate('() => { const el = document.querySelector(\'[data-door="field"]\'); return el ? (el.textContent ?? "").trim() : null; }')
        door.click()
        page.wait_for_timeout(300)
        page.mouse.move(0, 0)
        page.wait_for_timeout(200)
        closed = page.evaluate("() => (window.__manuscriptCorrespondence ?? {}).registers ?? null")
        after_field = page.evaluate(field_census)
        door_ok = door_ok and closed is not None and closed["door"] is False and closed["full"] is None
        detail_door += (
            ""
            if closed is None
            else f" · closed: door {closed['door']} · full {closed['full']}"
        )
        record(
            "regs.fieldShownOpen",
            door_ok and after_field == 0 and open_field >= closed_field,
            f"door OPEN: register full='field' (the state law) · field-layer census {open_field} "
            f"(0 = the selected specimen's field is honestly UNPLATED — finding #3; drawn-when-plated rides the standing field witness) · re-closed: {after_field} (absent)",
        )
        memo_words = lambda t: t is not None and ("recessed" in t or "promoted" in t)
        record(
            "regs.doorCopy",
            copy_closed is not None
            and "the field" in copy_closed
            and "show it" in copy_closed
            and copy_open is not None
            and "shown · other marks step back" in copy_open
            and not memo_words(copy_closed)
            and not memo_words(copy_open),
            f"closed: '{copy_closed}' · open: '{copy_open}' (no memo words)",
        )
        # the closest-to-four-register stand-up, measured LIVE: with the door
        # open the plain specimen holds the FIELD SLOT (full state) + DEFICIT
        # (drawn) + KEY (drawn) together; the field's DRAWN presence joins
        # when a plating specimen exists (finding #3) — generators are the
        # other measured gap (b₁=0 on every reachable plain body; §14)
        record(
            "regs.threeRegisterTogether",
            door_ok and closed_deficit >= 1 and page.locator(".corr-mark").count() > 0,
            f"door open (field slot FULL) + deficit-register {closed_deficit} (drawn) + ring marks {page.locator('.corr-mark').count()} (drawn) — the closest stand-up; the field DRAWS when a plating specimen lands (finding #3) · generators = the b₁ gap (§14)",
        )
    else:
        record("regs.fieldShownOpen", False, "door missing")
        record("regs.doorCopy", False, "door missing")
        record("regs.threeRegisterTogether", False, "door missing")
    record("regs.doorPromotesField", door_ok, detail_door)
    # E-PROMOTE-CARDROW (§7): touching a REGISTER row promotes ITS register
    # through the ONE emphasizedIds channel; leaving returns the quiet band.
    # The row is whichever register the SELECTED card actually draws: the
    # generators legend when loops exist (the lifted face is a disk — H₁ = 0,
    # no legend), else a deficit row, else the field door's own hover (the
    # door touches `register:field` on the same channel).
    promote_ok = False
    detail_promote = "no register row on the card"
    target_row = None
    for register in ("generators", "deficit"):
        locator = page.locator(f'[data-row-id="register:{register}"]').first
        if locator.count() > 0:
            target_row = (register, locator, True)
            break
    if target_row is None and present:
        target_row = ("field", door, False)
    if target_row is not None:
        register, locator, is_row_div = target_row
        locator.hover()
        page.wait_for_timeout(300)
        state = page.evaluate(
            """(register) => {
      const seam = window.__manuscriptCorrespondence ?? {};
      const el = document.querySelector(`[data-row-id="register:${register}"]`);
      return {
        full: (seam.registers ?? {}).full ?? null,
        emphasized: seam.emphasizedIds ?? [],
        weight: el ? getComputedStyle(el).fontWeight : null,
      };
    }""",
            register,
        )
        promote_ok = state["full"] == register and state["emphasized"] == [f"register:{register}"]
        # the bold read applies to the card ROW divs (the door is a chip —
        # its pressed/hover state is its own affordance)
        if is_row_div:
            promote_ok = promote_ok and state["weight"] in ("700", "bold")
        detail_promote = (
            f"row register:{register} · full {state['full']} · emphasized {state['emphasized']}"
            + (f" · the row fontWeight {state['weight']}" if is_row_div else " · via the door's hover")
        )
        page.mouse.move(0, 0)
        page.wait_for_timeout(300)
        after = page.evaluate("() => ((window.__manuscriptCorrespondence ?? {}).registers ?? {}).full ?? null")
        promote_ok = promote_ok and after is None
        detail_promote += f" · after leave: full {after}"
    record("regs.promoteCardRow", promote_ok, detail_promote)
    # M3-CLEANUP-2 — the CameraDock is CLEAR of the specimen panel: measured
    # as box disjointness against the FIELD DOOR (the named obstruction — the
    # door must be clickable with the dock in place)
    dock_btn = page.get_by_text("Fit Selected", exact=True).first
    dock_box = dock_btn.bounding_box() if dock_btn.count() > 0 else None
    door_box = door.first.bounding_box() if present else None
    dock_clear = False
    detail_dock = "no dock/door box"
    if dock_box and door_box:
        disjoint = (
            dock_box["x"] + dock_box["width"] < door_box["x"]
            or door_box["x"] + door_box["width"] < dock_box["x"]
            or dock_box["y"] + dock_box["height"] < door_box["y"]
            or door_box["y"] + door_box["height"] < dock_box["y"]
        )
        dock_clear = disjoint
        detail_dock = (
            f"dock x={dock_box['x']:.0f} y={dock_box['y']:.0f} · door x={door_box['x']:.0f} y={door_box['y']:.0f} · disjoint {disjoint}"
        )
    record("regs.dockClearOfDoor", dock_clear, detail_dock)
    # the door/row locators AUTO-SCROLL the page when the card runs below the
    # fold (the 18-row card + the door exceed a 900px viewport — measured:
    # scrollY 697 left every later canvas-coordinate gesture outside the
    # viewport). Restore the page origin for the camera section.
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(200)


def find_dock_chip(page, label):
    # the dock chips are glyph-only 46x46 buttons; hover until the tooltip
    # reads exactly the group label (the find_fold_chip idiom, generalized)
    for b in page.locator("button").all():
        try:
            box = b.bounding_box()
            if not box or abs(box["width"] - 46) > 3 or abs(box["height"] - 46) > 3:
                continue
            b.hover()
            page.wait_for_timeout(140)
            tip = page.locator(f'div:text-is("{label}")')
            if tip.count() > 0 and tip.first.is_visible():
                return b
        except Exception:
            continue
    return None


def ring_state(page):
    # THE RING ANCHOR RESOLVER's seam + DOM read: the verdict, the drawn
    # marks, and any on-card declaration (refusal / unplaced)
    return page.evaluate(
        """() => {
      const seam = window.__manuscriptCorrespondence ?? {};
      const refusal = document.querySelector('[data-ring-refusal]');
      const unplacedEl = document.querySelector('[data-ring-unplaced]');
      return {
        resolution: seam.ringResolution ?? null,
        marks: document.querySelectorAll('.corr-mark').length,
        refusalShown: refusal ? (refusal.textContent ?? '').trim().slice(0, 140) : null,
        unplacedShown: unplacedEl ? (unplacedEl.textContent ?? '').trim().slice(0, 140) : null,
      };
    }"""
    )


def drive_ring_modes(page):
    # THE RING ANCHOR RESOLVER (SEAL_THE_RING_ANCHOR_RESOLVER) — every
    # DRIVEABLE mode renders-or-declares, live: the TORUS + the CYLINDER
    # (immersion — the two bodies Arman found BARE) + the SKELETON (dock cut
    # on the picked face). classBody/bodiless have NO committed gesture
    # producer (measured; the died precedent) — their refusal branches are
    # witnessed at the model (diagnose-argument-card §13) and the deviation
    # is reported. THE SILENT-BARE GUARD rides every record: anchored ⇒
    # marks > 0; refused ⇒ the card's open declaration present.
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    # the sections before this end at Fit Selected (zoomed IN on the lift
    # face) — reset to the composed default so the paper-point scan sees the
    # whole sheet, not one body filling the frame
    reset_button = page.get_by_text("Reset Camera", exact=True)
    if reset_button.count() > 0:
        reset_button.first.click()
        page.wait_for_timeout(600)

    def invoke_square(side):
        # find_paper_point guarantees the CANVAS element, not EMPTY paper — a
        # right-click on a drawn form opens the FormOpsMenu, not the invoke
        # palette (the measured flake). VERIFY the palette opened; otherwise
        # walk to the next candidate (a new right-click re-points the menu).
        xs = [0.12, 0.2, 0.3, 0.42] if side == "left" else [0.88, 0.8, 0.7, 0.58]
        other_xs = [0.88, 0.8, 0.7, 0.58] if side == "left" else [0.12, 0.2, 0.3, 0.42]
        ys = [0.62, 0.68, 0.56, 0.74, 0.5, 0.44, 0.8, 0.36, 0.3, 0.86]
        for fx in xs + other_xs:
            for fy in ys:
                x = box["x"] + box["width"] * fx
                y = box["y"] + box["height"] * fy
                tag = page.evaluate(
                    "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                    [x, y],
                )
                if tag != "CANVAS":
                    continue
                canvas.click(button="right", position={"x": box["width"] * fx, "y": box["height"] * fy})
                page.wait_for_timeout(300)
                item = page.locator('text="Square"')
                if page.locator("text=invoke — real material").count() > 0 and item.count() > 0:
                    item.first.click()
                    page.wait_for_timeout(600)
                    return None
        return "no EMPTY paper point opened the invoke palette"

    def glue_variant(variant_text):
        chip = find_dock_chip(page, "glue")
        if chip is None:
            return "the glue chip was not found by its hover label"
        chip.click()
        page.wait_for_timeout(250)
        variant = page.locator(f"text={variant_text}")
        if variant.count() == 0:
            return f"the flyout shows no '{variant_text}' variant"
        variant.first.click()
        page.wait_for_timeout(1000)
        return None

    def judge(record_name, tag, want_mode):
        s = ring_state(page)
        r = s["resolution"]
        anchored_ok = (
            r is not None
            and r["kind"] == "anchored"
            and r["mode"] == want_mode
            and r["unplaced"] == 0
            and r["anchored"] is not None
            and s["marks"] == r["anchored"]
            and s["marks"] > 0
        )
        record(
            record_name,
            anchored_ok,
            f"{tag}: kind={None if not r else r['kind']} mode={None if not r else r['mode']} "
            f"anchored={None if not r else r['anchored']} · marks {s['marks']} · unplaced {None if not r else r['unplaced']} "
            f"(a silent bare — no marks AND no declaration — is the RED)",
        )

    # TORUS (immersion, closed)
    step = invoke_square("left") or glue_variant("Torus (abAB)")
    if step is None:
        judge("ring.modeTorus", "torus", "immersion")
    else:
        record("ring.modeTorus", False, f"could not drive the torus: {step}")
    # CYLINDER (immersion, BOUNDED — the same map, no special case)
    step = invoke_square("right") or glue_variant("Cylinder (single pair)")
    if step is None:
        judge("ring.modeCylinder", "cylinder", "immersion")
    else:
        record("ring.modeCylinder", False, f"could not drive the cylinder: {step}")
    # SKELETON (dock cut): a ONE-face form auto-passes its only face
    # (operationContextFor:206 — "not a choice"); the pick panel exists only
    # for multi-face forms, so try it when present and cut either way
    step = invoke_square("left")
    if step is None:
        face_row = page.locator("text=· 4 corners").first
        if face_row.count() > 0:
            face_row.click()
            page.wait_for_timeout(250)
        chip = find_dock_chip(page, "cut")
        step = None if chip is not None else "the cut chip was not found by its hover label"
        if chip is not None:
            chip.click()
            page.wait_for_timeout(1000)
    if step is None:
        judge("ring.modeSkeleton", "skeleton", "skeleton")
    else:
        record("ring.modeSkeleton", False, f"could not drive the skeleton: {step}")
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(150)


def drive_identify(page):
    # THE REFINED IDENTIFY GESTURE (SEAL_THE_IDENTIFY_GESTURE) — the app-path
    # ratification: pick a VERTEX target (discrete — never click-proximity),
    # watch the COMPUTED preview name the surface, re-tap to move the tail and
    # watch the word FLIP (band↔twist — only a real computation can do this),
    # and the commit STATES its result.
    canvas = page.locator("canvas").first
    box = canvas.bounding_box()
    reset_button = page.get_by_text("Reset Camera", exact=True)
    if reset_button.count() > 0:
        reset_button.first.click()
        page.wait_for_timeout(600)
    # a fresh square (the palette-verified invoke — the ring-modes machinery)
    invoked = False
    xs = [0.12, 0.2, 0.3, 0.42, 0.88, 0.8, 0.7, 0.58]
    ys = [0.62, 0.68, 0.56, 0.74, 0.5, 0.44, 0.8, 0.36, 0.3, 0.86]
    for fx in xs:
        if invoked:
            break
        for fy in ys:
            x = box["x"] + box["width"] * fx
            y = box["y"] + box["height"] * fy
            tag = page.evaluate(
                "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                [x, y],
            )
            if tag != "CANVAS":
                continue
            canvas.click(button="right", position={"x": box["width"] * fx, "y": box["height"] * fy})
            page.wait_for_timeout(300)
            item = page.locator('text="Square"')
            if page.locator("text=invoke — real material").count() > 0 and item.count() > 0:
                item.first.click()
                page.wait_for_timeout(600)
                invoked = True
                break
    if not invoked:
        record("identify.drive", False, "no empty paper point opened the invoke palette")
        return
    # open the trace panel via the identify chip (aria-label, chrome-local)
    chip = page.locator('button[aria-label="identify"]')
    if chip.count() == 0:
        record("identify.drive", False, "no identify chip")
        return
    chip.first.click()
    page.wait_for_timeout(400)
    record(
        "identify.panelOpens",
        page.get_by_text("identify — trace two walks", exact=False).count() > 0,
        "the trace panel opens from the identify chip",
    )
    # the DISCRETE vertex targets ride the PER-FRAME seam (the D1 idiom —
    # R3F's own camera/size space; a one-shot manual projection RACED the C1
    # select-flight and missed, measured). SETTLE LOOP: wait until a target
    # is ON-screen and stable (<3px over 400ms) — the flight's length varies
    # with the sheet; then FRESH-read each target immediately before its tap.
    seam_targets = None
    stable = False
    for _ in range(20):
        seam_targets = page.evaluate("() => (window.__manuscriptCorrespondence ?? {}).traceTargets ?? null")
        if seam_targets:
            probe_name = sorted(seam_targets.keys())[0]
            t1 = seam_targets[probe_name]
            page.wait_for_timeout(400)
            t2 = page.evaluate(
                "(n) => ((window.__manuscriptCorrespondence ?? {}).traceTargets ?? {})[n] ?? null", probe_name
            )
            if t1 and t2 and t2.get("on") and abs(t2["x"] - t1["x"]) < 3 and abs(t2["y"] - t1["y"]) < 3:
                stable = True
                seam_targets = page.evaluate("() => (window.__manuscriptCorrespondence ?? {}).traceTargets ?? null")
                break
        else:
            page.wait_for_timeout(400)
    if not seam_targets or not stable:
        record("identify.drive", False, "the trace targets never settled on-screen (the C1 flight)")
        return
    by_edge = {}
    for name in seam_targets:
        parts = name.split(":")
        by_edge.setdefault(":".join(parts[1:-1]), []).append(name)
    edges = [e for e, ns in by_edge.items() if len(ns) == 2]

    def tap_until(candidate_names, expect_text):
        # the crowded sheet: a neighbour body can OCCLUDE a specific target
        # from this attitude (the raycast honestly hits the nearer form) —
        # try candidates until the PANEL reflects the walk (the corr.pick
        # candidate-retry idiom); fresh-read each target before its tap
        for name in candidate_names:
            t = page.evaluate(
                "(n) => ((window.__manuscriptCorrespondence ?? {}).traceTargets ?? {})[n] ?? null", name
            )
            if not t or not t.get("on"):
                continue
            page.mouse.click(box["x"] + t["x"], box["y"] + t["y"])
            page.wait_for_timeout(400)
            if page.get_by_text(expect_text, exact=False).count() > 0:
                return name
        return None

    # G1 — walk A: a discrete vertex target, candidate-retried until A: 1
    hit_a = tap_until([n for e in edges for n in by_edge[e]], "A: 1")
    if hit_a is None:
        record("identify.drive", False, "no vertex target registered walk A (all candidates occluded?)")
        return
    edge_a = ":".join(hit_a.split(":")[1:-1])
    walk_b = page.get_by_text("→ trace walk B", exact=False).first
    if not walk_b.is_enabled():
        record("identify.drive", False, "walk A registered but the phase button stayed disabled")
        return
    walk_b.click()
    page.wait_for_timeout(250)
    # walk B: a DISJOINT edge (no shared corner — min target distance), the
    # same candidate retry until B: 1
    b_candidates = []
    for e in edges:
        if e == edge_a:
            continue
        a_pts = [seam_targets[n] for n in by_edge[edge_a]]
        b_pts = [seam_targets[n] for n in by_edge[e]]
        dmin = min(((p["x"] - q["x"]) ** 2 + (p["y"] - q["y"]) ** 2) ** 0.5 for p in a_pts for q in b_pts)
        if dmin > 30:
            b_candidates.extend(by_edge[e])
    hit_b = tap_until(b_candidates, "B: 1")
    if hit_b is None:
        record("identify.drive", False, "no disjoint vertex target registered walk B")
        return
    preview1 = page.evaluate(
        "() => { const el = document.querySelector('[data-identify-preview]'); return el ? (el.textContent ?? '') : null; }"
    )
    word1 = "band" if (preview1 and "band" in preview1.split("start")[0]) else ("twist" if preview1 else None)
    record(
        "identify.previewComputed",
        preview1 is not None and word1 in ("band", "twist") and "start either edge from its other end" in preview1,
        f"preview: '{(preview1 or '')[:120]}' → word {word1} (computed via the frozen op; the counterfactual rides)",
    )
    # G3 + G4 — THE FLIP: re-tap the A-edge (either target — the tail moves)
    # → the COMPUTED word must flip (band↔twist); only a real computation
    # flips. Candidate-retry with WORD verification (an occluded target's
    # tap is a no-op — the word not changing tells us to try the other end).
    word2 = None
    for name in by_edge[edge_a]:
        t = page.evaluate(
            "(n) => ((window.__manuscriptCorrespondence ?? {}).traceTargets ?? {})[n] ?? null", name
        )
        if not t or not t.get("on"):
            continue
        page.mouse.click(box["x"] + t["x"], box["y"] + t["y"])
        page.wait_for_timeout(450)
        p2 = page.evaluate(
            "() => { const el = document.querySelector('[data-identify-preview]'); return el ? (el.textContent ?? '') : null; }"
        )
        w2 = "band" if (p2 and "band" in p2.split("start")[0]) else ("twist" if p2 else None)
        if w2 is not None and w2 != word1:
            word2 = w2
            break
    record(
        "identify.flipFlipsPreview",
        word1 is not None and word2 is not None and word1 != word2,
        f"tail re-tap: {word1} → {word2} (the trace change flips the computed surface — the hidden control is now a visible, discrete choice)",
    )
    # G6 — the commit STATES the result (matches the current computed word)
    commit_text = page.evaluate(
        "() => { const els = [...document.querySelectorAll('button')]; const b = els.find((e) => (e.textContent ?? '').includes('confirm — sew')); return b ? (b.textContent ?? '').trim() : null; }"
    )
    record(
        "identify.commitStates",
        commit_text is not None and word2 is not None and f"into a {word2}" in commit_text,
        f"commit label: '{commit_text}' (states the computed result)",
    )
    # the commit lands: the panel closes on success (the born identifies)
    page.evaluate(
        "() => { const els = [...document.querySelectorAll('button')]; const b = els.find((e) => (e.textContent ?? '').includes('confirm — sew')); if (b) b.click(); }"
    )
    page.wait_for_timeout(900)
    record(
        "identify.commitLands",
        page.get_by_text("identify — trace two walks", exact=False).count() == 0,
        "the panel closed — the identification committed (the born form rides the sheet)",
    )
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(150)


def project_group_center(page, name_prefix, last=False):
    # project a named scene group's world origin to CSS pixels via the app's
    # OWN camera/size (the proven seam idiom — never a hand projection).
    # last=True takes the NEWEST matching group (the latest built room).
    return page.evaluate(
        """([prefix, takeLast]) => {
      const scene = window.__manuscriptScene, camera = window.__manuscriptCamera;
      if (!scene || !camera) return null;
      let target = null;
      scene.traverse((o) => { if (o.name && o.name.startsWith(prefix)) { if (takeLast || !target) target = o; } });
      if (!target) return null;
      target.updateWorldMatrix(true, false);
      const v = new target.position.constructor();
      target.getWorldPosition(v);
      v.project(camera);
      const canvas = document.querySelector('canvas');
      const r = canvas.getBoundingClientRect();
      return { x: r.x + ((v.x + 1) / 2) * r.width, y: r.y + ((1 - v.y) / 2) * r.height, ndcZ: v.z };
    }""",
        [name_prefix, last],
    )


def explore_seam(page):
    # the GPU window's seam (the CPU-era counts/deltas retired with the tracer)
    return page.evaluate(
        """() => {
      const s = window.__exploreWindow;
      if (!s) return null;
      return { open: s.open, title: s.title, gpu: s.gpu, eye: s.eye, forward: s.forward,
               doors: s.doors, frameHanded: s.frameHanded, settle: s.settle,
               renderFrames: s.renderFrames, looks: s.looks, advances: s.advances,
               caption: s.caption, rodK: s.rodK, walls: s.walls };
    }"""
    )


def select_dim3(page, group_prefix, expect_fit=True, last=False):
    # ARMAN'S LAW: summon is a DOUBLE-CLICK; project the room's own group
    page.evaluate("() => window.scrollTo(0, 0)")
    pt = project_group_center(page, group_prefix, last=last)
    if pt is None:
        return False
    page.mouse.dblclick(pt["x"], pt["y"])
    page.wait_for_timeout(1200)  # the C1 select flight settles
    if not expect_fit:
        return True
    fit = page.get_by_text("Fit Selected", exact=True)
    return fit.count() > 0


def drive_explore(page):
    # RUNG 1 — THE EXPLORE WINDOW (FAT CHARTER 2026-08-07): doorway → rest
    # recurrence → look → advance (the eye carried through a paired face by
    # the engine's own isometry — measured seamless) → horizon caption →
    # close → shell intact; then the THRESHOLD on a person-built cone room
    # and a folded body — the door refuses BY NAME, the window never opens.
    page.keyboard.press("Escape")
    page.wait_for_timeout(250)
    page.keyboard.press("Escape")
    page.wait_for_timeout(250)

    # ---- the shell's own caption, captured COLD (deselected): the selected
    # shape's row label leaves the DOM (`hidden={selected === id}` — the card
    # takes over), so the byte-equal comparison brackets the WHOLE journey:
    # capture before the summon, compare after everything, deselected again
    capture_t3_caption = """() => {
      const nodes = [...document.querySelectorAll('div,span')].filter((n) => n.textContent.includes('E³ · n=[4,4,4]'));
      if (nodes.length === 0) return null;
      nodes.sort((a, b) => a.textContent.length - b.textContent.length);
      return nodes[0].textContent;
    }"""
    shell_caption_before = page.evaluate(capture_t3_caption)
    record("explore.shellCaption", bool(shell_caption_before), f"cold shell caption: {str(shell_caption_before)[:120]}")

    selected = select_dim3(page, "written:dim3:t3")
    record("explore.selectT3", selected, "double-click summons the three-torus room")
    if not selected:
        return

    # ---- E-DOORWAY: the dock chip opens the window; the shell stays operable
    chip = page.locator('button[aria-label="explore inside"]')
    record("explore.chipPresent", chip.count() > 0, "the doorway chip rides the dock")
    chip.first.click()
    page.wait_for_timeout(400)
    window_open = page.locator("[data-explore-window]").count() > 0
    title_ok = page.get_by_text("T³ — identified cube", exact=False).count() > 0
    fit_enabled = page.get_by_text("Fit Selected", exact=True).count() > 0
    card_behind = page.get_by_text("on select", exact=True).count() > 0
    record(
        "explore.doorwayOpens",
        window_open and title_ok,
        f"window {window_open} · titled {title_ok}",
    )
    record(
        "explore.shellOperableBehind",
        fit_enabled and card_behind,
        f"Fit present {fit_enabled} · the specimen card still stands behind the window {card_behind}",
    )
    if not window_open:
        return

    # ---- E-GPU: the shader is up and rendering; the caption carries depth --
    try:
        page.wait_for_function(
            "() => window.__exploreWindow && window.__exploreWindow.gpu && window.__exploreWindow.renderFrames > 3",
            timeout=20000,
        )
    except Exception:
        pass
    seam = explore_seam(page)
    frames0 = seam["renderFrames"] if seam else 0
    page.wait_for_timeout(700)
    seam = explore_seam(page)
    record(
        "explore.gpuUp",
        bool(seam) and seam["gpu"] and seam["renderFrames"] > frames0,
        f"webgl2 program linked {seam and seam['gpu']} · frames {frames0}→{seam and seam['renderFrames']} (the render loop lives)",
    )
    # C5 (Part A): the flat T³ SAYS it is flat — an explicit reading, never
    # silence on cone edges
    caption_ok = bool(
        seam
        and seam["caption"]
        and "copies shown to depth" in seam["caption"]
        and "flat · no cone edges" in seam["caption"]
    )
    record(
        "explore.horizonCaption",
        caption_ok,
        f"caption: {seam and seam['caption']}",
    )

    # ---- E-DRIVEABLE: look (drag rotates forward) --------------------------
    canvas = page.locator("[data-explore-canvas]")
    box = canvas.bounding_box()
    cx = box["x"] + box["width"] * 0.5
    cy = box["y"] + box["height"] * 0.5
    fwd_before = seam["forward"]
    # the drag is DOM-dispatched in ONE task through the app's real handler
    # chain (pointerdown → 12 moves → pointerup on the canvas). CDP injection
    # cannot express a drag here: under software rendering each CDP dispatch
    # serializes at ~a frame (~3.5 s measured, twice) — the whole "drag"
    # stretched past 150 s of INPUT time, so the hold timer lawfully claimed
    # it and walked 31-37 doors. Same-task dispatch carries honest timestamps
    # (< the 260 ms hold window); the app-side law being witnessed — slop,
    # the mode lock, the rotation, the seam counts — is identical.
    page.evaluate(
        """() => {
      const c = document.querySelector('[data-explore-canvas]');
      const r = c.getBoundingClientRect();
      const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      const fire = (type, x, y) => c.dispatchEvent(new PointerEvent(type, {
        pointerId: 7, bubbles: true, cancelable: true, clientX: x, clientY: y, isPrimary: true,
      }));
      fire('pointerdown', cx, cy);
      for (let i = 1; i <= 12; i += 1) fire('pointermove', cx + i * 10, cy + i * 2);
      fire('pointerup', cx + 120, cy + 24);
    }"""
    )
    # wait on the STATE, not the clock: under machine contention the pointer
    # events process late — the turn lands when the main thread frees
    dot = 1.0
    for _ in range(24):
        seam = explore_seam(page)
        dot = sum(a * b for a, b in zip(fwd_before, seam["forward"]))
        if dot < 0.995:
            break
        page.wait_for_timeout(250)
    record(
        "explore.lookTurns",
        seam["looks"] >= 1 and dot < 0.999,
        f"forward turned (dot {round(dot, 4)}) · looks {seam['looks']} · renderFrames {seam['renderFrames']}",
    )

    # ---- E-DRIVEABLE + E-NO-CROSSING: advance; the crossing is seamless ----
    eye_before = seam["eye"]
    doors_before = seam["doors"]
    # who actually receives input at the gesture point and at the close
    # button? (runs 5-6: the CDP down never engaged and the close click hung
    # on actionability — name the coverer instead of guessing)
    hit = page.evaluate(
        """([x, y]) => {
      const at = (px, py) => {
        const el = document.elementFromPoint(px, py);
        return el ? `${el.tagName}${el.dataset ? JSON.stringify({...el.dataset}) : ''}.${String(el.className).slice(0, 60)}` : 'NULL';
      };
      const btn = document.querySelector('button[aria-label="close — return to the shell"]');
      const b = btn ? btn.getBoundingClientRect() : null;
      return { center: at(x, y), close: b ? at(b.x + b.width / 2, b.y + b.height / 2) : 'NO BUTTON' };
    }""",
        [cx, cy],
    )
    record("explore.hitProbe", True, f"at canvas center: {hit['center']} · at close button: {hit['close']}")
    adv_before = seam["advances"]
    page.mouse.move(cx, cy)
    page.mouse.down()
    # THE ENGAGE FENCE: under the starved renderer both discrete events (the
    # down, then the up 6 s later by the wall) can queue behind ONE
    # multi-second stall and deliver back-to-back — the hold collapses in
    # delivery time, the 260 ms timer never fires, and the canvas keeps real
    # pointer capture, which then starves the close click's hit test (runs
    # 5-6). Wait on the STATE — the seam says the press engaged — before
    # counting the held seconds; the evaluate itself fences the down's
    # delivery. Then the cell spans [-1,1]³: at 0.45 u/s the first paired
    # face along forward fires within the held five seconds.
    engaged = True
    try:
        page.wait_for_function(
            f"() => window.__exploreWindow && window.__exploreWindow.advances > {adv_before}",
            timeout=20000,
        )
    except Exception:
        engaged = False
    record("explore.holdEngaged", engaged, "the press engaged (seam.advances incremented) before the held seconds count")
    page.wait_for_timeout(5000)
    page.mouse.up()
    page.wait_for_timeout(400)
    seam = explore_seam(page)
    eye_after = seam["eye"]
    moved = sum((a - b) ** 2 for a, b in zip(eye_before, eye_after)) ** 0.5
    doors_n = seam["doors"] - doors_before
    record(
        "explore.advanceWalks",
        seam["advances"] > adv_before and doors_n >= 1,
        f"eye moved {round(moved, 3)} in-chart · doors {doors_before}→{seam['doors']} (the walk TRANSPORTED — the carried frame went through) · advances {adv_before}→{seam['advances']}",
    )
    # a plate for the eyes: the T³ window as the shader draws it. A viewport
    # CLIP, not an element screenshot — the canvas invalidates every frame and
    # the element capture's stability wait times out under software rendering
    # (run 3 lost both plates to a swallowed except)
    try:
        pbox = page.locator("[data-explore-window]").bounding_box()
        page.screenshot(path=str(__import__('pathlib').Path(__file__).parent / "gpu_t3_window.png"), clip=pbox)
        record("explore.t3Plate", True, "gpu_t3_window.png captured")
    except Exception as err:
        record("explore.t3Plate", False, f"the T³ plate failed to capture: {err}")

    # ---- E-SHELL-INTACT: close returns to the untouched shell --------------
    # a delivery pump before the click: under contention the renderer's input
    # queue can hold an undelivered pointer event whose capture starves the
    # click's hit test (the engage-fence class of flake — seen once at this
    # previously-green step); an evaluate forces the queue through first
    page.evaluate("() => 0")
    page.wait_for_timeout(400)
    page.get_by_text("close — return to the shell", exact=True).click()
    page.wait_for_timeout(500)
    window_gone = page.locator("[data-explore-window]").count() == 0
    fit_still = page.get_by_text("Fit Selected", exact=True).count() > 0
    # (the caption comparison lands at the END of the drive, deselected —
    # the selected row's label is honestly absent from the DOM)

    # ---- the CARD doorway + the Esc law ------------------------------------
    card_door = page.locator("[data-explore-door] button")
    record("explore.cardDoorPresent", card_door.count() > 0, "the card's own doorway row (the charter's card-frame site)")
    if card_door.count() > 0:
        card_door.first.click()
        page.wait_for_timeout(400)
        reopened = page.locator("[data-explore-window]").count() > 0
        page.keyboard.press("Escape")
        page.wait_for_timeout(400)
        esc_closed = page.locator("[data-explore-window]").count() == 0
        still_selected = page.get_by_text("Fit Selected", exact=True).count() > 0
        record(
            "explore.cardDoorAndEsc",
            reopened and esc_closed and still_selected,
            f"card door opens {reopened} · esc closes the window ALONE {esc_closed} · selection survives {still_selected}",
        )

    # ---- THE DOOR LAW (GPU reset): an OPEN-PAIR room refuses; a fully
    # paired room OPENS — flat AND cone alike (Amdt 10) ---------------------
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    page.get_by_text("aperture — build a 3-manifold", exact=True).click()
    page.wait_for_timeout(400)
    panel_up = page.get_by_text("the aperture — build a 3-manifold", exact=False).count() > 0
    record("explore.aperturePanel", panel_up, "the build panel opens")
    if panel_up:
        # the panel's OWN selects (never Leva's hidden ones): the face pickers
        # carry the cube face ids as option values
        # anchor on a face NEITHER build ever picks ('back'): it stays in
        # EVERY face select's option list throughout, so nth(0)/nth(1) are
        # row 1's A/B by DOM order (a picked face drops out of the OTHER
        # selects' choices — run 2's timeout, cured)
        face_selects = page.locator('select:has(option[value="face:cube:back"])')
        # pair 1: left ~ right, the FLAT map (one glued pair ⇒ a bounded
        # Euclidean cone-manifold — measured in grounding, kind !== E3)
        face_selects.nth(0).select_option("face:cube:left")
        page.wait_for_timeout(200)
        face_selects.nth(1).select_option("face:cube:right")
        page.wait_for_timeout(400)
        page.evaluate(
            """() => {
          const maps = [...document.querySelectorAll('select')].find(
            (s) => [...s.options].some((o) => /^d[+-]/.test(o.value)));
          if (maps && maps.options.length > 1) {
            maps.value = maps.options[1].value;
            maps.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }"""
        )
        page.wait_for_timeout(300)
        page.get_by_text("glue — the S² gate judges", exact=True).click()
        page.wait_for_timeout(1500)
        cone_built = select_dim3(page, "written:dim3:built-")
        record("explore.openPairRoomBuilt", cone_built, "one glued pair — the bounded room joins the dim-3 band")
        if cone_built:
            # THE DOOR-FEED partial: the bounded body OPENS now (the
            # researcher's precedent — a legal partial pairing is a room);
            # its four unpaired faces render as WALLS and the caption says
            # where the manifold ends. The old refusal is RETIRED.
            page.locator('button[aria-label="explore inside"]').first.click()
            page.wait_for_timeout(600)
            window_open_b = page.locator("[data-explore-window]").count() > 0
            try:
                page.wait_for_function(
                    "() => window.__exploreWindow && window.__exploreWindow.gpu && window.__exploreWindow.renderFrames > 3",
                    timeout=15000,
                )
            except Exception:
                pass
            seam = explore_seam(page)
            b_caption = (seam and seam["caption"]) or ""
            record(
                "explore.boundedRoomOpens",
                window_open_b and bool(seam) and seam["gpu"] and seam["walls"] == 4
                and "the manifold ends here" in b_caption
                and page.locator("[data-explore-refusal]").count() == 0,
                f"the bounded room OPENS: window {window_open_b} · gpu {seam and seam['gpu']} · walls {seam and seam['walls']} (the four open faces) · caption: {b_caption[:110]}",
            )
            page.keyboard.press("Escape")
            page.wait_for_timeout(300)
        # ---- ★ THE CONE OPENS (the GPU reset's new law): a fully-paired
        # room with k≠4 classes — keys d-1 · d+2 · d+3 on the three face
        # pairs give a SOUND Euclidean cone-manifold (2 × 180°, measured in
        # grounding; rodK carries 2s the shader draws HEAVY) ----------------
        if page.get_by_text("the aperture — build a 3-manifold", exact=True).count() == 0:
            page.get_by_text("aperture — build a 3-manifold", exact=True).click()
        page.wait_for_timeout(400)
        # anchor on a face picked LAST ('top'): every face select lists the
        # unused faces, so the anchor matches all six pickers in DOM order
        # until the final pick consumes it
        fsel = page.locator('select:has(option[value="face:cube:top"])')
        for idx, face in [(0, "face:cube:left"), (1, "face:cube:right"), (2, "face:cube:front"), (3, "face:cube:back"), (4, "face:cube:bottom"), (5, "face:cube:top")]:
            fsel.nth(idx).select_option(face)
            page.wait_for_timeout(150)
        page.evaluate(
            """() => {
          const maps = [...document.querySelectorAll('select')].filter(
            (s) => [...s.options].some((o) => /^d[+-]/.test(o.value)));
          const want = ['d-1', 'd+2', 'd+3'];
          maps.forEach((m, i) => {
            if ([...m.options].some((o) => o.value === want[i])) {
              m.value = want[i];
              m.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });
        }"""
        )
        page.wait_for_timeout(300)
        page.get_by_text("glue — the S² gate judges", exact=True).click()
        page.wait_for_timeout(1500)
        page.get_by_text("close the aperture gate", exact=True).click()
        page.wait_for_timeout(300)
        cone3_built = select_dim3(page, "written:dim3:built-", last=True)
        record("explore.coneFormBuilt", cone3_built, "the fully-paired cone form (d-1 · d+2 · d+3) joins the dim-3 band")
        if cone3_built:
            page.locator('button[aria-label="explore inside"]').first.click()
            page.wait_for_timeout(600)
            window_open_cone = page.locator("[data-explore-window]").count() > 0
            try:
                page.wait_for_function(
                    "() => window.__exploreWindow && window.__exploreWindow.gpu && window.__exploreWindow.renderFrames > 3",
                    timeout=15000,
                )
            except Exception:
                pass
            seam = explore_seam(page)
            rod_k = (seam and seam["rodK"]) or []
            cone_caption = (seam and seam["caption"]) or ""
            record(
                "explore.coneOpens",
                window_open_cone and bool(seam) and seam["gpu"] and any(k != 4 for k in rod_k)
                and "cone edges" in cone_caption and "flat" not in cone_caption,
                f"the cone form OPENS: window {window_open_cone} · gpu {seam and seam['gpu']} · rodK {rod_k} (k≠4 rods ride the shader HEAVY) · caption names the cone edges, never 'flat': {cone_caption[:80]}",
            )
            try:
                pbox = page.locator("[data-explore-window]").bounding_box()
                page.screenshot(path=str(__import__('pathlib').Path(__file__).parent / "gpu_cone_window.png"), clip=pbox)
                record("explore.conePlate", True, "gpu_cone_window.png captured")
            except Exception as err:
                record("explore.conePlate", False, f"the cone plate failed to capture: {err}")
            page.keyboard.press("Escape")
            page.wait_for_timeout(300)
    # ---- ★ THE DOOR-FEED partial: the PRISM room by the person's own hands —
    # invoke Pentagon + Segment → thicken (the 8th word FEEDS the aperture
    # seed) → pair the two pentagon ends → glue → OPEN: 5 boundary WALLS +
    # the honest caption. Runs LAST: the thicken re-seeds the panel.
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    try:
        # SEGMENT first, PENTAGON second: the invoke AUTO-SELECTS, so the
        # shape operand ends selected with no body-click needed
        for label in ["Segment", "Pentagon"]:
            page.mouse.click(120, 780, button="right")
            page.wait_for_timeout(400)
            if page.locator("text=invoke — real material").count() == 0:
                page.mouse.click(200, 820, button="right")
                page.wait_for_timeout(400)
            page.locator(f'text="{label}"').first.click()
            page.wait_for_timeout(900)
        newest = page.evaluate(
            """() => {
          const scene = window.__manuscriptScene;
          if (!scene) return [];
          const names = [];
          scene.traverse((o) => { if (o.name && o.name.startsWith('written:w')) names.push(o.name); });
          return names.slice(-2);
        }"""
        )
        seg_name = newest[0] if len(newest) == 2 else None
        pent_ok = False
        if seg_name:
            # bring the selected pentagon's row on-screen, then PAN (the
            # committed middle-drag — translates, no rotation) until the
            # segment projects inside the viewport; invoked forms settle
            # into the written row OFF the default framing (measured)
            page.get_by_text("Fit Selected", exact=True).click()
            page.wait_for_timeout(1200)
            sp = project_group_center(page, seg_name)
            for _ in range(6):
                if sp and 20 < sp["x"] < 1480 and 20 < sp["y"] < 860:
                    break
                dy = -180 if (sp and sp["y"] > 860) else 180
                dx = -160 if (sp and sp["x"] > 1480) else (160 if (sp and sp["x"] < 20) else 0)
                page.mouse.move(750, 470)
                page.mouse.down(button="middle")
                page.mouse.move(750 + dx, 470 + dy, steps=8)
                page.mouse.up(button="middle")
                page.wait_for_timeout(450)
                sp = project_group_center(page, seg_name)
            if not sp or not (0 < sp["x"] < 1500 and 0 < sp["y"] < 940):
                raise RuntimeError(f"the segment never entered the viewport ({sp})")
            page.keyboard.down("Shift")
            page.mouse.click(sp["x"], sp["y"])
            page.keyboard.up("Shift")
            page.wait_for_timeout(400)
            chip = find_dock_chip(page, "thicken")
            if chip is None:
                raise RuntimeError("the thicken dock chip was not found by its hover label")
            chip.click()
            page.wait_for_timeout(400)
            page.get_by_text("thicken — the band", exact=True).click()
            page.wait_for_timeout(900)
            pent_ok = True
        # the FEED's witness is the PANEL'S OWN CONTENT: the aperture menus
        # now list the PRODUCT's faces (stronger than any notice text).
        # scrollTo(0,0) first — earlier DOM locators may have auto-scrolled
        # the page, displacing the absolute-positioned panel from raw mouse
        # coordinates (the drive_camera precaution, same reason)
        page.evaluate("() => window.scrollTo(0, 0)")
        page.wait_for_timeout(200)
        page.get_by_text("aperture — build a 3-manifold", exact=False).click()
        page.wait_for_timeout(500)
        end_ids = page.evaluate(
            """() => {
          const sels = [...document.querySelectorAll('select')];
          for (const s of sels) {
            const ends = [...s.options].map((o) => o.value).filter((v) => /5-gon:0@[01]$/.test(v));
            if (ends.length >= 2) return ends.sort();
          }
          return [];
        }"""
        )
        record(
            "explore.thickenFeedsAperture",
            pent_ok and len(end_ids) == 2,
            f"the 8th word FED its single-cell product as the aperture seed — the panel lists the prism's own end faces: {[e[-14:] for e in end_ids]}",
        )
        prism_room_built = False
        if len(end_ids) == 2:
            fsel = page.locator(f'select:has(option[value="{end_ids[1]}"])')
            fsel.nth(0).select_option(end_ids[0])
            page.wait_for_timeout(250)
            fsel.nth(1).select_option(end_ids[1])
            page.wait_for_timeout(500)
            page.evaluate(
                """() => {
              const maps = [...document.querySelectorAll('select')].find(
                (s) => [...s.options].some((o) => /^d[+-]/.test(o.value)));
              if (maps) {
                maps.value = 'd+0';
                maps.dispatchEvent(new Event('change', { bubbles: true }));
              }
            }"""
            )
            page.wait_for_timeout(300)
            pre_glue = page.evaluate(
                """() => {
              const n = [...document.querySelectorAll('div')].filter((x) => x.textContent.includes('pick the identification') || x.textContent.includes('pairs exactly once') || x.textContent.includes('pick at least one pair'));
              n.sort((a, b) => a.textContent.length - b.textContent.length);
              return n[0] ? n[0].textContent.slice(0, 140) : 'no refusal';
            }"""
            )
            record("explore.prismPanelState", True, f"pre-glue panel refusal line: {pre_glue}")
            # DOM-dispatch: the glue button's person-clickability is already
            # witnessed by the cone build's REAL click earlier in this same
            # run; here the busier page starves Playwright's actionability
            # loop (measured: the same click passes on a fresh page).
            # ⚠ the chrome fires on MOUSEDOWN — a bare .click() dispatches
            # only `click` and the handler never runs (measured); send the
            # full sequence.
            page.evaluate(
                """() => {
              const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('glue — the S² gate judges'));
              if (b) {
                b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                b.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                b.click();
              }
            }"""
            )
            page.wait_for_timeout(1500)
            glue_notice = page.evaluate(
                """() => {
              const n = [...document.querySelectorAll('div')].filter((x) => x.textContent.includes('glued') || x.textContent.includes('refused') || x.textContent.includes('not free'));
              n.sort((a, b) => a.textContent.length - b.textContent.length);
              return n[0] ? n[0].textContent.slice(0, 180) : 'NO NOTICE';
            }"""
            )
            record("explore.prismGlueNotice", True, f"the glue's own words: {glue_notice}")
            page.evaluate(
                """() => {
              const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes('close the aperture gate'));
              if (b) {
                b.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                b.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                b.click();
              }
            }"""
            )
            page.wait_for_timeout(300)
            # summon the prism room by its EXACT group name (three built
            # rooms ride the band now — a prefix summon hits a neighbor):
            # reset the camera, project the NEWEST built group, pan it into
            # view if needed, then double-click IT
            page.get_by_text("Reset Camera", exact=True).click()
            page.wait_for_timeout(900)
            built_name = page.evaluate(
                """() => {
              const scene = window.__manuscriptScene;
              const names = [];
              scene.traverse((o) => { if (o.name && o.name.startsWith('written:dim3:built-')) names.push(o.name); });
              return names.pop() || null;
            }"""
            )
            prism_room_built = False
            if built_name:
                bp = project_group_center(page, built_name)
                for _ in range(6):
                    if bp and 20 < bp["x"] < 1480 and 20 < bp["y"] < 860:
                        break
                    dy = -180 if (bp and bp["y"] > 860) else 180
                    dx = -160 if (bp and bp["x"] > 1480) else (160 if (bp and bp["x"] < 20) else 0)
                    page.mouse.move(750, 470)
                    page.mouse.down(button="middle")
                    page.mouse.move(750 + dx, 470 + dy, steps=8)
                    page.mouse.up(button="middle")
                    page.wait_for_timeout(450)
                    bp = project_group_center(page, built_name)
                if bp and 0 < bp["x"] < 1500 and 0 < bp["y"] < 940:
                    page.mouse.dblclick(bp["x"], bp["y"])
                    page.wait_for_timeout(1400)
                    prism_room_built = page.get_by_text("Fit Selected", exact=True).count() > 0
        record("explore.prismRoomBuilt", prism_room_built, f"the pentagon-prism room (ends paired, sides open) joins the dim-3 band · summoned by name {built_name}")
        if prism_room_built:
            page.locator('button[aria-label="explore inside"]').first.click()
            page.wait_for_timeout(600)
            window_open_p = page.locator("[data-explore-window]").count() > 0
            try:
                page.wait_for_function(
                    "() => window.__exploreWindow && window.__exploreWindow.gpu && window.__exploreWindow.renderFrames > 3",
                    timeout=15000,
                )
            except Exception:
                pass
            seam = explore_seam(page)
            p_caption = (seam and seam["caption"]) or ""
            record(
                "explore.prismRoomOpens",
                window_open_p and bool(seam) and seam["gpu"] and seam["walls"] == 5
                and "the manifold ends here" in p_caption and "sealed" not in p_caption,
                f"the PRISM room OPENS: window {window_open_p} · gpu {seam and seam['gpu']} · walls {seam and seam['walls']} (the five open sides) · caption (no divergence claim): {p_caption[:110]}",
            )
            try:
                pbox = page.locator("[data-explore-window]").bounding_box()
                page.screenshot(path=str(__import__('pathlib').Path(__file__).parent / "gpu_prism_window.png"), clip=pbox)
                record("explore.prismPlate", True, "gpu_prism_window.png captured")
            except Exception as err:
                record("explore.prismPlate", False, f"the prism plate failed to capture: {err}")
            page.keyboard.press("Escape")
            page.wait_for_timeout(300)
    except Exception as error:  # noqa: BLE001
        record("explore.prismDrive", False, f"the prism drive died: {error!r}")
    page.keyboard.press("Escape")
    page.wait_for_timeout(600)
    # ---- E-SHELL-INTACT, the caption half: deselected again, the T³ row's
    # own label is back in the DOM — byte-equal across the ENTIRE journey
    # (window · gestures · close · card door · Esc · two threshold builds)
    shell_caption_after = page.evaluate(capture_t3_caption)
    record(
        "explore.shellIntactOnReturn",
        # never a VACUOUS equality: a None capture is a red, not an agreement
        window_gone and fit_still and bool(shell_caption_before) and shell_caption_after == shell_caption_before,
        f"window closed {window_gone} · selection held at close {fit_still} · caption captured {bool(shell_caption_before)} and unchanged across the journey {bool(shell_caption_before) and shell_caption_after == shell_caption_before}",
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
    # (defensive: any earlier DOM locator may have auto-scrolled the page —
    # canvas coords are only valid from the page origin)
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(150)
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
    sel_alive = "() => ((window.__manuscriptCorrespondence ?? {}).rowResultIds ?? []).length > 0"
    pre_down = page.evaluate(sel_alive)
    page.mouse.move(orbit_pt["x"], orbit_pt["y"])
    page.mouse.down(button="left")
    page.wait_for_timeout(150)
    post_down = page.evaluate(sel_alive)
    page.mouse.move(orbit_pt["x"] + 220, orbit_pt["y"] + 70, steps=12)
    page.wait_for_timeout(450)
    after_orbit = camera_state(page)
    page.mouse.up(button="left")
    page.wait_for_timeout(400)
    post_up = page.evaluate(sel_alive)
    # D2-GROUND RESIDUAL: the orbit-DRAG release must NOT deselect (the drag
    # discriminator in onPointerMissed) — the Fit button stays enabled; a
    # true empty-paper CLICK (no movement) still deselects
    fit_after_drag = page.get_by_text("Fit Selected", exact=True).first
    record(
        "residual.orbitKeepsSelection",
        fit_after_drag.is_enabled(),
        f"Fit enabled after drag: {fit_after_drag.is_enabled()} · selection alive pre-down {pre_down} / post-down {post_down} / post-up {post_up}",
    )
    # ARMAN'S LAW (2026-08-07, direct word): summon/dismiss is a DOUBLE-CLICK.
    # A SINGLE empty-paper click is INERT (no sink, no reset animation); the
    # DOUBLE-click dismisses. Both halves measured.
    deselect_pt = orbit_pt
    for fx, fy in ((0.08, 0.16), (0.92, 0.4), (0.06, 0.5), (0.5, 0.12)):
        x = box["x"] + box["width"] * fx
        y = box["y"] + box["height"] * fy
        tag = page.evaluate(
            "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
            [x, y],
        )
        if tag == "CANVAS":
            deselect_pt = {"x": x, "y": y}
            break
    page.mouse.click(deselect_pt["x"], deselect_pt["y"])
    page.wait_for_timeout(500)
    single_inert = page.get_by_text("Fit Selected", exact=True).first.is_enabled()
    page.mouse.dblclick(deselect_pt["x"], deselect_pt["y"])
    page.wait_for_timeout(600)
    dbl_dismissed = not page.get_by_text("Fit Selected", exact=True).first.is_enabled()
    record(
        "residual.emptyClickDeselects",
        single_inert and dbl_dismissed,
        f"single empty click INERT (selection survives: {single_inert}) · double-click dismisses (Fit disabled: {dbl_dismissed}) — Arman's law",
    )
    # D2 persistence, second half: the deselect CLEARS the key (the marks
    # were present without hover while selected — the census took them cold)
    record(
        "d2.persistDeselect",
        page.locator(".corr-mark").count() == 0,
        f"marks after deselect: {page.locator('.corr-mark').count()} (the key mounts on select, clears on deselect)",
    )
    # D2-GROUND RESIDUAL + M3-CLEANUP-2: the CameraDock LEFT the right column
    # (bottom-left now) — disjoint from the aperture toggle AND anchored clear
    # of the card's column (its right edge stays left of mid-viewport)
    dock_box = page.get_by_text("Fit Selected", exact=True).first.bounding_box()
    aperture_box = page.get_by_text("aperture — build a 3-manifold", exact=False).first.bounding_box()
    disjoint = bool(dock_box and aperture_box) and (
        dock_box["y"] + dock_box["height"] <= aperture_box["y"]
        or aperture_box["y"] + aperture_box["height"] <= dock_box["y"]
        or dock_box["x"] + dock_box["width"] <= aperture_box["x"]
        or aperture_box["x"] + aperture_box["width"] <= dock_box["x"]
    )
    viewport = page.viewport_size or {"width": 1600}
    left_anchored = bool(dock_box) and (dock_box["x"] + dock_box["width"]) < viewport["width"] * 0.5
    record(
        "residual.chromeDisjoint",
        disjoint and left_anchored,
        f"dock x {None if not dock_box else round(dock_box['x'])} y {None if not dock_box else round(dock_box['y'])} "
        f"(right edge < half-viewport: {left_anchored}) · aperture y {None if not aperture_box else round(aperture_box['y'])} · disjoint {disjoint}",
    )
    orbit_ok = False
    if before_orbit and after_orbit:
        qdot = abs(sum(a * b for a, b in zip(before_orbit["quaternion"], after_orbit["quaternion"])))
        orbit_ok = qdot < 0.9995  # it rotated
    reset_button.first.click()
    page.wait_for_timeout(400)
    # PALETTE-VERIFIED right-click retry: elementFromPoint says CANVAS even
    # over a drawn FORM (the FormOpsMenu opens, not the palette) — on the
    # crowded sheet the point must be retried until the PALETTE opens
    invoke_ok = False
    for fx in (0.3, 0.24, 0.4, 0.16, 0.5, 0.62, 0.74, 0.86):
        if invoke_ok:
            break
        for fy in (0.5, 0.34, 0.66, 0.2, 0.82):
            x = box["x"] + box["width"] * fx
            y = box["y"] + box["height"] * fy
            tag = page.evaluate(
                "([x, y]) => { const el = document.elementFromPoint(x, y); return el ? el.tagName : null; }",
                [x, y],
            )
            if tag != "CANVAS":
                continue
            canvas.click(button="right", position={"x": x - box["x"], "y": y - box["y"]})
            page.wait_for_timeout(350)
            if page.locator("text=invoke — real material").count() > 0:
                invoke_ok = True
                break
    if invoke_ok:
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
        # PHASE D1 — the correspondence engine (the face lift is selected)
        if args.lift_files:
            try:
                drive_correspondence(page)
            except Exception as error:  # noqa: BLE001
                record("corr.drive", False, repr(error))
            # M2 — the callout ring + the emphasis (the face still selected;
            # runs BEFORE the pick gestures so the halo census is truly cold)
            try:
                drive_d2_marks(page)
            except Exception as error:  # noqa: BLE001
                record("d2.drive", False, repr(error))
            # D1 — the pick gestures (sticky by design — after the census)
            try:
                drive_correspondence_pick(page)
            except Exception as error:  # noqa: BLE001
                record("corr.pickDrive", False, repr(error))
            # M1 — register subordination + the field door + §7 promotion
            try:
                drive_registers(page)
            except Exception as error:  # noqa: BLE001
                record("regs.drive", False, repr(error))
        # THE RING ANCHOR RESOLVER — every driveable mode renders-or-declares
        # (runs after the lift-specimen sections; invokes fresh subjects)
        try:
            drive_ring_modes(page)
        except Exception as error:  # noqa: BLE001
            record("ring.modesDrive", False, repr(error))
        # THE REFINED IDENTIFY GESTURE — vertex-pick + computed preview + the
        # flip + the stated commit (the mothership's ratification path)
        try:
            drive_identify(page)
        except Exception as error:  # noqa: BLE001
            record("identify.drive", False, repr(error))
        # PHASE A — the camera plate (everything above already exercised the
        # sheet at the default framing; runs BEFORE explore, whose dblclick
        # summons deliberately re-fly the camera and clear the lift selection
        # the plate/residual measurements depend on)
        try:
            drive_camera(page)
        except Exception as error:  # noqa: BLE001
            record("camera.drive", False, repr(error))
        # RUNG 1 — THE EXPLORE WINDOW: doorway · rest recurrence · the two
        # gestures · the seamless crossing · horizon · shell intact · the
        # threshold refusals (cone + folded), all on the running app. Judged
        # LAST: its summons/builds are free to move the sheet.
        try:
            drive_explore(page)
        except Exception as error:  # noqa: BLE001
            record("explore.drive", False, repr(error))

        record("console", len(console_errors) == 0, "; ".join(console_errors[:4]))
        browser.close()

    print(json.dumps({"results": results, "consoleErrors": console_errors}))
    sys.exit(0 if all(r["ok"] for r in results.values()) else 1)


main()
