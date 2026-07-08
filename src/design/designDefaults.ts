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
    spacing: 8.5, // x-distance between forms (five now: the trio + the certified open cores)
    cameraPosition: [0, 6, 30] as const,
    captionDrop: 4.6, // how far below a form its caption card hangs
  },
  lighting: {
    ambientIntensity: 0.92, // flat, paper-like light
    keyIntensity: 0.5, // gentle modelling only — shading must not read as photoreal volume
    keyPosition: [4, 6, 3] as const,
  },
};
