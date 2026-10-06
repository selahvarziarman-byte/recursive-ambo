// ═══ COPY-1 §3 · P2 — A SHAPE'S CODE → ITS WORDS (STAMP LAYOUT-1 · MARKER M1, the designer's COPY-1 ratified 2026-09-29; rule 6:
// code words become words). ONE reader: the operations' status lines, the solid's foot, the hover readout and every drawer print a
// shape through it, so the page has one spelling for each code (a second formatter is the drift the law predicts). It lives beside
// the operations because they are the first producers of a shape's name on the page (`ready: the seed tetrahedron`), and the
// components import it from here.
//
//   `pyritohedral-icosahedron` → `pyritohedral icosahedron` · `square-pyramid` → `square pyramid` ·
//   `rectified-square-pyramid-ambo-core` → `rectified square pyramid (Ambo core)` · `unknown` → nothing (P4: a shape with no
//   recorded topology leaves the shape out, never `unknown`) · `other` → `other` (a filter's option, where a shape must be named)

export function shapeWords(code: string | null | undefined): string | null {
  if (!code || code === 'unknown') return null;
  if (code === 'rectified-square-pyramid-ambo-core') return 'rectified square pyramid (Ambo core)';
  return code.replace(/-/g, ' ');
}
