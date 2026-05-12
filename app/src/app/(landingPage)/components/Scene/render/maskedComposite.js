import * as THREE from "three";

export function createMaskedCompositeRenderer() {
  const compositeTarget = new THREE.WebGLRenderTarget(1, 1, {
    depthBuffer: true,
    stencilBuffer: false,
  });

  const compositeScene = new THREE.Scene();
  const compositeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const compositeMaterial = new THREE.MeshBasicMaterial({
    map: compositeTarget.texture,
    depthWrite: false,
    depthTest: false,
    toneMapped: false,
    stencilWrite: true,
    stencilRef: 1,
    stencilFunc: THREE.EqualStencilFunc,
    stencilFail: THREE.KeepStencilOp,
    stencilZFail: THREE.KeepStencilOp,
    stencilZPass: THREE.KeepStencilOp,
  });

  const compositeQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compositeMaterial);
  compositeScene.add(compositeQuad);

  const stencilMaskMaterial = new THREE.MeshBasicMaterial({
    colorWrite: false,
    depthWrite: false,
    depthTest: true,
    stencilWrite: true,
    stencilRef: 1,
    stencilFunc: THREE.AlwaysStencilFunc,
    stencilFail: THREE.KeepStencilOp,
    stencilZFail: THREE.KeepStencilOp,
    stencilZPass: THREE.ReplaceStencilOp,
  });

  return {
    compositeTarget,
    renderMasked(renderer, scene, camera) {
      renderer.setRenderTarget(compositeTarget);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);

      renderer.setRenderTarget(null);
      renderer.clear(true, true, true);
      renderer.clearStencil();

      const savedBackground = scene.background;
      scene.background = null;
      scene.overrideMaterial = stencilMaskMaterial;
      renderer.render(scene, camera);
      scene.overrideMaterial = null;
      scene.background = savedBackground;

      renderer.render(compositeScene, compositeCamera);
    },
    setSize(width, height) {
      compositeTarget.setSize(width, height);
    },
    dispose() {
      compositeTarget.dispose();
      compositeQuad.geometry.dispose();
      compositeMaterial.dispose();
      stencilMaskMaterial.dispose();
    },
  };
}
