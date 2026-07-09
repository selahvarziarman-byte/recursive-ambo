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
    color: '#f5f0e2', // cream body, a step lighter than the ground
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
    screenspacePx: 1.75,
    opacity: 0.9,
  },
  generators: {
    a: '#c2811d', // warm orange — the reference's a → longitude (also the a·b + certified-core ink)
    b: '#3e6db4', // manuscript blue — the reference's b → meridian
    lineWidth: 3.5,
    // two-pass treatment (designer craft item 2, mirroring the construction lines):
    // a NEAR pass (depth-tested, full colour) + a HIDDEN pass (depth-test off,
    // faint — the drafting hidden-line convention). Same real loop, no new mark;
    // replaces Phase 1's blanket depthTest:false.
    ghostOpacity: 0.3,
    renderOrder: 10,
  },
  hatching: {
    // the designer's round-1 spec (RELAY_DESIGNER_TO_ENGINEER_MANUSCRIPT_CRAFT_1;
    // target: outputs/torus_hatched_study.png): screen-space diagonal ink SHADING,
    // masked by the body's key-light term — lit → none, shadow → single hatch,
    // deep shadow → cross-hatch. TONE only: unlike the lines and loops it derives
    // from no correspondence; its one guard is the ANTI-PHOTOREAL CAP — opacity
    // capped per stroke and banded, never a smooth tonal volume.
    spacingPx: 7.5, // screen-space stroke pitch
    opacity: 0.4, // max graphite opacity per stroke (THE CAP — the Leva range stops at 0.5)
    weightPx: 1, // stroke line-weight
    color: '#61563f', // graphite, a step darker than construction
    angleDeg: 45, // the hatch diagonal
    shadowStart: 0.8, // shading-term threshold where single-hatch begins
    crossStart: 0.66, // threshold where cross-hatch begins
  },
  layout: {
    resolution: 16, // construction-grid resolution — `?manuscript` runs NO field pipeline, so the BornFormView R=6 budget does not apply (that ceiling is the field's ~n³, not the immersion's)
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
