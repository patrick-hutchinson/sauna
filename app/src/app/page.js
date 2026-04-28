"use client";

import {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment.js";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import styles from "./page.module.css";

export default function Home() {
  const mountRef = useRef(null);
  const [status, setStatus] = useState("Loading model...");

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090b0f);

    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const environmentMap = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environmentMap;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 0, 5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x2f3340, 0.8);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x9ab6ff, 0.5);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    const rimTarget = new THREE.Object3D();
    scene.add(rimTarget);
    const rimLight = new THREE.SpotLight(0xffffff, 5.8, 0, Math.PI / 4.5, 0.35, 1.2);
    rimLight.target = rimTarget;
    scene.add(rimLight);

    let fittedModelSize = null;
    let fittedModelCenter = new THREE.Vector3();

    const getVisibleMeshBounds = (root) => {
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
    };

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
      camera.updateProjectionMatrix();

      controls.target.copy(center);
      controls.minDistance = distance * 0.45;
      controls.maxDistance = distance * 4;
      controls.update();

      rimLight.position.set(center.x - size.x * 0.28, center.y + size.y * 0.08, center.z - distance * 1.25);
      rimTarget.position.copy(center);
    };

    const loader = new GLTFLoader();
    loader.load(
      "/assets/models/ice-structure-02.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.traverse((object) => {
          if (!object.isMesh) return;
          object.castShadow = false;
          object.receiveShadow = false;
          // Keep embedded Blender materials exactly as authored.
          object.material.needsUpdate = true;
        });

        const initialBounds = getVisibleMeshBounds(model);
        if (!initialBounds) {
          setStatus("Model loaded, but no visible meshes were found.");
          return;
        }

        const size = initialBounds.getSize(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z);
        if (maxAxis > 0) {
          const scale = 2.3 / maxAxis;
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
      },
      undefined,
      (error) => {
        console.error(error);
        setStatus("Failed to load /assets/models/ice-structure-02.glb");
      },
    );

    const resize = () => {
      const {clientWidth, clientHeight} = mount;
      if (!clientWidth || !clientHeight) return;

      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);

      if (fittedModelSize) {
        frameCameraToModel(fittedModelSize, fittedModelCenter);
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      environmentMap.dispose();
      pmremGenerator.dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry?.dispose();
      });
    };
  }, []);

  return (
    <main className={styles.page}>
      <div ref={mountRef} className={styles.canvas} />
      {status ? <p className={styles.status}>{status}</p> : null}
    </main>
  );
}
