import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { View3DBounds } from "./scene";

export interface OrbitCameraRig {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  resize: (width: number, height: number) => void;
  focus: (bounds: View3DBounds | null) => void;
  dispose: () => void;
}

export function createOrbitCamera(domElement: HTMLElement): OrbitCameraRig {
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(8, 7, 8);

  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.enablePan = true;
  controls.minDistance = 2.5;
  controls.maxDistance = 50;
  controls.target.set(0, 1.2, 0);
  controls.update();

  return {
    camera,
    controls,
    resize(width: number, height: number): void {
      const safeWidth = Math.max(width, 1);
      const safeHeight = Math.max(height, 1);

      camera.aspect = safeWidth / safeHeight;
      camera.updateProjectionMatrix();
    },
    focus(bounds: View3DBounds | null): void {
      if (!bounds) {
        controls.target.set(0, 1.2, 0);
        camera.position.set(8, 7, 8);
        camera.lookAt(controls.target);
        controls.update();

        return;
      }

      const centerX = (bounds.minX + bounds.maxX) / 2;
      const centerZ = (bounds.minZ + bounds.maxZ) / 2;
      const spanX = Math.max(bounds.maxX - bounds.minX, 1.6);
      const spanZ = Math.max(bounds.maxZ - bounds.minZ, 1.6);
      const span = Math.max(spanX, spanZ, 3);

      controls.target.set(centerX, Math.max(0.8, bounds.maxY * 0.3), centerZ);
      camera.position.set(
        centerX + span * 0.95,
        Math.max(4.8, bounds.maxY + span * 0.65),
        centerZ + span * 0.95
      );
      camera.far = Math.max(100, span * 24);
      camera.updateProjectionMatrix();
      controls.update();
    },
    dispose(): void {
      controls.dispose();
    }
  };
}
