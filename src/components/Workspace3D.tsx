import { OrbitControls } from '@react-three/drei';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  buildDualUniverseRenderGeometry,
  createDualCorrespondenceEdgeInspectionTarget,
  createDualCorrespondenceFaceInspectionTarget,
  createDualCorrespondenceVertexInspectionTarget,
  createDualEdgeInspectionTarget,
  createDualFaceInspectionTarget,
  createDualVertexInspectionTarget,
  resolveDualInspectionTarget,
  type DualUniverseRenderGeometry,
} from '../lib/dualView';
import { type DualInspectionTarget, type InspectionHoverTarget, useGeometryStore } from '../store/geometryStore';
import type { Cell, Edge, Face, Shape, Vec3, Vertex, VertexId } from '../types/geometry';

export function Workspace3D() {
  const shape = useGeometryStore((state) => state.shapes[state.currentShapeId]);
  const cellVisibility = useGeometryStore((state) => state.cellVisibility);
  const explodeAmount = useGeometryStore((state) => state.viewLayout.explodeAmount);
  const dualViewEnabled = useGeometryStore((state) => state.viewLayout.dualViewEnabled);
  const isolateSelectedCell = useGeometryStore((state) => state.viewLayout.isolateSelectedCell);
  const hoverTarget = useGeometryStore((state) => state.hoverTarget);
  const selectedCellId = useGeometryStore((state) => state.selectedCellId);
  const selectCell = useGeometryStore((state) => state.selectCell);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const clearDualInspectionTarget = useGeometryStore((state) => state.clearDualInspectionTarget);
  const [fitViewRequest, setFitViewRequest] = useState(0);
  const [fitSelectedRequest, setFitSelectedRequest] = useState(0);
  const [resetCameraRequest, setResetCameraRequest] = useState(0);
  const selectedCell = useMemo(
    () => shape.cells.find((cell) => cell.id === selectedCellId) ?? null,
    [selectedCellId, shape.cells],
  );
  const sceneBounds = useMemo(
    () => computeVisibleSceneBounds(shape, cellVisibility, explodeAmount, dualViewEnabled),
    [cellVisibility, dualViewEnabled, explodeAmount, shape],
  );
  const selectedSceneBounds = useMemo(
    () =>
      selectedCell && isCellVisible(selectedCell, cellVisibility)
        ? computeCellSceneBounds(shape, selectedCell, explodeAmount, dualViewEnabled)
        : null,
    [cellVisibility, dualViewEnabled, explodeAmount, selectedCell, shape],
  );

  return (
    <div className="relative h-full min-h-0 w-full bg-neutral-950">
      <Canvas
        className="h-full w-full"
        camera={{ position: [3.2, 2.4, 3.8], fov: 45 }}
        onPointerMissed={() => {
          selectCell(null);
          selectVertex(null);
          setHoverTarget(null);
          clearDualInspectionTarget();
        }}
      >
        <color attach="background" args={['#0c0a09']} />
        <ambientLight intensity={0.62} />
        <directionalLight position={[4, 5, 3]} intensity={1.7} />
        <directionalLight position={[-3, -2, -4]} intensity={0.45} color="#67e8f9" />
        <gridHelper args={[6, 12, '#57534e', '#292524']} position={[0, -1.35, 0]} />
        <Polyhedron
          shape={shape}
          cellVisibility={cellVisibility}
          explodeAmount={explodeAmount}
          dualViewEnabled={dualViewEnabled}
          isolateSelectedCell={isolateSelectedCell}
          selectedCellId={selectedCellId}
          hoverTarget={hoverTarget}
          onHoverTarget={setHoverTarget}
        />
        <SceneCameraControls
          sceneBounds={sceneBounds}
          selectedSceneBounds={selectedSceneBounds}
          fitViewRequest={fitViewRequest}
          fitSelectedRequest={fitSelectedRequest}
          resetCameraRequest={resetCameraRequest}
        />
      </Canvas>
      <div className="pointer-events-none absolute left-3 top-3 rounded border border-stone-800 bg-stone-950/85 px-3 py-2 text-xs text-stone-300 shadow-lg">
        {formatHoverStatus(shape, hoverTarget)}
      </div>
      <div className="absolute right-3 top-3 flex gap-2">
        <button
          type="button"
          onClick={() => setFitViewRequest((request) => request + 1)}
          className="rounded border border-stone-700 bg-stone-950/90 px-3 py-2 text-xs font-semibold text-stone-100 shadow-lg transition hover:border-teal-400 hover:text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Fit View
        </button>
        <button
          type="button"
          onClick={() => setFitSelectedRequest((request) => request + 1)}
          disabled={!selectedSceneBounds}
          className="rounded border border-stone-700 bg-stone-950/90 px-3 py-2 text-xs font-semibold text-stone-100 shadow-lg transition hover:border-cyan-300 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:cursor-not-allowed disabled:border-stone-800 disabled:bg-stone-950/70 disabled:text-stone-600"
        >
          Fit Selected
        </button>
        <button
          type="button"
          onClick={() => setResetCameraRequest((request) => request + 1)}
          className="rounded border border-stone-700 bg-stone-950/90 px-3 py-2 text-xs font-semibold text-stone-100 shadow-lg transition hover:border-amber-300 hover:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-300"
        >
          Reset Camera
        </button>
      </div>
    </div>
  );
}

interface SceneBounds {
  center: Vec3;
  radius: number;
}

interface OrbitControlsHandle {
  target: THREE.Vector3;
  update: () => void;
}

const DEFAULT_CAMERA_TARGET = new THREE.Vector3(0, 0, 0);
const DEFAULT_CAMERA_POSITION = new THREE.Vector3(3.2, 2.4, 3.8);
const MIN_CAMERA_DISTANCE = 3.8;

function SceneCameraControls({
  sceneBounds,
  selectedSceneBounds,
  fitViewRequest,
  fitSelectedRequest,
  resetCameraRequest,
}: {
  sceneBounds: SceneBounds;
  selectedSceneBounds: SceneBounds | null;
  fitViewRequest: number;
  fitSelectedRequest: number;
  resetCameraRequest: number;
}) {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsHandle | null>(null);
  const boundsCenter = useMemo(() => vec3ToVector(sceneBounds.center), [sceneBounds.center]);

  const updateCameraClipping = useCallback(
    (distance: number) => {
      if (!(camera instanceof THREE.PerspectiveCamera)) {
        return;
      }

      camera.near = Math.max(0.01, distance / 1000);
      camera.far = Math.max(1000, distance * 100);
      camera.updateProjectionMatrix();
    },
    [camera],
  );

  const fitCameraToBounds = useCallback(
    (bounds: SceneBounds, mode: 'fit' | 'reset') => {
      const controls = controlsRef.current;
      const target = vec3ToVector(bounds.center);
      const radius = Math.max(bounds.radius, 0.5);
      const distance =
        mode === 'fit'
          ? getFitDistance(camera, radius, size.width / Math.max(1, size.height))
          : Math.max(MIN_CAMERA_DISTANCE, radius * 3.1);
      const direction =
        mode === 'fit'
          ? camera.position.clone().sub(controls?.target ?? target)
          : DEFAULT_CAMERA_POSITION.clone().sub(DEFAULT_CAMERA_TARGET);
      const safeDirection =
        direction.lengthSq() > 0.000001
          ? direction.normalize()
          : DEFAULT_CAMERA_POSITION.clone().sub(DEFAULT_CAMERA_TARGET).normalize();

      camera.position.copy(target.clone().add(safeDirection.multiplyScalar(distance)));
      camera.lookAt(target);
      updateCameraClipping(distance);

      if (controls) {
        controls.target.copy(target);
        controls.update();
      }
    },
    [camera, size.height, size.width, updateCameraClipping],
  );

  useEffect(() => {
    const controls = controlsRef.current;

    if (!controls) {
      return;
    }

    controls.target.copy(boundsCenter);
    controls.update();
  }, [boundsCenter]);

  useEffect(() => {
    if (fitViewRequest > 0) {
      fitCameraToBounds(sceneBounds, 'fit');
    }
  }, [fitCameraToBounds, fitViewRequest, sceneBounds]);

  useEffect(() => {
    if (fitSelectedRequest > 0 && selectedSceneBounds) {
      fitCameraToBounds(selectedSceneBounds, 'fit');
    }
  }, [fitCameraToBounds, fitSelectedRequest, selectedSceneBounds]);

  useEffect(() => {
    if (resetCameraRequest > 0) {
      fitCameraToBounds(sceneBounds, 'reset');
    }
  }, [fitCameraToBounds, resetCameraRequest, sceneBounds]);

  return (
    <OrbitControls
      ref={(controls) => {
        controlsRef.current = controls as OrbitControlsHandle | null;
      }}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      enablePan
      enableRotate
      enableZoom
      maxDistance={240}
      minDistance={0.2}
      panSpeed={0.9}
      rotateSpeed={0.75}
      screenSpacePanning
      zoomSpeed={0.9}
    />
  );
}

interface CellVisibility {
  showCoreCells: boolean;
  showResidueCells: boolean;
  showParentCells: boolean;
}

function Polyhedron({
  shape,
  cellVisibility,
  explodeAmount,
  dualViewEnabled,
  isolateSelectedCell,
  selectedCellId,
  hoverTarget,
  onHoverTarget,
}: {
  shape: Shape;
  cellVisibility: CellVisibility;
  explodeAmount: number;
  dualViewEnabled: boolean;
  isolateSelectedCell: boolean;
  selectedCellId: string | null;
  hoverTarget: InspectionHoverTarget | null;
  onHoverTarget: (target: InspectionHoverTarget | null) => void;
}) {
  const visibleCells = useMemo(
    () => shape.cells.filter((cell) => isCellVisible(cell, cellVisibility)),
    [cellVisibility, shape.cells],
  );
  const displayOffsets = useMemo(
    () => computeCellDisplayOffsets(shape, explodeAmount),
    [explodeAmount, shape],
  );
  const vertexGenerations = useMemo(() => getVertexGenerations(shape), [shape]);

  return (
    <group>
      {visibleCells.map((cell, index) => (
        <CellMesh
          key={cell.id}
          shape={shape}
          cell={cell}
          isSelected={cell.id === selectedCellId}
          isHovered={isCellHoverTarget(hoverTarget, cell.id)}
          isDimmed={isolateSelectedCell && Boolean(selectedCellId) && cell.id !== selectedCellId}
          hoverTarget={hoverTarget}
          onHoverTarget={onHoverTarget}
          vertexGenerations={vertexGenerations}
          displayOffset={displayOffsets.get(cell.id) ?? [0, 0, 0]}
          explodeAmount={explodeAmount}
          dualViewEnabled={dualViewEnabled}
          renderIndex={index}
        />
      ))}
    </group>
  );
}

function CellMesh({
  shape,
  cell,
  isSelected,
  isHovered,
  isDimmed,
  hoverTarget,
  onHoverTarget,
  vertexGenerations,
  displayOffset,
  explodeAmount,
  dualViewEnabled,
  renderIndex,
}: {
  shape: Shape;
  cell: Cell;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  hoverTarget: InspectionHoverTarget | null;
  onHoverTarget: (target: InspectionHoverTarget | null) => void;
  vertexGenerations: Map<VertexId, number>;
  displayOffset: Vec3;
  explodeAmount: number;
  dualViewEnabled: boolean;
  renderIndex: number;
}) {
  const selectCell = useGeometryStore((state) => state.selectCell);
  const clearDualInspectionTarget = useGeometryStore((state) => state.clearDualInspectionTarget);
  const setDualInspectionTarget = useGeometryStore((state) => state.setDualInspectionTarget);
  const dualInspectionTarget = useGeometryStore((state) => state.dualInspectionTarget);
  const renderGeometry = useMemo(
    () => createCellRenderGeometry(shape, cell, dualViewEnabled),
    [cell, dualViewEnabled, shape],
  );
  const sourceCounterpartHighlight = useMemo(
    () => createSourceCounterpartHighlight(shape, cell, renderGeometry, dualInspectionTarget),
    [cell, dualInspectionTarget, renderGeometry, shape],
  );
  const faceGeometry = useMemo(
    () => createFaceGeometry(renderGeometry.vertices, renderGeometry.faces),
    [renderGeometry],
  );
  const edgeGeometry = useMemo(
    () =>
      createEdgeGeometry(
        renderGeometry.vertices,
        renderGeometry.edges,
        (edge) => edge.role !== 'construction-diagonal',
      ),
    [renderGeometry],
  );
  const constructionDiagonalGeometry = useMemo(
    () =>
      createEdgeGeometry(
        renderGeometry.vertices,
        renderGeometry.edges,
        (edge) => edge.role === 'construction-diagonal',
      ),
    [renderGeometry],
  );
  const hoverFaceGeometry = useMemo(
    () => createHoverFaceGeometry(renderGeometry, hoverTarget),
    [hoverTarget, renderGeometry],
  );
  const hoverEdgeGeometry = useMemo(
    () => createHoverEdgeGeometry(renderGeometry, hoverTarget),
    [hoverTarget, renderGeometry],
  );
  const usesDualInspectionTargets =
    renderGeometry.dualUniverse?.kind === 'semantic-model' ||
    renderGeometry.dualUniverse?.kind === 'correspondence-proxy';
  const style = cellStyle(
    cell,
    isSelected,
    isHovered,
    isDimmed,
    explodeAmount,
    renderGeometry.mode,
  );

  return (
    <group position={displayOffset}>
      <mesh geometry={faceGeometry}>
        <meshStandardMaterial
          color={style.faceColor}
          opacity={style.faceOpacity}
          roughness={0.82}
          side={THREE.DoubleSide}
          transparent
          polygonOffset
          polygonOffsetFactor={1 + renderIndex * 0.25}
          polygonOffsetUnits={1}
        />
      </mesh>
      <mesh
        geometry={faceGeometry}
        onPointerDown={(event) => {
          if (!usesDualInspectionTargets) {
            return;
          }

          event.stopPropagation();
          const target = createDualFaceTargetFromEvent(renderGeometry, event.faceIndex);

          if (target) {
            setDualInspectionTarget(target);
          }
        }}
        onClick={(event) => {
          event.stopPropagation();
          if (usesDualInspectionTargets) {
            return;
          }

          clearDualInspectionTarget();
          selectCell(cell.id);
        }}
        onPointerMove={(event) => {
          event.stopPropagation();
          if (!usesDualInspectionTargets) {
            onHoverTarget({ kind: 'cell', cellId: cell.id });
          }
          document.body.style.cursor = 'pointer';
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          if (!usesDualInspectionTargets) {
            onHoverTarget({ kind: 'cell', cellId: cell.id });
          }
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(event) => {
          event.stopPropagation();
          onHoverTarget(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <meshBasicMaterial
          color="#ffffff"
          depthWrite={false}
          opacity={0.01}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
      {edgeGeometry ? (
        <lineSegments geometry={edgeGeometry} raycast={() => null}>
          <lineBasicMaterial color={style.edgeColor} transparent opacity={style.edgeOpacity} />
        </lineSegments>
      ) : null}
      {constructionDiagonalGeometry ? (
        <lineSegments geometry={constructionDiagonalGeometry} raycast={() => null}>
          <lineBasicMaterial color="#fb7185" transparent opacity={Math.max(style.edgeOpacity, 0.92)} />
        </lineSegments>
      ) : null}
      {hoverFaceGeometry ? (
        <mesh geometry={hoverFaceGeometry} raycast={() => null}>
          <meshBasicMaterial
            color="#facc15"
            depthWrite={false}
            opacity={0.34}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
            side={THREE.DoubleSide}
            transparent
          />
        </mesh>
      ) : null}
      {hoverEdgeGeometry ? (
        <lineSegments geometry={hoverEdgeGeometry} raycast={() => null}>
          <lineBasicMaterial color="#fb923c" transparent opacity={1} />
        </lineSegments>
      ) : null}
      {usesDualInspectionTargets ? (
        <DualInspectionTargets renderGeometry={renderGeometry} />
      ) : null}
      {sourceCounterpartHighlight ? (
        <SourceCounterpartHighlightDisplay highlight={sourceCounterpartHighlight} shape={shape} />
      ) : null}
      {renderGeometry.showVertexMarkers
        ? cell.vertexIds.map((vertexId) => {
            const vertex = shape.vertices[vertexId];

            return vertex ? (
              <VertexMarker
                key={`${cell.id}:${vertex.id}`}
                vertex={vertex}
                vertexGeneration={vertexGenerations.get(vertex.id) ?? 0}
                cellIsSelected={isSelected}
                cellIsHovered={isHovered}
                isDimmed={isDimmed}
              />
            ) : null;
          })
        : null}
    </group>
  );
}

function VertexMarker({
  vertex,
  vertexGeneration,
  cellIsSelected,
  cellIsHovered,
  isDimmed,
}: {
  vertex: Vertex;
  vertexGeneration: number;
  cellIsSelected: boolean;
  cellIsHovered: boolean;
  isDimmed: boolean;
}) {
  const selectedVertexId = useGeometryStore((state) => state.selectedVertexId);
  const selectVertex = useGeometryStore((state) => state.selectVertex);
  const hoverTarget = useGeometryStore((state) => state.hoverTarget);
  const setHoverTarget = useGeometryStore((state) => state.setHoverTarget);
  const isSelected = selectedVertexId === vertex.id;
  const isHovered = isVertexHoverTarget(hoverTarget, vertex.id);
  const scale = getVertexMarkerScale(vertexGeneration, {
    isSelected,
    isHovered,
    cellIsSelected,
    cellIsHovered,
  });
  const opacity = isDimmed && !isSelected && !isHovered ? 0.28 : 1;
  const markerColor = isSelected
    ? '#f59e0b'
    : isHovered
      ? '#facc15'
      : cellIsSelected
        ? '#fef3c7'
        : vertex.data.color;
  const emissiveColor = isSelected || isHovered ? '#92400e' : cellIsSelected ? '#78350f' : '#000000';
  const emissiveIntensity = isSelected ? 0.85 : isHovered ? 0.7 : cellIsSelected ? 0.35 : 0;

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    selectVertex(vertex.id);
  };

  return (
    <mesh
      position={vertex.position}
      scale={scale}
      onClick={handleClick}
      onPointerEnter={(event) => {
        event.stopPropagation();
        setHoverTarget({ kind: 'vertex', vertexId: vertex.id });
        document.body.style.cursor = 'pointer';
      }}
      onPointerLeave={() => {
        setHoverTarget(null);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[0.075, 24, 16]} />
      <meshStandardMaterial
        color={markerColor}
        emissive={emissiveColor}
        emissiveIntensity={emissiveIntensity}
        opacity={opacity}
        roughness={0.45}
        transparent={opacity < 1}
      />
    </mesh>
  );
}

interface RenderVertex {
  id: string;
  position: Vec3;
}

interface RenderFace {
  id: string;
  vertexIds: string[];
}

interface RenderEdge {
  id?: string;
  vertexIds: [string, string];
  role?: Edge['role'];
  sourceEdgeId?: Edge['sourceEdgeId'];
  sourceCellId?: Edge['sourceCellId'];
}

interface CellRenderGeometry {
  vertices: RenderVertex[];
  faces: RenderFace[];
  edges: RenderEdge[];
  mode: 'original' | 'dual-proxy' | 'dual-unsupported';
  topology?: string;
  showVertexMarkers: boolean;
  dualUniverse?: DualUniverseRenderGeometry;
}

interface SourceFaceCounterpartHighlight {
  kind: 'face';
  face: RenderFace;
  context: {
    adjacentFaces: RenderFace[];
    boundaryEdges: RenderEdge[];
    cornerVertices: RenderVertex[];
  };
}

interface SourceVertexCounterpartHighlight {
  kind: 'vertex';
  vertex: RenderVertex;
  context: {
    incidentEdges: RenderEdge[];
    incidentFaces: RenderFace[];
  };
}

interface SourceEdgeCounterpartHighlight {
  kind: 'edge';
  edge: RenderEdge;
  context: {
    adjacentFaces: RenderFace[];
    endpointVertices: RenderVertex[];
  };
}

type SourceCounterpartHighlight =
  | SourceFaceCounterpartHighlight
  | SourceVertexCounterpartHighlight
  | SourceEdgeCounterpartHighlight;

function SourceCounterpartHighlightDisplay({
  highlight,
  shape,
}: {
  highlight: SourceCounterpartHighlight;
  shape: Shape;
}) {
  if (highlight.kind === 'face') {
    return <SourceFaceCounterpartHighlightDisplay highlight={highlight} shape={shape} />;
  }

  if (highlight.kind === 'edge') {
    return <SourceEdgeCounterpartHighlightDisplay highlight={highlight} shape={shape} />;
  }

  return <SourceVertexCounterpartHighlightDisplay highlight={highlight} shape={shape} />;
}

function SourceFaceCounterpartHighlightDisplay({
  highlight,
  shape,
}: {
  highlight: SourceFaceCounterpartHighlight;
  shape: Shape;
}) {
  const vertices = useMemo(() => createShapeRenderVertices(shape), [shape]);

  return (
    <>
      <SemanticSourceFaceLayer
        vertices={vertices}
        faces={highlight.context.adjacentFaces}
        color="#0891b2"
        opacity={0.09}
        polygonOffsetFactor={-4}
      />
      <SemanticSourceFaceLayer
        vertices={vertices}
        faces={[highlight.face]}
        color="#22d3ee"
        opacity={0.38}
        polygonOffsetFactor={-3}
      />
      <SemanticSourceEdgeLayer
        vertices={vertices}
        edges={highlight.context.boundaryEdges}
        color="#67e8f9"
        opacity={1}
      />
      <SemanticSourceVertexMarkers
        vertices={highlight.context.cornerVertices}
        color="#67e8f9"
        emissive="#155e75"
        emissiveIntensity={0.32}
        opacity={0.78}
        radius={0.045}
      />
    </>
  );
}

function SourceVertexCounterpartHighlightDisplay({
  highlight,
  shape,
}: {
  highlight: SourceVertexCounterpartHighlight;
  shape: Shape;
}) {
  const vertices = useMemo(() => createShapeRenderVertices(shape), [shape]);

  return (
    <>
      <SemanticSourceFaceLayer
        vertices={vertices}
        faces={highlight.context.incidentFaces}
        color="#0891b2"
        opacity={0.1}
        polygonOffsetFactor={-4}
      />
      <SemanticSourceEdgeLayer
        vertices={vertices}
        edges={highlight.context.incidentEdges}
        color="#67e8f9"
        opacity={0.58}
      />
      <SemanticSourceVertexMarkers
        vertices={[highlight.vertex]}
        color="#22d3ee"
        emissive="#155e75"
        emissiveIntensity={0.72}
        opacity={0.92}
        radius={0.09}
      />
    </>
  );
}

function SourceEdgeCounterpartHighlightDisplay({
  highlight,
  shape,
}: {
  highlight: SourceEdgeCounterpartHighlight;
  shape: Shape;
}) {
  const vertices = useMemo(() => createShapeRenderVertices(shape), [shape]);

  return (
    <>
      <SemanticSourceFaceLayer
        vertices={vertices}
        faces={highlight.context.adjacentFaces}
        color="#0891b2"
        opacity={0.11}
        polygonOffsetFactor={-4}
      />
      <SemanticSourceVertexMarkers
        vertices={highlight.context.endpointVertices}
        color="#67e8f9"
        emissive="#155e75"
        emissiveIntensity={0.34}
        opacity={0.8}
        radius={0.052}
      />
      <SemanticSourceEdgeLayer vertices={vertices} edges={[highlight.edge]} color="#22d3ee" opacity={1} />
    </>
  );
}

function SemanticSourceFaceLayer({
  vertices,
  faces,
  color,
  opacity,
  polygonOffsetFactor,
}: {
  vertices: RenderVertex[];
  faces: RenderFace[];
  color: string;
  opacity: number;
  polygonOffsetFactor: number;
}) {
  const faceGeometry = useMemo(() => createFaceGeometry(vertices, faces), [faces, vertices]);

  if (!faces.length) {
    return null;
  }

  return (
    <mesh geometry={faceGeometry} raycast={() => null}>
      <meshBasicMaterial
        color={color}
        depthWrite={false}
        opacity={opacity}
        polygonOffset
        polygonOffsetFactor={polygonOffsetFactor}
        polygonOffsetUnits={polygonOffsetFactor}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}

function SemanticSourceEdgeLayer({
  vertices,
  edges,
  color,
  opacity,
}: {
  vertices: RenderVertex[];
  edges: RenderEdge[];
  color: string;
  opacity: number;
}) {
  const edgeGeometry = useMemo(
    () => createEdgeGeometry(vertices, edges, () => true),
    [edges, vertices],
  );

  return edgeGeometry ? (
    <lineSegments geometry={edgeGeometry} raycast={() => null}>
      <lineBasicMaterial color={color} transparent opacity={opacity} />
    </lineSegments>
  ) : null;
}

function SemanticSourceVertexMarkers({
  vertices,
  color,
  emissive,
  emissiveIntensity,
  opacity,
  radius,
}: {
  vertices: RenderVertex[];
  color: string;
  emissive: string;
  emissiveIntensity: number;
  opacity: number;
  radius: number;
}) {
  return (
    <>
      {vertices.map((vertex) => (
        <mesh key={`source-context-vertex:${vertex.id}`} position={vertex.position} raycast={() => null}>
          <sphereGeometry args={[radius, 24, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={emissiveIntensity}
            opacity={opacity}
            roughness={0.32}
            transparent
          />
        </mesh>
      ))}
    </>
  );
}

function DualInspectionTargets({
  renderGeometry,
}: {
  renderGeometry: CellRenderGeometry;
}) {
  const setDualInspectionTarget = useGeometryStore((state) => state.setDualInspectionTarget);
  const semanticRenderGeometry =
    renderGeometry.dualUniverse?.kind === 'semantic-model' ? renderGeometry.dualUniverse : null;
  const correspondenceRenderGeometry =
    renderGeometry.dualUniverse?.kind === 'correspondence-proxy' ? renderGeometry.dualUniverse : null;
  const vertexById = useMemo(
    () => new Map(renderGeometry.vertices.map((vertex) => [vertex.id, vertex])),
    [renderGeometry.vertices],
  );

  if (!semanticRenderGeometry && !correspondenceRenderGeometry) {
    return null;
  }

  const semanticModel = semanticRenderGeometry?.viewModel.semanticModel ?? null;
  const correspondenceModel = correspondenceRenderGeometry?.viewModel.correspondenceProxy.correspondenceModel ?? null;

  return (
    <>
      {renderGeometry.faces.map((face) => {
        const target = semanticModel
          ? createDualFaceInspectionTarget(semanticModel, face.id)
          : correspondenceModel
            ? createDualCorrespondenceFaceInspectionTarget(correspondenceModel, face.id)
            : null;

        return target ? (
          <DualFaceInspectionTarget
            key={`dual-face-hit:${face.id}`}
            face={face}
            renderGeometry={renderGeometry}
            onInspect={() => setDualInspectionTarget(target)}
          />
        ) : null;
      })}
      {renderGeometry.edges.map((edge) => {
        const target = edge.id
          ? semanticModel
            ? createDualEdgeInspectionTarget(semanticModel, edge.id)
            : correspondenceModel
              ? createDualCorrespondenceEdgeInspectionTarget(correspondenceModel, edge.id)
              : null
          : null;

        return target ? (
          <DualEdgeInspectionTarget
            key={`dual-edge-hit:${edge.id}`}
            edge={edge}
            vertexById={vertexById}
            onInspect={() => setDualInspectionTarget(target)}
          />
        ) : null;
      })}
      {renderGeometry.vertices.map((vertex) => {
        const target = semanticModel
          ? createDualVertexInspectionTarget(semanticModel, vertex.id)
          : correspondenceModel
            ? createDualCorrespondenceVertexInspectionTarget(correspondenceModel, vertex.id)
            : null;

        return target ? (
          <DualVertexInspectionMarker
            key={`dual-vertex-marker:${vertex.id}`}
            vertex={vertex}
            onInspect={() => setDualInspectionTarget(target)}
          />
        ) : null;
      })}
    </>
  );
}

function DualVertexInspectionMarker({
  vertex,
  onInspect,
}: {
  vertex: RenderVertex;
  onInspect: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      return undefined;
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isHovered]);

  return (
    <mesh
      position={vertex.position}
      scale={isHovered ? 1.24 : 1}
      onPointerDown={(event) => {
        event.stopPropagation();
        onInspect();
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setIsHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[0.058, 20, 14]} />
      <meshStandardMaterial
        color={isHovered ? '#f5d0fe' : '#e879f9'}
        emissive="#86198f"
        emissiveIntensity={isHovered ? 0.55 : 0.28}
        roughness={0.38}
      />
    </mesh>
  );
}

function DualFaceInspectionTarget({
  face,
  renderGeometry,
  onInspect,
}: {
  face: RenderFace;
  renderGeometry: CellRenderGeometry;
  onInspect: () => void;
}) {
  const geometry = useMemo(
    () => createFaceGeometry(renderGeometry.vertices, [face]),
    [face, renderGeometry.vertices],
  );

  return (
    <mesh
      geometry={geometry}
      onPointerDown={(event) => {
        event.stopPropagation();
        onInspect();
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <meshBasicMaterial
        color="#ffffff"
        depthWrite={false}
        opacity={0.001}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
}

function DualEdgeInspectionTarget({
  edge,
  vertexById,
  onInspect,
}: {
  edge: RenderEdge;
  vertexById: Map<string, RenderVertex>;
  onInspect: () => void;
}) {
  const transform = useMemo(() => {
    const vertexA = vertexById.get(edge.vertexIds[0]);
    const vertexB = vertexById.get(edge.vertexIds[1]);

    if (!vertexA || !vertexB) {
      return null;
    }

    const start = new THREE.Vector3(...vertexA.position);
    const end = new THREE.Vector3(...vertexB.position);
    const direction = end.clone().sub(start);
    const length = direction.length();

    if (length < 0.0001) {
      return null;
    }

    return {
      length,
      position: start.add(end).multiplyScalar(0.5),
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        direction.normalize(),
      ),
    };
  }, [edge.vertexIds, vertexById]);

  if (!transform) {
    return null;
  }

  return (
    <mesh
      position={transform.position}
      quaternion={transform.quaternion}
      onPointerDown={(event) => {
        event.stopPropagation();
        onInspect();
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'auto';
      }}
    >
      <cylinderGeometry args={[0.035, 0.035, transform.length, 8, 1]} />
      <meshBasicMaterial color="#ffffff" depthWrite={false} opacity={0.001} transparent />
    </mesh>
  );
}

function createDualFaceTargetFromEvent(
  renderGeometry: CellRenderGeometry,
  faceIndex: number | null | undefined,
) {
  const semanticRenderGeometry =
    renderGeometry.dualUniverse?.kind === 'semantic-model' ? renderGeometry.dualUniverse : null;
  const correspondenceRenderGeometry =
    renderGeometry.dualUniverse?.kind === 'correspondence-proxy' ? renderGeometry.dualUniverse : null;

  if ((!semanticRenderGeometry && !correspondenceRenderGeometry) || faceIndex == null) {
    return null;
  }

  const face = getRenderFaceForTriangleIndex(renderGeometry.faces, faceIndex);

  if (!face) {
    return null;
  }

  if (semanticRenderGeometry) {
    return createDualFaceInspectionTarget(semanticRenderGeometry.viewModel.semanticModel, face.id);
  }

  return correspondenceRenderGeometry
    ? createDualCorrespondenceFaceInspectionTarget(
        correspondenceRenderGeometry.viewModel.correspondenceProxy.correspondenceModel,
        face.id,
      )
    : null;
}

function getRenderFaceForTriangleIndex(
  faces: RenderFace[],
  triangleIndex: number,
): RenderFace | null {
  let firstTriangleIndex = 0;

  for (const face of faces) {
    const triangleCount = Math.max(0, face.vertexIds.length - 2);

    if (triangleIndex >= firstTriangleIndex && triangleIndex < firstTriangleIndex + triangleCount) {
      return face;
    }

    firstTriangleIndex += triangleCount;
  }

  return null;
}

function createCellRenderGeometry(
  shape: Shape,
  cell: Cell,
  dualViewEnabled: boolean,
): CellRenderGeometry {
  if (dualViewEnabled) {
    const dualRenderGeometry = buildDualUniverseRenderGeometry(shape, cell);

    if (
      dualRenderGeometry.kind === 'correspondence-proxy' ||
      dualRenderGeometry.kind === 'semantic-model'
    ) {
      return {
        vertices: dualRenderGeometry.vertices,
        faces: dualRenderGeometry.faces,
        edges: dualRenderGeometry.edges,
        mode: 'dual-proxy',
        topology: dualRenderGeometry.topology,
        showVertexMarkers: false,
        dualUniverse: dualRenderGeometry,
      };
    }

    return {
      ...createOriginalRenderGeometry(shape, cell),
      mode: 'dual-unsupported',
      showVertexMarkers: false,
      dualUniverse: dualRenderGeometry,
    };
  }

  return createOriginalRenderGeometry(shape, cell);
}

function createOriginalRenderGeometry(shape: Shape, cell: Cell): CellRenderGeometry {
  const faces = facesForCell(shape, cell).map((face) => ({
    id: face.id,
    vertexIds: face.vertexIds,
  }));

  return {
    vertices: createShapeRenderVertices(shape),
    faces,
    edges: edgesForCell(shape, faces),
    mode: 'original',
    showVertexMarkers: true,
  };
}

function createSourceCounterpartHighlight(
  shape: Shape,
  cell: Cell,
  renderGeometry: CellRenderGeometry,
  target: DualInspectionTarget | null,
): SourceCounterpartHighlight | null {
  const semanticRenderGeometry =
    renderGeometry.dualUniverse?.kind === 'semantic-model' ? renderGeometry.dualUniverse : null;
  const correspondenceRenderGeometry =
    renderGeometry.dualUniverse?.kind === 'correspondence-proxy' ? renderGeometry.dualUniverse : null;

  if (!target || (!semanticRenderGeometry && !correspondenceRenderGeometry)) {
    return null;
  }

  const resolvedTarget = resolveDualInspectionTarget(shape, target);

  if (!resolvedTarget || resolvedTarget.sourceCell.id !== cell.id) {
    return null;
  }

  if (semanticRenderGeometry) {
    const semanticModel = semanticRenderGeometry.viewModel.semanticModel;

    if (
      resolvedTarget.modelKind !== 'semantic' ||
      resolvedTarget.semanticModel.sourceCellId !== semanticModel.sourceCellId ||
      resolvedTarget.semanticModel.dualModelId !== semanticModel.dualModelId
    ) {
      return null;
    }
  } else if (correspondenceRenderGeometry) {
    const correspondenceModel = correspondenceRenderGeometry.viewModel.correspondenceProxy.correspondenceModel;

    if (
      resolvedTarget.modelKind !== 'correspondence' ||
      resolvedTarget.correspondenceModel.sourceCellId !== correspondenceModel.sourceCellId ||
      resolvedTarget.correspondenceModel.dualModelId !== correspondenceModel.dualModelId
    ) {
      return null;
    }
  }

  if (resolvedTarget.kind === 'vertex') {
    const sourceFace = resolvedTarget.sourceFace;

    return sourceFace && cell.faceIds.includes(sourceFace.id)
      ? createSourceFaceCounterpartHighlight(shape, cell, sourceFace)
      : null;
  }

  if (resolvedTarget.kind === 'face') {
    const sourceVertex = resolvedTarget.sourceVertex;

    return sourceVertex && cell.vertexIds.includes(sourceVertex.id)
      ? createSourceVertexCounterpartHighlight(shape, cell, sourceVertex)
      : null;
  }

  if (resolvedTarget.kind === 'edge') {
    const sourceEdge = resolvedTarget.sourceEdge;

    return sourceEdge && edgeBelongsToCell(shape, cell, sourceEdge.vertexIds)
      ? createSourceEdgeCounterpartHighlight(shape, cell, sourceEdge)
      : null;
  }

  return null;
}

function createSourceFaceCounterpartHighlight(
  shape: Shape,
  cell: Cell,
  sourceFace: Face,
): SourceFaceCounterpartHighlight {
  const sourceRenderFace = renderFaceFromFace(sourceFace);
  const boundaryEdges = edgesForRenderFaces([sourceRenderFace]);
  const adjacentFaces = facesForCell(shape, cell)
    .filter(
      (face) =>
        face.id !== sourceFace.id &&
        boundaryEdges.some((edge) => faceContainsVertexPair(face.vertexIds, ...edge.vertexIds)),
    )
    .map(renderFaceFromFace);
  const cornerVertices = sourceFace.vertexIds
    .map((vertexId) => shape.vertices[vertexId])
    .filter((vertex): vertex is Vertex => Boolean(vertex))
    .map(renderVertexFromVertex);

  return {
    kind: 'face',
    face: sourceRenderFace,
    context: {
      adjacentFaces,
      boundaryEdges,
      cornerVertices,
    },
  };
}

function createSourceVertexCounterpartHighlight(
  shape: Shape,
  cell: Cell,
  sourceVertex: Vertex,
): SourceVertexCounterpartHighlight {
  const incidentFaces = facesForCell(shape, cell)
    .filter((face) => face.vertexIds.includes(sourceVertex.id))
    .map(renderFaceFromFace);
  const incidentEdges = edgesForRenderFaces(incidentFaces).filter((edge) =>
    edge.vertexIds.includes(sourceVertex.id),
  );

  return {
    kind: 'vertex',
    vertex: renderVertexFromVertex(sourceVertex),
    context: {
      incidentEdges,
      incidentFaces,
    },
  };
}

function createSourceEdgeCounterpartHighlight(
  shape: Shape,
  cell: Cell,
  sourceEdge: Edge,
): SourceEdgeCounterpartHighlight {
  const adjacentFaces = facesForCell(shape, cell)
    .filter((face) => faceContainsVertexPair(face.vertexIds, ...sourceEdge.vertexIds))
    .map(renderFaceFromFace);
  const endpointVertices = sourceEdge.vertexIds
    .map((vertexId) => shape.vertices[vertexId])
    .filter((vertex): vertex is Vertex => Boolean(vertex))
    .map(renderVertexFromVertex);

  return {
    kind: 'edge',
    edge: { id: sourceEdge.id, vertexIds: sourceEdge.vertexIds, role: sourceEdge.role },
    context: {
      adjacentFaces,
      endpointVertices,
    },
  };
}

function createShapeRenderVertices(shape: Shape): RenderVertex[] {
  return Object.values(shape.vertices).map((vertex) => ({
    id: vertex.id,
    position: vertex.position,
  }));
}

function renderFaceFromFace(face: Face): RenderFace {
  return {
    id: face.id,
    vertexIds: face.vertexIds,
  };
}

function renderVertexFromVertex(vertex: Vertex): RenderVertex {
  return {
    id: vertex.id,
    position: vertex.position,
  };
}

function computeVisibleSceneBounds(
  shape: Shape,
  cellVisibility: CellVisibility,
  explodeAmount: number,
  dualViewEnabled: boolean,
): SceneBounds {
  const displayOffsets = computeCellDisplayOffsets(shape, explodeAmount);
  const positions: Vec3[] = [];

  for (const cell of shape.cells) {
    if (!isCellVisible(cell, cellVisibility)) {
      continue;
    }

    const renderGeometry = createCellRenderGeometry(shape, cell, dualViewEnabled);
    const vertexById = new Map(renderGeometry.vertices.map((vertex) => [vertex.id, vertex]));
    const referencedVertexIds = new Set<string>();

    for (const face of renderGeometry.faces) {
      face.vertexIds.forEach((vertexId) => referencedVertexIds.add(vertexId));
    }

    for (const edge of renderGeometry.edges) {
      edge.vertexIds.forEach((vertexId) => referencedVertexIds.add(vertexId));
    }

    if (!referencedVertexIds.size) {
      renderGeometry.vertices.forEach((vertex) => referencedVertexIds.add(vertex.id));
    }

    const displayOffset = displayOffsets.get(cell.id) ?? [0, 0, 0];

    for (const vertexId of referencedVertexIds) {
      const vertex = vertexById.get(vertexId);

      if (vertex) {
        positions.push(addVec3(vertex.position, displayOffset));
      }
    }
  }

  if (!positions.length) {
    return { center: [0, 0, 0], radius: 2.4 };
  }

  const minimum = positions.reduce<Vec3>(
    (current, position) => [
      Math.min(current[0], position[0]),
      Math.min(current[1], position[1]),
      Math.min(current[2], position[2]),
    ],
    [Infinity, Infinity, Infinity],
  );
  const maximum = positions.reduce<Vec3>(
    (current, position) => [
      Math.max(current[0], position[0]),
      Math.max(current[1], position[1]),
      Math.max(current[2], position[2]),
    ],
    [-Infinity, -Infinity, -Infinity],
  );
  const center: Vec3 = scaleVec3(addVec3(minimum, maximum), 0.5);
  const radius = positions.reduce(
    (current, position) => Math.max(current, lengthVec3(subtractVec3(position, center))),
    0,
  );

  return { center, radius: Math.max(radius, 1.2) };
}

function computeCellSceneBounds(
  shape: Shape,
  cell: Cell,
  explodeAmount: number,
  dualViewEnabled: boolean,
): SceneBounds {
  const displayOffset = computeCellDisplayOffsets(shape, explodeAmount).get(cell.id) ?? [0, 0, 0];
  const renderGeometry = createCellRenderGeometry(shape, cell, dualViewEnabled);
  const vertexById = new Map(renderGeometry.vertices.map((vertex) => [vertex.id, vertex]));
  const referencedVertexIds = new Set<string>();

  for (const face of renderGeometry.faces) {
    face.vertexIds.forEach((vertexId) => referencedVertexIds.add(vertexId));
  }

  for (const edge of renderGeometry.edges) {
    edge.vertexIds.forEach((vertexId) => referencedVertexIds.add(vertexId));
  }

  if (!referencedVertexIds.size) {
    renderGeometry.vertices.forEach((vertex) => referencedVertexIds.add(vertex.id));
  }

  const positions = Array.from(referencedVertexIds)
    .map((vertexId) => vertexById.get(vertexId))
    .filter((vertex): vertex is RenderVertex => Boolean(vertex))
    .map((vertex) => addVec3(vertex.position, displayOffset));

  return positionsToSceneBounds(positions);
}

function positionsToSceneBounds(positions: Vec3[]): SceneBounds {
  if (!positions.length) {
    return { center: [0, 0, 0], radius: 2.4 };
  }

  const minimum = positions.reduce<Vec3>(
    (current, position) => [
      Math.min(current[0], position[0]),
      Math.min(current[1], position[1]),
      Math.min(current[2], position[2]),
    ],
    [Infinity, Infinity, Infinity],
  );
  const maximum = positions.reduce<Vec3>(
    (current, position) => [
      Math.max(current[0], position[0]),
      Math.max(current[1], position[1]),
      Math.max(current[2], position[2]),
    ],
    [-Infinity, -Infinity, -Infinity],
  );
  const center: Vec3 = scaleVec3(addVec3(minimum, maximum), 0.5);
  const radius = positions.reduce(
    (current, position) => Math.max(current, lengthVec3(subtractVec3(position, center))),
    0,
  );

  return { center, radius: Math.max(radius, 1.2) };
}

function getFitDistance(camera: THREE.Camera, radius: number, aspect: number): number {
  if (!(camera instanceof THREE.PerspectiveCamera)) {
    return Math.max(MIN_CAMERA_DISTANCE, radius * 3.1);
  }

  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(0.1, aspect));
  const fitFov = Math.max(0.1, Math.min(verticalFov, horizontalFov));

  return Math.max(MIN_CAMERA_DISTANCE, (radius / Math.sin(fitFov / 2)) * 1.15);
}

function vec3ToVector([x, y, z]: Vec3): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

function createFaceGeometry(vertices: RenderVertex[], faces: RenderFace[]): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const indices: number[] = [];
  const vertexIndex = new Map<string, number>();

  vertices.forEach((vertex, index) => {
    vertexIndex.set(vertex.id, index);
    positions.push(...vertex.position);
  });

  for (const face of faces) {
    if (face.vertexIds.length < 3) {
      continue;
    }

    const base = vertexIndex.get(face.vertexIds[0]);

    if (base === undefined) {
      continue;
    }

    for (let index = 1; index < face.vertexIds.length - 1; index += 1) {
      const b = vertexIndex.get(face.vertexIds[index]);
      const c = vertexIndex.get(face.vertexIds[index + 1]);

      if (b !== undefined && c !== undefined) {
        indices.push(base, b, c);
      }
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function createEdgeGeometry(
  vertices: RenderVertex[],
  edges: RenderEdge[],
  includeEdge: (edge: RenderEdge) => boolean,
): THREE.BufferGeometry | null {
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const vertexById = new Map(vertices.map((vertex) => [vertex.id, vertex]));

  for (const edge of edges) {
    if (!includeEdge(edge)) {
      continue;
    }

    const [a, b] = edge.vertexIds;
    const vertexA = vertexById.get(a);
    const vertexB = vertexById.get(b);

    if (vertexA && vertexB) {
      positions.push(...vertexA.position, ...vertexB.position);
    }
  }

  if (!positions.length) {
    return null;
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  return geometry;
}

function edgesForCell(shape: Shape, faces: RenderFace[]): RenderEdge[] {
  const shapeEdgesByKey = new Map(shape.edges.map((edge) => [renderEdgeKey(edge.vertexIds), edge]));

  return edgesForRenderFaces(faces).map((edge) => ({
    ...edge,
    role: shapeEdgesByKey.get(renderEdgeKey(edge.vertexIds))?.role,
  }));
}

function edgesForRenderFaces(faces: RenderFace[]): RenderEdge[] {
  const edges = new Map<string, RenderEdge>();

  for (const face of faces) {
    for (let index = 0; index < face.vertexIds.length; index += 1) {
      const a = face.vertexIds[index];
      const b = face.vertexIds[(index + 1) % face.vertexIds.length];
      const key = renderEdgeKey([a, b]);

      if (!edges.has(key)) {
        edges.set(key, { vertexIds: [a, b] });
      }
    }
  }

  return Array.from(edges.values());
}

function renderEdgeKey([a, b]: [string, string]): string {
  return [a, b].sort().join('|');
}

function createHoverFaceGeometry(
  renderGeometry: CellRenderGeometry,
  hoverTarget: InspectionHoverTarget | null,
): THREE.BufferGeometry | null {
  if (hoverTarget?.kind !== 'face') {
    return null;
  }

  const face = renderGeometry.faces.find((candidate) => candidate.id === hoverTarget.faceId);

  return face ? createFaceGeometry(renderGeometry.vertices, [face]) : null;
}

function createHoverEdgeGeometry(
  renderGeometry: CellRenderGeometry,
  hoverTarget: InspectionHoverTarget | null,
): THREE.BufferGeometry | null {
  if (hoverTarget?.kind !== 'edge') {
    return null;
  }

  const [a, b] = hoverTarget.vertexIds;

  if (!facesContainEdge(renderGeometry.faces, a, b)) {
    return null;
  }

  const vertexById = new Map(renderGeometry.vertices.map((vertex) => [vertex.id, vertex]));
  const vertexA = vertexById.get(a);
  const vertexB = vertexById.get(b);

  if (!vertexA || !vertexB) {
    return null;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([...vertexA.position, ...vertexB.position], 3),
  );

  return geometry;
}

function facesContainEdge(faces: RenderFace[], a: string, b: string): boolean {
  return faces.some((face) => faceContainsVertexPair(face.vertexIds, a, b));
}

function edgeBelongsToCell(shape: Shape, cell: Cell, [a, b]: [string, string]): boolean {
  return facesForCell(shape, cell).some((face) => faceContainsVertexPair(face.vertexIds, a, b));
}

function faceContainsVertexPair(vertexIds: string[], a: string, b: string): boolean {
  return vertexIds.some((vertexId, index) => {
    const nextVertexId = vertexIds[(index + 1) % vertexIds.length];

    return (vertexId === a && nextVertexId === b) || (vertexId === b && nextVertexId === a);
  });
}

function getVertexGenerations(shape: Shape): Map<VertexId, number> {
  const cache = new Map<VertexId, number>();
  const visiting = new Set<VertexId>();
  const fallbackGenerations = getContainingCellGenerationFallbacks(shape);

  const resolveGeneration = (vertexId: VertexId): number => {
    const cached = cache.get(vertexId);

    if (cached !== undefined) {
      return cached;
    }

    if (visiting.has(vertexId)) {
      return fallbackGenerations.get(vertexId) ?? 0;
    }

    const vertex = shape.vertices[vertexId];

    if (!vertex) {
      return fallbackGenerations.get(vertexId) ?? 0;
    }

    if (vertex.createdBy.operation === 'seed') {
      cache.set(vertexId, 0);
      return 0;
    }

    visiting.add(vertexId);

    const sourceVertexIds = getVertexSourceIds(vertex);
    const sourceGenerations = sourceVertexIds
      .filter((sourceVertexId) => sourceVertexId !== vertexId && shape.vertices[sourceVertexId])
      .map(resolveGeneration);
    const generation = sourceGenerations.length
      ? Math.max(...sourceGenerations) + 1
      : fallbackGenerations.get(vertexId) ?? 0;

    visiting.delete(vertexId);
    cache.set(vertexId, generation);

    return generation;
  };

  Object.keys(shape.vertices).forEach((vertexId) => resolveGeneration(vertexId));

  return cache;
}

function getVertexSourceIds(vertex: Vertex): VertexId[] {
  if (vertex.createdBy.sourceVertexIds.length) {
    return vertex.createdBy.sourceVertexIds;
  }

  return (
    vertex.data.lineage?.sources
      .filter((source) => source.kind === 'vertex')
      .map((source) => source.id) ?? []
  );
}

function getContainingCellGenerationFallbacks(shape: Shape): Map<VertexId, number> {
  const generations = new Map<VertexId, number>();

  for (const cell of shape.cells) {
    for (const vertexId of cell.vertexIds) {
      const existing = generations.get(vertexId);

      if (existing === undefined || cell.generationDepth < existing) {
        generations.set(vertexId, cell.generationDepth);
      }
    }
  }

  return generations;
}

function getVertexMarkerScale(
  generation: number,
  {
    isSelected,
    isHovered,
    cellIsSelected,
    cellIsHovered,
  }: {
    isSelected: boolean;
    isHovered: boolean;
    cellIsSelected: boolean;
    cellIsHovered: boolean;
  },
): number {
  const baseScale = getVertexGenerationScale(generation);
  const emphasisScale = isSelected
    ? 1.8
    : isHovered
      ? 1.45
      : cellIsSelected
        ? 1.18
        : cellIsHovered
          ? 1.1
          : 1;
  const minimumScale = isSelected ? 0.72 : isHovered ? 0.58 : 0;

  return Math.max(baseScale * emphasisScale, minimumScale);
}

function getVertexGenerationScale(generation: number): number {
  if (generation <= 0) {
    return 1;
  }

  if (generation === 1) {
    return 0.75;
  }

  if (generation === 2) {
    return 0.56;
  }

  if (generation === 3) {
    return 0.42;
  }

  return 0.34;
}

function facesForCell(shape: Shape, cell: Cell): Face[] {
  const faceIds = new Set(cell.faceIds);

  return shape.faces.filter((face) => faceIds.has(face.id));
}

function isCellVisible(cell: Cell, visibility: CellVisibility): boolean {
  if (cell.kind === 'core') {
    return visibility.showCoreCells;
  }

  if (cell.kind === 'residue') {
    return visibility.showResidueCells;
  }

  if (cell.kind === 'parent') {
    return visibility.showParentCells;
  }

  return true;
}

function computeCellDisplayOffsets(shape: Shape, explodeAmount: number): Map<string, Vec3> {
  const offsets = new Map<string, Vec3>();

  if (explodeAmount <= 0) {
    shape.cells.forEach((cell) => offsets.set(cell.id, [0, 0, 0]));
    return offsets;
  }

  const cellById = new Map(shape.cells.map((cell) => [cell.id, cell]));
  const metrics = computeCellLayoutMetrics(shape);
  const childrenByParent = buildChildrenByParent(shape);
  const visiting = new Set<string>();

  const offsetForCell = (cell: Cell): Vec3 => {
    const existing = offsets.get(cell.id);

    if (existing) {
      return existing;
    }

    if (visiting.has(cell.id)) {
      return [0, 0, 0];
    }

    visiting.add(cell.id);

    const parentCell = cell.parentCellId ? cellById.get(cell.parentCellId) : null;

    if (!parentCell) {
      offsets.set(cell.id, [0, 0, 0]);
      visiting.delete(cell.id);
      return [0, 0, 0];
    }

    const parentOffset = offsetForCell(parentCell);
    const siblings = childrenByParent.get(parentCell.id) ?? [cell];
    const siblingDirections = computeSiblingLayoutDirections(parentCell, siblings, metrics);
    const direction =
      siblingDirections.get(cell.id) ?? fallbackDirection(`${parentCell.id}:${cell.id}`);
    const distance = computeExplodeDistance(
      parentCell,
      cell,
      siblings.length,
      metrics,
      explodeAmount,
    );
    const offset = addVec3(parentOffset, scaleVec3(direction, distance));

    offsets.set(cell.id, offset);
    visiting.delete(cell.id);

    return offset;
  };

  shape.cells.forEach(offsetForCell);

  return offsets;
}

interface CellLayoutMetric {
  centroid: Vec3;
  radius: number;
}

interface SiblingDirection {
  cell: Cell;
  direction: Vec3;
  anchorDirection: Vec3;
  fallbackDirection: Vec3;
  hasCentroidDirection: boolean;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const MIN_LAYOUT_RADIUS = 0.04;

function computeCellLayoutMetrics(shape: Shape): Map<string, CellLayoutMetric> {
  return new Map(
    shape.cells.map((cell) => {
      const centroid = cellCentroid(shape, cell);

      return [
        cell.id,
        {
          centroid,
          radius: cellRadius(shape, cell, centroid),
        },
      ];
    }),
  );
}

function buildChildrenByParent(shape: Shape): Map<string, Cell[]> {
  const childrenByParent = new Map<string, Cell[]>();

  for (const cell of shape.cells) {
    if (!cell.parentCellId) {
      continue;
    }

    childrenByParent.set(cell.parentCellId, [
      ...(childrenByParent.get(cell.parentCellId) ?? []),
      cell,
    ]);
  }

  for (const children of childrenByParent.values()) {
    children.sort(compareCellsForLayout);
  }

  return childrenByParent;
}

function computeSiblingLayoutDirections(
  parentCell: Cell,
  siblings: Cell[],
  metrics: Map<string, CellLayoutMetric>,
): Map<string, Vec3> {
  const orderedSiblings = [...siblings].sort(compareCellsForLayout);
  const parentMetric = getCellLayoutMetric(metrics, parentCell);
  const initialDirections = orderedSiblings.map<SiblingDirection>((cell, index) => {
    const cellMetric = getCellLayoutMetric(metrics, cell);
    const centroidDelta = subtractVec3(cellMetric.centroid, parentMetric.centroid);
    const centroidDistance = lengthVec3(centroidDelta);
    const usefulDirectionDistance = Math.max(
      0.0001,
      Math.max(parentMetric.radius, cellMetric.radius, MIN_LAYOUT_RADIUS) * 0.025,
    );
    const fallback = siblingFallbackDirection(parentCell, cell, index, orderedSiblings.length);
    const hasCentroidDirection = centroidDistance > usefulDirectionDistance;
    const direction = hasCentroidDirection
      ? scaleVec3(centroidDelta, 1 / centroidDistance)
      : fallback;

    return {
      cell,
      direction,
      anchorDirection: direction,
      fallbackDirection: fallback,
      hasCentroidDirection,
    };
  });

  return new Map(
    spreadSiblingDirections(initialDirections).map(({ cell, direction }) => [cell.id, direction]),
  );
}

function spreadSiblingDirections(directions: SiblingDirection[]): SiblingDirection[] {
  if (directions.length <= 1) {
    return directions;
  }

  const minimumDot = Math.cos(minimumSiblingAngle(directions.length));
  const spreadDirections = directions.map((entry) => ({
    ...entry,
    direction: normalizeVec3(entry.direction, entry.fallbackDirection),
  }));

  for (let iteration = 0; iteration < 10; iteration += 1) {
    for (let aIndex = 0; aIndex < spreadDirections.length; aIndex += 1) {
      for (let bIndex = aIndex + 1; bIndex < spreadDirections.length; bIndex += 1) {
        const a = spreadDirections[aIndex];
        const b = spreadDirections[bIndex];
        const dot = dotVec3(a.direction, b.direction);

        if (dot <= minimumDot) {
          continue;
        }

        const pushStrength = Math.min(0.42, (dot - minimumDot) * 0.5);
        const pairSeed = `${a.cell.id}:${b.cell.id}:${iteration}`;
        const pushA = tangentAwayDirection(
          a.direction,
          b.direction,
          fallbackDirection(`spread:${pairSeed}:a`),
        );
        const pushB = tangentAwayDirection(
          b.direction,
          a.direction,
          scaleVec3(pushA, -1),
        );

        a.direction = normalizeVec3(
          addVec3(a.direction, scaleVec3(pushA, pushStrength)),
          a.fallbackDirection,
        );
        b.direction = normalizeVec3(
          addVec3(b.direction, scaleVec3(pushB, pushStrength)),
          b.fallbackDirection,
        );
      }
    }

    for (const entry of spreadDirections) {
      if (!entry.hasCentroidDirection) {
        continue;
      }

      entry.direction = normalizeVec3(
        addVec3(scaleVec3(entry.direction, 0.975), scaleVec3(entry.anchorDirection, 0.025)),
        entry.fallbackDirection,
      );
    }
  }

  return spreadDirections;
}

function computeExplodeDistance(
  parentCell: Cell,
  cell: Cell,
  siblingCount: number,
  metrics: Map<string, CellLayoutMetric>,
  explodeAmount: number,
): number {
  const parentRadius = Math.max(getCellLayoutMetric(metrics, parentCell).radius, MIN_LAYOUT_RADIUS);
  const cellRadiusValue = Math.max(getCellLayoutMetric(metrics, cell).radius, MIN_LAYOUT_RADIUS);
  const generationDepth = Math.max(0, cell.generationDepth);
  const siblingPressure = Math.sqrt(Math.max(0, siblingCount - 1));
  const radiusClearance = parentRadius * 0.32 + cellRadiusValue * 0.95;
  const siblingClearance = Math.max(parentRadius, cellRadiusValue) * 0.11 * siblingPressure;
  const generationClearance = (parentRadius + cellRadiusValue) * 0.08 * generationDepth;
  const generationScale = 1 + generationDepth * 0.18;
  const siblingScale = 1 + Math.log2(Math.max(1, siblingCount)) * 0.1;
  const kindScale = cell.kind === 'core' ? 1.06 : 1;

  return (
    explodeAmount *
    (radiusClearance + siblingClearance + generationClearance) *
    generationScale *
    siblingScale *
    kindScale
  );
}

function getCellLayoutMetric(
  metrics: Map<string, CellLayoutMetric>,
  cell: Cell,
): CellLayoutMetric {
  return metrics.get(cell.id) ?? { centroid: [0, 0, 0], radius: 0 };
}

function cellCentroid(shape: Shape, cell: Cell): Vec3 {
  const positions = cell.vertexIds
    .map((vertexId) => shape.vertices[vertexId]?.position)
    .filter((position): position is Vec3 => Boolean(position));

  if (!positions.length) {
    return [0, 0, 0];
  }

  const sum = positions.reduce<Vec3>(
    (accumulator, position) => [
      accumulator[0] + position[0],
      accumulator[1] + position[1],
      accumulator[2] + position[2],
    ],
    [0, 0, 0],
  );

  return scaleVec3(sum, 1 / positions.length);
}

function cellRadius(shape: Shape, cell: Cell, centroid: Vec3): number {
  return cell.vertexIds.reduce((radius, vertexId) => {
    const position = shape.vertices[vertexId]?.position;

    if (!position) {
      return radius;
    }

    return Math.max(radius, lengthVec3(subtractVec3(position, centroid)));
  }, 0);
}

function compareCellsForLayout(a: Cell, b: Cell): number {
  return (
    a.generationDepth - b.generationDepth ||
    cellKindLayoutOrder(a) - cellKindLayoutOrder(b) ||
    (a.topology ?? '').localeCompare(b.topology ?? '') ||
    a.id.localeCompare(b.id)
  );
}

function cellKindLayoutOrder(cell: Cell): number {
  if (cell.kind === 'core') {
    return 0;
  }

  if (cell.kind === 'residue') {
    return 1;
  }

  if (cell.kind === 'parent') {
    return 2;
  }

  return 3;
}

function siblingFallbackDirection(
  parentCell: Cell,
  cell: Cell,
  index: number,
  siblingCount: number,
): Vec3 {
  if (siblingCount <= 1) {
    return fallbackDirection(`${parentCell.id}:${cell.id}`);
  }

  const seed = `${parentCell.id}:${cell.id}:${index}:${siblingCount}`;
  const z = 1 - (2 * (index + 0.5)) / siblingCount;
  const radius = Math.sqrt(Math.max(0, 1 - z * z));
  const angle = index * GOLDEN_ANGLE + stableAngle(seed);

  return normalizeVec3(
    [Math.cos(angle) * radius, z, Math.sin(angle) * radius],
    fallbackDirection(seed),
  );
}

function minimumSiblingAngle(siblingCount: number): number {
  if (siblingCount <= 2) {
    return Math.PI / 3;
  }

  return Math.max(Math.PI / 9, Math.min(Math.PI / 2.4, 2.1 / Math.sqrt(siblingCount)));
}

function tangentAwayDirection(direction: Vec3, awayFrom: Vec3, fallback: Vec3): Vec3 {
  const projected = subtractVec3(direction, scaleVec3(awayFrom, dotVec3(direction, awayFrom)));

  return normalizeVec3(projected, perpendicularDirection(direction, fallback));
}

function perpendicularDirection(axis: Vec3, fallback: Vec3): Vec3 {
  const axisUnit = normalizeVec3(axis, [1, 0, 0]);
  const projected = subtractVec3(fallback, scaleVec3(axisUnit, dotVec3(fallback, axisUnit)));

  return normalizeVec3(projected, Math.abs(axisUnit[0]) < 0.8 ? [1, 0, 0] : [0, 1, 0]);
}

function subtractVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function addVec3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scaleVec3([x, y, z]: Vec3, scale: number): Vec3 {
  return [x * scale, y * scale, z * scale];
}

function lengthVec3(vector: Vec3): number {
  return Math.hypot(vector[0], vector[1], vector[2]);
}

function dotVec3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function normalizeVec3(vector: Vec3, fallback: Vec3): Vec3 {
  const length = lengthVec3(vector);

  if (length < 0.0001) {
    const fallbackLength = lengthVec3(fallback);

    return fallbackLength < 0.0001 ? [1, 0, 0] : scaleVec3(fallback, 1 / fallbackLength);
  }

  return scaleVec3(vector, 1 / length);
}

function stableAngle(seed: string): number {
  return (hashString(seed) / 4294967295) * Math.PI * 2;
}

function fallbackDirection(seed: string): Vec3 {
  const hash = hashString(seed);
  const angle = (hash / 4294967295) * Math.PI * 2;
  const z = (((hash >>> 8) % 2000) / 1000 - 1) * 0.35;

  return normalizeVec3([Math.cos(angle), Math.sin(angle), z], [1, 0, 0]);
}

function hashString(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 2654435761);
  }

  return hash >>> 0;
}

function isCellHoverTarget(target: InspectionHoverTarget | null, cellId: string): boolean {
  return target?.kind === 'cell' && target.cellId === cellId;
}

function isVertexHoverTarget(target: InspectionHoverTarget | null, vertexId: string): boolean {
  if (!target) {
    return false;
  }

  if (target.kind === 'vertex') {
    return target.vertexId === vertexId;
  }

  return target.kind === 'edge' && target.vertexIds.includes(vertexId);
}

function formatHoverStatus(shape: Shape, target: InspectionHoverTarget | null): string {
  if (!target) {
    return 'Hover a cell or inspector row to preview correspondence';
  }

  if (target.kind === 'cell') {
    const cell = shape.cells.find((candidate) => candidate.id === target.cellId);

    return cell
      ? `Hovering ${cell.kind} cell, generation ${cell.generationDepth}`
      : 'Hovering cell';
  }

  if (target.kind === 'vertex') {
    return `Hovering vertex ${shortenSceneId(target.vertexId)}`;
  }

  if (target.kind === 'edge') {
    return `Hovering edge ${shortenSceneId(target.vertexIds[0])} - ${shortenSceneId(
      target.vertexIds[1],
    )}`;
  }

  return `Hovering face ${shortenSceneId(target.faceId)}`;
}

function shortenSceneId(id: string): string {
  return id.length > 30 ? `${id.slice(0, 14)}...${id.slice(-8)}` : id;
}

function cellStyle(
  cell: Cell,
  isSelected: boolean,
  isHovered: boolean,
  isDimmed: boolean,
  explodeAmount: number,
  mode: CellRenderGeometry['mode'],
) {
  if (isSelected) {
    return {
      faceColor: mode === 'dual-proxy' ? '#c084fc' : '#f59e0b',
      faceOpacity: cell.kind === 'parent' ? 0.16 : 0.42,
      edgeColor: mode === 'dual-proxy' ? '#f5d0fe' : '#fef3c7',
      edgeOpacity: 1,
    };
  }

  if (isHovered) {
    return {
      faceColor: mode === 'dual-proxy' ? '#d8b4fe' : '#fcd34d',
      faceOpacity: cell.kind === 'parent' ? 0.14 : 0.4,
      edgeColor: mode === 'dual-proxy' ? '#f5d0fe' : '#fef3c7',
      edgeOpacity: 0.98,
    };
  }

  if (isDimmed) {
    return {
      faceColor: mode === 'dual-proxy' ? '#6d28d9' : '#57534e',
      faceOpacity: 0.045,
      edgeColor: mode === 'dual-proxy' ? '#c4b5fd' : '#a8a29e',
      edgeOpacity: 0.14,
    };
  }

  if (mode === 'dual-proxy') {
    return {
      faceColor: '#c084fc',
      faceOpacity: 0.34,
      edgeColor: '#f5d0fe',
      edgeOpacity: 0.9,
    };
  }

  if (mode === 'dual-unsupported') {
    return {
      faceColor: '#78716c',
      faceOpacity: cell.kind === 'parent' ? 0.04 : 0.12,
      edgeColor: '#d6d3d1',
      edgeOpacity: 0.32,
    };
  }

  if (cell.kind === 'core') {
    return {
      faceColor: '#67e8f9',
      faceOpacity: 0.36,
      edgeColor: '#cffafe',
      edgeOpacity: 0.9,
    };
  }

  if (cell.kind === 'residue') {
    return {
      faceColor: '#fbbf24',
      faceOpacity: 0.28,
      edgeColor: '#fde68a',
      edgeOpacity: 0.82,
    };
  }

  if (cell.kind === 'parent') {
    return {
      faceColor: '#a8a29e',
      faceOpacity: explodeAmount > 0 ? 0.035 : 0.08,
      edgeColor: '#fafaf9',
      edgeOpacity: explodeAmount > 0 ? 0.18 : 0.38,
    };
  }

  return {
    faceColor: '#d6d3d1',
    faceOpacity: 0.32,
    edgeColor: '#fafaf9',
    edgeOpacity: 0.72,
  };
}
