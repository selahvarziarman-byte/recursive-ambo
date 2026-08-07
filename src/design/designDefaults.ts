// designDefaults — the designer instrument layer's COMMIT TARGET (dev-tooling).
//
// The committed scenes' STYLING SCALARS, lifted as named constants whose values
// are EXACTLY the current literals — extraction changes nothing. This module is
// pure data (no React, no Leva): the `?design` workbench initializes its live
// controls from these groups, and when the designer's chosen look is ratified,
// the new numbers land HERE and flow to the committed components through the
// normal ratify path — not through this pass.
//
// Sources (grounded literal-by-literal):
//   · PlaygroundViewport.tsx      — camera/lights/grid/material/edges/vertices
//   · BornFormView.tsx            — the patch-view canvas + IMMERSION_RESOLUTION
//   · Workspace3D.tsx (:71,:80-83,:399-414,:2675…) — the ambo workspace scene + cellStyle
//   · surfaceImmersion.ts         — the per-surface immersion scale parameters
//   · SurfaceIdentificationOverlay.tsx — the L2 seam/merge cue styling
//   · FieldForShapeOverlay.tsx    — the field texture/Σ/legend styling
// NOT knobs (guards, enumerated for completeness only): GLUING_EPSILON,
// DEGENERACY/NODE/ANTINODE tolerances — faithfulness surface, never dialled.

export const cameraDefaults = {
  fov: 45, // every committed Canvas
  playground: { minDistance: 3.8, distanceFactor: 3.2, offset: [1, 0.72, 1] as const },
  bornPatch: { minDistance: 3.2, distanceFactor: 3.2, offset: [1, 0.7, 1] as const },
  workspace: { position: [3.2, 2.4, 3.8] as const },
};

export const lightingDefaults = {
  background: '#0c0a09',
  ambientIntensity: 0.62,
  key: { position: [4, 5, 3] as const, intensityPlayground: 1.7, intensityBornPatch: 1.4 },
  fill: { position: [-3, -2, -4] as const, intensity: 0.45, color: '#67e8f9' },
  grid: {
    size: 6,
    divisions: 12,
    colorCenter: '#57534e',
    colorGrid: '#292524',
    position: [0, -1.35, 0] as const,
  },
};

export const materialDefaults = {
  face: {
    color: '#67e8f9',
    opacity: 0.34, // PlaygroundViewport (BornPatchView uses 0.32)
    opacityBornPatch: 0.32,
    roughness: 0.82, // Workspace3D/PlaygroundViewport (BornPatchView 0.85)
    roughnessBornPatch: 0.85,
    metalness: 0,
    wireframe: false,
    doubleSide: true,
    transparent: true,
  },
  faceSelected: { color: '#5eead4', opacity: 0.55, emissive: '#134e4a', emissiveIntensity: 0.9 },
  edges: { color: '#cffafe', opacity: 0.92, opacityBornPatch: 0.7 },
  vertices: {
    radius: 0.07,
    segments: [20, 14] as const,
    selectedScale: 1.35,
    selectedColor: '#f59e0b',
    selectedEmissive: '#92400e',
    selectedEmissiveIntensity: 0.85,
  },
  workspaceHighlightEdge: '#fb7185',
  // Workspace3D cellStyle reference rows (mode-dependent; the ratify target
  // keeps the full table in Workspace3D — representative values enumerated):
  workspaceCellStyle: {
    parentFaceOpacity: 0.16,
    coreFaceOpacity: 0.42,
    edgeColor: '#fef3c7',
    dualProxyEdgeColor: '#f5d0fe',
    ghostFaceOpacity: 0.045,
  },
};

export const geometryOverlayDefaults = {
  // BornFormView.tsx:33 — the render/field resolution ceiling (the measured
  // ~0.3s budget at R=6; R=16 froze the tab — the standing perf note).
  immersionResolution: 6,
  // surfaceImmersion.ts — the per-surface immersion scale parameters.
  immersionScales: {
    torus: { R0: 2.75, r0: 1.25 },
    klein: { S: 1.4, C: 2 },
    rp2: { S: 5.5 },
    cylinder: { Rc: 2.2, H: 2.6 },
    mobius: { Rm: 2.4, W: 1.7 },
    sphere: { Rs: 2.2 },
  },
  // SurfaceIdentificationOverlay.tsx — the L2 seam/merge cues.
  identification: {
    loopColorA: '#f59e0b',
    loopColorB: '#e879f9',
    mergeColor: '#f43f5e',
    lineWidth: 4,
    depthTest: false,
    renderOrder: 10,
    badgeBorder: '#f43f5e',
    badgeText: '#fecdd3',
    badgeFontSize: 12,
    mergeEmissive: '#881337',
    mergeEmissiveIntensity: 0.6,
    mergeRoughness: 0.35,
  },
  // FieldForShapeOverlay.tsx — the field texture / Σ / legend styling.
  field: {
    plainSurfaceColor: '#1c2a2e', // the no-texture (degenerate) surface
    wireColor: '#44403c',
    wireOpacity: 0.55,
    sigmaColor: '#f43f5e',
    sigmaLineWidth: 5,
    legendBorder: '#292524',
    legendText: '#d6d3d1',
    legendFontSize: 12,
    sigmaLegendText: '#fda4af',
  },
};

// NON-KNOBS (faithfulness surface — enumerated so nobody mistakes them for style):
export const faithfulnessGuards = {
  gluingEpsilon: 1e-6, // surfaceImmersion — the gluing-consistency guard
  degeneracyTol: 1e-6, // richFieldV0 — spectral gates
  nodeTol: 1e-4,
  antinodeTol: 1e-9,
} as const;

// ---------------------------------------------------------------------------
// manuscript — Phase 1 of the inked-manuscript language (design ADR 0001,
// mothership-ratified 2026-07-08). Craft scalars ONLY, the designer's live
// tuning surface for the `?manuscript` view; the Leva panel mounts in
// ManuscriptView itself (engineer ruling on calibration flag 1 — Phase 1
// leaves DesignWorkbench untouched; mirroring these into `?design` is a later
// one-line sanction). Defaults aim at the blessed reference
// (`outputs/playground_reference.png`) — the designer refines from here.
//
// NON-KNOBS (the one law — never dialled, deliberately absent below): WHICH
// generator loops exist (derived in src/manuscript/inkedFormModel.ts — sphere
// none, torus a+b, RP² the closed a·b from correspondence.word + gridVertexTo;
// cylinder/Möbius their ONE `globalW1`-certified core, researcher ruling
// 2026-07-08) and WHAT the construction lines are (the committed shape's real
// subdivision edges). Craft styles the marks the engine carries; it cannot
// add or remove one. (Hatching is TONE — capped, banded shading; not a mark.)
export const manuscriptDefaults = {
  paper: {
    background: '#e9e2cf', // the warm parchment ground (reference field tone)
    titleInk: '#2a2419',
    cardBackground: '#f4efe1',
    cardBorder: '#c9bfa6',
    cardInk: '#3a3326',
  },
  body: {
    // P4 THE BODY VALUE (designer plate, 2026-07-28): on a manuscript the PAGE
    // is the lightest value — nothing is lighter than paper. The old cream
    // (#f5f0e2) sat ABOVE the ground and read as a glow, not a form. The
    // ruled correction is the plate's panel B: a fill a WHISPER darker than
    // the ground #e9e2cf (every channel ≤ the ground's), under a strong
    // silhouette. Tuned against .handoff/assets/P4_BODY_VALUE_DESIGNER.png.
    // P4 FIX-FORWARD (2026-07-28): the whisper (#ddd6c0) was INVISIBLE in the
    // RUNNING APP (the authority — the plate's paper regressed the ruling
    // twice); the corrected fill is decisively darker while every channel
    // stays ≤ the ground's. Fallback if still faint in-app: #bfb18c.
    color: '#c9bd9a', // the visible body — darker than the page, never a glow
    opacity: 0.8, // translucent — the far construction lines stay visible (never opaque/photoreal)
    roughness: 0.9,
    prepassOffsetUnits: 3, // depth-prepass polygonOffset units (designer craft item 5: 2–4 quiets the RP² pinch z-fight)
  },
  construction: {
    color: '#6b6047', // graphite
    opacity: 0.38, // the depth-tested (visible-side) pass
    ghostOpacity: 0.12, // the hidden-line pass — the SAME real edges, fainter, depth-test off (a drawing shows its far construction faintly; no new marks)
  },
  silhouette: {
    color: '#262014', // dark ink
    // "drawn with one pen" (designer craft item 4): constant SCREEN-space weight.
    // The hull's world displacement = form bounding-radius × screenspacePx × the
    // calibration constant in InkedForm — all forms read as one pen width at the
    // default camera (true per-frame distance invariance = a later refinement).
    // P4 (designer plate): the silhouette goes STRONG — the corrected value
    // pairing is strong hull + whisper-darker fill (panel B).
    // P4 FIX-FORWARD (2026-07-28): 2.6 → 3.0, and the weight now APPLIES AT
    // SPEC — the laid/class hulls rendered inside scaled groups (dim2Scale
    // 0.62) which silently shrank the displacement to ~62% of the pen; the
    // hull builders now divide by their group's scale (the measured cause of
    // "the app looked under-inked").
    screenspacePx: 3.0,
    opacity: 1,
  },
  generators: {
    a: '#c2811d', // warm orange — the reference's a → longitude (also the a·b + certified-core ink)
    b: '#3e6db4', // manuscript blue — the reference's b → meridian
    lineWidth: 1.7, // R4B, designer-ruled + mothership-sanctioned reland: the generator mutes — a mark, not a rope
    // two-pass treatment (designer craft item 2, mirroring the construction lines):
    // a NEAR pass (depth-tested, full colour) + a HIDDEN pass (depth-test off,
    // faint — the drafting hidden-line convention). Same real loop, no new mark;
    // replaces Phase 1's blanket depthTest:false.
    ghostOpacity: 0.3, // a FLOOR, not a shadow value — never scaled (R4B: 0.55×0.3 dies on the Klein's dense field)
    // R4B: the NEAR pass goes see-through — the loop reads as a mark over the
    // stippled field instead of a rope over it. Ghost stays the faint floor.
    nearOpacity: 0.55,
    renderOrder: 10,
  },
  // THE MARKED SPECIMEN (M1, SEAL_THE_MARKED_SPECIMEN) — REGISTER
  // SUBORDINATION: the FIGURE (silhouette + hatch + cells + rim) is the
  // phenomenon and ALWAYS draws full; the ANNOTATION registers (generators,
  // field) recede to ONE BINARY recessed band — WEIGHT primary (the same mark
  // at a finer nib: presence, not value) + hue-preserving pull toward the ink
  // family's warm NEUTRAL (never the paper) — ⛔ NEVER opacity (dissolves into
  // the hatch + falsely claims uncertainty) · ⛔ NEVER dash (the crossing
  // register owns the broken line). INJECTIVE: the two recessible registers
  // keep distinct recessed styles (line-vs-stipple FORM + distinct factors).
  // Visible defaults — the designer pins the final values at her look-clear.
  registers: {
    inkNeutral: '#847a69', // the ink family's warm neutral (NEVER the paper tone)
    recessedMix: 0.55, // how far a recessed register's ink pulls toward the neutral
    recessedLineFactor: 0.5, // generators: the finer nib (width × this)
    recessedStippleFactor: 0.66, // field: dot/Σ scale — DISTINCT from the line factor (injectivity)
  },
  hatching: {
    // the designer's round-1 spec (RELAY_DESIGNER_TO_ENGINEER_MANUSCRIPT_CRAFT_1;
    // target: outputs/torus_hatched_study.png): screen-space diagonal ink SHADING,
    // masked by the body's key-light term — lit → none, shadow → single hatch,
    // deep shadow → cross-hatch. TONE only: unlike the lines and loops it derives
    // from no correspondence; its one guard is the ANTI-PHOTOREAL CAP — opacity
    // capped per stroke and banded, never a smooth tonal volume.
    // THE SURFACE LOCK (S4): spacing/weight are OBJECT units now — the hatch
    // rides the body's own surface, not the screen. These are visible
    // DEFAULTS for the look-clear; the designer pins the final values.
    spacingPx: 0.09, // surface stroke pitch, object units
    // §2 (the S2 union): the legible-band target — the APPARENT screen period
    // (px) the density management aims for (the LOD snaps the object pitch in
    // octaves toward it). A visible default; the designer pins it at her
    // look-clear without a re-seal (the spacingPx split, mirrored).
    bandPx: 9,
    opacity: 0.4, // max graphite opacity per stroke (THE CAP — the Leva range stops at 0.5)
    weightPx: 0.014, // stroke weight, object units
    color: '#61563f', // graphite, a step darker than construction
    angleDeg: 45, // the hatch diagonal
    shadowStart: 0.8, // shading-term threshold where single-hatch begins
    crossStart: 0.66, // threshold where cross-hatch begins
  },
  layout: {
    resolution: 16, // construction-grid resolution — feeds the IMMERSION route only. C.1 (2026-07-17): `?manuscript` now RUNS the field pipeline for the SELECTED specimen, but OFF-THREAD (fieldWorker — the repo's first worker) and on the DRAWN body, which is fixed per class and never fed by this knob; the BornFormView R=6 budget remains the dev shell's on-thread ceiling (the field's ~n³, not the immersion's)
    spacing: 8.5, // base x-distance between forms within a band (scaled per band)
    cameraPosition: [0, 0, 46] as const, // frames the three stacked registers
    captionDrop: 4.6, // how far below a form its name label hangs (in form-local units)
  },
  // Phase 2a — the ambient WORLD (dimension-stratified registers; CONTEXT "the
  // through-line" + the reference bands). Layout/drift are craft: exact
  // placement "settles in the live build" — the designer dials from here.
  // NON-KNOB (unchanged law): WHAT populates the bands and WHICH marks a form
  // carries come from worldModel/inkedFormModel — no knob adds or removes a
  // form or a mark; these scalars only place and pace the drawings.
  world: {
    bands: {
      // warm-paper tones deepening down the registers (reference bands)
      dim1Tone: '#ede7d6',
      dim2Tone: '#e8e1cc',
      dim3Tone: '#e2d9c1',
      labelInk: '#6b6047',
      width: 200, // band plane width (world units)
      depth: -8, // band plane z (behind the forms)
    },
    rows: {
      dim1Y: 10.5, // band y-centers (top → bottom registers)
      dim2Y: 0,
      dim3Y: -10.5,
      dim1Height: 6,
      dim2Height: 13,
      dim3Height: 7,
      dim1Scale: 2.1, // per-band form scale (the cut n-gons are radius-0.8 seeds)
      dim2Scale: 0.62, // six immersions side by side
      dim3Scale: 1.6, // the cube seed domain
      dim1Spacing: 3.4, // per-band spacing between form centers (pre-scale multiplier applies to dim2 via layout.spacing)
      dim3Spacing: 8,
    },
    drift: {
      // the living manuscript breathes — never busy, never a screensaver
      enabled: true,
      amplitude: 0.22, // world units of gentle wander
      speed: 0.05, // radians/sec of the drift phase
    },
    // Phase 2b — the specimen on select (rise-and-sink + the analytic reading).
    // Motion / recede / emphasis are craft; THE ONE RULE is not a knob: the
    // reading exists only while a form is selected (summoned, never ambient),
    // and every card value is a committed certifier's, verbatim.
    specimen: {
      riseZ: 20, // world z the specimen lifts to (toward the reader)
      riseY: 0, // it centers on the page midline
      riseScale: 1.7, // magnification on top of its band scale
      damping: 3.2, // MathUtils.damp lambda — the calm of rise-and-sink
      recedeOpacity: 0.35, // ambient material opacities while a specimen is up
      recedeColorFade: 0.55, // ambient inks fade toward the paper tone (0 none · 1 vanish)
      loopWidthFactor: 1.7, // the specimen's certified loops light up by width…
      loopGhostOpacity: 0.45, // …and their hidden pass lifts (still the SAME loops — nothing redrawn)
    },
    skeleton: {
      lineWidth: 2.6, // dim-1 pen weight (px — bare curves read as solid ink)
    },
    domain: {
      lineWidth: 2, // dim-3 wireframe pen weight (px)
      markRadius: 0.13, // face-identification stud size (cube-local units)
      // one hue per identified face-pair (three pairs on T³) — manuscript inks
      markColors: ['#b0561b', '#3e6db4', '#6d8f3e'],
    },
    // THE APERTURE (engineer-chartered 2026-07-13, designer-ruled ADR 0004):
    // the dim-3 WORLD register is a hand-cut hole showing the interior —
    // image-space transported, populated (mask + coil). EVERY dial below is
    // the CRAFT SURFACE the designer owns; the pixels themselves are the
    // engine's (traceAperture) and no knob invents or moves a copy.
    aperture: {
      resolution: 168, // trace raster (px) — countable copies, not pixel fetish
      level: 6, // transport depth (bounded; linear in depth, never an orbit enumeration)
      toneGamma: 1.25, // the tone curve
      contourWeight: 0.55, // silhouette-edge darkening — line art, not photoreal light
      // THE INK (designer's spec, 2026-07-14): exponential decay was right,
      // 0.88 left a soup of distant copies — 0.63 (τ≈2.2) dissolves them
      echoFade: 0.63,
      maskTone: 1.0, // per-object tone — the scanned two-faced mask
      handTone: 0.92, // — the Capitolini pointing hand (THE PROBES: the coil is retired; the hand does chirality)
      scaffoldTone: 0.28, // — the cell's own edges: faint scaffolding AT MOST
      formTone: 0.95, // — the person's placed form
      rimSeed: 3, // the hand of the cut (same seed, same tear)
      interiorInk: '#2a251c', // THE LINE colour — never a fill (the void is paper)
      size: 3.6, // aperture plane size (world units)
      // THE INK's own dials (designer-owned; exposed, not dialed) — the void
      // is paper, the line carries the form, tone is a guest:
      contourEchoFade: 0.68, // the line outlives the tone by a beat
      contourGain: 1.85, // contour = the primary mark (designer 0620)
      contourBlur: 0.5, // px (designer 0620)
      // THE PROBES (designer 0620): the crease draws the fingers — sharp
      // normal steps over shallow depth steps; without it, a mitten.
      creaseThreshold: 0.5, // |Δnormal|
      depthBreakThreshold: 0.035, // |Δdepth| — the 0.30-class value was far too coarse
      hatchAngleA: 36, // degrees
      hatchAngleB: -46, // degrees
      hatchPeriod: 5, // px
      hatchWidth: 1.5, // px
      hatchThresholdA: 0.5, // hatch only where genuinely dark
      hatchThresholdB: 0.74, // the second, steeper family
      darkSolid: 0.9, // the mask's dark material (inert today — real openings; arms when a dark-material mask lands)
    },
    // RUNG 1 — THE EXPLORE WINDOW (FAT CHARTER 2026-08-07): the walked
    // inside-view. Craft/pacing only — the frames are traceAperture's, the
    // walk is the engine's own transport; no knob invents a copy or a step.
    explore: {
      resolution: 128, // the window's own trace raster (px) — walking cadence over pixel fetish
      pace: 0.32, // advance, world units/s — a cloister walk, not a flight sim
      lookSensitivity: 0.004, // rad/px of drag
      // D1 — THE INK RETUNE AT WINDOW SCALE (designer 1830, slice 1): the
      // window's OWN craft + ink — the shell's 168px-tuned params reused
      // verbatim at ~4× apparent scale collapsed the tone to two values
      // (the third scale-reuse failure this arc). The retune builds a TONE
      // LADDER: paper ground → a light single weave the half-lit face
      // crosses → a darker double weave on the shadowed face → the line on
      // top — a grey range, the two-faced mask readable. The tone dies fast
      // with depth while the line persists (the ink's own "line outlives
      // the tone" law, pushed further at window scale — the far copies
      // recede as clean line drawings, not tone salt).
      craft: {
        toneGamma: 0.88, // lifts the midtones the shell's 1.25 crushed at scale
        contourWeight: 0.3, // the 0.55 grazing-rim darkening over-fired at scale
        maskTone: 1.0,
        handTone: 0.92,
        scaffoldTone: 0.28,
        formTone: 0.95,
      },
      ink: {
        paperColor: '#e9e2cf', // THE PAGE ITSELF — the same hand as the plate beside it
        interiorInk: '#2a251c',
        rimSeed: 3,
        echoFade: 0.45, // the tone dies by the second corridor (no distant salt)
        contourEchoFade: 0.72, // the line persists — depth is carried by drawing, not noise
        contourGain: 1.55,
        contourBlur: 0.55,
        hatchAngleA: 36,
        hatchAngleB: -46,
        hatchPeriod: 2.6, // the weave tightens so it reads as TONE at window scale, not stripes
        hatchWidth: 0.8,
        hatchThresholdA: 0.3, // the half-lit face crosses — the ladder's light rung
        hatchThresholdB: 0.62, // the shadowed face crosses both — the darker rung
        darkSolid: 0.9,
        creaseThreshold: 0.5,
        depthBreakThreshold: 0.035,
      },
    },
    // P-IMMERSE — the honest non-manifold flag: WHICH edges are junctions is
    // the classifier's slot-count reading (>2 face wedges); the knob is ink only.
    junction: {
      color: '#8a2f24', // the junction overdraw — a warning red-brown, never a generator ink
      lineWidth: 3.4, // px — heavier than construction so the flaw is unmissable
    },
    // Phase 3a — the operating chrome. Placement/pacing craft only; the
    // OPERATIONS themselves are the committed PlaygroundOperation registry
    // (writtenFormModel) — no knob invents or alters a transform.
    chrome: {
      spawnOffset: 6, // where an op-born form lands relative to its parent (x)
    },
    // Phase 3b — the memory (birth · record · shelf). Craft only: WHICH forms
    // are pentimenti is the DAG's own consumed population; the stemma/record
    // ARE the committed (Q3-reduced) GenealogyEdges — no knob invents lineage.
    genesis: {
      pencilTone: '#8a8069', // the pentimento graphite — legible underdrawing, never a fade
      pencilBodyOpacity: 0.08, // the consumed body settles to a whisper; its lines stay
      stemmaWidth: 1.2, // the ink stemma line (px) — INK, not gold (the ratified ruling)
      stemmaOpacity: 0.55,
      // craft round-2 (designer call, relay §2): birth is a WORLD event — the
      // child settles ambient (no auto-rise; the specimen stays summoned-by-
      // click) and announces itself with a brief pulse. UX only — no mark.
      birthCueDuration: 1.4, // seconds
      birthCueRadius: 3.4, // world units the pulse expands to
    },
  },
  lighting: {
    ambientIntensity: 0.92, // flat, paper-like light
    keyIntensity: 0.5, // gentle modelling only — shading must not read as photoreal volume
    keyPosition: [4, 6, 3] as const,
  },
};

// M1 — the ONE ink-recession move (hue-preserving pull toward the warm
// neutral; the recessed band's colour half — the weight half is the caller's
// width × factor). Pure hex math, no renderer dependency: the design layer
// stays data + this one derivation.
export const recedeInk = (
  ink: string,
  mix: number = manuscriptDefaults.registers.recessedMix,
  neutral: string = manuscriptDefaults.registers.inkNeutral,
): string => {
  const parse = (hex: string): [number, number, number] => {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
  };
  const [r0, g0, b0] = parse(ink);
  const [r1, g1, b1] = parse(neutral);
  const channel = (a: number, b: number): string =>
    Math.round(a + (b - a) * mix)
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r0, r1)}${channel(g0, g1)}${channel(b0, b1)}`;
};
