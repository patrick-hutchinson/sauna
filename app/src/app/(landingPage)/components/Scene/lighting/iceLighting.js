import * as THREE from "three";

export function setupIceLighting(_scene, enabled = true) {
  // Keep placeholders so shared framing logic can still target positions
  // without requiring active scene lights.
  const hemiLight = null;
  const keyLight = null;
  const fillLight = null;
  const rimTarget = new THREE.Object3D();
  const rimLight = new THREE.Object3D();
  rimTarget.visible = enabled;
  rimLight.visible = enabled;

  return {
    hemiLight,
    keyLight,
    fillLight,
    rimLight,
    rimTarget,
  };
}
