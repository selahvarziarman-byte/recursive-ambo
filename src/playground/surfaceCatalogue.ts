// surfaceCatalogue — R0: the three degenerate-boundary surfaces as viewable specs.
//
// Pure data: `{key, label, spec}` for the R0 immersions, so they can be built
// and shown in `?playground` for the visual check. Wiring the op-set → immersion
// into the playground UI is G5, deliberately NOT here — these are BUILT surfaces
// (identified vertices), never invocation-catalogue entries (sovereign scope
// ruling 2026-07-02: invocation = distinct source-less primals only).

import type { ImmersedSurfaceKey, SurfaceImmersionSpec } from '../lib/surfaceImmersion';

export interface SurfaceCatalogueEntry {
  key: ImmersedSurfaceKey;
  label: string;
  spec: SurfaceImmersionSpec;
}

export const SURFACE_CATALOGUE: SurfaceCatalogueEntry[] = [
  { key: 'torus', label: 'Torus (abAB)', spec: { surface: 'torus', resolution: 16 } },
  { key: 'klein', label: 'Klein bottle (abaB)', spec: { surface: 'klein', resolution: 16 } },
  { key: 'rp2', label: 'RP² cross-cap (abab)', spec: { surface: 'rp2', resolution: 16 } },
];
