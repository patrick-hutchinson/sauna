import * as THREE from "three";

export function setupIceLighting(scene, enabled = true) {
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x202020, 0.8);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
  keyLight.position.set(5, 7, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-6, 3, -4);
  scene.add(fillLight);

  const rimTarget = new THREE.Object3D();
  scene.add(rimTarget);

  const rimLight = new THREE.SpotLight(0xffffff, 5.8, 0, Math.PI / 4.5, 0.35, 1.2);
  rimLight.target = rimTarget;
  scene.add(rimLight);

  hemiLight.visible = enabled;
  keyLight.visible = enabled;
  fillLight.visible = enabled;
  rimLight.visible = enabled;

  return {
    hemiLight,
    keyLight,
    fillLight,
    rimLight,
    rimTarget,
  };
}
