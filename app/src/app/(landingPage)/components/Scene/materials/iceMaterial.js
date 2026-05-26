import * as THREE from "three";

function softenTexture(texture, anisotropy = 16) {
  if (!texture) return null;
  texture.generateMipmaps = true;
  // Trilinear filtering avoids visible mip-step pixel blocks on grazing angles.
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;
  return texture;
}

export function createIceMaterial(sourceMaterial) {
  const map = softenTexture(sourceMaterial?.map ?? null);
  const normalMap = softenTexture(sourceMaterial?.normalMap ?? null);
  const roughnessMap = softenTexture(sourceMaterial?.roughnessMap ?? null);
  const metalnessMap = softenTexture(sourceMaterial?.metalnessMap ?? null);
  const aoMap = softenTexture(sourceMaterial?.aoMap ?? null);
  const displacementMap = softenTexture(sourceMaterial?.displacementMap ?? null);
  const alphaMap = softenTexture(sourceMaterial?.alphaMap ?? null);

  const material = new THREE.MeshPhysicalMaterial({
    map,
    normalMap,
    roughnessMap,
    metalnessMap,
    aoMap,
    displacementMap,
    alphaMap,
    normalScale: new THREE.Vector2(2.2, 2.2),
    transmission: 1,
    thickness: 1.8,
    roughness: 0.6,
    metalness: 0,
    envMapIntensity: 1.5,
    clearcoat: 0.21,
    clearcoatRoughness: 0.14,
    clearcoatNormalMap: normalMap,
    clearcoatNormalScale: new THREE.Vector2(2.8, 2.8),
    ior: 1.5,
    transparent: true,
  });

  return material;
}
