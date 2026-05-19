import * as THREE from "three";

export function getVisibleMeshBounds(root) {
  const worldBox = new THREE.Box3();
  const tempBox = new THREE.Box3();
  let foundMesh = false;

  root.updateWorldMatrix(true, true);
  root.traverse((object) => {
    if (!object.isMesh || !object.visible || !object.geometry) return;

    const {geometry} = object;
    if (!geometry.boundingBox) geometry.computeBoundingBox();
    if (!geometry.boundingBox) return;

    tempBox.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld);
    if (tempBox.isEmpty()) return;

    if (!foundMesh) {
      worldBox.copy(tempBox);
      foundMesh = true;
    } else {
      worldBox.union(tempBox);
    }
  });

  return foundMesh ? worldBox : null;
}

export function frameCameraToModel({camera, controls, rimLight, rimTarget, size, center, fillRatio = 1.6}) {
  const vFov = THREE.MathUtils.degToRad(camera.fov);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

  const fitHeightDistance = size.y / (2 * Math.tan(vFov / 2));
  const fitWidthDistance = size.x / (2 * Math.tan(hFov / 2));
  const fitDistance = Math.max(fitHeightDistance, fitWidthDistance);
  const distance = fitDistance / fillRatio;

  camera.position.set(center.x, center.y, center.z + distance);
  camera.near = Math.max(0.01, distance - size.z * 2);
  camera.far = distance + size.z * 4 + 10;
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.minDistance = distance * 0.45;
  controls.maxDistance = distance * 4;
  controls.update();

  rimLight.position.set(center.x - size.x * 0.28, center.y + size.y * 0.08, center.z - distance * 1.25);
  rimTarget.position.copy(center);
}
