// SceneCameraRig — THE ONE fit/reset camera mechanism (PHASE A, SEAL_PHASE_A_CAMERA:
// "reuse, don't re-invent"). EXTRACTED VERBATIM from the Ambo Workspace3D's
// SceneCameraControls (the request-counter controller over OrbitControls with
// getFitDistance) and PARAMETERIZED so the Ambo keeps its exact behavior
// (every default below is the Ambo's own literal) while the Manuscript rides
// the same mechanism with its plate semantics:
//   · `resetMode: 'bounds'` (Ambo — reset distance scales with the scene) vs
//     `'exact'` (Manuscript — reset returns to the composed default camera);
//   · `fitAttitude` — null keeps the CURRENT view direction (Ambo); a vector
//     flies the fit to a fixed standing attitude (the designer's C1 three-
//     quarter presentation; she gates the numbers after it lands);
//   · `fitMargin` — the fit's breathing room (Ambo 1.15; the Manuscript's
//     plate uses a wider margin so the specimen sits at a legible FRACTION
//     of the frame, not wall-to-wall);
//   · `orbit` — OrbitControls prop overrides (zoomToCursor, mouseButtons,
//     zoomSpeed …) spread over the Ambo's literals.
// A request-counter is consumed AT MOST once (the handled-ref pattern) — the
// caller increments, the controller flies.

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export interface SceneBounds {
  center: [number, number, number];
  radius: number;
}

interface OrbitControlsHandle {
  target: THREE.Vector3;
  update: () => void;
}

// the Ambo's own literals — the extraction changes nothing for it
const DEFAULT_CAMERA_TARGET: [number, number, number] = [0, 0, 0];
const DEFAULT_CAMERA_POSITION: [number, number, number] = [3.2, 2.4, 3.8];
const MIN_CAMERA_DISTANCE = 3.8;

export function getFitDistance(
  camera: THREE.Camera,
  radius: number,
  aspect: number,
  margin = 1.15,
  minDistance = MIN_CAMERA_DISTANCE,
): number {
  if (!(camera instanceof THREE.PerspectiveCamera)) {
    return Math.max(minDistance, radius * 3.1);
  }

  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(0.1, aspect));
  const fitFov = Math.max(0.1, Math.min(verticalFov, horizontalFov));

  return Math.max(minDistance, (radius / Math.sin(fitFov / 2)) * margin);
}

function vec3ToVector([x, y, z]: [number, number, number]): THREE.Vector3 {
  return new THREE.Vector3(x, y, z);
}

export function SceneCameraControls({
  sceneBounds,
  selectedSceneBounds,
  fitViewRequest,
  fitSelectedRequest,
  resetCameraRequest,
  defaults,
  resetMode = 'bounds',
  fitAttitude = null,
  fitMargin = 1.15,
  orbit,
}: {
  sceneBounds: SceneBounds;
  selectedSceneBounds: SceneBounds | null;
  fitViewRequest: number;
  fitSelectedRequest: number;
  resetCameraRequest: number;
  defaults?: { position: [number, number, number]; target: [number, number, number]; minDistance?: number };
  resetMode?: 'bounds' | 'exact';
  fitAttitude?: [number, number, number] | null;
  fitMargin?: number;
  orbit?: React.ComponentProps<typeof OrbitControls>;
}) {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsHandle | null>(null);
  const didInitializeControlsRef = useRef(false);
  const handledFitViewRequestRef = useRef(fitViewRequest);
  const handledFitSelectedRequestRef = useRef(fitSelectedRequest);
  const handledResetCameraRequestRef = useRef(resetCameraRequest);
  const defaultPosition = defaults?.position ?? DEFAULT_CAMERA_POSITION;
  const defaultTarget = defaults?.target ?? DEFAULT_CAMERA_TARGET;
  const minDistance = defaults?.minDistance ?? MIN_CAMERA_DISTANCE;
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

      if (mode === 'reset' && resetMode === 'exact') {
        // the Manuscript's reset — the composed default camera, exactly
        const position = vec3ToVector(defaultPosition);
        const target = vec3ToVector(defaultTarget);
        camera.position.copy(position);
        camera.lookAt(target);
        updateCameraClipping(Math.max(0.5, position.distanceTo(target)));
        if (controls) {
          controls.target.copy(target);
          controls.update();
        }
        return;
      }

      const target = vec3ToVector(bounds.center);
      const radius = Math.max(bounds.radius, 0.5);
      const distance =
        mode === 'fit'
          ? getFitDistance(camera, radius, size.width / Math.max(1, size.height), fitMargin, minDistance)
          : Math.max(minDistance, radius * 3.1);
      const direction =
        mode === 'fit'
          ? fitAttitude
            ? vec3ToVector(fitAttitude)
            : camera.position.clone().sub(controls?.target ?? target)
          : vec3ToVector(defaultPosition).sub(vec3ToVector(defaultTarget));
      const safeDirection =
        direction.lengthSq() > 0.000001
          ? direction.normalize()
          : vec3ToVector(defaultPosition).sub(vec3ToVector(defaultTarget)).normalize();

      camera.position.copy(target.clone().add(safeDirection.multiplyScalar(distance)));
      camera.lookAt(target);
      updateCameraClipping(distance);

      if (controls) {
        controls.target.copy(target);
        controls.update();
      }
    },
    [camera, defaultPosition, defaultTarget, fitAttitude, fitMargin, minDistance, resetMode, size.height, size.width, updateCameraClipping],
  );

  useEffect(() => {
    const controls = controlsRef.current;

    if (!controls || didInitializeControlsRef.current) {
      return;
    }

    controls.target.copy(boundsCenter);
    controls.update();
    didInitializeControlsRef.current = true;
  }, [boundsCenter]);

  useEffect(() => {
    if (fitViewRequest > handledFitViewRequestRef.current) {
      handledFitViewRequestRef.current = fitViewRequest;
      fitCameraToBounds(sceneBounds, 'fit');
    }
  }, [fitCameraToBounds, fitViewRequest, sceneBounds]);

  useEffect(() => {
    if (fitSelectedRequest > handledFitSelectedRequestRef.current) {
      handledFitSelectedRequestRef.current = fitSelectedRequest;
      if (!selectedSceneBounds) {
        return;
      }

      fitCameraToBounds(selectedSceneBounds, 'fit');
    }
  }, [fitCameraToBounds, fitSelectedRequest, selectedSceneBounds]);

  useEffect(() => {
    if (resetCameraRequest > handledResetCameraRequestRef.current) {
      handledResetCameraRequestRef.current = resetCameraRequest;
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
      {...orbit}
    />
  );
}
