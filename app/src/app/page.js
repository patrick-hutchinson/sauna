"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";

export default function Home() {
  const mountRef = useRef(null);
  const applyMaterialModeRef = useRef(() => {});
  const [status, setStatus] = useState("Loading model...");
  const [materialMode, setMaterialMode] = useState("blender");

  useEffect(() => {
    if (!mountRef.current) {
      return;
    }

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e1114);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environmentMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    const glassEnvScene = new THREE.Scene();
    const glassAmbient = new THREE.AmbientLight(0xffffff, 0.55);
    glassEnvScene.add(glassAmbient);
    const glassPanelGeo = new THREE.PlaneGeometry(10, 6);
    const glassPanelMatA = new THREE.MeshBasicMaterial({ color: 0xf7fbff });
    const glassPanelMatB = new THREE.MeshBasicMaterial({ color: 0xdbe4ef });
    const glassPanelTop = new THREE.Mesh(glassPanelGeo, glassPanelMatA);
    glassPanelTop.position.set(0, 4.5, -1.5);
    glassPanelTop.rotation.x = Math.PI * -0.2;
    glassEnvScene.add(glassPanelTop);
    const glassPanelLeft = new THREE.Mesh(glassPanelGeo, glassPanelMatB);
    glassPanelLeft.position.set(-5.5, 0.8, -1.2);
    glassPanelLeft.rotation.y = Math.PI * 0.3;
    glassEnvScene.add(glassPanelLeft);
    const glassPanelRight = new THREE.Mesh(glassPanelGeo, glassPanelMatB);
    glassPanelRight.position.set(5.5, 0.8, -1.2);
    glassPanelRight.rotation.y = Math.PI * -0.3;
    glassEnvScene.add(glassPanelRight);
    const glassEnvironmentMap = pmremGenerator.fromScene(glassEnvScene, 0.045).texture;
    const referenceEnvScene = new THREE.Scene();
    const referenceAmbient = new THREE.AmbientLight(0xffffff, 0.22);
    referenceEnvScene.add(referenceAmbient);
    const referencePanelGeo = new THREE.PlaneGeometry(12, 7);
    const referencePanelBright = new THREE.Mesh(
      referencePanelGeo,
      new THREE.MeshBasicMaterial({ color: 0xe7ebef }),
    );
    referencePanelBright.position.set(-4.8, 0.4, -1.8);
    referencePanelBright.rotation.y = Math.PI * 0.23;
    referenceEnvScene.add(referencePanelBright);
    const referencePanelDim = new THREE.Mesh(
      referencePanelGeo,
      new THREE.MeshBasicMaterial({ color: 0x7e8792 }),
    );
    referencePanelDim.position.set(5.4, -0.2, -2.2);
    referencePanelDim.rotation.y = Math.PI * -0.26;
    referenceEnvScene.add(referencePanelDim);
    const referenceEnvironmentMap = pmremGenerator.fromScene(referenceEnvScene, 0.05).texture;
    scene.environment = environmentMap;

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(2.5, 2, 4.5);
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const filmPass = new FilmPass(0.2, 0.12, 700, false);
    composer.addPass(filmPass);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.screenSpacePanning = false;
    controls.target.set(0, 0, 0);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x88b6ff, 0.5);
    fillLight.position.set(-6, 4, -5);
    scene.add(fillLight);
    const backLightTarget = new THREE.Object3D();
    scene.add(backLightTarget);
    const backLight = new THREE.SpotLight(0xe6eef7, 4.4, 0, Math.PI / 5.2, 0.45, 1.4);
    backLight.target = backLightTarget;
    scene.add(backLight);
    const frostedBoostTarget = new THREE.Object3D();
    scene.add(frostedBoostTarget);
    const frostedBoostLight = new THREE.SpotLight(0xffffff, 8.8, 0, Math.PI / 4.2, 0.35, 1.2);
    frostedBoostLight.visible = false;
    frostedBoostLight.target = frostedBoostTarget;
    scene.add(frostedBoostLight);
    const glassBoostTarget = new THREE.Object3D();
    scene.add(glassBoostTarget);
    const glassBoostLight = new THREE.SpotLight(0xffffff, 10.5, 0, Math.PI / 4.8, 0.32, 1.2);
    glassBoostLight.visible = false;
    glassBoostLight.target = glassBoostTarget;
    scene.add(glassBoostLight);
    const referenceBackTarget = new THREE.Object3D();
    scene.add(referenceBackTarget);
    const referenceBackLight = new THREE.SpotLight(0xffffff, 13.5, 0, Math.PI / 4.1, 0.34, 1.15);
    referenceBackLight.visible = false;
    referenceBackLight.target = referenceBackTarget;
    scene.add(referenceBackLight);
    const referenceRimTarget = new THREE.Object3D();
    scene.add(referenceRimTarget);
    const referenceRimLight = new THREE.SpotLight(0xdfe6ef, 6.2, 0, Math.PI / 5.5, 0.45, 1.3);
    referenceRimLight.visible = false;
    referenceRimLight.target = referenceRimTarget;
    scene.add(referenceRimLight);

    let fittedModelSize = null;
    let fittedModelCenter = new THREE.Vector3(0, 0, 0);
    const morphTargets = [];
    const clock = new THREE.Clock();
    const materialTargets = [];

    const createFrostTexture = ({
      size = 256,
      base = 0.55,
      variation = 0.35,
      clusterChance = 0.86,
      clusterBoost = 0.55,
      repeat = 5,
    } = {}) => {
      const data = new Uint8Array(size * size * 4);
      for (let i = 0; i < size * size; i += 1) {
        const grain = Math.random();
        const clusters = Math.random() > clusterChance ? Math.random() * clusterBoost : 0;
        const value = Math.min(1, base + grain * variation + clusters);
        const channel = Math.floor(value * 255);
        const index = i * 4;
        data[index] = channel;
        data[index + 1] = channel;
        data[index + 2] = channel;
        data[index + 3] = 255;
      }

      const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeat, repeat);
      texture.needsUpdate = true;
      return texture;
    };

    const frostRoughnessMap = createFrostTexture();
    const frostBumpMap = createFrostTexture();
    const frostRoughnessMap2 = createFrostTexture({
      base: 0.54,
      variation: 0.2,
      clusterChance: 0.9,
      clusterBoost: 0.22,
      repeat: 6,
    });
    const frostBumpMap2 = createFrostTexture({
      base: 0.5,
      variation: 0.22,
      clusterChance: 0.9,
      clusterBoost: 0.24,
      repeat: 6,
    });
    const frostDisplacementMap = createFrostTexture({
      base: 0.46,
      variation: 0.44,
      clusterChance: 0.82,
      clusterBoost: 0.62,
      repeat: 10,
    });
    const frostedGlassRoughnessMap = createFrostTexture({
      base: 0.62,
      variation: 0.26,
      clusterChance: 0.92,
      clusterBoost: 0.18,
      repeat: 9,
    });
    const frostedGlassBumpMap = createFrostTexture({
      base: 0.58,
      variation: 0.2,
      clusterChance: 0.93,
      clusterBoost: 0.16,
      repeat: 11,
    });
    const glassRoughnessMap = createFrostTexture({
      base: 0.65,
      variation: 0.08,
      clusterChance: 0.96,
      clusterBoost: 0.08,
      repeat: 4,
    });
    const glassBumpMap = createFrostTexture({
      base: 0.5,
      variation: 0.06,
      clusterChance: 0.97,
      clusterBoost: 0.06,
      repeat: 5,
    });
    const referenceRoughnessMap = createFrostTexture({
      base: 0.5,
      variation: 0.28,
      clusterChance: 0.86,
      clusterBoost: 0.3,
      repeat: 10,
    });
    const referenceBumpMap = createFrostTexture({
      base: 0.5,
      variation: 0.22,
      clusterChance: 0.88,
      clusterBoost: 0.24,
      repeat: 12,
    });
    const referenceDisplacementMap = createFrostTexture({
      base: 0.46,
      variation: 0.32,
      clusterChance: 0.84,
      clusterBoost: 0.36,
      repeat: 11,
    });

    const customIceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe5e7ea,
      roughness: 0.84,
      metalness: 0.0,
      transmission: 0.78,
      ior: 1.16,
      thickness: 1.2,
      transparent: true,
      opacity: 1.0,
      clearcoat: 0.04,
      clearcoatRoughness: 0.9,
      attenuationColor: new THREE.Color(0xf0f2f5),
      attenuationDistance: 2.8,
      envMapIntensity: 0.75,
      specularIntensity: 0.45,
      roughnessMap: frostRoughnessMap,
      bumpMap: frostBumpMap,
      bumpScale: 0.045,
      displacementMap: frostDisplacementMap,
      displacementScale: 0.006,
      displacementBias: -0.0025,
    });

    const customIceMaterial2 = new THREE.MeshPhysicalMaterial({
      color: 0xe9ecef,
      roughness: 0.93,
      metalness: 0.0,
      transmission: 0.5,
      ior: 0.95,
      thickness: 0.2,
      transparent: true,
      opacity: 1.0,
      clearcoat: 0.3,
      clearcoatRoughness: 1.0,
      attenuationColor: new THREE.Color(0xe8ebef),
      attenuationDistance: 1.35,
      envMapIntensity: 0.42,
      specularIntensity: 0.18,
      roughnessMap: frostRoughnessMap2,
      bumpMap: frostBumpMap2,
      bumpScale: 0.052,
      displacementMap: frostDisplacementMap,
      displacementScale: 0.009,
      displacementBias: -0.0038,
    });
    const frostedGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf7fbff,
      roughness: 0.78,
      metalness: 0.0,
      transmission: 0.96,
      ior: 1.5,
      thickness: 1.1,
      transparent: true,
      opacity: 1.0,
      clearcoat: 0.12,
      clearcoatRoughness: 0.82,
      attenuationColor: new THREE.Color(0xf4f8ff),
      attenuationDistance: 2.1,
      envMapIntensity: 0.95,
      specularIntensity: 0.72,
      roughnessMap: frostedGlassRoughnessMap,
      bumpMap: frostedGlassBumpMap,
      bumpScale: 0.028,
      displacementMap: frostDisplacementMap,
      displacementScale: 0.0035,
      displacementBias: -0.0014,
    });
    const refractionMaterial1 = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.08,
      transmission: 1.0,
      ior: 1.52,
      thickness: 1.6,
      attenuationColor: new THREE.Color(0xf8fbff),
      attenuationDistance: 3.8,
      envMap: glassEnvironmentMap,
      envMapIntensity: 1.35,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      specularIntensity: 1.0,
      specularColor: new THREE.Color(0xffffff),
      roughnessMap: glassRoughnessMap,
      bumpMap: glassBumpMap,
      bumpScale: 0.006,
    });
    const referenceIceMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd9dde2,
      metalness: 0.0,
      roughness: 0.82,
      transmission: 0.88,
      ior: 1.22,
      thickness: 2.8,
      attenuationColor: new THREE.Color(0xc8ced6),
      attenuationDistance: 0.7,
      clearcoat: 0.04,
      clearcoatRoughness: 0.9,
      envMap: referenceEnvironmentMap,
      envMapIntensity: 1.12,
      specularIntensity: 0.4,
      roughnessMap: referenceRoughnessMap,
      bumpMap: referenceBumpMap,
      bumpScale: 0.055,
      displacementMap: referenceDisplacementMap,
      displacementScale: 0.011,
      displacementBias: -0.004,
    });

    const applyMaterialMode = (mode) => {
      const isFrosted = mode === "frosted";
      const isRefraction = mode === "refraction1";
      const isReference = mode === "reference";
      frostedBoostLight.visible = isFrosted;
      glassBoostLight.visible = isRefraction;
      referenceBackLight.visible = isReference;
      referenceRimLight.visible = isReference;
      scene.environment = isReference
        ? referenceEnvironmentMap
        : isRefraction
          ? glassEnvironmentMap
          : environmentMap;
      renderer.toneMappingExposure = isReference ? 0.88 : 1.12;
      for (const target of materialTargets) {
        if (mode === "custom") {
          target.mesh.material = customIceMaterial;
        } else if (mode === "custom2") {
          target.mesh.material = customIceMaterial2;
        } else if (mode === "frosted") {
          target.mesh.material = frostedGlassMaterial;
        } else if (mode === "refraction1") {
          target.mesh.material = refractionMaterial1;
        } else if (mode === "reference") {
          target.mesh.material = referenceIceMaterial;
        } else {
          target.mesh.material = target.originalMaterial;
        }
      }
    };
    applyMaterialModeRef.current = applyMaterialMode;

    const frameCameraToModel = (size, center) => {
      const fillRatio = 0.8;
      const vFov = THREE.MathUtils.degToRad(camera.fov);
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);

      const fitHeightDistance = size.y / (2 * Math.tan(vFov / 2));
      const fitWidthDistance = size.x / (2 * Math.tan(hFov / 2));
      const fitDistance = Math.max(fitHeightDistance, fitWidthDistance);
      const distance = fitDistance / fillRatio;

      camera.position.set(center.x, center.y, center.z + distance);
      camera.near = Math.max(0.01, distance - size.z * 2);
      camera.far = distance + size.z * 4 + 10;
      camera.lookAt(center);
      camera.updateProjectionMatrix();

      controls.target.copy(center);
      controls.minDistance = distance * 0.5;
      controls.maxDistance = distance * 4;
      controls.update();
      backLight.position.set(center.x, center.y + size.y * 0.1, center.z - distance * 1.35);
      backLightTarget.position.copy(center);
      frostedBoostLight.position.set(center.x + size.x * 0.12, center.y + size.y * 0.18, center.z - distance * 0.95);
      frostedBoostTarget.position.set(center.x, center.y, center.z);
      glassBoostLight.position.set(center.x - size.x * 0.15, center.y + size.y * 0.22, center.z - distance * 0.92);
      glassBoostTarget.position.copy(center);
      referenceBackLight.position.set(center.x - size.x * 0.35, center.y + size.y * 0.04, center.z - distance * 1.28);
      referenceBackTarget.position.copy(center);
      referenceRimLight.position.set(center.x + size.x * 0.42, center.y + size.y * 0.27, center.z - distance * 0.72);
      referenceRimTarget.position.set(center.x, center.y + size.y * 0.06, center.z);
    };

    const getVisibleMeshBounds = (root) => {
      const worldBox = new THREE.Box3();
      const tempBox = new THREE.Box3();
      let foundMesh = false;

      root.updateWorldMatrix(true, true);
      root.traverse((object) => {
        if (!object.isMesh || !object.visible || !object.geometry) {
          return;
        }
        const { geometry } = object;
        if (!geometry.boundingBox) {
          geometry.computeBoundingBox();
        }
        if (!geometry.boundingBox) {
          return;
        }

        tempBox.copy(geometry.boundingBox).applyMatrix4(object.matrixWorld);
        if (tempBox.isEmpty()) {
          return;
        }

        if (!foundMesh) {
          worldBox.copy(tempBox);
          foundMesh = true;
          return;
        }
        worldBox.union(tempBox);
      });

      return foundMesh ? worldBox : null;
    };

    const loader = new GLTFLoader();
    loader.load(
      "/assets/models/ice-structure.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.traverse((object) => {
          if (!object.isMesh) {
            return;
          }

          materialTargets.push({
            mesh: object,
            originalMaterial: object.material,
          });

          if (!object.morphTargetDictionary || !object.morphTargetInfluences) {
            return;
          }

          const meltIndex = object.morphTargetDictionary["Melt 01"];
          if (meltIndex === undefined) {
            return;
          }

          object.morphTargetInfluences.fill(0);
          morphTargets.push({
            influences: object.morphTargetInfluences,
            index: meltIndex,
          });
        });

        const initialBounds = getVisibleMeshBounds(model);
        if (!initialBounds) {
          setStatus("Model loaded, but no visible meshes were found.");
          return;
        }
        const size = initialBounds.getSize(new THREE.Vector3());

        const maxAxis = Math.max(size.x, size.y, size.z);
        if (maxAxis > 0) {
          const scale = 2.25 / maxAxis;
          model.scale.setScalar(scale);

          const scaledBounds = getVisibleMeshBounds(model);
          if (!scaledBounds) {
            setStatus("Model loaded, but bounds could not be computed.");
            return;
          }
          const scaledCenter = scaledBounds.getCenter(new THREE.Vector3());
          model.position.sub(scaledCenter);

          const centeredBounds = getVisibleMeshBounds(model);
          if (!centeredBounds) {
            setStatus("Model loaded, but centered bounds could not be computed.");
            return;
          }

          fittedModelSize = centeredBounds.getSize(new THREE.Vector3());
          fittedModelCenter = centeredBounds.getCenter(new THREE.Vector3());
          frameCameraToModel(fittedModelSize, fittedModelCenter);
        }

        setStatus("");
        applyMaterialMode(materialMode);
      },
      undefined,
      (error) => {
        console.error(error);
        setStatus("Failed to load /assets/models/ice-structure.glb");
      },
    );

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) {
        return;
      }
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      composer.setSize(clientWidth, clientHeight);
      if (fittedModelSize) {
        frameCameraToModel(fittedModelSize, fittedModelCenter);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      if (morphTargets.length > 0) {
        const halfCycleSeconds = 10;
        const fullCycleSeconds = halfCycleSeconds * 2;
        const normalized = (clock.getElapsedTime() % fullCycleSeconds) / fullCycleSeconds;
        const meltWeight = 0.5 - 0.5 * Math.cos(normalized * Math.PI * 2);

        for (const target of morphTargets) {
          target.influences[target.index] = meltWeight;
        }
      }

      controls.update();
      composer.render();
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      applyMaterialModeRef.current = () => {};
      customIceMaterial.dispose();
      customIceMaterial2.dispose();
      frostedGlassMaterial.dispose();
      refractionMaterial1.dispose();
      referenceIceMaterial.dispose();
      frostRoughnessMap.dispose();
      frostBumpMap.dispose();
      frostRoughnessMap2.dispose();
      frostBumpMap2.dispose();
      frostedGlassRoughnessMap.dispose();
      frostedGlassBumpMap.dispose();
      glassRoughnessMap.dispose();
      glassBumpMap.dispose();
      referenceRoughnessMap.dispose();
      referenceBumpMap.dispose();
      referenceDisplacementMap.dispose();
      frostDisplacementMap.dispose();
      glassEnvironmentMap.dispose();
      referenceEnvironmentMap.dispose();
      environmentMap.dispose();
      pmremGenerator.dispose();
      composer.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (!object.isMesh) {
          return;
        }
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else if (object.material) {
          object.material.dispose();
        }
      });
    };
  }, []);

  return (
    <main className={styles.page}>
      <div ref={mountRef} className={styles.canvas} />
      {status ? <p className={styles.status}>{status}</p> : null}
      <div className={styles.materialControls}>
        <button
          type="button"
          className={`${styles.materialButton} ${materialMode === "blender" ? styles.active : ""}`}
          onClick={() => {
            setMaterialMode("blender");
            applyMaterialModeRef.current("blender");
          }}
        >
          Blender Texture
        </button>
        <button
          type="button"
          className={`${styles.materialButton} ${materialMode === "custom" ? styles.active : ""}`}
          onClick={() => {
            setMaterialMode("custom");
            applyMaterialModeRef.current("custom");
          }}
        >
          Ice Texture 1
        </button>
        <button
          type="button"
          className={`${styles.materialButton} ${materialMode === "custom2" ? styles.active : ""}`}
          onClick={() => {
            setMaterialMode("custom2");
            applyMaterialModeRef.current("custom2");
          }}
        >
          Ice Texture 2
        </button>
        <button
          type="button"
          className={`${styles.materialButton} ${materialMode === "frosted" ? styles.active : ""}`}
          onClick={() => {
            setMaterialMode("frosted");
            applyMaterialModeRef.current("frosted");
          }}
        >
          Frosted Glass
        </button>
        <button
          type="button"
          className={`${styles.materialButton} ${materialMode === "refraction1" ? styles.active : ""}`}
          onClick={() => {
            setMaterialMode("refraction1");
            applyMaterialModeRef.current("refraction1");
          }}
        >
          Refraction 1
        </button>
        <button
          type="button"
          className={`${styles.materialButton} ${materialMode === "reference" ? styles.active : ""}`}
          onClick={() => {
            setMaterialMode("reference");
            applyMaterialModeRef.current("reference");
          }}
        >
          Reference Ice
        </button>
      </div>
    </main>
  );
}
