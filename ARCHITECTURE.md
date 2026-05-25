# Architecture

Platonic Engine is organized around a small typed geometry core, a local state store, and a React Three Fiber presentation layer.

## Data Model

The core domain types live in `src/types/geometry.ts`.

- `Vertex` stores a stable `id`, a 3D position, editable `data`, and creation metadata.
- `VertexDataPacket` is the user-editable packet attached to every vertex.
- `Face` stores ordered vertex IDs and optional source metadata.
- `Edge` stores vertex pairs derived from faces.
- `Shape` stores vertices, edges, faces, and genealogy.
- `ShapeGenealogy` records parent shape, operation, generation depth, source vertices, created vertices, and timestamp.
- `SeedDefinition` describes seed shapes before they become runtime `Shape` objects.

## Seed Registry

The seed registry lives in `src/data/seeds.ts`.

The first seed is `tetrahedron`. It defines four stable seed vertices, four triangular faces, and creates a runtime `Shape` through `createSeedShape`.

Future seeds should be added to `seedRegistry` with stable vertex keys and face definitions. The UI seed selector already reads from this registry.

## Stable IDs

ID helpers live in `src/lib/ids.ts`.

Generated IDs are deterministic from operation context:

- Shape IDs derive from parent shape ID, operation, and generation depth.
- Edge IDs derive from shape ID and canonicalized endpoint IDs.
- Ambo midpoint vertex IDs derive from parent shape ID and canonicalized source edge IDs.
- Face IDs derive from shape ID, face role, source ID, and ordered generated vertices.

This keeps generated vertices stable across repeat application from the same source state.

## Geometry Helpers

Shared geometry utilities live in `src/lib/shape.ts`.

- `createDefaultVertexData` initializes editable packets.
- `midpoint` creates ambo midpoint positions.
- `deriveEdges` builds unique edges from face loops.
- `formatVec3` supports inspector display.

## Ambo Operation

The first recursive operation lives in `src/lib/ambo.ts`.

`applyAmbo(parent)`:

1. Creates one midpoint vertex for each parent edge.
2. Creates faces from each parent face using the edge midpoints around that face.
3. Creates faces around each parent vertex using adjacent midpoint rings.
4. Derives edges from the generated faces.
5. Writes full genealogy onto the generated shape.

The operation is written as a pure function so future operations can follow the same pattern.

## State

Local app state lives in `src/store/geometryStore.ts` and uses Zustand.

The store owns:

- Selected seed key
- Shape dictionary
- Shape history order
- Current shape ID
- Selected vertex ID
- Seed loading
- Applying ambo to the current shape
- Shape selection
- Vertex selection
- Vertex data packet updates

No persistence layer is included yet; all state is in memory.

## UI

The app shell lives in `src/App.tsx`.

Panels live in `src/components/Panels.tsx`:

- Seed selector
- Operation controls
- Object inspector
- Genealogy/history viewer
- Vertex data-packet editor

`src/components/Workspace3D.tsx` renders the current shape with React Three Fiber, Three.js geometry buffers, orbit controls, edge lines, translucent faces, and clickable vertex markers.

## Styling

Tailwind is configured through:

- `tailwind.config.ts`
- `postcss.config.cjs`
- `src/styles.css`

The UI is intentionally compact and tool-like rather than a landing page.

## Next Good Steps

- Add automated tests for `applyAmbo`.
- Add persistence for vertex packets and generated shape history.
- Add more seed shapes to `seedRegistry`.
- Add operation abstractions for additional dissection/rectification operations.
- Add face and edge selection modes once vertex editing feels solid.
