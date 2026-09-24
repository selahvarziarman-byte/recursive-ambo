// faceNames — C-10b (§131 item 4, the designer's blocker): a face a shape no longer holds is, almost always, its SOURCE face
// DISSECTED — it lives in an ANCESTOR shape of the workspace (the parent-pointer chain) and has a D14 name there. The face is
// found through the store's shapes as they stand at the read (a plain state read, never a hook: these formatters are pure
// functions of the shape they are handed; under a headless render the store holds no shapes and the absence word stands as
// before); the absence word is kept only where no ancestor holds the face either — never dropped into a slot that expects
// a name. `src/components` carries no manifest rows.
import type { Face, Shape } from '../types/geometry';
import { useGeometryStore } from '../store/geometryStore';

export interface FaceThroughAncestors {
  face: Face;
  in: Shape; // the shape that holds it — this one, or the ancestor it was dissected in
  dissected: boolean; // found in an ancestor: the face is a source face this shape's dissection consumed
}

export function faceThroughAncestors(
  shape: Shape,
  faceId: string,
  ancestry: Record<string, Shape> = useGeometryStore.getState().shapes,
): FaceThroughAncestors | null {
  const own = shape.faces.find((f) => f.id === faceId);
  if (own) return { face: own, in: shape, dissected: false };
  const seen = new Set<string>([shape.id]);
  let cursor: Shape | undefined = shape;
  while (cursor && cursor.genealogy.parentShapeId) {
    const parent: Shape | undefined = ancestry[cursor.genealogy.parentShapeId];
    if (!parent || seen.has(parent.id)) return null;
    seen.add(parent.id);
    const f = parent.faces.find((x) => x.id === faceId);
    if (f) return { face: f, in: parent, dissected: true };
    cursor = parent;
  }
  return null;
}

/** the lineage line's words for a source face found in an ancestor: `the seed face A·B·C, dissected` (the child's own operation names how) */
export function dissectedFaceWords(found: FaceThroughAncestors, name: string, child: Shape): string {
  const how = /ambo/.test(child.genealogy.operation) ? 'dissected' : child.genealogy.operation;
  return `the ${found.in.genealogy.operation === 'seed' ? 'seed face' : 'face'} ${name}, ${how}`;
}
