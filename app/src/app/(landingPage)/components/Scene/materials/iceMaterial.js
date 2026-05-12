import * as THREE from "three";

export function createIceMaterial(sourceMaterial) {
  const material = new THREE.MeshPhysicalMaterial({
    map: sourceMaterial?.map ?? null,
    normalMap: sourceMaterial?.normalMap ?? null,
    roughnessMap: sourceMaterial?.roughnessMap ?? null,
    metalnessMap: sourceMaterial?.metalnessMap ?? null,
    aoMap: sourceMaterial?.aoMap ?? null,
    displacementMap: sourceMaterial?.displacementMap ?? null,
    alphaMap: sourceMaterial?.alphaMap ?? null,
    normalScale: new THREE.Vector2(3.02, 3.02),
    transmission: 1,
    thickness: 1.8,
    roughness: 0.6,
    metalness: 0,
    envMapIntensity: 1.5,
    clearcoat: 0.21,
    clearcoatRoughness: 0.14,
    clearcoatNormalMap: sourceMaterial?.normalMap ?? null,
    clearcoatNormalScale: new THREE.Vector2(3.78, 3.78),
    ior: 1.5,
    transparent: true,
  });

  return material;
}
